'use client'

import { useEffect, useRef, useState } from 'react'

// Animated breakdown of review ratings (share of reviews per star level), used in the
// "Is Hype.bet legit?" guide. Works like RtpCostChart: the server renders the finished chart, and
// when it scrolls into view the bars grow one after another and the percentages count up.
export type RatingRow = { stars: number; percent: number; display?: string }

const BAR_MS = 1400
const STAGGER_MS = 160

const COLORS: Record<number, string> = {
  5: 'bg-hype',
  4: 'bg-green-300',
  3: 'bg-amber-300',
  2: 'bg-orange-400',
  1: 'bg-red-400',
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function RatingBreakdown({ title, rows, caption }: { title: string; rows: RatingRow[]; caption: string }) {
  const ref = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState<number[]>(() => rows.map(() => 1))

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setProgress(rows.map(() => 0))
    let frame = 0
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const next = rows.map((_, i) => easeOut(Math.min(1, Math.max(0, (now - start - i * STAGGER_MS) / BAR_MS))))
          setProgress(next)
          if (next.some(p => p < 1)) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [rows])

  return (
    <figure ref={ref} className="mb-6 max-w-3xl rounded-xl border border-white/10 bg-surface-800 p-5">
      <p className="mb-4 text-sm font-semibold text-white">{title}</p>
      <div className="space-y-2.5">
        {rows.map((row, i) => (
          <div key={row.stars} className="grid grid-cols-[4.5rem_1fr_3rem] items-center gap-3 text-sm">
            <span className="text-slate-300">
              {row.stars} star{row.stars === 1 ? '' : 's'}
            </span>
            <span className="h-3 overflow-hidden rounded-full bg-white/5">
              <span
                className={`block h-full rounded-full ${COLORS[row.stars] ?? 'bg-slate-400'}`}
                style={{ width: `${row.percent * progress[i]}%` }}
              />
            </span>
            <span className="text-right font-semibold tabular-nums text-white">
              {progress[i] === 1 && row.display ? row.display : `${Math.round(row.percent * progress[i])}%`}
            </span>
          </div>
        ))}
      </div>
      <figcaption className="mt-4 text-xs leading-5 text-slate-400">{caption}</figcaption>
    </figure>
  )
}
