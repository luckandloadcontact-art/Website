-- ================================================
-- LuckAndLoadTV – Growth overview (admin only)
-- ================================================

-- Every player who has bet under our code in a period, used to work out who is new each month.
-- One row per calendar month, overwritten by each fresh Hype API call for that month. The single
-- is_baseline row covers everyone who played before tracking started, so those players are not
-- counted as new.
create table if not exists public.hype_player_periods (
  period_from       date primary key,
  period_to         date not null,
  players           jsonb not null,
  new_registrations integer,
  is_baseline       boolean not null default false,
  captured_at       timestamptz not null default now()
);

-- Clicks on Hype.bet links per page per day. Holds counts only: no IP, cookie or user id.
create table if not exists public.hype_clicks_daily (
  day    date not null,
  path   text not null,
  clicks integer not null default 0,
  primary key (day, path)
);

alter table public.hype_player_periods enable row level security;
alter table public.hype_clicks_daily   enable row level security;

drop policy if exists "hype_player_periods_service" on public.hype_player_periods;
drop policy if exists "hype_clicks_daily_service"   on public.hype_clicks_daily;
create policy "hype_player_periods_service" on public.hype_player_periods using (auth.role() = 'service_role');
create policy "hype_clicks_daily_service"   on public.hype_clicks_daily   using (auth.role() = 'service_role');

-- Atomic, so simultaneous clicks on different server instances are all counted.
create or replace function public.increment_hype_click(p_day date, p_path text)
returns void
language sql
as $$
  insert into public.hype_clicks_daily (day, path, clicks)
  values (p_day, p_path, 1)
  on conflict (day, path) do update set clicks = public.hype_clicks_daily.clicks + 1;
$$;

revoke all on function public.increment_hype_click(date, text) from public, anon, authenticated;
grant execute on function public.increment_hype_click(date, text) to service_role;
