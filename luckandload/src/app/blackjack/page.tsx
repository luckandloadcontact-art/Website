'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { canSplit, POINTS, REDEMPTION_TIERS, suitSymbol, isRedSuit, calculateHandValue } from '@/lib/blackjack'
import type { Card } from '@/lib/blackjack'

// ── Sound ─────────────────────────────────────────────────────────────────
function mkSound(type: 'deal' | 'win' | 'lose' | 'push') {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const g = ctx.createGain()
    g.connect(ctx.destination)
    if (type === 'deal') {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.018))
      const src = ctx.createBufferSource(); src.buffer = buf
      const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2000
      src.connect(f); f.connect(g); g.gain.value = 0.25; src.start()
    } else {
      const osc = ctx.createOscillator()
      osc.connect(g)
      if (type === 'win') {
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        osc.frequency.setValueAtTime(550, ctx.currentTime + 0.1)
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.2)
        g.gain.setValueAtTime(0.15, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45)
        osc.start(); osc.stop(ctx.currentTime + 0.45)
      } else if (type === 'lose') {
        osc.frequency.setValueAtTime(350, ctx.currentTime)
        osc.frequency.setValueAtTime(280, ctx.currentTime + 0.15)
        g.gain.setValueAtTime(0.12, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
        osc.start(); osc.stop(ctx.currentTime + 0.35)
      } else {
        osc.frequency.value = 400
        g.gain.setValueAtTime(0.1, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
        osc.start(); osc.stop(ctx.currentTime + 0.2)
      }
    }
  } catch { /* ignore */ }
}

// ── Card component ────────────────────────────────────────────────────────
function PlayingCard({ card, animClass = 'animate-deal' }: { card: Card; animClass?: string }) {
  if (card.hidden) {
    return (
      <div className={`w-14 h-20 rounded-lg flex items-center justify-center shadow-xl select-none ${animClass}`}
        style={{ background: 'repeating-linear-gradient(45deg,#0d6e6e,#0d6e6e 4px,#0a5555 4px,#0a5555 8px)', border: '2px solid rgba(20,184,184,0.5)' }}>
        <span className="text-2xl opacity-60">🂠</span>
      </div>
    )
  }
  const red = isRedSuit(card.suit)
  const color = red ? 'text-red-500' : 'text-gray-900'
  return (
    <div className={`w-14 h-20 rounded-lg bg-white shadow-xl flex flex-col justify-between p-1 select-none ${animClass}`}
      style={{ border: '1.5px solid #ddd' }}>
      <div className={`text-xs font-black leading-none ${color}`}>{card.rank}<br />{suitSymbol(card.suit)}</div>
      <div className={`text-2xl text-center leading-none ${color}`}>{suitSymbol(card.suit)}</div>
      <div className={`text-xs font-black leading-none self-end rotate-180 ${color}`}>{card.rank}<br />{suitSymbol(card.suit)}</div>
    </div>
  )
}

// ── Hand display ──────────────────────────────────────────────────────────
function HandArea({
  cards, value, label, active, done, doneLabel, doneColor, isDealer
}: {
  cards: Card[]; value: number; label: string
  active?: boolean; done?: boolean; doneLabel?: string; doneColor?: string; isDealer?: boolean
}) {
  return (
    <div className={`relative rounded-xl p-3 transition-all duration-300 ${active ? 'ring-2 ring-brand-400 ring-offset-2 ring-offset-green-900' : ''}`}>
      <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-2">{label}</p>
      <div className="flex gap-2 min-h-[80px] items-center">
        {cards.length === 0 && <span className="text-green-600 text-xs italic">Waiting…</span>}
        {cards.map((card, i) => (
          <PlayingCard
            key={`${card.rank}-${card.suit}-${card.hidden ? 'h' : 'v'}-${i}`}
            card={card}
            animClass={isDealer && i === 1 && !card.hidden ? 'animate-flip' : 'animate-deal'}
          />
        ))}
        {!isDealer && cards.length > 0 && (
          <div className="ml-auto text-3xl font-black text-white self-end pb-1">{value}</div>
        )}
      </div>
      {done && doneLabel && (
        <div className={`absolute inset-0 rounded-xl flex items-center justify-center bg-black/50 backdrop-blur-sm`}>
          <span className={`text-lg font-black ${doneColor}`}>{doneLabel}</span>
        </div>
      )}
    </div>
  )
}

