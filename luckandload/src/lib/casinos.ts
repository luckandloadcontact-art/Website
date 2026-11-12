// Casinos listed on /casinos. Add a new entry here to get a card on the list and its own review
// page at /casinos/<slug>. Only state facts we have checked: the casino's own site, its help
// centre, or the casino in writing. Longer casino-specific sections (bonus mechanics and the like)
// go in src/content/casinos/<slug>.tsx and are registered in app/casinos/[slug]/page.tsx.

export type CasinoDetail = { label: string; value: string }

export type CasinoFaq = { question: string; answer: string }

export type CasinoOffer = {
  headline: string
  ends: string | null // YYYY-MM-DD, the last day of the offer. Hidden automatically after that day.
  banner: { src: string; width: number; height: number; alt: string } | null
}

export type Casino = {
  slug: string
  name: string
  logo: string
  playUrl: string
  code: string | null
  tags: string[]
  highlights: string[]
  welcomeOffer: CasinoOffer | null
  ourPerks: CasinoPerk[]
  details: CasinoDetail[] // Shown on the review page. The list card skips Operator and Multiplayer rooms.
  pros: string[]
  cons: string[]
  faq: CasinoFaq[]
  shareImage: string // 1200x630 preview when the review page is shared (Discord, X, Kick)
  description: string // Meta description for the review page
  reviewTitle: string
  authorSlug: string
  updated: string
  guideSlugs?: string[] // Guides linked under "More about" on the review page
}

export type CasinoPerk = { title: string; text: string }

export const CASINOS: Casino[] = [
  {
    slug: 'hype-bet',
    name: 'Hype.bet',
    logo: '/casinos/hype-bet.png',
    playUrl: 'https://hype.bet/LuckAndLoad',
    code: 'LuckAndLoad',
    tags: ['Multiplayer rooms', 'Highest RTP', 'Monthly Rolex draw'],
    highlights: [
      'Play in shared multiplayer rooms with us and other viewers, live on stream',
      'Slots run on the highest RTP settings available',
      'Players under our code compete for $1,000 in prizes every month',
    ],
    welcomeOffer: {
      headline: '100% up to $500 + 100 free spins',
      ends: '2026-12-01',
      banner: {
        src: '/casinos/hype-welcome-banner.png',
        width: 485,
        height: 240,
        alt: 'Hype.bet welcome offer: 100% bonus and 100 free spins on your first deposit',
      },
    },
    ourPerks: [
      {
        title: 'Monthly leaderboard',
        text: '$1,000 in prizes every month: ranked prizes for the top 6 and a $20 random draw among everyone who plays under our code.',
      },
      {
        title: 'Multiplayer rooms',
        text: 'Join our room during streams and play a session with us. Leave whenever you want.',
      },
      {
        title: 'Giveaways',
        text: 'Regular giveaways on stream and in our Discord.',
      },
    ],
    details: [
      { label: 'Operator', value: 'BlackSands B.V.' },
      { label: 'License', value: 'Curaçao Gaming Authority, OGL/2024/985/0430' },
      { label: 'RTP', value: 'Highest available settings' },
      { label: 'Payments', value: 'Crypto and Interac' },
      { label: 'Multiplayer rooms', value: 'Yes, for casino games' },
      { label: 'Our code', value: 'LuckAndLoad' },
    ],
    pros: [
      'Multiplayer rooms. You can play in a shared room with friends or a streamer in real time, and Hype.bet calls itself the world’s only multiplayer online casino.',
      'Slots run on the highest RTP settings available, so you get the best possible odds on the games.',
      'A welcome bonus that unlocks as you play. Every part you unlock can be withdrawn straight away, with no wagering on it.',
      'Hype Time every month: a Rolex draw where every 1,000 XP is a ticket, and a guaranteed $25,000 for the top 10.',
      'A loyalty program where points can be swapped for bonuses, weekly rakeback and free withdrawals.',
      'We’ve played at Hype.bet for more than a year, and neither we nor our players have run into any significant problems.',
    ],
    cons: [
      'It’s licensed in Curaçao rather than by an EU regulator.',
      'Table games, live casino and crash earn XP 20 times slower than slots, so the welcome bonus unlocks much faster on slots.',
      'Bonus money you haven’t unlocked expires 30 days after you activate it.',
    ],
    faq: [
      {
        question: 'Is there a Hype.bet bonus code?',
        answer:
          'Our referral code is LuckAndLoad. Signing up through our link connects your account to it, which puts you on our monthly leaderboard. New players can also claim Hype.bet’s first-deposit welcome offer, shown at the top of this page.',
      },
      {
        question: 'How does the Hype.bet RakeBoost bonus work?',
        answer:
          'Your first deposit is matched 100%, up to $500, but the bonus isn’t paid out all at once. It unlocks in four equal parts as you earn XP. Every $1 you bet on slots or sports earns 1 XP, and the total XP you need is 50 times your bonus. Each part can be withdrawn as soon as it unlocks.',
      },
      {
        question: 'How does the Hype.bet Rolex draw work?',
        answer:
          'Hype Time runs every month and ends on the last day of the month at 23:59 EST. Every 1,000 XP you earn gives you a ticket for the Rolex draw, and the top 10 players at the end of the month share a guaranteed $25,000. Slots played in a multiplayer room earn double XP during the campaign, so you collect tickets twice as fast.',
      },
      {
        question: 'How do Hype.bet multiplayer rooms work?',
        answer:
          'A host opens a room and picks the games and bet size. Players can watch for free or add money to a shared pool. Every win or loss is split by each player’s share of the pool, and you can leave at any time. Rooms are for casino games only, not sports betting.',
      },
      {
        question: 'Is Hype.bet legit?',
        answer:
          'We’ve streamed and played on Hype.bet for more than a year, and neither we nor the players under our code have run into any significant problems. It’s run by BlackSands B.V. and licensed in Curaçao. Like most casinos, it can ask for ID before a withdrawal, so verifying your account early makes cashing out smoother.',
      },
      {
        question: 'Is Hype.bet licensed?',
        answer:
          'Yes. Hype.bet is run by BlackSands B.V. in Curaçao and licensed by the Curaçao Gaming Authority under license number OGL/2024/985/0430. Check that it’s legal and available where you live before you sign up.',
      },
    ],
    shareImage: '/og/hype-bet.jpg',
    description:
      'The Hype.bet bonus code LuckAndLoad explained: 100% RakeBoost up to $500, 100 free spins, the monthly Rolex draw, double XP in rooms and the bonus terms.',
    reviewTitle: 'Hype.bet Bonus Code and Welcome Offer 2026',
    authorSlug: 'kristian',
    guideSlugs: ['hype-bet-review', 'is-hype-bet-legit', 'does-rtp-matter', 'what-is-a-bonus-hunt'],
    updated: '2026-11-12',
  },
]

export function getCasino(slug: string) {
  return CASINOS.find(casino => casino.slug === slug)
}

/** The welcome offer, or null once its last day has passed (UTC). */
export function activeOffer(casino: Casino, now = new Date()): CasinoOffer | null {
  const offer = casino.welcomeOffer
  if (!offer) return null
  if (offer.ends && now.toISOString().slice(0, 10) > offer.ends) return null
  return offer
}

export function formatOfferEnd(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
