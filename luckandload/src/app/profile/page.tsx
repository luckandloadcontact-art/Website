'use client'
import { useSession, signIn } from 'next-auth/react'
import { Shield, Trophy, Calendar, Zap, TrendingUp } from 'lucide-react'
import { Avatar, StatCard } from '@/components/ui/Badge'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { formatPoints, formatDate } from '@/lib/utils'

export default function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-700 border border-white/10 mb-6">
            <Shield size={28} className="text-slate-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Sign in to view your profile</h1>
          <p className="text-slate-400 mb-6">Connect your Discord account to join the community and track your stats.</p>
          <Button onClick={() => signIn('discord')} size="lg">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.056a19.906 19.906 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Sign in with Discord
          </Button>
        </div>
      </div>
    )
  }

  const user = session.user
  const roleColors: Record<string, string> = {
    admin: 'danger',
    mod: 'warning',
    user: 'default',
  }

  return (
    <div className="min-h-screen">
      {/* Profile header */}
      <div className="border-b border-white/5 bg-surface-950/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="relative">
              <Avatar src={user.avatarUrl} name={user.username || 'U'} size={80} className="ring-2 ring-brand-500/40 ring-offset-2 ring-offset-surface-950" />
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-surface-950" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">
                  {user.displayName || user.username}
                </h1>
                <Badge variant={roleColors[user.role || 'user'] as 'default' | 'danger' | 'warning'}>
                  {user.role || 'member'}
                </Badge>
              </div>
              <p className="text-slate-500 text-sm">@{user.username}</p>
              {user.joinedAt && (
                <p className="text-slate-600 text-xs mt-1 flex items-center justify-center sm:justify-start gap-1">
                  <Calendar size={11} />
                  Member since {formatDate(user.joinedAt)}
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gradient">{formatPoints(user.points || 0)}</p>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center justify-center gap-1">
                <Trophy size={10} />
                Community Points
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Points" value={formatPoints(user.points || 0)} />
          <StatCard label="Rank" value="#—" sub="Not yet ranked" />
          <StatCard label="Streak" value="—" sub="Days active" />
          <StatCard label="Member" value={user.joinedAt ? `${Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / 86400000)}d` : '—'} sub="Days in community" />
        </div>

        {/* Coming soon features */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-brand-500" />
              <h2 className="font-semibold text-white">Achievements</h2>
              <Badge variant="warning" className="ml-auto text-xs">Coming Soon</Badge>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-surface-700/50 border border-white/5 flex items-center justify-center"
                >
                  <span className="text-xl opacity-20">🏆</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 text-center mt-3">Earn achievements by participating in streams and events</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-brand-500" />
              <h2 className="font-semibold text-white">Activity</h2>
            </div>
            <div className="text-center py-8 text-slate-600">
              <TrendingUp size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Your activity history will appear here</p>
              <p className="text-xs mt-1 text-slate-700">Participate in streams and events to start earning points</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
