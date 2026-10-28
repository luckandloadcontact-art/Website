import { WHEEL_GAMES, type WheelGame } from '@/lib/slotWheel'
// getBlackjackDay/getPreviousBlackjackDay er egentlig bare "sidens daglige 18:00-Oslo-reset" --
// ikke noe spesifikt for blackjack. Gjenbrukes her i stedet for å duplisere den DST-sikre
// tidssone-utregningen. lib/blackjack.ts er bevisst holdt 100% klient-trygg (ingen server-only
// imports), så dette er trygt å importere fra både API-routes og klient-komponenter.
import { getBlackjackDay, getPreviousBlackjackDay } from '@/lib/blackjack'

export const getPuzzleDay = getBlackjackDay
export const getPreviousPuzzleDay = getPreviousBlackjackDay

/** Første dag puslespillet noensinne eksisterte -- ingenting å navigere til før dette. Satt én
 *  dag før faktisk lansering fordi "i dag" (getPuzzleDay) resettes kl. 18:00 norsk tid -- før
 *  det klokkeslettet på lanseringsdagen ville "i dag" regnes som dagen før, som da havnet
 *  utenfor gyldig intervall og ga en falsk "Invalid date"-feil. */
export const FIRST_PUZZLE_DATE = '2026-10-27'

export const PUZZLE_ATTEMPTS = 5

/** Loads tildelt basert på hvilket forsøk (0-indeksert) man gjetter riktig på. Holdes bevisst
 *  lite sammenlignet med Daily Blackjack, som skal forbli hovedkilden til loads. */
export const PUZZLE_POINTS = [25, 20, 15, 10, 5] as const

/** Hvor mye av bildet som vises på hvert forsøksnivå (0 = første visning, mest zoomet inn).
 *  Selve beskjæringen (object-position: top på en kvadratisk boks) skjuler alltid den nederste
 *  delen av bildet der spillnavn/leverandør står trykt -- scale() zoomer kun innenfor det
 *  området, så navnet kan aldri vises før spilleren faktisk har løst eller gått tom for forsøk. */
const ZOOM_SCALE = [2.6, 2.1, 1.7, 1.3, 1.0] as const

/** Blur (px) og gråtone (%) per nivå -- første visning skal være tydelig vanskelig (svart-hvitt,
 *  uskarp), og blir gradvis skarpere og mer fargerik for hvert bom. */
const BLUR_PX = [6, 4, 2.5, 1, 0] as const
const GRAYSCALE_PCT = [85, 65, 40, 20, 0] as const

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export interface ZoomTransform {
  scale: number
  originX: number
  originY: number
  filter: string
}

/** Deterministisk zoom-fokuspunkt per spill, slik at startposisjonen varierer fra spill til
 *  spill men er stabil for samme spill på tvers av sidelastinger. `seed` kan være hva som
 *  helst stabilt og unikt for spillet (id eller bilde-URL fungerer begge). */
export function getZoomTransform(level: number, seed: string): ZoomTransform {
  const h = hashString(seed)
  const originX = 30 + (h % 41) // 30-70%
  const originY = 15 + ((h >> 8) % 41) // 15-55%
  const clamped = Math.max(0, Math.min(level, ZOOM_SCALE.length - 1))
  return {
    scale: ZOOM_SCALE[clamped],
    originX,
    originY,
    filter: `blur(${BLUR_PX[clamped]}px) grayscale(${GRAYSCALE_PCT[clamped]}%)`,
  }
}

/** Velger dagens spill deterministisk, men unngår spill brukt de siste `avoidCount` dagene
 *  (gitt via recentGameIds) slik at puslespillet ikke gjentar seg for ofte. */
export function pickGameForDate(date: string, recentGameIds: string[]): WheelGame {
  const pool = WHEEL_GAMES.filter(g => !recentGameIds.includes(g.id))
  const candidates = pool.length > 0 ? pool : WHEEL_GAMES
  const idx = hashString(date) % candidates.length
  return candidates[idx]
}

export function findGameByName(name: string): WheelGame | undefined {
  const normalized = name.trim().toLowerCase()
  return WHEEL_GAMES.find(g => g.name.toLowerCase() === normalized)
}

export function isDateInRange(date: string, today: string): boolean {
  return date >= FIRST_PUZZLE_DATE && date <= today
}
