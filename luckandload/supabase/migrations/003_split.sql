ALTER TABLE public.blackjack_hands
  ADD COLUMN IF NOT EXISTS split_cards   jsonb,
  ADD COLUMN IF NOT EXISTS split_status  text
    CHECK (split_status IN ('active','player_won','dealer_won','push','blackjack','bust')),
  ADD COLUMN IF NOT EXISTS playing_split boolean NOT NULL DEFAULT false;
