'use client'

import { useEffect, useRef, useState } from 'react'

// Reveals the children marked with the `reveal-item` class one after another (set the order with
// style={{ transitionDelay }}) the first time the group scrolls into view. Until JavaScript has run,
// and for people who prefer reduced motion, everything is simply visible. Styles are in globals.css.
export function RevealGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'idle' | 'pending' | 'shown'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setState('pending')
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return
        observer.disconnect()
        setState('shown')
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} data-reveal={state} className={className}>
      {children}
    </div>
  )
}
