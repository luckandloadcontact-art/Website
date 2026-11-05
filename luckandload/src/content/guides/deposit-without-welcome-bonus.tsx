import Link from 'next/link'
import { GuideCard, GuideColumns, GuideH2, GuideList, GuideP, GuideSummary } from '@/components/guides/GuideContent'

const ROWS = [
  { label: 'Starting balance', noBonus: '$100', bonus: '$200' },
  { label: 'Betting required by the bonus', noBonus: '$0', bonus: '$3,500' },
  { label: 'Average cost of that betting at 96% RTP', noBonus: '$0', bonus: '$140' },
  { label: 'Bonus limits on bets and games', noBonus: 'None', bonus: 'Usually' },
]

export default function DepositWithoutWelcomeBonus() {
  return (
    <>
      <GuideSummary>
        Skip the welcome bonus and you&apos;re playing with your own money, with no wagering to finish and no bonus rules
        to keep track of. You&apos;ll start with less, though, and you might not be offered that bonus again. A lot comes
        down to the terms, so give them a read before you deposit.
      </GuideSummary>

      <GuideH2>What does it actually mean?</GuideH2>
      <GuideP>
        A welcome bonus usually gives you extra money or free spins on your first deposit. The catch is the wagering
        requirement: how much you have to bet before you can withdraw the bonus money or anything you win with it.
        Deposit without one and it&apos;s just your own balance. Many casinos let you say no to the bonus, but not all of
        them, and how you do it varies.
      </GuideP>

      <GuideColumns>
        <GuideCard title="The pros">
          <GuideList>
            <li>
              <strong className="text-white">Withdrawing is simpler.</strong> You&apos;ve got no bonus wagering to finish.
              The usual ID checks still apply, and some casinos want a deposit played through once before you can
              withdraw it.
            </li>
            <li>
              <strong className="text-white">There are no bonus rules to trip over.</strong> Bonus terms often cap your
              bet size, rule out certain games, set a deadline or limit what you can cash out. Break one and you can lose
              the bonus and what you won with it.
            </li>
            <li>
              <strong className="text-white">You can play what you like.</strong> Slots often count in full toward
              wagering, while table games can count for little or nothing. Without a bonus, that doesn&apos;t matter.
            </li>
            <li>
              <strong className="text-white">It&apos;s easier to walk away.</strong> You can see what&apos;s yours, and
              there&apos;s no locked money tempting you to keep betting.
            </li>
          </GuideList>
        </GuideCard>

        <GuideCard title="The cons">
          <GuideList>
            <li>
              <strong className="text-white">You start with less.</strong> A 100% bonus turns $100 into $200. Without it,
              you&apos;ve got $100.
            </li>
            <li>
              <strong className="text-white">Your money won&apos;t last as long.</strong> At the same bet size, a smaller
              balance means fewer spins.
            </li>
            <li>
              <strong className="text-white">You might only get one shot.</strong> Welcome bonuses are usually tied to
              your first deposit, so check before you pass on one.
            </li>
            <li>
              <strong className="text-white">You could miss a good offer.</strong> Some bonuses have low wagering or none
              at all, and there&apos;s not much to dislike about those.
            </li>
          </GuideList>
        </GuideCard>
      </GuideColumns>

      <GuideH2>What wagering costs you</GuideH2>
      <GuideP>
        Say you deposit $100 and take a 100% bonus with 35x wagering on the bonus. This is just an example, not a real
        offer from any casino.
      </GuideP>
      <div className="mb-4 overflow-x-auto rounded-2xl border border-white/8">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="bg-surface-700 text-white">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">$100 deposit</th>
              <th scope="col" className="px-4 py-3 font-semibold">No bonus</th>
              <th scope="col" className="px-4 py-3 font-semibold">100% bonus, 35x</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8 bg-surface-800 text-slate-300">
            {ROWS.map(row => (
              <tr key={row.label}>
                <th scope="row" className="px-4 py-3 font-normal text-slate-400">{row.label}</th>
                <td className="px-4 py-3">{row.noBonus}</td>
                <td className="px-4 py-3">{row.bonus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <GuideP>
        At 96% RTP, betting $3,500 costs you about $140 on average. That&apos;s more than the $100 bonus you got, so think
        of it as extra playing time rather than free money. Drop the wagering to 10x and you&apos;d only need to bet $1,000,
        which costs about $40 on average. Keep in mind that RTP is a long-run average, and any single session can go much
        better or worse.
      </GuideP>

      <GuideH2>So, should you take the bonus?</GuideH2>
      <GuideColumns>
        <GuideCard title="Skip it if">
          <GuideList>
            <li>the wagering is high</li>
            <li>you want to withdraw without any bonus conditions</li>
            <li>the games you like barely count or aren&apos;t allowed</li>
          </GuideList>
        </GuideCard>
        <GuideCard title="Consider it if">
          <GuideList>
            <li>the wagering is low and the other terms look fair</li>
            <li>you&apos;d play those games at those stakes anyway</li>
            <li>you&apos;ve read the full terms and they make sense to you</li>
          </GuideList>
        </GuideCard>
      </GuideColumns>
      <GuideP>Either way, don&apos;t let a bonus talk you into depositing more than you&apos;re fine with losing.</GuideP>

      <GuideH2>How to deposit without a bonus</GuideH2>
      <GuideP>
        Before you deposit, check whether the bonus is opt-in or gets added automatically. If there&apos;s a bonus option at
        the cashier, leave it unselected. Then look at your balance and active bonuses before your first bet. If a bonus
        slipped through anyway, contact support before you play, because your bets may already count toward it.
      </GuideP>
      <GuideP>
        Whichever you pick, set a budget before you start and stop when you hit it. If gambling stops being fun,{' '}
        <Link href="/responsible-gambling" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
          there&apos;s free help available
        </Link>
        .
      </GuideP>
    </>
  )
}
