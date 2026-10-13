import type { SocialPost } from '@/lib/socialFeed'
import { MediaCard } from '@/components/news/MediaCard'

export function NewsGrid({ posts }: { posts: SocialPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-white/8 bg-surface-800 p-8 text-center text-sm text-slate-400">
        No posts to show yet — check back soon.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {posts.map(post => (
        <MediaCard key={post.id} post={post} />
      ))}
    </div>
  )
}
