import { getSocialFeed } from '@/lib/socialFeed'
import { NewsGrid } from '@/components/news/NewsGrid'

// Samme innhold som /news-siden, men uten egen hero-header -- brukes rett under Slot Wheel på
// forsiden (se app/page.tsx). Rendres kun hvis det faktisk finnes innlegg, slik at forsiden ikke
// får en tom "No posts to show yet"-boks før YouTube/Instagram er koblet til.
export async function NewsSection() {
  const { posts } = await getSocialFeed()
  if (posts.length === 0) return null

  return (
    <section className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NewsGrid posts={posts} />
      </div>
    </section>
  )
}
