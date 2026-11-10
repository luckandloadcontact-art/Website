'use client'

import { useEffect, useRef, useState } from 'react'

// Bar chart of what the same session costs on different RTP versions of a slot. Used in the RTP guide
// and on the Hype.bet review. Bars are scaled to the most expensive row; the first row is drawn green,
// the last red and anything between amber.
//
// When the chart scrolls into view the bars grow one after another while the amounts count up, and
// then a note shows how many times more the lowest version costs. The server renders the finished
// chart, so it reads fine without JavaScript and for people who prefer reduced motion.
export type RtpCostRow = { rtp: string; label?: string; cost: number }

const BAR_MS = 1000
const STAGGER_MS = 140

function formatCost(value: number, decimals: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function RtpCostChart({ title, rows, caption }: { title: string; rows: RtpCostRow[]; caption: string }) {
  const max = Math.max(...rows.map(row => row.cost))
  const ratio = rows[rows.length - 1].cost / rows[0].cost
  const decimals = rows.some(row => row.cost % 1) ? 2 : 0

  const ref = useRef<HTMLElement>(null)
  // Progress per row from 0 to 1. Starts finished, so the server HTML shows the real chart.
  const [progress, setProgress] = useState<number[]>(() => rows.map(() => 1))
  const done = progress.every(p => p === 1)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Reset before the chart is seen. It sits below the fold, so the reset itself is never visible.
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
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <p className="text-sm font-semibold text-white">{title}</p>
        <span
          className={`rounded-md bg-red-400/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-red-300 transition-all duration-500 ${
            done ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
          }`}
        >
          {ratio.toFixed(1)}× the cost on the lowest version
        </span>
      </div>
      <div className="space-y-3">
        {rows.map((row, i) => {
          const color = i === 0 ? 'bg-hype' : i === rows.length - 1 ? 'bg-red-400' : 'bg-amber-400'
          return (
            <div key={row.rtp} className="grid grid-cols-[6.5rem_1fr_4.5rem] items-center gap-3 text-sm">
              <span className="tabular-nums text-slate-300">
                {row.rtp}
                {row.label && <span className="block text-xs text-slate-400">{row.label}</span>}
              </span>
              <span className="h-3 overflow-hidden rounded-full bg-white/5">
                <span
                  className={`block h-full rounded-full ${color}`}
                  style={{ width: `${(row.cost / max) * 100 * progress[i]}%` }}
                />
              </span>
              <span className="text-right font-semibold tabular-nums text-white">
                {formatCost(row.cost * progress[i], decimals)}
              </span>
            </div>
          )
        })}
      </div>
      <figcaption className="mt-4 text-xs leading-5 text-slate-400">{caption}</figcaption>
    </figure>
  )
}
