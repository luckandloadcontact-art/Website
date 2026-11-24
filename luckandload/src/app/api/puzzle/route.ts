import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import { WHEEL_GAMES } from '@/lib/slotWheel'
import {
  getPuzzleDay, PUZZLE_ATTEMPTS, pickGameForDate, isDateInRange, FIRST_PUZZLE_DATE,
} from '@/lib/slotPuzzle'
import { decodeGuestToken } from '@/lib/puzzleGuest'

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
  // Guests (not signed in) can only play today's puzzle; past puzzles need Discord sign-in.
  const guest = !session?.user?.dbId
  const date = guest ? today : req.nextUrl.searchParams.get('date') || today

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

  // A guest's guesses come from their signed token (see lib/puzzleGuest).
  let guestToken: string | null = null
  if (guest) {
    const token = req.nextUrl.searchParams.get('g')
    const state = decodeGuestToken(token, date)
    if (state) {
      guesses = state.guesses
      solved = state.solved
      guestToken = token
    }
  }

  const attemptsUsed = guesses.length
  const gameOver = solved || attemptsUsed >= PUZZLE_ATTEMPTS
  const zoomLevel = Math.min(attemptsUsed, PUZZLE_ATTEMPTS - 1)

  return NextResponse.json({
    date,
    isToday: date === today,
    canGoPrevious: !guest && date > FIRST_PUZZLE_DATE,
    guest,
    canGoNext: date < today,
    // Shown in the share text, like "Guess the Slot #24". Puzzle #1 is FIRST_PUZZLE_DATE.
    puzzleNumber: Math.round((Date.parse(date) - Date.parse(FIRST_PUZZLE_DATE)) / 86_400_000) + 1,
    // Peker til et endepunkt som selv regner ut og rendrer riktig utsnitt server-side -- vi
    // sender aldri den ekte bilde-stien (eller originalbildet) til klienten før spillet er
    // over, ellers kan "Lagre bilde"/Live Text på mobil avsløre svaret (se app/api/puzzle/image).
    imageUrl: `/api/puzzle/image?date=${date}&v=${attemptsUsed}-${gameOver ? 1 : 0}${
      guestToken ? `&g=${encodeURIComponent(guestToken)}` : ''
    }`,
    attemptsUsed,
    maxAttempts: PUZZLE_ATTEMPTS,
    guesses,
    solved,
    pointsAwarded,
    zoomLevel,
    // Guests only see the answer if they solved it, so nobody can use guest play to find the
    // answer and then sign in for the loads.
    answer: gameOver && (!guest || solved) ? { name: game.name, provider: game.provider } : null,
  })
}
