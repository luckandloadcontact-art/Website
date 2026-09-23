'use client'

import { useEffect, useState } from 'react'
import { Tv } from 'lucide-react'
import { cn } from '@/lib/utils'

const TWITCH_CHANNEL = 'luckandloadtv'
const KICK_CHANNEL = 'luckandloadtv'

export function LiveSection() {
  const [platform, setPlatform] = useState<'twitch' | 'kick'>('twitch')
  // Twitch sin embed krever et parent-domene som matcher siden den vises på (feiler ellers med
  // "cannot be embedded"). Hentes fra window i stedet for å hardkodes, slik at embeden også
  // virker på Vercel sine preview-URL-er og lokalt under utvikling, ikke bare på luckandloadtv.com.
  const [parentHost, setParentHost] = useState<string | null>(null)

  useEffect(() => {
    setParentHost(window.location.hostname)
  }, [])

  return (
    <section className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Tv size={20} className="text-brand-500" />
            <h2 className="text-xl font-bold text-white">Live Stream</h2>
          </div>

          <div className="flex rounded-full border border-white/10 bg-surface-800 p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setPlatform('twitch')}
              className={cn(
                'rounded-full px-4 py-1.5 transition-colors',
                platform === 'twitch' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:text-white'
              )}
            >
              Twitch
            </button>
            <button
              type="button"
              onClick={() => setPlatform('kick')}
              className={cn(
                'rounded-full px-4 py-1.5 transition-colors',
                platform === 'kick' ? 'bg-green-500/20 text-green-300' : 'text-slate-400 hover:text-white'
              )}
            >
              Kick
            </button>
          </div>
        </div>

        <div className="mx-auto aspect-video max-w-4xl overflow-hidden rounded-2xl border border-white/8 bg-black">
          {!parentHost ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading stream…</div>
          ) : platform === 'twitch' ? (
            <iframe
              key="twitch"
              title="LuckAndLoadTV on Twitch"
              src={`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${parentHost}&muted=true`}
              className="h-full w-full"
              allowFullScreen
            />
          ) : (
            <iframe
              key="kick"
              title="LuckAndLoadTV on Kick"
              src={`https://player.kick.com/${KICK_CHANNEL}`}
              className="h-full w-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          )}
        </div>

        <p className="mx-auto mt-3 max-w-4xl text-center text-xs text-slate-500">
          Shows an offline screen automatically when we&apos;re not live.
        </p>
      </div>
    </section>
  )
}
