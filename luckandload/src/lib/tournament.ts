// Statisk data + logikk for turnerings-brackets. Selve resultatene (hvem som vant hver kamp)
// hentes fra Supabase (tabellen `tournament_results`) -- alt annet (hvem som møter hvem, hvilket
// easter egg-ikon en leverandør har) defineres her i kode.

export interface Provider {
  id: string
  name: string
  /** Navnet på slotten "easter egget" er hentet fra. */
  game: string
  /** Beskjært utsnitt av spillets offisielle nøkkelgrafikk/cover art (public/providers/). */
  image: string
}

export const PROVIDERS: Record<string, Provider> = {
  pragmatic: { id: 'pragmatic', name: 'Pragmatic Play', game: 'Gates of Olympus', image: '/providers/pragmatic.jpg' },
  bgaming: { id: 'bgaming', name: 'BGaming', game: 'Elvis Frog in Vegas', image: '/providers/bgaming.jpg' },
  hacksaw: { id: 'hacksaw', name: 'Hacksaw Gaming', game: 'Wanted Dead or a Wild', image: '/providers/hacksaw.jpg' },
  belatra: { id: 'belatra', name: 'Belatra', game: 'Long Neck Fortune', image: '/providers/belatra.jpg' },
  petersons: { id: 'petersons', name: 'Peter & Sons', game: 'Barbarossa', image: '/providers/petersons.jpg' },
  relax: { id: 'relax', name: 'Relax Gaming', game: 'Book of Power', image: '/providers/relax.jpg' },
  nolimit: { id: 'nolimit', name: 'Nolimit City', game: 'Duck Hunters', image: '/providers/nolimit.jpg' },
  slotmill: { id: 'slotmill', name: 'Slotmill', game: 'Lucky Lucifer', image: '/providers/slotmill.jpg' },
}

export const EVENT_SLUG = 'slot-provider-battle'
export const EVENT_TITLE = 'Slot Provider Battle'

// Kampoppsettet for quarterfinals er fast. Semifinaler og finale sine deltakere avgjøres av
// hvem som vinner kampene som "feeder" inn i dem (from), regnes ut i computeBracket().
export const BRACKET_DEF = {
  qf: [
    { id: 'qf1', side: 'A' as const, a: 'pragmatic', b: 'bgaming' },
    { id: 'qf2', side: 'A' as const, a: 'hacksaw', b: 'belatra' },
    { id: 'qf3', side: 'B' as const, a: 'petersons', b: 'relax' },
    { id: 'qf4', side: 'B' as const, a: 'nolimit', b: 'slotmill' },
  ],
  sf: [
    { id: 'sf1', side: 'A' as const, from: ['qf1', 'qf2'] as [string, string] },
    { id: 'sf2', side: 'B' as const, from: ['qf3', 'qf4'] as [string, string] },
  ],
  final: { id: 'final', from: ['sf1', 'sf2'] as [string, string] },
}

export type ResultsMap = Record<string, string> // matchId -> winning provider id

export interface BracketMatchState {
  id: string
  round: 'quarterfinal' | 'semifinal' | 'final'
  side: 'A' | 'B' | null
  providerA: string | null // provider id, or null = "TBD" (waiting on a previous match)
  providerB: string | null
  winner: string | null
}

export interface BracketState {
  qf: BracketMatchState[]
  sf: BracketMatchState[]
  final: BracketMatchState
  champion: string | null
}

export function computeBracket(results: ResultsMap): BracketState {
  const qf: BracketMatchState[] = BRACKET_DEF.qf.map(m => ({
    id: m.id,
    round: 'quarterfinal',
    side: m.side,
    providerA: m.a,
    providerB: m.b,
    winner: results[m.id] ?? null,
  }))

  const winnerOf = (matchId: string): string | null => results[matchId] ?? null

  const sf: BracketMatchState[] = BRACKET_DEF.sf.map(m => ({
    id: m.id,
    round: 'semifinal',
    side: m.side,
    providerA: winnerOf(m.from[0]),
    providerB: winnerOf(m.from[1]),
    winner: results[m.id] ?? null,
  }))

  const final: BracketMatchState = {
    id: BRACKET_DEF.final.id,
    round: 'final',
    side: null,
    providerA: winnerOf(BRACKET_DEF.final.from[0]),
    providerB: winnerOf(BRACKET_DEF.final.from[1]),
    winner: results[BRACKET_DEF.final.id] ?? null,
  }

  return { qf, sf, final, champion: final.winner }
}

/** Alle kamp-ID-er i turneringen, i rekkefølge -- brukes av admin-UI-et. */
export const ALL_MATCH_IDS = [
  ...BRACKET_DEF.qf.map(m => m.id),
  ...BRACKET_DEF.sf.map(m => m.id),
  BRACKET_DEF.final.id,
]

/**
 * Gitt en kamp som skal nullstilles, hvilke ANDRE kamper må også nullstilles for at bracket
 * ikke skal ende opp med "foreldreløse" resultater? (F.eks: nullstiller man qf1, må sf1 -- som
 * fikk sin deltaker FRA qf1 sin vinner -- og finalen, som igjen avhenger av sf1, også nullstilles.)
 * Returnerer IKKE matchId selv, bare de nedstrøms kampene som må følge med.
 */
export function getDownstreamMatchIds(matchId: string): string[] {
  const downstream: string[] = []
  const qfToSf: Record<string, string> = { qf1: 'sf1', qf2: 'sf1', qf3: 'sf2', qf4: 'sf2' }
  const sfToFinal = 'final'

  if (matchId in qfToSf) {
    downstream.push(qfToSf[matchId], sfToFinal)
  } else if (matchId === 'sf1' || matchId === 'sf2') {
    downstream.push(sfToFinal)
  }

  return downstream
}
