'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { Card, POINTS, REDEMPTION_TIERS, suitSymbol, isRedSuit, calculateHandValue } from '@/lib/blackjack'

interface GameState {
  handsPlayed: number
  handsRemaining: number
  pointsEarnedToday: number
  streakDays: number
  totalPoints: number
  activeHand: ActiveHand | null
}

interface ActiveHand {
  id: string
  handNumber: number
  playerCards: Card[]
  dealerCards: Card[]
  doubled: boolean
}

interface HandResult {
  playerCards: Card[]
  dealerCards: Card[]
  playerValue: number
  dealerValue: number
  status: string
  pointsAwarded: number
  streakBonus: number
  allHandsBonus: number
  doubled: boolean
}

function PlayingCard({ card }: { card: Card }) {
  if (card.hidden) {
    return (
      <div className="w-16 h-24 rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 border-2 border-brand-400 flex items-center justify-center shadow-lg">
        <span className="text-3xl">🂠</span>
      </div>
    )
  }
  const red = isRedSuit(card.suit)
  return (
    <div className="w-16 h-24 rounded-lg bg-white border-2 border-gray-200 flex flex-col items-center justify-center shadow-lg relative">
      <span className={`text-lg font-bold leading-none ${red ? 'text-red-600' : 'text-gray-900'}`}>
        {card.rank}
      </span>
      <span className={`text-2xl leading-none ${red ? 'text-red-600' : 'text-gray-900'}`}>
        {suitSymbol(card.suit)}
      </span>
    </div>
  )
}

function statusLabel(status: string): { text: string; color: string } {
  switch (status) {
    case 'blackjack':  return { text: '🃏 Blackjack! +' + POINTS.blackjack + ' pts', color: 'text-yellow-400' }
    case 'player_won': return { text: '🏆 You win! +50 pts', color: 'text-green-400' }
    case 'push':       return { text: '🤝 Push +' + POINTS.push + ' pts', color: 'text-brand-400' }
    case 'bust':       return { text: '💥 Bust +' + POINTS.lose + ' pts', color: 'text-red-400' }
    case 'dealer_won': return { text: '😤 Dealer wins +' + POINTS.lose + ' pts', color: 'text-red-400' }
    default:           return { text: '', color: '' }
  }
}

function ResultLabel({ result }: { result: HandResult }) {
  const { text, color } = statusLabel(result.status)
  return (
    <div className="text-center py-2 space-y-1">
      <div className={`text-2xl font-bold ${color}`}>{text}</div>
      {result.doubled && <div className="text-sm text-yellow-300">Double down: pts ×2</div>}
      {result.streakBonus > 0 && <div className="text-sm text-orange-300">🔥 Streak bonus: +{result.streakBonus} pts</div>}
      {result.allHandsBonus > 0 && <div className="text-sm text-brand-300">✅ All hands bonus: +{result.allHandsBonus} pts</div>}
    </div>
  )
}

