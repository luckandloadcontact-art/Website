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
  // Optional opening sentence for the Hype.bet box at the end of the article.
  ctaLead?: string
  // Shown on the guides overview. `position` is a CSS object-position for cropping the image.
  category: string
  cover: { src: string; position?: string }
  // Always shown as the big card at the top of the guides overview, whatever its date.
  pinned?: boolean
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
      'Simon has an education in marketing and writes articles for LuckAndLoadTV about online casinos, bonuses and how the games work.',
      'When he\'s not writing, you can find Simon live on Kick and Twitch, hosting bonus hunts and multiplayer casino rooms, or in the LuckAndLoadTV Discord, where the banter carries on after the stream ends.',
    ],
  },
]

// Newest first. Each guide's body is registered in app/guides/[slug]/page.tsx.
export const GUIDES: Guide[] = [
  {
    slug: 'hype-bet-review',
    pinned: true,
    category: 'Hype.bet',
    cover: { src: '/casinos/hype-rolex-draw.png', position: 'center 45%' },
    title: 'Hype.bet Review 2026: Our Honest Verdict After a Year',
    description:
      'Our Hype.bet review after a year of streaming there: multiplayer rooms, games and RTP, the welcome bonus, Hype Time, withdrawals, the downsides and our verdict.',
    authorSlug: 'kristian',
    published: '2026-11-13',
    updated: '2026-11-13',
    readingMinutes: 6,
    ctaLead: 'Hype.bet is where we stream every week, and where our multiplayer room is.',
  },
  {
    slug: 'what-is-a-bonus-hunt',
    category: 'Bonus hunts',
    cover: { src: '/guides/bonus-hunt-cover.jpg', position: 'center' },
    title: 'What Is a Bonus Hunt? How It Works, Explained by Streamers',
    description:
      'What is a bonus hunt? How streamers collect and open slot bonuses, what break-even means, an example with numbers, and the hunt formats we run on stream.',
    authorSlug: 'kristian',
    published: '2026-11-12',
    updated: '2026-11-13',
    readingMinutes: 6,
    ctaLead: 'Our bonus hunts run live on Kick and Twitch, in a Hype.bet multiplayer room you can join.',
  },
  {
    slug: 'does-rtp-matter',
    category: 'RTP',
    cover: { src: '/guides/slot-rtp-cover.jpg', position: 'center' },
    title: 'Does Slot RTP Matter? Hacksaw and Nolimit City RTP Versions',
    description:
      'Slot RTP explained: why the same slot pays back less at some casinos, the RTP versions Hacksaw and Nolimit City use, bonus buy RTP, and how to check it.',
    authorSlug: 'simon',
    published: '2026-11-10',
    updated: '2026-11-12',
    readingMinutes: 6,
    ctaLead: 'Hype.bet runs the highest RTP versions of its games.',
  },
  {
    slug: 'deposit-without-welcome-bonus',
    category: 'Bonuses',
    cover: { src: '/guides/wagering-cover.jpg', position: 'center' },
    title: 'Wagering Requirements: Is a Casino Welcome Bonus Worth It?',
    description:
      "What wagering requirements really cost, the 14,000 kr win I couldn't withdraw, no wagering bonuses, and when to skip the casino welcome bonus.",
    authorSlug: 'kristian',
    published: '2026-11-05',
    updated: '2026-11-13',
    readingMinutes: 4,
  },
  {
    slug: 'is-hype-bet-legit',
    category: 'Hype.bet',
    cover: { src: '/guides/is-hype-bet-legit-cover.jpg', position: 'center' },
    title: 'Is Hype.bet Legit? Our Honest Answer After a Year',
    description:
      'Is Hype.bet legit and safe? Who runs it, its license, what Trustpilot reviews say, whether the games are rigged, and how to avoid problems with withdrawals.',
    authorSlug: 'simon',
    published: '2026-11-04', // Shown as our first guide, at the bottom of the list
    updated: '2026-11-12',
    readingMinutes: 4,
    ctaLead: "We've played on Hype.bet for more than a year without any significant problems.",
  },
]

// A guide goes live at midnight Norwegian time on its `published` date. Until then it's left out
// of every list and its page returns 404, so a guide can be added ahead of time. Pages that list
// guides revalidate hourly, so it appears without a new deploy.
export const GUIDES_REVALIDATE_SECONDS = 3600

function todayInOslo(now = new Date()) {
  return now.toLocaleDateString('en-CA', { timeZone: 'Europe/Oslo' }) // YYYY-MM-DD
}

export function isPublished(guide: Guide, now = new Date()) {
  return guide.published <= todayInOslo(now)
}

export function publishedGuides(now = new Date()) {
  return GUIDES.filter(guide => isPublished(guide, now))
}

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

/** Page title with " – LuckAndLoadTV" added only when it still fits in Google's ~60 characters. */
export function seoTitle(title: string) {
  const branded = `${title} – LuckAndLoadTV`
  return branded.length <= 60 ? branded : title
}

/**
 * Where "Read our Hype.bet review" links go: the review guide once it's published, and the bonus
 * code page until then. The anchor text says "review", so it should point at the review page.
 */
export function hypeReviewHref(now = new Date()) {
  const review = getGuide('hype-bet-review')
  return review && isPublished(review, now) ? '/guides/hype-bet-review' : '/casinos/hype-bet'
}
