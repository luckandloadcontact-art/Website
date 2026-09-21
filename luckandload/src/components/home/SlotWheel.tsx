'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Dices, ExternalLink, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WHEEL_GAMES, HYPE_PLAY_URL, type WheelGame } from '@/lib/slotWheel'

// Minimum antall "hopp" før animasjonen får lov til å stoppe -- skalert med antall spill, så
// spinnet alltid rekker minst et par runder rundt hele listen uansett hvor mange spill vi har
// lagt til (og bare enda flere kommer).
const SPIN_TICKS = Math.max(24, WHEEL_GAMES.length * 2)
const BASE_DELAY = 70 // ms mellom hvert hopp i starten (raskt)
const MAX_DELAY = 320 // ms mellom hvert hopp mot slutten (bremser ned)

export function SlotWheel() {
  const [highlight, setHighlight] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<WheelGame | null>(null)
  const [minBet, setMinBet] = useState(1)
  const [maxBet, setMaxBet] = useState(100)
  const [buyAmountOn, setBuyAmountOn] = useState(false)
  const [suggestedBuy, setSuggestedBuy] = useState<number | null>(null)

  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Rydd opp en eventuell pågående animasjon hvis komponenten forsvinner midt i et spinn.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const scrollToIndex = useCallback((i: number) => {
    cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [])

  function handleSpin() {
    if (spinning) return
    setResult(null)
    setSuggestedBuy(null)
    setSpinning(true)

    const finalIndex = Math.floor(Math.random() * WHEEL_GAMES.length)
    let current = highlight
    let tick = 0

    function step() {
      current = (current + 1) % WHEEL_GAMES.length
      tick++
      setHighlight(current)
      scrollToIndex(current)

      const progress = Math.min(1, tick / SPIN_TICKS)
      const delay = BASE_DELAY + (MAX_DELAY - BASE_DELAY) * progress ** 2

      if (tick < SPIN_TICKS || current !== finalIndex) {
        timeoutRef.current = setTimeout(step, delay)
      } else {
        setSpinning(false)
        setResult(WHEEL_GAMES[finalIndex])
        if (buyAmountOn) {
          const bet = minBet + Math.random() * Math.max(0, maxBet - minBet)
          setSuggestedBuy(Math.round(bet * 100))
        }
      }
    }

    timeoutRef.current = setTimeout(step, BASE_DELAY)
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

        {/* Carousel */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
          {WHEEL_GAMES.map((game, i) => {
            const isResult = result?.id === game.id
            const isHighlighted = spinning && i === highlight

            return (
              <div
                key={game.id}
                ref={el => {
                  cardRefs.current[i] = el
                }}
                className={cn(
                  'relative aspect-[3/4] w-36 shrink-0 snap-center overflow-hidden rounded-2xl border-2 transition-all duration-150 sm:w-44',
                  isResult
                    ? 'scale-105 border-gold-400 shadow-[0_0_30px_-4px_rgba(201,165,60,0.7)]'
                    : isHighlighted
                      ? 'scale-105 border-brand-400'
                      : 'border-white/10 opacity-70'
                )}
              >
                <Image src={game.image} alt={game.name} fill sizes="176px" className="object-cover" />
                {/* De fleste cover-bildene har allerede tittel + leverandør innebygd (hentet
                    direkte fra Hype.bet). Vis kun vår egen tekst-overlay for de få som mangler det. */}
                {game.needsLabel && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                    <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-300 backdrop-blur">
                      {game.provider}
                    </span>
                    <p className="absolute bottom-2 left-2 right-2 text-xs font-bold leading-tight text-white">
                      {game.name}
                    </p>
                  </>
                )}
              </div>
            )
          })}
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
