-- ================================================
-- LuckAndLoadTV – live state for stream overlays
-- ================================================

-- One row per overlay that is controlled from the admin panel while we're live, e.g. 'word-ban'
-- (the Word Ban timer at /overlay/word-ban). `data` holds whatever that overlay needs.
create table if not exists public.overlay_state (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.overlay_state enable row level security;

drop policy if exists "overlay_state_service" on public.overlay_state;
create policy "overlay_state_service" on public.overlay_state using (auth.role() = 'service_role');
