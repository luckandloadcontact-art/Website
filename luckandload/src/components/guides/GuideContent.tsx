import Link from 'next/link'
import { GamblingNotice } from '@/components/ui/GamblingNotice'

export function GuideH2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 mb-3 text-xl font-bold text-white">{children}</h2>
}

export function GuideP({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 leading-relaxed text-slate-300">{children}</p>
}

export function GuideList({ ordered, children }: { ordered?: boolean; children: React.ReactNode }) {
  const className = `mb-4 last:mb-0 space-y-2 pl-5 leading-relaxed text-slate-300 ${ordered ? 'list-decimal' : 'list-disc'}`
  return ordered ? <ol className={className}>{children}</ol> : <ul className={className}>{children}</ul>
}

export function GuideColumns({ children }: { children: React.ReactNode }) {
  return <div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
}

export function GuideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/8 bg-surface-800 p-5">
      <h2 className="mb-3 text-lg font-bold text-white">{title}</h2>
      {children}
    </section>
  )
}

export function GuideSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-5 leading-relaxed text-slate-200">
      {children}
    </div>
  )
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

export function GuideCta() {
  return (
    <aside className="mt-12 rounded-2xl border border-white/8 bg-surface-800 p-6 text-center">
      <h2 className="mb-2 text-xl font-bold text-white">Play with us on Hype.bet</h2>
      <p className="mb-5 text-sm leading-relaxed text-slate-400">
        Players under our code compete on our{' '}
        <Link href="/leaderboard" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
          monthly leaderboard
        </Link>
        , and we pay out $1,000 in prizes every month. Check Hype.bet&apos;s current terms, including whether it is
        available where you live.
      </p>
      <a
        href="https://hype.bet/LuckAndLoad"
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="inline-flex items-center rounded-xl bg-hype px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-colors hover:bg-hype/90"
      >
        Play on Hype.bet
      </a>
      <GamblingNotice className="mt-3" />
      <p className="mt-1 text-xs text-slate-600">Affiliate link: we earn commission if you sign up and play through it.</p>
    </aside>
  )
}
