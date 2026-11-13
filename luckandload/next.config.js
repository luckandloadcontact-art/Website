/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // Short address to say or show on stream, e.g. in the overlay and the !hype chat command.
  async redirects() {
    return [
      { source: '/hype', destination: '/casinos/hype-bet', permanent: false },
      // The wagering guide's old address, from before it was retitled.
      { source: '/guides/deposit-without-welcome-bonus', destination: '/guides/wagering-requirements', permanent: true },
    ]
  },
}

module.exports = nextConfig
