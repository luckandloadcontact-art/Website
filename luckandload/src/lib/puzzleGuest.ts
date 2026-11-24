import { createHmac, timingSafeEqual } from 'crypto'

// Guest play for Guess the Slot: visitors who aren't signed in can play today's puzzle. Their
// guesses live in a token the browser keeps, signed by the server, so the server still decides how
// much of the cover the image endpoint shows (a guest can't skip straight to the clear picture).
// Guests earn no loads and can't play past puzzles. Server only (uses the auth secret).

export type GuestPuzzleState = { date: string; guesses: string[]; solved: boolean }

function secret(): string {
  const value = process.env.NEXTAUTH_SECRET
  if (!value) throw new Error('NEXTAUTH_SECRET is not set')
  return value
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(`puzzle-guest:${payload}`).digest('base64url')
}

export function encodeGuestToken(state: GuestPuzzleState): string {
  const payload = Buffer.from(JSON.stringify(state)).toString('base64url')
  return `${payload}.${sign(payload)}`
}

/** The state in a guest token, or null if it's missing, tampered with or for another day. */
export function decodeGuestToken(token: string | null | undefined, date: string): GuestPuzzleState | null {
  if (!token || token.length > 4000) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  try {
    const state = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as GuestPuzzleState
    if (state.date !== date || !Array.isArray(state.guesses)) return null
    return { date: state.date, guesses: state.guesses.map(String).slice(0, 10), solved: !!state.solved }
  } catch {
    return null
  }
}
