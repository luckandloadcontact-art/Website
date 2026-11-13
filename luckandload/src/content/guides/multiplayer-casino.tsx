import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
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
import { CountUp } from '@/components/ui/CountUp'

const LINK = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

// Kick clip of the $13,500 Zeus vs Hades max win in our room (22 Sep 2026). The player balances on
// the left jump at about 0:55. Kick has no clip embed, so the image links to the clip.
const MAX_WIN_CLIP = 'https://kick.com/luckandloadtv/clips/clip_01M357FSZ7261ER41Q8S6DE2FJ'

// Our room in numbers (Kristian, November 2026). Joins are not unique players.
// `text` is shown as is; `value` counts up.
const ROOM_STATS: { value?: number; prefix?: string; suffix?: string; text?: string; label: string }[] = [
  { value: 7000, suffix: '+', label: 'joins to our room so far' },
  { text: '20–40', label: 'players on a normal stream' },
  { value: 100, prefix: 'up to ', label: 'players on special streams' },
  { value: 13500, prefix: '$', label: 'biggest single win, shared' },
]

const COMPARISON = [
  { label: 'Whose money is played', pool: 'One shared pool that everyone adds to', round: 'Each player bets their own money' },
  { label: 'Who makes the choices', pool: 'The host picks the slot and the bet size', round: 'Every player places their own bet' },
  { label: 'How results work', pool: 'Every win and loss is split by your share of the pool', round: 'You win or lose on your own bet' },
  { label: 'Example', pool: 'Multiplayer rooms on Hype.bet', round: 'Crash games, where everyone rides the same round' },
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
  return (
    <>
      <GuideP>
        A multiplayer casino lets several people play the same slot session together, with real money. Instead of
        watching someone else spin, you put money in, share the session and share the result. We host a multiplayer room
        on Hype.bet almost every time we stream, and players have joined it more than 7,000 times, so this guide comes
        from a lot of hours inside one.
      </GuideP>

      <ul className="mb-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {ROOM_STATS.map(stat => (
          <li key={stat.label} className="rounded-xl border border-white/10 bg-surface-800 p-4">
            <p className="text-2xl font-bold tabular-nums text-hype">
              {stat.value !== undefined ? <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} /> : stat.text}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{stat.label}</p>
          </li>
        ))}
      </ul>

      <GuideH2>What is a multiplayer casino?</GuideH2>
      <GuideP>
        &quot;Multiplayer casino&quot; is used for two quite different things. In a <strong className="text-white">multiplayer
        room</strong>, everyone&apos;s money goes into one shared pool and the results are split. In a{' '}
        <strong className="text-white">shared round</strong>, like a crash game, everyone is in the same game at the same
        time, but each player bets and wins on their own. Some casinos, Stake for example, group games like that in a
        multiplayer section.
      </GuideP>
      <div className="mb-5 max-w-3xl overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="border-b border-white/20 text-white">
            <tr>
              <th scope="col" className="py-3 pr-4 font-semibold"><span className="sr-only">Compared</span></th>
              <th scope="col" className="py-3 pr-4 font-semibold">Shared pool (room)</th>
              <th scope="col" className="py-3 font-semibold">Shared round</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {COMPARISON.map(row => (
              <tr key={row.label}>
                <th scope="row" className="py-3 pr-4 align-top font-normal text-slate-400">{row.label}</th>
                <td className="py-3 pr-4 align-top">{row.pool}</td>
                <td className="py-3 align-top">{row.round}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <GuideP>
        The rest of this guide is about rooms, because that&apos;s where playing together really changes the game: one
        big hit pays everyone in the room at once.
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
      </GuideList>
      <GuideP>Drag the slider to see how your share works out:</GuideP>
      <RoomSplit />

      <GuideH3>What happens to bonuses</GuideH3>
      <GuideP>
        A bonus is paid out to everyone the moment it&apos;s opened. If a room closes for a technical reason before a
        bonus is opened, it isn&apos;t lost: it can be opened later and the money goes straight to each player&apos;s
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
        This is how most people find rooms: through a streamer. On a normal stream we have 20 to 40 players in our room,
        and on special streams it has been close to 100. Most of our streams start with a{' '}
        <Link href="/guides/what-is-a-bonus-hunt" className={LINK}>
          bonus hunt
        </Link>
        , so the room collects the bonuses together and opens them together, with everyone watching the same balance.
      </GuideP>
      <GuideP>
        The best moments are the ones everyone shares. In September, a spin of our{' '}
        <Link href="/slot-wheel" className={LINK}>
          slot wheel
        </Link>{' '}
        picked Zeus vs Hades, and it paid a $13,500 max win in 7 free spins at a $0.90 bet. Everyone in the room got their
        share of it. In the clip, watch the top 12 players on the left: their balances jump the moment the bonus ends.
      </GuideP>
      <figure className="mb-6 max-w-3xl">
        <a
          href={MAX_WIN_CLIP}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-xl border border-white/10"
        >
          <Image
            src="/guides/zeus-vs-hades-max-win-room.jpg"
            alt="A $13,500 max win on Zeus vs Hades: Gods of War in our Hype.bet multiplayer room, at a $0.90 bet"
            width={1200}
            height={673}
            className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/10">
            <span className="flex items-center gap-2 rounded-full bg-hype px-5 py-2.5 text-sm font-black uppercase tracking-wide text-black shadow-lg">
              <Play size={16} fill="currentColor" />
              Watch on Kick
            </span>
          </span>
        </a>
        <figcaption className="mt-2 text-xs leading-5 text-slate-400">
          Our $13,500 Zeus vs Hades max win, shared by the whole room. Skip to 0:55 to see the players&apos; balances on
          the left jump.
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
        social casinos where you play with free coins. Those are played for fun, not real money. Everything in this guide
        is about real-money rooms, where the wins and losses are real.
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
        Gambling should be fun, in a room or on your own. If it stops being fun,{' '}
        <Link href="/responsible-gambling" className={LINK}>
          there&apos;s free help available
        </Link>
        .
      </GuideP>
    </>
  )
}
