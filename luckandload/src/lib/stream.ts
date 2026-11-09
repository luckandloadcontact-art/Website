// Stream schedule and highlights for the offline view on the home page. Safe to import from client
// components (no server-only imports).

export const STREAM_TIME_ZONE = 'Europe/Oslo'
const STREAM_HOURS = 3 // How long a stream counts as "on" after its start time

// This week's streams, copied from the events in our Discord. Update every week. Dates and times
// are Norwegian time. Once the last one is over, the home page asks people to follow us instead.
export const SCHEDULED_STREAMS = [
  { date: '2026-11-09', time: '18:00', title: 'Classic Bonushunt' },
  { date: '2026-11-11', time: '18:00', title: 'No Ante Bonushunt' },
  { date: '2026-11-12', time: '18:00', title: 'Classic Bonushunt' },
  { date: '2026-11-14', time: '18:00', title: 'Supers Only Bonushunt' },
  { date: '2026-11-15', time: '18:00', title: 'Guest Stream & Bonushunt' },
]

export const KICK_URL = 'https://kick.com/luckandloadtv'

// Best moments from Kick, shown when we're offline. Thumbnails live in public/clips.
export const BEST_CLIPS = [
  {
    title: 'Max win on Zeus vs Hades: $13,500',
    image: '/clips/zeus-vs-hades-max-win.jpg',
    url: `${KICK_URL}/clips/clip_01M357FSZ7261ER41Q8S6DE2FJ`,
  },
  {
    title: '15.5k on Wanted',
    image: '/clips/wanted-15k.webp',
    url: `${KICK_URL}/clips/clip_01M0G6HCJDY4T9CRX5SKZ698FM`,
  },
  {
    title: '6.3k on Sugar Rush 1000',
    image: '/clips/sugar-rush-6k.webp',
    url: `${KICK_URL}/clips/clip_01M0ZNSX2N6ZDVFHVWWSHD0BV3`,
  },
  {
    title: '4.3k on Eternal Duel at a $0.40 bet',
    image: '/clips/eternal-duel-4k.webp',
    url: `${KICK_URL}/clips/clip_01KRY47KFA9S5M08Y0G9WCQYBW`,
  },
]

function partsInZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find(part => part.type === type)?.value ?? 0)
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute'), second: get('second') }
}

/** The UTC instant of a wall-clock time ('YYYY-MM-DD', 'HH:MM') in the given time zone. */
function zonedTime(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const guess = Date.UTC(year, month - 1, day, hour, minute)
  const p = partsInZone(new Date(guess), timeZone)
  const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - guess
  return new Date(guess - offset)
}

/** When this month's Hype Time ends: the last day of the month at 23:59 New York time. */
export function hypeTimeEnd(now = new Date()) {
  const timeZone = 'America/New_York'
  const p = partsInZone(now, timeZone)
  const lastDay = new Date(Date.UTC(p.year, p.month, 0)).getUTCDate()
  const date = `${p.year}-${String(p.month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return new Date(zonedTime(date, '23:59', timeZone).getTime() + 59_000)
}

export type UpcomingStream = {
  title: string
  start: Date
  daysAway: number // Calendar days from today in Norwegian time: 0 = today, 1 = tomorrow
  started: boolean // Inside the scheduled slot but not (yet) detected as live
}

/** Scheduled streams that haven't finished yet, soonest first. */
export function upcomingStreams(now = new Date()): UpcomingStream[] {
  const today = partsInZone(now, STREAM_TIME_ZONE)
  const todayUtc = Date.UTC(today.year, today.month - 1, today.day)
  return SCHEDULED_STREAMS.map(stream => {
    const start = zonedTime(stream.date, stream.time, STREAM_TIME_ZONE)
    const [year, month, day] = stream.date.split('-').map(Number)
    return {
      title: stream.title,
      start,
      daysAway: Math.round((Date.UTC(year, month - 1, day) - todayUtc) / 86_400_000),
      started: start.getTime() <= now.getTime(),
    }
  })
    .filter(stream => stream.start.getTime() + STREAM_HOURS * 3_600_000 > now.getTime())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}
