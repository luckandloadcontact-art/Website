'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

// Avatarer kommer fra Hype.bet sine egne (skiftende) S3-buckets, så vi bruker et vanlig
// <img>-tag i stedet for next/image (som krever en fast, forhåndsgodkjent liste over domener).
export function PlayerAvatar({
  src,
  name,
  size = 40,
  className,
}: {
  src?: string | null
  name: string
  size?: number
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden rounded-full bg-surface-600 flex items-center justify-center',
        className
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="text-slate-300 font-bold" style={{ fontSize: size * 0.36 }}>
          {initials}
        </span>
      )}
    </div>
  )
}
