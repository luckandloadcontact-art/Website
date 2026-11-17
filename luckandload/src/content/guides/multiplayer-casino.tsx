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
import { RoomSplit } from '@/components/guides/RoomSplit'
import { RoomFlow } from '@/components/guides/RoomFlow'
import { CountUp } from '@/components/ui/CountUp'
import { publishedGuideHref } from '@/lib/guides'

const LINK = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

// Kick clip of the $13,500 Zeus vs Hades max win in our room (22 Sep 2026). The video on the page is
// the same clip cut to 0:55–2:29 (1080p, public/guides/zeus-max-win-room.mp4).
const MAX_WIN_CLIP = 'https://kick.com/luckandloadtv/clips/clip_01M357FSZ7261ER41Q8S6DE2FJ'

// Our room in numbers (Kristian, November 2026). Joins are not unique players.
// `text` is shown as is; `value` counts up.
const ROOM_STATS: { value?: number; prefix?: string; suffix?: string; text?: string; label: string }[] = [
  { value: 7000, suffix: '+', label: 'joins to our room so far' },
  { text: '20–40', label: 'players on a normal stream' },
  { value: 100, prefix: '~', label: 'players on our biggest streams' },
  { value: 13500, prefix: '$', label: 'biggest win, split by the room' },
]

// Short answers to what people search about multiplayer casinos. Also sent to Google as FAQPage data.
const FAQ = [
  {
    question: 'What is a multiplayer casino?',
    answer:
      'A casino where several people play the same game together with real money. In a multiplayer room, everyone adds money to a shared pool, the host plays the slots, and every win and loss is split by each player’s share of the pool.',
  },
  {
    question: 'Can you gamble with friends online?',
    answer:
      'Yes. On Hype.bet anyone can open a multiplayer room and invite friends. Everyone adds what they want to the pool, the host plays, and the results are split by share. You don’t need to stream on Kick or Twitch, because the host streams inside the room itself.',
  },
  {
    question: 'How is the money split in a multiplayer room?',
    answer:
      'By your share of the pool. If you add $50 to a room with $500 in it, you own 10%, so you get 10% of every win and carry 10% of every loss. You only take part in the spins from the moment you join.',
  },
  {
    question: 'Is there a minimum or maximum to join a room?',
    answer:
      'No. You add exactly the amount you want, and you can leave between spins. You can also watch a room without adding anything.',
  },
  {
    question: 'What happens to a bonus if the room closes?',
    answer:
      'Bonuses are paid out as soon as they are opened. If a room closes for a technical reason before that, the bonus can be opened later and the money goes straight to each player’s wallet. A bonus that is never opened is paid out automatically after 24 hours.',
  },
  {
    question: 'What happens when you leave a multiplayer room?',
    answer:
      'You stop taking part in new spins, but you keep your share of any bonuses collected while you were in the room. In a bonus hunt, for example, your share of those bonuses is paid straight to your wallet when the room opens them, even if you have already left.',
  },
  {
    question: 'Do you need to be a streamer to host a room?',
    answer:
      'No. Anyone can open a room. The host streams inside the Hype.bet room, so there is no need for a Kick or Twitch channel.',
  },
  {
    question: 'Can you play slots with streamers?',
    answer:
      'Yes, if the streamer plays in a multiplayer room. You join their room, add to the pool and share the results of their session live. We open our room on almost every stream.',
  },
]

