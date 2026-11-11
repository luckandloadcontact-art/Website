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

// Event names in Discord are written for Discord ("🚨CLASSIC BONUSHUNT🚨"). On the site we drop the
// emojis and turn all-caps names into title case ("Classic Bonushunt"). Mixed-case names are kept.
// Built with the RegExp constructor: the TypeScript target here doesn't allow the u flag in literals.
const EMOJI = new RegExp('[\\p{Extended_Pictographic}\\uFE0F\\u200D]', 'gu')
const WORD_START = new RegExp('(^|[\\s/&(-])(\\p{L})', 'gu')

function cleanTitle(name: string): string {
  const plain = name.replace(EMOJI, '').replace(/\s+/g, ' ').trim()
  if (!plain) return name.trim()
  if (plain !== plain.toUpperCase()) return plain
  return plain.toLowerCase().replace(WORD_START, (_, sep: string, letter: string) => sep + letter.toUpperCase())
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
      .map(event => ({ title: cleanTitle(event.name), start: event.scheduled_start_time }))
      .sort((a, b) => a.start.localeCompare(b.start))
  } catch (error) {
    console.error('Discord scheduled events:', error)
    return null
  }
}
