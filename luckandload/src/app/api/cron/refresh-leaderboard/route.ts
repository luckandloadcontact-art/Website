import { NextResponse } from 'next/server'
import { getLeaderboardData } from '@/lib/affilka'

// Pinges av en GitHub Actions-cron (se .github/workflows/refresh-leaderboard.yml) hvert 20.
// minutt, uavhengig av om noen faktisk besøker /leaderboard akkurat da. Dette gjør at
// besøkende alltid treffer en varm cache i stedet for potensielt å trigge et live-kall til
// Affilka selv -- og gir oss full kontroll på nøyaktig hvor ofte vi spør dem, uansett trafikk.
//
// Beskyttet med en hemmelig nøkkel (CRON_SECRET) så ikke hvem som helst kan spamme dette
// endepunktet og spise av den delte 5-min cooldown-kvoten hos Affilka.
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const provided =
    request.headers.get('x-cron-secret') ?? new URL(request.url).searchParams.get('secret')

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await getLeaderboardData()

  if (!data) {
    return NextResponse.json({ ok: false, error: 'Fikk ikke hentet leaderboard-data' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, updatedAt: data.updatedAt, entries: data.entries.length })
}
