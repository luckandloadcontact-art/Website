import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function requireStaff() {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role
  if (!session || (role !== 'admin' && role !== 'mod')) return null
  return session
}

// Add the result of one Chat vs LuckAndLoad battle, dated today in Norway.
export async function POST(req: Request) {
  const session = await requireStaff()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const winner = body?.winner
  if (winner !== 'luckandload' && winner !== 'chat') {
    return NextResponse.json({ error: 'Send a winner of luckandload or chat.' }, { status: 400 })
  }

  const playedOn = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Oslo' })
  const { error } = await createAdminClient()
    .from('chat_vs_results')
    .insert({ winner, played_on: playedOn, created_by: session.user.dbId ?? null })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

// Remove one result, for fixing a mistake.
export async function DELETE(req: Request) {
  if (!(await requireStaff())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await createAdminClient().from('chat_vs_results').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
