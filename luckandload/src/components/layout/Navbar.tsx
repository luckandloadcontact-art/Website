'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, Trophy, User, LayoutDashboard, LogOut, LogIn } from 'lucide-react'
import { cn, formatPoints } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blackjack', label: 'Daily Blackjack' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/contact', label: 'Contact' },
  { href: null, label: 'Forum', comingSoon: true },
]

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'mod'

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-900/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/Logo LuckAndLoadTV.jpg"
              alt="LuckAndLoadTV"
              width={240}
              height={68}
              className="h-14 w-auto object-contain transition-opacity group-hover:opacity-90"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link =>
              link.comingSoon ? (
                <span
                  key={link.label}
                  className="px-4 py-2 rounded-lg text-sm text-slate-600 cursor-default flex items-center gap-2"
                >
                  {link.label}
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-400 border border-brand-500/30 rounded-full px-1.5 py-0.5 leading-none">
                    Soon
                  </span>
                </span>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard size={14} />
                Admin
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-surface-700 px-3 py-2 hover:border-brand-500/40 transition-all"
                >
                  {session.user.avatarUrl ? (
                    <Image
                      src={session.user.avatarUrl}
                      alt={session.user.username || ''}
                      width={26}
                      height={26}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-[26px] w-[26px] rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold">
                      {(session.user.username || 'U').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-white leading-none">
                      {session.user.displayName || session.user.username}
                    </p>
                    <p className="text-[10px] text-brand-400 mt-0.5 flex items-center gap-1">
                      <Trophy size={9} />
                      {formatPoints(session.user.points || 0)} loads
                    </p>
                  </div>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-surface-800 shadow-xl z-20 py-1 animate-slide-up">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={14} />
                        Profile
                      </Link>
                      <Link
                        href="/leaderboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Trophy size={14} />
                        Leaderboard
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard size={14} />
                          Admin
                        </Link>
                      )}
                      <div className="my-1 border-t border-white/5" />
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false) }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn('discord')}
                className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
              >
                <LogIn size={14} />
                Sign in
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setMenuOpen(o => !o)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 py-3 space-y-1 animate-fade-in">
            {NAV_LINKS.map(link =>
              link.comingSoon ? (
                <span
                  key={link.label}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-slate-600"
                >
                  {link.label}
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-400 border border-brand-500/30 rounded-full px-1.5 py-0.5 leading-none">
                    Soon
                  </span>
                </span>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="block px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            {isAdmin && (
              <Link href="/admin" className="block px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
