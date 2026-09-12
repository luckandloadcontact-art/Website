import { unstable_cache } from 'next/cache'

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

// NB: hele denne funksjonen (inkl. updatedAt-tidsstempelet) caches samlet via unstable_cache
// lenger ned -- ikke bare selve fetch-kallet. Ellers ville updatedAt alltid vist "nå"
// (rendringstidspunktet) uansett om dataene faktisk var ferske, siden resten av funksjonen
// kjører på nytt for hvert request selv om fetch-resultatet er cachet.
//
// Cache-intervallet er satt til 6 min (se REVALIDATE_SECONDS). Affilka-support sa først at
// tallene deres kun regnes ut hver time -- men vi fant en annen Hype-affiliate (Nordicslots)
// hvis side poller live hvert 5. min med suksess og får ferske tall, med samme 5-min cooldown
// som er dokumentert. "Hver time" var altså upresist. 6 min gir litt margin over den reelle
// 5-min-grensen uten å polle unødvendig ofte.
// VIKTIG: denne funksjonen må KASTE (throw) ved feil, ikke returnere null. unstable_cache
// lenger ned cacher kun vellykkede (resolved) resultater -- en kastet feil blir aldri lagret,
// så neste kall (cron eller en ekte besøkende) får prøve på nytt med en gang. Hadde vi
// returnert null her, ville unstable_cache lagret NULL i hele REVALIDATE_SECONDS-vinduet, og
// én forbigående glipp (f.eks. to samtidige kall som kolliderte med Affilkas 5-min cooldown)
// ville vist feilmelding til ALLE besøkende i opptil 6 minutter selv om et nytt forsøk ville
// fungert med en gang. Dette skjedde faktisk i praksis 2026-09-12 og var årsaken til denne fiksen.
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
    // Selve throttlingen skjer nå i unstable_cache-laget rundt denne funksjonen, så dette
    // kallet skal alltid gå live når funksjonen faktisk kjører.
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

// Cacher hele resultatet (data + updatedAt) samlet -- se kommentaren over
// fetchLeaderboardData for hvorfor dette må gjøres her og ikke bare på selve fetch-kallet.
const getCachedLeaderboardData = unstable_cache(fetchLeaderboardData, ['leaderboard-data'], {
  revalidate: REVALIDATE_SECONDS,
})

// Offentlig API: fanger opp kastede feil selv (fra manglende nøkkel, rate limit, nettverksfeil
// e.l.) og returnerer null i stedet -- se kommentaren over fetchLeaderboardData for hvorfor
// feilen selv aldri må caches. Kallere (siden, cron-endepunktet) trenger kun forholde seg til
// "data eller null", akkurat som før.
export async function getLeaderboardData(): Promise<LeaderboardData | null> {
  try {
    return await getCachedLeaderboardData()
  } catch (err) {
    console.error('[affilka] Klarte ikke hente leaderboard', err)
    return null
  }
}

export function formatXP(xpCents: number): string {
  return Math.round(xpCents / 100).toLocaleString('en-US')
}

export function daysUntilPayout(now = new Date()): number {
  const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
  return Math.max(1, Math.ceil((nextMonth.getTime() - now.getTime()) / 86_400_000))
}
