import type { Metadata } from 'next'
import { WordBanWidget } from '@/components/overlay/WordBanWidget'

// Word Ban timer. Add it in OBS as a Browser Source pointing to
// https://luckandloadtv.com/overlay/word-ban, sized 300x124 (or any size with the same ratio).
// Start and stop it in the admin panel under "Word ban"; it reacts within 2 seconds.
export const metadata: Metadata = {
  title: 'Word ban – LuckAndLoadTV',
  robots: { index: false, follow: false },
}

export default function WordBanOverlayPage() {
  return <WordBanWidget />
}
