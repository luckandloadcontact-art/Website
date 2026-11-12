import Image from 'next/image'
import Link from 'next/link'
import { GuideH2, GuideH3, GuideInlineCta, GuideList, GuideP } from '@/components/guides/GuideContent'
import { HuntOpening } from '@/components/guides/HuntOpening'

// A made-up hunt to show the maths. Break-even = hunt cost / total of all bonus bet sizes.
const EXAMPLE_ROWS = [
  { label: 'Starting balance', value: '$1,000' },
  { label: 'Bonuses collected', value: '20' },
  { label: 'Balance left after collecting', value: '$300' },
  { label: 'Cost of the hunt', value: '$700' },
  { label: 'Bet sizes added up (20 bonuses at $1)', value: '$20' },
  { label: 'Break-even', value: '35x average' },
]

const LINK = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

export default function WhatIsABonusHunt() {
  return (
    <>
      <GuideP>
        A bonus hunt is when you collect bonus rounds on a bunch of different slots, leave them all unopened, and then
        open them one after another at the end. The goal is simple: win back more than the hunt cost you. It&apos;s
        what we do on most of our streams, so here&apos;s how it works.
      </GuideP>

      <GuideH2>How a bonus hunt works</GuideH2>
      <div className="mb-5 flex flex-col gap-6 sm:flex-row sm:items-start">
      <figure className="order-last mx-auto w-full max-w-[14rem] shrink-0">
        <Image
          src="/guides/bonus-hunt-forbidden-fury.jpg"
          alt="The LuckAndLoadTV crew reacting while opening a Forbidden Fury bonus on stream"
          width={480}
          height={753}
          className="w-full rounded-xl border border-white/10"
        />
        <figcaption className="mt-2 text-xs leading-5 text-slate-400">
          Opening a bonus on stream: Forbidden Fury at a $0.60 bet.
        </figcaption>
      </figure>
      <GuideList>
        <li>
          <strong className="text-white">You start with a set balance.</strong> Everything in the hunt comes out of
          this, and it&apos;s also how you measure the result at the end.
        </li>
        <li>
          <strong className="text-white">You collect bonuses.</strong> You spin or buy your way into the bonus round on
          one slot, then leave the bonus unopened and move on to the next game. Slots save the bonus, so it&apos;s
          waiting for you when you come back.
        </li>
        <li>
          <strong className="text-white">You open them all.</strong> Once the list is full or the balance runs low, you
          go back and play the bonuses one by one. Every win is noted as a multiplier of the bet size.
        </li>
        <li>
          <strong className="text-white">You count up the result.</strong> Add up what the bonuses paid, plus whatever
          balance was left, and compare it with where you started.
        </li>
      </GuideList>
      </div>

      <GuideH2>Break-even: the number everyone watches</GuideH2>
      <GuideP>
        Break-even is the average multiplier each bonus needs to pay for the hunt to come out even. It&apos;s the number
        chat keeps an eye on during the opening, because it tells you straight away whether the hunt is going well. Here
        is a made-up example:
      </GuideP>
      <div className="mb-5 max-w-3xl overflow-x-auto">
        <table className="w-full min-w-[20rem] text-left text-sm">
          <tbody className="divide-y divide-white/10 text-slate-200">
            {EXAMPLE_ROWS.map(row => (
              <tr key={row.label}>
                <th scope="row" className="py-3 pr-4 font-normal text-slate-400">{row.label}</th>
                <td className="py-3 text-right font-semibold tabular-nums text-white">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <GuideP>
        The hunt cost $700, and the bet sizes add up to $20. $700 divided by $20 is 35, so each bonus has to pay 35 times
        its bet size on average just to get back to $1,000. One 300x hit can carry a whole hunt, and a row of 10x bonuses
        can sink it. Here&apos;s what that looks like during an opening:
      </GuideP>
      <HuntOpening />

      <GuideH2>Words you&apos;ll hear on stream</GuideH2>
      <GuideList>
        <li>
          <strong className="text-white">Start and cost.</strong> What the hunt started with, and how much of it went
          into collecting the bonuses.
        </li>
        <li>
          <strong className="text-white">BE (break-even).</strong> The average multiplier needed to get your money back.
        </li>
        <li>
          <strong className="text-white">Current average.</strong> What the bonuses opened so far have paid on average.
          Above break-even means the hunt is on track.
        </li>
        <li>
          <strong className="text-white">Super bonus.</strong> A stronger version of a slot&apos;s bonus round, usually
          triggered by landing more scatters.
        </li>
        <li>
          <strong className="text-white">Ante bet.</strong> An optional extra bet that makes bonuses trigger more often,
          in return for a higher cost per spin.
        </li>
      </GuideList>

      <GuideH2>The bonus hunts we run</GuideH2>
      <GuideH3>Classic Bonushunt</GuideH3>
      <GuideP>The standard format: collect a mix of bonuses across our favourite slots, then open them all.</GuideP>
      <GuideH3>No Ante Bonushunt</GuideH3>
      <GuideP>
        Every bonus is collected without the ante bet. Bonuses take longer to trigger, but each spin costs less.
      </GuideP>
      <GuideH3>Supers Only Bonushunt</GuideH3>
      <GuideP>
        We open the regular 3-scatter bonuses straight away and only save the ones that land 4 or 5 scatters. Fewer
        bonuses on the list, but they&apos;re the big ones.
      </GuideP>

      <GuideInlineCta title="Play along with our bonus hunts">
        We stream in a Hype.bet multiplayer room, so you can join during the hunt and share in the result. Jump in or
        leave whenever you want.
      </GuideInlineCta>

      <GuideH2>Can a bonus hunt make money?</GuideH2>
      <GuideP>
        Not on average. Collecting lots of bonuses doesn&apos;t change the odds of any of them. Every slot still has the
        same house edge, so over many hunts you should expect to lose a little of what you put in. What a hunt does is
        bundle the excitement into one opening, which is why it&apos;s fun to watch. It also helps to play the version
        of each slot with the highest RTP,{' '}
        <Link href="/guides/does-rtp-matter" className={LINK}>
          since the same game can pay back less at some casinos
        </Link>
        .
      </GuideP>

      <GuideH2>Watch one live</GuideH2>
      <GuideP>
        The easiest way to understand a bonus hunt is to watch one. Our schedule is on the{' '}
        <Link href="/" className={LINK}>
          home page
        </Link>
        , and you can follow us on{' '}
        <a href="https://kick.com/luckandloadtv" target="_blank" rel="noopener noreferrer" className={LINK}>
          Kick
        </a>{' '}
        to get notified when we go live. If you hunt yourself, set a budget before you start and stick to it. If
        gambling stops being fun,{' '}
        <Link href="/responsible-gambling" className={LINK}>
          there&apos;s free help available
        </Link>
        .
      </GuideP>
    </>
  )
}
