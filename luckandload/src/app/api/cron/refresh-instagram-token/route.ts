import { NextResponse } from 'next/server'
import { refreshInstagramToken } from '@/lib/socialFeed'

// Pinges ukentlig (se .github/workflows/refresh-instagram-token.yml). Instagram sin long-lived
// token er gyldig 60 dager og kan fornyes når som helst etter de første 24 timene -- en ukentlig
// fornyelse gir god margin og betyr at ingen manuelt må huske på dette.
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const provided = request.headers.get('x-cron-secret') ?? new URL(request.url).searchParams.get('secret')

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await refreshInstagramToken()
    if (!result) return NextResponse.json({ ok: true, skipped: true, reason: 'Ingen Instagram-token satt opp ennå' })
    return NextResponse.json({ ok: true, expiresAt: result.expiresAt })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Ukjent feil' },
      { status: 502 }
    )
  }
}
