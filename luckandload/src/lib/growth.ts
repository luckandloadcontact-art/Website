// Data behind the Growth tab in the admin panel: who is new under our code each month, and which
// pages send clicks to Hype.bet. The admin page may only import types from this file, because
// lib/supabase pulls in next/headers (see the warning at the bottom of lib/affilka.ts).

import { createAdminClient } from '@/lib/supabase'

interface StoredPlayer {
  username: string
  wagered: number // Hundredths of a USD, as the Hype API reports it
}

export interface MonthGrowth {
  month: string // First day of the month, YYYY-MM-DD
  activePlayers: number
  newPlayers: string[]
  wagered: number // USD
  newPlayerWagered: number // USD
  registrations: number | null // Hype's summary.totalUsers
  capturedAt: string
}

export interface PageClicks {
  path: string
  thisMonth: number
  lastMonth: number
}

export interface GrowthData {
  hasBaseline: boolean
  months: MonthGrowth[] // Newest first
  clicks: PageClicks[] // Most clicks this month first
}

/**
 * Stores everyone who bet in a period. Called on every real Hype API call, so the current month
 * stays fresh and finished months end up with their final numbers. Failing here must never take
 * the public leaderboard down, so errors are only logged.
 */
export async function savePlayerPeriod(period: {
  from: string
  to: string
  bets: Array<{ user?: { username?: string }; wagered?: number }>
  newRegistrations: number | null
}) {
  const players: StoredPlayer[] = period.bets.flatMap(bet =>
    bet.user?.username ? [{ username: bet.user.username, wagered: bet.wagered ?? 0 }] : []
  )

  try {
    const { error } = await createAdminClient()
      .from('hype_player_periods')
      .upsert(
        {
          period_from: period.from,
          period_to: period.to,
          players,
          new_registrations: period.newRegistrations,
          captured_at: new Date().toISOString(),
        },
        { onConflict: 'period_from' }
      )
    if (error) console.error('[growth] Could not save player period', error.message)
  } catch (err) {
    console.error('[growth] Could not save player period', err)
  }
}

export async function recordHypeClick(path: string) {
  const { error } = await createAdminClient().rpc('increment_hype_click', {
    p_day: new Date().toISOString().slice(0, 10),
    p_path: path,
  })
  if (error) console.error('[growth] Could not record click', error.message)
}

function firstOfMonth(now: Date, monthsAgo: number) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, 1)).toISOString().slice(0, 10)
}

export async function getGrowthData(now = new Date()): Promise<GrowthData> {
  const supabase = createAdminClient()
  const thisMonth = firstOfMonth(now, 0)
  const lastMonth = firstOfMonth(now, 1)

  const [periods, clicks] = await Promise.all([
    supabase
      .from('hype_player_periods')
      .select('period_from, players, new_registrations, is_baseline, captured_at')
      .order('period_from', { ascending: true }),
    supabase.from('hype_clicks_daily').select('day, path, clicks').gte('day', lastMonth),
  ])
  if (periods.error) throw new Error(`[growth] ${periods.error.message}`)
  if (clicks.error) throw new Error(`[growth] ${clicks.error.message}`)

  const seen = new Set<string>()
  const months: MonthGrowth[] = []
  for (const row of periods.data ?? []) {
    const players = row.players as StoredPlayer[]
    const newcomers = players.filter(player => !seen.has(player.username.toLowerCase()))
    players.forEach(player => seen.add(player.username.toLowerCase()))
    if (row.is_baseline) continue

    months.unshift({
      month: row.period_from,
      activePlayers: players.length,
      newPlayers: newcomers.map(player => player.username),
      wagered: players.reduce((sum, player) => sum + player.wagered, 0) / 100,
      newPlayerWagered: newcomers.reduce((sum, player) => sum + player.wagered, 0) / 100,
      registrations: row.new_registrations,
      capturedAt: row.captured_at,
    })
  }

  const byPath = new Map<string, PageClicks>()
  for (const row of clicks.data ?? []) {
    const page = byPath.get(row.path) ?? { path: row.path, thisMonth: 0, lastMonth: 0 }
    if (row.day >= thisMonth) page.thisMonth += row.clicks
    else page.lastMonth += row.clicks
    byPath.set(row.path, page)
  }

  return {
    hasBaseline: (periods.data ?? []).some(row => row.is_baseline),
    months,
    clicks: Array.from(byPath.values()).sort((a, b) => b.thisMonth - a.thisMonth || b.lastMonth - a.lastMonth),
  }
}
