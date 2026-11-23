import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { EMPTY_WORD_BAN, WORD_BAN_ID, type WordBanResponse, type WordBanState } from '@/lib/wordBan'

export const dynamic = 'force-dynamic'

// The Word Ban timer, read by the stream overlay (/overlay/word-ban) and the admin panel.
// serverNow lets the overlay correct for a PC clock that is a little off.
export async function GET() {
  const { data, error } = await createAdminClient()
    .from('overlay_state')
    .select('data')
    .eq('id', WORD_BAN_ID)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const state: WordBanState = { ...EMPTY_WORD_BAN, ...((data?.data as Partial<WordBanState>) ?? {}) }
  const body: WordBanResponse = { ...state, serverNow: new Date().toISOString() }
  return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } })
}
