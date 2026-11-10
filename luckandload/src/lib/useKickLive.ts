'use client'

import { useEffect, useState } from 'react'

export type KickLiveStatus = 'checking' | 'live' | 'offline' | 'unknown'

const KICK_CHANNEL = 'luckandloadtv'

// One request per page load, shared by every component that asks (the hero badge and the stream
// section). Kick blocks calls from Vercel's servers but allows them from the browser on our domain.
let request: Promise<KickLiveStatus> | null = null

function fetchStatus(): Promise<KickLiveStatus> {
  if (!request) {
    request = fetch(`https://kick.com/api/v2/channels/${KICK_CHANNEL}`, { headers: { Accept: 'application/json' } })
      .then(res => (res.ok ? res.json() : null))
      .then(data => (data ? (data.livestream?.is_live ? 'live' : 'offline') : 'unknown') as KickLiveStatus)
      .catch(() => 'unknown' as KickLiveStatus)
  }
  return request
}

export function useKickLive(): KickLiveStatus {
  const [status, setStatus] = useState<KickLiveStatus>('checking')
  useEffect(() => {
    let active = true
    fetchStatus().then(s => active && setStatus(s))
    return () => {
      active = false
    }
  }, [])
  return status
}
