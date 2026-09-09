import { Trophy, Shuffle, Clock, Gift, Zap, CalendarDays } from 'lucide-react'
import {
  getLeaderboardData,
  formatXP,
  daysUntilPayout,
  TOTAL_PRIZE_POOL,
  RANDOM_GIVEAWAY_PRIZE,
  type LeaderboardEntry,
} from '@/lib/affilka'
import { formatRelativeTime, cn } from '@/lib/utils'
import { PlayerAvatar } from '@/components/leaderboard/PlayerAvatar'

// Rendres dynamisk per request i stedet for å bli forhåndsbygget statisk -- ellers ville
// hver eneste "git push"-deploy trigget et eget kall til Affilka under bygget, og disse
// kunne kollidere med hverandre (og med besøkende) på den delte 5-min cooldownen.
// Selve caching/deduping av API-kallet skjer likevel i getLeaderboardData() (360s).
export const dynamic = 'force-dynamic'

const PODIUM_STYLE = {
  1: {
    ring: 'ring-2 ring-gold-400/70',
    badge: 'bg-gold-500 text-black',
    lift: 'sm:-mt-4',
    glow: 'shadow-[0_0_44px_-12px_rgba(201,165,60,0.5)] border-gold-500/25',
    avatarSize: 76,
    prizeColor: 'text-gold-400',
  },
  2: {
    ring: 'ring-2 ring-slate-300/50',
    badge: 'bg-slate-300 text-black',
    lift: '',
    glow: 'border-white/8',
    avatarSize: 60,
    prizeColor: 'text-hype',
  },
  3: {
    ring: 'ring-2 ring-amber-600/60',
    badge: 'bg-amber-600 text-black',
    lift: '',
    glow: 'border-white/8',
    avatarSize: 60,
    prizeColor: 'text-hype',
  },
} as const

function PodiumCard({ entry, place }: { entry: LeaderboardEntry; place: 1 | 2 | 3 }) {
  const s = PODIUM_STYLE[place]
  return (
    <div
      className={cn(
        'relative flex flex-col items-center rounded-2xl border bg-surface-800 px-3 py-6 text-center',
        s.lift,
        s.glow
      )}
    >
      <span
        className={cn(
          'absolute -top-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-black',
          s.badge
        )}
      >
        {place}
      </span>
      <PlayerAvatar src={entry.avatar} name={entry.username} size={s.avatarSize} className={s.ring} />
      <p className="mt-3 max-w-full truncate text-sm font-bold text-white">{entry.username}</p>
      <p className="mt-0.5 text-xs tabular-nums text-slate-500">{formatXP(entry.xpPoints)} XP</p>
      <p className={cn('mt-3 text-xl font-black tabular-nums', s.prizeColor)}>${entry.prize}</p>
    </div>
  )
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-white/8 bg-surface-800 px-3 py-3">
      <div className="flex items-center gap-1.5 text-slate-500">
        {icon}
        <span className="text-[11px] uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-base font-bold text-white tabular-nums">{value}</span>
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-brand-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
        <p className="truncate text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  )
}

export default async function LeaderboardPage() {
  const data = await getLeaderboardData()
  const entries = data?.entries ?? []
  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)
  const showPodium = top3.length === 3

  const monthLabel = data
    ? new Date(`${data.periodFrom}T00:00:00Z`).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : ''

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="border-b border-white/5 bg-gradient-to-b from-surface-900 to-surface-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-400">
              <Trophy size={13} /> LuckAndLoadTV
            </div>
            <h1 className="text-3xl font-black text-white sm:text-4xl">Monthly Leaderboard</h1>
            <p className="max-w-xl text-sm text-slate-400 sm:text-base">
              Top 10 players ranked by XP earned playing under our affiliate code this month.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
            <StatPill icon={<Gift size={13} />} label="Prize pool" value={`$${TOTAL_PRIZE_POOL}`} />
            <StatPill icon={<Shuffle size={13} />} label="Random draw" value={`$${RANDOM_GIVEAWAY_PRIZE}`} />
            <StatPill icon={<Clock size={13} />} label="Resets in" value={`${daysUntilPayout()}d`} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-4">

        {!data && (
          <div className="rounded-2xl border border-white/8 bg-surface-800 p-6 text-center text-sm text-slate-400">
            Couldn't load the leaderboard right now — check back in a few minutes.
          </div>
        )}

        {data && entries.length === 0 && (
          <div className="rounded-2xl border border-white/8 bg-surface-800 p-6 text-center text-sm text-slate-400">
            No plays under our code yet this month — be the first player on the board.
          </div>
        )}

        {/* Podium */}
        {showPodium && (
          <div className="grid grid-cols-3 items-end gap-3 sm:gap-4">
            <PodiumCard entry={top3[1]} place={2} />
            <PodiumCard entry={top3[0]} place={1} />
            <PodiumCard entry={top3[2]} place={3} />
          </div>
        )}

        {/* Ranks 4+ */}
        {(showPodium ? rest : entries).length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-surface-800">
            <div className="divide-y divide-white/5">
              {(showPodium ? rest : entries).map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02] sm:px-6 sm:gap-4"
                >
                  <span className="w-5 shrink-0 text-center text-sm font-bold tabular-nums text-slate-500">
                    {entry.rank}
                  </span>
                  <PlayerAvatar src={entry.avatar} name={entry.username} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{entry.username}</p>
                    <p className="text-xs tabular-nums text-slate-500">{formatXP(entry.xpPoints)} XP</p>
                  </div>
                  {entry.prize ? (
                    <span className="shrink-0 text-sm font-bold tabular-nums text-hype">${entry.prize}</span>
                  ) : (
                    <span className="shrink-0 text-xs font-medium text-slate-600">Runner-up</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data && entries.length > 0 && (
          <p className="text-center text-[11px] text-slate-600">
            {monthLabel} · Updated {formatRelativeTime(data.updatedAt)}
          </p>
        )}

        {/* Info strip */}
        <div className="rounded-2xl border border-white/8 bg-surface-800 p-5 sm:p-6">
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <InfoItem icon={<Zap size={15} />} label="Play under" value="Code LuckAndLoad" />
            <InfoItem icon={<CalendarDays size={15} />} label="Paid out" value="1st of month" />
            <InfoItem icon={<Gift size={15} />} label="Bonus draw" value={`+$${RANDOM_GIVEAWAY_PRIZE} random`} />
          </div>
          <p className="mt-4 border-t border-white/5 pt-4 text-xs leading-relaxed text-slate-500">
            The ${RANDOM_GIVEAWAY_PRIZE} bonus is drawn at random each month among everyone who played solo under
            our code and earned at least <strong className="text-slate-300">100 XP</strong> that month — win or
            lose, everyone above that bar qualifies.
          </p>
        </div>

      </div>
    </div>
  )
}
