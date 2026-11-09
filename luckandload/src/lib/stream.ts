// Stream schedule and highlights for the offline view on the home page. Safe to import from client
// components (no server-only imports).

// When we usually go live, in Norwegian time. 0 = Sunday, 1 = Monday ... 6 = Saturday.
export const STREAM_SCHEDULE = {
  timeZone: 'Europe/Oslo',
  days: [0, 1, 2, 4, 5],
  hour: 18,
  minute: 0,
  durationHours: 3,
}

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

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function partsInZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    weekday: 'short',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => parts.find(part => part.type === type)?.value ?? '0'
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    second: Number(get('second')),
    weekday: WEEKDAYS.indexOf(get('weekday')),
  }
}

/** The UTC instant of a wall-clock time in the given time zone. */
function zonedTime(year: number, month: number, day: number, hour: number, minute: number, timeZone: string) {
  const guess = Date.UTC(year, month - 1, day, hour, minute)
  const p = partsInZone(new Date(guess), timeZone)
  const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - guess
  return new Date(guess - offset)
}

/**
 * The next scheduled stream that hasn't finished yet. daysAway counts calendar days in Norwegian
 * time (0 = today, 1 = tomorrow). started is true while we're inside a scheduled slot.
 */
export function nextScheduledStream(now = new Date()) {
  const { timeZone, days, hour, minute, durationHours } = STREAM_SCHEDULE
  const today = partsInZone(now, timeZone)
  for (let daysAway = 0; daysAway <= 7; daysAway++) {
    const date = new Date(Date.UTC(today.year, today.month - 1, today.day + daysAway))
    if (!days.includes(date.getUTCDay())) continue
    const start = zonedTime(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), hour, minute, timeZone)
    if (start.getTime() + durationHours * 3_600_000 > now.getTime()) {
      return { start, daysAway, started: start.getTime() <= now.getTime() }
    }
  }
  return null
}
