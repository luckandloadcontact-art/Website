import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/guides'

// Own title and description for this page, so it doesn't share the site default in search results.
export const metadata: Metadata = {
  title: 'Contact LuckAndLoadTV',
  description: 'Get in touch with Kristian and Simon from LuckAndLoadTV by email, or find us on Kick, Twitch, Discord, TikTok and YouTube.',
  alternates: { canonical: `${SITE_URL}/contact` },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
