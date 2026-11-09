import type { Metadata } from 'next'
import { StreamWidget } from '@/components/overlay/StreamWidget'
import { getLeaderboardData } from '@/lib/affilka'
import { activeOffer, getCasino } from '@/lib/casinos'

// Rotating banner for the stream layout. Add it in OBS as a Browser Source pointing to
// https://luckandloadtv.com/overlay/stream, sized 480x320 (or any 3:2 size).
export const metadata: Metadata = {
  title: 'Stream widget – LuckAndLoadTV',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function StreamOverlayPage() {
  const leaderboard = await getLeaderboardData()
  const hype = getCasino('hype-bet')
  const offer = hype ? activeOffer(hype) : null

  return (
    <>
      {/* OBS shows the page on top of the stream, so everything outside the widget is transparent. */}
      <style>{'html,body{background:transparent!important;overflow:hidden}'}</style>
      <StreamWidget
        entries={(leaderboard?.entries ?? []).slice(0, 5)}
        periodFrom={leaderboard?.periodFrom ?? null}
        offer={offer ? { headline: offer.headline, banner: offer.banner?.src ?? null } : null}
      />
    </>
  )
}