// ── Status helpers ────────────────────────────────────────────────────────
function resultLabel(status: string) {
  switch (status) {
    case 'blackjack':  return { text: '🃏 Blackjack!', color: 'text-yellow-300' }
    case 'player_won': return { text: '🏆 You win!',   color: 'text-green-300'  }
    case 'push':       return { text: '🤝 Push',       color: 'text-brand-300'  }
    case 'bust':       return { text: '💥 Bust',       color: 'text-red-400'    }
    case 'dealer_won': return { text: '😤 Dealer wins',color: 'text-red-400'    }
    default:           return { text: '',              color: ''                }
  }
}

function pts(n: number) { return `+${n} pts` }

// ── Types ─────────────────────────────────────────────────────────────────
interface GameState {
  handsPlayed: number; handsRemaining: number; pointsEarnedToday: number
  streakDays: number; totalPoints: number
  activeHand: { id: string; handNumber: number; playerCards: Card[]; dealerCards: Card[]
    playerValue: number; splitCards: Card[] | null; splitValue: number | null
    splitStatus: string | null; playingSplit: boolean; doubled: boolean } | null
}

interface Display { player: Card[]; dealer: Card[]; split: Card[] }

interface LiveHand {
  playerCards: Card[]; dealerCards: Card[]; splitCards: Card[] | null
  playerValue: number; splitValue: number; dealerValue: number
  status: string; splitStatus: string | null; playingSplit: boolean
  doubled: boolean; hand1Bust?: boolean
}

