import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, CalendarDays, ChevronDown, ExternalLink, Users } from 'lucide-react'
import { GamblingNotice } from '@/components/ui/GamblingNotice'
import { HYPE_PLAY_URL } from '@/lib/slotWheel'
import { SITE_URL } from '@/lib/guides'

// Monthly $100 draw for new Hype.bet players who sign up under LuckAndLoad, plus a $25 finder's fee
// for the player who referred the winner. Linked from the pop-up on the home page and the leaderboard.
// Laid out like the draw graphic (public/draw/monthly-draw.jpg, used as the share image).
const DISCORD_URL = 'https://discord.gg/yagZVjqqbr'
const PRIZE = '$100'
const FINDERS_FEE = '$25'

export const metadata: Metadata = {
  title: 'Monthly $100 Draw for New Hype.bet Players – LuckAndLoadTV',
  description:
    'Sign up at Hype.bet through our link, make your first deposit and earn 100 XP, and you are in our monthly $100 draw. Refer the winner and get $25.',
  alternates: { canonical: '/draw' },
  openGraph: {
    title: 'LuckAndLoad Monthly $100 Draw',
    description: 'Exclusive to new Hype.bet players. Drawn live on stream every month.',
    type: 'website',
    siteName: 'LuckAndLoadTV',
    images: [{ url: `${SITE_URL}/draw/monthly-draw.jpg`, width: 1672, height: 941, alt: 'LuckAndLoad monthly $100 draw' }],
  },
}

const TERMS = [
  'Open to new Hype.bet players only: you must create your first Hype.bet account through our link, hype.bet/LuckAndLoad, and make your first ever deposit on Hype.bet in the same calendar month. Players who already had an account can’t enter, even if they move to our code.',
  'You must earn at least 100 XP in the month you sign up. That’s about $100 in bets on slots.',
  'You must be 18 or older, or the legal gambling age where you live if that’s higher. Online gambling must be legal where you live, and Hype.bet’s own terms and country restrictions apply.',
  'One entry per person, household, IP address and payment method. Several accounts mean all of them are left out.',
  'Your first deposit must be your own money. Deposits funded by someone else to qualify for the draw don’t count.',
  'Accounts that Hype.bet has closed, restricted or flagged for bonus abuse can’t win.',
  `The ${PRIZE} prize is paid to the winner’s Hype.bet account. The winner has 7 days to claim it in our Discord or on Kick, or we draw again.`,
  `Finder’s fee: if the winner was referred by another player, that player gets ${FINDERS_FEE} on top. When we contact the winner, they confirm who referred them. You can refer as many friends as you like. No self-referrals.`,
  'Entries and referrals close at the monthly leaderboard cutoff at the end of the month.',
  'Winning the draw doesn’t stop you from winning on our monthly leaderboard.',
  'The LuckAndLoadTV team and our families can’t enter.',
  'We check who qualifies with Hype.bet’s affiliate data, and our decision on the winner is final.',
  'We can change or end the draw at any time. Changes apply from the next month and are posted on this page.',
]

const LINK = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

