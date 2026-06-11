'use client'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { ExternalLink, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const SOCIALS = [
  {
    label: 'Twitch',
    href: 'https://twitch.tv/luckandloadtv',
    color: 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/60',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
      </svg>
    ),
  },
  {
    label: 'Kick',
    href: 'https://kick.com/luckandloadtv',
    color: 'border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/60',
    icon: (
      <img src="/Kick-logo.png" alt="Kick" className="h-4 w-4 object-contain" />
    ),
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/9dUxXK4f',
    color: 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/60',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.056a19.906 19.906 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@luckandloadtv',
    color: 'border-pink-500/30 text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/60',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.84 4.84 0 0 1-1.01-.07z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@LuckAndLoad',
    color: 'border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
]

export function Hero() {
  const { data: session } = useSession()

  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-brand-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface-700/60 px-4 py-1.5 text-sm">
            <span className="live-dot" />
            <span className="text-slate-400">Stream goes live on Kick & Twitch</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight text-white">
            Welcome to{' '}
            <span className="text-gradient">LuckAndLoad</span>
            <span className="text-white">TV</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Two friends, zero filters, and a whole lot of spins. Join the community for live streams, bonus hunts, and vibes you won't find anywhere else.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {!session ? (
              <button
                onClick={() => signIn('discord')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-surface-700 px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:border-white/20 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-indigo-400">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.056a19.906 19.906 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join with Discord
              </button>
            ) : (
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-surface-700 px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:border-white/20 transition-colors"
              >
                <Trophy size={15} />
                View Leaderboard
              </Link>
            )}

            {/* Hype.bet — main CTA i midten */}
            <a
              href="https://hype.bet/LuckAndLoad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-7 py-3 text-base font-black text-white shadow-lg shadow-green-500/40 hover:bg-green-400 transition-all hover:shadow-green-400/50 hover:scale-105"
            >
              🎰 Join Hype.bet
            </a>

            <a href="https://kick.com/luckandloadtv" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary">
                Watch Live
                <ExternalLink size={14} />
              </Button>
            </a>
          </div>

          {/* Social links */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center rounded-lg border p-2.5 transition-all ${s.color}`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
