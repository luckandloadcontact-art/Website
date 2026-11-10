import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/guides'

// Own title and description for this page, so it doesn't share the site default in search results.
export const metadata: Metadata = {
  title: 'Events and Community Tournaments – LuckAndLoadTV',
  description: 'Community tournaments and special events from LuckAndLoadTV, like our Slot Provider Battle where viewers vote on their favourite slot providers.',
  alternates: { canonical: `${SITE_URL}/events` },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
