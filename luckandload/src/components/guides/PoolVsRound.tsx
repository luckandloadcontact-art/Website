import { ArrowDown, PieChart, Rocket, type LucideIcon } from 'lucide-react'

// Explains the two meanings of "multiplayer casino" with one worked example: the same three players
// put in $50, $30 and $20. In a room the money is pooled and one result is split by share; in a
// crash-style round everyone bets on their own and gets their own result.
const PLAYERS = [
  { id: 'A', stake: 50, dot: 'bg-hype text-black', bar: 'bg-hype' },
  { id: 'B', stake: 30, dot: 'bg-sky-500 text-white', bar: 'bg-sky-500' },
  { id: 'C', stake: 20, dot: 'bg-violet-500 text-white', bar: 'bg-violet-500' },
]

// Shared pool: the room wins $200 on one bonus, split 50/30/20.
const POOL_WIN = 200
const POOL_TOTAL = PLAYERS.reduce((sum, p) => sum + p.stake, 0)

// Shared round: everyone rides the same crash round and decides on their own when to cash out.
const ROUND = [
  { id: 'A', note: 'cashes out at 2x', result: 50 },
  { id: 'B', note: 'waits too long', result: -30 },
  { id: 'C', note: 'cashes out at 1.5x', result: 10 },
]

function money(value: number) {
  return `${value < 0 ? '−' : '+'}$${Math.abs(value)}`
}

function Dot({ id }: { id: string }) {
  const player = PLAYERS.find(p => p.id === id)!
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${player.dot}`}>
      {id}
    </span>
  )
}

function Step({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-400">
      <ArrowDown size={14} className="text-slate-500" />
      {children}
    </div>
  )
}

function Card({
  Icon,
  title,
  tag,
  highlight,
  takeaway,
  decides,
  children,
}: {
  Icon: LucideIcon
  title: string
  tag: string
  highlight?: boolean
  takeaway: string
  decides: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-5 sm:p-6 ${
        highlight
          ? 'border-hype/40 bg-gradient-to-br from-hype/[0.10] via-hype/[0.03] to-transparent shadow-[0_0_40px_-14px_rgba(28,228,121,0.35)]'
          : 'border-white/10 bg-surface-800'
      }`}
    >
      <div className="mb-5 flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            highlight ? 'bg-hype text-black' : 'bg-white/10 text-slate-300'
          }`}
        >
          <Icon size={22} strokeWidth={2.25} />
        </span>
        <div>
          <p className="text-lg font-bold leading-tight text-white">{title}</p>
          <p className={`text-xs font-semibold uppercase tracking-wide ${highlight ? 'text-hype' : 'text-slate-500'}`}>{tag}</p>
        </div>
      </div>

      {/* The same three players in both examples */}
      <div className="grid grid-cols-3 gap-2">
        {PLAYERS.map(p => (
          <div key={p.id} className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-black/20 px-2 py-2">
            <Dot id={p.id} />
            <span className="text-sm font-bold tabular-nums text-white">${p.stake}</span>
          </div>
        ))}
      </div>

      <div className="flex-1">{children}</div>

      <p className={`mt-4 text-center text-sm font-bold ${highlight ? 'text-hype' : 'text-slate-200'}`}>{takeaway}</p>
      <p className="mt-1 text-center text-xs text-slate-500">{decides}</p>
    </div>
  )
}

export function PoolVsRound() {
  return (
    <figure className="mb-6 max-w-4xl">
      <div className="grid gap-4 md:grid-cols-2">
        <Card
          Icon={PieChart}
          title="Shared pool"
          tag="Multiplayer room"
          highlight
          takeaway="One result, split by share"
          decides="The host picks the slot and the bet size"
        >
          <Step>Everyone adds to one pool</Step>
          <div className="rounded-xl border border-hype/30 bg-black/25 p-3">
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className="font-semibold text-white">Pool</span>
              <span className="font-bold tabular-nums text-white">${POOL_TOTAL}</span>
            </div>
            <div className="flex h-7 overflow-hidden rounded-md text-[11px] font-bold">
              {PLAYERS.map(p => (
                <div
                  key={p.id}
                  className={`flex items-center justify-center ${p.bar} ${p.id === 'A' ? 'text-black' : 'text-white'}`}
                  style={{ width: `${(p.stake / POOL_TOTAL) * 100}%` }}
                >
                  {p.id} {Math.round((p.stake / POOL_TOTAL) * 100)}%
                </div>
              ))}
            </div>
          </div>
          <Step>A bonus wins ${POOL_WIN} for the room</Step>
          <div className="grid grid-cols-3 gap-2">
            {PLAYERS.map(p => (
              <div key={p.id} className="flex items-center justify-center gap-2 rounded-lg border border-hype/30 bg-hype/10 px-2 py-2">
                <Dot id={p.id} />
                <span className="text-sm font-black tabular-nums text-hype">{money((POOL_WIN * p.stake) / POOL_TOTAL)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          Icon={Rocket}
          title="Shared round"
          tag="Crash-style games"
          takeaway="Same game, separate results"
          decides="Every player places their own bet and cashes out on their own"
        >
          <Step>Everyone bets on the same round</Step>
          <ul className="space-y-1.5 rounded-xl border border-white/10 bg-black/25 p-3">
            {ROUND.map(r => (
              <li key={r.id} className="flex items-center gap-2 text-sm text-slate-300">
                <Dot id={r.id} />
                {r.note}
              </li>
            ))}
          </ul>
          <Step>Each player gets their own result</Step>
          <div className="grid grid-cols-3 gap-2">
            {ROUND.map(r => (
              <div
                key={r.id}
                className={`flex items-center justify-center gap-2 rounded-lg border px-2 py-2 ${
                  r.result >= 0 ? 'border-hype/30 bg-hype/10' : 'border-red-500/30 bg-red-500/10'
                }`}
              >
                <Dot id={r.id} />
                <span className={`text-sm font-black tabular-nums ${r.result >= 0 ? 'text-hype' : 'text-red-400'}`}>{money(r.result)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <figcaption className="mt-2 text-xs leading-5 text-slate-400">
        The same three players and the same $100 in both examples. Made-up numbers, to show how the money moves.
      </figcaption>
    </figure>
  )
}
