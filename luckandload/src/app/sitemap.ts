import type { MetadataRoute } from 'next'
import { CASINOS } from '@/lib/casinos'
import { AUTHORS, GUIDES, SITE_URL } from '@/lib/guides'

const ROUTES = [
  '',
  '/leaderboard',
  '/casinos',
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

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...ROUTES.map(route => ({ url: `${SITE_URL}${route}` })),
    ...GUIDES.map(guide => ({ url: `${SITE_URL}/guides/${guide.slug}`, lastModified: guide.updated })),
    ...AUTHORS.map(author => ({ url: `${SITE_URL}/authors/${author.slug}` })),
    ...CASINOS.map(casino => ({ url: `${SITE_URL}/casinos/${casino.slug}`, lastModified: casino.updated })),
  ]
}
