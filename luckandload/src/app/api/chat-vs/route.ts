import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { summarizeChatVs, type ChatVsResult, type ChatVsWinner } from '@/lib/chatVs'

export const dynamic = 'force-dynamic'

// The Chat vs LuckAndLoad score, read by the stream overlay (/overlay/chat-vs) and the admin panel.
export async function GET() {
  const { data, error } = await createAdminClient()
    .from('chat_vs_results')
    .select('id, winner, played_on')
    .order('played_on', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results: ChatVsResult[] = (data ?? []).map(row => ({
    id: row.id as string,
    winner: row.winner as ChatVsWinner,
    playedOn: row.played_on as string,
  }))
  return NextResponse.json(summarizeChatVs(results), { headers: { 'Cache-Control': 'no-store' } })
}
