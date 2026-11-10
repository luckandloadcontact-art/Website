import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/guides'

// Own title and description for this page, so it doesn't share the site default in search results.
export const metadata: Metadata = {
  title: 'Monthly Leaderboard: $1,000 in Prizes – LuckAndLoadTV',
  description: "This month's top players under code LuckAndLoad on Hype.bet. $1,000 in prizes every month, plus a $20 random draw for everyone who plays.",
  alternates: { canonical: `${SITE_URL}/leaderboard` },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
