-- ================================================
-- LuckAndLoadTV – Slot Wheel game suggestions
-- ================================================

-- Games that signed-in viewers suggest for the Slot Wheel. Admins and mods approve or decline them
-- in the admin panel. A player can have at most 10 pending suggestions at a time (checked in the
-- API), and the same game can't be pending or approved twice.
create table if not exists public.slot_suggestions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  game_name   text not null check (char_length(game_name) between 2 and 80),
  provider    text check (provider is null or char_length(provider) <= 60),
  status      text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  created_at  timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.users(id) on delete set null
);

create index if not exists slot_suggestions_user_status on public.slot_suggestions (user_id, status);
create index if not exists slot_suggestions_status_created on public.slot_suggestions (status, created_at desc);

-- One open suggestion per game, whoever suggested it. Declined games can be suggested again.
create unique index if not exists slot_suggestions_open_game
  on public.slot_suggestions (lower(game_name))
  where status in ('pending', 'approved');

alter table public.slot_suggestions enable row level security;

drop policy if exists "slot_suggestions_service" on public.slot_suggestions;
create policy "slot_suggestions_service" on public.slot_suggestions using (auth.role() = 'service_role');
