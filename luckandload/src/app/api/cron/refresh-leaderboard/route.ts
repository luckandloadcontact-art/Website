import { NextResponse } from 'next/server'
import { getLeaderboardData, fetchLeaderboardData } from '@/lib/affilka'
import { createAdminClient } from '@/lib/supabase'

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
  const { searchParams } = new URL(request.url)
  const provided = request.headers.get('x-cron-secret') ?? searchParams.get('secret')

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ?debug=1: kjører hvert steg (les cache -> hent fra Affilka -> skriv cache) for seg og
  // rapporterer nøyaktig hvor det feiler. getLeaderboardData() svelger feil og serverer gammel
  // data i stillhet, så uten dette er en fastlåst cache umulig å feilsøke uten Vercel-loggene
  // (skjedde 2026-10-31 -> 11-01). Bruker ett reelt Affilka-kall.
  if (searchParams.get('debug') === '1') {
    const supabase = createAdminClient()
    const { data: row, error: readError } = await supabase
      .from('leaderboard_cache')
      .select('fetched_at, fetch_claimed_at, data->periodFrom, data->updatedAt')
      .eq('id', 'current')
      .maybeSingle()
    if (readError) return NextResponse.json({ stage: 'read', error: readError.message, row }, { status: 500 })

    let fresh
    try {
      fresh = await fetchLeaderboardData()
    } catch (err) {
      return NextResponse.json(
        { stage: 'fetch', error: err instanceof Error ? err.message : String(err), row },
        { status: 502 }
      )
    }

    const { data: written, error: writeError } = await supabase
      .from('leaderboard_cache')
      .update({ data: fresh, fetched_at: fresh.updatedAt, fetch_claimed_at: null })
      .eq('id', 'current')
      .select('fetched_at')
    if (writeError || !written?.length) {
      return NextResponse.json(
        { stage: 'write', error: writeError?.message ?? 'Ingen rad oppdatert', row },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, row, periodFrom: fresh.periodFrom, entries: fresh.entries.length })
  }

  const data = await getLeaderboardData()

  if (!data) {
    return NextResponse.json({ ok: false, error: 'Fikk ikke hentet leaderboard-data' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, updatedAt: data.updatedAt, entries: data.entries.length })
}
