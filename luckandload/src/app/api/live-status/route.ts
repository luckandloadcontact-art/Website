import { NextResponse } from 'next/server'

// Whether we're live on Kick right now. Cached for a minute so visitors never hit Kick directly.
// live is null when Kick can't be reached, and the home page then shows the offline view.
export const revalidate = 60

export async function GET() {
  try {
    const res = await fetch('https://kick.com/api/v2/channels/luckandloadtv', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
      },
      next: { revalidate: 60 },
    })
    if (!res.ok) return NextResponse.json({ live: null })
    const data = await res.json()
    return NextResponse.json({ live: Boolean(data?.livestream?.is_live) })
  } catch {
    return NextResponse.json({ live: null })
  }
}
