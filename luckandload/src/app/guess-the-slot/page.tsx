'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { ChevronLeft, ChevronRight, Search, Sparkles } from 'lucide-react'
import { WHEEL_GAMES } from '@/lib/slotWheel'
import { getZoomTransform } from '@/lib/slotPuzzle'
import { formatDate } from '@/lib/utils'

interface PuzzleState {
  date: string
  isToday: boolean
  canGoPrevious: boolean
  canGoNext: boolean
  image: string
  attemptsUsed: number
  maxAttempts: number
  guesses: string[]
  solved: boolean
  pointsAwarded: number
  zoomLevel: number
  answer: { name: string; provider: string } | null
}

export default function GuessTheSlotPage() {
  const { status } = useSession()
  const [state, setState] = useState<PuzzleState | null>(null)
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [shake, setShake] = useState(false)
  const blurTimeout = useRef<ReturnType<typeof setTimeout>>()

  const fetchState = useCallback(async (date?: string) => {
    const res = await fetch(date ? `/api/puzzle?date=${date}` : '/api/puzzle')
    if (!res.ok) return
    setState(await res.json())
  }, [])

  useEffect(() => {
    if (status === 'authenticated' || status === 'unauthenticated') fetchState()
  }, [status, fetchState])

  const gameOver = !!state && (state.solved || state.attemptsUsed >= state.maxAttempts)

  const suggestions = state && !gameOver && query.trim().length > 0
    ? WHEEL_GAMES.filter(g =>
        g.name.toLowerCase().includes(query.trim().toLowerCase()) &&
        !state.guesses.includes(g.name)
      ).slice(0, 6)
    : []

  async function submitGuess(name: string) {
    if (!state || submitting || gameOver) return
    setSubmitting(true)
    setShowDropdown(false)
    try {
      const res = await fetch('/api/puzzle/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: state.date, guess: name }),
      })
      if (!res.ok) return
      const data = await res.json()
      setState(prev => prev ? { ...prev, ...data } : prev)
      setQuery('')
      if (!data.correct) {
        setShake(true)
        setTimeout(() => setShake(false), 400)
      }
    } finally {
      setSubmitting(false)
    }
  }

  function exactMatch() {
    if (!state) return undefined
    const normalized = query.trim().toLowerCase()
    return WHEEL_GAMES.find(g => g.name.toLowerCase() === normalized && !state.guesses.includes(g.name))
  }

  function handleGuessClick() {
    const match = exactMatch()
    if (match) submitGuess(match.name)
  }

  if (status === 'loading' || (status === 'authenticated' && !state)) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </main>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">🎰 Guess the Slot</h1>
          <p className="text-surface-300">Sign in with Discord to play</p>
          <button onClick={() => signIn('discord')}
            className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors">
            Sign in with Discord
          </button>
        </div>
      </main>
    )
  }

  if (!state) return null

  const zoom = getZoomTransform(state.zoomLevel, state.image)
  const hasExactMatch = !!exactMatch()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 bg-gradient-to-b from-surface-900 to-surface-950">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-400">
            <Sparkles size={13} /> Daily Puzzle
          </div>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Guess the Slot</h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Each wrong guess zooms the cover art out a little more.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-10 space-y-5">

        {/* Date nav */}
        <div className="flex items-center justify-between rounded-xl border border-white/8 bg-surface-800 px-3 py-2.5">
          <button
            onClick={() => state.canGoPrevious && fetchState(shiftDate(state.date, -1))}
            disabled={!state.canGoPrevious}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-sm font-semibold text-white">
            {formatDate(state.date)}
            {state.isToday && (
              <span className="ml-2 rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-400">
                Today
              </span>
            )}
          </div>
          <button
            onClick={() => state.canGoNext && fetchState(shiftDate(state.date, 1))}
            disabled={!state.canGoNext}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {!state.isToday && (
          <p className="text-center text-xs text-slate-500">
            Practice mode — past puzzles don't award loads.
          </p>
        )}

        {/* Image */}
        <div className={`relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-surface-800 shadow-xl transition-transform ${shake ? 'animate-shake' : ''}`}>
          {gameOver ? (
            <img
              src={state.image}
              alt={state.answer?.name ?? 'Slot cover'}
              className="w-full h-auto"
            />
          ) : (
            <div className="aspect-square w-full overflow-hidden">
              <img
                src={state.image}
                alt="Mystery slot"
                className="h-full w-full object-cover object-top transition-[filter] duration-300"
                style={{
                  transform: `scale(${zoom.scale})`,
                  transformOrigin: `${zoom.originX}% ${zoom.originY}%`,
                  filter: zoom.filter,
                }}
              />
            </div>
          )}
        </div>

        {/* Attempt dots */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: state.maxAttempts }).map((_, i) => {
            const used = i < state.attemptsUsed
            const isCurrent = i === state.attemptsUsed && !gameOver
            return (
              <div
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  used ? (state.solved && i === state.attemptsUsed - 1 ? 'bg-green-400' : 'bg-red-400/70')
                    : isCurrent ? 'bg-brand-400 ring-2 ring-brand-400/30'
                    : 'bg-surface-600'
                }`}
              />
            )
          })}
        </div>

        {/* Result banner */}
        {gameOver && state.answer && (
          <div className={`rounded-xl border p-4 text-center ${
            state.solved ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'
          }`}>
            <p className={`font-bold ${state.solved ? 'text-green-300' : 'text-red-300'}`}>
              {state.solved ? '🎉 Solved!' : '😔 Out of guesses'}
            </p>
            <p className="mt-1 text-sm text-white">
              {state.answer.name} <span className="text-slate-400">— {state.answer.provider}</span>
            </p>
            {state.solved && state.isToday && state.pointsAwarded > 0 && (
              <p className="mt-1 text-xs font-semibold text-brand-400">+{state.pointsAwarded} loads</p>
            )}
          </div>
        )}

        {/* Guess input */}
        {!gameOver && (
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={e => { setQuery(e.target.value); setShowDropdown(true) }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => { blurTimeout.current = setTimeout(() => setShowDropdown(false), 120) }}
                  onKeyDown={e => { if (e.key === 'Enter' && hasExactMatch) handleGuessClick() }}
                  placeholder="Guess the slot…"
                  disabled={submitting}
                  className="w-full rounded-xl border border-white/10 bg-surface-800 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-brand-500/50 focus:outline-none disabled:opacity-50"
                />
                {showDropdown && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-white/10 bg-surface-800 shadow-xl">
                    {suggestions.map(g => (
                      <button
                        key={g.id}
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => submitGuess(g.name)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/5 transition-colors"
                      >
                        <span>{g.name}</span>
                        <span className="text-xs text-slate-500">{g.provider}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleGuessClick}
                disabled={!hasExactMatch || submitting}
                className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-30 disabled:hover:bg-brand-500 transition-colors"
              >
                Guess
              </button>
            </div>
          </div>
        )}

        {/* Past guesses */}
        {state.guesses.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {state.guesses.map((g, i) => {
              const correct = state.solved && i === state.guesses.length - 1
              return (
                <span
                  key={i}
                  className={`rounded-full border px-2.5 py-1 text-xs ${
                    correct ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/20 bg-red-500/5 text-red-300/80 line-through'
                  }`}
                >
                  {g}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function shiftDate(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().split('T')[0]
}
