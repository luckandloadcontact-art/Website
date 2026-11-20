'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Ticket, X } from 'lucide-react'

// Small card in the bottom right corner of the home page about the monthly $100 draw for new
// players. Once closed (or clicked), it stays hidden in that browser for a few days.
const STORAGE_KEY = 'draw-popup-dismissed-at'
const HIDE_FOR_MS = 3 * 24 * 60 * 60 * 1000
const SHOW_AFTER_MS = 2500

function wasDismissedRecently() {
  try {
    const at = Number(localStorage.getItem(STORAGE_KEY))
    return at > 0 && Date.now() - at < HIDE_FOR_MS
  } catch {
    return false
  }
}

function rememberDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    // Private mode or blocked storage: it just shows again next time.
  }
}

export function DrawPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (wasDismissedRecently()) return
    const timer = setTimeout(() => setVisible(true), SHOW_AFTER_MS)
    return () => clearTimeout(timer)
  }, [])

  function close() {
    rememberDismissed()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Monthly $100 draw"
      className="fixed bottom-4 right-4 z-50 w-[320px] max-w-[calc(100vw-2rem)] animate-[draw-popup-in_0.4s_ease-out] rounded-2xl border border-hype/40 bg-surface-800/95 p-4 shadow-2xl shadow-black/50 backdrop-blur"
    >
      <style>{'@keyframes draw-popup-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}'}</style>
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-2.5 top-2.5 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        <X size={16} />
      </button>
      <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-hype">
        <Ticket size={13} /> New Hype.bet players
      </p>
      <p className="mt-1.5 text-lg font-black leading-tight text-white">
        Enter our <span className="text-brand-400">$100</span> monthly draw
      </p>
      <p className="mt-1 pr-2 text-sm leading-5 text-slate-300">
        Sign up through our link, make your first deposit and earn 100 XP. Refer the winner and get $25.
      </p>
      <div className="mt-3 flex items-center gap-3">
        <Link
          href="/draw"
          onClick={rememberDismissed}
          className="rounded-lg bg-hype px-4 py-2 text-sm font-bold text-surface-950 transition-colors hover:bg-hype/85"
        >
          Learn more
        </Link>
        <span className="text-[11px] text-slate-500">18+ · T&amp;Cs apply</span>
      </div>
    </div>
  )
}
