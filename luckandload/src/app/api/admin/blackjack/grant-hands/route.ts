import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'mod')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  const supabase = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  // Delete all hands and session for today — gives a completely clean slate
  await Promise.all([
    supabase.from('blackjack_hands').delete().eq('user_id', userId).eq('play_date', today),
    supabase.from('blackjack_sessions').delete().eq('user_id', userId).eq('play_date', today),
  ])

  return NextResponse.json({ success: true })
}
