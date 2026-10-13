import { Newspaper } from 'lucide-react'
import { getSocialFeed } from '@/lib/socialFeed'
import { MediaCard } from '@/components/news/MediaCard'

// Samme begrunnelse som leaderboard-siden -- unngår at hver "git push"-deploy trigger et eget
// kall mot YouTube/Instagram under bygget. Selve caching/deduping skjer i getSocialFeed().
export const dynamic = 'force-dynamic'

export default async function NewsPage() {
  const { posts } = await getSocialFeed()

  return (
    <div className="min-h-screen">
      <div className="border-b border-white/5 bg-gradient-to-b from-surface-900 to-surface-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-400">
              <Newspaper size={13} /> LuckAndLoadTV
            </div>
            <h1 className="text-3xl font-black text-white sm:text-4xl">News</h1>
            <p className="max-w-xl text-sm text-slate-400 sm:text-base">
              Our latest clips and posts from YouTube and Instagram, all in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-surface-800 p-8 text-center text-sm text-slate-400">
            No posts to show yet — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {posts.map(post => (
              <MediaCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
