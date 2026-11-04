import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, LegalSection } from '@/components/layout/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Use – LuckAndLoadTV',
  description: 'The terms for using the LuckAndLoadTV website, its games, loads and leaderboard.',
}

const linkClass = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="By using luckandloadtv.com you agree to these terms. If you don't agree, please don't use the site."
      updated="November 4, 2026"
    >
      <LegalSection title="Age">
        <p>You must be 18 or older to create an account on this site or to follow any links to casino sites from it.</p>
      </LegalSection>

      <LegalSection title="What this site is">
        <p>
          LuckAndLoadTV is a community site for our streams. We are not a casino, and you cannot deposit, wager or
          withdraw real money here. Daily Blackjack, Guess the Slot and the other games on this site are free to play.
        </p>
      </LegalSection>

      <LegalSection title="Affiliate links">
        <p>
          Some links on this site, including those to Hype.bet, are affiliate links. We earn commission when people
          sign up and play through them. Any account you create on a casino site is between you and that casino, and
          its own terms apply.
        </p>
        <p>
          Gambling laws differ between countries. It is your responsibility to check that you are allowed to use a
          casino site where you live.
        </p>
      </LegalSection>

      <LegalSection title="Loads">
        <p>
          Loads are points you earn on this site. They have no cash value and cannot be sold, transferred or exchanged
          for money. Any rewards you can get for loads will be announced on this site, along with their conditions.
        </p>
        <p>We may adjust balances to correct mistakes or remove loads gained through breaking these terms.</p>
      </LegalSection>

      <LegalSection title="Monthly leaderboard">
        <p>
          The leaderboard ranks players by the XP they earn under our code on Hype.bet during the calendar month (UTC),
          using the numbers Hype.bet gives us. Current prizes and conditions are shown on the{' '}
          <Link href="/leaderboard" className={linkClass}>leaderboard page</Link>. The numbers shown during the month
          may be delayed, and final standings are based on Hype.bet&apos;s numbers for the whole month.
        </p>
      </LegalSection>

      <LegalSection title="Fair play">
        <p>
          Don&apos;t use bots, scripts, multiple accounts or bugs to gain an advantage, and don&apos;t try to disrupt
          the site. We may remove loads, disqualify you from prizes or close your account if you do.
        </p>
      </LegalSection>

      <LegalSection title="No guarantees">
        <p>
          The site is provided as it is. We can change or remove features at any time, and we can&apos;t promise it
          will always be available or free of errors. Nothing here is financial advice. These terms don&apos;t limit
          any rights you have under mandatory consumer law.
        </p>
      </LegalSection>

      <LegalSection title="Changes and contact">
        <p>
          We may update these terms and will change the date above when we do. Norwegian law applies to these terms.
          Questions? Email{' '}
          <a href="mailto:luckandloadcontact@gmail.com" className={linkClass}>luckandloadcontact@gmail.com</a>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
