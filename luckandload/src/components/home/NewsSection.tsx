import { Film } from 'lucide-react'
import { getSocialFeed } from '@/lib/socialFeed'
import { NewsGrid } from '@/components/news/NewsGrid'

const MAX_HOMEPAGE_CLIPS = 6

// Brukes rett under Slot Wheel på forsiden (se app/page.tsx). Viser kun de 6 nyeste klippene.
// Rendres kun hvis det faktisk finnes innlegg, slik at forsiden ikke får en tom boks før
// YouTube/Instagram er koblet til.
export async function NewsSection() {
  const { posts } = await getSocialFeed()
  if (posts.length === 0) return null

  return (
    <section className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Film size={20} className="text-brand-500" />
          <h2 className="text-xl font-bold text-white">Watch our newest clips</h2>
        </div>
        <NewsGrid posts={posts.slice(0, MAX_HOMEPAGE_CLIPS)} />
      </div>
    </section>
  )
}
