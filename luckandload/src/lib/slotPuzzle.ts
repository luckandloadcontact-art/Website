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

// VIKTIG: all uskarphet/beskjæring/gråtone MÅ skje server-side (se app/api/puzzle/image), ikke
// som CSS på klienten -- en CSS-transform lar brukeren fortsatt hente ut det originale, skarpe
// bildet via "Lagre bilde"/"Del"/"Vis tekst" (iOS Live Text leser rett av det underliggende
// bildet uansett hvordan det vises på skjermen). Disse tallene er derfor input til sharp(),
// ikke til CSS.

/** Hvor mye av bildet som vises på hvert forsøksnivå (0 = første visning, mest zoomet inn) --
 *  en reell piksel-beskjæring, ikke en visuell CSS-zoom. Beskjæringsboksen holder seg alltid
 *  innenfor de øverste ~70% av bildet der kunsten er, slik at spillnavn/leverandør trykt
 *  nederst aldri kan havne i det utsnittet som faktisk sendes til klienten. */
export const ZOOM_SCALE = [2.9, 2.25, 1.75, 1.3, 1.0] as const

/** Blur-sigma (piksler) og gråtone (%) per nivå. Landet midt mellom "for vanskelig"
 *  (3.2/9px/100%) og "for lett" (2.6/6px/85%) etter testing på luckandloadtv.com. */
export const BLUR_PX = [7.5, 4.75, 2.75, 1, 0] as const
export const GRAYSCALE_PCT = [92, 70, 42, 20, 0] as const

export const PUZZLE_SAFE_HEIGHT_FRACTION = 0.7
export const PUZZLE_OUTPUT_SIZE = 640

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export interface PuzzleCropConfig {
  scale: number
  blur: number
  grayscale: number
  originX: number
  originY: number
}

/** Deterministisk fokuspunkt + nivå-innstillinger per spill, brukt av sharp() til å regne ut
 *  det faktiske pikselutsnittet. `seed` kan være hva som helst stabilt og unikt for spillet. */
export function getPuzzleCropConfig(level: number, seed: string): PuzzleCropConfig {
  const h = hashString(seed)
  const originX = 30 + (h % 41) // 30-70%
  const originY = 15 + ((h >> 8) % 41) // 15-55%
  const clamped = Math.max(0, Math.min(level, ZOOM_SCALE.length - 1))
  return { scale: ZOOM_SCALE[clamped], blur: BLUR_PX[clamped], grayscale: GRAYSCALE_PCT[clamped], originX, originY }
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
