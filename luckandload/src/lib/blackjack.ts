export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
export type HandStatus = 'active' | 'player_won' | 'dealer_won' | 'push' | 'blackjack' | 'bust'

export interface Card {
  suit: Suit
  rank: Rank
  hidden?: boolean
}

const RANKS: Rank[] = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
const SUITS: Suit[] = ['spades','hearts','diamonds','clubs']

export const POINTS = {
  blackjack:     100,
  win:            50,
  push:           15,
  lose:            5,
  doubleLose:   -100,
  splitLose:     -50,
  allHandsBonus:  25,
} as const

export const DAILY_HANDS = 3

// Daglig blackjack nullstilles kl. 18:00 norsk tid for ALLE spillere -- samme tidspunkt
// uansett hvor de selv befinner seg, i stedet for midnatt UTC (serverens upubliserte
// standard-"i dag", som varierte 1-2 timer fra faktisk midnatt i Norge avhengig av
// sommer-/vintertid og ga en forvirrende/usynlig reset-logikk).
const BLACKJACK_RESET_HOUR_OSLO = 18

/** Tidssonens forskjell fra UTC (i ms) på et gitt tidspunkt -- bruker Intl i stedet for en egen
 *  offset-tabell, så dette håndterer sommer-/vintertid (CEST/CET) automatisk og korrekt. */
function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value ?? 0)
  const asUTC = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  return asUTC - date.getTime()
}

/** Dagens "blackjack-dag" (YYYY-MM-DD) -- nullstilles kl. 18:00 norsk tid. Før kl. 18:00
 *  lokalt i Norge regnes det fortsatt som gårsdagens blackjack-dag. */
export function getBlackjackDay(now = new Date()): string {
  const offsetMs = getTimeZoneOffsetMs(now, 'Europe/Oslo')
  const osloAsUTC = new Date(now.getTime() + offsetMs)
  const dayOffset = osloAsUTC.getUTCHours() < BLACKJACK_RESET_HOUR_OSLO ? -1 : 0
  const d = new Date(Date.UTC(osloAsUTC.getUTCFullYear(), osloAsUTC.getUTCMonth(), osloAsUTC.getUTCDate() + dayOffset))
  return d.toISOString().split('T')[0]
}

/** Blackjack-dagen rett før den gitte -- ren kalenderregning (ingen klokkeslett involvert),
 *  brukt til å slå opp gårsdagens sesjon når streaken skal avgjøres. */
export function getPreviousBlackjackDay(day: string): string {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().split('T')[0]
}

/** UTC-tidspunktet for neste kl. 18:00 norsk tid -- brukt av nedtellingen på blackjack-siden. */
export function nextBlackjackResetUTC(now = new Date()): Date {
  const offsetMs = getTimeZoneOffsetMs(now, 'Europe/Oslo')
  const osloAsUTC = new Date(now.getTime() + offsetMs)
  let resetAsUTC = Date.UTC(
    osloAsUTC.getUTCFullYear(),
    osloAsUTC.getUTCMonth(),
    osloAsUTC.getUTCDate(),
    BLACKJACK_RESET_HOUR_OSLO, 0, 0
  )
  if (resetAsUTC <= osloAsUTC.getTime()) resetAsUTC += 24 * 60 * 60 * 1000
  return new Date(resetAsUTC - offsetMs)
}

export const REDEMPTION_TIERS = [
  { name: 'Bronze', points: 2500,  emoji: '🥉', desc: 'First reward tier' },
  { name: 'Silver', points: 5000,  emoji: '🥈', desc: 'Mid-level reward' },
  { name: 'Gold',   points: 10000, emoji: '🥇', desc: 'Premium reward' },
] as const

export function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank })
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export function cardValue(card: Card): number {
  if (['J','Q','K'].includes(card.rank)) return 10
  if (card.rank === 'A') return 11
  return parseInt(card.rank)
}

export function calculateHandValue(cards: Card[]): number {
  const visible = cards.filter(c => !c.hidden)
  let value = visible.reduce((sum, c) => sum + cardValue(c), 0)
  let aces = visible.filter(c => c.rank === 'A').length
  while (value > 21 && aces > 0) { value -= 10; aces-- }
  return value
}

export function isBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && calculateHandValue(cards) === 21
}

export function suitSymbol(suit: Suit): string {
  return { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' }[suit]
}

export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds'
}

export function dealerPlay(
  dealerCards: Card[],
  deck: Card[]
): { dealerCards: Card[]; deck: Card[] } {
  let d: Card[] = dealerCards.map(c => ({ ...c, hidden: false }))
  let remaining = [...deck]
  while (calculateHandValue(d) < 17 && remaining.length > 0) {
    d = [...d, remaining[remaining.length - 1]]
    remaining = remaining.slice(0, -1)
  }
  return { dealerCards: d, deck: remaining }
}

export function resolveHand(
  playerCards: Card[],
  dealerCards: Card[],
  doubled: boolean,
  isSplit = false,
): { status: HandStatus; pointsAwarded: number } {
  const pv = calculateHandValue(playerCards)
  const dv = calculateHandValue(dealerCards)

  let status: HandStatus
  if (pv > 21)                  status = 'bust'
  else if (dv > 21 || pv > dv)  status = 'player_won'
  else if (pv < dv)             status = 'dealer_won'
  else                          status = 'push'

  let pointsAwarded: number
  if (status === 'player_won')  pointsAwarded = doubled ? POINTS.win * 2 : POINTS.win
  else if (status === 'push')   pointsAwarded = POINTS.push
  else if (doubled)             pointsAwarded = POINTS.doubleLose
  else if (isSplit)             pointsAwarded = POINTS.splitLose
  else                          pointsAwarded = POINTS.lose

  return { status, pointsAwarded }
}

export function maskDealerCards(cards: Card[]): Card[] {
  return cards.map((c, i) => (i === 1 ? { ...c, hidden: true } : c))
}

export function canSplit(cards: Card[]): boolean {
  return cards.length === 2 && cardValue(cards[0]) === cardValue(cards[1])
}
