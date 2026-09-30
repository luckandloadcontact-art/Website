// Henter månedlig leaderboard-data fra Affilka (Hype.bet) sitt affiliate-API.
// Rangerer spillerne som har spilt under vår affiliate-kode etter hvor mye de har satset (wagered)
// denne måneden, og setter premie basert på plassering.

import { createAdminClient } from '@/lib/supabase'

export interface LeaderboardEntry {
  rank: number
  username: string
  avatar: string | null
  xpPoints: number
  bets: number
  prize: number | null // USD, null = ingen fast premie (f.eks. "Runner-up")
}

export interface LeaderboardData {
  entries: LeaderboardEntry[]
  totalPlayers: number
  periodFrom: string
  periodTo: string
  updatedAt: string
}

// Premier for plass 1-6. Resten av potten ($20) deles ikke ut etter plassering,
// men trekkes tilfeldig blant alle som har spilt solo under koden vår (se leaderboard-siden).
export const PLACEMENT_PRIZES = [500, 200, 100, 80, 60, 40]
export const RANDOM_GIVEAWAY_PRIZE = 20
export const TOTAL_PRIZE_POOL = PLACEMENT_PRIZES.reduce((sum, p) => sum + p, 0) + RANDOM_GIVEAWAY_PRIZE
const TOP_N = 10
const REVALIDATE_SECONDS = 360 // 6 min -- se begrunnelse ved fetchLeaderboardData

function currentMonthRange(now = new Date()) {
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  // "to" sendes som i MORGEN, ikke i dag. Bekreftet empirisk 2026-09-12: når "to" er eksakt
  // dagens dato, ser Affilka ut til å returnere et fastlåst/precomputet svar som ikke
  // oppdaterer seg (bekreftet: én spillers XP sto stille i over en time på tvers av mange
  // ferske kall). Med "to" satt til i morgen får vi konsekvent et friskt tall -- Affilka
  // klemmer uansett datoen ned til nåværende tidspunkt når den peker fremover i tid (se
  // dateRange.to i responsen, som ekko'er tilbake det faktiske spørretidspunktet).
  const to = new Date(now)
  to.setUTCDate(to.getUTCDate() + 1)

  return { from: fmt(from), to: fmt(to) }
}

// Cache-intervallet er satt til 6 min (se REVALIDATE_SECONDS). Affilka-support sa først at
// tallene deres kun regnes ut hver time -- men vi fant en annen Hype-affiliate (Nordicslots)
// hvis side poller live hvert 5. min med suksess og får ferske tall, med samme 5-min cooldown
// som er dokumentert. "Hver time" var altså upresist. 6 min gir litt margin over den reelle
// 5-min-grensen uten å polle unødvendig ofte.
//
// VIKTIG: denne funksjonen må KASTE (throw) ved feil, ikke returnere null -- se getLeaderboardData
// lenger ned for hvorfor.
export async function fetchLeaderboardData(): Promise<LeaderboardData> {
  const apiKey = process.env.AFFILKA_API_KEY
  if (!apiKey) {
    throw new Error('[affilka] AFFILKA_API_KEY er ikke satt')
  }

  const { from, to } = currentMonthRange()

  const res = await fetch('https://api.hype.bet/wallet/api/v1/affiliate/creator/get-stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, from, to }),
    // Selve throttlingen skjer i cache-laget rundt denne funksjonen (se getLeaderboardData),
    // så dette kallet skal alltid gå live når funksjonen faktisk kjører.
    // OBS: ikke test dette endepunktet manuelt mens siden er live, det spiser av samme kvote.
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`[affilka] API-kall feilet: ${res.status} ${body}`)
  }

  const data = await res.json()
  const summarizedBets: Array<{
    user?: { username?: string; avatar?: string | null }
    xpPoints?: number
    bets?: number
  }> = data.summarizedBets ?? []

  // Rangert etter XP, ikke wagered -- XP er vektet av Hype.bet per spill, så det
  // kan ikke "abuses" ved å kjøre store volum på lav-house-edge-spill (f.eks. Hilo).
  const sorted = [...summarizedBets].sort((a, b) => (b.xpPoints ?? 0) - (a.xpPoints ?? 0))

  const entries: LeaderboardEntry[] = sorted.slice(0, TOP_N).map((item, i) => ({
    rank: i + 1,
    username: item.user?.username ?? 'Ukjent spiller',
    avatar: item.user?.avatar ?? null,
    xpPoints: item.xpPoints ?? 0,
    bets: item.bets ?? 0,
    prize: PLACEMENT_PRIZES[i] ?? null,
  }))

  return {
    entries,
    // NB: Affilka sitt eget "totalUsers"-felt betyr nye registreringer i perioden,
    // ikke antall aktive spillere -- bruk lengden på hele listen i stedet.
    totalPlayers: summarizedBets.length,
    periodFrom: from,
    periodTo: to,
    updatedAt: new Date().toISOString(),
  }
}

/** Sant kun på siste dag i inneværende måned (UTC) -- brukes til å avgjøre om det er trygt å
 *  fryse en historikk-snapshot av leaderboardet nå (se captureLeaderboardSnapshot). */
