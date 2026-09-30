-- ================================================
-- LuckAndLoadTV – Delt leaderboard-cache
-- ================================================

-- Erstatter den tidligere in-memory-cachen i lib/affilka.ts (som var PER server-instans, ikke
-- delt) med én rad i databasen som ALLE instanser leser/skriver til. Se getLeaderboardData() for
-- det fulle "claim"-mekanismen som garanterer maks ett reelt kall til Affilka per 6.-minutters
-- vindu, uansett hvor mange instanser eller samtidige besøkende det er.
create table if not exists public.leaderboard_cache (
  id                text primary key,
  data              jsonb,
  fetched_at        timestamptz not null,
  fetch_claimed_at  timestamptz
);

-- Sådd med en tidspunkt langt tilbake i tid (ikke null) slik at "fetched_at < staleCutoff"
-- alltid er sann for den aller første requesten -- NULL < noe som helst er NULL i Postgres
-- (verken sant eller usant), så en NULL-verdi her ville blokkert det aller første forsøket.
insert into public.leaderboard_cache (id, fetched_at)
values ('current', '1970-01-01T00:00:00Z')
on conflict (id) do nothing;

alter table public.leaderboard_cache enable row level security;

create policy "leaderboard_cache_service_all" on public.leaderboard_cache
  using (auth.role() = 'service_role');
