import Image from 'next/image'
import Link from 'next/link'

const SOCIAL_LINKS = [
  { label: 'Twitch', href: 'https://twitch.tv/luckandloadtv', color: 'hover:text-purple-400' },
  { label: 'Kick', href: 'https://kick.com/luckandloadtv', color: 'hover:text-green-400' },
  { label: 'Discord', href: 'https://discord.gg/yagZVjqqbr', color: 'hover:text-indigo-400' },
  { label: 'TikTok', href: 'https://tiktok.com/@luckandloadtv', color: 'hover:text-pink-400' },
  { label: 'YouTube', href: 'https://youtube.com/@LuckAndLoad', color: 'hover:text-red-400' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <Link href="/" aria-label="LuckAndLoadTV home">
            <Image src="/logo-navbar.png" alt="LuckAndLoadTV" width={180} height={124} className="h-16 w-auto object-contain" />
          </Link>

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
            <Link href="/casinos/hype-bet" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Hype.bet Bonus</Link>
            <Link href="/guides" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Guides</Link>
            <Link href="/events" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Events</Link>
            <Link href="/contact" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Contact</Link>
            <Link href="/responsible-gambling" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Gambling Help</Link>
            <Link href="/terms" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Privacy</Link>
          </div>

          <div className="max-w-xl space-y-1 text-center">
            <p className="text-xs font-semibold text-slate-400">18+ · Gamble responsibly</p>
            <p className="text-xs leading-relaxed text-slate-600">
              Gambling can be addictive. Only play with money you can afford to lose. This site contains affiliate
              links, and we earn commission when you sign up and play through them.
            </p>
          </div>

          <p className="text-xs text-slate-700 text-center">
            © {new Date().getFullYear()} LuckAndLoadTV
          </p>
        </div>
      </div>
    </footer>
  )
}
