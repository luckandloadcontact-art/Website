'use client'

import { useEffect, useState } from 'react'
import { Crown } from 'lucide-react'
import { ScaledFrame } from '@/components/overlay/ScaledFrame'
import type { ChatVsScore, ChatVsWinner } from '@/lib/chatVs'

const WIDTH = 460
const HEIGHT = 132
// A new result added in admin shows up on stream within this time.
const REFRESH_MS = 15_000

// Our colours, from the logo: teal for us, gold for Chat, on dark navy with a gold edge.
const TEAL_TEXT = 'bg-gradient-to-b from-white via-[#a5f3f3] to-[#2dd4d4] bg-clip-text text-transparent'
const GOLD_TEXT = 'bg-gradient-to-b from-[#fbf3d0] via-[#e9cf6e] to-[#c9a53c] bg-clip-text text-transparent'

type Tone = 'teal' | 'gold'

const TONES: Record<Tone, { border: string; label: string; crown: string; box: string; number: string }> = {
  teal: {
    border: 'border-[#2dd4d4]',
    label: 'text-[#a5f3f3]',
    crown: 'text-[#2dd4d4]',
    box: 'border-[#2dd4d4] bg-gradient-to-b from-[#0d3b40] to-[#04161a] shadow-[0_0_14px_rgba(45,212,212,0.45),inset_0_0_12px_rgba(45,212,212,0.2)]',
    number: TEAL_TEXT,
  },
  gold: {
    border: 'border-[#d4b33a]',
    label: 'text-[#e9cf6e]',
    crown: 'text-[#e9cf6e]',
    box: 'border-[#d4b33a] bg-gradient-to-b from-[#3a2e0a] to-[#120e03] shadow-[0_0_14px_rgba(212,179,58,0.45),inset_0_0_12px_rgba(212,179,58,0.2)]',
    number: GOLD_TEXT,
  },
}

// Running score for Throwdown Thursday (Chat vs LuckAndLoad), styled like a versus banner: the
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

      {/* The bar, with a gold edge like the logo */}
      <div className="absolute inset-x-0 bottom-0 top-[14px] rounded-[20px] bg-gradient-to-b from-[#f1e2a4] via-[#c9a53c] to-[#7a5f17] p-[2px] shadow-[0_0_22px_rgba(45,212,212,0.25)]">
        <div className="flex h-full w-full items-center justify-between rounded-[18px] bg-gradient-to-b from-[#0b2a30] via-[#071a24] to-[#050e1c] px-2.5 pt-2">
          <Portrait src="/overlay/chatvs-luckandload-v2.jpg" label="LuckAndLoad" width={130} tone="teal" />
          <ScoreBox value={us} leading={leader === 'luckandload'} tone="teal" />
          <span className={`text-[38px] font-black italic leading-none ${GOLD_TEXT} [filter:drop-shadow(0_2px_0_rgba(0,0,0,0.8))_drop-shadow(0_0_10px_rgba(45,212,212,0.45))]`}>
            VS
          </span>
          <ScoreBox value={chat} leading={leader === 'chat'} tone="gold" />
          <Portrait src="/overlay/chatvs-chat-v3.jpg" label="Chat" width={96} tone="gold" />
        </div>
      </div>

      {/* Ribbon on top */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-md bg-gradient-to-b from-[#f1e2a4] to-[#a8852a] p-[1.5px] shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded-[5px] bg-gradient-to-b from-[#127373] to-[#073a3f] px-3.5 py-[3px]">
          <Crown size={11} className="text-[#e9cf6e]" />
          <span className={`text-[12px] font-black uppercase italic tracking-[0.12em] ${GOLD_TEXT}`}>
            Throwdown Thursday
          </span>
          <Crown size={11} className="text-[#e9cf6e]" />
        </div>
      </div>
    </ScaledFrame>
  )
}

function Portrait({ src, label, width, tone }: { src: string; label: string; width: number; tone: Tone }) {
  return (
    <div className={`relative h-[90px] shrink-0 overflow-hidden rounded-xl border-2 ${TONES[tone].border}`} style={{ width }}>
      <img src={src} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050e1c] via-[#050e1c]/75 to-transparent pb-1 pt-4 text-center">
        <span className={`text-[11px] font-black uppercase tracking-wider ${TONES[tone].label}`}>{label}</span>
      </div>
    </div>
  )
}

function ScoreBox({ value, leading, tone }: { value: number; leading: boolean; tone: Tone }) {
  return (
    <div className="relative shrink-0">
      {leading && (
        <Crown
          size={18}
          className={`absolute -top-[15px] left-1/2 -translate-x-1/2 ${TONES[tone].crown} [filter:drop-shadow(0_0_4px_rgba(0,0,0,0.9))]`}
        />
      )}
      <div className={`flex h-[64px] w-[70px] items-center justify-center rounded-xl border-2 ${TONES[tone].box}`}>
        <span
          key={value}
          className={`text-[44px] font-black leading-none tabular-nums ${TONES[tone].number}`}
          style={{ animation: 'chatvs-pop 0.5s ease-out' }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}
