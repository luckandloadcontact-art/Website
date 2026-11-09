// Casinos listed on /casinos. Add a new entry here to get a card on the list and its own review
// page at /casinos/<slug>. Only state facts we have checked: the casino's own site, its help
// centre, or the casino in writing.

export type CasinoDetail = { label: string; value: string }

export type CasinoFaq = { question: string; answer: string }

export type Casino = {
  slug: string
  name: string
  logo: string
  playUrl: string
  code: string | null
  tags: string[]
  highlights: string[] // Two short lines for the card
  welcomeOffer: string | null // null until confirmed; the page then points to the casino's own offer
  ourPerks: string[]
  details: CasinoDetail[]
  pros: string[]
  cons: string[]
  faq: CasinoFaq[]
  description: string // Meta description for the review page
  reviewTitle: string
  authorSlug: string
  updated: string
}

export const CASINOS: Casino[] = [
  {
    slug: 'hype-bet',
    name: 'Hype.bet',
    logo: '/casinos/hype-bet.png',
    playUrl: 'https://hype.bet/LuckAndLoad',
    code: 'LuckAndLoad',
    tags: ['Multiplayer rooms', 'Crypto', 'Where we stream'],
    highlights: [
      'Play in shared multiplayer rooms with us and other viewers, live on stream',
      'Players under our code compete for $1,000 in prizes every month',
    ],
    welcomeOffer: null,
    ourPerks: [
      'A spot on our monthly leaderboard, with $1,000 in prizes: ranked prizes for the top 6 and a $20 random draw among everyone who plays under our code',
      'Our multiplayer rooms during streams, where you can join a session with us and leave whenever you want',
      'Giveaways on stream and in our Discord',
    ],
    details: [
      { label: 'Operator', value: 'BlackSands B.V.' },
      { label: 'License', value: 'Curaçao Gaming Authority, OGL/2024/985/0430' },
      { label: 'Payments', value: 'Crypto and Interac' },
      { label: 'Multiplayer rooms', value: 'Yes, for casino games' },
      { label: 'Our code', value: 'LuckAndLoad' },
    ],
    pros: [
      'Multiplayer rooms. You can play in a shared room with friends or a streamer in real time, and Hype.bet calls itself the world’s only multiplayer online casino.',
      'A loyalty program where points can be swapped for bonuses, weekly rakeback and free withdrawals.',
      'You can watch us play the games and run the rooms on stream before you decide to sign up.',
    ],
    cons: [
      'A Curaçao license is generally seen as less strict than licenses from EU regulators such as the Malta Gaming Authority, with fewer ways to escalate a complaint.',
      'It’s a young casino. Hype.bet marked its first year of multiplayer gaming in March 2026.',
      'Player reviews are mixed, and some players report slow withdrawals.',
      'Bonuses come with conditions, so read the terms before you opt in.',
    ],
    faq: [
      {
        question: 'Is there a Hype.bet bonus code?',
        answer:
          'Our referral code is LuckAndLoad. Signing up through our link connects your account to it, which puts you on our monthly leaderboard. Hype.bet’s own welcome offers are shown on its site and can change, so check them before you deposit.',
      },
      {
        question: 'How do Hype.bet multiplayer rooms work?',
        answer:
          'A host opens a room and picks the games and bet size. Players can watch for free or add money to a shared pool. Every win or loss is split by each player’s share of the pool, and you can leave at any time. Rooms are for casino games only, not sports betting.',
      },
      {
        question: 'Is Hype.bet licensed?',
        answer:
          'Yes. Hype.bet is run by BlackSands B.V. in Curaçao and licensed by the Curaçao Gaming Authority under license number OGL/2024/985/0430. Check that it’s legal and available where you live before you sign up.',
      },
    ],
    description:
      'Our Hype.bet review: how the multiplayer rooms work, the LuckAndLoad referral code, license details, and the pros and cons from streamers who play there.',
    reviewTitle: 'Hype.bet Review 2026: Multiplayer Rooms, Bonus Code and More',
    authorSlug: 'kristian',
    updated: '2026-11-09',
  },
]

export function getCasino(slug: string) {
  return CASINOS.find(casino => casino.slug === slug)
}