export function isLastDayOfMonthUTC(now = new Date()): boolean {
  const tomorrow = new Date(now)
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  return tomorrow.getUTCMonth() !== now.getUTCMonth()
}

/**
 * Fryser leaderboardet slik det er akkurat nå ned i leaderboard_snapshots, nøkket på måneden
 * (period_from). Kjøres normalt av cron-jobben rett før månedsskiftet -- upsert gjør at flere
 * kjøringer samme dag bare overskriver hverandre, så siste (og dermed mest oppdaterte) forsøk
 * før midnatt UTC vinner. Henter alltid FRISKE tall direkte fra Affilka (ikke modul-cachen
 * over), slik at en manuell "capture nå" fra admin-panelet ikke bare lagrer en gammel verdi.
 */
export async function captureLeaderboardSnapshot(): Promise<LeaderboardData> {
  const data = await fetchLeaderboardData()

  const supabase = createAdminClient()
  const { error } = await supabase.from('leaderboard_snapshots').upsert(
    {
      period_from: data.periodFrom,
      period_to: data.periodTo,
      entries: data.entries,
      total_players: data.totalPlayers,
      captured_at: data.updatedAt,
    },
    { onConflict: 'period_from' }
  )
  if (error) throw new Error(`[affilka] Klarte ikke lagre leaderboard-snapshot: ${error.message}`)

  return data
}

export interface LeaderboardSnapshot {
  periodFrom: string
  periodTo: string
  entries: LeaderboardEntry[]
  totalPlayers: number
  capturedAt: string
}

/** Henter alle lagrede måneds-snapshots, nyeste først -- kun brukt av admin-panelet. */
export async function getLeaderboardSnapshots(): Promise<LeaderboardSnapshot[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('leaderboard_snapshots')
    .select('period_from, period_to, entries, total_players, captured_at')
    .order('period_from', { ascending: false })
  if (error) throw new Error(`[affilka] Klarte ikke hente leaderboard-snapshots: ${error.message}`)

  return (data ?? []).map(row => ({
    periodFrom: row.period_from,
    periodTo: row.period_to,
    entries: row.entries as LeaderboardEntry[],
    totalPlayers: row.total_players,
    capturedAt: row.captured_at,
  }))
}

// Enkel, eksplisitt in-memory cache (modul-nivå variabel) -- brukt i stedet for
// Next sin unstable_cache/fetch-revalidate. Årsak (funnet og bekreftet 2026-09-12): den
// innebygde cachen ser ut til å bruke stale-while-revalidate (vis gammel data med en gang,
// hent ny i bakgrunnen) -- og i et serverless-miljø kan den bakgrunnsjobben bli drept før den
// rekker å lagre det ferske resultatet, slik at cachen sitter fast på gammel data på ubestemt
// tid. Bekreftet i praksis: cron-endepunktet hentet friskt, mens selve siden fortsatt viste
// 12+ min gammel data ved gjentatte besøk rett etterpå.
//
// Denne varianten er 100% eksplisitt: er cachen utløpt, VENTER requesten på et ferskt kall før
// den svarer -- ingen bakgrunnsjobb som kan bli avbrutt. Ulempen er at cachen er per
// server-instans (ikke globalt delt på tvers av Vercel sine regioner/instanser), men det var
// unstable_cache-varianten i praksis heller ikke, så dette gjør ikke ting verre -- bare
// forutsigbart. Bonus: hvis et friskt forsøk feiler (f.eks. rate limit), serveres siste kjente
// gode data i stedet for feilmelding, så lenge vi har hentet noe vellykket tidligere.
let cachedResult: { data: LeaderboardData; fetchedAt: number } | null = null

export async function getLeaderboardData(): Promise<LeaderboardData | null> {
  const isStale = !cachedResult || Date.now() - cachedResult.fetchedAt > REVALIDATE_SECONDS * 1000

  if (!isStale) {
    return cachedResult!.data
  }

  try {
    const fresh = await fetchLeaderboardData()
    cachedResult = { data: fresh, fetchedAt: Date.now() }
    return fresh
  } catch (err) {
    console.error('[affilka] Klarte ikke hente leaderboard', err)
    // Stale-if-error: bedre å vise litt gamle (men ekte) tall enn en feilmelding.
    return cachedResult?.data ?? null
  }
}

// formatXP flyttet til lib/utils.ts (ren funksjon, ingen avhengigheter) -- re-eksporteres her så
// eksisterende importer (f.eks. leaderboard-siden) ikke trenger å endres. VIKTIG: ikke legg til
// flere runtime-importer her uten å tenke gjennom det -- denne fila importerer createAdminClient
// (og dermed next/headers via lib/supabase), og admin-panelet (en client component) importerer
// typer herfra. Next.js nekter å bunte next/headers inn i en client-bundle, så en runtime-import
// fra denne fila inn i en 'use client'-fil feiler hele bygget (skjedde med formatXP 2026-09-30).
export { formatXP } from '@/lib/utils'
