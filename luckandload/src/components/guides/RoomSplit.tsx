'use client'

import { useEffect, useRef, useState } from 'react'

// Interactive explainer for Hype.bet multiplayer rooms, built on a real moment: our $13,500 Zeus vs
// Hades max win (September 2026). Choose what you would have added to the room before we bought the
// bonus, and see your share of the buy, the win and your balance afterwards. Every result in a room
// is split by each player's share of the pool, which is how the rooms work.
//
// From the clip: the room balance was $1,989.01 right after the $270 bonus buy ($0.90 bet), so the
// rest of the room had about $2,259 in it before the buy. The bonus paid $13,500 (15,000x).
const ROOM_BEFORE_BUY = 2259
const BUY_COST = 270
const MAX_WIN = 13500
const MIN = 10
const MAX = 500
const PRESETS = [10, 25, 50, 100, 250, 500]

const OUTCOMES = [
  { key: 'won', label: 'What happened: $13,500', win: MAX_WIN },
  { key: 'nothing', label: 'If the bonus had paid nothing', win: 0 },
] as const

type OutcomeKey = (typeof OUTCOMES)[number]['key']

const HYPE = '#1ce479'

function money(value: number) {
  const abs = Math.abs(value)
  return `$${abs.toLocaleString('en-US', { minimumFractionDigits: abs % 1 ? 2 : 0, maximumFractionDigits: 2 })}`
}

const round2 = (value: number) => Math.round(value * 100) / 100

/** Eases a number towards its new value, so the figures glide instead of jumping. */
function useTween(target: number, duration = 450) {
  const [value, setValue] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    const start = performance.now()
    const begin = from.current
    let frame = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = begin + (target - begin) * eased
      setValue(next)
      from.current = next
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return value
}

export function RoomSplit() {
  const [yours, setYours] = useState(50)
  const [outcomeKey, setOutcomeKey] = useState<OutcomeKey>('won')
  const outcome = OUTCOMES.find(o => o.key === outcomeKey)!

  const pool = yours + ROOM_BEFORE_BUY
  const share = yours / pool
  const yourBuy = round2(BUY_COST * share)
  const yourWin = round2(outcome.win * share)
  const yourBalance = round2(yours - yourBuy + yourWin)

  const sharePct = useTween(share * 100)
  const buyShown = useTween(yourBuy)
  const winShown = useTween(yourWin)
  const balanceShown = useTween(yourBalance)

  const fill = ((yours - MIN) / (MAX - MIN)) * 100
  const RADIUS = 50
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const up = yourBalance >= yours

  return (
    <figure className="mb-6 max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-surface-800 to-surface-900 p-5 sm:p-6">
      <style>
        {'.room-range{-webkit-appearance:none;appearance:none;height:8px;border-radius:9999px;outline:none;cursor:pointer}' +
          '.room-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;border-radius:9999px;background:#fff;border:4px solid ' +
          HYPE +
          ';box-shadow:0 0 0 4px rgba(28,228,121,.18);transition:transform .15s}' +
          '.room-range::-webkit-slider-thumb:hover{transform:scale(1.12)}' +
          '.room-range::-moz-range-thumb{width:16px;height:16px;border-radius:9999px;background:#fff;border:4px solid ' +
          HYPE +
          ';box-shadow:0 0 0 4px rgba(28,228,121,.18)}' +
          '.room-range:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 6px rgba(28,228,121,.35)}'}
      </style>

      <p className="text-base font-bold text-white">Try it: your cut of our Zeus vs Hades max win</p>
      <p className="mt-0.5 text-xs leading-5 text-slate-400">
        The room had {money(ROOM_BEFORE_BUY)} in it when we bought the bonus for {money(BUY_COST)}. It paid{' '}
        {money(MAX_WIN)}. Choose what you would have added before the buy.
      </p>

      {/* Your share ring + amount */}
      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-[140px] w-[140px] shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke={HYPE}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - sharePct / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-black leading-none tabular-nums text-white">{sharePct.toFixed(1)}%</span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">your share</span>
          </div>
        </div>

        <div className="w-full flex-1">
          <label htmlFor="room-split-amount" className="flex items-baseline justify-between">
            <span className="text-sm text-slate-300">You add</span>
            <span className="text-3xl font-black tabular-nums text-white">{money(yours)}</span>
          </label>
          <input
            id="room-split-amount"
            type="range"
            min={MIN}
            max={MAX}
            step={5}
            value={yours}
            onChange={e => setYours(Number(e.target.value))}
            className="room-range mt-3 w-full"
            style={{ background: `linear-gradient(to right, ${HYPE} ${fill}%, rgba(255,255,255,0.1) ${fill}%)` }}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map(amount => (
              <button
                key={amount}
                type="button"
                onClick={() => setYours(amount)}
                aria-pressed={yours === amount}
                className={`rounded-lg border px-3 py-1 text-xs font-semibold tabular-nums transition-colors ${
                  yours === amount
                    ? 'border-hype bg-hype/15 text-hype'
                    : 'border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                }`}
              >
                {money(amount)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* The room right before the buy: you and everyone else */}
      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-slate-400">The room before the buy</span>
          <span className="font-bold tabular-nums text-white">{money(pool)}</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-slate-600">
          <div className="transition-[width] duration-500 ease-out" style={{ width: `${share * 100}%`, background: HYPE }} />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          <Legend color={HYPE} label="You" value={money(yours)} />
          <Legend color="#475569" label="Everyone else in the room" value={money(ROOM_BEFORE_BUY)} />
        </div>
      </div>

      {/* What the bonus meant for you */}
      <div className="mt-6 rounded-xl border border-white/10 bg-surface-950/50 p-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Outcome">
          {OUTCOMES.map(o => (
            <button
              key={o.key}
              type="button"
              onClick={() => setOutcomeKey(o.key)}
              aria-pressed={outcomeKey === o.key}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                outcomeKey === o.key
                  ? o.win > 0
                    ? 'bg-hype text-black'
                    : 'bg-red-500 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-400">Your share of the {money(BUY_COST)} buy</dt>
            <dd className="text-2xl font-black tabular-nums text-red-400">−{money(round2(buyShown))}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Your share of the win</dt>
            <dd className={`text-2xl font-black tabular-nums ${outcome.win > 0 ? 'text-hype' : 'text-slate-500'}`}>
              +{money(round2(winShown))}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Your balance in the room</dt>
            <dd className={`text-2xl font-black tabular-nums ${up ? 'text-white' : 'text-red-300'}`}>
              <span className="text-sm font-bold text-slate-500">{money(yours)} → </span>
              {money(round2(balanceShown))}
            </dd>
          </div>
        </dl>
      </div>

      <figcaption className="mt-4 text-xs leading-5 text-slate-400">
        Based on the real numbers from our room: about {money(ROOM_BEFORE_BUY)} before the {money(BUY_COST)} buy at a
        $0.90 bet, and a {money(MAX_WIN)} payout.
      </figcaption>
    </figure>
  )
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label} <span className="tabular-nums text-slate-300">{value}</span>
    </span>
  )
}
