import Image from 'next/image'
import { GuideH2, GuideH3, GuideList, GuideP } from '@/components/guides/GuideContent'

const XP_RATES = [
  { games: 'Slots and sportsbook', xp: '1 XP' },
  { games: 'Roulette, live casino, crash and other games', xp: '0.05 XP' },
]

const UNLOCK_STEPS = [
  { xp: '1,250 XP', unlocks: '$25', total: '$25' },
  { xp: '2,500 XP', unlocks: '$25', total: '$50' },
  { xp: '3,750 XP', unlocks: '$25', total: '$75' },
  { xp: '5,000 XP', unlocks: '$25', total: '$100' },
]

const tableClass = 'mb-5 w-full max-w-xl text-left text-sm'
const headClass = 'border-b border-white/20 text-white'
const bodyClass = 'divide-y divide-white/10 text-slate-200'

export default function HypeBetReview({ playUrl }: { playUrl: string }) {
  return (
    <>
      <GuideH2>The welcome bonus: 100% RakeBoost and 100 free spins</GuideH2>
      <GuideP>
        Hype.bet&apos;s welcome bonus is called RakeBoost. Your first deposit is matched 100%, up to $500, and the bonus
        unlocks as you play instead of being locked behind wagering. It&apos;s released in four equal parts, at 25%, 50%,
        75% and 100% of the XP target, and every part you unlock can be withdrawn straight away. The Bonus Dashboard on
        Hype.bet shows how much you&apos;ve unlocked and how far you are from the next part.
      </GuideP>

      <GuideH3>How you earn XP</GuideH3>
      <GuideP>You earn XP automatically on every bet. The total you need is 50 times your bonus.</GuideP>
      <table className={tableClass}>
        <thead className={headClass}>
          <tr>
            <th scope="col" className="py-3 pr-4 font-semibold">Game type</th>
            <th scope="col" className="py-3 font-semibold">XP per $1 bet</th>
          </tr>
        </thead>
        <tbody className={bodyClass}>
          {XP_RATES.map(rate => (
            <tr key={rate.games}>
              <td className="py-3 pr-4">{rate.games}</td>
              <td className="py-3">{rate.xp}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <GuideH3>Example: a $100 deposit</GuideH3>
      <GuideP>You get a $100 bonus, and the XP target is 5,000 XP.</GuideP>
      <table className={tableClass}>
        <thead className={headClass}>
          <tr>
            <th scope="col" className="py-3 pr-4 font-semibold">XP earned</th>
            <th scope="col" className="py-3 pr-4 font-semibold">Unlocks</th>
            <th scope="col" className="py-3 font-semibold">Unlocked in total</th>
          </tr>
        </thead>
        <tbody className={bodyClass}>
          {UNLOCK_STEPS.map(step => (
            <tr key={step.xp}>
              <td className="py-3 pr-4">{step.xp}</td>
              <td className="py-3 pr-4">{step.unlocks}</td>
              <td className="py-3">{step.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <GuideH3>The 100 free spins</GuideH3>
      <GuideList>
        <li>For new players on their first deposit, with a minimum deposit of $20.</li>
        <li>Claim them within 24 hours of your deposit, or they expire.</li>
        <li>Winnings are paid as cash once all the spins are used, up to a maximum of $100.</li>
      </GuideList>

      <GuideH3>Terms worth knowing</GuideH3>
      <GuideList>
        <li>
          Choose RakeBoost when you make your first deposit. If you pick &quot;No Bonus&quot;, it can&apos;t be added
          afterwards.
        </li>
        <li>There&apos;s one RakeBoost per person, household, IP address and payment method.</li>
        <li>
          The minimum withdrawal is $50, and you need at least 1,000 XP before winnings and bonus money can be
          withdrawn.
        </li>
        <li>Bonus money you haven&apos;t unlocked expires 30 days after you activate it. Money already released stays yours.</li>
        <li>Crypto deposits are converted to USD at the live rate when the transaction is confirmed.</li>
      </GuideList>

      <GuideH2>Hype Time: win a Rolex and $25,000 in cash</GuideH2>
      <div className="mb-5 flex flex-col gap-6 sm:flex-row sm:items-start">
        <a href={playUrl} target="_blank" rel="sponsored noopener noreferrer" className="shrink-0">
          <Image
            src="/casinos/hype-rolex-draw.png"
            alt="Hype Time: win a Rolex and $25,000 in cash. New users get a 100% RakeBoost, 100 free spins and 10 Rolex draw tickets."
            width={820}
            height={1392}
            className="w-full max-w-[16rem] rounded-2xl"
          />
        </a>
        <div>
          <GuideP>
            New players who deposit at least $20 and claim all the welcome bonuses also get 10 tickets for Hype.bet&apos;s
            draw for a Rolex and $25,000 in cash, on top of the 100% RakeBoost and the 100 free spins.
          </GuideP>
          <GuideP>Check Hype.bet for the draw date and the full terms.</GuideP>
        </div>
      </div>

      <GuideH2>Highest RTP on the games</GuideH2>
      <GuideP>
        RTP is the share of the money bet on a game that it pays back over time. Many slots come in several RTP versions,
        and each casino chooses which one to run. Hype.bet runs its slots on the highest RTP settings available, so you
        get the best possible odds on the same games.
      </GuideP>
    </>
  )
}
