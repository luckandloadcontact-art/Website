-- ================================================
-- LuckAndLoadTV – Daily Blackjack
-- ================================================

-- Daily play sessions (one row per user per day)
create table if not exists public.blackjack_sessions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  play_date     date not null default current_date,
  hands_played  integer not null default 0 check (hands_played between 0 and 3),
  points_earned integer not null default 0,
  streak_days   integer not null default 1,
  created_at    timestamptz not null default now(),
  unique(user_id, play_date)
);

-- Individual hand state (deck is stored server-side to prevent cheating)
create table if not exists public.blackjack_hands (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  play_date      date not null,
  hand_number    integer not null check (hand_number between 1 and 3),
  deck_state     jsonb not null,
  player_cards   jsonb not null default '[]',
  dealer_cards   jsonb not null default '[]',
  status         text not null default 'active'
                 check (status in ('active','player_won','dealer_won','push','blackjack','bust')),
  points_awarded integer not null default 0,
  doubled        boolean not null default false,
  created_at     timestamptz not null default now(),
  unique(user_id, play_date, hand_number)
);

create index if not exists idx_bj_sessions on public.blackjack_sessions(user_id, play_date);
create index if not exists idx_bj_hands    on public.blackjack_hands(user_id, play_date, status);

alter table public.blackjack_sessions enable row level security;
alter table public.blackjack_hands    enable row level security;

create policy "bj_sessions_service" on public.blackjack_sessions using (auth.role() = 'service_role');
create policy "bj_hands_service"    on public.blackjack_hands    using (auth.role() = 'service_role');
