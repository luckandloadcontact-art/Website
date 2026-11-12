'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowUp, BookOpen, MessageSquare, Send, Users, Zap } from 'lucide-react'
import type { LeaderboardEntry } from '@/lib/affilka'
import { hypeTimeEnd } from '@/lib/stream'
import { cn, formatXP } from '@/lib/utils'
import { ScaledFrame } from '@/components/overlay/ScaledFrame'

// Designed at 480x320 and scaled to whatever size OBS gives the browser source.
const WIDTH = 480
const HEIGHT = 320
const SLIDE_MS = 8_000
const ROOM_SLIDE_MS = 11_000 // The room explainer has more text to read
const REFRESH_MS = 5 * 60_000 // New leaderboard numbers every 5 minutes

const RANK_COLORS = ['bg-yellow-400 text-black', 'bg-slate-300 text-black', 'bg-amber-600 text-black']

function useCountdown(end: Date) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(timer)
  }, [])
  const minutes = Math.max(0, Math.floor((end.getTime() - now) / 60_000))
  return { days: Math.floor(minutes / 1440), hours: Math.floor((minutes % 1440) / 60), minutes: minutes % 60 }
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-block rounded-full px-3 py-1 text-[13px] font-black uppercase tracking-wider', className)}>
      {children}
    </span>
  )
}

