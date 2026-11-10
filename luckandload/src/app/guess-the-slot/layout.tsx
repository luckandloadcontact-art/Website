import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/guides'

// Own title and description for this page, so it doesn't share the site default in search results.
export const metadata: Metadata = {
  title: 'Guess the Slot: Daily Slot Quiz – LuckAndLoadTV',
  description: 'A new zoomed-in slot screenshot every day. Guess the game in as few tries as possible and earn loads. Free to play.',
  alternates: { canonical: `${SITE_URL}/guess-the-slot` },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
