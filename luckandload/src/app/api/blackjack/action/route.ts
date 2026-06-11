import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import {
  calculateHandValue, dealerPlay, resolveHand,
  maskDealerCards, canSplit, POINTS, DAILY_HANDS,
} from '@/lib/blackjack'
import type { Card } from '@/lib/blackjack'

type Action = 'hit' | 'stand' | 'double' | 'split'

async function awardPoints(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  today: string,
  points: number,
  reason: string,
) {
  if (points === 0) return
  const { data: user } = await supabase.from('users').select('points').eq('id', userId).single()
  const newTotal = Math.max(0, (user?.points ?? 0) + points)
  await Promise.all([
    supabase.from('users').update({ points: newTotal }).eq('id', userId),
    supabase.from('point_transactions').insert({ user_id: userId, delta: points, reason }),
  ])
}

async function updateSession(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  today: string,
  pointsEarned: number,
) {
  const { data: bjSession } = await supabase
    .from('blackjack_sessions').select('*').eq('user_id', userId).eq('play_date', today).maybeSingle()

  let streakBonus = 0
  const handsPlayed = (bjSession?.hands_played ?? 0) + 1
  const allHandsBonus = handsPlayed >= DAILY_HANDS ? POINTS.allHandsBonus : 0

  if (!bjSession) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const { data: ySession } = await supabase
      .from('blackjack_sessions').select('streak_days')
      .eq('user_id', userId).eq('play_date', yesterday.toISOString().split('T')[0]).maybeSingle()
    const streakDays = ySession ? ySession.streak_days + 1 : 1
    if (streakDays >= 14) streakBonus = 150
    else if (streakDays >= 7) streakBonus = 50
    await supabase.from('blackjack_sessions').insert({
      user_id: userId, play_date: today, streak_days: streakDays,
      hands_played: handsPlayed, points_earned: pointsEarned + streakBonus + allHandsBonus,
    })
  } else {
    await supabase.from('blackjack_sessions').update({
      hands_played: handsPlayed,
      points_earned: bjSession.points_earned + pointsEarned + streakBonus + allHandsBonus,
    }).eq('user_id', userId).eq('play_date', today)
  }

  return { streakBonus, allHandsBonus }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.dbId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = (await req.json()) as { action: Action }
  if (!['hit', 'stand', 'double', 'split'].includes(action)) {
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
  let splitCards: Card[] | null = hand.split_cards ?? null
  let deck: Card[] = hand.deck_state
  const dealerCards: Card[] = hand.dealer_cards
  let doubled = hand.doubled as boolean
  const splitStatus: string | null = hand.split_status ?? null
  const playingSplit = hand.playing_split as boolean

  // ── SPLIT ──────────────────────────────────────────────────
  if (action === 'split') {
    if (!canSplit(playerCards) || splitCards) {
      return NextResponse.json({ error: 'Cannot split this hand' }, { status: 400 })
    }
    const newCard1 = deck[deck.length - 1]
    const newCard2 = deck[deck.length - 2]
    deck = deck.slice(0, -2)
    const newPlayer: Card[] = [playerCards[0], newCard1]
    const newSplit: Card[] = [playerCards[1], newCard2]

    await supabase.from('blackjack_hands').update({
      player_cards: newPlayer, split_cards: newSplit,
      split_status: 'active', deck_state: deck, playing_split: false,
    }).eq('id', hand.id)

    return NextResponse.json({
      playerCards: newPlayer, splitCards: newSplit,
      dealerCards: maskDealerCards(dealerCards),
      playerValue: calculateHandValue(newPlayer),
      splitValue: calculateHandValue(newSplit),
      status: 'active', splitStatus: 'active', playingSplit: false,
    })
  }

  // ── ACTING ON SPLIT HAND ───────────────────────────────────
  if (playingSplit) {
    let sc = splitCards!

    if (action === 'hit' || action === 'double') {
      sc = [...sc, deck[deck.length - 1]]
      deck = deck.slice(0, -1)
    }

    const splitValue = calculateHandValue(sc)
    const splitBust = splitValue > 21
    const splitDone = splitBust || action === 'stand' || action === 'double' || splitValue === 21

    if (!splitDone) {
      await supabase.from('blackjack_hands').update({ split_cards: sc, deck_state: deck }).eq('id', hand.id)
      return NextResponse.json({
        playerCards, splitCards: sc, dealerCards: maskDealerCards(dealerCards),
        playerValue: calculateHandValue(playerCards), splitValue,
        status: 'active', splitStatus: 'active', playingSplit: true,
      })
    }

    // Both hands done — dealer plays
    const { dealerCards: finalDealer } = dealerPlay(dealerCards, deck)
    const h1 = resolveHand(playerCards, finalDealer, doubled)
    const h2 = resolveHand(sc, finalDealer, false)
    const finalSplitStatus = splitBust ? 'bust' : h2.status
    const combined = h1.pointsAwarded + h2.pointsAwarded

    const { streakBonus, allHandsBonus } = await updateSession(supabase, userId, today, combined)
    const total = combined + streakBonus + allHandsBonus

    await supabase.from('blackjack_hands').update({
      split_cards: sc, deck_state: deck,
      status: h1.status, split_status: finalSplitStatus, points_awarded: total,
    }).eq('id', hand.id)

    await awardPoints(supabase, userId, today, total,
      `Daily Blackjack (hand: ${h1.status}, split: ${finalSplitStatus})`)

    return NextResponse.json({
      playerCards, splitCards: sc, dealerCards: finalDealer,
      playerValue: calculateHandValue(playerCards),
      splitValue: calculateHandValue(sc),
      dealerValue: calculateHandValue(finalDealer),
      status: h1.status, splitStatus: finalSplitStatus,
      pointsAwarded: total, streakBonus, allHandsBonus,
    })
  }

  // ── ACTING ON HAND 1 ───────────────────────────────────────
  if (action === 'hit' || action === 'double') {
    playerCards = [...playerCards, deck[deck.length - 1]]
    deck = deck.slice(0, -1)
    if (action === 'double') doubled = true
  }

  const playerValue = calculateHandValue(playerCards)
  const isBust = playerValue > 21
  const hand1Done = isBust || action === 'stand' || action === 'double' || playerValue === 21

  if (!hand1Done) {
    await supabase.from('blackjack_hands').update({ player_cards: playerCards, deck_state: deck, doubled }).eq('id', hand.id)
    return NextResponse.json({
      playerCards, dealerCards: maskDealerCards(dealerCards),
      playerValue, status: 'active', doubled,
    })
  }

  // Hand 1 done — switch to split if active
  if (splitCards && splitStatus === 'active') {
    await supabase.from('blackjack_hands').update({
      player_cards: playerCards, deck_state: deck, doubled, playing_split: true,
    }).eq('id', hand.id)
    return NextResponse.json({
      playerCards, splitCards, dealerCards: maskDealerCards(dealerCards),
      playerValue, splitValue: calculateHandValue(splitCards),
      status: 'active', splitStatus: 'active', playingSplit: true,
      hand1Bust: isBust,
    })
  }

  // No split — dealer plays
  const { dealerCards: finalDealer } = dealerPlay(dealerCards, deck)
  const resolved = resolveHand(playerCards, finalDealer, doubled)
  const finalStatus = isBust ? 'bust' : resolved.status

  const { streakBonus, allHandsBonus } = await updateSession(supabase, userId, today, resolved.pointsAwarded)
  const total = resolved.pointsAwarded + streakBonus + allHandsBonus

  await supabase.from('blackjack_hands').update({
    player_cards: playerCards, deck_state: deck, doubled,
    status: finalStatus, points_awarded: total,
  }).eq('id', hand.id)

  await awardPoints(supabase, userId, today, total, `Daily Blackjack (${finalStatus})`)

  return NextResponse.json({
    playerCards, dealerCards: finalDealer,
    playerValue, dealerValue: calculateHandValue(finalDealer),
    status: finalStatus, pointsAwarded: total,
    streakBonus, allHandsBonus, doubled,
  })
}