function LeaderboardSlide({ entries, periodFrom }: { entries: LeaderboardEntry[]; periodFrom: string | null }) {
  const month = periodFrom
    ? new Date(`${periodFrom}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
    : 'Monthly'
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <Label className="bg-brand-500/20 text-brand-300">{month} leaderboard</Label>
        <span className="text-[15px] font-black text-hype">$1,000 prizes</span>
      </div>
      {entries.length > 0 ? (
        <ol className="flex flex-1 flex-col justify-between">
          {entries.map(entry => (
            <li key={entry.rank} className="flex items-center gap-3 rounded-lg bg-white/[0.04] px-3 py-1.5">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px] font-black',
                  RANK_COLORS[entry.rank - 1] ?? 'bg-white/10 text-white'
                )}
              >
                {entry.rank}
              </span>
              <span className="min-w-0 flex-1 truncate text-[17px] font-bold text-white">{entry.username}</span>
              <span className="text-[14px] tabular-nums text-slate-400">{formatXP(entry.xpPoints)} XP</span>
              <span className="w-14 text-right text-[17px] font-black tabular-nums text-hype">
                {entry.prize ? `$${entry.prize}` : ''}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="flex flex-1 items-center text-[20px] font-bold text-white">
          Play under code LuckAndLoad to get on the board!
        </p>
      )}
    </div>
  )
}

function RolexSlide() {
  const left = useCountdown(hypeTimeEnd())
  return (
    <div className="flex h-full items-center gap-2">
      <div className="flex-1">
        <Label className="bg-yellow-400/20 text-yellow-300">Hype Time</Label>
        <p className="mt-3 text-[34px] font-black leading-none text-white">
          WIN A <span className="text-yellow-400">ROLEX</span>
        </p>
        <p className="mt-1 text-[26px] font-black leading-tight text-white">+ $25,000 CASH</p>
        <ul className="mt-3 space-y-1 text-[16px] font-semibold text-slate-200">
          <li>🎟️ 1,000 XP = 1 ticket</li>
          <li>⚡ 2x XP in multiplayer rooms</li>
        </ul>
        <p className="mt-3 text-[15px] font-bold text-slate-400">
          Ends in{' '}
          <span className="text-white" suppressHydrationWarning>
            {left.days}d {left.hours}h {left.minutes}m
          </span>
        </p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/overlay/rolex-watch.png" alt="" className="h-[250px] w-auto shrink-0 rounded-2xl object-cover" />
    </div>
  )
}

// Sits right under the room's player list on stream, so the arrow points up at the names.
function RoomSlide() {
  return (
    <div className="flex h-full flex-col items-center text-center">
      <ArrowUp size={34} strokeWidth={3} className="animate-bounce text-indigo-300" />
      <Label className="mt-1 flex items-center gap-1.5 bg-indigo-400/15 text-indigo-200">
        <Users size={14} strokeWidth={3} />
        Who are these players?
      </Label>
      <p className="mt-3 text-[30px] font-black leading-[1.05] text-white">
        THEY&apos;RE PLAYING{' '}
        <span className="bg-gradient-to-r from-indigo-300 to-hype bg-clip-text text-transparent">WITH US</span>. LIVE.
      </p>
      <p className="mt-3 text-[17px] font-semibold leading-snug text-slate-300">
        Everyone above is in our live multiplayer room. Join or leave between spins.
      </p>
      <p className="mt-auto flex items-center gap-2 text-[15px] font-black uppercase tracking-wider text-white">
        <span className="flex -space-x-2">
          {['bg-hype', 'bg-indigo-400', 'bg-yellow-400'].map(color => (
            <span key={color} className={cn('h-5 w-5 rounded-full border-2 border-[#12152f]', color)} />
          ))}
        </span>
        <ArrowRight size={16} strokeWidth={3} className="text-hype" />
        One room. Every spin shared.
      </p>
    </div>
  )
}

const JOIN_KEYFRAMES = `
@keyframes join-glow{0%,100%{opacity:.25;transform:translate(-50%,-50%) scale(.95)}50%{opacity:.45;transform:translate(-50%,-50%) scale(1.05)}}
@keyframes join-type{0%,8%{width:0}45%,100%{width:5ch}}
@keyframes join-caret{50%{opacity:0}}
@keyframes join-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.5);opacity:0}}
`

function JoinSlide() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center text-center">
      <style>{JOIN_KEYFRAMES}</style>

      {/* Soft glow behind the chat box, edge to edge behind the slide */}
      <div className="pointer-events-none absolute -inset-x-5 -bottom-7 -top-5 overflow-hidden">
        <div
          className="absolute left-1/2 top-[55%] h-64 w-64 rounded-full bg-hype/30 blur-3xl"
          style={{ animation: 'join-glow 5s ease-in-out infinite' }}
        />
      </div>

      <div className="relative flex flex-col items-center">
        <Label className="flex items-center gap-2 bg-hype/15 text-hype">
          <span className="h-2 w-2 rounded-full bg-hype" />
          Multiplayer room
        </Label>

        <p className="mt-3 text-[38px] font-black leading-none text-white">
          JOIN THE <span className="text-hype">ACTION</span>
        </p>

        <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.2em] text-slate-400">Type in chat</p>
        <div className="mt-1.5 flex w-[300px] items-center gap-3 rounded-2xl border border-hype/40 bg-black/40 py-2.5 pl-4 pr-2.5 shadow-[0_0_24px_rgba(28,228,121,0.18)]">
          <MessageSquare size={20} className="shrink-0 text-slate-500" />
          <span className="flex flex-1 items-center">
            <span
              className="inline-block overflow-hidden whitespace-nowrap font-mono text-[34px] font-black leading-none text-hype"
              style={{ animation: 'join-type 3.2s steps(5) infinite' }}
            >
              !hype
            </span>
            <span
              className="ml-0.5 inline-block h-8 w-[3px] rounded bg-hype"
              style={{ animation: 'join-caret 0.8s steps(1) infinite' }}
            />
          </span>
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
            <span className="absolute inset-0 rounded-xl bg-hype" style={{ animation: 'join-ring 2.4s ease-out infinite' }} />
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-hype text-black">
              <Send size={18} strokeWidth={2.5} />
            </span>
          </span>
        </div>

        <div className="mt-3 flex gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[14px] font-bold text-white">
            <Users size={15} className="text-indigo-300" />
            Play in our room
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-hype/30 bg-hype/10 px-3 py-1.5 text-[14px] font-bold text-hype">
            <Zap size={15} className="fill-hype" />
            2x XP on slots
          </span>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[14px] font-semibold text-slate-400">
          <BookOpen size={15} className="text-slate-500" />
          Claim the Hype.bet bonus: <span className="font-bold text-white">luckandloadtv.com/hype</span>
        </p>
      </div>
    </div>
  )
}

function OfferSlide({ headline, banner }: { headline: string; banner: string | null }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      {banner ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={banner} alt="" className="w-full rounded-xl" />
      ) : (
        <p className="text-[34px] font-black text-white">{headline}</p>
      )}
      <p className="mt-3 text-[17px] font-bold text-white">
        Code <span className="text-hype">LuckAndLoad</span> · type <span className="text-hype">!hype</span> · 18+
      </p>
    </div>
  )
}

export function StreamWidget({
  entries,
  periodFrom,
  offer,
}: {
  entries: LeaderboardEntry[]
  periodFrom: string | null
  offer: { headline: string; banner: string | null } | null
}) {
  const router = useRouter()
  const [active, setActive] = useState(0)

  const slides: { node: React.ReactNode; ms: number }[] = [
    { node: <LeaderboardSlide entries={entries} periodFrom={periodFrom} />, ms: SLIDE_MS },
    { node: <RolexSlide />, ms: SLIDE_MS },
    { node: <RoomSlide />, ms: ROOM_SLIDE_MS },
    { node: <JoinSlide />, ms: SLIDE_MS },
    ...(offer ? [{ node: <OfferSlide headline={offer.headline} banner={offer.banner} />, ms: SLIDE_MS }] : []),
  ]

  const current = active % slides.length
  const currentMs = slides[current].ms

  useEffect(() => {
    const timer = setTimeout(() => setActive(index => (index + 1) % slides.length), currentMs)
    return () => clearTimeout(timer)
  }, [active, currentMs, slides.length])

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), REFRESH_MS)
    return () => clearInterval(timer)
  }, [router])

  return (
    <ScaledFrame width={WIDTH} height={HEIGHT}>
      <style>{'@keyframes overlay-progress{from{width:0}to{width:100%}}'}</style>
      <div className="relative h-full w-full overflow-hidden rounded-[22px] border-2 border-indigo-400/40 bg-gradient-to-br from-[#161a3a] to-[#0a0c1d]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              'absolute inset-0 px-5 pb-7 pt-5 transition-opacity duration-700',
              index === current ? 'opacity-100' : 'opacity-0'
            )}
          >
            {slide.node}
          </div>
        ))}
        <div className="absolute inset-x-5 bottom-3 flex gap-1.5">
          {slides.map((_, index) => (
            <div key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              {index === current && (
                <div
                  key={`${current}-${active}`}
                  className="h-full rounded-full bg-hype"
                  style={{ animation: `overlay-progress ${currentMs}ms linear forwards` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </ScaledFrame>
  )
}
