import { NextResponse } from 'next/server'
import { getSocialFeed } from '@/lib/socialFeed'

// Pinges av en GitHub Actions-cron hvert 30. minutt (se .github/workflows/refresh-social-feed.yml)
// -- samme "gjør ingenting med mindre cachen faktisk er utløpt"-mønster som
// refresh-leaderboard, bare med lengre intervall siden sosiale innlegg ikke trenger
// minutt-for-minutt ferskhet.
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const provided = request.headers.get('x-cron-secret') ?? new URL(request.url).searchParams.get('secret')

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { posts, fetchedAt } = await getSocialFeed()
    return NextResponse.json({ ok: true, posts: posts.length, fetchedAt })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Ukjent feil' },
      { status: 502 }
    )
  }
}