interface Result {
  playerCards: Card[]; splitCards?: Card[] | null; dealerCards: Card[]
  playerValue: number; splitValue?: number; dealerValue: number
  status: string; splitStatus?: string | null
  pointsAwarded: number; streakBonus: number; allHandsBonus: number
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function BlackjackPage() {
  const { data: session, status } = useSession()
  const [gs, setGs] = useState<GameState | null>(null)
  const [display, setDisplay] = useState<Display>({ player: [], dealer: [], split: [] })
  const [live, setLive] = useState<LiveHand | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [dealing, setDealing] = useState(false)
  const [acting, setActing] = useState(false)
  const [animating, setAnimating] = useState(false)
  const busyRef = useRef(false)

  const fetchState = useCallback(async () => {
    const res = await fetch('/api/blackjack/state')
    if (!res.ok) return
    const data: GameState = await res.json()
    setGs(data)
    if (data.activeHand) {
      const ah = data.activeHand
      setDisplay({
        player: ah.playerCards,
        dealer: ah.dealerCards,
        split: ah.splitCards ?? [],
      })
      setLive({
        playerCards: ah.playerCards, dealerCards: ah.dealerCards,
        splitCards: ah.splitCards, playerValue: ah.playerValue,
        splitValue: ah.splitValue ?? 0, dealerValue: 0,
        status: 'active', splitStatus: ah.splitStatus,
        playingSplit: ah.playingSplit, doubled: ah.doubled,
      })
    }
  }, [])

  useEffect(() => { if (status === 'authenticated') fetchState() }, [status, fetchState])

  async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

  async function revealCard(target: 'player' | 'dealer' | 'split', card: Card) {
    mkSound('deal')
    setDisplay(p => ({ ...p, [target]: [...p[target], card] }))
    await sleep(280)
  }

  // ── Deal ──
  async function dealHand() {
    if (busyRef.current) return
    busyRef.current = true
    setDealing(true); setResult(null); setLive(null)
    setDisplay({ player: [], dealer: [], split: [] })

    const res = await fetch('/api/blackjack/deal', { method: 'POST' })
    const data = await res.json()
    setDealing(false)

    if (!res.ok) { alert(data.error); busyRef.current = false; return }

    setAnimating(true)
    await revealCard('player', data.playerCards[0])
    await revealCard('dealer', data.dealerCards[0])
    await revealCard('player', data.playerCards[1])
    await revealCard('dealer', data.dealerCards[1])
    setAnimating(false)

    if (data.status !== 'active') {
      // Immediate result (blackjack etc.) — flip dealer card
      setDisplay({ player: data.playerCards, dealer: data.dealerCards, split: [] })
      if (data.status === 'blackjack' || data.status === 'player_won') mkSound('win')
      else if (data.status === 'bust' || data.status === 'dealer_won') mkSound('lose')
      else mkSound('push')
      setResult({ ...data, splitCards: null, splitValue: undefined, dealerValue: 0 })
    } else {
      setLive({
        playerCards: data.playerCards, dealerCards: data.dealerCards,
        splitCards: null, playerValue: data.playerValue, splitValue: 0,
        dealerValue: 0, status: 'active', splitStatus: null,
        playingSplit: false, doubled: false,
      })
    }

    busyRef.current = false
    fetchState()
  }

  // ── Action ──
  async function sendAction(action: 'hit' | 'stand' | 'double' | 'split') {
    if (busyRef.current || !live) return
    busyRef.current = true
    setActing(true)

    const res = await fetch('/api/blackjack/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const data = await res.json()
    setActing(false)

    if (!res.ok) { alert(data.error); busyRef.current = false; return }

    const isComplete = data.status !== 'active' || (data.splitStatus && data.splitStatus !== 'active')
    const bothDone = data.status !== 'active' && (!data.splitStatus || data.splitStatus !== 'active')

    if (action === 'split') {
      // Redistribute cards with animation
      setAnimating(true)
      setDisplay({ player: [], dealer: display.dealer, split: [] })
      await revealCard('player', data.playerCards[0])
      await revealCard('split',  data.splitCards[0])
      await revealCard('player', data.playerCards[1])
      await revealCard('split',  data.splitCards[1])
      setAnimating(false)
      setLive({ ...data, splitValue: calculateHandValue(data.splitCards), dealerValue: 0 })
      busyRef.current = false; return
    }

    if (action === 'hit' || action === 'double') {
      const target = data.playingSplit ? 'split' : 'player'
      const prevCount = target === 'split' ? display.split.length : display.player.length
      const newCard = target === 'split'
        ? data.splitCards?.[prevCount]
        : data.playerCards[prevCount]
      if (newCard) {
        setAnimating(true)
        await revealCard(target, newCard)
        setAnimating(false)
      }
    }

    // Switching from hand 1 to split
    if (data.playingSplit && data.splitStatus === 'active' && !bothDone) {
      setDisplay(p => ({ ...p, player: data.playerCards }))
      setLive({ ...data, splitValue: calculateHandValue(data.splitCards ?? []), dealerValue: 0 })
      busyRef.current = false; fetchState(); return
    }

    // Hand complete — reveal dealer cards
    if (bothDone && data.dealerCards) {
      setAnimating(true)
      // Flip hidden card
      const dealer = data.dealerCards
      setDisplay(p => ({
        ...p,
        dealer: [dealer[0], { ...dealer[1], hidden: false }],
        player: data.playerCards,
        split: data.splitCards ?? [],
      }))
      mkSound('deal')
      await sleep(400)
      // Animate additional dealer cards
      for (let i = 2; i < dealer.length; i++) {
        mkSound('deal')
        setDisplay(p => ({ ...p, dealer: dealer.slice(0, i + 1) }))
        await sleep(350)
      }
      setAnimating(false)

      // Result sound
      const mainWon = data.status === 'player_won' || data.status === 'blackjack'
      const splitWon = data.splitStatus === 'player_won' || data.splitStatus === 'blackjack'
      if (mainWon || splitWon) mkSound('win')
      else if (data.status === 'push' || data.splitStatus === 'push') mkSound('push')
      else mkSound('lose')

      setResult(data)
      setLive(null)
    } else if (!bothDone) {
      setLive(prev => prev ? { ...prev, ...data } : data)
    }

    busyRef.current = false
    fetchState()
  }

  // Auto-stand at 21
  useEffect(() => {
    if (!live || acting || animating || busyRef.current) return
    const val = live.playingSplit
      ? calculateHandValue(live.splitCards ?? [])
      : live.playerValue
    if (val === 21 && live.status === 'active') {
      sendAction('stand')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.playerValue, live?.splitValue, live?.playingSplit])

  // ── Loading / unauth ──
  if (status === 'loading') return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="h-6 w-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </main>
  )

  if (status === 'unauthenticated') return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">🃏 Daily Blackjack</h1>
        <p className="text-surface-300">Sign in with Discord to play</p>
        <button onClick={() => signIn('discord')}
          className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors">
          Sign in with Discord
        </button>
      </div>
    </main>
  )

  const isSplit = !!(live?.splitCards?.length || display.split.length > 0 || result?.splitCards?.length)
  const isActiveHand = !!live && live.status === 'active'
  const busy = dealing || acting || animating

  const canPlayerHit = isActiveHand && !busy && (live.playingSplit
    ? calculateHandValue(live.splitCards ?? []) < 21
    : live.playerValue < 21)
  const showSplitBtn = isActiveHand && !busy && !live.playingSplit && !isSplit
    && canSplit(live.playerCards)

  const nextTier = REDEMPTION_TIERS.find(t => (gs?.totalPoints ?? 0) < t.points)
  const progressPct = nextTier ? Math.min(100, ((gs?.totalPoints ?? 0) / nextTier.points) * 100) : 100

  // Dealer value display
  const dealerVal = display.dealer.filter(c => !c.hidden).length > 0
    ? calculateHandValue(display.dealer.filter(c => !c.hidden))
    : 0

  return (
    <main className="min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-white">Daily Blackjack</h1>
          <p className="text-surface-400 text-sm mt-1">3 free hands per day · Earn points · Climb the tiers</p>
        </div>

        {/* Stats */}
        {gs && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-brand-400">{gs.handsRemaining}</div>
              <div className="text-xs text-surface-400">Hands today</div>
            </div>
            <div className="bg-surface-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-yellow-400">{gs.totalPoints.toLocaleString('en-US')}</div>
              <div className="text-xs text-surface-400">Total points</div>
            </div>
            <div className="bg-surface-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-orange-400">🔥 {gs.streakDays}</div>
              <div className="text-xs text-surface-400">Day streak</div>
            </div>
          </div>
        )}

        {/* Progress */}
        {gs && nextTier && (
          <div className="bg-surface-800 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-surface-300">Progress to {nextTier.emoji} {nextTier.name}</span>
              <span className="text-white font-medium">{gs.totalPoints.toLocaleString('en-US')} / {nextTier.points.toLocaleString('en-US')}</span>
            </div>
            <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        {/* Game table */}
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-5 space-y-4 min-h-[340px]"
            style={{ backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 70%)' }}>

            {/* Dealer */}
            <div>
              <p className="text-green-300 text-xs font-semibold uppercase tracking-widest mb-1">
                Dealer {dealerVal > 0 && <span className="text-white ml-1">{dealerVal}</span>}
              </p>
              <div className="flex gap-2 min-h-[80px] items-center">
                {display.dealer.length === 0 && <span className="text-green-700 text-sm italic">Waiting…</span>}
                {display.dealer.map((card, i) => (
                  <PlayingCard
                    key={`${card.rank}-${card.suit}-${card.hidden ? 'h' : 'v'}-${i}`}
                    card={card}
                    animClass={i === 1 && !card.hidden && result ? 'animate-flip' : 'animate-deal'}
                  />
                ))}
              </div>
            </div>

            {/* Result banner */}
            {result && (
              <div className="text-center space-y-1 animate-up py-1">
                {isSplit ? (
                  <div className="flex justify-center gap-8">
                    <div>
                      <div className={`text-lg font-black ${resultLabel(result.status).color}`}>
                        Hand 1: {resultLabel(result.status).text}
                      </div>
                    </div>
                    {result.splitStatus && (
                      <div>
                        <div className={`text-lg font-black ${resultLabel(result.splitStatus).color}`}>
                          Split: {resultLabel(result.splitStatus).text}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`text-2xl font-black ${resultLabel(result.status).color}`}>
                    {resultLabel(result.status).text}
                  </div>
                )}
                <div className="text-brand-300 font-semibold">{pts(result.pointsAwarded)}</div>
                {result.streakBonus > 0 && <div className="text-orange-300 text-sm">🔥 Streak +{result.streakBonus}</div>}
                {result.allHandsBonus > 0 && <div className="text-brand-300 text-sm">✅ All hands +{result.allHandsBonus}</div>}
              </div>
            )}

            {/* Player hands */}
            <div className={isSplit ? 'grid grid-cols-2 gap-3' : ''}>
              {/* Hand 1 */}
              <HandArea
                cards={display.player}
                value={live?.playerValue ?? calculateHandValue(display.player)}
                label={isSplit ? 'Hand 1' : `You${live ? ` — Hand ${gs?.handsPlayed ?? 0}+1/3` : ''}`}
                active={isActiveHand && !live?.playingSplit}
                done={isSplit && !!(live?.playingSplit || result)}
                doneLabel={live?.hand1Bust ? '💥 Bust' : result ? resultLabel(result.status).text : undefined}
                doneColor={resultLabel(result?.status ?? '').color}
              />

              {/* Split hand */}
              {isSplit && (
                <HandArea
                  cards={display.split}
                  value={live?.splitValue ?? calculateHandValue(display.split)}
                  label="Split"
                  active={isActiveHand && !!live?.playingSplit}
                  done={!!(result?.splitStatus)}
                  doneLabel={result?.splitStatus ? resultLabel(result.splitStatus).text : undefined}
                  doneColor={resultLabel(result?.splitStatus ?? '').color}
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="bg-surface-900 p-4">
            {!isActiveHand ? (
              <button onClick={dealHand} disabled={busy || gs?.handsRemaining === 0}
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-black text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20">
                {dealing ? '🃏 Dealing…' : gs?.handsRemaining === 0 ? '⏰ Come back tomorrow' : '🃏 Deal Hand'}
              </button>
            ) : (
              <div className={`grid gap-3 ${showSplitBtn ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <button onClick={() => sendAction('hit')} disabled={!canPlayerHit || busy}
                  className="py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  Hit
                </button>
                <button onClick={() => sendAction('stand')} disabled={busy}
                  className="py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black transition-all disabled:opacity-30">
                  Stand
                </button>
                <button
                  onClick={() => sendAction('double')}
                  disabled={busy || (live.playingSplit ? display.split.length > 2 : display.player.length > 2)}
                  className="py-3 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-black transition-all disabled:opacity-30 disabled:cursor-not-allowed flex flex-col items-center leading-none gap-0.5">
                  <span>Double</span>
                  <span className="text-[10px] font-normal opacity-75">win ×2 / lose −20</span>
                </button>
                {showSplitBtn && (
                  <button onClick={() => sendAction('split')} disabled={busy}
                    className="py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black transition-all disabled:opacity-30">
                    Split
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Points guide */}
        <div className="bg-surface-800 rounded-xl p-5 space-y-3">
          <h3 className="text-white font-bold text-sm">Points per hand</h3>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-sm">
            <div className="flex justify-between text-yellow-400"><span>🃏 Blackjack</span><span>{pts(POINTS.blackjack)}</span></div>
            <div className="flex justify-between text-green-400"><span>🏆 Win</span><span>{pts(POINTS.win)}</span></div>
            <div className="flex justify-between text-brand-400"><span>🤝 Push</span><span>{pts(POINTS.push)}</span></div>
            <div className="flex justify-between text-surface-400"><span>💥 Bust / Lose</span><span>{pts(POINTS.lose)}</span></div>
            <div className="flex justify-between text-yellow-500"><span>✌️ Double win</span><span>+{POINTS.win * 2} pts</span></div>
            <div className="flex justify-between text-red-400"><span>💀 Double lose</span><span>{POINTS.doubleLose} pts</span></div>
            <div className="flex justify-between text-orange-400"><span>🔥 7-day streak</span><span>+50/day</span></div>
            <div className="flex justify-between text-orange-400"><span>🔥 14-day streak</span><span>+150/day</span></div>
            <div className="flex justify-between text-brand-400 col-span-2"><span>✅ All 3 hands played</span><span>{pts(POINTS.allHandsBonus)}</span></div>
          </div>
          <div className="border-t border-surface-700 pt-3 space-y-1">
            <p className="text-surface-500 text-xs font-semibold uppercase tracking-widest">Redemption tiers</p>
            {REDEMPTION_TIERS.map(t => (
              <div key={t.name} className="flex justify-between text-sm">
                <span className="text-white">{t.emoji} {t.name}</span>
                <span className="text-surface-400">{t.points.toLocaleString('en-US')} pts</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
