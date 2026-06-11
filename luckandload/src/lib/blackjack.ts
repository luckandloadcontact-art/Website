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
  allHandsBonus:  25,
} as const

export const DAILY_HANDS = 3

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
  doubled: boolean
): { status: HandStatus; pointsAwarded: number } {
  const pv = calculateHandValue(playerCards)
  const dv = calculateHandValue(dealerCards)

  let status: HandStatus
  if (pv > 21)           status = 'bust'
  else if (dv > 21 || pv > dv) status = 'player_won'
  else if (pv < dv)      status = 'dealer_won'
  else                   status = 'push'

  const mult = doubled ? 2 : 1
  const pointsAwarded =
    status === 'player_won' ? POINTS.win * mult :
    status === 'push'       ? POINTS.push * mult :
    POINTS.lose

  return { status, pointsAwarded }
}

export function maskDealerCards(cards: Card[]): Card[] {
  return cards.map((c, i) => (i === 1 ? { ...c, hidden: true } : c))
}

export function canSplit(cards: Card[]): boolean {
  return cards.length === 2 && cards[0].rank === cards[1].rank
}
