import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import { WHEEL_GAMES } from '@/lib/slotWheel'
import { MAX_PENDING_SUGGESTIONS, normalizeGameName, type SlotSuggestion } from '@/lib/slotSuggestions'

export const dynamic = 'force-dynamic'

type Row = {
  id: string
  game_name: string
  provider: string | null
  status: SlotSuggestion['status']
  created_at: string
  reviewed_at: string | null
}

function toSuggestion(row: Row): SlotSuggestion {
  return {
    id: row.id,
    gameName: row.game_name,
    provider: row.provider,
    status: row.status,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
  }
}

// The signed-in player's own suggestions, newest first.
export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.dbId
  if (!userId) return NextResponse.json({ error: 'Sign in with Discord first.' }, { status: 401 })

  const { data, error } = await createAdminClient()
    .from('slot_suggestions')
    .select('id, game_name, provider, status, created_at, reviewed_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30)
  if (error) return NextResponse.json({ error: 'Could not load your suggestions.' }, { status: 500 })

  const suggestions = (data as Row[]).map(toSuggestion)
  return NextResponse.json({
    suggestions,
    pending: suggestions.filter(s => s.status === 'pending').length,
    limit: MAX_PENDING_SUGGESTIONS,
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.dbId
  if (!userId) return NextResponse.json({ error: 'Sign in with Discord first.' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const gameName = typeof body?.gameName === 'string' ? body.gameName.replace(/\s+/g, ' ').trim() : ''
  const providerRaw = typeof body?.provider === 'string' ? body.provider.replace(/\s+/g, ' ').trim() : ''
  const provider = providerRaw || null

  if (gameName.length < 2 || gameName.length > 80) {
    return NextResponse.json({ error: 'Enter the name of the game (2 to 80 characters).' }, { status: 400 })
  }
  if (provider && provider.length > 60) {
    return NextResponse.json({ error: 'The provider name is too long.' }, { status: 400 })
  }

  const key = normalizeGameName(gameName)
  if (WHEEL_GAMES.some(game => normalizeGameName(game.name) === key)) {
    return NextResponse.json({ error: `${gameName} is already on the wheel.` }, { status: 409 })
  }

  const supabase = createAdminClient()
  const { count, error: countError } = await supabase
    .from('slot_suggestions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'pending')
  if (countError) return NextResponse.json({ error: 'Could not save your suggestion.' }, { status: 500 })
  if ((count ?? 0) >= MAX_PENDING_SUGGESTIONS) {
    return NextResponse.json(
      { error: `You already have ${MAX_PENDING_SUGGESTIONS} suggestions waiting. Wait until we've looked at them.` },
      { status: 429 }
    )
  }

  const { data, error } = await supabase
    .from('slot_suggestions')
    .insert({ user_id: userId, game_name: gameName, provider })
    .select('id, game_name, provider, status, created_at, reviewed_at')
    .single()
  if (error) {
    // Unique index: someone already has this game pending or approved.
    if (error.code === '23505') {
      return NextResponse.json({ error: `${gameName} has already been suggested.` }, { status: 409 })
    }
    return NextResponse.json({ error: 'Could not save your suggestion.' }, { status: 500 })
  }

  return NextResponse.json({ suggestion: toSuggestion(data as Row) }, { status: 201 })
}
