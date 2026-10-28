import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import { getPuzzleDay } from '@/lib/slotPuzzle'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'mod')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  const supabase = createAdminClient()
  const today = getPuzzleDay()

  // Sletter kun dagens forsøk -- gir en helt ren start, men rører ikke allerede tildelte loads
  // fra tidligere dager eller selve puzzle_days-raden (samme spill gjelder fortsatt i dag).
  await supabase.from('puzzle_attempts').delete().eq('user_id', userId).eq('puzzle_date', today)

  return NextResponse.json({ success: true })
}
