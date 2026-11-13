import Image from 'next/image'
import Link from 'next/link'
import { GuideH2, GuideH3, GuideInlineCta, GuideList, GuideP } from '@/components/guides/GuideContent'
import { RoomSplit } from '@/components/guides/RoomSplit'

const AT_A_GLANCE = [
  { label: 'Best for', value: 'Slots, and playing together with streamers and friends' },
  { label: 'Stand-out feature', value: 'Multiplayer rooms' },
  { label: 'Welcome offer', value: '100% RakeBoost up to $500 + 100 free spins' },
  { label: 'Payments', value: 'Crypto and Interac' },
  { label: 'License', value: 'Curaçao (BlackSands B.V.)' },
  { label: 'Our code', value: 'LuckAndLoad' },
]

const LINK = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

// Twitch clip of us hitting the top prize on the $2,500 wheel.
const WHEEL_CLIP = 'CrypticAgileHornetRlyTho-YHODuBcN_2XKf3iN'

export default function HypeBetReview() {
  return (
    <>
      <GuideP>
        We&apos;ve streamed on Hype.bet for more than a year, almost every week, so this Hype.bet review comes from a lot
        of hours on the site. The short version: it&apos;s the best casino we&apos;ve found for playing slots together
        with other people, the games run on the highest RTP versions, and the rewards are generous. It&apos;s not
        perfect, and we&apos;ll get to the downsides too.
      </GuideP>

      <div className="mb-5 max-w-3xl overflow-x-auto">
        <table className="w-full min-w-[22rem] text-left text-sm">
          <tbody className="divide-y divide-white/10 text-slate-200">
            {AT_A_GLANCE.map(row => (
              <tr key={row.label}>
                <th scope="row" className="w-44 py-3 pr-4 align-top font-normal text-slate-400">{row.label}</th>
                <td className="py-3">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GuideH2>Multiplayer rooms: why we picked Hype.bet</GuideH2>
      <GuideP>
        This is what sets Hype.bet apart. A host opens a room and plays the slots, and anyone can join by adding money
        to a shared pool. Every win and loss is split by each player&apos;s share of the pool, and you can join or leave
        between spins.
      </GuideP>
      <GuideP>
        The multiplayer room is the reason we started streaming so much. It turns a stream into something completely
        different: you&apos;re not just watching the streamer&apos;s session, you&apos;re part of it, whether it goes well
        or badly. We haven&apos;t seen anything like it on other casinos. At least once a month we also spin a $2,500
        wheel for everyone in our room, and it has paid out more than $10,000 to our players so far.
      </GuideP>
      <RoomSplit />

      <GuideH2>Games and RTP</GuideH2>
      <GuideP>
        The slot library has the studios we play the most, like Hacksaw Gaming, Nolimit City and Pragmatic Play, along
        with live casino, table games, crash games and a sportsbook. The bigger point for us is RTP. Many slots come in
        several versions, and the casino picks which one to run. Hype.bet runs the highest versions available, which on
        a slot like Wanted Dead or a Wild means 96.38% instead of as low as 88.42%.{' '}
        <Link href="/guides/does-rtp-matter" className={LINK}>
          Here&apos;s what that difference costs you
        </Link>
        .
      </GuideP>

      <GuideH2>Bonuses and rewards</GuideH2>
      {/* Both bonus sections sit beside the image, which shows the welcome offer and Hype Time together. */}
      <div className="mb-5 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <GuideH3>The welcome bonus</GuideH3>
          <GuideP>
            New players get a 100% RakeBoost up to $500 on their first deposit, plus 100 free spins. Instead of wagering,
            the bonus unlocks in four parts as you earn XP, and each part can be withdrawn as soon as it unlocks. It suits
            slot players best, since slots earn XP 20 times faster than table games. The full terms are on our{' '}
            <Link href="/casinos/hype-bet" className={LINK}>
              Hype.bet bonus code page
            </Link>
            .
          </GuideP>
          <GuideH3>Hype Time and loyalty</GuideH3>
          <GuideP>
            Every month there&apos;s Hype Time: every 1,000 XP gives you a ticket for a Rolex draw, and the top 10
            players share a guaranteed $25,000. The more tickets players collect during the month, the more valuable the
            Rolex gets.
          </GuideP>
          <GuideP>
            On top of that, the loyalty program lets you swap points for bonuses, weekly rakeback and free withdrawals.
            Players under our code also compete on our{' '}
            <Link href="/leaderboard" className={LINK}>
              monthly leaderboard
            </Link>
            , with $1,000 in prizes.
          </GuideP>
        </div>
        <figure className="mx-auto w-full max-w-[12rem] shrink-0 sm:mt-8">
          <Image
            src="/casinos/hype-rolex-draw.png"
            alt="Hype.bet's welcome offer and Hype Time: win a Rolex and a share of $25,000 every month"
            width={820}
            height={1392}
            className="w-full rounded-xl border border-white/10"
          />
          <figcaption className="mt-2 text-xs leading-5 text-slate-400">The welcome offer and Hype Time on Hype.bet.</figcaption>
        </figure>
      </div>

      <GuideH2>Our $2,500 wheel for room players</GuideH2>
      <GuideP>
        At least once a month, often on the same day we pay out the leaderboard, we spin a $2,500 wheel in our room.
        Whatever it lands on goes straight to every player who has wagered in the room when we spin it. Nothing goes to
        us. The prizes on the wheel vary, and we&apos;ve hit the top prize more than three times. In our first year,
        the wheel has paid out more than $10,000 to our players. Here&apos;s one of the times we hit the top prize:
      </GuideP>
      <figure className="mb-6 max-w-3xl">
        <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
          <iframe
            src={`https://clips.twitch.tv/embed?clip=${WHEEL_CLIP}&parent=luckandloadtv.com&parent=www.luckandloadtv.com&autoplay=false`}
            title="LuckAndLoadTV hitting the top prize on the $2,500 wheel"
            className="h-full w-full"
            loading="lazy"
            allowFullScreen
          />
        </div>
        <figcaption className="mt-2 text-xs leading-5 text-slate-400">
          Hitting the top prize on our $2,500 wheel, live on stream.{' '}
          <a href={`https://www.twitch.tv/luckandloadtv/clip/${WHEEL_CLIP}`} target="_blank" rel="noopener noreferrer" className={LINK}>
            Watch on Twitch
          </a>
        </figcaption>
      </figure>

      <GuideInlineCta
        title="Try Hype.bet with our code"
        secondary={{ href: '/casinos/hype-bet', label: 'See the Hype.bet bonus code' }}
      >
        Sign up through our link to get the welcome offer and a spot on our leaderboard, then join our multiplayer room
        the next time we&apos;re live.
      </GuideInlineCta>

      <GuideH2>Deposits and withdrawals</GuideH2>
      <GuideP>
        You can pay with crypto or Interac. We use crypto, mostly Bitcoin and Ethereum, and our withdrawals usually
        arrive in under 20 minutes. Players under our code tell us the same. Crypto deposits are converted to USD at the
        live rate, and the minimum withdrawal is $50. Like most casinos, Hype.bet can ask for ID before you withdraw, so
        verify your account early.
        Most complaints we see online are about exactly that.{' '}
        <Link href="/guides/is-hype-bet-legit" className={LINK}>
          Read more in our guide to whether Hype.bet is legit
        </Link>
        .
      </GuideP>

      <GuideH2>What could be better</GuideH2>
      <GuideList>
        <li>It&apos;s licensed in Curaçao rather than by an EU regulator.</li>
        <li>Table games, live casino and crash earn XP 20 times slower, so the bonus is built for slot players.</li>
        <li>Bonus money you haven&apos;t unlocked expires 30 days after you activate it.</li>
      </GuideList>

      <GuideH2>Our verdict</GuideH2>
      <GuideP>
        If you like slots and want to play them with other people, Hype.bet is the casino we&apos;d pick, and it&apos;s
        the one we use every stream. The multiplayer rooms are genuinely new, the RTP is as high as it gets, and the
        rewards add up if you play regularly. Just verify your account early and read the bonus terms before you
        deposit.
      </GuideP>
      <GuideP>
        Set a budget before you play and stop when you reach it. If gambling stops being fun,{' '}
        <Link href="/responsible-gambling" className={LINK}>
          there&apos;s free help available
        </Link>
        .
      </GuideP>
    </>
  )
}
