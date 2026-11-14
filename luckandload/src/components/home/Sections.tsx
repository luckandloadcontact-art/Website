import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { GamblingNotice } from '@/components/ui/GamblingNotice'
import { formatRelativeTime } from '@/lib/utils'
import type { Announcement } from '@/types'
import { Users, LogIn, Wallet, PieChart, MessageSquare, Calendar, Info, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react'
import { CountUp } from '@/components/ui/CountUp'
import { RoomFlow } from '@/components/guides/RoomFlow'
import { hypeReviewHref } from '@/lib/guides'

// One row in Latest Updates: an announcement from the admin panel, or a published guide.
export type UpdateItem = {
  id: string
  title: string
  body: string
  type: Announcement['type'] | 'article'
  pinned: boolean
  date: string
  href?: string
}

// ─── About section ────────────────────────────────────────
export function AboutSection() {
  return (
    <section className="py-16 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Two mates. <span className="text-brand-400">One stream.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              We&apos;re Kristian and Simon, two mates from Norway who started LuckAndLoadTV back in September 2025.
            </p>
            <p className="text-slate-400 leading-relaxed mb-4">
              We&apos;ve both been into slots for years, but what really made us want to start streaming was discovering the
              multiplayer room concept. The idea of playing alongside other people, sharing the same spins and experiencing
              the wins and losses together was something we found genuinely exciting. So we decided to give streaming a shot.
            </p>
            <p className="text-slate-400 leading-relaxed mb-4">
              Fast forward a year, and we&apos;ve both quit our jobs, moved in together, and decided to take streaming
              full-time.
            </p>
            <p className="text-slate-400 leading-relaxed mb-4">
              From the beginning, we&apos;ve wanted LuckAndLoadTV to feel more like hanging out in Discord with your mates
              than watching a traditional gambling stream. Somewhere people can join the conversation, have a laugh and feel
              like they&apos;re part of what&apos;s happening, whether they&apos;re playing in the room or just watching.
            </p>
            <p className="text-slate-400 leading-relaxed">
              We&apos;re still figuring things out as we go, but building a community around something we both enjoy has
              been the best part of it all.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/8 shadow-xl">
            <Image
              src="/Team.jpg.png"
              alt="LuckAndLoadTV — Two Degens One Mission"
              width={700}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Community stats ──────────────────────────────────────
export function CommunitySection() {
  // `count` numbers count up when scrolled into view; `text` is shown as is.
  const stats: { label: string; count?: number; text?: string; prefix?: string; suffix?: string; color: string }[] = [
    { label: 'Given away in our first year', count: 15000, prefix: '$', suffix: '+', color: 'text-green-400' },
    { label: 'Times players have joined our multiplayer rooms', count: 7000, suffix: '+', color: 'text-brand-400' },
    { label: 'Our biggest win – Zeus vs Hades', count: 13500, prefix: '$', color: 'text-yellow-400' },
    { label: 'In monthly leaderboard prizes', count: 1000, prefix: '$', color: 'text-indigo-400' },
  ]

  return (
    <section className="py-16 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold text-white">Our first year in numbers</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl border border-white/8 bg-surface-800 p-6 text-center">
              <p className={`mb-1 text-3xl font-bold sm:text-4xl ${s.color}`}>
                {s.count !== undefined ? <CountUp value={s.count} prefix={s.prefix} suffix={s.suffix} /> : s.text}
              </p>
              <p className="text-sm text-slate-400">{s.label}</p>
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
            href="https://discord.gg/yagZVjqqbr"
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
export function HypeSection() {
  return (
    <section className="py-20 border-t border-white/5 bg-surface-950 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-wide uppercase">
            How does Hype.bet work?
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            Hype.bet lets us open a room on stream that anyone can join. We play in one on every stream, and
            here&apos;s how it works.
          </p>
        </div>

        {/* Two-column: text + visual */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-14">

          {/* Left: bullet points */}
          <div className="space-y-6">
            {[
              { Icon: Users, text: <>A host can create a virtual room where players can join and play together</> },
              { Icon: LogIn, text: <>While LuckAndLoadTV hosts the room, anyone can <strong className="text-white">join in and leave at any time</strong></> },
              { Icon: Wallet, text: <><strong className="text-white">Each player can contribute</strong> to the room by depositing money into a shared pool</> },
              { Icon: PieChart, text: <>Players win and lose based on their percentage in the room</> },
            ].map(({ Icon, text }, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                  <Icon size={18} />
                </span>
                <p className="text-slate-300 text-base leading-relaxed">{text}</p>
              </div>
            ))}

            {/* Affiliate callout */}
            <div className="rounded-xl border border-gold-500/30 bg-gold-500/5 p-4 mt-2">
              <p className="text-gold-400 font-bold text-sm mb-1">Support us, and get rewarded</p>
              <p className="text-slate-300 text-sm leading-relaxed">
                Sign up at Hype.bet using{' '}
                <a
                  href="https://hype.bet/LuckAndLoad"
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="text-brand-400 hover:text-brand-300 underline underline-offset-2 font-semibold"
                >
                  our link
                </a>
                {' '}and play solo under our code. Every month we pay out{' '}
                <strong className="text-white">$1,000</strong> — ranked prizes for the{' '}
                <Link href="/leaderboard" className="text-brand-400 hover:text-brand-300 underline underline-offset-2 font-semibold">
                  top 6 on the leaderboard
                </Link>
                {' '}plus a $20 random draw open to everyone who plays under our code. Players in our room also share a wheel
                with a $2,500 top prize at least once a month.{' '}
                <Link href={hypeReviewHref()} className="text-brand-400 hover:text-brand-300 underline underline-offset-2 font-semibold">
                  Read our Hype.bet review
                </Link>
                .
              </p>
              <GamblingNotice className="mt-2" />
            </div>
          </div>

          {/* Right: diagram — 2×2 grid flow */}
          <RoomFlow />
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
            rel="sponsored noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl bg-hype px-10 py-4 text-base font-black text-black hover:bg-hype/90 transition-colors uppercase tracking-wide"
          >
            🎮 Play Together with Friends
          </a>
          <GamblingNotice className="mt-3" />
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
  article: <BookOpen size={14} className="text-brand-400" />,
}

const typeBorder: Record<string, string> = {
  info:    'border-blue-500/20',
  success: 'border-green-500/20',
  warning: 'border-yellow-500/20',
  event:   'border-brand-500/20',
  article: 'border-brand-500/20',
}

export function AnnouncementsSection({ announcements }: { announcements: UpdateItem[] }) {
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
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="text-xs text-slate-500">{formatRelativeTime(ann.date)}</p>
                    {ann.href && (
                      <Link href={ann.href} className="text-xs font-semibold text-brand-400 hover:text-brand-300">
                        Read the guide →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
