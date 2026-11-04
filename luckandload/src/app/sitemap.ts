import type { MetadataRoute } from 'next'

const SITE_URL = 'https://luckandloadtv.com'

const ROUTES = [
  '',
  '/leaderboard',
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
  return ROUTES.map(route => ({ url: `${SITE_URL}${route}` }))
}
