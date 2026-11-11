'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  LayoutDashboard, Users, Megaphone, Trophy,
  Plus, Save, Trash2, RefreshCw, TrendingUp, Shield, Swords, History, Camera, ChevronDown, Instagram,
  Lightbulb, Check, X, Eye, EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Avatar, Badge, StatCard } from '@/components/ui/Badge'
import { formatPoints, formatDate, formatRelativeTime, formatXP, cn } from '@/lib/utils'
import type { User, Announcement } from '@/types'
import type { ResultsMap } from '@/lib/tournament'
import { EVENT_TITLE } from '@/lib/tournament'
import { Bracket } from '@/components/events/Bracket'
// Kun type-import fra affilka.ts -- se advarselen ved formatXP-re-eksporten der for hvorfor en
// runtime-import herfra ville feilet bygget (denne fila er en client component).
import type { LeaderboardSnapshot } from '@/lib/affilka'
import type { GrowthData } from '@/lib/growth'
import type { AdminSlotSuggestion } from '@/lib/slotSuggestions'
import { PlayerAvatar } from '@/components/leaderboard/PlayerAvatar'
import toast from 'react-hot-toast'

type AdminTab = 'overview' | 'users' | 'announcements' | 'events' | 'leaderboard' | 'growth' | 'suggestions'

function formatUsd(amount: number) {
  return `$${Math.round(amount).toLocaleString('en-US')}`
}

