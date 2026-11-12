import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/guides/GuideContent'
import { AUTHORS, SITE_URL, formatGuideDate, getAuthor, publishedGuides } from '@/lib/guides'

export const dynamicParams = false
export const revalidate = 3600

export function generateStaticParams() {
  return AUTHORS.map(author => ({ slug: author.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const author = getAuthor(params.slug)
  if (!author) return {}
  return {
    title: `${author.name} – ${author.role}`,
    description: author.bio,
    alternates: { canonical: `${SITE_URL}/authors/${author.slug}` },
  }
}

// Turns the names of the other authors into links to their profiles.
function LinkedAuthorNames({ text, currentSlug }: { text: string; currentSlug: string }) {
  const others = AUTHORS.filter(author => author.slug !== currentSlug)
  const names = new RegExp(`\\b(${others.map(author => author.name).join('|')})\\b`)

  return (
    <>
      {text.split(names).map((part, index) => {
        const linked = others.find(author => author.name === part)
        return linked ? (
          <Link
            key={index}
            href={`/authors/${linked.slug}`}
            className="text-brand-400 hover:text-brand-300 underline underline-offset-2"
          >
            {part}
          </Link>
        ) : (
          part
        )
      })}
    </>
  )
}

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const author = getAuthor(params.slug)
  if (!author) notFound()

  const guides = publishedGuides().filter(guide => guide.authorSlug === author.slug)

  return (
    <div className="min-h-screen py-20 px-4">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: author.name,
            alternateName: author.alias,
            image: `${SITE_URL}${author.image}`,
            jobTitle: author.role,
            description: author.bio,
            url: `${SITE_URL}/authors/${author.slug}`,
            worksFor: { '@type': 'Organization', name: 'LuckAndLoadTV', url: SITE_URL },
          },
        }}
      />
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 flex items-center gap-5">
          <Image
            src={author.image}
            alt={author.name}
            width={112}
            height={112}
            className="h-28 w-28 shrink-0 rounded-full object-cover"
            priority
          />
          <div>
            <h1 className="text-3xl font-bold text-white">About {author.name}</h1>
            <p className="text-sm text-brand-400">{author.role}</p>
          </div>
        </div>

        <div className="mb-10 space-y-4 leading-relaxed text-slate-300">
          {author.about.map(paragraph => (
            <p key={paragraph}>
              <LinkedAuthorNames text={paragraph} currentSlug={author.slug} />
            </p>
          ))}
          {author.funFact && (
            <p>
              <strong className="text-white">Fun fact:</strong> {author.funFact}
            </p>
          )}
        </div>

        {guides.length > 0 && (
          <>
            <h2 className="mb-4 text-lg font-semibold text-white">Guides by {author.name}</h2>
            <div className="space-y-3">
              {guides.map(guide => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="block rounded-2xl border border-white/8 bg-surface-800 p-5 transition-colors hover:border-brand-500/40"
                >
                  <p className="font-semibold text-white">{guide.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatGuideDate(guide.published)} · {guide.readingMinutes} min read
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
