import type { Metadata } from 'next'
import { GuideH2, GuideList, GuideP } from '@/components/guides/GuideContent'
import { SITE_URL } from '@/lib/guides'

// Own title and description for this page, so it doesn't share the site default in search results.
export const metadata: Metadata = {
  title: 'Daily Blackjack: 3 Free Hands a Day – LuckAndLoadTV',
  description: 'Play three free hands of blackjack every day, earn loads and climb the reward tiers. Free to play: just sign in with Discord.',
  alternates: { canonical: `${SITE_URL}/blackjack` },
}

// The game itself only renders in the browser, so this short explanation under it is also what
// search engines read.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <GuideH2>How Daily Blackjack works</GuideH2>
        <GuideP>
          Daily Blackjack is a free game for our community. You get three hands every day, and new hands arrive at
          18:00 Norwegian time. There&apos;s no real money involved: you play for loads, our community points.
        </GuideP>
        <GuideList>
          <li>A win gives 50 loads, and a blackjack gives 100.</li>
          <li>A push gives 15 loads, and even a loss gives 5.</li>
          <li>Collect loads to climb the reward tiers: Bronze at 2,500, Silver at 5,000 and Gold at 10,000.</li>
        </GuideList>
        <GuideP>Sign in with Discord to play. It only takes a few seconds and is free.</GuideP>
      </section>
    </>
  )
}
