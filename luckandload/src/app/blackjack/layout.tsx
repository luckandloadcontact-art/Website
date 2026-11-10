import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/guides'

// Own title and description for this page, so it doesn't share the site default in search results.
export const metadata: Metadata = {
  title: 'Daily Blackjack: 3 Free Hands a Day – LuckAndLoadTV',
  description: 'Play three free hands of blackjack every day, earn loads and climb the reward tiers. Free to play: just sign in with Discord.',
  alternates: { canonical: `${SITE_URL}/blackjack` },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
