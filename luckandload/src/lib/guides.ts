export const SITE_URL = 'https://luckandloadtv.com'

export type Author = {
  slug: string
  name: string
  alias?: string
  image: string
  role: string
  bio: string
  about: string[]
  funFact?: string
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
    alias: 'Luck',
    image: '/authors/kristian.jpg',
    role: 'Co-founder of LuckAndLoadTV',
    bio: 'Kristian, better known as "Luck", is the co-founder of LuckAndLoadTV, a Norwegian casino streaming and entertainment brand he runs alongside Simon.',
    about: [
      'Kristian, better known as "Luck", is the co-founder of LuckAndLoadTV, a Norwegian casino streaming and entertainment brand he runs alongside Simon.',
      'What started as a shared passion for online slots, bonus hunts, and multiplayer casino rooms eventually turned into a full-time job. In September 2026, Kristian and Simon decided to go all in, leaving their regular jobs behind to focus on streaming and building the LuckAndLoadTV community.',
      'Kristian holds a bachelor\'s degree in Digital Marketing and Sales Management and has several years of experience in content creation, website development, and online marketing.',
      'When he\'s not chasing max wins on stream, Kristian writes about slot games, new releases, bonus features, and everything happening in the online casino world. Expect firsthand experiences, honest opinions, and probably a little too much enthusiasm for a good bonus hunt.',
    ],
    funFact: 'I have been bit by a lion.',
  },
  {
    slug: 'simon',
    name: 'Simon',
    image: '/authors/simon.jpg',
    role: 'Co-founder of LuckAndLoadTV',
    bio: 'Simon is the co-founder of LuckAndLoadTV, a Norwegian casino streaming and entertainment brand run together with Kristian.',
    about: [
      'Simon is the co-founder of LuckAndLoadTV, a Norwegian casino streaming and entertainment brand run together with Kristian.',
      'The two friends first went live in September 2025, after deciding to stop talking about streaming and actually do it. In September 2026, Simon and Kristian left their regular jobs to work on LuckAndLoadTV full-time.',
      'Today, you can find Simon live on Kick and Twitch, hosting bonus hunts and multiplayer casino rooms, or in the LuckAndLoadTV Discord, where the banter carries on after the stream ends.',
    ],
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
