import type { ScheduledStream } from '@/lib/stream'

// Reads the scheduled events in our Discord server, so the stream schedule on the home page updates
// itself. Needs a bot that is a member of the server (no gateway connection or hosting, just the
// REST API) and two environment variables in Vercel:
//   DISCORD_BOT_TOKEN  – Bot token from the Discord developer portal (Bot > Reset Token)
//   DISCORD_GUILD_ID   – The server ID (right-click the server > Copy Server ID)
// Returns null when it isn't set up or Discord can't be reached; the page then uses the manual list
// in lib/stream.ts.

const REFRESH_SECONDS = 600

type DiscordScheduledEvent = {
  name: string
  scheduled_start_time: string
  status: number // 1 scheduled, 2 active, 3 completed, 4 canceled
}

export async function getDiscordStreams(): Promise<ScheduledStream[] | null> {
  const token = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID
  if (!token || !guildId) return null

  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/scheduled-events`, {
      headers: { Authorization: `Bot ${token}` },
      next: { revalidate: REFRESH_SECONDS },
    })
    if (!res.ok) {
      console.error(`Discord scheduled events: HTTP ${res.status}`)
      return null
    }
    const events = (await res.json()) as DiscordScheduledEvent[]
    return events
      .filter(event => event.status === 1 || event.status === 2)
      .map(event => ({ title: event.name, start: event.scheduled_start_time }))
      .sort((a, b) => a.start.localeCompare(b.start))
  } catch (error) {
    console.error('Discord scheduled events:', error)
    return null
  }
}
