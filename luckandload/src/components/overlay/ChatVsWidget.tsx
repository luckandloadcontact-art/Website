'use client'

import { useEffect, useState } from 'react'
import { Crown, Flame } from 'lucide-react'
import { ScaledFrame } from '@/components/overlay/ScaledFrame'
import type { ChatVsScore, ChatVsWinner } from '@/lib/chatVs'

const WIDTH = 260
const HEIGHT = 300
// A new result added in admin shows up on stream within this time.
const REFRESH_MS = 15_000

const GOLD_TEXT = 'bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent'

// Running score for Half & Half Thursday (Chat vs LuckAndLoad), for the open space on the right of
// the stream layout. Results are added in the admin panel under "Chat vs L&L".
export function ChatVsWidget() {
  const [score, setScore] = useState<ChatVsScore | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/chat-vs', { cache: 'no-store' })
        if (res.ok && !cancelled) setScore(await res.json())
      } catch {
        // Keep showing the last score we had.
      }
    }
    load()
    const timer = setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  const us = score?.luckandload ?? 0
  const chat = score?.chat ?? 0
  const leader: ChatVsWinner | null = us > chat ? 'luckandload' : chat > us ? 'chat' : null
  // Oldest on the left, newest on the right, like a timeline.
  const recent = [...(score?.recent ?? [])].reverse()

  return (
    <ScaledFrame width={WIDTH} height={HEIGHT}>
      <style>{'@keyframes chatvs-pop{0%{transform:scale(1.35)}100%{transform:scale(1)}}'}</style>
      <div className="flex h-full w-full flex-col rounded-2xl border-2 border-amber-400/40 bg-gradient-to-b from-[#1d160c] via-[#120f0c] to-[#0b0a10] px-4 pb-4 pt-3.5 shadow-[0_0_24px_rgba(251,191,36,0.15)]">
        <p className="text-center text-[11px] font-black uppercase tracking-[0.2em] text-amber-300/90">
          Half &amp; Half Thursday
        </p>
        <p className={`mt-0.5 text-center text-[19px] font-black uppercase leading-tight tracking-wide ${GOLD_TEXT}`}>
          Chat vs LuckAndLoad
        </p>

        <div className="mt-4 flex flex-1 items-center justify-between">
          <Side label="LuckAndLoad" value={us} leading={leader === 'luckandload'} tone="gold" />
          <span className="pb-6 text-[26px] font-black italic text-red-500 [text-shadow:0_0_12px_rgba(239,68,68,0.6)]">
            VS
          </span>
          <Side label="Chat" value={chat} leading={leader === 'chat'} tone="red" />
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{recent.length > 0 ? `Last ${recent.length}` : 'Results'}</span>
          <div className="flex gap-1.5">
            {recent.length === 0 ? (
              <span className="text-[11px] font-semibold text-slate-500">First battle this Thursday</span>
            ) : (
              recent.map(result => (
                <span
                  key={result.id}
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${
                    result.winner === 'luckandload'
                      ? 'bg-amber-400 text-[#1d160c]'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {result.winner === 'luckandload' ? 'L' : 'C'}
                </span>
              ))
            )}
          </div>
        </div>

        {score?.streak && score.streak.count >= 2 && (
          <p className="mt-2.5 flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wide text-orange-300">
            <Flame size={13} className="text-orange-400" />
            {score.streak.winner === 'luckandload' ? 'LuckAndLoad' : 'Chat'} won {score.streak.count} in a row
          </p>
        )}
      </div>
    </ScaledFrame>
  )
}

function Side({ label, value, leading, tone }: { label: string; value: number; leading: boolean; tone: 'gold' | 'red' }) {
  return (
    <div className="flex w-[92px] flex-col items-center">
      <Crown size={18} className={leading ? (tone === 'gold' ? 'text-amber-300' : 'text-red-400') : 'invisible'} />
      <span
        key={value}
        className={`text-[58px] font-black leading-none tabular-nums ${
          tone === 'gold' ? GOLD_TEXT : 'text-red-500 [text-shadow:0_0_14px_rgba(239,68,68,0.45)]'
        }`}
        style={{ animation: 'chatvs-pop 0.5s ease-out' }}
      >
        {value}
      </span>
      <span className={`mt-1.5 text-[12px] font-black uppercase tracking-wider ${tone === 'gold' ? 'text-amber-200' : 'text-red-300'}`}>
        {label}
      </span>
    </div>
  )
}
