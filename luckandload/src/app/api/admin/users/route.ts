import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, discord_id, username, display_name, avatar_url, role, points, created_at')
    .order('points', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// Change a user's role (user, mod or admin). Admins only, and not your own role, so the last
// admin can't lock themselves out by accident.
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json().catch(() => null)
  const id = typeof body?.id === 'string' ? body.id : ''
  const role = body?.role
  if (!id || (role !== 'user' && role !== 'mod' && role !== 'admin')) {
    return NextResponse.json({ error: 'Send an id and a role of user, mod or admin.' }, { status: 400 })
  }
  if (id === session.user.dbId) {
    return NextResponse.json({ error: 'You can’t change your own role.' }, { status: 400 })
  }
  const { error } = await createAdminClient().from('users').update({ role }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
