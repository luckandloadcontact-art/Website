import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, formatGuideDate, getAuthor, publishedGuides } from '@/lib/guides'

// Hourly, so guides scheduled for a later date appear on their publish day.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Casino Guides – LuckAndLoadTV',
  description: 'Short, practical casino guides from the hosts of LuckAndLoadTV: bonuses, wagering and how the games work.',
  alternates: { canonical: `${SITE_URL}/guides` },
}

export default function GuidesPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Guides</h1>
          <p className="text-slate-400">
            Short, practical guides to casino bonuses, wagering and how the games work.
          </p>
        </div>

        <div className="space-y-4">
          {publishedGuides().map(guide => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="block rounded-2xl border border-white/8 bg-surface-800 p-6 transition-colors hover:border-brand-500/40"
            >
              <h2 className="mb-2 text-lg font-semibold text-white">{guide.title}</h2>
              <p className="mb-3 text-sm leading-relaxed text-slate-400">{guide.description}</p>
              <p className="text-xs text-slate-500">
                By {getAuthor(guide.authorSlug)?.name} · {formatGuideDate(guide.published)} · {guide.readingMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
