import Link from 'next/link'
import { GamblingNotice } from '@/components/ui/GamblingNotice'

export function GuideH2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 mb-4 text-2xl font-bold text-white">{children}</h2>
}

export function GuideH3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-8 mb-3 text-lg font-bold text-white">{children}</h3>
}

export function GuideP({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 leading-7 text-slate-200">{children}</p>
}

export function GuideList({ children }: { children: React.ReactNode }) {
  return <ul className="mb-5 list-[square] space-y-3 pl-5 leading-7 text-slate-200 marker:text-brand-400">{children}</ul>
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
    <aside className="mt-12 rounded-2xl border border-hype/40 bg-hype/5 p-6 sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="mb-2 text-2xl font-bold text-white">Play with us on Hype.bet</h2>
          <p className="leading-7 text-slate-200">
            Players under our code compete on our{' '}
            <Link href="/leaderboard" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
              monthly leaderboard
            </Link>
            , and we pay out $1,000 in prizes every month. Check Hype.bet&apos;s current terms, including whether it is
            available where you live.
          </p>
        </div>
        <a
          href="https://hype.bet/LuckAndLoad"
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-hype px-10 py-4 text-base font-black uppercase tracking-wide text-black transition-colors hover:bg-hype/90"
        >
          Play on Hype.bet
        </a>
      </div>
      <GamblingNotice className="mt-5" />
      <p className="mt-1 text-xs text-slate-500">Affiliate link: we earn commission if you sign up and play through it.</p>
    </aside>
  )
}
