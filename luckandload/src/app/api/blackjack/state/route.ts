import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import { maskDealerCards, calculateHandValue, getBlackjackDay, getPreviousBlackjackDay } from '@/lib/blackjack'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.dbId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const today = getBlackjackDay()
  const userId = session.user.dbId

  const [{ data: bjSession }, { data: activeHand }, { data: user }] = await Promise.all([
    supabase.from('blackjack_sessions').select('*').eq('user_id', userId).eq('play_date', today).maybeSingle(),
    supabase.from('blackjack_hands').select('*').eq('user_id', userId).eq('play_date', today).eq('status', 'active').maybeSingle(),
    supabase.from('users').select('points').eq('id', userId).single(),
  ])

  // Før dagens første hånd er dealt finnes det ennå ingen sesjonsrad for i dag -- uten dette
  // falt streaken synlig tilbake til 0 i UI-et helt til man spilte (selv om streaken i realiteten
  // fortsatt stod ved lag fra i går). Faller derfor tilbake til gårsdagens streak-tall for
  // visning, siden dagens økt ennå ikke har "forlenget" den.
  let streakDays = bjSession?.streak_days ?? 0
  if (!bjSession) {
    const { data: ySession } = await supabase
      .from('blackjack_sessions').select('streak_days')
      .eq('user_id', userId).eq('play_date', getPreviousBlackjackDay(today)).maybeSingle()
    streakDays = ySession?.streak_days ?? 0
  }

  const handsPlayed = bjSession?.hands_played ?? 0

  let clientHand = null
  if (activeHand) {
    clientHand = {
      id: activeHand.id,
      handNumber: activeHand.hand_number,
      playerCards: activeHand.player_cards,
      dealerCards: maskDealerCards(activeHand.dealer_cards),
      playerValue: calculateHandValue(activeHand.player_cards),
      splitCards: activeHand.split_cards ?? null,
      splitValue: activeHand.split_cards ? calculateHandValue(activeHand.split_cards) : null,
      splitStatus: activeHand.split_status ?? null,
      playingSplit: activeHand.playing_split ?? false,
      split2Cards: activeHand.split2_cards ?? null,
      split2Value: activeHand.split2_cards ? calculateHandValue(activeHand.split2_cards) : null,
      split2Status: activeHand.split2_status ?? null,
      playingSplit2: activeHand.playing_split2 ?? false,
      doubled: activeHand.doubled,
    }
  }

  return NextResponse.json({
    handsPlayed,
    handsRemaining: 3 - handsPlayed,
    pointsEarnedToday: bjSession?.points_earned ?? 0,
    streakDays,
    totalPoints: user?.points ?? 0,
    activeHand: clientHand,
  })
}
