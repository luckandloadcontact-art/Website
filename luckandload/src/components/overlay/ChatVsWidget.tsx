'use client'

import { useEffect, useState } from 'react'
import { Crown } from 'lucide-react'
import { ScaledFrame } from '@/components/overlay/ScaledFrame'
import type { ChatVsScore, ChatVsWinner } from '@/lib/chatVs'

const WIDTH = 460
const HEIGHT = 132
// A new result added in admin shows up on stream within this time.
const REFRESH_MS = 15_000

const GOLD_TEXT = 'bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent'

// Running score for Half & Half Thursday (Chat vs LuckAndLoad), styled like a versus banner: the
// two of us on the left, "Chat" on the right (characters from the Chat vs LuckAndLoad thumbnail).
// Results are added in the admin panel under "Chat vs L&L".
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

  return (
    <ScaledFrame width={WIDTH} height={HEIGHT}>
      <style>{'@keyframes chatvs-pop{0%{transform:scale(1.4)}100%{transform:scale(1)}}'}</style>

      {/* The bar, with a gold edge */}
      <div className="absolute inset-x-0 bottom-0 top-[14px] rounded-[20px] bg-gradient-to-b from-amber-200 via-amber-500 to-amber-800 p-[2px] shadow-[0_0_22px_rgba(251,191,36,0.3)]">
        <div className="flex h-full w-full items-center justify-between rounded-[18px] bg-gradient-to-b from-[#241a0b] via-[#130e08] to-[#0a0806] px-2.5 pt-2">
          <Portrait src="/overlay/chatvs-luckandload.jpg" label="LuckAndLoad" width={118} tone="gold" />
          <ScoreBox value={us} leading={leader === 'luckandload'} tone="gold" />
          <span className="bg-gradient-to-b from-yellow-100 via-amber-400 to-red-600 bg-clip-text text-[38px] font-black italic leading-none text-transparent [filter:drop-shadow(0_2px_0_rgba(0,0,0,0.8))_drop-shadow(0_0_10px_rgba(239,68,68,0.5))]">
            VS
          </span>
          <ScoreBox value={chat} leading={leader === 'chat'} tone="red" />
          <Portrait src="/overlay/chatvs-chat.jpg" label="Chat" width={82} tone="red" />
        </div>
      </div>

      {/* Ribbon on top */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-md bg-gradient-to-b from-amber-200 to-amber-600 p-[1.5px] shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded-[5px] bg-gradient-to-b from-[#7f1d1d] to-[#2a0707] px-3.5 py-[3px]">
          <Crown size={11} className="text-amber-300" />
          <span className={`text-[12px] font-black uppercase italic tracking-[0.12em] ${GOLD_TEXT}`}>
            Half &amp; Half Thursday
          </span>
          <Crown size={11} className="text-amber-300" />
        </div>
      </div>
    </ScaledFrame>
  )
}

function Portrait({ src, label, width, tone }: { src: string; label: string; width: number; tone: 'gold' | 'red' }) {
  return (
    <div
      className={`relative h-[90px] shrink-0 overflow-hidden rounded-xl border-2 ${
        tone === 'gold' ? 'border-amber-400' : 'border-red-500'
      }`}
      style={{ width }}
    >
      <img src={src} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pb-1 pt-4 text-center">
        <span
          className={`text-[11px] font-black uppercase tracking-wider ${tone === 'gold' ? 'text-amber-300' : 'text-red-400'}`}
        >
          {label}
        </span>
      </div>
    </div>
  )
}

function ScoreBox({ value, leading, tone }: { value: number; leading: boolean; tone: 'gold' | 'red' }) {
  const gold = tone === 'gold'
  return (
    <div className="relative shrink-0">
      {leading && (
        <Crown
          size={18}
          className={`absolute -top-[15px] left-1/2 -translate-x-1/2 ${gold ? 'text-amber-300' : 'text-red-400'} [filter:drop-shadow(0_0_4px_rgba(0,0,0,0.9))]`}
        />
      )}
      <div
        className={`flex h-[64px] w-[70px] items-center justify-center rounded-xl border-2 ${
          gold
            ? 'border-amber-300 bg-gradient-to-b from-[#3a2806] to-[#120c03] shadow-[0_0_14px_rgba(251,191,36,0.45),inset_0_0_12px_rgba(251,191,36,0.2)]'
            : 'border-red-500 bg-gradient-to-b from-[#3a0a0a] to-[#120303] shadow-[0_0_14px_rgba(239,68,68,0.45),inset_0_0_12px_rgba(239,68,68,0.2)]'
        }`}
      >
        <span
          key={value}
          className={`text-[44px] font-black leading-none tabular-nums ${
            gold ? GOLD_TEXT : 'text-red-400 [text-shadow:0_0_12px_rgba(239,68,68,0.6)]'
          }`}
          style={{ animation: 'chatvs-pop 0.5s ease-out' }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}
