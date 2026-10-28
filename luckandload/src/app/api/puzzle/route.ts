import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import { WHEEL_GAMES } from '@/lib/slotWheel'
import {
  getPuzzleDay, PUZZLE_ATTEMPTS, pickGameForDate, isDateInRange, FIRST_PUZZLE_DATE,
} from '@/lib/slotPuzzle'

const RECENT_AVOID_COUNT = 14

async function ensurePuzzleDay(supabase: ReturnType<typeof createAdminClient>, date: string) {
  const { data: existing } = await supabase
    .from('puzzle_days').select('game_id').eq('puzzle_date', date).maybeSingle()
  if (existing) return existing.game_id as string

  const { data: recent } = await supabase
    .from('puzzle_days').select('game_id')
    .lt('puzzle_date', date)
    .order('puzzle_date', { ascending: false })
    .limit(RECENT_AVOID_COUNT)
  const recentIds = (recent ?? []).map(r => r.game_id as string)

  const game = pickGameForDate(date, recentIds)
  const { data: inserted, error } = await supabase
    .from('puzzle_days').insert({ puzzle_date: date, game_id: game.id })
    .select('game_id').single()
  // Race mot en annen samtidig forespørsel som opprettet raden først -- les den i stedet.
  if (error) {
    const { data: raceWinner } = await supabase
      .from('puzzle_days').select('game_id').eq('puzzle_date', date).maybeSingle()
    if (raceWinner) return raceWinner.game_id as string
    throw error
  }
  return inserted.game_id as string
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const today = getPuzzleDay()
  const date = req.nextUrl.searchParams.get('date') || today

  if (!isDateInRange(date, today)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const gameId = await ensurePuzzleDay(supabase, date)
  const game = WHEEL_GAMES.find(g => g.id === gameId)
  if (!game) return NextResponse.json({ error: 'Game not found' }, { status: 500 })

  let guesses: string[] = []
  let solved = false
  let pointsAwarded = 0

  if (session?.user?.dbId) {
    const { data: attempt } = await supabase
      .from('puzzle_attempts').select('guesses, solved, points_awarded')
      .eq('user_id', session.user.dbId).eq('puzzle_date', date).maybeSingle()
    if (attempt) {
      guesses = attempt.guesses ?? []
      solved = attempt.solved
      pointsAwarded = attempt.points_awarded
    }
  }

  const attemptsUsed = guesses.length
  const gameOver = solved || attemptsUsed >= PUZZLE_ATTEMPTS
  const zoomLevel = Math.min(attemptsUsed, PUZZLE_ATTEMPTS - 1)

  return NextResponse.json({
    date,
    isToday: date === today,
    canGoPrevious: date > FIRST_PUZZLE_DATE,
    canGoNext: date < today,
    image: game.image,
    attemptsUsed,
    maxAttempts: PUZZLE_ATTEMPTS,
    guesses,
    solved,
    pointsAwarded,
    zoomLevel,
    answer: gameOver ? { name: game.name, provider: game.provider } : null,
  })
}
