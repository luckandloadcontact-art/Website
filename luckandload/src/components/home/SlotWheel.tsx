'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Dices, ExternalLink, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WHEEL_GAMES, HYPE_PLAY_URL, type WheelGame } from '@/lib/slotWheel'

// Hvor mange kort som genereres for én "rull" -- lang nok til at animasjonen føles som et
// ordentlig spinn, med litt buffer etter vinneren så stripen ikke ser tom ut idet den stopper.
const REEL_LENGTH = 48
const WINNER_POS = 40
const SPIN_DURATION_MS = 5200
// Ingen spill får gjenta seg innenfor dette vinduet, slik at man aldri ser samme spill to
// ganger samtidig i den synlige stripen.
const NO_REPEAT_WINDOW = 8

function randomGame(): WheelGame {
  return WHEEL_GAMES[Math.floor(Math.random() * WHEEL_GAMES.length)]
}

/** Bygger en ny, tilfeldig rekkefølge av kort for stripen -- uten at samme spill dukker opp to ganger innenfor NO_REPEAT_WINDOW. */
function buildReel(): WheelGame[] {
  const items: WheelGame[] = []
  for (let i = 0; i < REEL_LENGTH; i++) {
    const recent = items.slice(Math.max(0, i - NO_REPEAT_WINDOW), i)
    let candidate = randomGame()
    let attempts = 0
    while (attempts < 25 && recent.some(g => g.id === candidate.id)) {
      candidate = randomGame()
      attempts++
    }
    items.push(candidate)
  }
  return items
}

export function SlotWheel() {
  const [reel, setReel] = useState<WheelGame[]>(() => buildReel())
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<WheelGame | null>(null)
  const [offset, setOffset] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [minBet, setMinBet] = useState(1)
  const [maxBet, setMaxBet] = useState(100)
  const [buyAmountOn, setBuyAmountOn] = useState(false)
  const [suggestedBuy, setSuggestedBuy] = useState<number | null>(null)

  const viewportRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  function handleSpin() {
    if (spinning) return
    setResult(null)
    setSuggestedBuy(null)
    setSpinning(true)

    const items = buildReel()

    // Hopp tilbake til start uten animasjon først, så selve spinnet alltid har samme lengde å
    // reise uansett hvor forrige spinn landet.
    setTransitioning(false)
    setReel(items)
    setOffset(0)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const viewport = viewportRef.current
        const first = itemRefs.current[0]
        const second = itemRefs.current[1]
        if (!viewport || !first || !second) return

        const itemStep = second.offsetLeft - first.offsetLeft
        const itemCenter = first.offsetLeft + first.offsetWidth / 2 + WINNER_POS * itemStep - first.offsetLeft
        const target = viewport.offsetWidth / 2 - itemCenter

        setTransitioning(true)
        setOffset(target)
      })
    })

    timeoutRef.current = setTimeout(() => {
      setSpinning(false)
      const winner = items[WINNER_POS]
      setResult(winner)
      if (buyAmountOn) {
        const bet = minBet + Math.random() * Math.max(0, maxBet - minBet)
        setSuggestedBuy(Math.round(bet * 100))
      }
    }, SPIN_DURATION_MS)
  }

  return (
    <section className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-center gap-3">
          <Dices size={20} className="text-brand-500" />
          <h2 className="text-xl font-bold text-white">Slot Wheel</h2>
        </div>
        <p className="mb-8 max-w-xl text-sm text-slate-400">
          Can&apos;t decide what to play? Spin the wheel and let it pick your next game.
        </p>

        {/* Reel */}
        <div
          ref={viewportRef}
          className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-surface-800 py-4"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          }}
        >
          {/* Fast midtmarkør */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-0.5 -translate-x-1/2 bg-gold-400/80 shadow-[0_0_12px_2px_rgba(201,165,60,0.6)]" />
          <div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-gold-400" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 -translate-x-1/2 border-x-8 border-b-8 border-x-transparent border-b-gold-400" />

          <div
            className="flex gap-3 pl-3"
            style={{
              transform: `translateX(${offset}px)`,
              transition: transitioning ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12,0.72,0.18,1)` : 'none',
            }}
          >
            {reel.map((game, i) => {
              const isWinner = !spinning && result && i === WINNER_POS
              return (
                <div
                  key={i}
                  ref={el => {
                    itemRefs.current[i] = el
                  }}
                  className={cn(
                    'relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl border-2 sm:w-32',
                    isWinner
                      ? 'border-gold-400 shadow-[0_0_24px_-4px_rgba(201,165,60,0.8)]'
                      : 'border-white/10'
                  )}
                >
                  <Image src={game.image} alt={game.name} fill sizes="128px" className="object-cover" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-surface-800 px-3 py-2 text-sm">
            <span className="text-xs text-slate-500">Min</span>
            <input
              type="number"
              min={0}
              value={minBet}
              onChange={e => setMinBet(Math.max(0, Number(e.target.value) || 0))}
              className="w-14 bg-transparent text-right text-white focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-surface-800 px-3 py-2 text-sm">
            <span className="text-xs text-slate-500">Max</span>
            <input
              type="number"
              min={minBet}
              value={maxBet}
              onChange={e => setMaxBet(Math.max(minBet, Number(e.target.value) || minBet))}
              className="w-16 bg-transparent text-right text-white focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => setBuyAmountOn(v => !v)}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
              buyAmountOn
                ? 'border-gold-500/40 bg-gold-500/10 text-gold-400'
                : 'border-white/10 bg-surface-800 text-slate-400 hover:text-white'
            )}
          >
            <Coins size={15} />
            Buy Amount
          </button>
          <button
            type="button"
            onClick={handleSpin}
            disabled={spinning}
            className="rounded-xl bg-gradient-to-r from-brand-500 to-gold-500 px-8 py-2.5 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-brand-500/25 transition-all hover:scale-105 hover:shadow-brand-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {spinning ? 'Spinning…' : 'Spin'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="animate-fade-in mx-auto mt-8 max-w-md rounded-2xl border border-gold-500/30 bg-gradient-to-b from-gold-500/10 to-transparent p-6 text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gold-400">You got</p>
            <p className="mb-1 text-2xl font-black text-white">{result.name}</p>
            <p className="mb-4 text-sm text-slate-400">{result.provider}</p>
            {suggestedBuy != null && (
              <p className="mb-4 text-sm text-slate-300">
                Suggested bonus buy: <span className="font-bold text-gold-400">${suggestedBuy.toLocaleString()}</span>
              </p>
            )}
            <a
              href={HYPE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-hype px-6 py-2.5 text-sm font-black text-black transition-colors hover:bg-hype/90"
            >
              Play Now <ExternalLink size={15} />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
