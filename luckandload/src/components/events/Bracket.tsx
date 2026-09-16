'use client'

import { Trophy, ChevronDown, Crown, RotateCcw } from 'lucide-react'
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

function ProviderRow({
  provider,
  isWinner,
  decided,
  clickable,
  disabled,
  onClick,
}: {
  provider: string | null
  isWinner: boolean
  decided: boolean
  clickable?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  const p = provider ? PROVIDERS[provider] : null

  if (!p) {
    return (
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-dashed border-white/10 text-slate-600 text-sm">
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
      disabled={!clickable || disabled}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
        isWinner && 'bg-gold-500/10',
        decided && !isWinner && 'opacity-40',
        clickable && !disabled ? 'hover:bg-white/5 cursor-pointer' : 'cursor-default'
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg',
          isWinner ? 'bg-gold-500/20 ring-2 ring-gold-500/40' : 'bg-surface-700'
        )}
      >
        {p.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm font-semibold', isWinner ? 'text-white' : 'text-slate-300')}>
          {p.name}
        </p>
        <p className="truncate text-[11px] text-slate-500">{p.game}</p>
      </div>
      {isWinner && <Trophy size={14} className="shrink-0 text-gold-400" />}
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
        'overflow-hidden rounded-2xl border bg-surface-800',
        match.winner ? 'border-gold-500/25' : 'border-white/8',
        big && 'shadow-[0_0_44px_-12px_rgba(201,165,60,0.35)]'
      )}
    >
      <ProviderRow
        provider={match.providerA}
        isWinner={!!match.winner && match.winner === match.providerA}
        decided={!!match.winner}
        clickable={canPick}
        disabled={!canPick}
        onClick={() => match.providerA && onPick?.(match.providerA)}
      />
      <div className="border-t border-white/5" />
      <ProviderRow
        provider={match.providerB}
        isWinner={!!match.winner && match.winner === match.providerB}
        decided={!!match.winner}
        clickable={canPick}
        disabled={!canPick}
        onClick={() => match.providerB && onPick?.(match.providerB)}
      />
      {editable && match.winner && (
        <button
          onClick={onClear}
          disabled={pending}
          className="flex w-full items-center justify-center gap-1.5 border-t border-white/5 px-4 py-2 text-[11px] font-medium text-slate-500 transition-colors hover:text-red-400 disabled:opacity-50"
        >
          <RotateCcw size={11} /> Reset match
        </button>
      )}
    </div>
  )
}

function RoundLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </h3>
  )
}

export function Bracket({ results, editable, onPick, onClear, pendingMatchId }: BracketProps) {
  const bracket = computeBracket(results)
  const champion = bracket.champion ? PROVIDERS[bracket.champion] : null

  return (
    <div className="space-y-6">
      {champion && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-gold-500/30 bg-gold-500/5 py-6 text-center">
          <Crown size={22} className="text-gold-400" />
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-400">Champion</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{champion.icon}</span>
            <span className="text-lg font-black text-white">{champion.name}</span>
          </div>
        </div>
      )}

      <div>
        <RoundLabel>Quarterfinals</RoundLabel>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {bracket.qf.map(m => (
            <MatchCard
              key={m.id}
              match={m}
              editable={editable}
              pending={pendingMatchId === m.id}
              onPick={providerId => onPick?.(m.id, providerId)}
              onClear={() => onClear?.(m.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center text-slate-700">
        <ChevronDown size={18} />
      </div>

      <div>
        <RoundLabel>Semifinals</RoundLabel>
        <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
          {bracket.sf.map(m => (
            <MatchCard
              key={m.id}
              match={m}
              editable={editable}
              pending={pendingMatchId === m.id}
              onPick={providerId => onPick?.(m.id, providerId)}
              onClear={() => onClear?.(m.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center text-slate-700">
        <ChevronDown size={18} />
      </div>

      <div>
        <RoundLabel>Final</RoundLabel>
        <div className="mx-auto max-w-sm">
          <MatchCard
            match={bracket.final}
            editable={editable}
            pending={pendingMatchId === bracket.final.id}
            onPick={providerId => onPick?.(bracket.final.id, providerId)}
            onClear={() => onClear?.(bracket.final.id)}
            big
          />
        </div>
      </div>
    </div>
  )
}
