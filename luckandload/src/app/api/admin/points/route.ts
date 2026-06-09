import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'mod')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { userId, delta, reason } = await req.json()
  if (!userId || typeof delta !== 'number') {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const supabase = createAdminClient()

  // Get current points
  const { data: user, error: fetchError } = await supabase
    .from('users').select('points').eq('id', userId).single()
  if (fetchError || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const newPoints = Math.max(0, user.points + delta)
  const { error: updateError } = await supabase
    .from('users').update({ points: newPoints }).eq('id', userId)
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  // Log transaction
  await supabase.from('point_transactions').insert({
    user_id: userId,
    delta,
    reason: reason || 'Admin adjustment',
  })

  return NextResponse.json({ success: true, newPoints })
}
