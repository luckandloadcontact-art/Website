import type { ComponentType } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { GuideDetails, GuideDetailsGroup, GuideH2, GuideH3, GuideList, GuideP, JsonLd } from '@/components/guides/GuideContent'
import { GamblingNotice } from '@/components/ui/GamblingNotice'
import HypeBetReview from '@/content/casinos/hype-bet'
import { CASINOS, activeOffer, formatOfferEnd, getCasino } from '@/lib/casinos'
import { SITE_URL, formatGuideDate, getAuthor } from '@/lib/guides'

const BODIES: Record<string, ComponentType<{ playUrl: string }>> = {
  'hype-bet': HypeBetReview,
}

export const dynamicParams = false
// Rebuilt hourly so a welcome offer disappears by itself once its end date has passed.
export const revalidate = 3600

export function generateStaticParams() {
  return CASINOS.map(casino => ({ slug: casino.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const casino = getCasino(params.slug)
  if (!casino) return {}
  const url = `${SITE_URL}/casinos/${casino.slug}`
  const offer = activeOffer(casino)
  const title = offer ? `${casino.name} Bonus Code: ${offer.headline}` : casino.reviewTitle
  return {
    title: `${title} – LuckAndLoadTV`,
    description: casino.description,
    alternates: { canonical: url },
    openGraph: { title, description: casino.description, type: 'article', url },
  }
}

export default function CasinoReviewPage({ params }: { params: { slug: string } }) {
  const casino = getCasino(params.slug)
  const author = casino && getAuthor(casino.authorSlug)
  if (!casino || !author) notFound()

  const url = `${SITE_URL}/casinos/${casino.slug}`
  const offer = activeOffer(casino)
  const Body = BODIES[casino.slug]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: casino.reviewTitle,
          description: casino.description,
          url,
          dateModified: casino.updated,
          author: { '@type': 'Person', name: author.name, url: `${SITE_URL}/authors/${author.slug}` },
          publisher: { '@type': 'Organization', name: 'LuckAndLoadTV', url: SITE_URL },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: casino.faq.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }}
      />

      <article className="mx-auto max-w-4xl">
        {CASINOS.length > 1 && (
          <Link href="/casinos" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-300">
            <ArrowLeft size={14} />
            All casinos
          </Link>
        )}

        <header className="mb-8 flex items-start gap-5">
          <Image src={casino.logo} alt={`${casino.name} logo`} width={72} height={72} className="h-[72px] w-[72px] shrink-0 rounded-2xl" priority />
          <div>
            <h1 className="mb-3 text-3xl font-bold leading-tight text-white sm:text-4xl">{casino.name} Bonus and Review</h1>
            <p className="text-sm text-slate-500">
              By{' '}
              <Link href={`/authors/${author.slug}`} className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
                {author.name}
              </Link>{' '}
              · Updated {formatGuideDate(casino.updated)}
            </p>
          </div>
        </header>

        <aside className="mb-10 rounded-2xl border border-hype/40 bg-hype/5 p-5 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {offer?.banner && (
              <a href={casino.playUrl} target="_blank" rel="sponsored noopener noreferrer" className="shrink-0 md:w-80">
                <Image
                  src={offer.banner.src}
                  alt={offer.banner.alt}
                  width={offer.banner.width}
                  height={offer.banner.height}
                  className="w-full rounded-xl"
                  priority
                />
              </a>
            )}
            <div className="flex-1">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-hype">
                Welcome offer{offer?.ends && <> · Ends {formatOfferEnd(offer.ends)}</>}
              </p>
              <p className="text-2xl font-bold text-white">
                {offer ? offer.headline : `See ${casino.name}'s current welcome offer`}
              </p>
              {offer && <p className="mt-1 text-sm text-slate-400">First deposit only. New players.</p>}
              {casino.code && (
                <p className="mt-2 text-sm text-slate-300">
                  Our code: <span className="font-bold text-white">{casino.code}</span>. Signing up through our link
                  connects your account to it.
                </p>
              )}
              <a
                href={casino.playUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-hype px-8 py-3.5 text-base font-black uppercase tracking-wide text-black transition-colors hover:bg-hype/90"
              >
                {offer ? 'Claim bonus' : `Play on ${casino.name}`}
              </a>
            </div>
          </div>
          <p className="mt-5 text-xs text-slate-500">
            18+ · T&amp;Cs apply · Affiliate link: we earn commission if you sign up and play through it.
          </p>
          <GamblingNotice className="mt-1" />
        </aside>

        <div className="max-w-3xl">
          <GuideH2>What you get when you sign up through us</GuideH2>
          <GuideList>
            {casino.ourPerks.map(perk => (
              <li key={perk}>{perk}</li>
            ))}
          </GuideList>
          <GuideP>
            See who&apos;s leading this month on our{' '}
            <Link href="/leaderboard" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
              leaderboard
            </Link>
            .
          </GuideP>

          {Body && <Body playUrl={casino.playUrl} />}

          <GuideH2>Pros and cons</GuideH2>
          <GuideH3>What we like</GuideH3>
          <GuideList>
            {casino.pros.map(pro => (
              <li key={pro}>{pro}</li>
            ))}
          </GuideList>
          <GuideH3>What to keep in mind</GuideH3>
          <GuideList>
            {casino.cons.map(con => (
              <li key={con}>{con}</li>
            ))}
          </GuideList>

          <GuideH2>Details and questions</GuideH2>
          <GuideDetailsGroup>
            <GuideDetails summary={`${casino.name} at a glance`}>
              <table className="mb-2 w-full text-left text-sm">
                <tbody className="divide-y divide-white/10 text-slate-200">
                  {offer && (
                    <tr>
                      <th scope="row" className="w-44 py-3 pr-4 font-normal text-slate-400">Welcome offer</th>
                      <td className="py-3">{offer.headline}</td>
                    </tr>
                  )}
                  {casino.details.map(detail => (
                    <tr key={detail.label}>
                      <th scope="row" className="w-44 py-3 pr-4 font-normal text-slate-400">{detail.label}</th>
                      <td className="py-3">{detail.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GuideDetails>
            {casino.faq.map(item => (
              <GuideDetails key={item.question} summary={item.question}>
                <GuideP>{item.answer}</GuideP>
              </GuideDetails>
            ))}
          </GuideDetailsGroup>

          <GuideP>
            Set a budget before you play and stop when you reach it. If gambling stops being fun,{' '}
            <Link href="/responsible-gambling" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
              there&apos;s free help available
            </Link>
            .
          </GuideP>
        </div>
      </article>
    </div>
  )
}
