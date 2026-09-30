import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { captureLeaderboardSnapshot, getLeaderboardSnapshots } from '@/lib/affilka'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'mod')) return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const snapshots = await getLeaderboardSnapshots()
    return NextResponse.json(snapshots)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Ukjent feil' }, { status: 500 })
  }
}

// Lar admin fryse ned inneværende måneds leaderboard manuelt, uavhengig av cron-jobben --
// nyttig hvis man vil ta vare på en snapshot midt i måneden, eller som backup hvis den
// automatiske jobben skulle bomme rett før månedsskiftet.
export async function POST() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const data = await captureLeaderboardSnapshot()
    return NextResponse.json({ ok: true, periodFrom: data.periodFrom, entries: data.entries.length })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Ukjent feil' }, { status: 502 })
  }
}
