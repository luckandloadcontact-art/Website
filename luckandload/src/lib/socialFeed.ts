// Henter en samlet "news feed" fra YouTube og Instagram -- se komponenten for forklaring av
// hvorfor noen innlegg spilles direkte på siden, og andre bare viser et miniatyrbilde med lenke
// ut til plattformen (YouTube: aldersbegrensede videoer kan ikke bygges inn noe sted, punktum.
// Instagram: media_url mangler for video med opphavsrettsbeskyttet/lisensiert lyd).

import { createAdminClient } from '@/lib/supabase'

export interface SocialPost {
  id: string
  platform: 'youtube' | 'instagram'
  mediaType: 'video' | 'image'
  title: string
  thumbnailUrl: string | null
  embeddable: boolean
  /** iframe-src (YouTube) eller direkte videofil-URL (Instagram) -- kun satt hvis embeddable. */
  embedUrl: string | null
  /** Lenke ut til selve innlegget på plattformen -- vises alltid, uansett embeddable. */
  permalink: string
  publishedAt: string
}

export interface SocialFeedResult {
  posts: SocialPost[]
  fetchedAt: string
}

const MAX_YOUTUBE_ITEMS = 12
const MAX_INSTAGRAM_ITEMS = 12

// ─── YouTube ────────────────────────────────────────────────────────────────

interface YtPlaylistItem {
  snippet: {
    resourceId: { videoId: string }
    title: string
    thumbnails: Record<string, { url: string }>
    publishedAt: string
  }
}

async function fetchYouTubePosts(): Promise<SocialPost[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  const channelId = process.env.YOUTUBE_CHANNEL_ID
  if (!apiKey || !channelId) return []

  // 1. Finn kanalens "uploads"-spilleliste.
  const chRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
    { cache: 'no-store' }
  )
  if (!chRes.ok) throw new Error(`[youtube] channels.list feilet: ${chRes.status} ${await chRes.text().catch(() => '')}`)
  const chData = await chRes.json()
  const uploadsPlaylistId: string | undefined = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploadsPlaylistId) return []

  // 2. Hent de seneste videoene fra den spillelisten.
  const plRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${MAX_YOUTUBE_ITEMS}&key=${apiKey}`,
    { cache: 'no-store' }
  )
  if (!plRes.ok) throw new Error(`[youtube] playlistItems.list feilet: ${plRes.status} ${await plRes.text().catch(() => '')}`)
  const plData = await plRes.json()
  const items: YtPlaylistItem[] = plData.items ?? []
  const videoIds = items.map(i => i.snippet.resourceId.videoId).filter(Boolean)
  if (videoIds.length === 0) return []

  // 3. Sjekk hver video sin embed-status: aldersbegrensede videoer (ytAgeRestricted) kan IKKE
  // bygges inn noe sted i det hele tatt -- det er en hard sperre fra YouTube, ikke noe vi kan
  // omgå med innlogging eller lignende. status.embeddable fanger i tillegg videoer eieren selv
  // har skrudd av embedding for.
  const vRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status&id=${videoIds.join(',')}&key=${apiKey}`,
    { cache: 'no-store' }
  )
  if (!vRes.ok) throw new Error(`[youtube] videos.list feilet: ${vRes.status} ${await vRes.text().catch(() => '')}`)
  const vData = await vRes.json()
  const embeddableMap = new Map<string, boolean>()
  for (const v of vData.items ?? []) {
    const ageRestricted = v.contentDetails?.contentRating?.ytRating === 'ytAgeRestricted'
    embeddableMap.set(v.id, v.status?.embeddable !== false && !ageRestricted)
  }

  return items.map(item => {
    const videoId = item.snippet.resourceId.videoId
    const embeddable = embeddableMap.get(videoId) ?? false
    return {
      id: `youtube-${videoId}`,
      platform: 'youtube' as const,
      mediaType: 'video' as const,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url ?? null,
      embeddable,
      embedUrl: embeddable ? `https://www.youtube.com/embed/${videoId}` : null,
      permalink: `https://www.youtube.com/watch?v=${videoId}`,
      publishedAt: item.snippet.publishedAt,
    }
  })
}

// ─── Instagram ──────────────────────────────────────────────────────────────

interface IgMedia {
  id: string
  caption?: string
  media_type: string
  media_url?: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

async function getInstagramToken(): Promise<{ accessToken: string; igUserId: string } | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('instagram_token').select('access_token, ig_user_id').eq('id', 'current').maybeSingle()
  if (!data) return null
  return { accessToken: data.access_token, igUserId: data.ig_user_id }
}

async function fetchInstagramPosts(): Promise<SocialPost[]> {
  const token = await getInstagramToken()
  if (!token) return []

  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'
  const res = await fetch(
    `https://graph.instagram.com/${token.igUserId}/media?fields=${fields}&limit=${MAX_INSTAGRAM_ITEMS}&access_token=${token.accessToken}`,
    { cache: 'no-store' }
  )
  if (!res.ok) throw new Error(`[instagram] media-kall feilet: ${res.status} ${await res.text().catch(() => '')}`)
  const data = await res.json()
  const items: IgMedia[] = data.data ?? []

  return items
    // Karuseller uten media_url hopper vi over her -- permalink-kortet dekker dem uansett, og
    // riktig visning av en hel karusell er mer enn denne enkle feeden trenger å løse.
    .filter(item => item.media_type !== 'CAROUSEL_ALBUM' || item.media_url)
    .map(item => {
      const isVideo = item.media_type === 'VIDEO' || item.media_type === 'REELS'
      // Instagram utelater media_url for video med opphavsrettsbeskyttet/lisensiert lyd (bl.a.
      // trending-lyd fra Instagram sitt eget lydbibliotek) -- da faller vi tilbake til et
      // miniatyrbilde med lenke ut, akkurat som for aldersbegrensede YouTube-videoer.
      const embeddable = isVideo ? !!item.media_url : true
      return {
        id: `instagram-${item.id}`,
        platform: 'instagram' as const,
        mediaType: isVideo ? ('video' as const) : ('image' as const),
        title: item.caption?.slice(0, 160) ?? '',
        thumbnailUrl: item.thumbnail_url ?? (isVideo ? null : item.media_url ?? null),
        embeddable,
        embedUrl: embeddable ? (item.media_url ?? null) : null,
        permalink: item.permalink,
        publishedAt: item.timestamp,
      }
    })
}

