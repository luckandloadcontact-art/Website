-- ================================================
-- LuckAndLoadTV – Tournament / Events schema
-- ================================================

-- Stores just the WINNER per bracket match. The bracket structure itself (which provider
-- plays which, how rounds feed into each other) lives in code (src/lib/tournament.ts) --
-- this table only needs to remember admin decisions.
create table if not exists public.tournament_results (
  id         uuid primary key default uuid_generate_v4(),
  event_slug text not null,
  match_id   text not null,
  winner     text not null,
  updated_by uuid references public.users(id),
  updated_at timestamptz not null default now(),
  unique(event_slug, match_id)
);

create index if not exists idx_tournament_event on public.tournament_results(event_slug);

alter table public.tournament_results enable row level security;

create policy "tournament_public_read" on public.tournament_results for select using (true);
create policy "tournament_service_all" on public.tournament_results using (auth.role() = 'service_role');
