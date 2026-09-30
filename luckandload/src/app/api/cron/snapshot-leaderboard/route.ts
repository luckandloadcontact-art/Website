import { NextResponse } from 'next/server'
import { captureLeaderboardSnapshot, isLastDayOfMonthUTC } from '@/lib/affilka'

// Pinges av en GitHub Actions-cron (se .github/workflows/snapshot-leaderboard.yml) flere ganger
// i løpet av siste time av hver måned (UTC). Endepunktet er selv "smart" -- det gjør ingenting
// (skipped: true) med mindre det faktisk ER siste dag i måneden, så det er trygt å pinge ofte
// uten å risikere å fryse feil måneds data. Siste vellykkede kjøring før midnatt UTC blir
// dermed automatisk den som vinner (upsert i captureLeaderboardSnapshot).
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const { searchParams } = new URL(request.url)
  const provided = request.headers.get('x-cron-secret') ?? searchParams.get('secret')

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const force = searchParams.get('force') === 'true'
  if (!force && !isLastDayOfMonthUTC()) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'Ikke siste dag i måneden (UTC) ennå' })
  }

  try {
    const data = await captureLeaderboardSnapshot()
    return NextResponse.json({ ok: true, periodFrom: data.periodFrom, entries: data.entries.length })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Ukjent feil' },
      { status: 502 }
    )
  }
}
