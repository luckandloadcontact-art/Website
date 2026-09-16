import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import { EVENT_SLUG, ALL_MATCH_IDS, computeBracket, getDownstreamMatchIds } from '@/lib/tournament'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'mod')) return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('tournament_results')
    .select('match_id, winner')
    .eq('event_slug', EVENT_SLUG)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = Object.fromEntries((data ?? []).map(r => [r.match_id, r.winner]))
  return NextResponse.json(results)
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { matchId, winner } = body as { matchId?: string; winner?: string }

  if (!matchId || !ALL_MATCH_IDS.includes(matchId)) {
    return NextResponse.json({ error: 'Ugyldig matchId' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Hent eksisterende resultater for å validere at valgt vinner faktisk er en av de to
  // gyldige deltakerne i denne kampen (og at forrige runde er avgjort for semifinaler/finale).
  const { data: existing, error: fetchError } = await supabase
    .from('tournament_results')
    .select('match_id, winner')
    .eq('event_slug', EVENT_SLUG)
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

  const results = Object.fromEntries((existing ?? []).map(r => [r.match_id, r.winner]))
  const bracket = computeBracket(results)
  const allMatches = [...bracket.qf, ...bracket.sf, bracket.final]
  const match = allMatches.find(m => m.id === matchId)

  if (!match || !match.providerA || !match.providerB) {
    return NextResponse.json(
      { error: 'Denne kampen er ikke klar ennå -- forrige runde må avgjøres først' },
      { status: 400 }
    )
  }
  if (winner !== match.providerA && winner !== match.providerB) {
    return NextResponse.json({ error: 'Vinneren må være en av de to deltakerne i kampen' }, { status: 400 })
  }

  const { error } = await supabase.from('tournament_results').upsert(
    {
      event_slug: EVENT_SLUG,
      match_id: matchId,
      winner,
      updated_by: session.user.dbId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'event_slug,match_id' }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const matchId = searchParams.get('matchId')
  if (!matchId || !ALL_MATCH_IDS.includes(matchId)) {
    return NextResponse.json({ error: 'Ugyldig matchId' }, { status: 400 })
  }

  // Nedstrøms kamper (som fikk deltakere FRA denne kampens vinner) blir foreldreløse hvis vi
  // ikke også nullstiller dem -- se getDownstreamMatchIds.
  const idsToClear = [matchId, ...getDownstreamMatchIds(matchId)]

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('tournament_results')
    .delete()
    .eq('event_slug', EVENT_SLUG)
    .in('match_id', idsToClear)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, cleared: idsToClear })
}
