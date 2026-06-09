import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'

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
    .from('announcements')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await req.json()
  const { title, body: msgBody, type, pinned } = body
  if (!title || !msgBody) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('announcements')
    .insert({ title, body: msgBody, type: type || 'info', pinned: !!pinned, published: true, author_id: session.user.dbId })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
