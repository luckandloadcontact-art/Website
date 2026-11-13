import Link from 'next/link'
import {
  GuideDetails,
  GuideDetailsGroup,
  GuideH2,
  GuideH3,
  GuideInlineCta,
  GuideList,
  GuideP,
  JsonLd,
} from '@/components/guides/GuideContent'

const LINK = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

// Platform rules as checked on 14 Nov 2026: Kick Community Guidelines (Guideline 11, read on
// kick.com), YouTube's "Sale of illegal or regulated goods or services" policy (read on
// support.google.com), and Twitch's 2022 gambling announcement as reported by NPR, NBC and PC Gamer.
// Keep the wording close to the sources, and re-check before changing anything here.
const PLATFORMS = [
  {
    platform: 'Twitch',
    slots: 'Not from sites without a licence in the US or another jurisdiction with enough consumer protection. Named sites include Stake, Rollbit, Duelbits, Roobet, Blaze and Gamdom.',
    allowed: 'Poker, sports betting and fantasy sports',
    subs: '50/50 as standard',
  },
  {
    platform: 'Kick',
    slots: 'Allowed, following the gambling laws where you are, with no minors and no gambling with other users’ money',
    allowed: 'Affiliate links and sponsored gambling for licensed sites, clearly disclosed',
    subs: '95/5, as advertised by Kick',
  },
  {
    platform: 'YouTube',
    slots: 'Age-restricted, and no links to or promotion of gambling sites that aren’t certified by Google',
    allowed: 'Some sports betting from Google-certified providers',
    subs: '–',
  },
]

// Short answers to what people search about gambling streams. Also sent to Google as FAQPage data.
const FAQ = [
  {
    question: 'Can you gamble on Twitch?',
    answer:
      'Partly. Since 18 October 2022 Twitch has banned streams of slots, roulette and dice from sites that aren’t licensed in the US or another jurisdiction with sufficient consumer protection. Poker, sports betting and fantasy sports are still allowed.',
  },
  {
    question: 'Which gambling sites are banned on Twitch?',
    answer:
      'Twitch named Stake, Rollbit, Duelbits and Roobet when the rule started, and later added Blaze and Gamdom. Twitch said it may identify others, so a site that isn’t on the list isn’t automatically allowed.',
  },
  {
    question: 'Can you stream gambling on Kick?',
    answer:
      'Yes. Kick allows gambling content as long as you follow the gambling laws where you are, never let minors take part, don’t gamble with funds provided by other users, label the stream 18+ and disclose affiliate links clearly. Sponsored gambling is only allowed for licensed sites.',
  },
  {
    question: 'Can you stream gambling on YouTube?',
    answer:
      'Online gambling content is age-restricted on YouTube, so viewers under 18 or not logged in can’t watch it. Linking to or promoting gambling sites that aren’t certified by Google is not allowed. In our experience, slot streams on a smaller channel get taken down a lot.',
  },
  {
    question: 'Can you gamble channel points on Twitch?',
    answer:
      'Twitch predictions let viewers bet channel points on what happens in a stream. Channel points can’t be bought or cashed out, so it isn’t gambling with real money.',
  },
  {
    question: 'How do gambling streamers make money?',
    answer:
      'From several places at once: affiliate and referral deals with casinos, subscriptions on Kick and Twitch, sponsorships, and the gambling itself, which can just as easily cost money. Some take donations too.',
  },
  {
    question: 'What gambling sites do streamers use?',
    answer:
      'Mostly crypto casinos that allow streaming and run affiliate programmes. Which one a streamer uses usually comes down to their deal with the casino and the features it has. We use Hype.bet because of its multiplayer rooms.',
  },
]

