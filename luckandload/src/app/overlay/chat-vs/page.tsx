import type { Metadata } from 'next'
import { ChatVsWidget } from '@/components/overlay/ChatVsWidget'

// Chat vs LuckAndLoad score for Throwdown Thursday. Add it in OBS as a Browser Source pointing to
// https://luckandloadtv.com/overlay/chat-vs, sized 460x132 (or any size with the same ratio).
// Results are added in the admin panel under "Chat vs L&L" and show up within 15 seconds.
export const metadata: Metadata = {
  title: 'Chat vs LuckAndLoad – LuckAndLoadTV',
  robots: { index: false, follow: false },
}

export default function ChatVsOverlayPage() {
  return <ChatVsWidget />
}
