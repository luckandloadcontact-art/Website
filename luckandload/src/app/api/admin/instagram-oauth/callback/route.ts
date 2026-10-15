import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { saveInstagramToken } from '@/lib/socialFeed'

// Instagram sender brukeren hit etter innlogging/godkjenning, med en engangskode (?code=...).
// Veksler koden inn i en kortlevd token, veksler DEN inn i en long-lived token (60 dager,
// fornyes automatisk av en ukentlig cron -- se refresh-instagram-token), og lagrer den.
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'mod')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const url = new URL(request.url)
  const adminUrl = new URL('/admin', url.origin)

  const oauthError = url.searchParams.get('error_description') ?? url.searchParams.get('error')
  if (oauthError) {
    adminUrl.searchParams.set('instagram_error', oauthError)
    return NextResponse.redirect(adminUrl.toString())
  }

  const code = url.searchParams.get('code')
  if (!code) {
    adminUrl.searchParams.set('instagram_error', 'Mangler code-parameter fra Instagram')
    return NextResponse.redirect(adminUrl.toString())
  }

  const appId = process.env.INSTAGRAM_APP_ID
  const appSecret = process.env.INSTAGRAM_APP_SECRET
  if (!appId || !appSecret) {
    adminUrl.searchParams.set('instagram_error', 'INSTAGRAM_APP_ID/INSTAGRAM_APP_SECRET er ikke satt i Vercel')
    return NextResponse.redirect(adminUrl.toString())
  }

  const redirectUri = `${url.origin}/api/admin/instagram-oauth/callback`

  try {
    // 1) Engangskode -> kortlevd token
    const shortRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
      cache: 'no-store',
    })
    if (!shortRes.ok) {
      throw new Error(`Kortlevd token feilet: ${shortRes.status} ${await shortRes.text().catch(() => '')}`)
    }
    const shortData = await shortRes.json()
    const shortLivedToken: string | undefined = shortData.access_token
    const igUserId: string | undefined = shortData.user_id != null ? String(shortData.user_id) : undefined
    if (!shortLivedToken || !igUserId) {
      throw new Error(`Uventet svar ved kortlevd token: ${JSON.stringify(shortData).slice(0, 300)}`)
    }

    // 2) Kortlevd -> long-lived token (gyldig 60 dager)
    const longUrl = new URL('https://graph.instagram.com/access_token')
    longUrl.searchParams.set('grant_type', 'ig_exchange_token')
    longUrl.searchParams.set('client_secret', appSecret)
    longUrl.searchParams.set('access_token', shortLivedToken)
    const longRes = await fetch(longUrl.toString(), { cache: 'no-store' })
    if (!longRes.ok) {
      throw new Error(`Long-lived token feilet: ${longRes.status} ${await longRes.text().catch(() => '')}`)
    }
    const longData = await longRes.json()
    if (!longData.access_token) {
      throw new Error(`Uventet svar ved long-lived token: ${JSON.stringify(longData).slice(0, 300)}`)
    }

    await saveInstagramToken(longData.access_token, igUserId, longData.expires_in ?? 60 * 24 * 60 * 60)

    adminUrl.searchParams.set('instagram_connected', '1')
    return NextResponse.redirect(adminUrl.toString())
  } catch (err) {
    adminUrl.searchParams.set('instagram_error', err instanceof Error ? err.message : 'Ukjent feil')
    return NextResponse.redirect(adminUrl.toString())
  }
}
