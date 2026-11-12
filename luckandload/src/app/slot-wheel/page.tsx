import Link from 'next/link'
import { SlotWheel } from '@/components/home/SlotWheel'
import { GuideDetails, GuideDetailsGroup, GuideH2, GuideInlineCta, GuideList, GuideP, JsonLd } from '@/components/guides/GuideContent'
import { WHEEL_GAMES } from '@/lib/slotWheel'

const PROVIDER_COUNT = new Set(WHEEL_GAMES.map(game => game.provider)).size

// Short, factual answers to what people ask about a slot picker. Also sent to Google as FAQPage data.
const FAQ = [
  {
    question: 'How does the random slot picker work?',
    answer: `Press Spin and the wheel lands on one of ${WHEEL_GAMES.length} slots at random. Every game has the same chance of being picked. You also get a suggested bonus buy amount between the minimum and maximum you set.`,
  },
  {
    question: 'Can I choose which providers are on the wheel?',
    answer: `Yes. Use the filter to pick from ${PROVIDER_COUNT} providers, such as Hacksaw Gaming, Nolimit City and Pragmatic Play. The wheel then only lands on games from the providers you have selected.`,
  },
  {
    question: 'Which slots are on the wheel?',
    answer:
      'Slots we play on stream and like. Signed-in viewers can suggest new games under the wheel, and we add the ones we think are good.',
  },
  {
    question: 'Is the slot picker free?',
    answer: 'Yes. It is free to use and you do not need an account to spin. You only need to sign in with Discord to suggest a game.',
  },
]

// Hourly, so links that change on a guide's publish day (like the review link) update by themselves.
export const revalidate = 3600

export default function SlotWheelPage() {
  return (
    <main className="min-h-screen pt-8 sm:pt-12">
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
      <SlotWheel asPage />

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <GuideH2>How to use the slot picker</GuideH2>
        <GuideList>
          <li>
            <strong className="text-white">Pick your providers.</strong> Open the filter and choose the studios you
            want, or leave them all on.
          </li>
          <li>
            <strong className="text-white">Set your bonus buy range.</strong> Enter a minimum and maximum, and the
            picker suggests an amount in between.
          </li>
          <li>
            <strong className="text-white">Spin.</strong> The wheel picks a random slot. Copy the name and open it at
            your casino.
          </li>
        </GuideList>
        <GuideInlineCta title="Got your slot? Play it on Hype.bet">
          Every game on the wheel is on Hype.bet, running the highest RTP version available. Players under our code also
          compete on our monthly leaderboard.
        </GuideInlineCta>
        <GuideP>
          We use the wheel on stream when chat can&apos;t agree on what to play next, and when we collect bonuses for a{' '}
          <Link href="/guides/what-is-a-bonus-hunt" className="text-brand-400 underline underline-offset-2 hover:text-brand-300">
            bonus hunt
          </Link>
          . Before you open the game, check
          its RTP in the game info, since the same slot can pay back less at some casinos.{' '}
          <Link href="/guides/does-rtp-matter" className="text-brand-400 underline underline-offset-2 hover:text-brand-300">
            Here&apos;s why RTP matters
          </Link>
          .
        </GuideP>

        <GuideH2>Questions about the slot picker</GuideH2>
        <GuideDetailsGroup>
          {FAQ.map(item => (
            <GuideDetails key={item.question} summary={item.question}>
              <GuideP>{item.answer}</GuideP>
            </GuideDetails>
          ))}
        </GuideDetailsGroup>
        <p className="text-xs text-slate-500">
          18+. Only bet what you can afford to lose.{' '}
          <Link href="/responsible-gambling" className="underline underline-offset-2 hover:text-slate-300">
            Get help
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
