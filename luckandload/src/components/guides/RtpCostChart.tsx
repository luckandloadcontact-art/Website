// Bar chart of what the same session costs on different RTP versions of a slot. Used in the RTP guide
// and on the Hype.bet review. Bars are scaled to the most expensive row; the first row is drawn green,
// the last red and anything between amber.
export type RtpCostRow = { rtp: string; label?: string; cost: number }

function formatCost(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`
}

export function RtpCostChart({ title, rows, caption }: { title: string; rows: RtpCostRow[]; caption: string }) {
  const max = Math.max(...rows.map(row => row.cost))
  return (
    <figure className="mb-6 max-w-3xl rounded-xl border border-white/10 bg-surface-800 p-5">
      <p className="mb-4 text-sm font-semibold text-white">{title}</p>
      <div className="space-y-3">
        {rows.map((row, i) => {
          const color = i === 0 ? 'bg-hype' : i === rows.length - 1 ? 'bg-red-400' : 'bg-amber-400'
          return (
            <div key={row.rtp} className="grid grid-cols-[6.5rem_1fr_4.5rem] items-center gap-3 text-sm">
              <span className="text-slate-300">
                {row.rtp}
                {row.label && <span className="block text-xs text-slate-500">{row.label}</span>}
              </span>
              <span className="h-3 overflow-hidden rounded-full bg-white/5">
                <span className={`block h-full rounded-full ${color}`} style={{ width: `${(row.cost / max) * 100}%` }} />
              </span>
              <span className="text-right font-semibold tabular-nums text-white">{formatCost(row.cost)}</span>
            </div>
          )
        })}
      </div>
      <figcaption className="mt-4 text-xs leading-5 text-slate-500">{caption}</figcaption>
    </figure>
  )
}
