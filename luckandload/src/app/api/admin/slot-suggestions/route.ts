import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import type { AdminSlotSuggestion, SuggestionStatus } from '@/lib/slotSuggestions'

export const dynamic = 'force-dynamic'

async function requireStaff() {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role
  if (!session || (role !== 'admin' && role !== 'mod')) return null
  return session
}

type Row = {
  id: string
  game_name: string
  provider: string | null
  status: SuggestionStatus
  created_at: string
  reviewed_at: string | null
  user: { username: string; display_name: string | null; avatar_url: string | null } | null
}

// All suggestions: pending first (oldest first, so nothing waits too long), then the rest, newest first.
export async function GET() {
  if (!(await requireStaff())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await createAdminClient()
    .from('slot_suggestions')
    .select(
      'id, game_name, provider, status, created_at, reviewed_at, user:users!slot_suggestions_user_id_fkey(username, display_name, avatar_url)'
    )
    .order('created_at', { ascending: false })
    .limit(300)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = (data as unknown as Row[]).map(
    (row): AdminSlotSuggestion => ({
      id: row.id,
      gameName: row.game_name,
      provider: row.provider,
      status: row.status,
      createdAt: row.created_at,
      reviewedAt: row.reviewed_at,
      suggestedBy: row.user?.display_name || row.user?.username || 'Unknown',
      avatarUrl: row.user?.avatar_url ?? null,
    })
  )
  const pending = rows.filter(r => r.status === 'pending').reverse()
  const reviewed = rows.filter(r => r.status !== 'pending')
  return NextResponse.json([...pending, ...reviewed])
}

// Approve or decline one suggestion.
export async function PATCH(req: Request) {
  const session = await requireStaff()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const id = typeof body?.id === 'string' ? body.id : ''
  const status = body?.status
  if (!id || (status !== 'approved' && status !== 'declined')) {
    return NextResponse.json({ error: 'Send an id and a status of approved or declined.' }, { status: 400 })
  }

  const { error } = await createAdminClient()
    .from('slot_suggestions')
    .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: session.user.dbId ?? null })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
