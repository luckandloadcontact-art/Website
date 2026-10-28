-- ================================================
-- LuckAndLoadTV – Guess the Slot (daily puzzle)
-- ================================================

-- Which game is the puzzle for a given calendar day -- generated once on first request for
-- that date, then frozen forever so the archive stays consistent even as the Slot Wheel
-- roster grows.
create table if not exists public.puzzle_days (
  puzzle_date date primary key,
  game_id     text not null,
  created_at  timestamptz not null default now()
);

-- One row per user per puzzle day -- tracks guesses made, whether solved, and loads awarded
-- (only non-zero for the current day; past days are practice-only, see app/api/puzzle/guess).
create table if not exists public.puzzle_attempts (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  puzzle_date    date not null,
  guesses        text[] not null default '{}',
  solved         boolean not null default false,
  points_awarded integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique(user_id, puzzle_date)
);

create index if not exists idx_puzzle_attempts on public.puzzle_attempts(user_id, puzzle_date);

alter table public.puzzle_days     enable row level security;
alter table public.puzzle_attempts enable row level security;

create policy "puzzle_days_service"     on public.puzzle_days     using (auth.role() = 'service_role');
create policy "puzzle_attempts_service" on public.puzzle_attempts using (auth.role() = 'service_role');
