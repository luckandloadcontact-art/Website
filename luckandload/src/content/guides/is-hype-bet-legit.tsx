import Image from 'next/image'
import Link from 'next/link'
import {
  GuideDetails,
  GuideDetailsGroup,
  GuideH2,
  GuideInlineCta,
  GuideList,
  GuideP,
  JsonLd,
} from '@/components/guides/GuideContent'
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

// Our own numbers (November 2026).
const EXPERIENCE = [
  { value: '1+ year', label: 'Streaming on Hype.bet' },
  { value: '<20 min', label: 'Our usual crypto withdrawal time' },
  { value: '$10,000+', label: 'Paid to our room players by the room wheel' },
  { value: '$15,000+', label: 'Given away in our first year' },
]

// What people search about Hype.bet's safety. Also sent to Google as FAQPage data.
const FAQ = [
  {
    question: 'Is Hype.bet legit?',
    answer:
      'Yes. Hype.bet is run by BlackSands B.V. and licensed in Curaçao (OGL/2024/985/0430). We have streamed and played there for more than a year without any significant problems.',
  },
  {
    question: 'Is Hype.bet safe?',
    answer:
      'It is a licensed casino with games from trusted studios like Hacksaw Gaming, Nolimit City and Pragmatic Play. It is regulated in Curaçao rather than in the EU, so verify your account early and play within the terms.',
  },
  {
    question: 'Is Hype.bet a scam?',
    answer:
      'No. It pays out: our own crypto withdrawals usually arrive in under 20 minutes. Most scam claims we see online are about losing streaks, ID checks or restricted accounts.',
  },
  {
    question: 'How long do Hype.bet withdrawals take?',
    answer:
      'In our experience, crypto withdrawals in Bitcoin and Ethereum usually arrive in under 20 minutes. The minimum withdrawal is $50, and Hype.bet can ask for ID before your first withdrawal.',
  },
  {
    question: 'Does Hype.bet ask for ID?',
    answer:
      'It can, but in our experience it is quick, and it mostly happens when something about an account looks unusual. Like most casinos, Hype.bet may also ask after you change your email or payment method.',
  },
  {
    question: 'Does Hype.bet have good customer support?',
    answer:
      'Yes. Support is available 24/7, and in our experience it is quick and helpful. It is also one of the things players praise most in their reviews.',
  },
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

      <GuideH2>Our experience after a year on Hype.bet</GuideH2>
      <dl className="mb-5 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {EXPERIENCE.map(item => (
          <div key={item.label} className="rounded-xl border border-white/10 bg-surface-800 p-4">
            <dt className="sr-only">{item.label}</dt>
            <dd className="text-xl font-bold tabular-nums text-hype">{item.value}</dd>
            <dd className="mt-1 text-xs leading-5 text-slate-400">{item.label}</dd>
          </div>
        ))}
      </dl>
      <GuideP>
        We stream on Hype.bet almost every week, and players join our multiplayer room on every stream. Our own
        withdrawals in Bitcoin and Ethereum usually arrive in under 20 minutes, and players under our code tell us the
        same. On top of our monthly leaderboard, the wheel we spin in our room has paid out more than $10,000 to our
        players.
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
        of a game it runs. Hype.bet shows the RTP right under every game, and the slots we play most run on their top
        versions.{' '}
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

      <GuideInlineCta title="See it for yourself on Hype.bet">
        Join our multiplayer room when we&apos;re live and watch how it works before you play. Players under our code
        also compete on our monthly leaderboard.
      </GuideInlineCta>

      <GuideH2>How to avoid problems with withdrawals</GuideH2>
      <GuideP>Most complaints come down to a few things you can sort out before they become a problem:</GuideP>
      <GuideList>
        <li>
          <strong className="text-white">Verify your account early.</strong> Like most casinos, Hype.bet can ask for ID
          before a withdrawal. In our experience the check is quick, and it mostly happens when something about an
          account looks unusual. Hype.bet&apos;s support is open 24/7 if you get stuck.
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

      <GuideH2>Questions about Hype.bet</GuideH2>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }}
      />
      <GuideDetailsGroup>
        {FAQ.map(item => (
          <GuideDetails key={item.question} summary={item.question}>
            <GuideP>{item.answer}</GuideP>
          </GuideDetails>
        ))}
      </GuideDetailsGroup>

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