export default function CanYouGambleOnTwitch() {
  return (
    <>
      <GuideP>
        Yes, but not everything. Twitch bans slots, roulette and dice from casinos without a proper licence, while poker
        and sports betting are still allowed. Kick allows gambling with a few clear rules, and YouTube age-restricts it.
        We stream slots on both Kick and Twitch, and we tried YouTube before that, so here&apos;s how the platforms
        compare from our side of the camera.
      </GuideP>

      <div className="mb-6 max-w-3xl overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead className="border-b border-white/20 text-white">
            <tr>
              <th scope="col" className="py-3 pr-4 font-semibold">Platform</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Slots and casino</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Also allowed</th>
              <th scope="col" className="py-3 font-semibold">Sub split (creator/platform)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {PLATFORMS.map(row => (
              <tr key={row.platform}>
                <th scope="row" className="py-3 pr-4 align-top font-semibold text-white">{row.platform}</th>
                <td className="py-3 pr-4 align-top">{row.slots}</td>
                <td className="py-3 pr-4 align-top">{row.allowed}</td>
                <td className="py-3 align-top">{row.subs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GuideH2>Can you gamble on Twitch?</GuideH2>
      <GuideP>
        Since 18 October 2022, Twitch has banned streams of sites with &quot;slots, roulette, or dice games that
        aren&apos;t licensed either in the U.S. or other jurisdictions that provide sufficient consumer protection.&quot;
        It named Stake, Rollbit, Duelbits and Roobet when the rule started, and later added Blaze and Gamdom. Twitch also
        restricts sharing links and referral codes to sites like these.
      </GuideP>
      <GuideP>
        The list isn&apos;t the whole rule. Twitch said it may identify other sites, so a casino that isn&apos;t named
        isn&apos;t automatically fine. What stayed allowed is poker, sports betting and fantasy sports. Gambling streams
        should also carry Twitch&apos;s gambling label, so they aren&apos;t shown to people who don&apos;t want them.
      </GuideP>
      <GuideH3>Can you gamble channel points on Twitch?</GuideH3>
      <GuideP>
        Not for real money. Twitch predictions let viewers bet channel points on what happens in a stream, like whether a
        bonus pays more than 100x. Channel points can&apos;t be bought or cashed out, so it&apos;s a game, not gambling.
      </GuideP>

      <GuideH2>Gambling on Kick</GuideH2>
      <GuideP>
        Kick allows gambling content, and its Community Guidelines spell out the rules:
      </GuideP>
      <GuideList>
        <li>Follow the gambling laws where you stream from.</li>
        <li>Minors must never take part.</li>
        <li>
          No gambling with funds provided by other users, such as making viewers buy in to enter a giveaway.
        </li>
        <li>
          Affiliate links are allowed if they&apos;re clearly disclosed, close to the link or said out loud on stream.
        </li>
        <li>Sponsored gambling is only allowed for sites that hold a valid licence.</li>
        <li>Gambling streams need the 18+ label and the right category.</li>
      </GuideList>
      <GuideP>
        We&apos;re a little bigger on Kick than on Twitch, though it changes from day to day. We haven&apos;t had problems
        on either platform, but you do feel safer on Kick, where gambling is clearly part of what the platform is for.
        The subscription split is the other big difference. Kick advertises a 95/5 split in the streamer&apos;s favour,
        while Twitch&apos;s standard split is 50/50. For a smaller channel, that&apos;s an enormous difference.
      </GuideP>

      <GuideH2>Gambling on YouTube</GuideH2>
      <GuideP>
        YouTube&apos;s policy age-restricts content that &quot;facilitates access to, promotes, or depicts online
        gambling,&quot; even from certified sites, so viewers under 18 or not logged in can&apos;t watch it. Facilitating
        access to gambling sites that aren&apos;t certified by Google isn&apos;t allowed, and neither is promising
        guaranteed returns.
      </GuideP>
      <GuideP>
        For us, YouTube was hopeless. We got a lot of strikes, and for many of them we never got an exact reason. Every
        time we appealed, the appeal went through, because we hadn&apos;t done anything wrong, but the stream had still
        been taken down. Copyrighted music in games and in the background caused problems too. As a smaller channel,
        streaming slots on YouTube is hard.
      </GuideP>

      <GuideH2>What gambling sites do streamers use?</GuideH2>
      <GuideP>
        Most casino streamers play on crypto casinos that allow streaming and run affiliate programmes. Which one a
        streamer picks usually comes down to their deal with the casino and the features it offers. We use Hype.bet,
        and the reason is the multiplayer rooms: our viewers can join our session with their own money and share the
        result, instead of just watching.{' '}
        <Link href="/guides/multiplayer-casino" className={LINK}>
          Here&apos;s how multiplayer rooms work
        </Link>
        . We earn commission when people sign up through our link, and we say so wherever we link to it.
      </GuideP>

      <GuideH2>How do gambling streamers make money?</GuideH2>
      <GuideP>There are several income streams, and most streamers use a mix of them:</GuideP>
      <GuideList>
        <li>
          <strong className="text-white">Referrals and affiliate deals.</strong> The casino pays the streamer for players
          who sign up through their link or code.
        </li>
        <li>
          <strong className="text-white">Subscriptions on Kick and Twitch.</strong> This is where Kick&apos;s split makes
          the biggest difference.
        </li>
        <li>
          <strong className="text-white">Sponsorships.</strong> Paid partnerships, which have to be disclosed on both
          platforms.
        </li>
        <li>
          <strong className="text-white">The gambling itself.</strong> Wins count, but so do losses. It&apos;s the least
          reliable part of the income, and some sessions cost money.
        </li>
        <li>
          <strong className="text-white">Donations.</strong> We&apos;ve decided not to push donations, because asking
          for money feels strange on a gambling stream. If someone wants to, they can tip us in our Hype.bet room.
        </li>
      </GuideList>
      <GuideP>
        How much gambling streamers make varies enormously. The biggest names reportedly have deals worth millions, but
        for most channels it&apos;s a mix of small income streams that has to be built up over time.
      </GuideP>

      <GuideInlineCta
        title="Watch us live on Kick and Twitch"
        secondary={{ href: '/guides/multiplayer-casino', label: 'How our multiplayer room works' }}
      >
        Most of our streams start with a bonus hunt in our Hype.bet room. Join with what you want, or just watch and chat.
      </GuideInlineCta>

      <GuideH2>Streaming on Kick and Twitch at the same time</GuideH2>
      <GuideP>
        Multistreaming gets you on both platforms at once, but it can split your community in two: Kick viewers talking
        in one chat, Twitch viewers in another, and neither side seeing the whole conversation. What worked for us is
        one big shared chat on screen that shows messages from both, so viewers on Kick and Twitch can actually talk to
        each other. It makes the stream feel like one room instead of two.
      </GuideP>

      <GuideH2>Questions about gambling streams</GuideH2>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }}
      />
      <GuideDetailsGroup>
        {FAQ.map(item => (
          <GuideDetails key={item.question} summary={item.question}>
            <GuideP>{item.answer}</GuideP>
          </GuideDetails>
        ))}
      </GuideDetailsGroup>

      <GuideP>
        Gambling streams are for adults, and watching someone win doesn&apos;t change your own odds. If gambling stops
        being fun,{' '}
        <Link href="/responsible-gambling" className={LINK}>
          there&apos;s free help available
        </Link>
        .
      </GuideP>
    </>
  )
}
