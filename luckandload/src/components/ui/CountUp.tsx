'use client'

import { useEffect, useRef, useState } from 'react'

// Counts a number up from 0 the first time it scrolls into view. The server renders the final
// number, so it reads fine without JavaScript and for people who prefer reduced motion.
export function CountUp({ value, prefix = '', suffix = '', durationMs = 1200 }: {
  value: number
  prefix?: string
  suffix?: string
  durationMs?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [current, setCurrent] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setCurrent(0)
    let frame = 0
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs)
          setCurrent(Math.round(value * (1 - Math.pow(1 - t, 3))))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, durationMs])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {current.toLocaleString('en-US')}
      {suffix}
    </span>
  )
}
