import type { Metadata } from 'next'
import { TICKER_ITEMS, Ticker, type TickerItem } from '@/components/overlay/Ticker'

// Wide, low info bar for the stream overlay. Add it in OBS as a Browser Source pointing to
// https://luckandloadtv.com/overlay/ticker, sized 1120x40 (or any size with the same ratio).
// Choose what it shows and in which order with ?show=, e.g. ?show=viewers,btc,clock.
// Items: viewers, followers, leaderboard, btc, eth, clock (all of them by default).
export const metadata: Metadata = {
  title: 'Ticker – LuckAndLoadTV',
  robots: { index: false, follow: false },
}

export default function TickerOverlayPage({ searchParams }: { searchParams: { show?: string } }) {
  const requested = (searchParams.show ?? '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter((s): s is TickerItem => (TICKER_ITEMS as string[]).includes(s))
  return <Ticker items={requested.length > 0 ? requested : TICKER_ITEMS} />
}
