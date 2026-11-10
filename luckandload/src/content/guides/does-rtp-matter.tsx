import Link from 'next/link'
import { GuideH2, GuideInlineCta, GuideList, GuideP } from '@/components/guides/GuideContent'
import { RtpCostChart } from '@/components/guides/RtpCostChart'

// RTP versions from SlotCatalog (checked November 2026).
// Cost = $1,000 bet x (100% - RTP).
const WANTED_ROWS = [
  { rtp: '96.38%', label: 'Top version', cost: 36.2 },
  { rtp: '94.55%', cost: 54.5 },
  { rtp: '92.33%', cost: 76.7 },
  { rtp: '88.42%', label: 'Lowest version', cost: 115.8 },
]

const SOURCE_LINK = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

export default function DoesRtpMatter() {
  return (
    <>
      <GuideP>
        Yes, and a lot more than most players think. The same slot can pay back 96% at one casino and 88% at another,
        and you won&apos;t see the difference on the screen. Over a few hundred spins, that gap can cost you three times as
        much.
      </GuideP>

      <GuideH2>What is RTP?</GuideH2>
      <GuideP>
        RTP stands for return to player. It&apos;s how much of all the money bet on a game the game pays back over
        time. A slot with 96% RTP pays back $96 for every $100 bet on average, and the casino keeps the other $4. That
        $4 is the house edge.
      </GuideP>
      <GuideP>
        RTP is worked out over millions of spins, so it says nothing about how your next session will go. You can hit a
        big win on a low RTP game, or lose fast on a high one. What RTP does tell you is how quickly your money goes on
        average, and over time that adds up.
      </GuideP>

      <GuideH2>The same slot, different RTP</GuideH2>
      <GuideP>
        Here&apos;s what most players don&apos;t know: game providers make several versions of the same slot, each with
        its own RTP. The casino picks which version it runs. The game looks and plays exactly the same, but the lower
        versions pay back less.
      </GuideP>
      <GuideList>
        <li>
          <strong className="text-white">Hacksaw Gaming:</strong> Wanted Dead or a Wild has a top RTP of 96.38%, but
          casinos can run it at 94.55%, 92.33% or 88.42% instead, according to{' '}
          <a
            href="https://slotcatalog.com/en/slots/Wanted-Dead-or-a-Wild"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className={SOURCE_LINK}
          >
            SlotCatalog
          </a>
          .
        </li>
        <li>
          <strong className="text-white">Nolimit City:</strong> Bounty Hunters runs at 96.07% at most, and can be set
          down to 94.14% or 92.18%. Across its games, Nolimit City offers RTP settings{' '}
          <a
            href="https://www.casinos.com/nolimit-city"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className={SOURCE_LINK}
          >
            anywhere between 84% and 97%
          </a>
          .
        </li>
      </GuideList>
      <GuideP>
        Why would a casino pick a lower version? Because it earns more on every spin. Some markets also have rules that
        limit which versions can be used.
      </GuideP>

      <GuideH2>What it costs you</GuideH2>
      <GuideP>Say you play 1,000 spins at $1 on Wanted Dead or a Wild. That&apos;s $1,000 bet in total.</GuideP>
      <RtpCostChart
        title="Wanted Dead or a Wild: average cost of 1,000 spins at $1"
        rows={WANTED_ROWS}
        caption="RTP versions from SlotCatalog. These are long-run averages, and any single session can go much better or worse."
      />
      <GuideP>
        Same game, same bets, same spins. On the lowest version you lose more than three times as much on average. If
        you&apos;re clearing a bonus, the gap grows with every dollar you have to wager.
      </GuideP>

      <GuideInlineCta title="Play the top RTP versions on Hype.bet">
        Hype.bet runs the highest RTP versions available on its games. We&apos;ve played there for more than a year, and
        players under our code also get our monthly leaderboard on top.
      </GuideInlineCta>

      <GuideH2>Big rewards can hide a lower RTP</GuideH2>
      <GuideP>
        If a casino offers unusually generous rakeback, lossback or cashback, it&apos;s worth asking how it pays for it.
        Quite often, the answer is lower RTP versions on the games. The reward looks great on the promotions page, while
        the cost is hidden in every spin.
      </GuideP>
      <GuideP>
        Here&apos;s a rough example. On the 88.42% version of Wanted, you lose about $11.58 per $100 bet on average. Get
        20% of that back as lossback and you&apos;re still down about $9.26. On the 96.38% version, you lose about $3.62
        with no lossback at all. A big reward can&apos;t make up for a much worse game.
      </GuideP>
      <GuideP>
        That doesn&apos;t mean every casino with good rewards runs low RTP. It means you should check, rather than
        assume.
      </GuideP>

      <GuideH2>How to check the RTP</GuideH2>
      <GuideList>
        <li>
          <strong className="text-white">Open the game&apos;s info menu.</strong> Look for the &quot;i&quot; icon or the
          paytable. Most providers, including Hacksaw and Nolimit City, list the RTP of the version you&apos;re playing in
          the game rules.
        </li>
        <li>
          <strong className="text-white">Compare it with the top RTP.</strong> Search for the slot name and RTP, and see
          what the highest version is. If your casino shows a lower number, it runs a lower version.
        </li>
        <li>
          <strong className="text-white">Check a few games, not just one.</strong> A casino that runs one game at a lower
          RTP usually does the same on others.
        </li>
        <li>
          <strong className="text-white">Check the bonus buy too.</strong> Bonus buys can have their own RTP, which is
          listed separately in the game rules.
        </li>
      </GuideList>

      <GuideH2>The short version</GuideH2>
      <GuideP>
        RTP doesn&apos;t decide whether you win today, but it decides how much you lose over time. Picking a casino that
        runs the top versions is one of the easiest ways to make your money last longer. Rewards are a nice extra, but
        the RTP comes first.
      </GuideP>
      <GuideP>
        Whatever you play, set a budget before you start and stop when you hit it. If gambling stops being fun,{' '}
        <Link href="/responsible-gambling" className={SOURCE_LINK}>
          there&apos;s free help available
        </Link>
        .
      </GuideP>
    </>
  )
}
