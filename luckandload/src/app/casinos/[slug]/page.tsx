import type { ComponentType } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, Info } from 'lucide-react'
import { GuideDetails, GuideDetailsGroup, GuideH2, GuideList, GuideP, JsonLd } from '@/components/guides/GuideContent'
import { StickyClaimBar } from '@/components/casinos/StickyClaimBar'
import { GamblingNotice } from '@/components/ui/GamblingNotice'
import HypeBetReview from '@/content/casinos/hype-bet'
import { CASINOS, activeOffer, formatOfferEnd, getCasino } from '@/lib/casinos'
import { SITE_URL, formatGuideDate, getAuthor, getGuide, isPublished, seoTitle, type Guide } from '@/lib/guides'

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
  // This page targets "bonus code"; the full review is its own guide (guides/hype-bet-review), so the
  // two pages don't compete for the same search.
  const title = offer ? `${casino.name} Bonus Code: ${offer.headline}` : casino.reviewTitle
  return {
    title: seoTitle(title),
    description: casino.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: casino.description,
      type: 'article',
      url,
      images: [{ url: `${SITE_URL}${casino.shareImage}`, width: 1200, height: 630, alt: title }],
    },
  }
}

export default function CasinoReviewPage({ params }: { params: { slug: string } }) {
  const casino = getCasino(params.slug)
  const author = casino && getAuthor(casino.authorSlug)
  if (!casino || !author) notFound()

  const url = `${SITE_URL}/casinos/${casino.slug}`
  const offer = activeOffer(casino)
  const Body = BODIES[casino.slug]
  // Guides about this casino, in the order listed. Scheduled ones appear on their publish day.
  const relatedGuides = (casino.guideSlugs ?? [])
    .map(slug => getGuide(slug))
    .filter((guide): guide is Guide => !!guide && isPublished(guide))

  return (
    <div className="min-h-screen px-4 pt-12 pb-28 sm:px-6 md:pb-12 lg:px-8">
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

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: `${casino.name} Bonus Code`, item: url },
          ],
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
            <h1 className="mb-3 text-3xl font-bold leading-tight text-white sm:text-4xl">{casino.name} Bonus Code &amp; Welcome Offer</h1>
            <p className="text-sm text-slate-500">
              By{' '}
              <Link href={`/authors/${author.slug}`} className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
                {author.name}
              </Link>{' '}
              · Updated {formatGuideDate(casino.updated)}
            </p>
          </div>
        </header>

        <aside id="offer-box" className="mb-10 rounded-2xl border border-hype/40 bg-hype/5 p-5 sm:p-6">
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
              {offer?.extra && <p className="text-lg font-bold text-hype">{offer.extra.text}</p>}
              {offer && (
                <p className="mt-1 text-sm text-slate-400">
                  First deposit only. New players.{offer.extra && <> {offer.extra.condition}</>}
                </p>
              )}
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
          {Body && <Body playUrl={casino.playUrl} />}

          <GuideH2>What you get when you sign up through us</GuideH2>
          <GuideList>
            {casino.ourPerks.map(perk => (
              <li key={perk.title}>
                <strong className="text-white">{perk.title}.</strong> {perk.text}
              </li>
            ))}
          </GuideList>
          <GuideP>
            See who&apos;s leading this month on our{' '}
            <Link href="/leaderboard" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
              leaderboard
            </Link>
            .
          </GuideP>
        </div>

        <GuideH2>Pros and cons</GuideH2>
        <div className="mb-6 grid gap-4 md:grid-cols-[3fr_2fr]">
          <div className="rounded-xl border border-hype/25 bg-hype/[0.04] p-5 sm:p-6">
            <h3 className="mb-4 text-lg font-bold text-white">What we like</h3>
            <ul className="space-y-3 text-sm leading-6 text-slate-200">
              {casino.pros.map(pro => (
                <li key={pro} className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-hype" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-surface-800 p-5 sm:p-6">
            <h3 className="mb-4 text-lg font-bold text-white">What to keep in mind</h3>
            <ul className="space-y-3 text-sm leading-6 text-slate-200">
              {casino.cons.map(con => (
                <li key={con} className="flex gap-3">
                  <Info size={18} className="mt-0.5 shrink-0 text-amber-300" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-3xl">

          <GuideH2>Details and questions</GuideH2>
          <GuideDetailsGroup>
            <GuideDetails summary={`${casino.name} at a glance`}>
              <table className="mb-2 w-full text-left text-sm">
                <tbody className="divide-y divide-white/10 text-slate-200">
                  {offer && (
                    <tr>
                      <th scope="row" className="w-44 py-3 pr-4 font-normal text-slate-400">Welcome offer</th>
                      <td className="py-3">
                        {offer.headline}
                        {offer.extra && <> {offer.extra.text}</>}
                      </td>
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

          {relatedGuides.length > 0 && (
            <>
              <GuideH2>More about {casino.name}</GuideH2>
              <ul className="mb-6 space-y-2">
                {relatedGuides.map(guide => (
                  <li key={guide.slug}>
                    <Link href={`/guides/${guide.slug}`} className="font-semibold text-brand-400 underline underline-offset-2 hover:text-brand-300">
                      {guide.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <GuideP>
            Set a budget before you play and stop when you reach it. If gambling stops being fun,{' '}
            <Link href="/responsible-gambling" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
              there&apos;s free help available
            </Link>
            .
          </GuideP>
        </div>

        <footer className="mt-12 flex max-w-3xl items-start gap-4 border-t border-white/10 pt-6">
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
              <Link href={`/authors/${author.slug}`} className="font-semibold text-white hover:text-brand-300 transition-colors">
                {author.name}
              </Link>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">{author.bio}</p>
          </div>
        </footer>
      </article>

      <StickyClaimBar
        targetId="offer-box"
        href={casino.playUrl}
        headline={offer ? offer.headline : `Play on ${casino.name}`}
        label={offer ? 'Claim' : 'Play'}
      />
    </div>
  )
}
