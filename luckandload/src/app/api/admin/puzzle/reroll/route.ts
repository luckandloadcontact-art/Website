import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import { WHEEL_GAMES } from '@/lib/slotWheel'
import { getPuzzleDay } from '@/lib/slotPuzzle'

const RECENT_AVOID_COUNT = 14

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'mod')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createAdminClient()
  const today = getPuzzleDay()

  const { data: current } = await supabase
    .from('puzzle_days').select('game_id').eq('puzzle_date', today).maybeSingle()

  const { data: recent } = await supabase
    .from('puzzle_days').select('game_id')
    .lt('puzzle_date', today)
    .order('puzzle_date', { ascending: false })
    .limit(RECENT_AVOID_COUNT)

  const excludeIds = new Set(
    [...(recent ?? []).map(r => r.game_id as string), current?.game_id].filter(Boolean) as string[]
  )

  let candidates = WHEEL_GAMES.filter(g => !excludeIds.has(g.id))
  if (candidates.length === 0) candidates = WHEEL_GAMES.filter(g => g.id !== current?.game_id)
  if (candidates.length === 0) candidates = WHEEL_GAMES

  const newGame = candidates[Math.floor(Math.random() * candidates.length)]

  await supabase.from('puzzle_days').upsert(
    { puzzle_date: today, game_id: newGame.id }, { onConflict: 'puzzle_date' }
  )
  // Nullstiller ALLE spilleres fremgang for i dag -- gamle gjetninger ville vært inkonsistente
  // mot det nye svaret (f.eks. noen vist som "løst" mot et spill som ikke lenger er dagens).
  await supabase.from('puzzle_attempts').delete().eq('puzzle_date', today)

  return NextResponse.json({ success: true })
}
