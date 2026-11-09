'use client'

import { useEffect, useState } from 'react'

// Renders an overlay at a fixed design size and scales it to fill the OBS browser source, so the
// source can be any size with the same aspect ratio. Covers the page, which is transparent.
export function ScaledFrame({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const resize = () => setScale(Math.min(window.innerWidth / width, window.innerHeight / height))
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [width, height])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      <style>{'html,body{background:transparent!important;overflow:hidden}'}</style>
      <div style={{ width, height, transform: `scale(${scale})` }} className="relative shrink-0 font-sans">
        {children}
      </div>
    </div>
  )
}
