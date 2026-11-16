'use client'

import { useEffect, useState } from 'react'
import { Eye, Trophy } from 'lucide-react'
import { ScaledFrame } from '@/components/overlay/ScaledFrame'
import { LeaderboardCountdown } from '@/components/leaderboard/LeaderboardCountdown'

// A wide, low info bar for the stream overlay: live viewers (Kick + Twitch), Kick followers, the
// leaderboard countdown, BTC/ETH prices and the clock in Norwegian time. Everything is fetched in
// the browser (OBS), which Kick, decapi.me and CoinGecko all allow.
import type { TickerItem } from '@/components/overlay/tickerItems'

const KICK_CHANNEL = 'luckandloadtv'
const TWITCH_CHANNEL = 'luckandloadtv'
const REFRESH_MS = 60_000

type Kick = { viewers: number | null; followers: number | null }
type Coin = { usd: number; change: number }

function useEvery(fn: () => void, ms: number) {
  useEffect(() => {
    fn()
    const id = setInterval(fn, ms)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms])
}

function useKick(): Kick {
  const [kick, setKick] = useState<Kick>({ viewers: null, followers: null })
  useEvery(() => {
    fetch(`https://kick.com/api/v2/channels/${KICK_CHANNEL}`, { headers: { Accept: 'application/json' } })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!data) return
        setKick({
          viewers: data.livestream?.is_live ? Number(data.livestream.viewer_count ?? 0) : 0,
          followers: typeof data.followers_count === 'number' ? data.followers_count : null,
        })
      })
      .catch(() => {})
  }, REFRESH_MS)
  return kick
}

function useTwitchViewers(): number | null {
  const [viewers, setViewers] = useState<number | null>(null)
  useEvery(() => {
    // Plain text: a number when live, "<channel> is offline" when not.
    fetch(`https://decapi.me/twitch/viewercount/${TWITCH_CHANNEL}`)
      .then(res => (res.ok ? res.text() : null))
      .then(text => {
        if (text === null) return
        const n = Number(text.trim())
        setViewers(Number.isFinite(n) ? n : 0)
      })
      .catch(() => {})
  }, REFRESH_MS)
  return viewers
}

function useCrypto(): { btc: Coin | null; eth: Coin | null } {
  const [prices, setPrices] = useState<{ btc: Coin | null; eth: Coin | null }>({ btc: null, eth: null })
  useEvery(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!data?.bitcoin) return
        setPrices({
          btc: { usd: data.bitcoin.usd, change: data.bitcoin.usd_24h_change ?? 0 },
          eth: { usd: data.ethereum.usd, change: data.ethereum.usd_24h_change ?? 0 },
        })
      })
      .catch(() => {})
  }, REFRESH_MS)
  return prices
}

/** Minutes between Oslo time and UTC, so the label is CET in winter and CEST in summer. */
function osloOffsetMinutes(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Oslo',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value ?? 0)
  const asUTC = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))
  return Math.round((asUTC - Math.floor(date.getTime() / 60_000) * 60_000) / 60_000)
}

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEvery(() => setNow(new Date()), 1000)
  if (!now) return null
  const time = now.toLocaleTimeString('en-GB', { timeZone: 'Europe/Oslo', hour: '2-digit', minute: '2-digit' })
  const date = now
    .toLocaleDateString('en-GB', { timeZone: 'Europe/Oslo', day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/ /g, '-')
    .toUpperCase()
  const zone = osloOffsetMinutes(now) >= 120 ? 'CEST' : 'CET'
  return { time, zone, date }
}

const fmt = (n: number) => n.toLocaleString('en-US')
const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

function Divider() {
  return <span className="h-5 w-px shrink-0 bg-white/15" />
}

function Badge({ letter, className }: { letter: string; className: string }) {
  return (
    <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] text-[11px] font-black ${className}`}>
      {letter}
    </span>
  )
}

function Change({ value }: { value: number }) {
  const up = value >= 0
  return (
    <span className={`text-[12px] font-bold tabular-nums ${up ? 'text-hype' : 'text-red-400'}`}>
      {up ? '▲' : '▼'} {Math.abs(value).toFixed(1)}%
    </span>
  )
}

export function Ticker({ items }: { items: TickerItem[] }) {
  const kick = useKick()
  const twitch = useTwitchViewers()
  const { btc, eth } = useCrypto()
  const clock = useClock()

  const totalViewers = kick.viewers === null && twitch === null ? null : (kick.viewers ?? 0) + (twitch ?? 0)

  const parts: Record<TickerItem, React.ReactNode> = {
    viewers: (
      <div className="flex items-center gap-2">
        <Eye size={17} strokeWidth={2.5} className="text-hype" />
        <span className="text-[16px] font-black tabular-nums text-white">{totalViewers === null ? '–' : fmt(totalViewers)}</span>
        <span className="flex items-center gap-1.5 text-[12px] font-bold tabular-nums text-slate-400">
          <Badge letter="K" className="bg-[#53fc18] text-black" />
          {kick.viewers === null ? '–' : fmt(kick.viewers)}
          <Badge letter="T" className="ml-1 bg-[#9146ff] text-white" />
          {twitch === null ? '–' : fmt(twitch)}
        </span>
      </div>
    ),
    followers: (
      <div className="flex items-center gap-2">
        <Badge letter="K" className="bg-[#53fc18] text-black" />
        <span className="text-[16px] font-black tabular-nums text-white">{kick.followers === null ? '–' : fmt(kick.followers)}</span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">followers</span>
      </div>
    ),
    leaderboard: (
      <div className="flex items-center gap-2">
        <Trophy size={16} strokeWidth={2.5} className="text-amber-300" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">$1,000 leaderboard</span>
        <span className="text-[15px] font-black tabular-nums text-white">
          <LeaderboardCountdown />
        </span>
      </div>
    ),
    btc: (
      <div className="flex items-center gap-2">
        <Badge letter="₿" className="bg-[#f7931a] text-white" />
        <span className="text-[16px] font-black tabular-nums text-white">{btc ? usd(btc.usd) : '–'}</span>
        {btc && <Change value={btc.change} />}
      </div>
    ),
    eth: (
      <div className="flex items-center gap-2">
        <Badge letter="Ξ" className="bg-[#627eea] text-white" />
        <span className="text-[16px] font-black tabular-nums text-white">{eth ? usd(eth.usd) : '–'}</span>
        {eth && <Change value={eth.change} />}
      </div>
    ),
    clock: (
      <div className="flex items-baseline gap-2">
        <span className="text-[16px] font-black tabular-nums text-white">{clock?.time ?? '--:--'}</span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {clock ? `${clock.zone} ${clock.date}` : ''}
        </span>
      </div>
    ),
  }

  return (
    <ScaledFrame width={1120} height={40}>
      <div className="flex h-full w-full items-center justify-center gap-5 rounded-[12px] border-2 border-indigo-400/40 bg-gradient-to-r from-[#161a3a] to-[#0f1229] px-5">
        {items.map((item, i) => (
          <div key={item} className="flex items-center gap-5">
            {i > 0 && <Divider />}
            {parts[item]}
          </div>
        ))}
      </div>
    </ScaledFrame>
  )
}
