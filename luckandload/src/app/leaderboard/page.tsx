import { Trophy, CheckCircle, CalendarDays, Clock } from 'lucide-react'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="border-b border-white/5 bg-surface-950/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-5">
            <span className="text-3xl">💰</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
            LuckAndLoadTV Monthly Payouts
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            🧠 If you play solo under our code, you generate a percentage for us — and we give{' '}
            <strong className="text-white">100% of it back to you</strong> through monthly payouts ❤️
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">

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

        {/* Future leaderboard note */}
        <div className="rounded-2xl border border-white/8 bg-surface-800/60 p-6 flex gap-4 items-start">
          <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20">
            <Clock size={18} className="text-brand-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Traditional Leaderboard — Coming Soon</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              In the future we will transition to a more traditional leaderboard where you can track your ranking, compete with other community members, and earn rewards based on your activity. Stay tuned!
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
