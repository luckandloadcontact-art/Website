import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatRelativeTime } from '@/lib/utils'
import type { Announcement } from '@/types'
import { Tv, Users, Zap, MessageSquare, Calendar, Info, CheckCircle, AlertTriangle } from 'lucide-react'

// ─── Live / Stream placeholder ────────────────────────────
export function LiveSection() {
  return (
    <section className="py-16 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Tv size={20} className="text-brand-500" />
          <h2 className="text-xl font-bold text-white">Live Stream</h2>
        </div>

        <div className="rounded-2xl border border-white/8 bg-surface-800 overflow-hidden aspect-video max-w-4xl mx-auto flex items-center justify-center">
          <div className="text-center p-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4">
              <Tv size={28} className="text-brand-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Stream Embed</h3>
            <p className="text-slate-500 text-sm max-w-sm">
              Twitch or Kick embed will appear here when live. Check the social links above to watch now.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <a
                href="https://kick.com/luckandloadtv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400 hover:bg-green-500/20 transition-colors"
              >
                Watch on Kick
              </a>
              <a
                href="https://twitch.tv/luckandloadtv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-400 hover:bg-purple-500/20 transition-colors"
              >
                Watch on Twitch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── About section ────────────────────────────────────────
export function AboutSection() {
  const features = [
    { icon: Zap, title: 'Bonus Hunts', desc: 'Live bonus opens with real reactions — the good, the bad, and the ugly.' },
    { icon: Users, title: 'Community First', desc: 'A relaxed, welcoming space where everyone is part of the show.' },
    { icon: MessageSquare, title: 'Discord Hub', desc: 'Daily chat, memes, giveaways, and direct access to Kristian & Simon.' },
    { icon: Calendar, title: 'Regular Streams', desc: 'Consistent schedule across Kick and Twitch. Never miss a session.' },
  ]

  return (
    <section className="py-16 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="brand" className="mb-4">About us</Badge>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Two mates, one stream,<br />
              <span className="text-gradient">zero script</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              LuckAndLoadTV started as Kristian and Simon streaming for fun — and somehow the fun never stopped. What you see is what you get: genuine reactions, honest commentary, and a community that feels like hanging out with mates.
            </p>
            <p className="text-slate-400 leading-relaxed">
              No fake hype, no paid acts. Just two guys who love the chase and built a community around it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map(f => (
              <Card key={f.title} glow className="p-5">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 border border-brand-500/20">
                  <f.icon size={16} className="text-brand-500" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Community stats ──────────────────────────────────────
export function CommunitySection() {
  const stats = [
    { label: 'Discord Members', value: '500+', color: 'text-indigo-400' },
    { label: 'Community Points Given', value: '1.2M+', color: 'text-brand-400' },
    { label: 'Streams Completed', value: '200+', color: 'text-green-400' },
    { label: 'Bonus Hunts Live', value: '80+', color: 'text-yellow-400' },
  ]

  return (
    <section className="py-16 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="brand" className="mb-3">Community</Badge>
          <h2 className="text-3xl font-bold text-white">Growing every stream</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/8 bg-surface-800 p-6 text-center hover:border-white/15 transition-colors"
            >
              <p className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-indigo-400">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.056a19.906 19.906 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">Join our Discord</h3>
            <p className="text-sm text-slate-400">The hub of the community. Chat, memes, giveaways, and direct access to the team.</p>
          </div>
          <a
            href="https://discord.gg/9dUxXK4f"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Join Discord
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Hype.bet Multiplayer Room ────────────────────────────
const ROOM_PLAYERS = [
  { name: 'Kristian', initial: 'K', balance: '250.00', pct: '50.00%', profit: '+$50', isHost: true },
  { name: 'Simon',    initial: 'S', balance: '100.00', pct: '20.00%', profit: '+$20' },
  { name: 'Alex',     initial: 'A', balance: '100.00', pct: '20.00%', profit: '+$20' },
  { name: 'Sam',      initial: 'S', balance: '50.00',  pct: '10.00%', profit: '+$10' },
]

export function HypeSection() {
  return (
    <section className="py-20 border-t border-white/5 bg-surface-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-wide uppercase">
            How Does That Work?
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            We understand you might have questions. Hype.bet is the first casino offering this revolutionary multiplayer feature — and we use it on every stream!
          </p>
        </div>

        {/* Two-column: text + visual */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-14">

          {/* Left: bullet points */}
          <div className="space-y-6">
            {[
              { icon: '👥', text: <>An influencer can create a virtual room where <strong className="text-white">hundreds of players</strong> can join and play together</> },
              { icon: '🎮', text: <>While Kristian &amp; Simon manage the game, everyone can <strong className="text-white">join in and leave at any time</strong></> },
              { icon: '💰', text: <><strong className="text-white">Each player contributes</strong> to the room and deposits money into a shared pool</> },
              { icon: '📊', text: <>On every bet, each player will either lose or win depending on <strong className="text-white">their share</strong> in the room&apos;s pool</> },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                <p className="text-slate-300 text-base leading-relaxed">{item.text}</p>
              </div>
            ))}

            <p className="text-slate-500 text-sm pt-2">
              Below you can find a visual breakdown of how the Hype Multiplayer System works from start to finish.
            </p>
          </div>

          {/* Right: diagram */}
          <div className="rounded-2xl border border-white/8 bg-surface-800 p-5 overflow-hidden">
            <p className="text-slate-500 text-xs text-right mb-4">All players get their % share</p>

            <div className="flex items-center gap-2 flex-wrap justify-center">

              {/* Players column */}
              <div className="space-y-2 min-w-[170px]">
                {ROOM_PLAYERS.map((p, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${
                      p.isHost
                        ? 'border border-brand-500/40 bg-brand-500/10'
                        : 'bg-surface-700'
                    }`}
                  >
                    <div className="h-7 w-7 rounded-full bg-brand-500/20 flex items-center justify-center text-[11px] font-bold text-brand-400 shrink-0">
                      {p.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-xs font-semibold">{p.name}</span>
                        {p.isHost && (
                          <span className="text-[9px] bg-brand-500/20 text-brand-400 px-1 py-0.5 rounded font-bold">HOST</span>
                        )}
                      </div>
                      <p className="text-slate-400 text-[10px]">Balance: ${p.balance} {p.pct}</p>
                    </div>
                    <span className="text-green-400 text-[10px] font-semibold shrink-0">{p.profit}</span>
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div className="text-slate-500 text-xl font-light">→</div>

              {/* Room Balance */}
              <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-3 text-center min-w-[110px]">
                <p className="text-slate-400 text-[10px] mb-1">Room Balance:</p>
                <p className="text-white font-bold text-base">$500.00</p>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <div className="h-6 w-6 rounded-full bg-brand-500/20 flex items-center justify-center text-[10px] font-bold text-brand-400">K</div>
                  <div className="text-left">
                    <p className="text-white text-[11px] font-semibold leading-none">Kristian</p>
                    <p className="text-brand-400 text-[9px]">HOST</p>
                  </div>
                </div>
                <p className="text-slate-500 text-[9px] mt-2">Managing Room Balance</p>
              </div>

              {/* Arrow + slot */}
              <div className="flex flex-col items-center gap-1">
                <p className="text-slate-400 text-[10px]">Single Bet $50.00</p>
                <div className="text-slate-500 text-xl">→</div>
                <div className="w-11 h-11 rounded-lg bg-surface-700 border border-white/8 flex items-center justify-center text-2xl">🎰</div>
              </div>

              {/* Win */}
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-base">🏆</span>
                  <p className="text-green-400 text-[10px] font-bold">Players Win</p>
                </div>
                <p className="text-white font-bold text-base">$100.00</p>
              </div>
            </div>

            <p className="text-center text-slate-500 text-xs mt-5 leading-relaxed">
              Gather your friends and fellow players for an immersive gaming experience like never before.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-white/5" />
          <p className="text-brand-400 font-black text-sm tracking-widest uppercase flex items-center gap-2">
            <span>🪙</span> Play Together, Win Together <span>🪙</span>
          </p>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://hype.bet/LuckAndLoad"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl bg-green-500 px-10 py-4 text-base font-black text-white hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 uppercase tracking-wide"
          >
            🎮 Play Together with Friends
          </a>
        </div>

      </div>
    </section>
  )
}
const typeIcon: Record<string, React.ReactNode> = {
  info:    <Info size={14} className="text-blue-400" />,
  success: <CheckCircle size={14} className="text-green-400" />,
  warning: <AlertTriangle size={14} className="text-yellow-400" />,
  event:   <Calendar size={14} className="text-brand-400" />,
}

const typeBorder: Record<string, string> = {
  info:    'border-blue-500/20',
  success: 'border-green-500/20',
  warning: 'border-yellow-500/20',
  event:   'border-brand-500/20',
}

export function AnnouncementsSection({ announcements }: { announcements: Announcement[] }) {
  if (!announcements.length) return null

  return (
    <section className="py-16 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare size={20} className="text-brand-500" />
          <h2 className="text-xl font-bold text-white">Latest Updates</h2>
        </div>

        <div className="space-y-3 max-w-3xl">
          {announcements.map(ann => (
            <div
              key={ann.id}
              className={`rounded-xl border bg-surface-800/60 p-5 ${typeBorder[ann.type] || 'border-white/8'}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{typeIcon[ann.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-white text-sm">{ann.title}</h3>
                    {ann.pinned && <Badge variant="brand" className="text-[10px]">Pinned</Badge>}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{ann.body}</p>
                  <p className="text-xs text-slate-600 mt-2">{formatRelativeTime(ann.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
