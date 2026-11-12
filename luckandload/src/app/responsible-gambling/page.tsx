import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/guides'
import { LegalPage, LegalSection } from '@/components/layout/LegalPage'

export const metadata: Metadata = {
  title: 'Gambling Help – LuckAndLoadTV',
  description: 'Where to get confidential help with gambling, and how to keep gambling under control.',
  alternates: { canonical: `${SITE_URL}/responsible-gambling` },
}

const linkClass = 'text-brand-400 hover:text-brand-300 underline underline-offset-2'

export default function ResponsibleGamblingPage() {
  return (
    <LegalPage
      title="Gambling Help"
      intro="Our streams are entertainment. Gambling is for adults only, and it should never feel like something you have to do."
    >
      <LegalSection title="Need to talk to someone?">
        <p>
          <strong className="text-white">Norway: Hjelpelinjen</strong> — an anonymous helpline for people worried
          about their own or someone else&apos;s gambling. Help is also available in English.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Phone: <a href="tel:80080040" className={linkClass}>800 800 40</a> (weekdays 09:00–18:00)
          </li>
          <li>Chat: weekdays 11:00–15:00, on their website</li>
          <li>
            Email: <a href="mailto:post@hjelpelinjen.no" className={linkClass}>post@hjelpelinjen.no</a>
          </li>
          <li>
            Website:{' '}
            <a href="https://hjelpelinjen.no/?lang=en" target="_blank" rel="noopener noreferrer" className={linkClass}>
              hjelpelinjen.no
            </a>
          </li>
        </ul>
        <p>
          <strong className="text-white">Great Britain: GambleAware</strong> — free advice, self-assessment and
          blocking tools.{' '}
          <a href="https://www.gambleaware.org/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            gambleaware.org
          </a>
        </p>
        <p>Anywhere else, search for the national gambling helpline in your country, or talk to your doctor.</p>
      </LegalSection>

      <LegalSection title="Signs it may be time to stop">
        <ul className="list-disc space-y-1 pl-5">
          <li>You spend more money or time than you planned to</li>
          <li>You keep playing to win back what you lost</li>
          <li>You borrow money or sell things to gamble</li>
          <li>You hide your gambling from people close to you</li>
          <li>Gambling affects your sleep, work, relationships or mood</li>
        </ul>
      </LegalSection>

      <LegalSection title="Keep it under control">
        <ul className="list-disc space-y-1 pl-5">
          <li>Only play with money you can afford to lose</li>
          <li>Set a budget and a time limit before you start, and stick to them</li>
          <li>Never chase losses</li>
          <li>Don&apos;t gamble when you are upset, stressed or drinking</li>
          <li>Use the deposit limits and self-exclusion options your casino offers</li>
        </ul>
      </LegalSection>

      <LegalSection title="What you see on stream">
        <p>
          Big wins make the best clips, but they are not typical. Casino games are built so that the house wins over
          time, and gambling is not a way to make money.
        </p>
        <p>
          We earn commission when people sign up and play through our links, so we have a financial interest in what
          we promote. Keep that in mind when you watch us.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
