import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/guides'

// Own title and description for this page, so it doesn't share the site default in search results.
export const metadata: Metadata = {
  title: 'Your Profile – LuckAndLoadTV',
  description: 'Your LuckAndLoadTV profile.',
  alternates: { canonical: `${SITE_URL}/profile` },
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
