'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

// A small, made-up bonus hunt that "opens" itself when it scrolls into view: the bonuses are
// revealed one by one, and a marker shows the running average against break-even, the way chat
// follows it on stream. The server renders the finished hunt, so it reads fine without JavaScript
// and for people who prefer reduced motion.
const BET = 1
const BREAK_EVEN = 35
const COST = 280 // 8 bonuses at $1 need 35x on average: 8 x $1 x 35 = $280
const SCALE_MAX = 60 // The average track runs from 0x to 60x
const STEP_MS = 900

const BONUSES = [
  { slot: 'Wanted Dead or a Wild', multi: 12 },
  { slot: 'Le Bandit', multi: 48 },
  { slot: 'Mental', multi: 7 },
  { slot: 'Sugar Rush 1000', multi: 120 },
  { slot: 'Duck Hunters', multi: 22 },
  { slot: 'Big Bamboo', multi: 15 },
  { slot: 'RIP City', multi: 3 },
  { slot: 'Zeus vs Hades', multi: 61 },
]

export function HuntOpening() {
  const ref = useRef<HTMLElement>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [opened, setOpened] = useState(BONUSES.length)

  const play = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    setOpened(0)
    timer.current = setInterval(() => {
      setOpened(n => {
        if (n + 1 >= BONUSES.length && timer.current) clearInterval(timer.current)
        return Math.min(n + 1, BONUSES.length)
      })
    }, STEP_MS)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setOpened(0)
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return
        observer.disconnect()
        play()
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (timer.current) clearInterval(timer.current)
    }
  }, [play])

  const done = opened === BONUSES.length
  const paid = BONUSES.slice(0, opened).reduce((sum, b) => sum + b.multi * BET, 0)
  const average = opened ? paid / (opened * BET) : 0
  const above = average >= BREAK_EVEN
  const result = paid - COST

  return (
    <figure ref={ref} className="mb-6 max-w-3xl rounded-xl border border-white/10 bg-surface-800 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Watch a hunt open</p>
          <p className="text-xs text-slate-400">8 bonuses at $1, hunt cost $280, break-even {BREAK_EVEN}x</p>
        </div>
        <button
          type="button"
          onClick={play}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-300 transition-colors hover:border-white/20 hover:text-white"
        >
          <RotateCcw size={12} />
          Open again
        </button>
      </div>

      {/* Running average against break-even */}
      <div className="mb-5">
        <div className="mb-1.5 flex items-baseline justify-between text-xs">
          <span className="text-slate-400">Current average</span>
          <span className={cn('text-base font-bold tabular-nums', opened === 0 ? 'text-slate-500' : above ? 'text-hype' : 'text-red-300')}>
            {opened === 0 ? '–' : `${average.toFixed(1)}x`}
          </span>
        </div>
        <div className="relative h-3 rounded-full bg-white/5">
          <span
            className={cn('absolute inset-y-0 left-0 rounded-full transition-all duration-500', above ? 'bg-hype/70' : 'bg-red-400/70')}
            style={{ width: `${Math.min(100, (average / SCALE_MAX) * 100)}%` }}
          />
          {/* Break-even line */}
          <span className="absolute -top-1 -bottom-1 w-0.5 bg-white" style={{ left: `${(BREAK_EVEN / SCALE_MAX) * 100}%` }} />
        </div>
        <div className="relative mt-1 h-4 text-[10px] text-slate-500">
          <span className="absolute left-0">0x</span>
          <span className="absolute -translate-x-1/2 text-white" style={{ left: `${(BREAK_EVEN / SCALE_MAX) * 100}%` }}>
            BE {BREAK_EVEN}x
          </span>
          <span className="absolute right-0">{SCALE_MAX}x+</span>
        </div>
      </div>

      {/* The bonuses */}
      <ol className="grid gap-2 sm:grid-cols-2">
        {BONUSES.map((bonus, i) => {
          const isOpen = i < opened
          const isLatest = i === opened - 1 && !done
          return (
            <li
              key={bonus.slot}
              className={cn(
                'flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition-all duration-300',
                isOpen ? 'border-white/10 bg-surface-900' : 'border-dashed border-white/10 bg-transparent',
                isLatest && 'border-gold-500/50'
              )}
            >
              <span className={cn('truncate', isOpen ? 'text-slate-200' : 'text-slate-500')}>{bonus.slot}</span>
              <span
                className={cn(
                  'shrink-0 font-bold tabular-nums transition-all duration-300',
                  !isOpen && 'text-slate-600',
                  isOpen && (bonus.multi >= BREAK_EVEN ? 'text-hype' : 'text-slate-300'),
                  isLatest && 'scale-110'
                )}
              >
                {isOpen ? `${bonus.multi}x` : '?'}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-sm">
        <span className="tabular-nums text-slate-400">
          Paid so far: <span className="font-semibold text-white">${paid}</span> of ${COST}
        </span>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums transition-opacity duration-500',
            result >= 0 ? 'bg-hype/10 text-hype' : 'bg-red-500/10 text-red-300',
            done ? 'opacity-100' : 'opacity-0'
          )}
        >
          {result >= 0 ? `Profit: +$${result}` : `Loss: -$${Math.abs(result)}`}
        </span>
      </div>
      <figcaption className="mt-3 text-xs leading-5 text-slate-400">
        A made-up hunt. The average swings around break-even, and the very last bonus decides the result.
      </figcaption>
    </figure>
  )
}
