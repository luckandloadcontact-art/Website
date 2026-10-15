import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'
import { saveInstagramToken } from '@/lib/socialFeed'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'mod')) return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('instagram_token').select('ig_user_id, expires_at, updated_at').eq('id', 'current').maybeSingle()

  return NextResponse.json({ configured: !!data, ...data })
}

// Setter/overskriver Instagram sin long-lived access token manuelt -- brukt én gang ved
// oppsett (etter at Kristian har generert en token via Meta sitt utviklerpanel), og som
// manuell backup hvis den automatiske ukentlige fornyelsen av en eller annen grunn skulle
// slutte å virke.
export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { accessToken, igUserId, expiresInSeconds } = (await req.json()) as {
    accessToken?: string
    igUserId?: string
    expiresInSeconds?: number
  }
  if (!accessToken || !igUserId) {
    return NextResponse.json({ error: 'Mangler accessToken eller igUserId' }, { status: 400 })
  }

  try {
    await saveInstagramToken(accessToken, igUserId, expiresInSeconds ?? 60 * 24 * 60 * 60)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Ukjent feil' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
