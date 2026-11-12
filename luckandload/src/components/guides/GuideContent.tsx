import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { GamblingNotice } from '@/components/ui/GamblingNotice'
import { hypeReviewHref } from '@/lib/guides'

// Fold-out sections for terms and other details. Built on <details>, so it works without
// JavaScript and the text stays in the page for search engines while it's closed.
export function GuideDetailsGroup({ children }: { children: React.ReactNode }) {
  return <div className="mb-6 border-t border-white/10">{children}</div>
}

export function GuideDetails({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-white/10">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-white transition-colors hover:text-brand-300 [&::-webkit-details-marker]:hidden">
        {summary}
        <ChevronDown size={18} className="shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-3">{children}</div>
    </details>
  )
}

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

// Short call to action placed inside an article body, between sections.
// The text link next to the button goes to our Hype.bet review by default; pass `secondary` to
// change it (the review guide itself links to the bonus code page instead).
export function GuideInlineCta({
  title,
  children,
  secondary = { href: hypeReviewHref(), label: 'Read our Hype.bet review' },
}: {
  title: string
  children: React.ReactNode
  secondary?: { href: string; label: string }
}) {
  return (
    <aside className="my-8 max-w-3xl rounded-xl border border-hype/40 bg-hype/5 p-5">
      <p className="mb-1.5 text-lg font-bold text-white">{title}</p>
      <p className="mb-4 leading-7 text-slate-200">{children}</p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href="https://hype.bet/LuckAndLoad"
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-hype px-6 py-2.5 text-sm font-black uppercase tracking-wide text-black transition-colors hover:bg-hype/90"
        >
          Play on Hype.bet
        </a>
        <Link href={secondary.href} className="text-sm text-brand-400 underline underline-offset-2 hover:text-brand-300">
          {secondary.label}
        </Link>
      </div>
      <p className="mt-3 text-xs text-slate-500">18+. Affiliate link: we earn commission if you sign up and play through it.</p>
    </aside>
  )
}

// `lead` is an optional first sentence, so an article can tie the closing box to its own topic.
export function GuideCta({ lead }: { lead?: string }) {
  return (
    <aside className="mt-12 rounded-2xl border border-hype/40 bg-hype/5 p-6 sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="mb-2 text-2xl font-bold text-white">Play with us on Hype.bet</h2>
          <p className="leading-7 text-slate-200">
            {lead && <>{lead} </>}
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
