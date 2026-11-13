// Two real bonus hunts from our streams, read off our on-stream hunt tracker (November 2026).
// Shown as numbers rather than screenshots: the tracker also lists viewers' usernames.
const HUNTS = [
  {
    start: 2530,
    result: 8313.9,
    bonuses: 36,
    average: '329x',
    highlight: 'Sugar Rush 1000 paid 7,917x at a $0.80 bet: $6,333 on one bonus.',
  },
  {
    start: 6630,
    result: 12159.9,
    bonuses: 62,
    average: '226.5x',
    highlight: 'Shogun Skylord hit 3,451x at $0.20, and Zombie Carnival paid the most: $2,146 at $1.40.',
  },
]

function money(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`
}

export function HuntResults() {
  return (
    <figure className="mb-6 max-w-3xl">
      <div className="grid gap-4 sm:grid-cols-2">
        {HUNTS.map(hunt => (
          <div key={hunt.start} className="rounded-xl border border-white/10 bg-surface-800 p-4">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <p className="text-sm tabular-nums text-slate-400">
                {money(hunt.start)} <span className="text-slate-500">→</span>{' '}
                <span className="font-bold text-hype">{money(hunt.result)}</span>
              </p>
              <span className="rounded-md bg-hype/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-hype">
                {(hunt.result / hunt.start).toFixed(1)}x start
              </span>
            </div>
            <dl className="mb-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Bonuses</dt>
                <dd className="font-semibold tabular-nums text-white">{hunt.bonuses}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Average</dt>
                <dd className="font-semibold tabular-nums text-white">{hunt.average}</dd>
              </div>
            </dl>
            <p className="text-xs leading-5 text-slate-300">{hunt.highlight}</p>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-xs leading-5 text-slate-400">
        Two real hunts from our streams, from our hunt tracker. Good ones like these are the exception, not the rule.
      </figcaption>
    </figure>
  )
}
