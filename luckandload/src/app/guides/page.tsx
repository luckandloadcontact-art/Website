import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE_URL, formatGuideDate, getAuthor, publishedGuides, type Guide } from '@/lib/guides'

// Hourly, so guides scheduled for a later date appear on their publish day.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Casino Guides: Bonus Hunts, RTP and Hype.bet – LuckAndLoadTV',
  description: 'Short, practical casino guides from the hosts of LuckAndLoadTV: bonuses, wagering and how the games work.',
  alternates: { canonical: `${SITE_URL}/guides` },
}

function Byline({ guide }: { guide: Guide }) {
  const author = getAuthor(guide.authorSlug)
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      {author && (
        <Image src={author.image} alt="" width={24} height={24} className="h-6 w-6 rounded-full object-cover" />
      )}
      <span>
        {author?.name} · {formatGuideDate(guide.published)} · {guide.readingMinutes} min read
      </span>
    </div>
  )
}

function CategoryTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit rounded-md bg-brand-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-300">
      {children}
    </span>
  )
}

export default function GuidesPage() {
  // The pinned guide (our Hype.bet review) always gets the big card; "Latest" goes on the newest of the rest.
  const guides = publishedGuides()
  const featured = guides.find(guide => guide.pinned) ?? guides[0]
  const rest = guides.filter(guide => guide !== featured)
  const latestSlug = rest[0]?.slug

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-2xl">
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">Guides</h1>
          <p className="text-slate-400">
            Short, practical guides to bonus hunts, RTP, wagering and Hype.bet, written by the two of us from what we see
            on stream.
          </p>
        </header>

        {featured && (
          <Link
            href={`/guides/${featured.slug}`}
            className="group mb-8 grid overflow-hidden rounded-2xl border border-white/10 bg-surface-800 transition-colors hover:border-brand-500/40 md:grid-cols-[1.15fr_1fr]"
          >
            <div className="relative aspect-[16/9] overflow-hidden md:aspect-auto md:min-h-[18rem]">
              <Image
                src={featured.cover.src}
                alt=""
                fill
                sizes="(min-width: 768px) 600px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ objectPosition: featured.cover.position }}
                priority
              />
            </div>
            <div className="flex flex-col gap-3 p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-hype">Featured</span>
                <CategoryTag>{featured.category}</CategoryTag>
              </div>
              <h2 className="text-2xl font-bold leading-tight text-white group-hover:text-brand-300">{featured.title}</h2>
              <p className="leading-relaxed text-slate-300">{featured.description}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                <Byline guide={featured} />
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400">
                  Read guide <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {rest.map(guide => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-800 transition-colors hover:border-brand-500/40"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={guide.cover.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: guide.cover.position }}
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-center gap-2">
                  {guide.slug === latestSlug && (
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-hype">Latest</span>
                  )}
                  <CategoryTag>{guide.category}</CategoryTag>
                </div>
                <h2 className="text-lg font-semibold leading-snug text-white group-hover:text-brand-300">{guide.title}</h2>
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-400">{guide.description}</p>
                <div className="mt-auto pt-2">
                  <Byline guide={guide} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
