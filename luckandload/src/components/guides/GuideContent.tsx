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
    <aside>
      <GuideH2>Play with us on Hype.bet</GuideH2>
      <GuideP>
        Players under our code compete on our{' '}
        <Link href="/leaderboard" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
          monthly leaderboard
        </Link>
        , and we pay out $1,000 in prizes every month. Check Hype.bet&apos;s current terms, including whether it is
        available where you live.
      </GuideP>
      <a
        href="https://hype.bet/LuckAndLoad"
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="inline-flex items-center rounded-lg bg-hype px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-colors hover:bg-hype/90"
      >
        Play on Hype.bet
      </a>
      <GamblingNotice className="mt-3" />
      <p className="mt-1 text-xs text-slate-500">Affiliate link: we earn commission if you sign up and play through it.</p>
    </aside>
  )
}
