import { NextResponse } from 'next/server'
import { getLeaderboardData } from '@/lib/affilka'

export const revalidate = 300

export async function GET() {
  const data = await getLeaderboardData()

  if (!data) {
    return NextResponse.json({ error: 'Kunne ikke hente leaderboard akkurat nå' }, { status: 502 })
  }

  return NextResponse.json(data)
}
