import type { MetadataRoute } from 'next'
import { CASINOS } from '@/lib/casinos'
import { AUTHORS, SITE_URL, publishedGuides } from '@/lib/guides'

const ROUTES = [
  '',
  '/leaderboard',
  // /casinos redirects to the single casino until there are several.
  ...(CASINOS.length > 1 ? ['/casinos'] : []),
  '/guides',
  '/blackjack',
  '/guess-the-slot',
  '/slot-wheel',
  '/events',
  '/contact',
  '/responsible-gambling',
  '/terms',
  '/privacy',
]

// Hourly, so scheduled guides are added on their publish day.
export const revalidate = 3600

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...ROUTES.map(route => ({ url: `${SITE_URL}${route}` })),
    ...publishedGuides().map(guide => ({ url: `${SITE_URL}/guides/${guide.slug}`, lastModified: guide.updated })),
    ...AUTHORS.map(author => ({ url: `${SITE_URL}/authors/${author.slug}` })),
    ...CASINOS.map(casino => ({ url: `${SITE_URL}/casinos/${casino.slug}`, lastModified: casino.updated })),
  ]
}
