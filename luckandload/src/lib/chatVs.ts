// Chat vs LuckAndLoad (Half & Half Thursday): the running score shown on stream and in admin.
// Types and the score summary only, so client components can import it.

export type ChatVsWinner = 'luckandload' | 'chat'

export type ChatVsResult = { id: string; winner: ChatVsWinner; playedOn: string }

export type ChatVsScore = {
  luckandload: number
  chat: number
  // Newest first.
  recent: ChatVsResult[]
  // Who has won the latest battles in a row, and how many.
  streak: { winner: ChatVsWinner; count: number } | null
}

/** Totals, the latest results and the current streak, from results sorted newest first. */
export function summarizeChatVs(results: ChatVsResult[], recentCount = 5): ChatVsScore {
  const luckandload = results.filter(r => r.winner === 'luckandload').length
  let streak: ChatVsScore['streak'] = null
  if (results.length > 0) {
    const winner = results[0].winner
    let count = 0
    while (count < results.length && results[count].winner === winner) count++
    streak = { winner, count }
  }
  return {
    luckandload,
    chat: results.length - luckandload,
    recent: results.slice(0, recentCount),
    streak,
  }
}
