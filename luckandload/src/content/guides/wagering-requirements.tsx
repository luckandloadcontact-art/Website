import Image from 'next/image'
import Link from 'next/link'
import { GuideH2, GuideList, GuideP } from '@/components/guides/GuideContent'

const LINK = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

// Kristian's own bonus, step by step (NOK, rough USD in brackets).
const STORY_STEPS = [
  { label: 'Deposit', value: '200 kr', note: 'about $20' },
  { label: 'With the 300% bonus', value: '800 kr', note: 'to play with' },
  { label: 'After one Zeus vs Hades bonus', value: '~14,000 kr', note: 'locked by wagering', highlight: true },
  { label: 'When wagering was done', value: '2,300 kr', note: 'free to withdraw' },
  { label: 'In the end', value: '0 kr', note: 'lost it rebuilding' },
]

const ROWS = [
  { label: 'Starting balance', noBonus: '$100', bonus: '$200' },
  { label: 'Betting required by the bonus', noBonus: '$0', bonus: '$3,500' },
  { label: 'Average cost of that betting at 96% RTP', noBonus: '$0', bonus: '$140' },
  { label: 'Bonus limits on bets and games', noBonus: 'None', bonus: 'Usually' },
]

export default function WageringRequirements() {
  return (
    <>
      <GuideP>
        A casino welcome bonus gives you more to play with, but the wagering requirements decide whether you can ever
        withdraw what you win. Here&apos;s what they cost you, and what happened when I took a 300% bonus.
      </GuideP>

      <GuideH2>The 14,000 kr win I couldn&apos;t withdraw</GuideH2>
      <GuideP>
        I signed up at a new casino and got a huge welcome bonus: 300%. I deposited just 200 kr (about $20) and had 800
        kr to play with. The very first bonus, on Zeus vs Hades, paid almost 14,000 kr. I was ecstatic. There was just
        one problem: I couldn&apos;t withdraw any of it. The bonus had 35x wagering, so I had to bet 21,000 kr first.
      </GuideP>
      <figure className="mb-5 max-w-3xl">
        <ol className="grid gap-2 sm:grid-cols-5">
          {STORY_STEPS.map(step => (
            <li
              key={step.label}
              className={`rounded-lg border p-3 ${step.highlight ? 'border-hype/40 bg-hype/5' : 'border-white/10 bg-surface-800'}`}
            >
              <p className="text-[11px] leading-4 text-slate-400">{step.label}</p>
              <p className={`mt-1 text-lg font-bold tabular-nums ${step.highlight ? 'text-hype' : 'text-white'}`}>{step.value}</p>
              <p className="text-[11px] text-slate-500">{step.note}</p>
            </li>
          ))}
        </ol>
        <figcaption className="mt-2 text-xs text-slate-400">My own welcome bonus, from deposit to empty balance.</figcaption>
      </figure>
      <GuideP>
        I switched to bonus buys at much higher stakes, 1,000 and 2,000 kr, hoping to get through the wagering faster.
        They paid nothing. (These days we spread the risk over a{' '}
        <Link href="/guides/what-is-a-bonus-hunt" className={LINK}>
          bonus hunt
        </Link>{' '}
        instead.) When I was finally done and could cash out, I had 2,300 kr left. I&apos;d been sitting on
        14,000 kr, and it felt like I had nothing. I tried to build it back up and lost the lot.
      </GuideP>
      <GuideP>
        Yes, I only lost 200 kr. But without the bonus, that same luck would have been a withdrawal from another world.
        Welcome bonuses are fun because you get more to play with. Just read the wagering requirement carefully, so you
        know what it takes before you can cash out.
      </GuideP>

      <GuideH2>What are wagering requirements?</GuideH2>
      <GuideP>
        The wagering requirement is how much you have to bet before you can withdraw the bonus, or anything you win with
        it. It&apos;s written as a multiple, usually of the bonus. In my case, the bonus was 600 kr and the requirement
        was 35x, so I had to bet 600 × 35 = 21,000 kr. Bonus terms also often cap your bet size, rule out some games and
        set a deadline.
      </GuideP>

      <GuideH2>What wagering costs you</GuideH2>
      <GuideP>
        Say you deposit $100 and take a 100% bonus with 35x wagering on the bonus. This is just an example, not a real
        offer from any casino.
      </GuideP>
      <div className="mb-5 max-w-3xl overflow-x-auto">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="border-b border-white/20 text-white">
            <tr>
              <th scope="col" className="py-3 pr-4 font-semibold">$100 deposit</th>
              <th scope="col" className="py-3 pr-4 font-semibold">No bonus</th>
              <th scope="col" className="py-3 font-semibold">100% bonus, 35x</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {ROWS.map(row => (
              <tr key={row.label}>
                <th scope="row" className="py-3 pr-4 font-normal text-slate-400">{row.label}</th>
                <td className="py-3 pr-4">{row.noBonus}</td>
                <td className="py-3">{row.bonus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <GuideP>
        At 96% RTP, betting $3,500 costs you about $140 on average. That&apos;s more than the $100 bonus, so think of it as
        extra playing time rather than free money. At 10x, you&apos;d only need to bet $1,000, which costs about $40 on
        average. On a lowered RTP version of the same slot, the wagering costs you even more.{' '}
        <Link href="/guides/does-rtp-matter" className={LINK}>
          Here&apos;s how RTP versions work
        </Link>
        .
      </GuideP>

      <GuideH2>No wagering bonuses</GuideH2>
      <GuideP>
        Some bonuses have little or no wagering, and those are worth a closer look. These days we only play on
        Hype.bet, and its RakeBoost is the kind of bonus we like. Your own money is never locked, so you can withdraw it
        whenever you want. The bonus unlocks in parts as you earn XP from betting, and each part you unlock can be
        withdrawn straight away, with no wagering on it.{' '}
        <Link href="/casinos/hype-bet" className={LINK}>
          See how the Hype.bet bonus works
        </Link>
        , or read{' '}
        <Link href="/guides/hype-bet-review" className={LINK}>
          our full Hype.bet review
        </Link>
        .
      </GuideP>
      <figure className="mb-6 max-w-3xl">
        <Image
          src="/guides/zeus-vs-hades-max-win-room.jpg"
          alt="A $13,500 max win on Zeus vs Hades: Gods of War, in 7 free spins at a $0.90 bet"
          width={1200}
          height={673}
          className="w-full rounded-xl border border-white/10"
        />
        <figcaption className="mt-2 text-xs leading-5 text-slate-400">
          A different Zeus vs Hades story: our $13,500 max win in our Hype.bet multiplayer room a few weeks ago, at a
          $0.90 bet.
        </figcaption>
      </figure>

      <GuideH2>Should you skip the welcome bonus?</GuideH2>
      <GuideList>
        <li>
          <strong className="text-white">Skip it</strong> if the wagering is high, if you want to withdraw without
          conditions, or if the games you like barely count toward the wagering.
        </li>
        <li>
          <strong className="text-white">Take it</strong> if the wagering is low, the other terms look fair, and
          you&apos;d play those games at those stakes anyway.
        </li>
        <li>
          <strong className="text-white">Remember</strong> that welcome bonuses are usually tied to your first deposit,
          so you might only get one chance.
        </li>
      </GuideList>

      <GuideH2>How to deposit without a bonus</GuideH2>
      <GuideP>
        Check whether the bonus is opt-in or added automatically. If there&apos;s a bonus option at the cashier, leave it
        unselected, and check your active bonuses before your first bet. If a bonus slipped through anyway, contact
        support before you play, because your bets may already count toward it.
      </GuideP>
      <GuideP>
        Whichever you pick, set a budget before you start and stop when you hit it. If gambling stops being fun,{' '}
        <Link href="/responsible-gambling" className={LINK}>
          there&apos;s free help available
        </Link>
        .
      </GuideP>
    </>
  )
}
