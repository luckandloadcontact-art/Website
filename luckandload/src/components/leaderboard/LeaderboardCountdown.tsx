'use client'

import { useEffect, useState } from 'react'

function monthEndUTC(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0))
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

/** Live nedtelling til leaderboardet stenger (midnatt UTC ved månedsskiftet). Tikker hvert
 * sekund på klienten -- serveren vet ikke besøkerens klokke, så første render viser "--:--:--"
 * til useEffect har rukket å sette den faktiske tiden (unngår hydration mismatch). */
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
