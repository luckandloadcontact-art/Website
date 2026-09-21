'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, Dices, ExternalLink } from 'lucide-react'
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

/** Én kort "tikk" i spinnlyden -- en kort klikk-tone med rask decay, som en case-opening-reel. */
function playTick(ctx: AudioContext, time: number, volume: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(820, time)
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(volume, time + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(time)
  osc.stop(time + 0.05)
}

/**
 * Spinnlyd: en lav "dur" gjennom hele spinnet (som toner ut mot slutten) pluss en rekke tikk
 * som starter tett og bremser ned i takt med den visuelle deselerasjonen -- samme følelse som
 * når man åpner en CS-case.
 */
function playSpinSound(ctx: AudioContext, durationMs: number) {
  const now = ctx.currentTime
  const durationSec = durationMs / 1000

  const drone = ctx.createOscillator()
  const droneGain = ctx.createGain()
  drone.type = 'sawtooth'
  drone.frequency.setValueAtTime(90, now)
  drone.frequency.exponentialRampToValueAtTime(48, now + durationSec)
  droneGain.gain.setValueAtTime(0, now)
  droneGain.gain.linearRampToValueAtTime(0.05, now + 0.15)
  droneGain.gain.setValueAtTime(0.05, now + Math.max(0.16, durationSec - 0.4))
  droneGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec)
  drone.connect(droneGain)
  droneGain.connect(ctx.destination)
  drone.start(now)
  drone.stop(now + durationSec + 0.05)

  let t = 0
  while (t < durationSec - 0.05) {
    const progress = t / durationSec
    playTick(ctx, now + t, 0.16 * (1 - progress * 0.5))
    t += 0.035 + progress ** 2 * 0.22
  }
}

const BUY_AMOUNT_STEP = 20

