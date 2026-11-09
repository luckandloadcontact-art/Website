import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HypeClickTracker } from '@/components/layout/HypeClickTracker'
import { HideOnOverlay } from '@/components/layout/HideOnOverlay'
import { SITE_URL } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'LuckAndLoadTV – Community Hub',
  description: 'The official community hub for LuckAndLoadTV. Streams, bonus hunts, leaderboards and more.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'LuckAndLoadTV',
    description: 'Join the community. Watch the streams. Climb the leaderboard.',
    type: 'website',
    siteName: 'LuckAndLoadTV',
    // Share image for every page without its own. A page that sets openGraph replaces this whole
    // object, so it has to list its images too (see guides and casinos).
    images: [{ url: `${SITE_URL}/og/default.png`, width: 1200, height: 630, alt: 'LuckAndLoadTV' }],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-900 text-slate-200">
        <Providers>
          <HideOnOverlay>
            <Navbar />
          </HideOnOverlay>
          <main>{children}</main>
          <HideOnOverlay>
            <Footer />
          </HideOnOverlay>
        </Providers>
        <HypeClickTracker />
      </body>
    </html>
  )
}