export default function DrawPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_70%_45%_at_15%_0%,rgba(20,184,184,0.13),transparent_70%),radial-gradient(ellipse_50%_40%_at_100%_10%,rgba(28,228,121,0.06),transparent_70%)] px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        {/* Hero: the headline on the left, the finder's fee on the right */}
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Exclusive to new Hype.bet players</p>
            <h1 className="mt-3 text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-7xl">
              Monthly
              <br />
              <span className="text-brand-400">{PRIZE}</span> Draw
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              One new player wins {PRIZE} every month. We draw the winner live on stream.
            </p>
            <a
              href={HYPE_PLAY_URL}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-hype px-6 py-3.5 text-sm font-bold text-surface-950 shadow-lg shadow-hype/20 transition-colors hover:bg-hype/85"
            >
              Sign up through our link <ExternalLink size={15} />
            </a>
            <p className="mt-2 text-xs text-slate-500">Affiliate link. We may earn a commission at no extra cost to you.</p>
          </div>

          <div className="rounded-2xl border border-hype/50 bg-surface-900/70 p-6 shadow-[0_0_40px_rgba(28,228,121,0.08)] sm:p-7">
            <div className="flex items-center gap-4">
              <Users size={36} strokeWidth={1.75} className="shrink-0 text-hype" />
              <div className="border-l border-white/10 pl-4">
                <p className="text-lg font-black uppercase leading-tight text-white">Refer a friend</p>
                <p className="text-2xl font-black uppercase leading-tight text-hype">{FINDERS_FEE} finder&apos;s fee</p>
              </div>
            </div>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Bring in a new player. If they win, you get {FINDERS_FEE} and they keep the full {PRIZE}. Invite as many
              friends as you like.
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              The winner confirms who referred them. No self-referrals.
            </p>
          </div>
        </section>

        {/* How to enter: two steps in one bar, like the graphic */}
        <section className="mt-14" aria-labelledby="how-to-enter">
          <h2 id="how-to-enter" className="sr-only">How to enter</h2>
          <ol className="grid overflow-hidden rounded-2xl border border-white/10 bg-surface-800/70 sm:grid-cols-2">
            <li className="flex items-start gap-4 p-5 sm:p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-hype/15 text-lg font-black text-hype">1</span>
              <div>
                <p className="font-semibold text-white">Sign up through our link</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Create your first Hype.bet account at{' '}
                  <a href={HYPE_PLAY_URL} target="_blank" rel="sponsored noopener noreferrer" className={LINK}>
                    hype.bet/LuckAndLoad
                  </a>
                  .
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4 border-t border-white/10 p-5 sm:border-l sm:border-t-0 sm:p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-hype/15 text-lg font-black text-hype">2</span>
              <div>
                <p className="font-semibold text-white">Deposit and earn 100 XP</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Make your first deposit and earn 100 XP in the month you signed up. You&apos;re in automatically.
                </p>
              </div>
            </li>
          </ol>
          <p className="mt-3 flex items-start gap-2 px-1 text-sm leading-6 text-amber-200/90">
            <AlertTriangle size={16} className="mt-1 shrink-0 text-amber-300" />
            <span>
              <strong className="text-amber-200">Use our link.</strong> There&apos;s no code to type in at Hype.bet, so the link
              is the only way we can see your account. Signed up without it?{' '}
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
                Message us in Discord
              </a>{' '}
              and we&apos;ll ask Hype.bet&apos;s affiliate team, but it isn&apos;t guaranteed.
            </span>
          </p>
        </section>

        {/* When */}
        <section className="mt-12 flex items-start gap-4 rounded-2xl border border-white/10 bg-surface-900/40 p-5 sm:p-6">
          <CalendarDays size={22} className="mt-0.5 shrink-0 text-brand-400" />
          <div>
            <h2 className="font-bold text-white">When is the winner drawn?</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Live on Kick and Twitch when we pay out the{' '}
              <Link href="/leaderboard" className={LINK}>
                monthly leaderboard
              </Link>
              , in the first week of the next month. We also post the winner in{' '}
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
                our Discord
              </a>
              .
            </p>
          </div>
        </section>

        {/* Terms, folded away */}
        <details className="group mt-4 rounded-2xl border border-white/10 bg-surface-900/40 p-5 sm:p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-white [&::-webkit-details-marker]:hidden">
            Full terms
            <ChevronDown size={18} className="text-slate-400 transition-transform group-open:rotate-180" />
          </summary>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400">
            {TERMS.map(term => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </details>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400">
            Never deposit just to enter a draw, and only play with money you can afford to lose.{' '}
            <Link href="/responsible-gambling" className={LINK}>
              Free help is available
            </Link>
            .
          </p>
          <GamblingNotice className="mt-2" />
        </div>
      </div>
    </div>
  )
}
