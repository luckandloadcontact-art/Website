import { NextResponse } from 'next/server'
import { getLeaderboardData } from '@/lib/affilka'

// Se leaderboard/page.tsx for hvorfor dette må være force-dynamic og ikke statisk/ISR.
export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await getLeaderboardData()

  if (!data) {
    return NextResponse.json({ error: 'Kunne ikke hente leaderboard akkurat nå' }, { status: 502 })
  }

  return NextResponse.json(data)
}
