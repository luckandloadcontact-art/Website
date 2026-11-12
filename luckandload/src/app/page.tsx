import { Hero } from '@/components/home/Hero'
import { AboutSection, CommunitySection, AnnouncementsSection, HypeSection, type UpdateItem } from '@/components/home/Sections'
import type { Metadata } from 'next'
import { SITE_URL, publishedGuides } from '@/lib/guides'
import { LiveSection } from '@/components/home/LiveSection'
import { SlotWheel } from '@/components/home/SlotWheel'
import { NewsSection } from '@/components/home/NewsSection'
import { createAdminClient } from '@/lib/supabase'
import { getDiscordStreams } from '@/lib/discordEvents'
import { manualStreams } from '@/lib/stream'
import type { Announcement } from '@/types'

// Title and description come from the root layout.
export const metadata: Metadata = { alternates: { canonical: SITE_URL } }

async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('published', true)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5)
    return (data as Announcement[]) || []
  } catch {
    return []
  }
}

const MAX_UPDATES = 5

// Latest Updates mixes announcements from the admin panel with every published guide, so a new
// guide shows up here automatically on its publish date. Pinned announcements stay on top.
function buildUpdates(announcements: Announcement[]): UpdateItem[] {
  const guides: UpdateItem[] = publishedGuides().map(guide => ({
    id: `guide-${guide.slug}`,
    title: `New guide: ${guide.title}`,
    body: guide.description,
    type: 'article',
    pinned: false,
    date: `${guide.published}T12:00:00Z`,
    href: `/guides/${guide.slug}`,
  }))
  const posts: UpdateItem[] = announcements.map(ann => ({
    id: ann.id,
    title: ann.title,
    body: ann.body,
    type: ann.type,
    pinned: ann.pinned,
    date: ann.created_at,
  }))
  return [...posts, ...guides]
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date))
    .slice(0, MAX_UPDATES)
}

export default async function HomePage() {
  const [updates, discordStreams] = await Promise.all([getAnnouncements(), getDiscordStreams()])
  const announcements = buildUpdates(updates)
  // Events from our Discord, or the manual list in lib/stream.ts if Discord isn't available.
  const streams = discordStreams ?? manualStreams()

  return (
    <div>
      <Hero streams={streams} />
      <HypeSection />
      <AboutSection />
      <CommunitySection />
      <LiveSection streams={streams} />
      <SlotWheel />
      <NewsSection />
      {announcements.length > 0 && <AnnouncementsSection announcements={announcements} />}
    </div>
  )
}
