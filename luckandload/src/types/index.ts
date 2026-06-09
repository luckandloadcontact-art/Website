export type UserRole = 'user' | 'mod' | 'admin'

export interface User {
  id: string
  discord_id: string
  username: string
  display_name?: string
  avatar_url?: string
  email?: string
  role: UserRole
  points: number
  created_at: string
  updated_at: string
}

export interface LeaderboardEntry {
  rank: number
  user_id: string
  username: string
  display_name?: string
  avatar_url?: string
  points: number
}

export interface Announcement {
  id: string
  title: string
  body: string
  type: 'info' | 'warning' | 'success' | 'event'
  pinned: boolean
  published: boolean
  author_id?: string
  created_at: string
}

export interface PointTransaction {
  id: string
  user_id: string
  delta: number
  reason: string
  created_at: string
}

export type LeaderboardPeriod = 'weekly' | 'monthly' | 'alltime'
