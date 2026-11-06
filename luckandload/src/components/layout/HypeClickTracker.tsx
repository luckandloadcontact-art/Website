'use client'
import { useEffect } from 'react'

// Counts clicks on every link to Hype.bet from one place, so new links are tracked automatically.
// Sends only the current page path: no cookie, user id or other identifier.
export function HypeClickTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.type === 'auxclick' && event.button !== 1) return // Middle click only
      if (!(event.target instanceof Element)) return
      const link = event.target.closest('a')
      if (!link || (link.hostname !== 'hype.bet' && !link.hostname.endsWith('.hype.bet'))) return
      navigator.sendBeacon('/api/hype-click', JSON.stringify({ path: window.location.pathname }))
    }

    document.addEventListener('click', handleClick, true)
    document.addEventListener('auxclick', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('auxclick', handleClick, true)
    }
  }, [])

  return null
}
