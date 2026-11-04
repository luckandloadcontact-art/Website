import type { MetadataRoute } from 'next'

const SITE_URL = 'https://luckandloadtv.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/auth/', '/profile'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
