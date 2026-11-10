import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/guides'

// Own title and description for this page, so it doesn't share the site default in search results.
export const metadata: Metadata = {
  title: 'Slot Wheel: Random Slot Picker – LuckAndLoadTV',
  description: "Can't decide what to play? Spin our slot wheel for a random slot and bonus buy amount, picked from more than 100 games.",
  alternates: { canonical: `${SITE_URL}/slot-wheel` },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
