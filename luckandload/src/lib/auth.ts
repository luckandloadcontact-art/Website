import { type NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { createAdminClient } from '@/lib/supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: 'identify email' } },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== 'discord') return false
      const supabase = createAdminClient()
      const p = profile as { id: string; username: string; global_name?: string; avatar?: string; email?: string }
      const avatarUrl = p.avatar
        ? `https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png?size=256`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(p.id) % 5}.png`
      const { error } = await supabase.from('users').upsert(
        { discord_id: p.id, username: p.username, display_name: p.global_name ?? p.username, avatar_url: avatarUrl, email: p.email, last_login: new Date().toISOString() },
        { onConflict: 'discord_id', ignoreDuplicates: false }
      )
      if (error) { console.error('upsert error', error); return false }
      return true
    },
    async session({ session, token }) {
      if (token?.discordId) {
        session.user.discordId = token.discordId as string
        const supabase = createAdminClient()
        const { data } = await supabase
          .from('users')
          .select('id, role, points, username, display_name, avatar_url, created_at')
          .eq('discord_id', token.discordId)
          .single()
        if (data) {
          session.user.dbId = data.id
          session.user.role = data.role
          session.user.points = data.points
          session.user.username = data.username
          session.user.displayName = data.display_name
          session.user.avatarUrl = data.avatar_url
          session.user.joinedAt = data.created_at
        }
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === 'discord' && profile) {
        token.discordId = (profile as { id: string }).id
      }
      return token
    },
  },
  pages: { signIn: '/auth/signin', error: '/auth/error' },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
}

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      dbId?: string
      discordId?: string
      role?: string
      points?: number
      username?: string
      displayName?: string
      avatarUrl?: string
      joinedAt?: string
    }
  }
}