export default function MultiplayerCasino() {
  // Links to the streamer guide from its publish day; the page revalidates hourly.
  const streamerHref = publishedGuideHref('can-you-gamble-on-twitch')
  return (
    <>
      <GuideP>
        A multiplayer casino lets several people play the same slot session together with real money. You add money to
        the session and get your share of the result. We host a multiplayer room on Hype.bet almost every time we
        stream, and players have joined it more than 7,000 times.
      </GuideP>

      {/* A slim stat strip between two hairlines: numbers to scan, without competing with the text. */}
      <dl className="mb-10 grid max-w-3xl grid-cols-2 gap-y-5 border-y border-white/10 py-5 sm:grid-cols-4 sm:divide-x sm:divide-white/10">
        {ROOM_STATS.map(stat => (
          <div key={stat.label} className="flex flex-col sm:px-5 sm:first:pl-0">
            <dt className="order-2 mt-1 text-xs leading-5 text-slate-400">{stat.label}</dt>
            <dd className="order-1 text-2xl font-bold tracking-tight text-white tabular-nums">
              {stat.value !== undefined ? <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} /> : stat.text}
            </dd>
          </div>
        ))}
      </dl>

      <GuideH2>What is a multiplayer casino?</GuideH2>
      <GuideP>
        &quot;Multiplayer casino&quot; can mean two different things. In a <strong className="text-white">multiplayer
        room</strong>, everyone&apos;s money goes into one shared pool and the results are split. In a{' '}
        <strong className="text-white">shared round</strong>, like a crash game, everyone is in the same game at the same
        time, but each player bets and wins on their own. Some casinos, Stake for example, group games like that in a
        multiplayer section.
      </GuideP>
      <figure className="mb-6 max-w-3xl">
        <RoomFlow />
        <figcaption className="mt-2 text-xs leading-5 text-slate-400">
          How a shared pool works: four players add to one pool, the host plays, and a $100 win is split by each
          player&apos;s share.
        </figcaption>
      </figure>
      <GuideP>
        The rest of this guide is about rooms. In a room, one big hit pays everyone at once.
      </GuideP>

      <GuideH2>How a multiplayer room works</GuideH2>
      <GuideList>
        <li>
          <strong className="text-white">The host opens a room.</strong> They choose the slots and the bet size, and play
          the session live inside the room.
        </li>
        <li>
          <strong className="text-white">You add what you want to the pool.</strong> There&apos;s no minimum or maximum.
          Your share is what you added divided by the whole pool.
        </li>
        <li>
          <strong className="text-white">Every spin is split by share.</strong> If you own 10% of the pool, you get 10% of
          every win and carry 10% of every loss.
        </li>
        <li>
          <strong className="text-white">You&apos;re in from the moment you join.</strong> Joining halfway through a
          session doesn&apos;t give you a share of what happened before, only of what happens next.
        </li>
        <li>
          <strong className="text-white">You can leave between spins,</strong> or just watch without adding anything.
        </li>
        <li>
          <strong className="text-white">Leaving doesn&apos;t cost you the bonuses you were in on.</strong> If you leave
          during a bonus hunt, you keep your share of the bonuses collected while you were in the room, but not the ones
          collected after. Your share is paid straight to your wallet when the room opens those bonuses.
        </li>
      </GuideList>
      <GuideP>Drag the slider to see how your share works out:</GuideP>
      <RoomSplit />

      <GuideH3>What happens to bonuses</GuideH3>
      <GuideP>
        A bonus is paid out to everyone the moment it&apos;s opened. If a room closes for a technical reason before a
        bonus is opened, it isn&apos;t lost. It can be opened later, and the money goes straight to each player&apos;s
        wallet. A bonus that is never opened is paid out automatically after 24 hours.
      </GuideP>

      <GuideH2>Can you play slots with friends online?</GuideH2>
      <GuideP>
        Yes, and you don&apos;t need to be a streamer to do it. On Hype.bet anyone can open a room, and the host streams
        straight inside it, so there&apos;s no need for a Kick or Twitch channel. Open a room, send it to your friends,
        and everyone adds what they want to the pool. Whoever hosts picks the games, so agree on the slots and the bet
        size before you start.
      </GuideP>

      <GuideH2>Playing slots with streamers</GuideH2>
      <GuideP>
        Most people find rooms through a streamer. On a normal stream we have 20 to 40 players in our room,
        and on special streams it has been close to 100. Most of our streams start with a{' '}
        <Link href="/guides/what-is-a-bonus-hunt" className={LINK}>
          bonus hunt
        </Link>
        , so the room collects the bonuses together and opens them together, with everyone watching the same balance.
        {streamerHref && (
          <>
            {' '}
            We stream on both Kick and Twitch;{' '}
            <Link href={streamerHref} className={LINK}>
              how gambling streams work on each platform
            </Link>
            .
          </>
        )}
      </GuideP>
      <GuideP>
        In September, a spin of our{' '}
        <Link href="/slot-wheel" className={LINK}>
          slot wheel
        </Link>{' '}
        picked Zeus vs Hades, and it paid a $13,500 max win in 7 free spins at a $0.90 bet. Everyone in the room got their
        share of it. In the clip, watch the top 12 players on the left: their balances jump the moment the bonus ends.
      </GuideP>
      <figure className="mb-6 max-w-3xl">
        {/* Only the poster loads with the page; the 46 MB video starts downloading when someone presses play. */}
        <video
          controls
          playsInline
          preload="none"
          poster="/guides/multiplayer-casino-thumb.jpg"
          className="aspect-video w-full rounded-xl border border-white/10 bg-black"
        >
          <source src="/guides/zeus-max-win-room.mp4" type="video/mp4" />
          <a href={MAX_WIN_CLIP} className={LINK}>
            Watch the clip on Kick
          </a>
        </video>
        <figcaption className="mt-2 text-xs leading-5 text-slate-400">
          Our $13,500 Zeus vs Hades max win, shared by the whole room. Watch the player balances on the left go from a
          few hundred dollars to thousands.{' '}
          <a href={MAX_WIN_CLIP} target="_blank" rel="noopener noreferrer" className={LINK}>
            Watch on Kick
          </a>
        </figcaption>
      </figure>
      <GuideP>
        At least once a month we also spin a wheel in our room with a $2,500 top prize, split between the players by how
        much each of them has wagered in the room. We&apos;ve hit the top prize more than three times.{' '}
        <Link href="/guides/hype-bet-review" className={LINK}>
          More about the room wheel in our Hype.bet review
        </Link>
        .
      </GuideP>

      <GuideInlineCta
        title="Join our room on the next stream"
        secondary={{ href: '/casinos/hype-bet', label: 'See the Hype.bet bonus code' }}
      >
        Sign up through our link, then join our multiplayer room the next time we&apos;re live. Add what you want, and
        leave whenever you want.
      </GuideInlineCta>

      <GuideH2>The downside of playing together</GuideH2>
      <GuideP>
        Rooms have a downside. When a session goes badly, it&apos;s other people&apos;s money going too, and that feels a
        lot worse than losing your own. We&apos;ve felt that as hosts, more than once.
      </GuideP>
      <GuideP>
        It&apos;s the reason we play with lower volatility in the room than we would on our own. A calmer session usually
        keeps the balance alive for longer, so the people who join get more play for their money. If you host a room for
        your friends, think about how it would feel if the pool was gone after ten minutes.
      </GuideP>

      <GuideH2>Things to know before you join</GuideH2>
      <GuideList>
        <li>
          <strong className="text-white">You share the losses too.</strong> A room doesn&apos;t change the odds of the
          slots. A bad session costs everyone their share.
        </li>
        <li>
          <strong className="text-white">The host decides.</strong> You don&apos;t pick the slot or the bet size, so join
          a host whose style suits you.
        </li>
        <li>
          <strong className="text-white">Only add what you&apos;re happy to lose.</strong> Set a budget before you join,
          and leave when you reach it.
        </li>
      </GuideList>

      <GuideH2>Free multiplayer casino games and Steam games</GuideH2>
      <GuideP>
        Searching for multiplayer casino games also turns up video games, like Gamble With Your Friends on Steam, and
        social casinos where you play with free coins. Those are played for fun, not real money. This guide is about
        real-money rooms.
      </GuideP>

      <GuideH2>Questions about multiplayer casinos</GuideH2>
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

      <GuideP>
        Set a budget before you join a room. If gambling stops being fun,{' '}
        <Link href="/responsible-gambling" className={LINK}>
          there&apos;s free help available
        </Link>
        .
      </GuideP>
    </>
  )
}
