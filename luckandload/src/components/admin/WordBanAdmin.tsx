'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Ban, Play, Square } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { WORD_BAN_DEFAULT_MINUTES, formatWordBanTime, type WordBanResponse } from '@/lib/wordBan'

// Admin tab for the Word Ban timer: start it (5 minutes by default), restart it or stop it. The
// overlay (/overlay/word-ban) follows within 2 seconds.
export function WordBanAdmin() {
  const [state, setState] = useState<WordBanResponse | null>(null)
  const [failed, setFailed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [minutes, setMinutes] = useState(String(WORD_BAN_DEFAULT_MINUTES))
  const [word, setWord] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const offset = useRef(0)

  const load = useCallback(async () => {
    const res = await fetch('/api/word-ban', { cache: 'no-store' })
    if (!res.ok) {
      setFailed(true)
      return
    }
    const data: WordBanResponse = await res.json()
    offset.current = Date.parse(data.serverNow) - Date.now()
    setFailed(false)
    setState(data)
  }, [])

  useEffect(() => {
    load()
    const tick = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(tick)
  }, [load])

  async function send(action: 'start' | 'stop') {
    setBusy(true)
    try {
      const res = await fetch('/api/admin/word-ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, minutes: Number(minutes), word }),
      })
      if (!res.ok) throw new Error()
      toast.success(action === 'start' ? 'Word ban started' : 'Word ban stopped')
      await load()
    } catch {
      toast.error('Could not update the timer')
    } finally {
      setBusy(false)
    }
  }

  if (failed) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-slate-400">
          The timer could not be loaded. Check that <code>supabase/migrations/013_overlay_state.sql</code> has been run.
        </CardContent>
      </Card>
    )
  }

  const running = !!state?.endsAt
  const remaining = running ? Date.parse(state!.endsAt!) - (now + offset.current) : (state?.durationSec ?? 300) * 1000
  const finished = running && remaining <= 0

  return (
    <Card>
      <CardHeader>
        <h2 className="flex items-center gap-2 pb-0 font-semibold text-white">
          <Ban size={15} className="text-brand-500" />
          Word ban
        </h2>
        <p className="pt-1 text-xs text-slate-500">
          Start the timer and it counts down on stream within 2 seconds. OBS browser source:{' '}
          <code>luckandloadtv.com/overlay/word-ban</code>, 300×124.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p
            className={`text-6xl font-black tabular-nums ${
              finished ? 'text-red-400' : running ? (remaining <= 30_000 ? 'text-red-400' : 'text-brand-400') : 'text-slate-500'
            }`}
          >
            {finished ? "Time's up" : formatWordBanTime(remaining)}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {finished ? 'Finished' : running ? 'Running' : 'Not running'}
            {state?.word ? ` · Banned: ${state.word}` : ''}
          </p>
        </div>

        <div className="mx-auto grid max-w-md gap-3 sm:grid-cols-[1fr_7rem]">
          <label className="text-xs text-slate-400">
            Banned word (optional, shown on stream)
            <input
              value={word}
              onChange={e => setWord(e.target.value)}
              maxLength={30}
              placeholder="e.g. bonus"
              className="mt-1 w-full rounded-lg border border-white/10 bg-surface-800 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-brand-500/50 focus:outline-none"
            />
          </label>
          <label className="text-xs text-slate-400">
            Minutes
            <input
              type="number"
              min={0.5}
              max={60}
              step={0.5}
              value={minutes}
              onChange={e => setMinutes(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-surface-800 px-3 py-2 text-sm text-white focus:border-brand-500/50 focus:outline-none"
            />
          </label>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            disabled={busy || !state}
            onClick={() => send('start')}
            className="inline-flex items-center gap-2 rounded-xl bg-hype px-5 py-2.5 text-sm font-bold text-surface-950 transition-colors hover:bg-hype/85 disabled:opacity-40"
          >
            <Play size={15} /> {running ? 'Restart' : 'Start'}
          </button>
          <button
            type="button"
            disabled={busy || !state || !running}
            onClick={() => send('stop')}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 disabled:opacity-40"
          >
            <Square size={14} /> Stop
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
