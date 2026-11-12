import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/guides'
import { LegalPage, LegalSection } from '@/components/layout/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy – LuckAndLoadTV',
  description: 'What personal data LuckAndLoadTV collects, why, and the rights you have over it.',
  alternates: { canonical: `${SITE_URL}/privacy` },
}

const linkClass = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What we collect when you use luckandloadtv.com, why we collect it, and what you can do about it."
      updated="November 11, 2026"
    >
      <LegalSection title="Who is responsible">
        <p>
          LuckAndLoadTV is responsible for the personal data described here. Contact us at{' '}
          <a href="mailto:luckandloadcontact@gmail.com" className={linkClass}>luckandloadcontact@gmail.com</a>.
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-white">From Discord, when you sign in:</strong> your Discord ID, username, display
            name, avatar and email address.
          </li>
          <li>
            <strong className="text-white">From using the site:</strong> your last login time, loads balance and
            history, your results in Daily Blackjack and Guess the Slot, and the games you suggest for the Slot Wheel.
          </li>
          <li>
            <strong className="text-white">From Hype.bet:</strong> the username, avatar, XP and amount wagered of
            players under our code. Top players are shown publicly on the leaderboard, without the amount wagered, and
            we save the standings for past months. We also keep a monthly list of all players and what they wagered,
            which only our admin team can see.
          </li>
          <li>
            <strong className="text-white">Clicks on Hype.bet links:</strong> we count how many clicks each page gets
            per day. These counts don&apos;t identify you.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Why we use it">
        <ul className="list-disc space-y-1 pl-5">
          <li>To give you an account and run the games and loads you sign up for (our agreement with you)</li>
          <li>To run the leaderboard, pay out prizes, and prevent cheating (our legitimate interest)</li>
          <li>To see how many new players we bring to Hype.bet and which pages work best (our legitimate interest)</li>
        </ul>
        <p>We don&apos;t sell your data, and we don&apos;t send you marketing emails.</p>
      </LegalSection>

      <LegalSection title="Who else handles it">
        <p>
          We use Supabase (database), Vercel (hosting) and Discord (sign-in) to run the site. They may process data
          outside the EEA, including in the United States.
        </p>
        <p>
          The site also loads fonts from Google and embeds players from Twitch, Kick and YouTube. These companies
          receive your IP address and may set their own cookies under their own privacy policies.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We use cookies to keep you signed in, for up to 30 days. They are needed for sign-in to work. We don&apos;t
          use analytics or advertising cookies of our own.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          We keep your account data until you ask us to delete it. We may keep what we need to document prizes we have
          paid out.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          You can ask to see, correct or delete your data, object to how we use it, or get a copy of it. Email us and
          we&apos;ll help. If you think we handle your data wrongly, you can complain to the Norwegian Data Protection
          Authority,{' '}
          <a href="https://www.datatilsynet.no/en/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            Datatilsynet
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