/** Tilfeldig beløp mellom min og max, men alltid et multiplum av BUY_AMOUNT_STEP (20, 40, 60 ...). */
function randomSteppedAmount(min: number, max: number): number {
  const lo = Math.ceil(min / BUY_AMOUNT_STEP) * BUY_AMOUNT_STEP
  const hi = Math.floor(max / BUY_AMOUNT_STEP) * BUY_AMOUNT_STEP
  if (hi < lo) return Math.round(min / BUY_AMOUNT_STEP) * BUY_AMOUNT_STEP
  const steps = (hi - lo) / BUY_AMOUNT_STEP
  return lo + Math.floor(Math.random() * (steps + 1)) * BUY_AMOUNT_STEP
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
  const [minBet, setMinBet] = useState(20)
  const [maxBet, setMaxBet] = useState(100)
  // Egen tekst-state for input-feltene, slik at man kan slette hele tallet og skrive et nytt
  // uten at det hopper tilbake til minimumsverdien (20) på hvert tastetrykk. Feltet klammes
  // først til gyldig verdi når man forlater det (blur).
  const [minBetInput, setMinBetInput] = useState('20')
  const [maxBetInput, setMaxBetInput] = useState('100')
  const [buyAmountOn, setBuyAmountOn] = useState(false)
  const [suggestedBuy, setSuggestedBuy] = useState<number | null>(null)
  // Teller antall forhåndslastede spillbilder som er ferdig (eller feilet) -- Spin er sperret
  // til alle er klare, slik at det ikke spiller noen rolle hvor mange spill listen vokser til;
  // uten dette kunne man rekke å spinne før alle rakk å bli hentet inn i nettleser-cachen.
  const [loadedCount, setLoadedCount] = useState(0)
  const assetsReady = loadedCount >= WHEEL_GAMES.length

  function commitMinBet(raw: string) {
    const clamped = Math.max(20, Math.round(Number(raw)) || 20)
    setMinBet(clamped)
    setMinBetInput(String(clamped))
    if (maxBet < clamped) {
      setMaxBet(clamped)
      setMaxBetInput(String(clamped))
    }
  }

  function commitMaxBet(raw: string) {
    const clamped = Math.max(minBet, Math.round(Number(raw)) || minBet)
    setMaxBet(clamped)
    setMaxBetInput(String(clamped))
  }

  const viewportRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      audioCtxRef.current?.close()
    }
  }, [])

  function handleSpin() {
    if (spinning || !assetsReady) return
    setResult(null)
    setSuggestedBuy(null)
    setSpinning(true)

    // AudioContext må opprettes/gjenopptas inne i en brukerhandling (klikket her) for at
    // nettlesere skal tillate lyd.
    const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (AudioContextCtor) {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContextCtor()
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()
      playSpinSound(ctx, SPIN_DURATION_MS)
    }

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
        setSuggestedBuy(randomSteppedAmount(minBet, maxBet))
      }
    }, SPIN_DURATION_MS)
  }

  return (
    <section className="border-t border-white/5 py-16">
      {/*
        Forhåndslaster alle spillbildene i samme størrelse som stripen bruker (usynlig, tar ingen
        plass). next/image lat-laster ellers ikoner som aldri har vært synlige på skjermen, og
        siden stripen "ruller" med CSS-transform (ikke ekte scroll) rekker ikke nettleseren å
        hente dem før de suser forbi -- det så ut som manglende/like bilder i det aller første
        spinnet etter en fersk sideinnlasting. Vi teller onLoad/onError for hvert bilde og
        sperrer Spin-knappen (assetsReady) til absolutt alle er klare i nettleserens cache --
        dette skalerer uansett hvor mange spill listen vokser til, i stedet for å bare håpe at
        forhåndslastingen rakk å bli ferdig i tide.
      */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        {WHEEL_GAMES.map(game => (
          <div key={game.id} className="relative aspect-[3/4] w-32 sm:w-44">
            <Image
              src={game.image}
              alt=""
              fill
              sizes="176px"
              priority
              onLoad={() => setLoadedCount(c => c + 1)}
              onError={() => setLoadedCount(c => c + 1)}
            />
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-center gap-3">
          <Dices size={20} className="text-brand-500" />
          <h2 className="text-xl font-bold text-white">Slot Wheel</h2>
        </div>
        <p className="mb-8 max-w-xl text-sm text-slate-400">
          Can&apos;t decide what to play? Spin the wheel and let the professionals pick for you.
        </p>

        {/* Reel */}
        <div
          ref={viewportRef}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-surface-800 py-6"
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
                    'relative aspect-[3/4] w-32 shrink-0 overflow-hidden rounded-xl border-2 sm:w-44',
                    isWinner
                      ? 'border-gold-400 shadow-[0_0_24px_-4px_rgba(201,165,60,0.8)]'
                      : 'border-white/10'
                  )}
                >
                  <Image src={game.image} alt={game.name} fill sizes="176px" className="object-cover" />
                  {game.needsLabel && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                      <p className="absolute inset-x-2 bottom-2 text-center text-xs font-bold leading-tight text-white">
                        {game.name}
                        <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-wide text-slate-300">
                          {game.provider}
                        </span>
                      </p>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <label className="flex items-center gap-2 rounded-full border border-white/10 bg-surface-800 px-4 py-2.5 text-sm">
            <span className="text-xs text-slate-500">Min</span>
            <input
              type="number"
              min={20}
              value={minBetInput}
              onChange={e => setMinBetInput(e.target.value)}
              onBlur={e => commitMinBet(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') e.currentTarget.blur()
              }}
              className="w-14 bg-transparent text-right font-bold text-white focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </label>
          <label className="flex items-center gap-2 rounded-full border border-white/10 bg-surface-800 px-4 py-2.5 text-sm">
            <span className="text-xs text-slate-500">Max</span>
            <input
              type="number"
              min={minBet}
              value={maxBetInput}
              onChange={e => setMaxBetInput(e.target.value)}
              onBlur={e => commitMaxBet(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') e.currentTarget.blur()
              }}
              className="w-16 bg-transparent text-right font-bold text-white focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </label>
          <button
            type="button"
            onClick={() => setBuyAmountOn(v => !v)}
            className="flex items-center gap-2.5 rounded-full border border-white/10 bg-surface-800 py-2 pl-2 pr-4 text-xs font-semibold text-slate-300 transition-colors hover:text-white"
          >
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors',
                buyAmountOn ? 'border-hype bg-hype text-black' : 'border-white/20 text-transparent'
              )}
            >
              <Check size={13} strokeWidth={3} />
            </span>
            <span className="leading-tight">
              Buy
              <br />
              Amount
            </span>
          </button>
          <button
            type="button"
            onClick={handleSpin}
            disabled={spinning || !assetsReady}
            className="rounded-full bg-gradient-to-r from-brand-500 to-gold-500 px-10 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-brand-500/25 transition-all hover:scale-105 hover:shadow-brand-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {!assetsReady ? 'Loading…' : spinning ? 'Spinning…' : 'Spin'}
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
