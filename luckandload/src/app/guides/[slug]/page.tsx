import type { ComponentType } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { GuideCta, JsonLd } from '@/components/guides/GuideContent'
import DepositWithoutWelcomeBonus from '@/content/guides/deposit-without-welcome-bonus'
import { GUIDES, SITE_URL, formatGuideDate, getAuthor, getGuide } from '@/lib/guides'

const BODIES: Record<string, ComponentType> = {
  'deposit-without-welcome-bonus': DepositWithoutWelcomeBonus,
}

export const dynamicParams = false

export function generateStaticParams() {
  return GUIDES.map(guide => ({ slug: guide.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getGuide(params.slug)
  if (!guide) return {}
  const url = `${SITE_URL}/guides/${guide.slug}`
  return {
    title: `${guide.title} – LuckAndLoadTV`,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      url,
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      authors: [`${SITE_URL}/authors/${guide.authorSlug}`],
      images: [`${SITE_URL}/logo-navbar.png`],
    },
  }
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug)
  const author = guide && getAuthor(guide.authorSlug)
  const Body = guide && BODIES[guide.slug]
  if (!guide || !author || !Body) notFound()

  const authorPath = `/authors/${author.slug}`

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.title,
          description: guide.description,
          url: `${SITE_URL}/guides/${guide.slug}`,
          image: `${SITE_URL}/logo-navbar.png`,
          datePublished: guide.published,
          dateModified: guide.updated,
          author: { '@type': 'Person', name: author.name, url: `${SITE_URL}${authorPath}`, image: `${SITE_URL}${author.image}` },
          publisher: { '@type': 'Organization', name: 'LuckAndLoadTV', url: SITE_URL },
        }}
      />
      <article className="mx-auto max-w-6xl">
        <Link href="/guides" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-300">
          <ArrowLeft size={14} />
          All guides
        </Link>

        <header className="mb-8">
          <h1 className="mb-3 text-3xl font-bold leading-tight text-white sm:text-4xl">{guide.title}</h1>
          <p className="text-sm text-slate-500">
            By{' '}
            <Link href={authorPath} className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
              {author.name}
            </Link>{' '}
            · {formatGuideDate(guide.published)} · {guide.readingMinutes} min read
          </p>
        </header>

        <Body />
        <GuideCta />

        <footer className="mt-12 flex items-start gap-4 border-t border-white/10 pt-6">
          <Image
            src={author.image}
            alt={author.name}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-slate-400">
              Written by{' '}
              <Link href={authorPath} className="font-semibold text-white hover:text-brand-300 transition-colors">
                {author.name}
              </Link>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">{author.bio}</p>
          </div>
        </footer>
      </article>
    </div>
  )
}
