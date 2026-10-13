-- ================================================
-- LuckAndLoadTV – News-feed (YouTube + Instagram)
-- ================================================

-- Delt, cachet "news feed" (samme mønster som leaderboard_cache) -- YouTube- og Instagram-kall
-- skjer kun via cron, aldri live per sidevisning. Se lib/socialFeed.ts for "claim"-mekanismen.
create table if not exists public.social_feed_cache (
  id                text primary key,
  items             jsonb not null default '[]'::jsonb,
  fetched_at        timestamptz not null,
  fetch_claimed_at  timestamptz
);

insert into public.social_feed_cache (id, fetched_at)
values ('current', '1970-01-01T00:00:00Z')
on conflict (id) do nothing;

alter table public.social_feed_cache enable row level security;

create policy "social_feed_cache_service_all" on public.social_feed_cache
  using (auth.role() = 'service_role');

-- Instagram sin long-lived access token (fornyes automatisk av en ukentlig cron -- se
-- lib/socialFeed.ts: refreshInstagramToken og .github/workflows/refresh-instagram-token.yml).
-- Admin kan sette/oppdatere den initielle tokenen via adminpanelet.
create table if not exists public.instagram_token (
  id            text primary key,
  access_token  text not null,
  ig_user_id    text not null,
  expires_at    timestamptz not null,
  updated_at    timestamptz not null default now()
);

alter table public.instagram_token enable row level security;

create policy "instagram_token_service_all" on public.instagram_token
  using (auth.role() = 'service_role');
