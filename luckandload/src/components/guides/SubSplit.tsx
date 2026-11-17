'use client'

import { useState } from 'react'

// Interactive comparison of what a streamer keeps from subscriptions on Kick (95/5, as Kick
// advertises) and Twitch (50/50, Twitch's standard split). A made-up $5 sub, before taxes and
// payment fees. Drag the slider to change the number of subs.
const SUB_PRICE = 5
const KICK_SHARE = 0.95
const TWITCH_SHARE = 0.5

function money(value: number) {
  return `$${Math.round(value).toLocaleString('en-US')}`
}

export function SubSplit() {
  const [subs, setSubs] = useState(100)
  const gross = subs * SUB_PRICE
  const kick = gross * KICK_SHARE
  const twitch = gross * TWITCH_SHARE

  const rows = [
    { name: 'Kick', split: '95/5', value: kick, share: KICK_SHARE, bar: 'bg-[#53fc18]', text: 'text-[#53fc18]' },
    { name: 'Twitch', split: '50/50', value: twitch, share: TWITCH_SHARE, bar: 'bg-[#9146ff]', text: 'text-[#b794ff]' },
  ]

  return (
    <figure className="mb-6 max-w-3xl rounded-2xl border border-white/10 bg-surface-800 p-5 sm:p-6">
      <p className="text-sm font-semibold text-white">Try it: what a streamer keeps from subs</p>
      <p className="mb-4 text-xs text-slate-400">Each sub costs ${SUB_PRICE}. Drag to change how many subs a month.</p>

      <label htmlFor="sub-split-count" className="mb-1 flex items-baseline justify-between text-sm">
        <span className="text-slate-300">Subs a month</span>
        <span className="text-lg font-bold tabular-nums text-white">{subs.toLocaleString('en-US')}</span>
      </label>
      <input
        id="sub-split-count"
        type="range"
        min={10}
        max={1000}
        step={10}
        value={subs}
        onChange={e => setSubs(Number(e.target.value))}
        className="mb-6 w-full accent-[#1ce479]"
      />

      <div className="space-y-4">
        {rows.map(row => (
          <div key={row.name}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="font-semibold text-white">
                {row.name} <span className="font-normal text-slate-500">· {row.split}</span>
              </span>
              <span className={`text-xl font-black tabular-nums ${row.text}`}>{money(row.value)}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${row.bar} transition-all duration-300`} style={{ width: `${row.share * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-hype/30 bg-hype/10 px-4 py-3">
        <span className="text-sm text-slate-300">Extra on Kick, every month</span>
        <span className="text-2xl font-black tabular-nums text-hype">+{money(kick - twitch)}</span>
      </div>
      <figcaption className="mt-3 text-xs leading-5 text-slate-400">
        A made-up example with ${SUB_PRICE} subs, before taxes and payment fees. Kick advertises a 95/5 split; 50/50 is
        Twitch&apos;s standard split, and some larger Twitch partners get more.
      </figcaption>
    </figure>
  )
}
