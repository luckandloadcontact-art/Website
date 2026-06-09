import { Hero } from '@/components/home/Hero'
import { LiveSection, AboutSection, CommunitySection, AnnouncementsSection } from '@/components/home/Sections'
import { createAdminClient } from '@/lib/supabase'
import type { Announcement } from '@/types'

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

export default async function HomePage() {
  const announcements = await getAnnouncements()

  return (
    <div>
      <Hero />
      <LiveSection />
      <AboutSection />
      <CommunitySection />
      {announcements.length > 0 && <AnnouncementsSection announcements={announcements} />}
    </div>
  )
}