/**
 * Fornyer Instagram sin long-lived access token (gyldig 60 dager, men kan fornyes -- hver
 * fornyelse nullstiller 60-dagers-telleren). Kjøres av en ukentlig cron, godt innenfor vinduet,
 * slik at Kristian aldri trenger å tenke på det etter at tokenen er satt opp én gang.
 */
export async function refreshInstagramToken(): Promise<{ expiresAt: string } | null> {
  const supabase = createAdminClient()
  const { data } = await supabase.from('instagram_token').select('access_token').eq('id', 'current').maybeSingle()
  if (!data) return null

  const res = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${data.access_token}`,
    { cache: 'no-store' }
  )
  if (!res.ok) throw new Error(`[instagram] token-fornyelse feilet: ${res.status} ${await res.text().catch(() => '')}`)
  const json = await res.json()
  const expiresAt = new Date(Date.now() + (json.expires_in ?? 0) * 1000).toISOString()

  await supabase.from('instagram_token').update({
    access_token: json.access_token,
    expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  }).eq('id', 'current')

  return { expiresAt }
}

// ─── Samlet feed + delt cache ────────────────────────────────────────────────

async function fetchFreshSocialFeed(): Promise<SocialFeedResult> {
  const [youtube, instagram] = await Promise.allSettled([fetchYouTubePosts(), fetchInstagramPosts()])

  if (youtube.status === 'rejected') console.error('[socialFeed] YouTube feilet', youtube.reason)
  if (instagram.status === 'rejected') console.error('[socialFeed] Instagram feilet', instagram.reason)

  const posts = [
    ...(youtube.status === 'fulfilled' ? youtube.value : []),
    ...(instagram.status === 'fulfilled' ? instagram.value : []),
  ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return { posts, fetchedAt: new Date().toISOString() }
}

// Samme delte cache + "claim"-mønster som leaderboard-dataen (se lib/affilka.ts for en fyldigere
// forklaring) -- garanterer at YouTube/Instagram kun kalles fra ÉN instans om gangen, uansett
// hvor mange serverless-instanser eller samtidige besøkende som treffer /news akkurat da.
const FEED_CACHE_ROW_ID = 'current'
const FEED_REVALIDATE_SECONDS = 30 * 60 // 30 min -- sosiale innlegg trenger ikke samme ferskhet som leaderboardet
const CLAIM_TIMEOUT_MS = 30_000

interface FeedCacheRow {
  items: SocialPost[]
  fetched_at: string
  fetch_claimed_at: string | null
}

export async function getSocialFeed(force = false): Promise<SocialFeedResult> {
  const supabase = createAdminClient()

  const { data: rowRaw } = await supabase
    .from('social_feed_cache')
    .select('items, fetched_at, fetch_claimed_at')
    .eq('id', FEED_CACHE_ROW_ID)
    .maybeSingle()
  const row = rowRaw as FeedCacheRow | null

  const cachedPosts = row?.items ?? []
  const fetchedAtMs = row ? new Date(row.fetched_at).getTime() : 0
  const isStale = force || Date.now() - fetchedAtMs > FEED_REVALIDATE_SECONDS * 1000

  if (!isStale) {
    return { posts: cachedPosts, fetchedAt: row!.fetched_at }
  }

  const nowIso = new Date().toISOString()
  const claimCutoffIso = new Date(Date.now() - CLAIM_TIMEOUT_MS).toISOString()
  const staleCutoffIso = new Date(Date.now() - FEED_REVALIDATE_SECONDS * 1000).toISOString()

  const { data: claimedRows } = await supabase
    .from('social_feed_cache')
    .update({ fetch_claimed_at: nowIso })
    .eq('id', FEED_CACHE_ROW_ID)
    .lt('fetched_at', staleCutoffIso)
    .or(`fetch_claimed_at.is.null,fetch_claimed_at.lt.${claimCutoffIso}`)
    .select('items')

  const wonClaim = (claimedRows?.length ?? 0) > 0

  if (!wonClaim) {
    const { data: latestRaw } = await supabase
      .from('social_feed_cache').select('items, fetched_at').eq('id', FEED_CACHE_ROW_ID).maybeSingle()
    const latest = latestRaw as { items: SocialPost[]; fetched_at: string } | null
    return { posts: latest?.items ?? cachedPosts, fetchedAt: latest?.fetched_at ?? nowIso }
  }

  try {
    const fresh = await fetchFreshSocialFeed()
    await supabase.from('social_feed_cache').update({
      items: fresh.posts, fetched_at: fresh.fetchedAt, fetch_claimed_at: null,
    }).eq('id', FEED_CACHE_ROW_ID)
    return fresh
  } catch (err) {
    console.error('[socialFeed] Klarte ikke hente feed', err)
    await supabase.from('social_feed_cache').update({ fetch_claimed_at: null }).eq('id', FEED_CACHE_ROW_ID)
    return { posts: cachedPosts, fetchedAt: row?.fetched_at ?? nowIso }
  }
}
