import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown, Ticket, Trophy, Users, Zap } from 'lucide-react'
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

// `id` lets other pages link straight to a section, like /guides/hype-bet-review#withdrawals.
export function GuideH2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mt-12 mb-4 scroll-mt-24 text-2xl font-bold text-white">
      {children}
    </h2>
  )
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

// ---- Hype.bet call-to-action cards -----------------------------------------------------------
// Dark card with a thin green-to-teal edge and a soft glow, one big green button, the benefits as
// icon tiles, and the 18+ and affiliate notes in a quiet footer row.

const HYPE_URL = 'https://hype.bet/LuckAndLoad'

const BENEFITS = [
  { icon: Users, title: 'Multiplayer room', text: 'Play the same slots with us, live', href: null },
  { icon: Trophy, title: '$1,000 monthly leaderboard', text: 'Cash prizes for players under our code', href: '/leaderboard' },
  { icon: Ticket, title: 'Monthly $100 draw', text: 'For new players who use our link', href: '/draw' },
  { icon: Zap, title: 'Welcome offer', text: 'Hype.bet’s first-deposit bonus', href: '/casinos/hype-bet' },
] as const

function CtaShell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <aside
      className={`relative rounded-2xl bg-gradient-to-br from-hype/60 via-brand-400/20 to-white/5 p-px shadow-[0_0_40px_rgba(28,228,121,0.08)] ${className ?? ''}`}
    >
      <div className="relative overflow-hidden rounded-[15px] bg-gradient-to-br from-[#0a1f26] via-surface-900 to-[#06140f]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-hype/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative">{children}</div>
      </div>
    </aside>
  )
}

function HypeMark({ size = 36 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image src="/casinos/hype-bet.png" alt="" width={size} height={size} className="rounded-lg" />
      <span className="font-black tracking-tight text-white" style={{ fontSize: size * 0.8 }}>
        Hype.bet
      </span>
    </span>
  )
}

function HypeButton({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <a
      href={HYPE_URL}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-hype font-black uppercase tracking-wide text-black shadow-[0_8px_28px_rgba(28,228,121,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#3df08f] hover:shadow-[0_10px_34px_rgba(28,228,121,0.4)] ${
        size === 'lg' ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm'
      }`}
    >
      Play on Hype.bet
      <ArrowRight size={size === 'lg' ? 20 : 17} className="transition-transform group-hover:translate-x-0.5" />
    </a>
  )
}

function CtaFooter() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-white/[0.07] px-5 py-3 text-[11px] text-slate-500 sm:px-7">
      <span className="rounded border border-slate-600 px-1.5 py-px font-bold text-slate-400">18+</span>
      <span>
        Gamble responsibly ·{' '}
        <Link href="/responsible-gambling" className="underline underline-offset-2 hover:text-slate-300">
          Get help
        </Link>
      </span>
      <span className="hidden text-slate-700 sm:inline">|</span>
      <span>Affiliate link. We may earn a commission at no extra cost to you.</span>
    </div>
  )
}

function BenefitTile({ icon: Icon }: { icon: (typeof BENEFITS)[number]['icon'] }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-hype">
      <Icon size={18} />
    </span>
  )
}

// Short call to action placed inside an article body, between sections: title, the article's own
// line, three benefits in a row and the button. The text link next to the button goes to our
// Hype.bet review by default; pass `secondary` to change it (the review links to the bonus page).
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
    <CtaShell className="my-10 max-w-3xl">
      <div className="p-5 sm:p-7">
        <HypeMark size={30} />
        <p className="mt-4 text-xl font-black leading-tight text-white sm:text-2xl">{title}</p>
        <p className="mt-2 leading-7 text-slate-300">{children}</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {BENEFITS.slice(0, 3).map(b => (
            <li key={b.title} className="flex items-center gap-3">
              <BenefitTile icon={b.icon} />
              <span className="text-sm leading-tight">
                <span className="block font-semibold text-white">{b.title}</span>
                <span className="text-xs text-slate-400">{b.text}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <HypeButton />
          <Link href={secondary.href} className="text-sm font-medium text-brand-400 underline underline-offset-4 hover:text-brand-300">
            {secondary.label}
          </Link>
        </div>
      </div>
      <CtaFooter />
    </CtaShell>
  )
}

// The closing card at the end of every guide: the pitch and button on the left, what you get on
// the right. `lead` is an optional first sentence, so an article can tie the card to its topic.
export function GuideCta({
  lead,
  secondary = { href: '/casinos/hype-bet', label: 'See the bonus details' },
}: {
  lead?: string
  secondary?: { href: string; label: string }
}) {
  return (
    <CtaShell className="mt-14">
      <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1.1fr_1fr] md:gap-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-hype">Play with us on</p>
          <div className="mt-2">
            <HypeMark size={40} />
          </div>
          <p className="mt-4 leading-7 text-slate-300">
            {lead && <>{lead} </>}
            Play under our code, join our room when we&apos;re live and compete for $1,000 in prizes every month.
          </p>
          <div className="mt-6 flex flex-col items-start gap-3">
            <HypeButton size="lg" />
            <Link href={secondary.href} className="text-sm font-medium text-brand-400 underline underline-offset-4 hover:text-brand-300">
              {secondary.label}
            </Link>
          </div>
        </div>
        <ul className="space-y-4 border-white/[0.07] md:border-l md:pl-10">
          {BENEFITS.map(b => {
            const body = (
              <>
                <BenefitTile icon={b.icon} />
                <span className="leading-tight">
                  <span className="block font-semibold text-white">{b.title}</span>
                  <span className="text-sm text-slate-400">{b.text}</span>
                </span>
              </>
            )
            return (
              <li key={b.title}>
                {b.href ? (
                  <Link href={b.href} className="flex items-center gap-3.5 rounded-xl transition-colors hover:bg-white/[0.03]">
                    {body}
                  </Link>
                ) : (
                  <span className="flex items-center gap-3.5">{body}</span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <div className="px-6 pb-1 text-[11px] text-slate-500 sm:px-8">
        Check Hype.bet&apos;s current terms, including whether it&apos;s available where you live.
      </div>
      <CtaFooter />
    </CtaShell>
  )
}
