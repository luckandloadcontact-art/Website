import Link from 'next/link'
import { Zap } from 'lucide-react'

const SOCIAL_LINKS = [
  { label: 'Twitch', href: 'https://twitch.tv/luckandloadtv', color: 'hover:text-purple-400' },
  { label: 'Kick', href: 'https://kick.com/luckandloadtv', color: 'hover:text-green-400' },
  { label: 'Discord', href: 'https://discord.gg/luckandloadtv', color: 'hover:text-indigo-400' },
  { label: 'TikTok', href: 'https://tiktok.com/@luckandloadtv', color: 'hover:text-pink-400' },
  { label: 'YouTube', href: 'https://youtube.com/@luckandloadtv', color: 'hover:text-red-400' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <span className="font-bold text-white text-sm">
              LuckAndLoad<span className="text-brand-500">TV</span>
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {SOCIAL_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm text-slate-500 transition-colors ${l.color}`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Home</Link>
            <Link href="/leaderboard" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Leaderboard</Link>
          </div>

          <p className="text-xs text-slate-700 text-center">
            © {new Date().getFullYear()} LuckAndLoadTV · Entertainment only · No real money · No gambling
          </p>
        </div>
      </div>
    </footer>
  )
}
