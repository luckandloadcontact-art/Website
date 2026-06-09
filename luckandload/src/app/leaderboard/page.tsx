'use client'
import { useState, useEffect } from 'react'
import { Trophy, Crown, TrendingUp } from 'lucide-react'
import { Avatar, Badge } from '@/components/ui/Badge'
import { cn, formatPoints, getRankLabel, getRankColor } from '@/lib/utils'
import type { LeaderboardEntry, LeaderboardPeriod } from '@/types'

// Demo data – replaced by real data from Supabase once users exist
const DEMO_USERS: LeaderboardEntry[] = [
  { rank: 1, user_id: '1', username: 'HypeKing99',   display_name: 'HypeKing',    avatar_url: undefined, points: 48200 },
  { rank: 2, user_id: '2', username: 'SlotQueen',    display_name: 'SlotQueen',   avatar_url: undefined, points: 39500 },
  { rank: 3, user_id: '3', username: 'BonusHunter',  display_name: 'BonusHunter', avatar_url: undefined, points: 31750 },
  { rank: 4, user_id: '4', username: 'NorseWolf',    display_name: 'NorseWolf',   avatar_url: undefined, points: 27100 },
  { rank: 5, user_id: '5', username: 'ChaosGremlin', display_name: 'ChaosGremlin',avatar_url: undefined, points: 22400 },
  { rank: 6, user_id: '6', username: 'LuckySevenX',  display_name: 'LuckySevenX', avatar_url: undefined, points: 19800 },
  { rank: 7, user_id: '7', username: 'MegaWinner',   display_name: 'MegaWinner',  avatar_url: undefined, points: 17250 },
  { rank: 8, user_id: '8', username: 'SpinCycle',    display_name: 'SpinCycle',   avatar_url: undefined, points: 14900 },
  { rank: 9, user_id: '9', username: 'BetterCall',   display_name: 'BetterCall',  avatar_url: undefined, points: 12300 },
  { rank: 10,user_id:'10', username: 'GoldRush',     display_name: 'GoldRush',    avatar_url: undefined, points: 10100 },
]

const PERIODS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'alltime', label: 'All Time' },
  { key: 'monthly', label: 'This Month' },
  { key: 'weekly',  label: 'This Week' },
]

function PodiumCard({ entry }: { entry: LeaderboardEntry }) {
  const sizes = { 1: 'py-8', 2: 'py-5', 3: 'py-5' }
  const glows = {
    1: 'border-yellow-400/40 shadow-yellow-400/10',
    2: 'border-slate-400/30 shadow-slate-400/10',
    3: 'border-amber-600/30 shadow-amber-600/10',
  }
  const avatarSizes = { 1: 56, 2: 48, 3: 48 }

  return (
    <div
      className={cn(
        'flex flex-col items-center text-center rounded-2xl border bg-surface-800 shadow-lg px-4',
        sizes[entry.rank as 1|2|3],
        glows[entry.rank as 1|2|3]
      )}
    >
      <div className="relative mb-3">
        <Avatar src={entry.avatar_url} name={entry.username} size={avatarSizes[entry.rank as 1|2|3]} />
        <span className="absolute -bottom-1.5 -right-1.5 text-lg leading-none">
          {entry.rank === 1 ? '👑' : entry.rank === 2 ? '🥈' : '🥉'}
        </span>
      </div>
      <p className="text-sm font-semibold text-white truncate max-w-[100px]">
        {entry.display_name || entry.username}
      </p>
      <p className={cn('text-lg font-bold mt-1', getRankColor(entry.rank))}>
        {formatPoints(entry.points)}
      </p>
      <p className="text-xs text-slate-600 mt-0.5">pts</p>
    </div>
  )
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('alltime')
  const [entries, setEntries] = useState<LeaderboardEntry[]>(DEMO_USERS)

  // In production, fetch from /api/leaderboard?period=... here
  useEffect(() => {
    // Simulate different scores per period
    const multiplier = period === 'weekly' ? 0.05 : period === 'monthly' ? 0.25 : 1
    setEntries(
      DEMO_USERS.map(u => ({ ...u, points: Math.floor(u.points * multiplier) }))
    )
  }, [period])

  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 bg-surface-950/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20">
              <Trophy size={20} className="text-brand-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
          </div>
          <p className="text-slate-400 text-sm ml-[52px]">
            Top community members ranked by points. Earn points by joining streams, participating in events, and more.
          </p>

          {/* Period tabs */}
          <div className="flex gap-1 mt-6 p-1 rounded-xl bg-surface-800 border border-white/5 w-fit">
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                  period === p.key
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Podium */}
        <div className="grid grid-cols-3 gap-3">
          {/* 2nd, 1st, 3rd order */}
          <PodiumCard entry={top3[1]} />
          <PodiumCard entry={top3[0]} />
          <PodiumCard entry={top3[2]} />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/8 bg-surface-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <TrendingUp size={15} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-300">Rankings</span>
            <Badge variant="default" className="ml-auto text-xs">
              {period === 'weekly' ? 'This Week' : period === 'monthly' ? 'This Month' : 'All Time'}
            </Badge>
          </div>

          <div className="divide-y divide-white/5">
            {rest.map(entry => (
              <div
                key={entry.user_id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/2 transition-colors"
              >
                <span className={cn('w-7 text-sm font-bold text-center', getRankColor(entry.rank))}>
                  {getRankLabel(entry.rank)}
                </span>
                <Avatar src={entry.avatar_url} name={entry.username} size={34} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {entry.display_name || entry.username}
                  </p>
                  <p className="text-xs text-slate-600">@{entry.username}</p>
                </div>
                <p className="text-sm font-semibold text-brand-400">
                  {formatPoints(entry.points)} <span className="text-slate-600 font-normal">pts</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Info note */}
        <p className="text-center text-xs text-slate-600 pb-4">
          Points are earned by participating in streams and community events. More ways to earn coming soon.
        </p>
      </div>
    </div>
  )
}
