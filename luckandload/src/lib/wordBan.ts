// Word Ban: a timer on stream while a word is banned. Started from the admin panel, shown by the
// overlay /overlay/word-ban. Types and helpers only, so client components can import it.

export const WORD_BAN_ID = 'word-ban'
export const WORD_BAN_DEFAULT_MINUTES = 5

export type WordBanState = {
  // When the timer runs out, or null when it isn't running.
  endsAt: string | null
  // Length of the current (or next) round, for the idle display.
  durationSec: number
  // Optional: the banned word, shown under the timer.
  word: string | null
}

export type WordBanResponse = WordBanState & { serverNow: string }

export const EMPTY_WORD_BAN: WordBanState = {
  endsAt: null,
  durationSec: WORD_BAN_DEFAULT_MINUTES * 60,
  word: null,
}

/** "4:59" style, never negative. */
export function formatWordBanTime(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
