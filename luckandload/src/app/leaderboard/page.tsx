import { CheckCircle, CalendarDays, Gift, Users } from 'lucide-react'
import { getLeaderboardData, formatXP } from '@/lib/affilka'
import { getRankLabel, getRankColor, formatDate } from '@/lib/utils'

export const revalidate = 300

export default async function LeaderboardPage() {
  const data = await getLeaderboardData()
  const entries = data?.entries ?? []

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="border-b border-white/5 bg-surface-950/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-5">
            <span className="text-3xl">🏆</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
            LuckAndLoadTV Leaderboard
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            🧠 If you play solo under our code, you generate a percentage for us — and we give{' '}
            <strong className="text-white">100% of it back to you</strong> through monthly payouts ❤️
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Live leaderboard */}
        <div className="rounded-2xl border border-white/8 bg-surface-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-base font-bold text-white">This month's ranking</h2>
            {data && (
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Users size={13} /> {data.totalUsers} players
              </span>
            )}
          </div>

          {!data && (
            <p className="px-6 pb-6 text-sm text-slate-400">
              Couldn't load the leaderboard right now — check back in a few minutes.
            </p>
          )}

          {data && entries.length === 0 && (
            <p className="px-6 pb-6 text-sm text-slate-400">
              No plays under our code yet this month — be the first on the board! 🎰
            </p>
          )}

          {entries.length > 0 && (
            <div className="divide-y divide-white/5">
              {entries.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 px-6 py-3.5 ${
                    entry.rank === 1 ? 'bg-gold-500/5' : ''
                  }`}
                >
                  <span className={`w-8 text-center text-lg font-bold shrink-0 ${getRankColor(entry.rank)}`}>
                    {getRankLabel(entry.rank)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{entry.username}</p>
                    <p className="text-slate-500 text-xs">{formatXP(entry.xpPoints)} XP</p>
                  </div>
                  <span
                    className={`text-sm font-bold shrink-0 ${
                      entry.prize ? 'text-green-400' : 'text-slate-500'
                    }`}
                  >
                    {entry.prize ? `$${entry.prize}` : 'Runner-up'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {data && (
            <p className="px-6 py-3 text-[11px] text-slate-600 border-t border-white/5">
              Period: {formatDate(data.periodFrom)} – {formatDate(data.periodTo)} · Updated {formatDate(data.updatedAt)}
            </p>
          )}
        </div>

        {/* Random giveaway */}
        <div className="rounded-2xl border border-gold-500/20 bg-surface-800 p-6 flex gap-4 items-start">
          <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-gold-500/10 border border-gold-500/20">
            <Gift size={18} className="text-gold-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">+ $20 Random Giveaway</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              On top of the ranking prizes above, we draw <strong className="text-white">$20 at random</strong> every
              month among everyone who played solo under our code — win or lose, everyone qualifies.
            </p>
          </div>
        </div>

        {/* Requirements + Payouts */}
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Requirements */}
          <div className="rounded-2xl border border-brand-500/20 bg-surface-800 p-6">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle size={18} className="text-brand-400" />
              <h2 className="text-base font-bold text-white">Requirements</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-brand-500/20 text-brand-400 text-[11px] font-bold flex items-center justify-center shrink-0">✓</span>
                <span className="text-slate-300 text-sm leading-relaxed">Play under <strong className="text-white">our affiliate code</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-brand-500/20 text-brand-400 text-[11px] font-bold flex items-center justify-center shrink-0">✓</span>
                <span className="text-slate-300 text-sm leading-relaxed">Minimum <strong className="text-white">$5 generated</strong> per month</span>
              </li>
            </ul>
          </div>

          {/* Payouts */}
          <div className="rounded-2xl border border-green-500/20 bg-surface-800 p-6">
            <div className="flex items-center gap-2 mb-5">
              <CalendarDays size={18} className="text-green-400" />
              <h2 className="text-base font-bold text-white">Payouts</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-green-500/20 text-green-400 text-[11px] font-bold flex items-center justify-center shrink-0">💰</span>
                <span className="text-slate-300 text-sm leading-relaxed">Paid out on the <strong className="text-white">1st of every month</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-green-500/20 text-green-400 text-[11px] font-bold flex items-center justify-center shrink-0">❤️</span>
                <span className="text-slate-300 text-sm leading-relaxed"><strong className="text-white">100%</strong> of generated revenue goes back to you</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How it works summary */}
        <div className="rounded-2xl border border-white/8 bg-surface-800 p-6">
          <h2 className="text-base font-bold text-white mb-4">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: '1', icon: '🎰', title: 'Play solo', desc: 'Use our affiliate code when you play at the casino' },
              { step: '2', icon: '📈', title: 'Generate revenue', desc: 'Your play automatically generates a % for LuckAndLoadTV' },
              { step: '3', icon: '💸', title: 'Get paid', desc: 'We send 100% back to you on the 1st of each month' },
            ].map(item => (
              <div key={item.step} className="text-center p-4 rounded-xl bg-surface-700/50">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-white text-sm font-semibold mb-1">{item.title}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
