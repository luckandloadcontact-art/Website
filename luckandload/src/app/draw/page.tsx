import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, CalendarDays, ExternalLink, Ticket, Users } from 'lucide-react'
import { GamblingNotice } from '@/components/ui/GamblingNotice'
import { HYPE_PLAY_URL } from '@/lib/slotWheel'
import { SITE_URL } from '@/lib/guides'

// Monthly $100 draw for new Hype.bet players who sign up under LuckAndLoad, plus a $25 finder's fee
// for the player who referred the winner. Linked from the pop-up on the home page.
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
    <div className="min-h-screen px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <header className="mb-10">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-hype/30 bg-hype/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-hype">
            <Ticket size={13} /> New Hype.bet players only
          </p>
          <h1 className="text-4xl font-black uppercase leading-none text-white sm:text-6xl">
            Monthly <span className="text-brand-400">{PRIZE}</span> Draw
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Every month, one new Hype.bet player who joined under LuckAndLoad wins {PRIZE}. Sign up through our link, make
            your first deposit and earn 100 XP, and you&apos;re in. We draw the winner live on stream.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={HYPE_PLAY_URL}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-hype px-5 py-3 text-sm font-bold text-surface-950 transition-colors hover:bg-hype/85"
            >
              Sign up through our link <ExternalLink size={15} />
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              Join our Discord
            </a>
          </div>
          <p className="mt-2 text-xs text-slate-500">Affiliate link. We may earn a commission at no extra cost to you.</p>
        </header>

        {/* Use our link */}
        <div className="mb-10 flex gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-300" />
          <div>
            <p className="font-bold text-amber-200">Important: remember to use our link</p>
            <p className="mt-1 text-sm leading-6 text-slate-200">
              Only players who sign up through{' '}
              <a href={HYPE_PLAY_URL} target="_blank" rel="sponsored noopener noreferrer" className="font-semibold text-white underline underline-offset-2">
                hype.bet/LuckAndLoad
              </a>{' '}
              are entered. There&apos;s no code to type in at Hype.bet: the link is what connects your account to us. If you
              sign up any other way, we can&apos;t see your account and you won&apos;t be in the draw.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Already signed up without the link? Message us in{' '}
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
                our Discord
              </a>{' '}
              and we&apos;ll ask Hype.bet&apos;s affiliate team if your account can be added. That isn&apos;t guaranteed, so
              use the link from the start.
            </p>
          </div>
        </div>

        {/* How to enter */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-white">How to enter</h2>
          <ol className="grid gap-3 sm:grid-cols-2">
            <li className="flex gap-4 rounded-2xl border border-white/10 bg-surface-800 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-hype/15 text-lg font-black text-hype">1</span>
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
            <li className="flex gap-4 rounded-2xl border border-white/10 bg-surface-800 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-hype/15 text-lg font-black text-hype">2</span>
              <div>
                <p className="font-semibold text-white">Deposit and earn 100 XP</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Make your first deposit and earn 100 XP in the same calendar month you signed up. That&apos;s it, you&apos;re
                  in the draw automatically.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* Refer a friend */}
        <section className="mb-10 rounded-2xl border border-hype/40 bg-surface-800 p-6">
          <div className="flex items-center gap-3">
            <Users size={22} className="text-hype" />
            <h2 className="text-2xl font-bold text-white">
              Refer a friend: <span className="text-hype">{FINDERS_FEE} finder&apos;s fee</span>
            </h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Already playing under LuckAndLoad? If you bring in a new player and they win the {PRIZE} draw, you get{' '}
            {FINDERS_FEE}. Your friend still keeps the full {PRIZE}.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-400">
            <li>Your friend must be a new Hype.bet player who signs up through our link.</li>
            <li>When we contact the winner, they confirm that you referred them.</li>
            <li>Invite as many friends as you like: the more you bring, the better your chances. No self-referrals.</li>
          </ul>
        </section>

        {/* When */}
        <section className="mb-10">
          <div className="flex items-center gap-3">
            <CalendarDays size={20} className="text-brand-400" />
            <h2 className="text-2xl font-bold text-white">When is the winner drawn?</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            We pick one winner at random, live on Kick and Twitch, when we pay out the{' '}
            <Link href="/leaderboard" className={LINK}>
              monthly leaderboard
            </Link>{' '}
            in the first week of the next month. We also announce the winner in our Discord.
          </p>
        </section>

        {/* Terms */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-bold text-white">Terms</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400">
            {TERMS.map(term => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </section>

        <p className="text-sm leading-6 text-slate-400">
          Never deposit just to enter a draw, and only play with money you can afford to lose. If gambling stops being fun,{' '}
          <Link href="/responsible-gambling" className={LINK}>
            there&apos;s free help available
          </Link>
          .
        </p>
        <GamblingNotice className="mt-3" />
      </div>
    </div>
  )
}
