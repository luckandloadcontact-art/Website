'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { CalendarClock, ExternalLink, Tv } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BEST_CLIPS, KICK_URL, STREAM_TIME_ZONE, upcomingStreams } from '@/lib/stream'

const TWITCH_CHANNEL = 'luckandloadtv'
const KICK_CHANNEL = 'luckandloadtv'
const DISCORD_URL = 'https://discord.gg/yagZVjqqbr'

type StreamSlot = { title: string; day: string; time: string; localTime: string | null }

function describeUpcoming(): StreamSlot[] {
  return upcomingStreams().map(stream => {
    const time = stream.start.toLocaleTimeString('en-GB', { timeZone: STREAM_TIME_ZONE, hour: '2-digit', minute: '2-digit' })
    const localTime = stream.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    const day = stream.started
      ? 'Starting soon'
      : stream.daysAway === 0
        ? 'Today'
        : stream.daysAway === 1
          ? 'Tomorrow'
          : stream.start.toLocaleDateString('en-US', { timeZone: STREAM_TIME_ZONE, weekday: 'long' })
    return { title: stream.title, day, time, localTime: localTime === time ? null : localTime }
  })
}

export function LiveSection() {
  const [platform, setPlatform] = useState<'twitch' | 'kick'>('twitch')
  // Twitch sin embed krever et parent-domene som matcher siden den vises på (feiler ellers med
  // "cannot be embedded"). Hentes fra window i stedet for å hardkodes, slik at embeden også
  // virker på Vercel sine preview-URL-er og lokalt under utvikling, ikke bare på luckandloadtv.com.
  const [parentHost, setParentHost] = useState<string | null>(null)
  const [live, setLive] = useState<boolean | null>(null)
  const [upcoming, setUpcoming] = useState<StreamSlot[]>([])

  useEffect(() => {
    setParentHost(window.location.hostname)
    // Klokkeslett regnes ut i nettleseren, så besøkende også ser sendetiden i sin egen tidssone.
    setUpcoming(describeUpcoming())
    // Kick blokkerer kall fra Vercel sine servere, men tillater kall fra nettleseren på vårt domene
    // (CORS). Feiler kallet, vises offline-visningen som før.
    fetch(`https://kick.com/api/v2/channels/${KICK_CHANNEL}`, { headers: { Accept: 'application/json' } })
      .then(res => (res.ok ? res.json() : null))
      .then(data => setLive(data ? Boolean(data.livestream?.is_live) : null))
      .catch(() => setLive(null))
  }, [])

  return (
    <section className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Tv size={20} className="text-brand-500" />
            <h2 className="text-xl font-bold text-white">Live Stream</h2>
            {live && (
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-300">
                <span className="live-dot" />
                Live now
              </span>
            )}
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

        {!live && (
          <div className="mx-auto mb-6 grid max-w-4xl gap-6 md:grid-cols-[15rem_1fr]">
            <div className="rounded-2xl border border-white/10 bg-surface-800 p-5">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-400">
                <CalendarClock size={14} />
                Next stream
              </p>
              {upcoming.length > 0 ? (
                <>
                  <p className="text-2xl font-bold text-white">{upcoming[0].day}</p>
                  <p className="text-sm text-slate-300">{upcoming[0].time} Norwegian time</p>
                  {upcoming[0].localTime && <p className="text-xs text-slate-500">{upcoming[0].localTime} your time</p>}
                  <p className="mt-2 text-sm font-semibold text-white">{upcoming[0].title}</p>
                  {upcoming.length > 1 && (
                    <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-xs">
                      {upcoming.slice(1, 4).map(slot => (
                        <li key={`${slot.day}-${slot.time}-${slot.title}`} className="flex justify-between gap-3">
                          <span className="text-slate-300">{slot.title}</span>
                          <span className="shrink-0 text-slate-500">
                            {slot.day} {slot.time}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-400">The next schedule is coming soon. Follow us to hear when we go live.</p>
              )}
              <a
                href={KICK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-green-400"
              >
                Follow on Kick
              </a>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-center text-xs text-slate-400 underline underline-offset-2 hover:text-white"
              >
                Get notified in our Discord
              </a>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-white">Missed a stream? Our best moments</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BEST_CLIPS.map(clip => (
                  <a
                    key={clip.url}
                    href={clip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-surface-800">
                      <Image
                        src={clip.image}
                        alt={clip.title}
                        width={360}
                        height={203}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-1.5 text-xs leading-snug text-slate-300 group-hover:text-white">{clip.title}</p>
                  </a>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <a
                  href={`${KICK_URL}/videos`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300"
                >
                  Watch past streams <ExternalLink size={13} />
                </a>
                <a
                  href={`${KICK_URL}/clips`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300"
                >
                  All clips <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </section>
  )
}
