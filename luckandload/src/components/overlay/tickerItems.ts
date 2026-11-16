// What the overlay ticker can show, in its default order. Kept out of Ticker.tsx (a client
// component) so the server page can read the list itself instead of a client reference.
export type TickerItem = 'viewers' | 'followers' | 'leaderboard' | 'btc' | 'eth' | 'clock'
export const TICKER_ITEMS: TickerItem[] = ['viewers', 'followers', 'leaderboard', 'btc', 'eth', 'clock']
