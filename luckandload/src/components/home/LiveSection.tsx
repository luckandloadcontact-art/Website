'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { CalendarClock, ExternalLink, Play, Tv } from 'lucide-react'
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
  // 'unknown' = Kick couldn't be reached. Then both the player and the schedule are shown, so a
  // live stream is never hidden by a failed check.
  const [status, setStatus] = useState<'checking' | 'live' | 'offline' | 'unknown'>('checking')
  const [upcoming, setUpcoming] = useState<StreamSlot[]>([])
  const showPlayer = status === 'live' || status === 'unknown'
  const showSchedule = status !== 'live'

  useEffect(() => {
    setParentHost(window.location.hostname)
    // Klokkeslett regnes ut i nettleseren, så besøkende også ser sendetiden i sin egen tidssone.
    setUpcoming(describeUpcoming())
    // Kick blokkerer kall fra Vercel sine servere, men tillater kall fra nettleseren på vårt domene
    // (CORS). Offline vises neste sending og klipp i stedet for spilleren, live vises spilleren.
    fetch(`https://kick.com/api/v2/channels/${KICK_CHANNEL}`, { headers: { Accept: 'application/json' } })
      .then(res => (res.ok ? res.json() : null))
      .then(data => setStatus(data ? (data.livestream?.is_live ? 'live' : 'offline') : 'unknown'))
      .catch(() => setStatus('unknown'))
  }, [])

  return (
    <section className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Tv size={20} className="text-brand-500" />
            <h2 className="text-xl font-bold text-white">{status === 'offline' ? 'Stream Schedule' : 'Live Stream'}</h2>
            {status === 'live' && (
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-300">
                <span className="live-dot" />
                Live now
              </span>
            )}
          </div>

          {showPlayer && (
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
          )}
        </div>

        {showSchedule && (
          <div className={cn('mx-auto grid max-w-5xl gap-6 md:grid-cols-[17rem_1fr]', showPlayer && 'mb-6')}>
            <div className="flex flex-col rounded-2xl border border-white/10 bg-surface-800 p-6">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-400">
                <CalendarClock size={14} />
                Next stream
              </p>
              {upcoming.length > 0 ? (
                <>
                  <p className="text-3xl font-bold text-white">{upcoming[0].day}</p>
                  <p className="mt-0.5 text-sm text-slate-300">
                    {upcoming[0].time} Norwegian time
                    {upcoming[0].localTime && <span className="text-slate-500"> · {upcoming[0].localTime} yours</span>}
                  </p>
                  <p className="mt-3 inline-flex w-fit rounded-lg bg-brand-500/10 px-2.5 py-1 text-sm font-semibold text-brand-300">
                    {upcoming[0].title}
                  </p>
                  {upcoming.length > 1 && (
                    <>
                      <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Later this week</p>
                      <ul className="mt-2 divide-y divide-white/5 text-sm">
                        {upcoming.slice(1, 4).map(slot => (
                          <li key={`${slot.day}-${slot.time}-${slot.title}`} className="flex items-baseline justify-between gap-3 py-2">
                            <span className="text-slate-200">{slot.title}</span>
                            <span className="shrink-0 text-xs text-slate-500">
                              {slot.day} {slot.time}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-400">The next schedule is coming soon. Follow us to hear when we go live.</p>
              )}
              <a
                href={KICK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-green-400"
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
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
                <p className="text-base font-semibold text-white">Missed a stream? Our best moments</p>
                <div className="flex gap-4 text-sm">
                  <a
                    href={`${KICK_URL}/videos`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300"
                  >
                    Past streams <ExternalLink size={13} />
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
              <div className="grid gap-4 sm:grid-cols-2">
                {BEST_CLIPS.map(clip => (
                  <a
                    key={clip.url}
                    href={clip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-video overflow-hidden rounded-xl border border-white/10 bg-surface-800"
                  >
                    <Image
                      src={clip.image}
                      alt={clip.title}
                      width={360}
                      height={203}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-80 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-green-500 group-hover:text-black group-hover:opacity-100">
                      <Play size={20} className="ml-0.5 fill-current" />
                    </span>
                    <p className="absolute inset-x-3 bottom-2.5 text-sm font-semibold leading-snug text-white">{clip.title}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {showPlayer && (
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
        )}
      </div>
    </section>
  )
}
