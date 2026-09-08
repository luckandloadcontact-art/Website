// Henter månedlig leaderboard-data fra Affilka (Hype.bet) sitt affiliate-API.
// Rangerer spillerne som har spilt under vår affiliate-kode etter hvor mye de har satset (wagered)
// denne måneden, og setter premie basert på plassering.

export interface LeaderboardEntry {
  rank: number
  username: string
  avatar: string | null
  wageredCents: number
  bets: number
  prize: number | null // USD, null = ingen fast premie (f.eks. "Runner-up")
}

export interface LeaderboardData {
  entries: LeaderboardEntry[]
  totalUsers: number
  periodFrom: string
  periodTo: string
  updatedAt: string
}

// Premier for plass 1-6. Resten av potten ($20) deles ikke ut etter plassering,
// men trekkes tilfeldig blant alle som har spilt solo under koden vår (se leaderboard-siden).
const PLACEMENT_PRIZES = [500, 200, 100, 80, 60, 40]
const TOP_N = 10

function currentMonthRange(now = new Date()) {
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  return { from: fmt(from), to: fmt(now) }
}

export async function getLeaderboardData(): Promise<LeaderboardData | null> {
  const apiKey = process.env.AFFILKA_API_KEY
  if (!apiKey) {
    console.error('[affilka] AFFILKA_API_KEY er ikke satt')
    return null
  }

  const { from, to } = currentMonthRange()

  try {
    const res = await fetch('https://api.hype.bet/wallet/api/v1/affiliate/creator/get-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, from, to }),
      // Affilka har 5 min cooldown per API-nøkkel -- caches i 5 min på tvers av alle besøkende.
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      console.error('[affilka] API-kall feilet', res.status, await res.text().catch(() => ''))
      return null
    }

    const data = await res.json()
    const summarizedBets: Array<{
      user?: { username?: string; avatar?: string | null }
      wagered?: number
      bets?: number
    }> = data.summarizedBets ?? []

    const sorted = [...summarizedBets].sort((a, b) => (b.wagered ?? 0) - (a.wagered ?? 0))

    const entries: LeaderboardEntry[] = sorted.slice(0, TOP_N).map((item, i) => ({
      rank: i + 1,
      username: item.user?.username ?? 'Ukjent spiller',
      avatar: item.user?.avatar ?? null,
      wageredCents: item.wagered ?? 0,
      bets: item.bets ?? 0,
      prize: PLACEMENT_PRIZES[i] ?? null,
    }))

    return {
      entries,
      totalUsers: data.summary?.totalUsers ?? entries.length,
      periodFrom: from,
      periodTo: to,
      updatedAt: new Date().toISOString(),
    }
  } catch (err) {
    console.error('[affilka] Klarte ikke hente leaderboard', err)
    return null
  }
}

export function formatUSD(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
