'use client'

import { useEffect, useState } from 'react'
import { Clock, Eye } from 'lucide-react'
import { ScaledFrame } from '@/components/overlay/ScaledFrame'
import type { TickerItem } from '@/components/overlay/tickerItems'

// A wide, low info bar for the stream overlay: live viewers (Kick + Twitch added together), BTC and
// ETH prices, and the date and time in Norwegian time. Everything is fetched in the browser (OBS),
// which Kick, decapi.me and CoinGecko all allow.
const KICK_CHANNEL = 'luckandloadtv'
const TWITCH_CHANNEL = 'luckandloadtv'
const REFRESH_MS = 60_000

type Coin = { usd: number; change: number }

function useEvery(fn: () => void, ms: number) {
  useEffect(() => {
    fn()
    const id = setInterval(fn, ms)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms])
}

/** Kick + Twitch viewers together. Null until at least one of them has answered. */
function useViewers(): number | null {
  const [kick, setKick] = useState<number | null>(null)
  const [twitch, setTwitch] = useState<number | null>(null)
  useEvery(() => {
    fetch(`https://kick.com/api/v2/channels/${KICK_CHANNEL}`, { headers: { Accept: 'application/json' } })
      .then(res => (res.ok ? res.json() : null))
      .then(data => data && setKick(data.livestream?.is_live ? Number(data.livestream.viewer_count ?? 0) : 0))
      .catch(() => {})
    // Plain text: a number when live, "<channel> is offline" when not.
    fetch(`https://decapi.me/twitch/viewercount/${TWITCH_CHANNEL}`)
      .then(res => (res.ok ? res.text() : null))
      .then(text => {
        if (text === null) return
        const n = Number(text.trim())
        setTwitch(Number.isFinite(n) ? n : 0)
      })
      .catch(() => {})
  }, REFRESH_MS)
  return kick === null && twitch === null ? null : (kick ?? 0) + (twitch ?? 0)
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

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEvery(() => setNow(new Date()), 1000)
  if (!now) return null
  const time = now.toLocaleTimeString('en-GB', { timeZone: 'Europe/Oslo', hour: '2-digit', minute: '2-digit' })
  const date = now
    .toLocaleDateString('en-GB', { timeZone: 'Europe/Oslo', day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
  return { time, date }
}

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

function BitcoinLogo() {
  return (
    <svg viewBox="0 0 32 32" className="h-[22px] w-[22px] shrink-0" aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        fill="#fff"
        d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
      />
    </svg>
  )
}

function EthereumLogo() {
  return (
    <svg viewBox="0 0 32 32" className="h-[22px] w-[22px] shrink-0" aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <g fill="#fff">
        <path fillOpacity=".6" d="M16.498 4v8.87l7.497 3.35z" />
        <path d="M16.498 4L9 16.22l7.498-3.35z" />
        <path fillOpacity=".6" d="M16.498 21.968v6.027L24 17.616z" />
        <path d="M16.498 27.995v-6.028L9 17.616z" />
        <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" />
        <path fillOpacity=".6" d="M9 16.22l7.498 4.353v-7.701z" />
      </g>
    </svg>
  )
}

function Change({ value }: { value: number }) {
  const up = value >= 0
  return (
    <span className={`text-[13px] font-bold tabular-nums ${up ? 'text-hype' : 'text-red-400'}`}>
      {up ? '▲' : '▼'} {Math.abs(value).toFixed(1)}%
    </span>
  )
}

export function Ticker({ items }: { items: TickerItem[] }) {
  const viewers = useViewers()
  const { btc, eth } = useCrypto()
  const clock = useClock()

  const parts: Record<TickerItem, React.ReactNode> = {
    viewers: (
      <div className="flex items-center gap-2">
        <Eye size={20} strokeWidth={2.5} className="text-hype" />
        <span className="text-[17px] font-black tabular-nums text-white">
          {viewers === null ? '–' : viewers.toLocaleString('en-US')}
        </span>
      </div>
    ),
    btc: (
      <div className="flex items-center gap-2">
        <BitcoinLogo />
        <span className="text-[17px] font-black tabular-nums text-white">{btc ? usd(btc.usd) : '–'}</span>
        {btc && <Change value={btc.change} />}
      </div>
    ),
    eth: (
      <div className="flex items-center gap-2">
        <EthereumLogo />
        <span className="text-[17px] font-black tabular-nums text-white">{eth ? usd(eth.usd) : '–'}</span>
        {eth && <Change value={eth.change} />}
      </div>
    ),
    clock: (
      <div className="flex items-center gap-2">
        <Clock size={19} strokeWidth={2.5} className="text-slate-300" />
        <span className="text-[17px] font-black tabular-nums text-white">{clock?.time ?? '--:--'}</span>
        <span className="text-[13px] font-bold tabular-nums text-slate-400">{clock?.date ?? ''}</span>
      </div>
    ),
  }

  return (
    <ScaledFrame width={760} height={40}>
      <div className="flex h-full w-full items-center justify-center gap-5 rounded-[12px] border-2 border-indigo-400/40 bg-gradient-to-r from-[#161a3a] to-[#0f1229] px-5">
        {items.map((item, i) => (
          <div key={item} className="flex items-center gap-5">
            {i > 0 && <span className="h-5 w-px shrink-0 bg-white/15" />}
            {parts[item]}
          </div>
        ))}
      </div>
    </ScaledFrame>
  )
}