export default function BlackjackPage() {
  const { data: session, status } = useSession()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [dealing, setDealing] = useState(false)
  const [acting, setActing] = useState(false)
  const [result, setResult] = useState<HandResult | null>(null)
  const [localHand, setLocalHand] = useState<{
    playerCards: Card[]; dealerCards: Card[]; playerValue: number; handNumber: number; doubled: boolean
  } | null>(null)

  const fetchState = useCallback(async () => {
    const res = await fetch('/api/blackjack/state')
    if (res.ok) setGameState(await res.json())
  }, [])

  useEffect(() => { if (status === 'authenticated') fetchState() }, [status, fetchState])

  async function dealHand() {
    setDealing(true)
    setResult(null)
    const res = await fetch('/api/blackjack/deal', { method: 'POST' })
    const data = await res.json()
    setDealing(false)
    if (!res.ok) { alert(data.error); return }

    if (data.status !== 'active') {
      setResult(data)
      await fetchState()
    } else {
      setLocalHand({
        playerCards: data.playerCards,
        dealerCards: data.dealerCards,
        playerValue: data.playerValue,
        handNumber: data.handNumber,
        doubled: false,
      })
      await fetchState()
    }
  }

  async function sendAction(action: 'hit' | 'stand' | 'double') {
    setActing(true)
    const res = await fetch('/api/blackjack/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const data = await res.json()
    setActing(false)
    if (!res.ok) { alert(data.error); return }

    if (data.status !== 'active') {
      setLocalHand(null)
      setResult(data)
      await fetchState()
    } else {
      setLocalHand(prev => prev ? {
        ...prev,
        playerCards: data.playerCards,
        playerValue: data.playerValue,
        dealerCards: data.dealerCards,
        doubled: data.doubled,
      } : null)
    }
  }

  if (status === 'loading') return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-surface-300 text-lg">Loading...</div>
    </main>
  )

  if (status === 'unauthenticated') return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Daily Blackjack</h1>
        <p className="text-surface-300">Sign in with Discord to play</p>
        <button onClick={() => signIn('discord')} className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors">Sign in with Discord</button>
      </div>
    </main>
  )

  const gs = gameState
  const isActive = !!localHand || !!gs?.activeHand
  const activeCards = localHand ?? (gs?.activeHand ? {
    playerCards: gs.activeHand.playerCards,
    dealerCards: gs.activeHand.dealerCards,
    playerValue: calculateHandValue(gs.activeHand.playerCards),
    handNumber: gs.activeHand.handNumber,
    doubled: gs.activeHand.doubled,
  } : null)

  const nextTier = REDEMPTION_TIERS.find(t => (gs?.totalPoints ?? 0) < t.points)
  const currentTierPoints = gs?.totalPoints ?? 0
  const progressPct = nextTier
    ? Math.min(100, (currentTierPoints / nextTier.points) * 100)
    : 100

  return (
    <main className="min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">🃏 Daily Blackjack</h1>
          <p className="text-surface-300">3 free hands per day · Earn points · Climb the tiers</p>
        </div>

        {/* Stats row */}
        {gs && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-brand-400">{gs.handsRemaining}</div>
              <div className="text-xs text-surface-300 mt-1">Hands left today</div>
            </div>
            <div className="bg-surface-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{gs.totalPoints.toLocaleString()}</div>
              <div className="text-xs text-surface-300 mt-1">Total points</div>
            </div>
            <div className="bg-surface-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">🔥 {gs.streakDays}</div>
              <div className="text-xs text-surface-300 mt-1">Day streak</div>
            </div>
          </div>
        )}

        {/* Progress to next tier */}
        {gs && nextTier && (
          <div className="bg-surface-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-surface-300">Progress to {nextTier.emoji} {nextTier.name}</span>
              <span className="text-white font-medium">{currentTierPoints.toLocaleString()} / {nextTier.points.toLocaleString()} pts</span>
            </div>
            <div className="w-full h-2 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
        {gs && !nextTier && (
          <div className="bg-gradient-to-r from-yellow-900/40 to-yellow-700/20 border border-yellow-500/30 rounded-xl p-4 text-center">
            <span className="text-yellow-400 font-bold">🥇 Gold tier reached! All tiers unlocked.</span>
          </div>
        )}

        {/* Game area */}
        <div className="bg-surface-800 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 min-h-[340px] flex flex-col justify-between">

            {/* Dealer */}
            <div className="space-y-2">
              <p className="text-green-200 text-sm font-medium uppercase tracking-widest">Dealer</p>
              {activeCards ? (
                <div className="flex gap-2">
                  {activeCards.dealerCards.map((card, i) => <PlayingCard key={i} card={card} />)}
                </div>
              ) : result ? (
                <div className="flex gap-2">
                  {result.dealerCards.map((card, i) => <PlayingCard key={i} card={card} />)}
                </div>
              ) : (
                <div className="h-24 flex items-center">
                  <span className="text-green-400 text-sm">Waiting for next hand...</span>
                </div>
              )}
            </div>

            {/* Result label */}
            {result && <ResultLabel result={result} />}

            {/* Player */}
            <div className="space-y-2">
              {activeCards ? (
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-green-200 text-sm font-medium uppercase tracking-widest">
                      You — Hand {activeCards.handNumber}/3
                    </p>
                    <div className="flex gap-2">
                      {activeCards.playerCards.map((card, i) => <PlayingCard key={i} card={card} />)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{activeCards.playerValue}</div>
                    {activeCards.doubled && <div className="text-xs text-yellow-300">doubled</div>}
                  </div>
                </div>
              ) : result ? (
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-green-200 text-sm font-medium uppercase tracking-widest">You</p>
                    <div className="flex gap-2">
                      {result.playerCards.map((card, i) => <PlayingCard key={i} card={card} />)}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white">{result.playerValue}</div>
                </div>
              ) : (
                <div>
                  <p className="text-green-200 text-sm font-medium uppercase tracking-widest">You</p>
                  <div className="h-24 flex items-center">
                    <span className="text-green-400 text-sm">Deal to start</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-4 bg-surface-900">
            {!isActive ? (
              <button
                onClick={dealHand}
                disabled={dealing || (gs?.handsRemaining === 0)}
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20"
              >
                {dealing ? 'Dealing...' : gs?.handsRemaining === 0 ? 'Come back tomorrow!' : 'Deal Hand'}
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => sendAction('hit')}
                  disabled={acting}
                  className="py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all disabled:opacity-40"
                >Hit</button>
                <button
                  onClick={() => sendAction('stand')}
                  disabled={acting}
                  className="py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all disabled:opacity-40"
                >Stand</button>
                <button
                  onClick={() => sendAction('double')}
                  disabled={acting || (activeCards?.playerCards.length ?? 0) > 2}
                  className="py-3 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  title={(activeCards?.playerCards.length ?? 0) > 2 ? 'Double only on first 2 cards' : ''}
                >Double</button>
              </div>
            )}
          </div>
        </div>

        {/* Points guide */}
        <div className="bg-surface-800 rounded-xl p-5 space-y-3">
          <h3 className="text-white font-bold">Points per hand</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between text-yellow-400"><span>🃏 Blackjack</span><span>+{POINTS.blackjack} pts</span></div>
            <div className="flex justify-between text-green-400"><span>🏆 Win</span><span>+{POINTS.win} pts</span></div>
            <div className="flex justify-between text-brand-400"><span>🤝 Push</span><span>+{POINTS.push} pts</span></div>
            <div className="flex justify-between text-surface-300"><span>💥 Bust/Lose</span><span>+{POINTS.lose} pts</span></div>
            <div className="flex justify-between text-orange-400"><span>🔥 7-day streak</span><span>+50 pts/day</span></div>
            <div className="flex justify-between text-orange-400"><span>🔥 14-day streak</span><span>+150 pts/day</span></div>
            <div className="flex justify-between text-brand-400 col-span-2"><span>✅ Complete all 3 hands</span><span>+{POINTS.allHandsBonus} pts</span></div>
          </div>
          <div className="border-t border-surface-700 pt-3 space-y-1">
            <p className="text-surface-400 text-xs font-medium uppercase tracking-widest">Redemption tiers</p>
            {REDEMPTION_TIERS.map(t => (
              <div key={t.name} className="flex justify-between text-sm">
                <span className="text-white">{t.emoji} {t.name}</span>
                <span className="text-surface-300">{t.points.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
