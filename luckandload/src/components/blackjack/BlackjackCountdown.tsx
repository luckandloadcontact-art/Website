'use client'

import { useEffect, useState } from 'react'
import { nextBlackjackResetUTC } from '@/lib/blackjack'

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

/** Live nedtelling til nye hender kl. 18:00 norsk tid -- samme tidspunkt for alle spillere,
 * uansett hvor de selv befinner seg. Tikker hvert sekund på klienten. */
export function BlackjackCountdown() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) return <>⏰ New hands in --:--:--</>

  return <>⏰ New hands in {formatCountdown(nextBlackjackResetUTC(now).getTime() - now.getTime())}</>
}
