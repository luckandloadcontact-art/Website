import { Swords } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase'
import { EVENT_SLUG, EVENT_TITLE, type ResultsMap } from '@/lib/tournament'
import { Bracket } from '@/components/events/Bracket'

export const dynamic = 'force-dynamic'

async function getResults(): Promise<ResultsMap> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('tournament_results')
    .select('match_id, winner')
    .eq('event_slug', EVENT_SLUG)
  return Object.fromEntries((data ?? []).map(r => [r.match_id, r.winner]))
}

export default async function EventsPage() {
  const results = await getResults()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 bg-gradient-to-b from-surface-900 to-surface-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-400">
              <Swords size={13} /> LuckAndLoadTV
            </div>
            <h1 className="text-3xl font-black text-white sm:text-4xl">Events</h1>
            <p className="max-w-xl text-sm text-slate-400 sm:text-base">
              Community tournaments and special events — vote-worthy showdowns between your
              favourite slot providers.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[2000px] px-4 sm:px-8 lg:px-12 py-10 space-y-4">
        <div className="rounded-2xl border border-white/8 bg-surface-800 p-5 sm:p-8">
          <h2 className="mb-1 text-lg font-black text-white">{EVENT_TITLE}</h2>
          <p className="mb-8 text-sm text-slate-400">
            8 providers, single elimination, one champion. Who takes the crown?
          </p>
          <Bracket results={results} />
        </div>
      </div>
    </div>
  )
}
