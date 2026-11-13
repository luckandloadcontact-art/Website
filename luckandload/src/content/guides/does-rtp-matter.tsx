import Image from 'next/image'
import Link from 'next/link'
import {
  GuideDetails,
  GuideDetailsGroup,
  GuideH2,
  GuideH3,
  GuideInlineCta,
  GuideList,
  GuideP,
  JsonLd,
} from '@/components/guides/GuideContent'
import { RtpCostChart } from '@/components/guides/RtpCostChart'

// RTP versions from SlotCatalog (checked November 2026).
// Cost = $1,000 bet x (100% - RTP).
const WANTED_ROWS = [
  { rtp: '96.38%', label: 'Top version', cost: 36.2 },
  { rtp: '94.55%', cost: 54.5 },
  { rtp: '92.33%', cost: 76.7 },
  { rtp: '88.42%', label: 'Lowest version', cost: 115.8 },
]

// Top RTP and the lower versions casinos can choose instead (SlotCatalog, November 2026).
const HACKSAW_ROWS = [
  { game: 'Wanted Dead or a Wild', top: '96.38%', lower: '94.55%, 92.33%, 88.42%' },
  { game: 'Le Bandit', top: '96.34%', lower: '94.23%, 92.17%, 88.36%' },
  { game: 'RIP City', top: '96.22%', lower: '94.27%, 92.32%, 88.02%' },
]

const NOLIMIT_ROWS = [
  { game: 'Bounty Hunters', top: '96.07%', lower: '94.14%, 92.18%' },
  { game: 'Tombstone RIP', top: '96.08%', lower: '94.08%' },
]

// Sugar Rush 1000: sources disagree on the top version (SlotCatalog lists 97.5%), so the table
// shows the standard 96.53% and the text mentions the 97.5% listing.
const PRAGMATIC_ROWS = [
  { game: 'Zeus vs Hades – Gods of War', top: '96.07%', lower: '95.05%, 94.05%' },
  { game: 'Sugar Rush 1000', top: '96.53%', lower: '95.50%' },
]

// Short answers to what people search about RTP. Also sent to Google as FAQPage data.
const FAQ = [
  {
    question: 'What does RTP mean in slots?',
    answer:
      'RTP stands for return to player. It is the share of all the money bet on a slot that the slot pays back over time. A 96% RTP slot pays back $96 for every $100 bet on average, and the casino keeps $4.',
  },
  {
    question: 'What is a good RTP for a slot?',
    answer:
      'Most modern slots sit around 96% on their top version. If a slot shows around 94% or less, the casino is usually running a lowered version of it.',
  },
  {
    question: 'Can a casino change the RTP of a slot?',
    answer:
      'Not on the fly, but it can choose which version to run. Studios like Hacksaw Gaming and Nolimit City release several RTP versions of the same game, and each casino picks one.',
  },
  {
    question: 'What RTP does Hacksaw Gaming use?',
    answer:
      'Hacksaw slots usually come in four versions: around 96%, 94%, 92% and 88%. Wanted Dead or a Wild, for example, is 96.38% at the top and 88.42% at the bottom.',
  },
  {
    question: 'What RTP does Nolimit City use?',
    answer:
      'Nolimit City slots are usually around 96% on their top version, with lower versions around 94% and 92%. Bounty Hunters is 96.07% at the top, and can be set to 94.14% or 92.18%.',
  },
  {
    question: 'How do I see the RTP on Hype.bet?',
    answer:
      'Hype.bet shows the RTP right under the game name at the bottom of the game window, on every slot. On most other casinos you have to open the game info or paytable to find it.',
  },
  {
    question: 'Is the bonus buy RTP the same as the base game?',
    answer:
      'Not always. Bonus buys often have their own RTP. On Mental by Nolimit City the bonus buys are 96.17% to 96.68%, above the base game, while Chaos Crew by Hacksaw drops from 96.3% to 95.92% when you buy the bonus.',
  },
]

const SOURCE_LINK = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

