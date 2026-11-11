'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { Lightbulb, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MAX_PENDING_SUGGESTIONS, type SlotSuggestion } from '@/lib/slotSuggestions'


const STATUS_STYLE: Record<SlotSuggestion['status'], { label: string; className: string }> = {
  pending: { label: 'Waiting', className: 'bg-white/5 text-slate-300' },
  approved: { label: 'Approved', className: 'bg-hype/10 text-hype' },
  declined: { label: 'Declined', className: 'bg-red-500/10 text-red-300' },
}

// "Suggest a game" box under the Slot Wheel. Signed-in players (Discord) can suggest up to
// MAX_PENDING_SUGGESTIONS games at a time; we approve or decline them in the admin panel.
export function SuggestGame() {
  const { status } = useSession()
  const [suggestions, setSuggestions] = useState<SlotSuggestion[]>([])
  const [gameName, setGameName] = useState('')
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const pending = suggestions.filter(s => s.status === 'pending').length
  const atLimit = pending >= MAX_PENDING_SUGGESTIONS

  const load = useCallback(async () => {
    const res = await fetch('/api/slot-suggestions')
    if (res.ok) setSuggestions((await res.json()).suggestions)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') load()
  }, [status, load])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (sending) return
    setSending(true)
    setMessage(null)
    try {
      const res = await fetch('/api/slot-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameName }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ kind: 'error', text: data.error ?? 'Something went wrong. Try again.' })
        return
      }
      setSuggestions(list => [data.suggestion, ...list])
      setMessage({ kind: 'ok', text: `Thanks! We'll take a look at ${data.suggestion.gameName}.` })
      setGameName('')
    } catch {
      setMessage({ kind: 'error', text: 'Something went wrong. Try again.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-surface-800/60 p-5 text-left sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
          <Lightbulb size={18} />
        </span>
        <div>
          <h3 className="font-bold text-white">Have a game that should be on the wheel?</h3>
          <p className="mt-0.5 text-sm text-slate-400">Send in your suggestion, and we&apos;ll add it if the game is good.</p>
        </div>
      </div>

      {status === 'unauthenticated' && (
        <button
          type="button"
          onClick={() => signIn('discord')}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Sign in with Discord to suggest a game
        </button>
      )}

      {status === 'authenticated' && (
        <>
          <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="suggest-game">Game name</label>
            <input
              id="suggest-game"
              value={gameName}
              onChange={e => setGameName(e.target.value)}
              placeholder="Game name, e.g. Gates of Olympus"
              maxLength={80}
              required
              disabled={atLimit}
              className="rounded-lg border border-white/10 bg-surface-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || atLimit || gameName.trim().length < 2}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={14} />
              {sending ? 'Sending…' : 'Suggest'}
            </button>
          </form>

          <p className="mt-2 text-xs tabular-nums text-slate-500">
            {atLimit
              ? `You have ${MAX_PENDING_SUGGESTIONS} suggestions waiting. You can send more once we've looked at them.`
              : `${pending} of ${MAX_PENDING_SUGGESTIONS} suggestions waiting for review.`}
          </p>

          {message && (
            <p className={cn('mt-2 text-sm', message.kind === 'ok' ? 'text-hype' : 'text-red-300')} role="status">
              {message.text}
            </p>
          )}

          {suggestions.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Your suggestions</p>
              <ul className="divide-y divide-white/5 text-sm">
                {suggestions.slice(0, 10).map(s => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-2">
                    <span className="min-w-0 truncate text-slate-200">
                      {s.gameName}
                    </span>
                    <span className={cn('shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold', STATUS_STYLE[s.status].className)}>
                      {STATUS_STYLE[s.status].label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}
