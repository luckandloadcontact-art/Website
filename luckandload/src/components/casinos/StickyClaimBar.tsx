'use client'
import { useEffect, useState } from 'react'

// Slim claim button fixed to the bottom of the screen on mobile. Shows once the offer box at the
// top (targetId) has scrolled out of view, so it never sits on top of the box's own button.
export function StickyClaimBar({
  targetId,
  href,
  headline,
  label,
}: {
  targetId: string
  href: string
  headline: string
  label: string
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-hype/30 bg-surface-950/95 px-4 py-3 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{headline}</p>
          <p className="text-[11px] text-slate-500">18+ · T&amp;Cs apply</p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="shrink-0 rounded-lg bg-hype px-5 py-2.5 text-sm font-black uppercase tracking-wide text-black"
        >
          {label}
        </a>
      </div>
    </div>
  )
}
