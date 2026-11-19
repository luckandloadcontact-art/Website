'use client'

import { useCallback, useEffect, useState } from 'react'
import { Swords, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import type { ChatVsScore, ChatVsWinner } from '@/lib/chatVs'

// Admin tab for Throwdown Thursday: one click adds the winner, and the stream overlay
// (/overlay/chat-vs) picks it up within 15 seconds.
export function ChatVsAdmin() {
  const [score, setScore] = useState<ChatVsScore | null>(null)
  const [failed, setFailed] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/chat-vs', { cache: 'no-store' })
    if (!res.ok) {
      setFailed(true)
      return
    }
    setFailed(false)
    setScore(await res.json())
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function addWinner(winner: ChatVsWinner) {
    setBusy(true)
    try {
      const res = await fetch('/api/admin/chat-vs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner }),
      })
      if (!res.ok) throw new Error()
      toast.success(winner === 'luckandload' ? 'LuckAndLoad +1' : 'Chat +1')
      await load()
    } catch {
      toast.error('Could not save the result')
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Remove this result?')) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/chat-vs?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Result removed')
      await load()
    } catch {
      toast.error('Could not remove the result')
    } finally {
      setBusy(false)
    }
  }

  if (failed) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-slate-400">
          Results could not be loaded. Check that <code>supabase/migrations/012_chat_vs.sql</code> has been run.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="flex items-center gap-2 pb-0 font-semibold text-white">
          <Swords size={15} className="text-brand-500" />
          Chat vs LuckAndLoad
        </h2>
        <p className="pt-1 text-xs text-slate-500">
          Throwdown Thursday. Add the winner when the hunt is over, and the score on stream updates within 15
          seconds. OBS browser source: <code>luckandloadtv.com/overlay/chat-vs</code>, 460×132.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-8 text-center">
          <div>
            <p className="text-5xl font-black tabular-nums text-amber-300">{score?.luckandload ?? '–'}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">LuckAndLoad</p>
          </div>
          <span className="text-xl font-black italic text-red-500">VS</span>
          <div>
            <p className="text-5xl font-black tabular-nums text-red-400">{score?.chat ?? '–'}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">Chat</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            disabled={busy || !score}
            onClick={() => addWinner('luckandload')}
            className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#1d160c] transition-colors hover:bg-amber-300 disabled:opacity-40"
          >
            LuckAndLoad won
          </button>
          <button
            type="button"
            disabled={busy || !score}
            onClick={() => addWinner('chat')}
            className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-400 disabled:opacity-40"
          >
            Chat won
          </button>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Latest results</p>
          {score && score.recent.length === 0 && <p className="text-sm text-slate-500">No results yet.</p>}
          <ul className="divide-y divide-white/5">
            {score?.recent.map(result => (
              <li key={result.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-slate-400">{formatDate(result.playedOn)}</span>
                <span className={result.winner === 'luckandload' ? 'font-semibold text-amber-300' : 'font-semibold text-red-400'}>
                  {result.winner === 'luckandload' ? 'LuckAndLoad won' : 'Chat won'}
                </span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => remove(result.id)}
                  className="text-slate-500 transition-colors hover:text-red-400 disabled:opacity-40"
                  aria-label="Remove result"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
