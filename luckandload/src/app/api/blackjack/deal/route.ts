import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import {
  createDeck, isBlackjack, calculateHandValue, maskDealerCards,
  POINTS, DAILY_HANDS,
} from '@/lib/blackjack'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.dbId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const today = new Date().toISOString().split('T')[0]
  const userId = session.user.dbId

  // Check today's session
  const { data: bjSession } = await supabase
    .from('blackjack_sessions').select('*')
    .eq('user_id', userId).eq('play_date', today).maybeSingle()

  const handsPlayed = bjSession?.hands_played ?? 0
  if (handsPlayed >= DAILY_HANDS) {
    return NextResponse.json({ error: 'No hands remaining today' }, { status: 400 })
  }

  // Block if active hand exists
  const { data: activeHand } = await supabase
    .from('blackjack_hands').select('id')
    .eq('user_id', userId).eq('play_date', today).eq('status', 'active').maybeSingle()
  if (activeHand) return NextResponse.json({ error: 'Finish your current hand first' }, { status: 400 })

  // Calculate streak (only on first hand of the day)
  let streakDays = bjSession?.streak_days ?? 1
  let streakBonus = 0
  if (!bjSession) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const { data: ySession } = await supabase
      .from('blackjack_sessions').select('streak_days')
      .eq('user_id', userId).eq('play_date', yesterday.toISOString().split('T')[0]).maybeSingle()
    streakDays = ySession ? ySession.streak_days + 1 : 1
    if (streakDays >= 14) streakBonus = 150
    else if (streakDays >= 7) streakBonus = 50
  }

  // Deal cards
  const deck = createDeck()
  const playerCards = [deck[deck.length - 1], deck[deck.length - 2]]
  const dealerCards  = [deck[deck.length - 3], deck[deck.length - 4]]
  const remainingDeck = deck.slice(0, -4)
  const handNumber = handsPlayed + 1

  // Immediate blackjack check
  const playerBJ = isBlackjack(playerCards)
  const dealerBJ  = isBlackjack(dealerCards)
  let status = 'active'
  let pointsAwarded = 0

  if (playerBJ && dealerBJ) { status = 'push';       pointsAwarded = POINTS.push }
  else if (playerBJ)         { status = 'blackjack';  pointsAwarded = POINTS.blackjack }
  else if (dealerBJ)         { status = 'dealer_won'; pointsAwarded = POINTS.lose }

  const isComplete = status !== 'active'
  const isLastHand = isComplete && handNumber === DAILY_HANDS
  const allHandsBonus = isLastHand ? POINTS.allHandsBonus : 0
  const totalAwarded = pointsAwarded + streakBonus + allHandsBonus

  // Save hand
  const { data: hand } = await supabase.from('blackjack_hands').insert({
    user_id: userId, play_date: today, hand_number: handNumber,
    deck_state: remainingDeck, player_cards: playerCards, dealer_cards: dealerCards,
    status, points_awarded: totalAwarded,
  }).select().single()

  // Upsert session
  if (!bjSession) {
    await supabase.from('blackjack_sessions').insert({
      user_id: userId, play_date: today, streak_days: streakDays,
      hands_played: isComplete ? 1 : 0,
      points_earned: isComplete ? totalAwarded : 0,
    })
  } else if (isComplete) {
    await supabase.from('blackjack_sessions').update({
      hands_played: handsPlayed + 1,
      points_earned: bjSession.points_earned + totalAwarded,
    }).eq('user_id', userId).eq('play_date', today)
  }

  // Award points
  if (isComplete && totalAwarded > 0) {
    const { data: user } = await supabase.from('users').select('points').eq('id', userId).single()
    await Promise.all([
      supabase.from('users').update({ points: (user?.points ?? 0) + totalAwarded }).eq('id', userId),
      supabase.from('point_transactions').insert({
        user_id: userId, delta: totalAwarded,
        reason: `Daily Blackjack hand ${handNumber}${streakBonus ? ` (🔥 streak bonus)` : ''}${allHandsBonus ? ` (all hands bonus)` : ''}`,
      }),
    ])
  }

  return NextResponse.json({
    handId: hand?.id,
    handNumber,
    playerCards,
    dealerCards: isComplete ? dealerCards.map(c => ({ ...c, hidden: false })) : maskDealerCards(dealerCards),
    playerValue: calculateHandValue(playerCards),
    dealerVisibleValue: calculateHandValue([dealerCards[0]]),
    status,
    pointsAwarded: totalAwarded,
    streakBonus,
    streakDays,
    allHandsBonus,
  })
}
