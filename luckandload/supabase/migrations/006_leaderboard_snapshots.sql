-- ================================================
-- LuckAndLoadTV – Leaderboard snapshots (historikk)
-- ================================================

-- Fryser leaderboardet slik det var på et gitt tidspunkt (normalt rett før månedsskiftet), slik
-- at admin kan se nøyaktig hvordan en tidligere måned endte selv om Affilka sitt API kun
-- eksponerer "denne måneden" sine tall. Én rad per måned (period_from er unik) -- hver ny
-- innfanging for samme måned overskriver forrige (upsert), slik at siste kjøring før
-- månedsskiftet vinner.
create table if not exists public.leaderboard_snapshots (
  id            uuid primary key default uuid_generate_v4(),
  period_from   date not null unique,
  period_to     date not null,
  entries       jsonb not null,
  total_players integer not null default 0,
  captured_at   timestamptz not null default now()
);

alter table public.leaderboard_snapshots enable row level security;

-- Kun admin-siden (service role) trenger tilgang -- historikken vises ikke offentlig.
create policy "leaderboard_snapshots_service_all" on public.leaderboard_snapshots
  using (auth.role() = 'service_role');