function RtpVersionTable({
  rows,
  topLabel = 'Top RTP',
}: {
  rows: { game: string; top: string; lower: string }[]
  topLabel?: string
}) {
  return (
    <div className="mb-5 max-w-3xl overflow-x-auto">
      <table className="w-full min-w-[24rem] text-left text-sm">
        <thead className="border-b border-white/20 text-white">
          <tr>
            <th scope="col" className="py-3 pr-4 font-semibold">Slot</th>
            <th scope="col" className="py-3 pr-4 font-semibold">{topLabel}</th>
            <th scope="col" className="py-3 font-semibold">Lower versions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 text-slate-200">
          {rows.map(row => (
            <tr key={row.game}>
              <th scope="row" className="py-3 pr-4 font-normal">{row.game}</th>
              <td className="py-3 pr-4 font-semibold tabular-nums text-hype">{row.top}</td>
              <td className="py-3 tabular-nums text-slate-400">{row.lower}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function DoesRtpMatter() {
  return (
    <>
      <GuideP>
        Yes, and a lot more than most players think. The same slot can pay back 96% at one casino and 88% at another,
        and you won&apos;t see the difference on the screen. Over a few hundred spins, that gap can cost you three times as
        much.
      </GuideP>

      <GuideH2>We didn&apos;t care about RTP. We should have.</GuideH2>
      <GuideP>
        Before we started streaming, Kristian and I didn&apos;t think RTP mattered much. We just played. Looking back,
        we wish we&apos;d paid attention to it from the day we started gambling. Playing the highest RTP version
        doesn&apos;t mean you&apos;ll win, because in the long run the casino always comes out ahead. It just gives you the
        best odds you can get.
      </GuideP>
      <GuideP>
        Think of it like sports betting. If one site offers odds of 2.4 on a match and another offers 3.7 on the same
        match, it&apos;s a no-brainer to pick 3.7. We recommend the same mindset for RTP. It&apos;s one of the reasons we
        like Hype.bet: we play so much that a few percent makes a huge difference over time, both for us and for the
        players in our room.
      </GuideP>

      <GuideH2>What is RTP?</GuideH2>
      <GuideP>
        RTP stands for return to player. It&apos;s how much of all the money bet on a game the game pays back over
        time. A slot with 96% RTP pays back $96 for every $100 bet on average, and the casino keeps the other $4. That
        $4 is the house edge. RTP is worked out over millions of spins, so it says nothing about your next session, only
        how quickly your money goes on average.
      </GuideP>

      <GuideH2>The same slot, different RTP</GuideH2>
      <GuideP>
        Here&apos;s what most players don&apos;t know: game providers make several versions of the same slot, each with
        its own RTP. The casino picks which version it runs. The game looks and plays exactly the same, but the lower
        versions pay back less.
      </GuideP>
      <GuideP>
        Why would a casino pick a lower version? Because it earns more on every spin. Some markets also have rules that
        limit which versions can be used. Here&apos;s what that looks like at two of the studios we play the most. The
        figures come from{' '}
        <a href="https://slotcatalog.com/" target="_blank" rel="nofollow noopener noreferrer" className={SOURCE_LINK}>
          SlotCatalog
        </a>
        .
      </GuideP>

      <GuideH3>Hacksaw Gaming RTP versions</GuideH3>
      <GuideP>
        Hacksaw usually makes four versions of each slot: one around 96%, and lower ones around 94%, 92% and 88%.
      </GuideP>
      <RtpVersionTable rows={HACKSAW_ROWS} />

      <GuideH3>Nolimit City RTP versions</GuideH3>
      <GuideP>
        Nolimit City&apos;s top versions sit around 96%, with lower versions around 94% and 92%. Across its catalogue,
        the studio offers RTP settings{' '}
        <a href="https://www.casinos.com/nolimit-city" target="_blank" rel="nofollow noopener noreferrer" className={SOURCE_LINK}>
          anywhere between 84% and 97%
        </a>
        .
      </GuideP>
      <RtpVersionTable rows={NOLIMIT_ROWS} />

      <GuideH3>Pragmatic Play RTP versions</GuideH3>
      <GuideP>
        Pragmatic slots usually come in a few versions about one percentage point apart. For Sugar Rush 1000, 96.53% is
        the standard version, and SlotCatalog also lists a 97.5% version.
      </GuideP>
      <RtpVersionTable rows={PRAGMATIC_ROWS} topLabel="Standard RTP" />

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

      <GuideInlineCta title="See the RTP on every slot at Hype.bet">
        Hype.bet shows the RTP on every slot, and runs the top versions of the games we play most, like Wanted Dead or a
        Wild and Zeus vs Hades. Players under our code also get our monthly leaderboard on top.
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
      <GuideH3>On Hype.bet</GuideH3>
      <GuideP>
        Hype.bet shows the RTP right under the game name, on every slot, so you don&apos;t have to dig for it. Here are
        three of the slots we play the most:
      </GuideP>
      <figure className="mb-6">
        <Image
          src="/guides/hype-rtp-bars.png"
          alt="RTP shown under the game name on Hype.bet: Wanted Dead or a Wild 96.38%, Zeus vs Hades 96.07%, Sugar Rush 1000 96.53%"
          width={440}
          height={272}
          className="w-full max-w-[440px] rounded-xl border border-white/10"
        />
        <figcaption className="mt-2 text-xs text-slate-400">
          Screenshots from Hype.bet. Wanted and Zeus vs Hades are on their top versions.
        </figcaption>
      </figure>
      <GuideH3>On other casinos</GuideH3>
      <GuideP>
        Most casinos don&apos;t show it up front, so you have to look in the game itself. Open the menu, go to the game
        info or paytable, and look for &quot;RTP&quot; or &quot;theoretical payout&quot;.
      </GuideP>
      <figure className="mb-6 max-w-3xl">
        <Image
          src="/guides/wanted-game-info-rtp.jpg"
          alt="The game info screen in Wanted Dead or a Wild, saying the theoretical payout (RTP) for this game is 96.38%"
          width={1204}
          height={671}
          className="w-full rounded-xl border border-white/10"
        />
        <figcaption className="mt-2 text-xs text-slate-400">
          The game info in Wanted Dead or a Wild: &quot;The theoretical payout (RTP) for this game is 96.38%.&quot;
        </figcaption>
      </figure>
      <GuideList>
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

      <GuideH2>Bonus buy RTP</GuideH2>
      <GuideP>
        Buying the bonus doesn&apos;t always pay back the same as spinning for it. On Mental by Nolimit City, the three
        bonus buys pay back 96.17% to 96.68%, a little more than the 96.06% base game. On Chaos Crew by Hacksaw it&apos;s
        the other way round: 96.3% in the base game, but 95.92% when you buy the bonus. The game rules list both, so
        it&apos;s worth a look if you buy bonuses a lot.
      </GuideP>

      <GuideH2>Questions about slot RTP</GuideH2>
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

      <GuideH2>The short version</GuideH2>
      <GuideP>
        RTP doesn&apos;t decide whether you win today, but it decides how much you lose over time. Treat it like odds:
        pick the casino that gives you the best ones. Rewards are a nice extra, but the RTP comes first.
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
