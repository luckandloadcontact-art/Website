import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { RevealGroup } from '@/components/ui/RevealGroup'

// How a multiplayer room splits a win: players deposit into a shared pool, the host plays, and the
// round win is paid out by each player's % share. Used on the home page and in the multiplayer guide.
const ROOM_PLAYERS = [
  { name: 'LuckAndLoadTV', initial: 'L', balance: '250.00', pct: '50.00%', profit: '+$50', isHost: true },
  { name: 'Eric_The_Small', initial: 'E', balance: '100.00', pct: '20.00%', profit: '+$20' },
  { name: 'Albert',         initial: 'A', balance: '100.00', pct: '20.00%', profit: '+$20' },
  { name: 'Einstein',       initial: 'E', balance: '50.00',  pct: '10.00%', profit: '+$10' },
]

export function RoomFlow() {
  return (
    <div className="rounded-2xl border border-white/8 bg-surface-800 p-6">
      <p className="text-slate-500 text-xs text-right mb-5">All players get their % share</p>

      <RevealGroup className="grid grid-cols-1 sm:grid-cols-[1fr_48px_1fr] gap-4 sm:gap-x-0 sm:gap-y-0">

        {/* TOP-LEFT: Players deposit */}
        <div className="reveal-item rounded-xl border border-brand-500/30 bg-surface-700 p-5">
          <p className="text-brand-400 text-[11px] font-bold uppercase tracking-widest mb-4">Players deposit</p>
          <div className="space-y-3">
            {ROOM_PLAYERS.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${p.isHost ? 'bg-brand-500/30 text-brand-300' : 'bg-surface-600 text-slate-400'}`}>
                  {p.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-semibold truncate ${p.isHost ? 'text-brand-300' : 'text-slate-200'}`}>{p.name}</span>
                    {p.isHost && <span className="text-[9px] bg-brand-500/20 text-brand-400 px-1.5 py-0.5 rounded-full font-bold shrink-0">HOST</span>}
                  </div>
                  <p className="text-slate-500 text-[11px]">{p.pct}</p>
                </div>
                <span className="text-white text-sm font-bold shrink-0">${p.balance}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow → */}
        <div className="reveal-item hidden sm:flex items-center justify-center" style={{ transitionDelay: '200ms' }}>
          <ArrowRight size={24} strokeWidth={2} className="text-slate-500" />
        </div>

        {/* TOP-RIGHT: Total balance */}
        <div style={{ transitionDelay: '350ms' }} className="reveal-item rounded-xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-surface-700 p-5 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-slate-400 text-[11px] uppercase tracking-widest">Shared Pool</p>
          <p className="text-white font-black text-4xl">$500</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-7 w-7 rounded-full bg-brand-500/30 flex items-center justify-center text-xs font-black text-brand-300">L</div>
            <div className="text-left">
              <p className="text-white text-xs font-semibold leading-none">LuckAndLoadTV</p>
              <p className="text-brand-400 text-[10px]">plays the slots</p>
            </div>
          </div>
        </div>

        {/* ROW 2: spacer / spacer / arrow ↓ */}
        <div className="hidden sm:block py-3" />
        <div className="hidden sm:block" />
        <div className="reveal-item hidden sm:flex items-center justify-center py-3" style={{ transitionDelay: '550ms' }}>
          <ArrowDown size={24} strokeWidth={2} className="text-slate-500" />
        </div>

        {/* BOTTOM-LEFT: Payouts */}
        <div style={{ transitionDelay: '1100ms' }} className="reveal-item order-4 sm:order-none rounded-xl border border-green-500/25 bg-gradient-to-br from-green-500/10 to-surface-700 p-5">
          <p className="text-green-400 text-[11px] font-bold uppercase tracking-widest mb-4">Your payout</p>
          <div className="space-y-3">
            {[
              { name: 'LuckAndLoadTV', initial: 'L', pct: '50%', win: '$50', host: true },
              { name: 'Eric_The_Small', initial: 'E', pct: '20%', win: '$20', host: false },
              { name: 'Albert',         initial: 'A', pct: '20%', win: '$20', host: false },
              { name: 'Einstein',       initial: 'E', pct: '10%', win: '$10', host: false },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${p.host ? 'bg-green-500/20 text-green-300' : 'bg-surface-600 text-slate-400'}`}>
                  {p.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs font-semibold truncate">{p.name}</p>
                  <p className="text-slate-500 text-[11px]">{p.pct} share</p>
                </div>
                <span className="text-green-400 text-sm font-bold shrink-0">{p.win}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow ← */}
        <div className="reveal-item hidden sm:flex items-center justify-center" style={{ transitionDelay: '900ms' }}>
          <ArrowLeft size={24} strokeWidth={2} className="text-slate-500" />
        </div>

        {/* BOTTOM-RIGHT: Win */}
        <div style={{ transitionDelay: '700ms' }} className="reveal-item order-3 sm:order-none rounded-xl border border-green-500/35 bg-gradient-to-br from-green-500/15 to-surface-700 p-5 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-green-400 text-[11px] uppercase tracking-widest">Round win</p>
          <p className="text-white font-black text-4xl">$100</p>
          <p className="text-slate-500 text-[10px]">Split by % share</p>
        </div>

      </RevealGroup>
    </div>
  )
}
