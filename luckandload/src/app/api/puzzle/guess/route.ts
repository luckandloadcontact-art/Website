import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import { WHEEL_GAMES } from '@/lib/slotWheel'
import { getPuzzleDay, PUZZLE_ATTEMPTS, PUZZLE_POINTS, findGameByName, isDateInRange } from '@/lib/slotPuzzle'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.dbId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.dbId

  const { date, guess } = (await req.json()) as { date?: string; guess?: string }
  const today = getPuzzleDay()
  if (!date || !isDateInRange(date, today)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }
  if (!guess || typeof guess !== 'string') {
    return NextResponse.json({ error: 'Missing guess' }, { status: 400 })
  }

  const guessedGame = findGameByName(guess)
  if (!guessedGame) return NextResponse.json({ error: 'Unknown game' }, { status: 400 })

  const supabase = createAdminClient()

  const { data: puzzleDay } = await supabase
    .from('puzzle_days').select('game_id').eq('puzzle_date', date).maybeSingle()
  if (!puzzleDay) return NextResponse.json({ error: 'Puzzle not started' }, { status: 400 })
  const game = WHEEL_GAMES.find(g => g.id === puzzleDay.game_id)
  if (!game) return NextResponse.json({ error: 'Game not found' }, { status: 500 })

  const { data: existing } = await supabase
    .from('puzzle_attempts').select('*').eq('user_id', userId).eq('puzzle_date', date).maybeSingle()

  const guesses: string[] = existing?.guesses ?? []
  const alreadySolved = existing?.solved ?? false
  const alreadyOut = guesses.length >= PUZZLE_ATTEMPTS

  if (alreadySolved || alreadyOut) {
    return NextResponse.json({ error: 'No attempts left' }, { status: 400 })
  }

  const isCorrect = guessedGame.id === game.id
  const attemptIndex = guesses.length
  const newGuesses = [...guesses, guessedGame.name]
  const solved = isCorrect
  const isToday = date === today
  const pointsAwarded = isCorrect && isToday ? PUZZLE_POINTS[Math.min(attemptIndex, PUZZLE_POINTS.length - 1)] : 0

  if (existing) {
    await supabase.from('puzzle_attempts').update({
      guesses: newGuesses, solved, points_awarded: pointsAwarded, updated_at: new Date().toISOString(),
    }).eq('id', existing.id)
  } else {
    await supabase.from('puzzle_attempts').insert({
      user_id: userId, puzzle_date: date, guesses: newGuesses, solved, points_awarded: pointsAwarded,
    })
  }

  if (pointsAwarded > 0) {
    const { data: user } = await supabase.from('users').select('points').eq('id', userId).single()
    await Promise.all([
      supabase.from('users').update({ points: (user?.points ?? 0) + pointsAwarded }).eq('id', userId),
      supabase.from('point_transactions').insert({
        user_id: userId, delta: pointsAwarded, reason: `Guess the Slot (attempt ${attemptIndex + 1})`,
      }),
    ])
  }

  const attemptsUsed = newGuesses.length
  const gameOver = solved || attemptsUsed >= PUZZLE_ATTEMPTS
  const zoomLevel = Math.min(attemptsUsed, PUZZLE_ATTEMPTS - 1)

  return NextResponse.json({
    correct: isCorrect,
    guesses: newGuesses,
    attemptsUsed,
    maxAttempts: PUZZLE_ATTEMPTS,
    solved,
    pointsAwarded,
    zoomLevel,
    answer: gameOver ? { name: game.name, provider: game.provider } : null,
  })
}
