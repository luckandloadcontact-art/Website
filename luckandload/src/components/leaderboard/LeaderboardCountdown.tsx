'use client'

import { useEffect, useState } from 'react'

/** Tidssonens forskjell fra UTC (i ms) på et gitt tidspunkt -- bruker Intl i stedet for en egen
 *  offset-tabell, så dette håndterer sommer-/vintertid (CEST/CET) automatisk og korrekt. */
function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value ?? 0)
  const asUTC = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  return asUTC - date.getTime()
}

// Leaderboardet nullstilles i praksis ved månedsskiftet -- men "midnatt" skal vises i vår egen
// (norske) lokale tid, ikke UTC. UTC-midnatt er 1-2 timer senere enn midnatt i Norge (avhengig av
// sommer-/vintertid), noe som ga en forvirrende nedtelling som ikke traff kl. 00:00 lokalt.
function monthEndUTC(now: Date): Date {
  const offsetMs = getTimeZoneOffsetMs(now, 'Europe/Oslo')
  const osloNowAsUTC = new Date(now.getTime() + offsetMs)
  const nextMonthStartAsUTC = Date.UTC(osloNowAsUTC.getUTCFullYear(), osloNowAsUTC.getUTCMonth() + 1, 1, 0, 0, 0)
  return new Date(nextMonthStartAsUTC - offsetMs)
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return days > 0 ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

/** Live nedtelling til leaderboardet stenger (midnatt norsk tid ved månedsskiftet). Tikker
 * hvert sekund på klienten -- serveren vet ikke besøkerens klokke, så første render viser
 * "--:--:--" til useEffect har rukket å sette den faktiske tiden (unngår hydration mismatch). */
export function LeaderboardCountdown() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) return <>--:--:--</>

  return <>{formatCountdown(monthEndUTC(now).getTime() - now.getTime())}</>
}
