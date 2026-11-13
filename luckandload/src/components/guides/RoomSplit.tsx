'use client'

import { useState } from 'react'

// Interactive explainer for Hype.bet multiplayer rooms: drag the slider to choose how much you add
// to the shared pool, and see your share and what a winning or losing spin would mean for you.
// Every result is split by each player's share of the pool, which is how the rooms work.
const OTHERS = 450 // What the host and the other players have in the pool
const WIN = 300 // Example winning spin for the whole room
const LOSS = 100 // Example losing spin for the whole room

function money(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`
}

export function RoomSplit() {
  const [yours, setYours] = useState(50)
  const pool = yours + OTHERS
  const share = yours / pool
  const sharePct = share * 100

  return (
    <figure className="mb-6 max-w-3xl rounded-xl border border-white/10 bg-surface-800 p-5">
      <p className="text-sm font-semibold text-white">Try it: your share of a room</p>
      <p className="mb-4 text-xs text-slate-400">The host and other players have {money(OTHERS)} in the pool. Drag to choose what you add.</p>

      <label htmlFor="room-split-amount" className="mb-1 flex items-baseline justify-between text-sm">
        <span className="text-slate-300">You add</span>
        <span className="text-lg font-bold tabular-nums text-white">{money(yours)}</span>
      </label>
      <input
        id="room-split-amount"
        type="range"
        min={10}
        max={250}
        step={10}
        value={yours}
        onChange={e => setYours(Number(e.target.value))}
        className="mb-5 w-full accent-[#1ce479]"
      />

      {/* The pool, split by share */}
      <div className="mb-2 flex h-8 overflow-hidden rounded-lg text-xs font-semibold">
        <div
          className="flex items-center justify-center bg-hype text-black transition-all duration-300"
          style={{ width: `${sharePct}%` }}
        >
          {sharePct >= 9 && `You ${sharePct.toFixed(0)}%`}
        </div>
        <div className="flex flex-1 items-center justify-center bg-white/10 text-slate-300 transition-all duration-300">
          Others {(100 - sharePct).toFixed(0)}%
        </div>
      </div>
      <p className="mb-4 text-xs tabular-nums text-slate-400">Pool: {money(pool)}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-hype/30 bg-hype/5 p-3">
          <p className="text-xs text-slate-400">The room wins {money(WIN)}</p>
          <p className="text-xl font-bold tabular-nums text-hype">+{money(Math.round(WIN * share * 100) / 100)}</p>
          <p className="text-xs text-slate-500">your share</p>
        </div>
        <div className="rounded-lg border border-red-400/30 bg-red-500/5 p-3">
          <p className="text-xs text-slate-400">The room loses {money(LOSS)}</p>
          <p className="text-xl font-bold tabular-nums text-red-300">−{money(Math.round(LOSS * share * 100) / 100)}</p>
          <p className="text-xs text-slate-500">your share</p>
        </div>
      </div>
      <figcaption className="mt-4 text-xs leading-5 text-slate-400">
        An example with made-up amounts. In a real room, your balance moves with your share of every spin, and you can
        leave between spins.
      </figcaption>
    </figure>
  )
}
