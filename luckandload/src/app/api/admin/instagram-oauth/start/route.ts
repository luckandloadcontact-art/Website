import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Starter Instagram sin OAuth-innlogging ("Instagram API with Instagram Login") -- admin trykker
// "Connect Instagram" i adminpanelet, havner her, og sendes videre til Instagram sin egen
// innloggingsside. Instagram sender brukeren tilbake til callback-ruten med en engangskode.
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'mod')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const appId = process.env.INSTAGRAM_APP_ID
  if (!appId) {
    return NextResponse.json({ error: 'INSTAGRAM_APP_ID er ikke satt i Vercel' }, { status: 500 })
  }

  const redirectUri = `${new URL(request.url).origin}/api/admin/instagram-oauth/callback`

  const authorizeUrl = new URL('https://www.instagram.com/oauth/authorize')
  authorizeUrl.searchParams.set('client_id', appId)
  authorizeUrl.searchParams.set('redirect_uri', redirectUri)
  authorizeUrl.searchParams.set('response_type', 'code')
  // Kun lesetilgang til profil + media -- se samtalen i adminpanelet om hvorfor vi bevisst
  // IKKE ber om instagram_business_manage_comments/messages/content_publish.
  authorizeUrl.searchParams.set('scope', 'instagram_business_basic')

  return NextResponse.redirect(authorizeUrl.toString())
}
