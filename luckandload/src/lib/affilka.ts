// Henter månedlig leaderboard-data fra Affilka (Hype.bet) sitt affiliate-API.
// Rangerer spillerne som har spilt under vår affiliate-kode etter hvor mye de har satset (wagered)
// denne måneden, og setter premie basert på plassering.

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
  return { from: fmt(from), to: fmt(now) }
}

// Cache-intervallet er satt til 6 min (se REVALIDATE_SECONDS). Affilka-support sa først at
// tallene deres kun regnes ut hver time -- men vi fant en annen Hype-affiliate (Nordicslots)
// hvis side poller live hvert 5. min med suksess og får ferske tall, med samme 5-min cooldown
// som er dokumentert. "Hver time" var altså upresist. 6 min gir litt margin over den reelle
// 5-min-grensen uten å polle unødvendig ofte.
//
// VIKTIG: denne funksjonen må KASTE (throw) ved feil, ikke returnere null -- se getLeaderboardData
// lenger ned for hvorfor.
async function fetchLeaderboardData(): Promise<LeaderboardData> {
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

export function formatXP(xpCents: number): string {
  return Math.round(xpCents / 100).toLocaleString('en-US')
}

export function daysUntilPayout(now = new Date()): number {
  const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
  return Math.max(1, Math.ceil((nextMonth.getTime() - now.getTime()) / 86_400_000))
}
