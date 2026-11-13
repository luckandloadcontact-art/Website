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

// How we size bets with a $2,000 starting balance (Kristian, November 2026).
const BET_ROWS = [
  { type: 'Slots with a 3x ante (like most Hacksaw slots)', base: '$0.60', cost: '$1.80', chase: 'About 50 spins at most' },
  { type: 'Slots with a 2x ante', base: '$0.80', cost: '$1.60', chase: 'A bit over 50, then often a few El Manuel spins' },
  { type: 'Slots without an ante', base: '$1 or more', cost: '$1 or more', chase: 'Well over 50 spins is fine' },
]

const LINK = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

export default function WhatIsABonusHunt() {
  return (
    <>
      <GuideP>
        A bonus hunt is when you collect bonus rounds on a bunch of different slots, leave them all unopened, and then
        open them one after another at the end. The goal is simple: win back more than the hunt cost you. We run one on
        almost every stream, so here&apos;s how it works, and what we&apos;ve learned from doing a lot of them.
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
          waiting for you when you come back. Can&apos;t decide which slot to collect next? Our{' '}
          <Link href="/slot-wheel" className={LINK}>
            random slot picker
          </Link>{' '}
          can choose for you.
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
      <GuideInlineCta title="Play along with our bonus hunts">
        We stream in a Hype.bet multiplayer room, so you can join during the hunt and share in the result. Jump in or
        leave whenever you want.
      </GuideInlineCta>

      <GuideH2>Choosing your bet size</GuideH2>
      <GuideP>
        The bigger your bet, the fewer bonuses your balance can collect, and the more the whole hunt depends on just a
        few of them. That makes it a lot more volatile. Our own bet sizes change from stream to stream, depending on how
        much people add to our room. With a $2,000 starting balance, this is roughly how we do it:
      </GuideP>
      <div className="mb-5 max-w-3xl overflow-x-auto">
        <table className="w-full min-w-[30rem] text-left text-sm">
          <thead className="border-b border-white/20 text-white">
            <tr>
              <th scope="col" className="py-3 pr-4 font-semibold">Slot type</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Base bet</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Cost per spin</th>
              <th scope="col" className="py-3 font-semibold">How long we chase a bonus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {BET_ROWS.map(row => (
              <tr key={row.type}>
                <th scope="row" className="py-3 pr-4 font-normal">{row.type}</th>
                <td className="py-3 pr-4 tabular-nums">{row.base}</td>
                <td className="py-3 pr-4 tabular-nums">{row.cost}</td>
                <td className="py-3 text-slate-300">{row.chase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <GuideP>
        Chasing a bonus with the ante on gets expensive fast: 50 spins at $1.80 is already $90. On slots without an ante,
        the base game tends to give you more back while you wait, so in our experience you can spin for a lot longer.
      </GuideP>

      <GuideH2>Open the wildest bonuses last</GuideH2>
      <GuideP>
        The order you open the bonuses in doesn&apos;t change what they pay, but it changes how the hunt plays out. We
        save the super bonuses for the end, together with the most volatile slots. You&apos;d much rather have a wild
        Nolimit City bonus left at the end, when one hit can still turn the whole hunt around, than a calm Big Bass game.
      </GuideP>

      <GuideH2>Bonus hunt terms you&apos;ll hear on stream</GuideH2>
      <GuideList>
        <li>
          <strong className="text-white">BE (break-even).</strong> The average multiplier needed to get your money back.
        </li>
        <li>
          <strong className="text-white">Super bonus.</strong> A stronger version of a slot&apos;s bonus round, usually
          triggered by landing more scatters.
        </li>
        <li>
          <strong className="text-white">Ante bet.</strong> An optional extra bet that makes bonuses trigger more often,
          in return for a higher cost per spin.
        </li>
        <li>
          <strong className="text-white">El Manuel.</strong> Our own one. When the autoplay runs out, we hit a few spins
          by hand. If the bonus lands on one of those, that&apos;s an El Manuel.
        </li>
      </GuideList>

      <GuideH2>The bonus hunts we run</GuideH2>
      <GuideP>
        Almost every stream starts with a bonus hunt, and once it&apos;s opened we carry on with regular spins and bonus
        buys. Spreading the balance over a whole list of bonuses keeps the swings smaller than a few big buys would, so
        we rarely lose the whole balance in one go. To stop it getting boring, we mix up the format:
      </GuideP>
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
      <GuideH3>Open one, keep one</GuideH3>
      <GuideP>
        Every other bonus is opened straight away, and the next one is saved for the list. The wins from the ones you
        open go back into the hunt, which can bring the break-even down a lot. One of our favourite concepts.
      </GuideP>
      <GuideH3>Themed hunts</GuideH3>
      <GuideP>
        Sometimes we only collect bonuses from one series of games. A Big Bass only hunt was a disaster, and a hunt with
        nothing but Hacksaw&apos;s &quot;Le&quot; games is one we can&apos;t recommend either. They&apos;re fun to try
        once, though.
      </GuideP>

      <GuideH2>Can a bonus hunt make money?</GuideH2>
      <GuideP>
        Not on average. Collecting lots of bonuses doesn&apos;t change the odds of any of them, and every slot keeps its
        house edge. What a hunt does is bundle the excitement into one opening. Playing the highest RTP version of each
        slot helps,{' '}
        <Link href="/guides/does-rtp-matter" className={LINK}>
          since the same game can pay back less at some casinos
        </Link>
        . If you hunt yourself, set a budget before you start and stick to it. If gambling stops being fun,{' '}
        <Link href="/responsible-gambling" className={LINK}>
          there&apos;s free help available
        </Link>
        .
      </GuideP>
      <GuideP>
        The easiest way to understand a bonus hunt is to watch one. Our schedule is on the{' '}
        <Link href="/" className={LINK}>
          home page
        </Link>
        , or follow us on{' '}
        <a href="https://kick.com/luckandloadtv" target="_blank" rel="noopener noreferrer" className={LINK}>
          Kick
        </a>{' '}
        to get notified when we go live.
      </GuideP>
    </>
  )
}
