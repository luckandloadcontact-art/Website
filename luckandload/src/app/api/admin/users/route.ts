import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'mod')) {
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
