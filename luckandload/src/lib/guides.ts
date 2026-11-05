export const SITE_URL = 'https://luckandloadtv.com'

export type Author = {
  slug: string
  name: string
  role: string
  bio: string
}

export type Guide = {
  slug: string
  title: string
  description: string
  authorSlug: string
  published: string
  updated: string
  readingMinutes: number
}

export const AUTHORS: Author[] = [
  {
    slug: 'kristian',
    name: 'Kristian',
    role: 'Co-host of LuckAndLoadTV',
    bio: 'Kristian is one of the two hosts of LuckAndLoadTV, together with Simon. They stream on Twitch and Kick and run the community\'s Discord, games and monthly leaderboard.',
  },
]

// Newest first. Each guide's body is registered in app/guides/[slug]/page.tsx.
export const GUIDES: Guide[] = [
  {
    slug: 'deposit-without-welcome-bonus',
    title: 'Depositing Without a Welcome Bonus: Pros and Cons',
    description:
      'Should you skip the casino welcome bonus? See the pros and cons of depositing without one, what wagering costs in numbers, and how to opt out.',
    authorSlug: 'kristian',
    published: '2026-11-05',
    updated: '2026-11-05',
    readingMinutes: 3,
  },
]

export function getGuide(slug: string) {
  return GUIDES.find(guide => guide.slug === slug)
}

export function getAuthor(slug: string) {
  return AUTHORS.find(author => author.slug === slug)
}

export function formatGuideDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
