'use client'

import { useEffect, useState } from 'react'
import { LEADERBOARD_REVALIDATE_SECONDS } from '@/lib/utils'

/** Live nedtelling til neste gang leaderboardet faktisk kan hente ferske tall fra Affilka
 * (samme 6-minutters-vindu som håndheves av den delte cachen i lib/affilka.ts). Rent
 * informativt -- selve sperren skjer server-side uansett, denne viser bare hvor lenge det er
 * igjen slik at det ikke er uklart hvorfor tallene ikke endrer seg med en gang. */
export function NextRefreshCountdown({ updatedAt }: { updatedAt: string }) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) return null

  const nextRefreshAt = new Date(updatedAt).getTime() + LEADERBOARD_REVALIDATE_SECONDS * 1000
  const remainingMs = nextRefreshAt - now.getTime()

  if (remainingMs <= 0) return <>Next refresh available now</>

  const totalSeconds = Math.ceil(remainingMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return (
    <>
      Next possible refresh in {minutes}:{String(seconds).padStart(2, '0')}
    </>
  )
}
