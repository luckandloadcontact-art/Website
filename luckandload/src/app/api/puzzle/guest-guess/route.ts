import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { WHEEL_GAMES } from '@/lib/slotWheel'
import { getPuzzleDay, PUZZLE_ATTEMPTS, findGameByName } from '@/lib/slotPuzzle'
import { decodeGuestToken, encodeGuestToken } from '@/lib/puzzleGuest'

// A guess on today's puzzle from someone who isn't signed in. Nothing is stored: the guesses go back
// to the browser in a new signed token. Guests earn no loads, and if they run out of guesses the
// answer stays hidden (sign in to see it), so guest play can't be used to farm loads.
export async function POST(req: NextRequest) {
  const { guess, token } = ((await req.json().catch(() => ({}))) ?? {}) as { guess?: string; token?: string }
  if (!guess || typeof guess !== 'string') return NextResponse.json({ error: 'Missing guess' }, { status: 400 })

  const guessedGame = findGameByName(guess)
  if (!guessedGame) return NextResponse.json({ error: 'Unknown game' }, { status: 400 })

  const date = getPuzzleDay()
  const { data: puzzleDay } = await createAdminClient()
    .from('puzzle_days').select('game_id').eq('puzzle_date', date).maybeSingle()
  if (!puzzleDay) return NextResponse.json({ error: 'Puzzle not started' }, { status: 400 })
  const game = WHEEL_GAMES.find(g => g.id === puzzleDay.game_id)
  if (!game) return NextResponse.json({ error: 'Game not found' }, { status: 500 })

  const previous = decodeGuestToken(token, date) ?? { date, guesses: [], solved: false }
  if (previous.solved || previous.guesses.length >= PUZZLE_ATTEMPTS) {
    return NextResponse.json({ error: 'No attempts left' }, { status: 400 })
  }
  if (previous.guesses.includes(guessedGame.name)) {
    return NextResponse.json({ error: 'Already guessed' }, { status: 400 })
  }

  const correct = guessedGame.id === game.id
  const state = { date, guesses: [...previous.guesses, guessedGame.name], solved: correct }
  const newToken = encodeGuestToken(state)
  const attemptsUsed = state.guesses.length
  const gameOver = correct || attemptsUsed >= PUZZLE_ATTEMPTS

  return NextResponse.json({
    correct,
    token: newToken,
    guesses: state.guesses,
    imageUrl: `/api/puzzle/image?date=${date}&v=${attemptsUsed}-${gameOver ? 1 : 0}&g=${encodeURIComponent(newToken)}`,
    attemptsUsed,
    maxAttempts: PUZZLE_ATTEMPTS,
    solved: correct,
    pointsAwarded: 0,
    zoomLevel: Math.min(attemptsUsed, PUZZLE_ATTEMPTS - 1),
    answer: correct ? { name: game.name, provider: game.provider } : null,
  })
}
