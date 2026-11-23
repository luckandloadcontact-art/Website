import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import { WORD_BAN_DEFAULT_MINUTES, WORD_BAN_ID, type WordBanState } from '@/lib/wordBan'

export const dynamic = 'force-dynamic'

async function requireStaff() {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role
  if (!session || (role !== 'admin' && role !== 'mod')) return null
  return session
}

// Start (or restart) the timer, or stop it.
// { action: 'start', minutes?: number, word?: string } or { action: 'stop' }
export async function POST(req: Request) {
  if (!(await requireStaff())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const action = body?.action
  if (action !== 'start' && action !== 'stop') {
    return NextResponse.json({ error: 'Send an action of start or stop.' }, { status: 400 })
  }

  const minutesRaw = Number(body?.minutes ?? WORD_BAN_DEFAULT_MINUTES)
  const minutes = Number.isFinite(minutesRaw) ? Math.min(60, Math.max(0.5, minutesRaw)) : WORD_BAN_DEFAULT_MINUTES
  const word = typeof body?.word === 'string' && body.word.trim() ? body.word.trim().slice(0, 30) : null
  const durationSec = Math.round(minutes * 60)

  const state: WordBanState =
    action === 'start'
      ? { endsAt: new Date(Date.now() + durationSec * 1000).toISOString(), durationSec, word }
      : { endsAt: null, durationSec, word }

  const { error } = await createAdminClient()
    .from('overlay_state')
    .upsert({ id: WORD_BAN_ID, data: state, updated_at: new Date().toISOString() })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, state })
}
