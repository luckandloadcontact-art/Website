import type { Metadata } from 'next'
import { GuideH2, GuideList, GuideP } from '@/components/guides/GuideContent'
import { SITE_URL } from '@/lib/guides'

// Own title and description for this page, so it doesn't share the site default in search results.
export const metadata: Metadata = {
  title: 'Guess the Slot: Daily Slot Quiz – LuckAndLoadTV',
  description: 'A new zoomed-in slot screenshot every day. Guess the game in as few tries as possible and earn loads. Free to play.',
  alternates: { canonical: `${SITE_URL}/guess-the-slot` },
}

// The game itself only renders in the browser, so this short explanation under it is also what
// search engines read.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <GuideH2>How Guess the Slot works</GuideH2>
        <GuideP>
          Every day there&apos;s a new zoomed-in screenshot from a slot. Your job is to name the game. It&apos;s free,
          and you play for loads, our community points.
        </GuideP>
        <GuideList>
          <li>You get five guesses. After each wrong guess, the picture zooms out a little more.</li>
          <li>The fewer guesses you need, the more loads you get: 25 on the first try, down to 5 on the last.</li>
          <li>Start typing and pick the game from the list, so the spelling is always right.</li>
        </GuideList>
        <GuideP>Sign in with Discord to play.</GuideP>
      </section>
    </>
  )
}
