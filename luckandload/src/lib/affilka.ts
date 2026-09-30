// Henter månedlig leaderboard-data fra Affilka (Hype.bet) sitt affiliate-API.
// Rangerer spillerne som har spilt under vår affiliate-kode etter hvor mye de har satset (wagered)
// denne måneden, og setter premie basert på plassering.

import { createAdminClient } from '@/lib/supabase'
import { LEADERBOARD_REVALIDATE_SECONDS } from '@/lib/utils'

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
// Verdien selv bor i lib/utils.ts (se der for hvorfor) -- brukt her under det opprinnelige
// navnet så resten av denne fila ikke trenger å endres.
const REVALIDATE_SECONDS = LEADERBOARD_REVALIDATE_SECONDS // 6 min -- se begrunnelse ved fetchLeaderboardData

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
 * Fryser leaderboardet slik det er akkurat nå ned i leaderboard_month_snapshots, nøkket på måneden
 * (period_from). Kjøres normalt av cron-jobben rett før månedsskiftet -- upsert gjør at flere
 * kjøringer samme dag bare overskriver hverandre, så siste (og dermed mest oppdaterte) forsøk
 * før midnatt UTC vinner. Henter alltid FRISKE tall direkte fra Affilka (ikke modul-cachen
 * over), slik at en manuell "capture nå" fra admin-panelet ikke bare lagrer en gammel verdi.
 */
export async function captureLeaderboardSnapshot(): Promise<LeaderboardData> {
  const data = await fetchLeaderboardData()

  const supabase = createAdminClient()
  const { error } = await supabase.from('leaderboard_month_snapshots').upsert(
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
    .from('leaderboard_month_snapshots')
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

// Delt cache i Supabase (leaderboard_cache, én fast rad med id='current') -- IKKE en
// in-memory-variabel. Årsak: Vercel kjører flere serverless-instanser samtidig, og hver instans
// hadde tidligere sin EGEN in-memory-cache -- så den reelle raten mot Affilka var i praksis
// "opptil 6-min-vinduet PER instans", ikke globalt. Kombinert med manuell testing (f.eks. mot
// cron-endepunktene) kunne det derfor skje flere reelle Affilka-kall innenfor samme 6-min-vindu
// og trigge Affilka sin ekte 5-min cooldown -- noe som fikk den offentlige leaderboard-siden til
// å vise feilmelding for besøkende (skjedde 2026-09-30). Denne varianten bruker et atomisk
// "claim" (en betinget UPDATE) i databasen, som fungerer som en delt lås på tvers av ALLE
// instanser: kun den ene requesten som faktisk vinner UPDATE-en får lov til å kalle Affilka --
// alle andre (uansett hvor mange, uansett hvilken instans) får bare siste kjente data tilbake.
const CACHE_ROW_ID = 'current'
// Hvor lenge et "claim" regnes som gyldig før det anses forlatt (f.eks. en instans som krasjet
// midt i et kall) og en ny request får lov til å prøve på nytt.
const CLAIM_TIMEOUT_MS = 30_000

interface LeaderboardCacheRow {
  data: LeaderboardData | null
  fetched_at: string
  fetch_claimed_at: string | null
}

export async function getLeaderboardData(): Promise<LeaderboardData | null> {
  const supabase = createAdminClient()

  const { data: rowRaw } = await supabase
    .from('leaderboard_cache')
    .select('data, fetched_at, fetch_claimed_at')
    .eq('id', CACHE_ROW_ID)
    .maybeSingle()
  const row = rowRaw as LeaderboardCacheRow | null

  const cached = row?.data ?? null
  const fetchedAtMs = row ? new Date(row.fetched_at).getTime() : 0
  const isStale = Date.now() - fetchedAtMs > REVALIDATE_SECONDS * 1000

  if (!isStale) {
    return cached
  }

  const nowIso = new Date().toISOString()
  const claimCutoffIso = new Date(Date.now() - CLAIM_TIMEOUT_MS).toISOString()
  const staleCutoffIso = new Date(Date.now() - REVALIDATE_SECONDS * 1000).toISOString()

  // Kun requesten som faktisk klarer denne betingede UPDATE-en (fortsatt utløpt OG ingen andre
  // holder på å hente akkurat nå) vinner retten til å kalle Affilka.
  const { data: claimedRows } = await supabase
    .from('leaderboard_cache')
    .update({ fetch_claimed_at: nowIso })
    .eq('id', CACHE_ROW_ID)
    .lt('fetched_at', staleCutoffIso)
    .or(`fetch_claimed_at.is.null,fetch_claimed_at.lt.${claimCutoffIso}`)
    .select('data')

  const wonClaim = (claimedRows?.length ?? 0) > 0

  if (!wonClaim) {
    // Tapte kappløpet -- enten er data allerede blitt friskere enn vi trodde, eller en annen
    // instans henter akkurat nå. Les raden på nytt i stedet for å returnere vårt (potensielt
    // eldre) opprinnelige read, men kall aldri Affilka selv her.
    const { data: latestRaw } = await supabase
      .from('leaderboard_cache')
      .select('data')
      .eq('id', CACHE_ROW_ID)
      .maybeSingle()
    const latest = latestRaw as { data: LeaderboardData | null } | null
    return latest?.data ?? cached
  }

  try {
    const fresh = await fetchLeaderboardData()
    await supabase
      .from('leaderboard_cache')
      .update({ data: fresh, fetched_at: fresh.updatedAt, fetch_claimed_at: null })
      .eq('id', CACHE_ROW_ID)
    return fresh
  } catch (err) {
    console.error('[affilka] Klarte ikke hente leaderboard', err)
    // Frigi claimet med en gang (i stedet for å vente på CLAIM_TIMEOUT_MS) slik at neste forsøk
    // ikke blokkeres unødvendig, og server siste kjente gode data i stedet for en feilmelding.
    await supabase.from('leaderboard_cache').update({ fetch_claimed_at: null }).eq('id', CACHE_ROW_ID)
    return cached
  }
}

// formatXP flyttet til lib/utils.ts (ren funksjon, ingen avhengigheter) -- re-eksporteres her så
// eksisterende importer (f.eks. leaderboard-siden) ikke trenger å endres. VIKTIG: ikke legg til
// flere runtime-importer her uten å tenke gjennom det -- denne fila importerer createAdminClient
// (og dermed next/headers via lib/supabase), og admin-panelet (en client component) importerer
// typer herfra. Next.js nekter å bunte next/headers inn i en client-bundle, så en runtime-import
// fra denne fila inn i en 'use client'-fil feiler hele bygget (skjedde med formatXP 2026-09-30).
export { formatXP } from '@/lib/utils'
