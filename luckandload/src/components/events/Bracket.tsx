'use client'

import Image from 'next/image'
import { Trophy, Crown, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PROVIDERS, computeBracket, type ResultsMap, type BracketMatchState } from '@/lib/tournament'

interface BracketProps {
  results: ResultsMap
  /** Admin-modus: viser klikkbare knapper for å velge vinner i stedet for bare visning. */
  editable?: boolean
  onPick?: (matchId: string, providerId: string) => void
  onClear?: (matchId: string) => void
  /** matchId som akkurat nå lagres, for en liten loading-indikator. */
  pendingMatchId?: string | null
}

function VsBadge() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 sm:px-6">
      <div className="h-px flex-1 bg-white/10" />
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gold-500/70 bg-surface-900 text-[11px] font-black italic tracking-wide text-gold-400 shadow-md shadow-black/50 sm:h-10 sm:w-10 sm:text-xs">
        VS
      </div>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  )
}

function ProviderSlot({
  providerId,
  isWinner,
  decided,
  clickable,
  onClick,
  size = 56,
}: {
  providerId: string | null
  isWinner: boolean
  decided: boolean
  clickable?: boolean
  onClick?: () => void
  size?: number
}) {
  const p = providerId ? PROVIDERS[providerId] : null

  if (!p) {
    return (
      <div className="flex items-center gap-3 p-3">
        <div
          className="flex shrink-0 items-center justify-center rounded-xl border border-dashed border-white/10 text-slate-600"
          style={{ width: size, height: size }}
        >
          ?
        </div>
        <span className="text-sm italic text-slate-600">TBD</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      className={cn(
        'flex w-full items-center gap-4 p-4 text-left transition-all sm:p-5',
        isWinner && 'bg-gradient-to-r from-gold-500/15 to-transparent',
        decided && !isWinner && 'opacity-35 grayscale',
        clickable && 'cursor-pointer hover:bg-white/5',
        !clickable && 'cursor-default'
      )}
    >
      <div
        className={cn(
          'relative shrink-0 overflow-hidden rounded-xl ring-2',
          isWinner ? 'ring-gold-400 shadow-[0_0_18px_-2px_rgba(201,165,60,0.6)]' : 'ring-white/10'
        )}
        style={{ width: size, height: size }}
      >
        <Image src={p.image} alt={p.name} fill sizes={`${size}px`} className="object-cover" />
      </div>
      <p className={cn('min-w-0 flex-1 truncate text-base font-bold sm:text-lg', isWinner ? 'text-white' : 'text-slate-300')}>
        {p.name}
      </p>
      {isWinner && <Trophy size={20} className="shrink-0 text-gold-400" />}
    </button>
  )
}

function MatchCard({
  match,
  editable,
  onPick,
  onClear,
  pending,
  big,
}: {
  match: BracketMatchState
  editable?: boolean
  onPick?: (providerId: string) => void
  onClear?: () => void
  pending?: boolean
  big?: boolean
}) {
  const canPick = editable && !!match.providerA && !!match.providerB && !pending

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-surface-800',
        match.winner ? 'border-gold-500/30' : 'border-white/10',
        big && 'shadow-[0_0_60px_-16px_rgba(201,165,60,0.4)]'
      )}
    >
      <ProviderSlot
        providerId={match.providerA}
        isWinner={!!match.winner && match.winner === match.providerA}
        decided={!!match.winner}
        clickable={canPick}
        onClick={() => match.providerA && onPick?.(match.providerA)}
        size={big ? 96 : 80}
      />
      <VsBadge />
      <ProviderSlot
        providerId={match.providerB}
        isWinner={!!match.winner && match.winner === match.providerB}
        decided={!!match.winner}
        clickable={canPick}
        onClick={() => match.providerB && onPick?.(match.providerB)}
        size={big ? 96 : 80}
      />
      {editable && match.winner && (
        <button
          onClick={onClear}
          disabled={pending}
          className="flex w-full items-center justify-center gap-1.5 border-t border-white/10 py-2 text-[11px] font-medium text-slate-500 transition-colors hover:text-red-400 disabled:opacity-50"
        >
          <RotateCcw size={11} /> Reset match
        </button>
      )}
    </div>
  )
}

function RoundLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-brand-400">
      {children}
    </h3>
  )
}

/** Kobler to feeder-kamper visuelt til kampen de fører inn i, på desktop. */
function FeederConnector() {
  return (
    <div className="hidden items-stretch lg:flex">
      <div className="flex flex-col justify-around py-6">
        <div className="h-px w-6 bg-white/15" />
        <div className="h-px w-6 bg-white/15" />
      </div>
    </div>
  )
}

export function Bracket({ results, editable, onPick, onClear, pendingMatchId }: BracketProps) {
  const bracket = computeBracket(results)
  const champion = bracket.champion ? PROVIDERS[bracket.champion] : null

  const qfA = bracket.qf.filter(m => m.side === 'A')
  const qfB = bracket.qf.filter(m => m.side === 'B')
  const sfA = bracket.sf.find(m => m.side === 'A')!
  const sfB = bracket.sf.find(m => m.side === 'B')!

  const renderMatch = (m: BracketMatchState, big?: boolean) => (
    <MatchCard
      key={m.id}
      match={m}
      editable={editable}
      pending={pendingMatchId === m.id}
      onPick={providerId => onPick?.(m.id, providerId)}
      onClear={() => onClear?.(m.id)}
      big={big}
    />
  )

  return (
    <div className="space-y-8">
      {champion && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-gold-500/30 bg-gradient-to-b from-gold-500/10 to-transparent py-7 text-center">
          <Crown size={26} className="text-gold-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-gold-400">Champion</p>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl ring-2 ring-gold-400">
              <Image src={champion.image} alt={champion.name} fill className="object-cover" />
            </div>
            <span className="text-2xl font-black text-white">{champion.name}</span>
          </div>
        </div>
      )}

      {/* Desktop: horisontal bracket-tre */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-[1.1fr_auto_1fr_auto_1.1fr] gap-6 xl:gap-10">
          <RoundLabel>Quarterfinals</RoundLabel>
          <div />
          <RoundLabel>Semifinals · Final</RoundLabel>
          <div />
          <RoundLabel>Quarterfinals</RoundLabel>
        </div>
        <div className="grid grid-cols-[1.1fr_auto_1fr_auto_1.1fr] items-center gap-6 xl:gap-10">
          <div className="space-y-10">{qfA.map(m => renderMatch(m))}</div>
          <FeederConnector />
          <div className="space-y-6">
            <Trophy size={32} className="mx-auto mb-2 text-gold-500/40" />
            {renderMatch(sfA)}
            <div className="pt-4">{renderMatch(bracket.final, true)}</div>
            {renderMatch(sfB)}
          </div>
          <FeederConnector />
          <div className="space-y-10">{qfB.map(m => renderMatch(m))}</div>
        </div>
      </div>

      {/* Mobil/tablet: stablede runder */}
      <div className="space-y-6 lg:hidden">
        <div>
          <RoundLabel>Quarterfinals</RoundLabel>
          <div className="grid gap-3 sm:grid-cols-2">{bracket.qf.map(m => renderMatch(m))}</div>
        </div>
        <div>
          <RoundLabel>Semifinals</RoundLabel>
          <div className="grid gap-3 sm:grid-cols-2">{bracket.sf.map(m => renderMatch(m))}</div>
        </div>
        <div>
          <RoundLabel>Final</RoundLabel>
          <div className="mx-auto max-w-md">{renderMatch(bracket.final, true)}</div>
        </div>
      </div>
    </div>
  )
}
