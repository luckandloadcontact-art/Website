// Shared types and rules for Slot Wheel game suggestions. Safe to import from client components.

export const MAX_PENDING_SUGGESTIONS = 10

export type SuggestionStatus = 'pending' | 'approved' | 'declined'

export type SlotSuggestion = {
  id: string
  gameName: string
  provider: string | null
  status: SuggestionStatus
  createdAt: string
  reviewedAt: string | null
}

// What the admin panel gets: the suggestion plus who sent it.
export type AdminSlotSuggestion = SlotSuggestion & {
  suggestedBy: string
  avatarUrl: string | null
}

/** Lowercase, letters and digits only, so "Wanted: Dead or a Wild!" matches "wanted dead or a wild". */
export function normalizeGameName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}
