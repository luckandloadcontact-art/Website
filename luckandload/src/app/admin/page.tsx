'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Megaphone, Trophy,
  Plus, Save, Trash2, RefreshCw, TrendingUp, Shield
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Avatar, Badge, StatCard } from '@/components/ui/Badge'
import { formatPoints, formatDate, cn } from '@/lib/utils'
import type { User, Announcement } from '@/types'
import toast from 'react-hot-toast'

type AdminTab = 'overview' | 'users' | 'announcements'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<AdminTab>('overview')
  const [users, setUsers] = useState<User[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  // New announcement form
  const [newAnn, setNewAnn] = useState({ title: '', body: '', type: 'info', pinned: false })

  // Point adjustment
  const [pointTarget, setPointTarget] = useState('')
  const [pointDelta, setPointDelta] = useState('')
  const [pointReason, setPointReason] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    const role = session?.user?.role
    if (!session || (role !== 'admin' && role !== 'mod')) {
      router.replace('/')
    }
  }, [session, status, router])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [usersRes, annRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/announcements'),
      ])
      if (usersRes.ok) setUsers(await usersRes.json())
      if (annRes.ok) setAnnouncements(await annRes.json())
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

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

  async function handleDeleteAnnouncement(id: string) {
    const res = await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted'); fetchData() }
    else toast.error('Failed to delete')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  const TABS: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
    { key: 'users', label: 'Users', icon: <Users size={15} /> },
    { key: 'announcements', label: 'Announcements', icon: <Megaphone size={15} /> },
  ]

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
            <Button variant="ghost" size="sm" onClick={fetchData} className="ml-auto">
              <RefreshCw size={13} />
              Refresh
            </Button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 p-1 rounded-xl bg-surface-800 border border-white/5 w-fit">
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

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
                      <td className="px-5 py-3 text-right font-medium text-brand-400 text-xs">
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
      </div>
    </div>
  )
}
