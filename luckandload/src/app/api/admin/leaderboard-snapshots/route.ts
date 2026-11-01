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
// automatiske jobben skulle bomme rett før månedsskiftet. Body { month: 'YYYY-MM' } fryser i
// stedet en avsluttet måned med endelige tall (se completedMonthRange i lib/affilka).
export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const month = typeof body?.month === 'string' ? body.month : undefined

  try {
    const data = await captureLeaderboardSnapshot(month)
    return NextResponse.json({ ok: true, periodFrom: data.periodFrom, entries: data.entries.length })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Ukjent feil' }, { status: 502 })
  }
}
