export function LegalPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string
  intro: string
  updated?: string
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-slate-400">{intro}</p>
          {updated && <p className="mt-2 text-xs text-slate-600">Last updated: {updated}</p>}
        </div>
        <div className="space-y-6">{children}</div>
      </div>
    </main>
  )
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/8 bg-surface-800 p-6">
      <h2 className="text-base font-semibold text-white mb-3">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-400">{children}</div>
    </section>
  )
}
