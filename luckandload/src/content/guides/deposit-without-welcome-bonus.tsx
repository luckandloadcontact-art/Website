import Link from 'next/link'
import { GuideH2, GuideList, GuideP, GuideSummary } from '@/components/guides/GuideContent'

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
        <strong className="text-white">Short answer:</strong> skipping the welcome bonus keeps your deposit free of
        wagering requirements and bonus rules, so it is simpler and usually easier to withdraw. The trade-off is a
        smaller balance, and you may not be offered that bonus again. Which is better depends on the terms, so read them
        before you deposit.
      </GuideSummary>

      <GuideH2>What does depositing without a welcome bonus mean?</GuideH2>
      <GuideP>
        A welcome bonus usually adds extra funds or free spins to your first deposit. In return, you accept its rules.
        The most important one is the wagering requirement: how much you must bet before bonus funds or their winnings
        can be withdrawn.
      </GuideP>
      <GuideP>
        Depositing without a bonus means you play with your own balance only. Many casinos let you opt out, but not all
        of them do, and the process varies.
      </GuideP>

      <GuideH2>The pros</GuideH2>
      <GuideList>
        <li>
          <strong className="text-white">Fewer strings on withdrawals.</strong> There is no bonus wagering to finish.
          Normal identity checks and payment rules still apply, and some casinos require a deposit to be wagered once
          before you can withdraw it.
        </li>
        <li>
          <strong className="text-white">No bonus rules to break.</strong> Bonus terms often cap your bet size, exclude
          games, set a deadline or limit how much you can cash out. Breaking them can cost you the bonus and its
          winnings.
        </li>
        <li>
          <strong className="text-white">You choose what to play.</strong> You are not steered toward the games that
          count most toward wagering. Slots often count in full, while table games often count for less or nothing.
        </li>
        <li>
          <strong className="text-white">It is easier to stop.</strong> You can see what is yours, and no locked funds
          push you to keep betting.
        </li>
      </GuideList>

      <GuideH2>The cons</GuideH2>
      <GuideList>
        <li>
          <strong className="text-white">A smaller balance.</strong> A 100% bonus would double a $100 deposit. Without
          it, you start with $100.
        </li>
        <li>
          <strong className="text-white">Less playing time.</strong> A smaller balance means fewer spins at the same bet
          size.
        </li>
        <li>
          <strong className="text-white">It may be a one-time offer.</strong> Welcome bonuses are usually tied to your
          first deposit, so skipping one can be permanent. Check this before you deposit.
        </li>
        <li>
          <strong className="text-white">You could miss a fair deal.</strong> Bonuses differ a lot, and an offer with low
          or no wagering can have few downsides.
        </li>
      </GuideList>

      <GuideH2>What wagering looks like in numbers</GuideH2>
      <GuideP>
        Here is an example, not any specific casino&apos;s offer: a $100 deposit with a 100% bonus and 35x wagering on the
        bonus.
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
        Betting $3,500 at 96% RTP costs $140 on average, which is more than the $100 bonus. With terms like these, the
        bonus mainly buys playing time. It is not free money. Lower wagering changes the sums: at 10x, you would bet
        $1,000, which costs $40 on average.
      </GuideP>
      <GuideP>RTP is a long-run average, so real sessions can land far above or below these numbers.</GuideP>

      <GuideH2>Which should you choose?</GuideH2>
      <GuideP>Skipping the bonus usually makes sense if:</GuideP>
      <GuideList>
        <li>the wagering requirement is high</li>
        <li>you want to be able to withdraw without bonus conditions</li>
        <li>the games you want to play barely count toward wagering, or are excluded</li>
      </GuideList>
      <GuideP>A bonus can be worth considering if:</GuideP>
      <GuideList>
        <li>the wagering is low and the other terms are reasonable</li>
        <li>you would play the eligible games at that bet size anyway</li>
        <li>you have read the full terms and understand them</li>
      </GuideList>
      <GuideP>Either way, a bonus is not a reason to deposit more than you were already comfortable losing.</GuideP>

      <GuideH2>How to deposit without a bonus</GuideH2>
      <GuideList ordered>
        <li>Check the casino&apos;s bonus terms to see whether the welcome bonus is opt-in or added automatically.</li>
        <li>Leave any bonus option at the cashier unselected when you deposit.</li>
        <li>Check your balance and active bonuses before your first bet.</li>
        <li>If a bonus was added anyway, contact support before you play, since your bets may count under its terms.</li>
      </GuideList>

      <GuideH2>The bottom line</GuideH2>
      <GuideP>
        Depositing without a welcome bonus gives you simplicity and fewer conditions. Taking one gives you a bigger
        balance with rules attached. Compare the wagering and terms before you decide, set a budget first, and stop when
        you reach it. If gambling stops being fun,{' '}
        <Link href="/responsible-gambling" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
          free, confidential help is available
        </Link>
        .
      </GuideP>
    </>
  )
}
