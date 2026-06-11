import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import {
  calculateHandValue, dealerPlay, resolveHand,
  maskDealerCards, POINTS, DAILY_HANDS, Card,
} from '@/lib/blackjack'

type Action = 'hit' | 'stand' | 'double'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.dbId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = (await req.json()) as { action: Action }
  if (!['hit', 'stand', 'double'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const today = new Date().toISOString().split('T')[0]
  const userId = session.user.dbId

  const { data: hand } = await supabase
    .from('blackjack_hands').select('*')
    .eq('user_id', userId).eq('play_date', today).eq('status', 'active').maybeSingle()

  if (!hand) return NextResponse.json({ error: 'No active hand' }, { status: 400 })

  let playerCards: Card[] = hand.player_cards
  let dealerCards: Card[] = hand.dealer_cards
  let deck: Card[] = hand.deck_state
  let doubled = hand.doubled

  if (action === 'double' && hand.hand_number > 1) {
    // only allowed on first two cards
  }

  if (action === 'hit' || action === 'double') {
    const newCard = deck[deck.length - 1]
    deck = deck.slice(0, -1)
    playerCards = [...playerCards, newCard]
    if (action === 'double') doubled = true
  }

  const playerValue = calculateHandValue(playerCards)
  const isBust = playerValue > 21

  let finalStatus = hand.status
  let finalDealerCards = dealerCards
  let finalDeck = deck
  let pointsAwarded = 0

  if (isBust) {
    finalStatus = 'bust'
    pointsAwarded = POINTS.lose
    finalDealerCards = dealerCards.map(c => ({ ...c, hidden: false }))
  } else if (action === 'stand' || action === 'double') {
    const played = dealerPlay(dealerCards, deck)
    finalDealerCards = played.dealerCards
    finalDeck = played.deck
    const resolved = resolveHand(playerCards, finalDealerCards, doubled)
    finalStatus = resolved.status
    pointsAwarded = resolved.pointsAwarded
  }

  const isComplete = finalStatus !== 'active'

  // Update hand in DB
  await supabase.from('blackjack_hands').update({
    player_cards: playerCards,
    dealer_cards: isComplete ? finalDealerCards : dealerCards,
    deck_state: finalDeck,
    status: finalStatus,
    points_awarded: isComplete ? pointsAwarded : 0,
    doubled,
  }).eq('id', hand.id)

  // Update session + award points if complete
  let streakBonus = 0
  let allHandsBonus = 0
  let totalAwarded = pointsAwarded

  if (isComplete) {
    const { data: bjSession } = await supabase
      .from('blackjack_sessions').select('*')
      .eq('user_id', userId).eq('play_date', today).maybeSingle()

    const handsPlayed = (bjSession?.hands_played ?? 0) + 1
    const isLastHand = handsPlayed >= DAILY_HANDS
    allHandsBonus = isLastHand ? POINTS.allHandsBonus : 0
    totalAwarded = pointsAwarded + allHandsBonus

    if (!bjSession) {
      // first hand of day also needs streak
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const { data: ySession } = await supabase
        .from('blackjack_sessions').select('streak_days')
        .eq('user_id', userId).eq('play_date', yesterday.toISOString().split('T')[0]).maybeSingle()
      const streakDays = ySession ? ySession.streak_days + 1 : 1
      if (streakDays >= 14) streakBonus = 150
      else if (streakDays >= 7) streakBonus = 50
      totalAwarded += streakBonus

      await supabase.from('blackjack_sessions').insert({
        user_id: userId, play_date: today, streak_days: streakDays,
        hands_played: 1, points_earned: totalAwarded,
      })
    } else {
      await supabase.from('blackjack_sessions').update({
        hands_played: handsPlayed,
        points_earned: bjSession.points_earned + totalAwarded,
      }).eq('user_id', userId).eq('play_date', today)
    }

    // Award points to user
    if (totalAwarded > 0) {
      const { data: user } = await supabase.from('users').select('points').eq('id', userId).single()
      const reasonParts = [`Daily Blackjack (${finalStatus})`]
      if (streakBonus) reasonParts.push('🔥 streak bonus')
      if (allHandsBonus) reasonParts.push('all hands bonus')
      await Promise.all([
        supabase.from('users').update({ points: (user?.points ?? 0) + totalAwarded }).eq('id', userId),
        supabase.from('point_transactions').insert({
          user_id: userId, delta: totalAwarded, reason: reasonParts.join(' + '),
        }),
      ])
    }
  }

  return NextResponse.json({
    playerCards,
    dealerCards: isComplete ? finalDealerCards : maskDealerCards(dealerCards),
    playerValue: calculateHandValue(playerCards),
    dealerValue: isComplete ? calculateHandValue(finalDealerCards) : calculateHandValue([dealerCards[0]]),
    status: finalStatus,
    pointsAwarded: isComplete ? totalAwarded : 0,
    streakBonus,
    allHandsBonus,
    doubled,
  })
}
