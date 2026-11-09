import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { GamblingNotice } from '@/components/ui/GamblingNotice'
import { CASINOS } from '@/lib/casinos'
import { SITE_URL } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Casinos We Play At – LuckAndLoadTV',
  description:
    'The online casinos the LuckAndLoadTV team plays at on stream, with what you get through our link, license details and honest pros and cons.',
  alternates: { canonical: `${SITE_URL}/casinos` },
}

const UPDATED = new Date(
  CASINOS.reduce((latest, casino) => (casino.updated > latest ? casino.updated : latest), '')
).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })

export default function CasinosPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Casinos We Play At</h1>
          <p className="text-sm text-slate-500">Updated {UPDATED} · Picked by the LuckAndLoadTV team</p>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            We only list casinos we play at ourselves. Right now that&apos;s Hype.bet, where we stream every session and
            run our multiplayer rooms.
          </p>
        </header>

        <ol className="space-y-5">
          {CASINOS.map((casino, index) => (
            <li key={casino.slug} className="rounded-2xl border border-white/10 bg-surface-800 p-5 sm:p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex items-start gap-4 md:w-72 md:shrink-0">
                  <span className="mt-1 text-sm font-bold tabular-nums text-slate-500">#{index + 1}</span>
                  <Image
                    src={casino.logo}
                    alt={`${casino.name} logo`}
                    width={64}
                    height={64}
                    className="h-16 w-16 shrink-0 rounded-xl"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">{casino.name}</h2>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {casino.tags.map(tag => (
                        <span
                          key={tag}
                          className="rounded-md border border-hype/30 bg-hype/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-hype"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="mb-4 space-y-1.5 text-sm leading-6 text-slate-200">
                    {casino.highlights.map(highlight => (
                      <li key={highlight} className="flex gap-2">
                        <span className="text-hype" aria-hidden>
                          ◆
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                    <div className="flex gap-2">
                      <dt className="text-slate-500">Welcome offer:</dt>
                      <dd className="text-slate-200">{casino.welcomeOffer ?? 'See current offer on site'}</dd>
                    </div>
                    {casino.details
                      .filter(detail => detail.label !== 'Operator' && detail.label !== 'Multiplayer rooms')
                      .map(detail => (
                        <div key={detail.label} className="flex gap-2">
                          <dt className="shrink-0 text-slate-500">{detail.label}:</dt>
                          <dd className="text-slate-200">{detail.value}</dd>
                        </div>
                      ))}
                  </dl>
                </div>

                <div className="flex flex-col gap-2 md:w-44 md:shrink-0">
                  <a
                    href={casino.playUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-hype px-5 py-3 text-sm font-black uppercase tracking-wide text-black transition-colors hover:bg-hype/90"
                  >
                    Play now
                  </a>
                  <Link
                    href={`/casinos/${casino.slug}`}
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-white/30 hover:text-white"
                  >
                    Read review
                  </Link>
                </div>
              </div>
              <p className="mt-4 border-t border-white/5 pt-3 text-xs text-slate-500">18+ · Gamble responsibly · T&amp;Cs apply</p>
            </li>
          ))}
        </ol>

        <section className="mt-14 max-w-2xl">
          <h2 className="mb-4 text-2xl font-bold text-white">How we pick casinos</h2>
          <p className="mb-5 leading-7 text-slate-200">
            We play at every casino on this list ourselves, so you can watch the games, payouts and features on stream
            before you sign up. We check that each casino is licensed, and we tell you the downsides as well as the good
            parts in every review.
          </p>
          <p className="mb-5 leading-7 text-slate-200">
            We earn a commission when you sign up and play through our links. It doesn&apos;t change what you pay, and it
            doesn&apos;t decide what we write. Check that online gambling is legal where you live before you sign up.
          </p>
          <GamblingNotice />
        </section>
      </div>
    </div>
  )
}
