ALTER TABLE public.blackjack_hands
  ADD COLUMN IF NOT EXISTS split2_cards    jsonb,
  ADD COLUMN IF NOT EXISTS split2_status   text
    CHECK (split2_status IN ('active','player_won','dealer_won','push','blackjack','bust')),
  ADD COLUMN IF NOT EXISTS playing_split2  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS split_doubled   boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS split2_doubled  boolean NOT NULL DEFAULT false;
