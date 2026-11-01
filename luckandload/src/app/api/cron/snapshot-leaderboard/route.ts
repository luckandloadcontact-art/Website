import { NextResponse } from 'next/server'
import { captureLeaderboardSnapshot, isLastDayOfMonthUTC, previousMonthKey } from '@/lib/affilka'

// Pinges av en GitHub Actions-cron (se .github/workflows/snapshot-leaderboard.yml). Endepunktet er
// selv "smart" og bestemmer hva som skal fryses ut fra dagens dato (UTC):
//  - siste dag i måneden: inneværende måned slik den står akkurat nå (foreløpig snapshot)
//  - dag 1-3 i ny måned: FORRIGE måned med endelige tall for hele måneden (overskriver den
//    foreløpige via upsert). Dette er sikkerhetsnettet: GitHub-cron kan bli forsinket med flere
//    timer (oktober 2026 startet 23:50-kjøringen først 02:39 UTC 1. november), og da ville
//    siste-dag-kjøringen alene ha bommet helt.
//  - ellers: ingenting (skipped: true)
// ?month=YYYY-MM tvinger frem en snapshot av en bestemt avsluttet måned (manuell reparasjon),
// ?force=true tvinger frem en snapshot av inneværende måned.
export const dynamic = 'force-dynamic'

const CATCH_UP_DAYS = 3

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const { searchParams } = new URL(request.url)
  const provided = request.headers.get('x-cron-secret') ?? searchParams.get('secret')

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  let month: string | undefined
  if (searchParams.get('month')) {
    month = searchParams.get('month')!
  } else if (searchParams.get('force') === 'true' || isLastDayOfMonthUTC(now)) {
    month = undefined
  } else if (now.getUTCDate() <= CATCH_UP_DAYS) {
    month = previousMonthKey(now)
  } else {
    return NextResponse.json({ ok: true, skipped: true, reason: 'Ikke månedsskifte (UTC)' })
  }

  try {
    const data = await captureLeaderboardSnapshot(month)
    return NextResponse.json({ ok: true, periodFrom: data.periodFrom, entries: data.entries.length })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Ukjent feil' },
      { status: 502 }
    )
  }
}
