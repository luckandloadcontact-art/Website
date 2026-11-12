import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/guides'

// Own title and description for this page, so it doesn't share the site default in search results.
export const metadata: Metadata = {
  title: 'Random Slot Picker: Spin the Slot Wheel – LuckAndLoadTV',
  description: "Free random slot picker: spin the wheel for a random slot from 100+ games, filter by provider and get a suggested bonus buy amount.",
  alternates: { canonical: `${SITE_URL}/slot-wheel` },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
