'use client'

import { useEffect, useRef, useState } from 'react'
import { Ban } from 'lucide-react'
import { ScaledFrame } from '@/components/overlay/ScaledFrame'
import { EMPTY_WORD_BAN, formatWordBanTime, type WordBanResponse, type WordBanState } from '@/lib/wordBan'

const WIDTH = 300
const HEIGHT = 124
// How often we check whether the timer was started or stopped in admin.
const POLL_MS = 2_000
// The timer turns red and pulses for the last stretch.
const WARNING_MS = 30_000

// Word Ban timer for the stream, in the same style as the Chat vs widget (navy, gold edge, teal).
// Started and stopped in the admin panel under "Word ban".
export function WordBanWidget() {
  const [state, setState] = useState<WordBanState>(EMPTY_WORD_BAN)
  const [now, setNow] = useState(() => Date.now())
  // Server time minus this PC's time, so a clock that is a bit off doesn't skew the countdown.
  const offset = useRef(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/word-ban', { cache: 'no-store' })
        if (!res.ok || cancelled) return
        const data: WordBanResponse = await res.json()
        offset.current = Date.parse(data.serverNow) - Date.now()
        setState({ endsAt: data.endsAt, durationSec: data.durationSec, word: data.word })
      } catch {
        // Keep the last state; the countdown keeps running locally.
      }
    }
    load()
    const poll = setInterval(load, POLL_MS)
    const tick = setInterval(() => setNow(Date.now()), 200)
    return () => {
      cancelled = true
      clearInterval(poll)
      clearInterval(tick)
    }
  }, [])

  const running = state.endsAt !== null
  const remaining = running ? Date.parse(state.endsAt!) - (now + offset.current) : state.durationSec * 1000
  const finished = running && remaining <= 0
  const warning = running && !finished && remaining <= WARNING_MS

  return (
    <ScaledFrame width={WIDTH} height={HEIGHT}>
      <style>
        {'@keyframes wordban-pulse{0%,100%{opacity:1}50%{opacity:.55}}' +
          '@keyframes wordban-flash{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}'}
      </style>

      {/* The box, with a gold edge like the logo */}
      <div className="absolute inset-x-0 bottom-0 top-[14px] rounded-[20px] bg-gradient-to-b from-[#f1e2a4] via-[#c9a53c] to-[#7a5f17] p-[2px] shadow-[0_0_22px_rgba(45,212,212,0.25)]">
        <div
          className={`flex h-full w-full flex-col items-center justify-center rounded-[18px] pt-3 transition-colors ${
            warning || finished
              ? 'bg-gradient-to-b from-[#3a0a0d] via-[#1c070a] to-[#0c0306]'
              : 'bg-gradient-to-b from-[#0b2a30] via-[#071a24] to-[#050e1c]'
          }`}
        >
          {finished ? (
            <span
              className="text-[38px] font-black uppercase leading-none tracking-wide text-red-400 [text-shadow:0_0_14px_rgba(239,68,68,0.7)]"
              style={{ animation: 'wordban-flash 0.9s ease-in-out infinite' }}
            >
              Time&apos;s up
            </span>
          ) : (
            <span
              className={`text-[56px] font-black leading-none tabular-nums ${
                warning
                  ? 'text-red-400 [text-shadow:0_0_14px_rgba(239,68,68,0.6)]'
                  : running
                    ? 'bg-gradient-to-b from-white via-[#a5f3f3] to-[#2dd4d4] bg-clip-text text-transparent'
                    : 'text-slate-400'
              }`}
              style={warning ? { animation: 'wordban-pulse 1s ease-in-out infinite' } : undefined}
            >
              {formatWordBanTime(remaining)}
            </span>
          )}
          {state.word && (
            <span className="mt-1.5 max-w-[260px] truncate text-[12px] font-bold uppercase tracking-wider text-slate-300">
              Banned: <span className="text-[#fbe7a1]">{state.word}</span>
            </span>
          )}
        </div>
      </div>

      {/* Ribbon on top */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-md bg-gradient-to-b from-[#f1e2a4] to-[#a8852a] p-[1.5px] shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded-[5px] bg-gradient-to-b from-[#7f1d1d] to-[#2a0707] px-4 py-[2px]">
          <Ban size={14} strokeWidth={2.75} className="text-red-300" />
          <span className="text-[15px] font-black uppercase tracking-[0.1em] text-[#fbe7a1] [text-shadow:0_1px_0_#000,1px_0_0_#000,-1px_0_0_#000,0_-1px_0_#000,0_0_8px_rgba(0,0,0,0.9)]">
            Word ban
          </span>
          <Ban size={14} strokeWidth={2.75} className="text-red-300" />
        </div>
      </div>
    </ScaledFrame>
  )
}
