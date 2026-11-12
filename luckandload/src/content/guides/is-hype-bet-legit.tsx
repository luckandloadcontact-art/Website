import Image from 'next/image'
import Link from 'next/link'
import { GuideH2, GuideInlineCta, GuideList, GuideP } from '@/components/guides/GuideContent'
import { RatingBreakdown } from '@/components/guides/RatingBreakdown'

// Trustpilot, November 2026: 120 reviews, TrustScore 3.3.
const TRUSTPILOT_ROWS = [
  { stars: 5, percent: 54 },
  { stars: 4, percent: 7 },
  { stars: 3, percent: 0.5, display: '<1%' },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 36 },
]

const FACTS = [
  { label: 'Operator', value: 'BlackSands B.V.' },
  { label: 'License', value: 'Curaçao Gaming Authority, OGL/2024/985/0430' },
  { label: 'Payments', value: 'Crypto and Interac' },
  { label: 'Game providers', value: 'Hacksaw Gaming, Nolimit City, Pragmatic Play and more' },
  { label: 'Trustpilot (November 2026)', value: '3.3 out of 5 from 120 reviews' },
]

const LINK = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

export default function IsHypeBetLegit() {
  return (
    <>
      <GuideP>
        Yes, Hype.bet is a legit online casino. It&apos;s licensed in Curaçao, it runs games from the big, well-known
        studios, and it pays out. We&apos;ve streamed and played there for more than a year, and neither we nor the
        players under our code have run into any significant problems. It does have some angry reviews online, though,
        so here&apos;s what they&apos;re about and how to avoid the same issues.
      </GuideP>

      <GuideH2>Who runs Hype.bet?</GuideH2>
      <div className="mb-5 max-w-3xl overflow-x-auto">
        <table className="w-full min-w-[22rem] text-left text-sm">
          <tbody className="divide-y divide-white/10 text-slate-200">
            {FACTS.map(row => (
              <tr key={row.label}>
                <th scope="row" className="w-48 py-3 pr-4 align-top font-normal text-slate-400">{row.label}</th>
                <td className="py-3">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <GuideP>
        A Curaçao license is the most common license for crypto casinos. It&apos;s not as strict as the regulators in
        countries like the UK or Sweden, so it&apos;s worth checking that online casinos are allowed where you live
        before you sign up.
      </GuideP>

      <GuideH2>Are the games on Hype.bet rigged?</GuideH2>
      <GuideP>
        No. Slots from studios like Hacksaw Gaming, Nolimit City and Pragmatic Play run on the studios&apos; own certified
        game servers, so a casino can&apos;t change the result of a spin. What a casino can choose is which RTP version
        of a game it runs, and Hype.bet runs the highest RTP versions available.{' '}
        <Link href="/guides/does-rtp-matter" className={LINK}>
          Here&apos;s why that matters
        </Link>
        . Losing streaks happen on every casino, and they&apos;re behind most &quot;rigged&quot; reviews you&apos;ll
        find.
      </GuideP>

      <GuideH2>What players say about Hype.bet</GuideH2>
      <GuideP>
        On{' '}
        <a href="https://www.trustpilot.com/review/hype.bet" target="_blank" rel="nofollow noopener noreferrer" className={LINK}>
          Trustpilot
        </a>
        , Hype.bet scores 3.3 out of 5 from 120 reviews. Most reviews are either 5 stars or 1 star, which is normal for
        casinos: happy players rarely write reviews, while players who lost or got stuck often do.
      </GuideP>
      <RatingBreakdown
        title="Hype.bet on Trustpilot: share of reviews by rating"
        rows={TRUSTPILOT_ROWS}
        caption="120 reviews, 3.3 out of 5. Figures from Trustpilot, checked November 2026."
      />
      <GuideList>
        <li>
          <strong className="text-white">What people like:</strong> fast deposits and withdrawals (one player got an
          Interac withdrawal in under an hour), the multiplayer rooms with streamers, the slot selection and helpful
          support.
        </li>
        <li>
          <strong className="text-white">What people complain about:</strong> ID checks when withdrawing, restricted or
          closed accounts, and claims that the games are rigged.
        </li>
      </GuideList>
      <GuideP>
        Hype.bet replies to almost every negative review. For account issues, it asks players to contact support, since
        it can&apos;t discuss individual accounts in public.
      </GuideP>

      <figure className="mb-6 max-w-3xl">
        <Image
          src="/casinos/hype-double-xp-rooms.png"
          alt="Hype.bet banner showing a multiplayer room, where players share every spin with the host"
          width={1184}
          height={286}
          className="w-full rounded-xl border border-white/10"
        />
        <figcaption className="mt-2 text-xs text-slate-400">
          The multiplayer rooms are what players praise most, and they&apos;re why we stream on Hype.bet.
        </figcaption>
      </figure>

      <GuideInlineCta title="See it for yourself on Hype.bet">
        Join our multiplayer room when we&apos;re live and watch how it works before you play. Players under our code
        also compete on our monthly leaderboard.
      </GuideInlineCta>

      <GuideH2>How to avoid problems with withdrawals</GuideH2>
      <GuideP>Most complaints come down to a few things you can sort out before they become a problem:</GuideP>
      <GuideList>
        <li>
          <strong className="text-white">Verify your account early.</strong> Like most casinos, Hype.bet can ask for ID
          before a withdrawal. Get it done before you need your money, not after.
        </li>
        <li>
          <strong className="text-white">Stick to one account.</strong> The welcome bonus is limited to one per person,
          household, IP address and payment method. A second account in the same home can get both closed.
        </li>
        <li>
          <strong className="text-white">Read the bonus terms.</strong> The minimum withdrawal is $50, and you need at
          least 1,000 XP before winnings can be withdrawn. Our{' '}
          <Link href="/casinos/hype-bet" className={LINK}>
            Hype.bet bonus code page
          </Link>{' '}
          explains the rest.
        </li>
        <li>
          <strong className="text-white">Keep your details up to date.</strong> Changing your email or payment method
          can trigger a new ID check, so expect one if you do.
        </li>
      </GuideList>

      <GuideH2>Our verdict: is Hype.bet safe?</GuideH2>
      <GuideP>
        Hype.bet is a real, licensed casino with games from trusted studios, and after more than a year there, we
        haven&apos;t had any significant problems. It&apos;s a Curaçao casino, not an EU-regulated one, so verify your
        account early and play within the terms. Do that, and it&apos;s as safe as any casino of its kind.
      </GuideP>
      <GuideP>
        Whatever you decide, only play with money you can afford to lose. If gambling stops being fun,{' '}
        <Link href="/responsible-gambling" className={LINK}>
          there&apos;s free help available
        </Link>
        .
      </GuideP>
    </>
  )
}