function formatMonth(firstOfMonth: string) {
  return new Date(`${firstOfMonth}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// useSearchParams() krever en Suspense-boundary i App Router (ellers feiler "next build") --
// selve siden er uansett 100% client-rendered (session-gated), så fallback vises aldri reelt.
export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminPageInner />
    </Suspense>
  )
}

function AdminPageInner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<AdminTab>('overview')
  const [users, setUsers] = useState<User[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [tournamentResults, setTournamentResults] = useState<ResultsMap>({})
  const [pendingMatchId, setPendingMatchId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [snapshots, setSnapshots] = useState<LeaderboardSnapshot[]>([])
  const [capturingSnapshot, setCapturingSnapshot] = useState(false)
  const [expandedSnapshot, setExpandedSnapshot] = useState<string | null>(null)
  const [growth, setGrowth] = useState<GrowthData | null>(null)
  const [suggestions, setSuggestions] = useState<AdminSlotSuggestion[] | null>(null)
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  // On every time the panel opens, so numbers are never shown on stream by accident.
  const [streamerMode, setStreamerMode] = useState(true)

  // New announcement form
  const [newAnn, setNewAnn] = useState({ title: '', body: '', type: 'info', pinned: false })

  // Point adjustment
  const [pointTarget, setPointTarget] = useState('')
  const [pointDelta, setPointDelta] = useState('')
  const [pointReason, setPointReason] = useState('')

  // Blackjack hand grant
  const [bjTarget, setBjTarget] = useState('')

  // Guess the Slot reset
  const [puzzleTarget, setPuzzleTarget] = useState('')

  // Instagram token (news feed)
  const [igStatus, setIgStatus] = useState<{ configured: boolean; ig_user_id?: string; expires_at?: string } | null>(null)
  const [igAccessToken, setIgAccessToken] = useState('')
  const [igUserId, setIgUserId] = useState('')
  const [savingIgToken, setSavingIgToken] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    const role = session?.user?.role
    if (!session || (role !== 'admin' && role !== 'mod')) {
      router.replace('/')
    }
  }, [session, status, router])

  // Instagram sin OAuth-callback sender oss hit med ?instagram_connected=1 eller
  // ?instagram_error=... -- vis resultatet som en toast, og rydd opp i URL-en etterpå.
  useEffect(() => {
    const connected = searchParams.get('instagram_connected')
    const error = searchParams.get('instagram_error')
    if (connected) {
      toast.success('Instagram koblet til!')
      router.replace('/admin')
    } else if (error) {
      toast.error(`Instagram-tilkobling feilet: ${error}`)
      router.replace('/admin')
    }
  }, [searchParams, router])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [usersRes, annRes, tourneyRes, snapshotsRes, igRes, growthRes, suggestionsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/announcements'),
        fetch('/api/admin/tournament'),
        fetch('/api/admin/leaderboard-snapshots'),
        fetch('/api/admin/instagram-token'),
        fetch('/api/admin/growth'),
        fetch('/api/admin/slot-suggestions'),
      ])
      setSuggestions(suggestionsRes.ok ? await suggestionsRes.json() : null)
      if (usersRes.ok) setUsers(await usersRes.json())
      if (annRes.ok) setAnnouncements(await annRes.json())
      if (tourneyRes.ok) setTournamentResults(await tourneyRes.json())
      if (snapshotsRes.ok) setSnapshots(await snapshotsRes.json())
      if (igRes.ok) setIgStatus(await igRes.json())
      setGrowth(growthRes.ok ? await growthRes.json() : null)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function reviewSuggestion(id: string, status: 'approved' | 'declined') {
    setReviewingId(id)
    try {
      const res = await fetch('/api/admin/slot-suggestions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) {
        toast.error((await res.json().catch(() => ({}))).error ?? 'Could not save')
        return
      }
      setSuggestions(list =>
        list?.map(s => (s.id === id ? { ...s, status, reviewedAt: new Date().toISOString() } : s)) ?? null
      )
      toast.success(status === 'approved' ? 'Approved' : 'Declined')
    } finally {
      setReviewingId(null)
    }
  }

  async function handleAdjustPoints(e: React.FormEvent) {
    e.preventDefault()
    if (!pointTarget || !pointDelta) return
    const res = await fetch('/api/admin/points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: pointTarget, delta: parseInt(pointDelta), reason: pointReason || 'Admin adjustment' }),
    })
    if (res.ok) {
      toast.success('Points adjusted')
      setPointTarget(''); setPointDelta(''); setPointReason('')
      fetchData()
    } else {
      toast.error('Failed to adjust points')
    }
  }

  async function handleCreateAnnouncement(e: React.FormEvent) {
    e.preventDefault()
    if (!newAnn.title || !newAnn.body) return
    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnn),
    })
    if (res.ok) {
      toast.success('Announcement posted')
      setNewAnn({ title: '', body: '', type: 'info', pinned: false })
      fetchData()
    } else {
      toast.error('Failed to create announcement')
    }
  }

  async function handleGrantHands(e: React.FormEvent) {
    e.preventDefault()
    if (!bjTarget) return
    const res = await fetch('/api/admin/blackjack/grant-hands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: bjTarget }),
    })
    if (res.ok) {
      toast.success('3 fresh hands granted for today')
      setBjTarget('')
    } else {
      toast.error('Failed to grant hands')
    }
  }

  async function handleResetPuzzle(e: React.FormEvent) {
    e.preventDefault()
    if (!puzzleTarget) return
    const res = await fetch('/api/admin/puzzle/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: puzzleTarget }),
    })
    if (res.ok) {
      toast.success("Today's Guess the Slot progress reset")
      setPuzzleTarget('')
    } else {
      toast.error('Failed to reset puzzle')
    }
  }

  async function handleRerollPuzzle() {
    const res = await fetch('/api/admin/puzzle/reroll', { method: 'POST' })
    if (res.ok) {
      toast.success("Today's puzzle game swapped — everyone's progress reset")
    } else {
      toast.error('Failed to reroll puzzle')
    }
  }

  async function handleDeleteAnnouncement(id: string) {
    const res = await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted'); fetchData() }
    else toast.error('Failed to delete')
  }

  async function handlePickWinner(matchId: string, winner: string) {
    setPendingMatchId(matchId)
    try {
      const res = await fetch('/api/admin/tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, winner }),
      })
      if (res.ok) {
        toast.success('Winner saved')
        await fetchData()
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Failed to save winner')
      }
    } finally {
      setPendingMatchId(null)
    }
  }

  async function handleSaveInstagramToken(e: React.FormEvent) {
    e.preventDefault()
    if (!igAccessToken || !igUserId) return
    setSavingIgToken(true)
    try {
      const res = await fetch('/api/admin/instagram-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: igAccessToken, igUserId }),
      })
      if (res.ok) {
        toast.success('Instagram-token lagret')
        setIgAccessToken(''); setIgUserId('')
        fetchData()
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Failed to save Instagram token')
      }
    } finally {
      setSavingIgToken(false)
    }
  }

  async function handleCaptureSnapshot(month?: string) {
    setCapturingSnapshot(true)
    try {
      const res = await fetch('/api/admin/leaderboard-snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(month ? { month } : {}),
      })
      if (res.ok) {
        toast.success('Leaderboard-snapshot lagret')
        await fetchData()
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Failed to capture snapshot')
      }
    } finally {
      setCapturingSnapshot(false)
    }
  }

  async function handleClearMatch(matchId: string) {
    setPendingMatchId(matchId)
    try {
      const res = await fetch(`/api/admin/tournament?matchId=${encodeURIComponent(matchId)}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Match reset')
        await fetchData()
      } else {
        toast.error('Failed to reset match')
      }
    } finally {
      setPendingMatchId(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  const pendingSuggestions = suggestions?.filter(s => s.status === 'pending').length ?? 0

  const TABS: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
    { key: 'users', label: 'Users', icon: <Users size={15} /> },
    { key: 'announcements', label: 'Announcements', icon: <Megaphone size={15} /> },
    { key: 'events', label: 'Events', icon: <Swords size={15} /> },
    { key: 'leaderboard', label: 'Leaderboard', icon: <History size={15} /> },
    { key: 'growth', label: 'Growth', icon: <TrendingUp size={15} /> },
    {
      key: 'suggestions',
      label: `Suggestions${pendingSuggestions ? ` (${pendingSuggestions})` : ''}`,
      icon: <Lightbulb size={15} />,
    },
  ]

  const currentMonth = growth?.months[0]
  const totalClicksThisMonth = growth?.clicks.reduce((sum, page) => sum + page.thisMonth, 0) ?? 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 bg-surface-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20">
              <Shield size={20} className="text-brand-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-slate-500">Logged in as {session?.user?.displayName}</p>
            </div>
            <button
              type="button"
              onClick={() => setStreamerMode(on => !on)}
              aria-pressed={streamerMode}
              title={streamerMode ? 'Numbers are hidden. Click to show them.' : 'Hide numbers before going live.'}
              className={cn(
                'ml-auto inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors',
                streamerMode
                  ? 'border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                  : 'border-white/10 text-slate-400 hover:text-white'
              )}
            >
              {streamerMode ? <EyeOff size={13} /> : <Eye size={13} />}
              Streamer mode: {streamerMode ? 'On' : 'Off'}
            </button>
            <Button variant="ghost" size="sm" onClick={fetchData}>
              <RefreshCw size={13} />
              Refresh
            </Button>
          </div>

          {/* Tab bar */}
          <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-surface-800 border border-white/5 w-fit">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                  tab === t.key
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Streamer mode blurs numbers and player data (see globals.css) so the panel can be shown on stream. */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" data-streamer={streamerMode ? 'on' : 'off'}>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Users" value={users.length} />
              <StatCard label="Total Points Given" value={formatPoints(users.reduce((s, u) => s + u.points, 0))} />
              <StatCard label="Announcements" value={announcements.length} />
              <StatCard label="Admins / Mods" value={users.filter(u => u.role !== 'user').length} />
            </div>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Trophy size={15} className="text-brand-500" />
                  Quick Points Adjustment
                </h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdjustPoints} className="grid sm:grid-cols-4 gap-3">
                  <select
                    value={pointTarget}
                    onChange={e => setPointTarget(e.target.value)}
                    className="rounded-lg border border-white/10 bg-surface-700 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">Select user…</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.display_name || u.username}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Points (+ or -)"
                    value={pointDelta}
                    onChange={e => setPointDelta(e.target.value)}
                    className="rounded-lg border border-white/10 bg-surface-700 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-brand-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Reason"
                    value={pointReason}
                    onChange={e => setPointReason(e.target.value)}
                    className="rounded-lg border border-white/10 bg-surface-700 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-brand-500 focus:outline-none"
                  />
                  <Button type="submit" disabled={!pointTarget || !pointDelta}>
                    <Save size={13} />
                    Apply
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <TrendingUp size={15} className="text-brand-500" />
                  Grant Blackjack Hands
                </h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGrantHands} className="grid sm:grid-cols-3 gap-3">
                  <select
                    value={bjTarget}
                    onChange={e => setBjTarget(e.target.value)}
                    className="rounded-lg border border-white/10 bg-surface-700 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">Select user…</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.display_name || u.username}</option>
                    ))}
                  </select>
                  <p className="text-sm text-slate-400 flex items-center">Resets today&apos;s hands to 0 → gives 3 fresh hands</p>
                  <Button type="submit" disabled={!bjTarget}>
                    <Save size={13} />
                    Grant Hands
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <RefreshCw size={15} className="text-brand-500" />
                  Reset Guess the Slot
                </h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPuzzle} className="grid sm:grid-cols-3 gap-3">
                  <select
                    value={puzzleTarget}
                    onChange={e => setPuzzleTarget(e.target.value)}
                    className="rounded-lg border border-white/10 bg-surface-700 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">Select user…</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.display_name || u.username}</option>
                    ))}
                  </select>
                  <p className="text-sm text-slate-400 flex items-center">Clears today&apos;s guesses → 5 fresh attempts</p>
                  <Button type="submit" disabled={!puzzleTarget}>
                    <Save size={13} />
                    Reset
                  </Button>
                </form>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/5 pt-3">
                  <p className="text-sm text-slate-400">Swap today&apos;s game entirely → new random answer, everyone&apos;s progress wiped</p>
                  <Button type="button" variant="secondary" onClick={handleRerollPuzzle}>
                    <RefreshCw size={13} />
                    Reroll
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Instagram size={15} className="text-brand-500" />
                  Instagram (News feed)
                </h2>
                <p className="text-xs text-slate-500 pt-1">
                  {igStatus?.configured
                    ? <>Connected to <strong className="text-slate-300">{igStatus.ig_user_id}</strong> · token auto-refreshes weekly.</>
                    : 'Not connected yet -- click Connect Instagram and log in as the luckandloadtv account.'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <a href="/api/admin/instagram-oauth/start">
                  <Button type="button">
                    <Instagram size={13} />
                    {igStatus?.configured ? 'Reconnect Instagram' : 'Connect Instagram'}
                  </Button>
                </a>

                <details className="text-xs text-slate-500">
                  <summary className="cursor-pointer select-none hover:text-slate-300">
                    Or paste a token manually (backup, rarely needed)
                  </summary>
                  <form onSubmit={handleSaveInstagramToken} className="mt-3 grid sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="IG User ID"
                      value={igUserId}
                      onChange={e => setIgUserId(e.target.value)}
                      className="rounded-lg border border-white/10 bg-surface-700 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-brand-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Long-lived access token"
                      value={igAccessToken}
                      onChange={e => setIgAccessToken(e.target.value)}
                      className="rounded-lg border border-white/10 bg-surface-700 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-brand-500 focus:outline-none"
                    />
                    <Button type="submit" disabled={!igAccessToken || !igUserId || savingIgToken}>
                      <Save size={13} />
                      {savingIgToken ? 'Saving…' : 'Save token'}
                    </Button>
                  </form>
                </details>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white pb-4 flex items-center gap-2">
                <Users size={15} className="text-brand-500" />
                All Users
                <Badge variant="default" className="ml-auto">{users.length}</Badge>
              </h2>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">User</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Role</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">Points</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.avatar_url} name={u.username} size={30} />
                          <div>
                            <p className="font-medium text-white text-xs">{u.display_name || u.username}</p>
                            <p className="text-slate-600 text-[10px]">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={u.role === 'admin' ? 'danger' : u.role === 'mod' ? 'warning' : 'default'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td data-sensitive className="px-5 py-3 text-right font-medium text-brand-400 text-xs">
                        {formatPoints(u.points)}
                      </td>
                      <td className="px-5 py-3 text-right text-slate-600 text-xs">
                        {formatDate(u.created_at)}
                      </td>
                    </tr>
                  ))}
                  {!users.length && (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-slate-600 text-sm">
                        No users yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Announcements */}
        {tab === 'announcements' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-white flex items-center gap-2 pb-0">
                  <Plus size={15} className="text-brand-500" />
                  New Announcement
                </h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAnnouncement} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newAnn.title}
                    onChange={e => setNewAnn(a => ({ ...a, title: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-surface-700 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-brand-500 focus:outline-none"
                  />
                  <textarea
                    rows={3}
                    placeholder="Message body…"
                    value={newAnn.body}
                    onChange={e => setNewAnn(a => ({ ...a, body: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-surface-700 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-brand-500 focus:outline-none resize-none"
                  />
                  <div className="flex items-center gap-3">
                    <select
                      value={newAnn.type}
                      onChange={e => setNewAnn(a => ({ ...a, type: e.target.value }))}
                      className="rounded-lg border border-white/10 bg-surface-700 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="event">Event</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAnn.pinned}
                        onChange={e => setNewAnn(a => ({ ...a, pinned: e.target.checked }))}
                        className="accent-brand-500"
                      />
                      Pin to top
                    </label>
                    <Button type="submit" className="ml-auto" disabled={!newAnn.title || !newAnn.body}>
                      <Megaphone size={13} />
                      Post
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-white flex items-center gap-2 pb-0">
                  <TrendingUp size={15} className="text-brand-500" />
                  Posted Announcements
                </h2>
              </CardHeader>
              <div className="divide-y divide-white/5">
                {announcements.map(ann => (
                  <div key={ann.id} className="flex items-start gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white truncate">{ann.title}</p>
                        {ann.pinned && <Badge variant="brand" className="text-[10px]">Pinned</Badge>}
                        <Badge variant="default" className="text-[10px] capitalize">{ann.type}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{ann.body}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="shrink-0 p-1.5 text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {!announcements.length && (
                  <p className="px-5 py-8 text-center text-slate-600 text-sm">No announcements yet</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Events */}
        {tab === 'events' && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white flex items-center gap-2 pb-0">
                <Swords size={15} className="text-brand-500" />
                {EVENT_TITLE}
              </h2>
              <p className="text-xs text-slate-500 pt-1">
                Click a provider to set them as the winner of that match. Semifinals and the
                final unlock once the matches feeding into them are decided.
              </p>
            </CardHeader>
            <CardContent>
              <Bracket
                results={tournamentResults}
                editable
                pendingMatchId={pendingMatchId}
                onPick={handlePickWinner}
                onClear={handleClearMatch}
              />
            </CardContent>
          </Card>
        )}

        {/* Leaderboard history */}
        {tab === 'leaderboard' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-white flex items-center gap-2 pb-0">
                  <Camera size={15} className="text-brand-500" />
                  Capture snapshot
                </h2>
                <p className="text-xs text-slate-500 pt-1">
                  Freezes this month&apos;s leaderboard exactly as it is right now. This also runs
                  automatically right before every month ends, and the finished month is saved again
                  with its final numbers during the first days of the next month. &quot;Save last
                  month&quot; fetches last month&apos;s final standings, so you can use it if the automatic
                  run missed.
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button onClick={() => handleCaptureSnapshot()} disabled={capturingSnapshot}>
                  <Camera size={13} />
                  {capturingSnapshot ? 'Capturing…' : 'Capture current month now'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const now = new Date()
                    const prev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
                    handleCaptureSnapshot(prev.toISOString().slice(0, 7))
                  }}
                  disabled={capturingSnapshot}
                >
                  <History size={13} />
                  Save last month (final)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-white flex items-center gap-2 pb-0">
                  <History size={15} className="text-brand-500" />
                  Saved months
                  <Badge variant="default" className="ml-auto">{snapshots.length}</Badge>
                </h2>
              </CardHeader>
              <div className="divide-y divide-white/5">
                {snapshots.map(snap => {
                  const monthLabel = new Date(`${snap.periodFrom}T00:00:00Z`).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })
                  const isOpen = expandedSnapshot === snap.periodFrom
                  return (
                    <div key={snap.periodFrom}>
                      <button
                        type="button"
                        onClick={() => setExpandedSnapshot(isOpen ? null : snap.periodFrom)}
                        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white">{monthLabel}</p>
                          <p className="text-xs text-slate-500">
                            {snap.entries.length} players saved · Captured {formatRelativeTime(snap.capturedAt)}
                          </p>
                        </div>
                        <ChevronDown
                          size={16}
                          className={cn('shrink-0 text-slate-500 transition-transform', isOpen && 'rotate-180')}
                        />
                      </button>
                      {isOpen && (
                        <div className="divide-y divide-white/5 bg-surface-900/40">
                          {snap.entries.map(entry => (
                            <div key={entry.rank} className="flex items-center gap-3 px-5 py-3 sm:px-8">
                              <span className="w-5 shrink-0 text-center text-sm font-bold tabular-nums text-slate-500">
                                {entry.rank}
                              </span>
                              <PlayerAvatar src={entry.avatar} name={entry.username} size={28} />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-white">{entry.username}</p>
                                <p className="text-xs tabular-nums text-slate-500">{formatXP(entry.xpPoints)} XP</p>
                              </div>
                              {entry.prize ? (
                                <span className="shrink-0 text-sm font-bold tabular-nums text-hype">${entry.prize}</span>
                              ) : (
                                <span className="shrink-0 text-xs font-medium text-slate-600">Runner-up</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
                {!snapshots.length && (
                  <p className="px-5 py-8 text-center text-slate-600 text-sm">
                    No snapshots saved yet — one is captured automatically right before each
                    month ends.
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Growth */}
        {tab === 'growth' && !growth && (
          <Card>
            <CardContent className="py-8 text-center text-sm text-slate-400">
              Growth data could not be loaded. Check that <code>supabase/migrations/010_growth.sql</code> has been run.
            </CardContent>
          </Card>
        )}

        {tab === 'growth' && growth && (
          <div className="space-y-6">
            {!growth.hasBaseline && (
              <p className="rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-sm text-slate-200">
                Player history has not been loaded yet, so existing players may show up as new.
              </p>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                label="New registrations"
                value={currentMonth?.registrations ?? 0}
                sub={currentMonth ? formatMonth(currentMonth.month) : undefined}
              />
              <StatCard label="New players" value={currentMonth?.newPlayers.length ?? 0} />
              <StatCard label="Active players" value={currentMonth?.activePlayers ?? 0} />
              <StatCard label="Wagered" value={formatUsd(currentMonth?.wagered ?? 0)} />
              <StatCard label="Hype link clicks this month" value={totalClicksThisMonth} />
            </div>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-white flex items-center gap-2 pb-0">
                  <Users size={15} className="text-brand-500" />
                  Players per month
                </h2>
                <p className="text-xs text-slate-500 pt-1">
                  New means the first month a player has bets under our code. Hype&apos;s FTD count can differ, because
                  a player can deposit without betting, or start betting long after depositing.
                  {currentMonth && <> Last updated {formatRelativeTime(currentMonth.capturedAt)}.</>}
                </p>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-xs text-slate-500">
                      <th scope="col" className="px-5 py-3 text-left font-medium">Month</th>
                      <th scope="col" className="px-5 py-3 text-right font-medium">Active</th>
                      <th scope="col" className="px-5 py-3 text-right font-medium">New</th>
                      <th scope="col" className="px-5 py-3 text-left font-medium">New players</th>
                      <th scope="col" className="px-5 py-3 text-right font-medium">Wagered</th>
                      <th scope="col" className="px-5 py-3 text-right font-medium">Wagered by new</th>
                      <th scope="col" className="px-5 py-3 text-right font-medium">Registrations*</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {growth.months.map(month => (
                      <tr key={month.month}>
                        <th scope="row" className="whitespace-nowrap px-5 py-3 text-left font-medium text-white">
                          {formatMonth(month.month)}
                        </th>
                        <td className="px-5 py-3 text-right tabular-nums">{month.activePlayers}</td>
                        <td className="px-5 py-3 text-right font-semibold tabular-nums text-brand-400">
                          {month.newPlayers.length}
                        </td>
                        <td data-sensitive className="min-w-48 px-5 py-3 text-xs text-slate-400">
                          {month.newPlayers.join(', ') || '–'}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums">{formatUsd(month.wagered)}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{formatUsd(month.newPlayerWagered)}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{month.registrations ?? '–'}</td>
                      </tr>
                    ))}
                    {!growth.months.length && (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-600">
                          No months saved yet. The current month appears after the next leaderboard refresh.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="px-5 py-3 text-xs text-slate-500">
                *New signups under our code, from the Hype API. This counts signups, not deposits.
              </p>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-white flex items-center gap-2 pb-0">
                  <TrendingUp size={15} className="text-brand-500" />
                  Clicks on Hype links by page
                </h2>
                <p className="text-xs text-slate-500 pt-1">
                  Counted from November 6, 2026, using UTC months. Right-click &quot;open in new tab&quot; is not counted.
                </p>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-xs text-slate-500">
                      <th scope="col" className="px-5 py-3 text-left font-medium">Page</th>
                      <th scope="col" className="px-5 py-3 text-right font-medium">This month</th>
                      <th scope="col" className="px-5 py-3 text-right font-medium">Last month</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {growth.clicks.map(page => (
                      <tr key={page.path}>
                        <th scope="row" className="px-5 py-3 text-left font-medium text-white">
                          {page.path === '/' ? 'Home' : page.path === 'other' ? 'Other' : page.path}
                        </th>
                        <td className="px-5 py-3 text-right tabular-nums">{page.thisMonth}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{page.lastMonth}</td>
                      </tr>
                    ))}
                    {!growth.clicks.length && (
                      <tr>
                        <td colSpan={3} className="px-5 py-8 text-center text-slate-600">No clicks counted yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Slot Wheel suggestions */}
        {tab === 'suggestions' && !suggestions && (
          <Card>
            <CardContent className="py-8 text-center text-sm text-slate-400">
              Suggestions could not be loaded. Check that <code>supabase/migrations/011_slot_suggestions.sql</code> has
              been run.
            </CardContent>
          </Card>
        )}

        {tab === 'suggestions' && suggestions && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white flex items-center gap-2 pb-0">
                <Lightbulb size={15} className="text-brand-500" />
                Slot Wheel suggestions
              </h2>
              <p className="text-xs text-slate-500 pt-1">
                Games viewers want on the wheel. Waiting ones are listed first, oldest first. Approved games still need
                a cover image before they can be added to the wheel.
              </p>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-slate-500">
                    <th scope="col" className="px-5 py-3 text-left font-medium">Game</th>
                    <th scope="col" className="px-5 py-3 text-left font-medium">Suggested by</th>
                    <th scope="col" className="px-5 py-3 text-left font-medium">Sent</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {suggestions.map(s => (
                    <tr key={s.id}>
                      <th scope="row" className="px-5 py-3 text-left font-medium text-white">{s.gameName}</th>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-2">
                          {s.avatarUrl && <PlayerAvatar src={s.avatarUrl} name={s.suggestedBy} size={22} />}
                          {s.suggestedBy}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-400">{formatRelativeTime(s.createdAt)}</td>
                      <td className="px-5 py-3 text-right">
                        {s.status === 'pending' ? (
                          <span className="inline-flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={reviewingId === s.id}
                              onClick={() => reviewSuggestion(s.id, 'approved')}
                              className="text-hype hover:text-hype"
                            >
                              <Check size={14} />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={reviewingId === s.id}
                              onClick={() => reviewSuggestion(s.id, 'declined')}
                              className="text-red-300 hover:text-red-200"
                            >
                              <X size={14} />
                              Decline
                            </Button>
                          </span>
                        ) : (
                          <span
                            className={cn(
                              'rounded-md px-2 py-0.5 text-xs font-semibold',
                              s.status === 'approved' ? 'bg-hype/10 text-hype' : 'bg-red-500/10 text-red-300'
                            )}
                          >
                            {s.status === 'approved' ? 'Approved' : 'Declined'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!suggestions.length && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-600">No suggestions yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
