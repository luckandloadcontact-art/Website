import { NextResponse } from 'next/server'
import { CASINOS } from '@/lib/casinos'
import { GUIDES } from '@/lib/guides'
import { recordHypeClick } from '@/lib/growth'

// Public pages that can hold a Hype.bet link. Anything else is counted as "other", so a script
// posting made-up paths cannot create unlimited rows in the database.
const TRACKED_PATHS = new Set([
  '/',
  '/blackjack',
  '/casinos',
  ...CASINOS.map(casino => `/casinos/${casino.slug}`),
  '/events',
  '/guess-the-slot',
  '/guides',
  '/leaderboard',
  '/slot-wheel',
  ...GUIDES.map(guide => `/guides/${guide.slug}`),
])

export async function POST(request: Request) {
  const host = request.headers.get('host')
  const origin = request.headers.get('origin')
  if (!host || !origin?.endsWith(`//${host}`)) {
    return new NextResponse(null, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const path = typeof body?.path === 'string' && TRACKED_PATHS.has(body.path) ? body.path : 'other'
  await recordHypeClick(path)

  return new NextResponse(null, { status: 204 })
}
