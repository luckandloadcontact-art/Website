'use client'

import { useEffect, useRef, useState } from 'react'

// Interactive explainer for Hype.bet multiplayer rooms: choose how much you add to the shared pool
// and see your share, how the pool is split, and what a spin would mean for your balance. Every
// result is split by each player's share of the pool, which is how the rooms work.
const HOST = 200 // What the host has in the pool
const PLAYERS = 250 // What the other players have in the pool
const OTHERS = HOST + PLAYERS
const MIN = 10
const MAX = 250
const PRESETS = [10, 25, 50, 100, 250]

const SCENARIOS = [
  { key: 'bonus', label: 'Bonus pays $1,000', delta: 1000 },
  { key: 'win', label: 'Spin wins $300', delta: 300 },
  { key: 'loss', label: 'Spin loses $100', delta: -100 },
] as const

type ScenarioKey = (typeof SCENARIOS)[number]['key']

const HYPE = '#1ce479'
const TEAL = '#2dd4d4'

function money(value: number) {
  const abs = Math.abs(value)
  return `$${abs.toLocaleString('en-US', { minimumFractionDigits: abs % 1 ? 2 : 0, maximumFractionDigits: 2 })}`
}

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
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('win')
  const scenario = SCENARIOS.find(s => s.key === scenarioKey)!

  const pool = yours + OTHERS
  const share = yours / pool
  const yourResult = Math.round(scenario.delta * share * 100) / 100

  const sharePct = useTween(share * 100)
  const resultShown = useTween(yourResult)
  const balanceShown = useTween(yours + yourResult)

  const fill = ((yours - MIN) / (MAX - MIN)) * 100
  const RADIUS = 46
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const positive = scenario.delta > 0

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

      <p className="text-base font-bold text-white">Try it: your share of a room</p>
      <p className="mt-0.5 text-xs text-slate-400">
        The host and other players have {money(OTHERS)} in the pool. Choose what you add.
      </p>

      {/* Your share ring + amount */}
      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-[120px] w-[120px] shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke={HYPE}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - sharePct / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black tabular-nums text-white">{sharePct.toFixed(1)}%</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">your share</span>
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

      {/* The pool, split between you, the host and the other players */}
      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-slate-400">The pool</span>
          <span className="font-bold tabular-nums text-white">{money(pool)}</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-white/5">
          <div className="transition-[width] duration-500 ease-out" style={{ width: `${(yours / pool) * 100}%`, background: HYPE }} />
          <div className="transition-[width] duration-500 ease-out" style={{ width: `${(HOST / pool) * 100}%`, background: TEAL }} />
          <div className="flex-1 bg-slate-600" />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          <Legend color={HYPE} label="You" value={money(yours)} />
          <Legend color={TEAL} label="Host" value={money(HOST)} />
          <Legend color="#475569" label="Other players" value={money(PLAYERS)} />
        </div>
      </div>

      {/* What a spin means for you */}
      <div className="mt-6 rounded-xl border border-white/10 bg-surface-950/50 p-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Example spin">
          {SCENARIOS.map(s => (
            <button
              key={s.key}
              type="button"
              onClick={() => setScenarioKey(s.key)}
              aria-pressed={scenarioKey === s.key}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                scenarioKey === s.key
                  ? s.delta > 0
                    ? 'bg-hype text-black'
                    : 'bg-red-500 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-400">Your share of that spin</p>
            <p className={`text-3xl font-black tabular-nums ${positive ? 'text-hype' : 'text-red-400'}`}>
              {positive ? '+' : '−'}
              {money(Math.round(Math.abs(resultShown) * 100) / 100)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Your balance in the room</p>
            <p className="text-3xl font-black tabular-nums text-white">
              <span className="text-lg font-bold text-slate-500">{money(yours)} → </span>
              {money(Math.round(balanceShown * 100) / 100)}
            </p>
          </div>
        </div>
      </div>

      <figcaption className="mt-4 text-xs leading-5 text-slate-400">
        An example with made-up amounts. In a real room, your balance moves with your share of every spin, and you can
        leave between spins.
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
