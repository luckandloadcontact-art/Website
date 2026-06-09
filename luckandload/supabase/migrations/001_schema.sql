-- ================================================
-- LuckAndLoadTV – MVP Schema
-- ================================================
create extension if not exists "uuid-ossp";

-- Users
create table if not exists public.users (
  id           uuid primary key default uuid_generate_v4(),
  discord_id   text unique not null,
  username     text not null,
  display_name text,
  avatar_url   text,
  email        text,
  role         text not null default 'user' check (role in ('user', 'mod', 'admin')),
  points       integer not null default 0,
  last_login   timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Leaderboard snapshots (weekly / monthly periods)
create table if not exists public.leaderboard_snapshots (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  period_type text not null check (period_type in ('weekly', 'monthly', 'alltime')),
  period_key  text not null,
  points      integer not null default 0,
  rank        integer,
  created_at  timestamptz not null default now(),
  unique(user_id, period_type, period_key)
);

-- Point transactions (audit)
create table if not exists public.point_transactions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  delta      integer not null,
  reason     text not null,
  created_at timestamptz not null default now()
);

-- Announcements
create table if not exists public.announcements (
  id         uuid primary key default uuid_generate_v4(),
  title      text not null,
  body       text not null,
  type       text not null default 'info' check (type in ('info', 'warning', 'success', 'event')),
  pinned     boolean not null default false,
  published  boolean not null default true,
  author_id  uuid references public.users(id),
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_users_discord on public.users(discord_id);
create index if not exists idx_users_points  on public.users(points desc);
create index if not exists idx_lb_period     on public.leaderboard_snapshots(period_type, period_key, points desc);
create index if not exists idx_pt_user       on public.point_transactions(user_id, created_at desc);

-- updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger users_updated_at before update on public.users
  for each row execute function update_updated_at();

-- Row Level Security
alter table public.users              enable row level security;
alter table public.leaderboard_snapshots enable row level security;
alter table public.point_transactions enable row level security;
alter table public.announcements      enable row level security;

create policy "users_public_read"    on public.users              for select using (true);
create policy "users_service_all"    on public.users              using (auth.role() = 'service_role');
create policy "lb_public_read"       on public.leaderboard_snapshots for select using (true);
create policy "lb_service_all"       on public.leaderboard_snapshots using (auth.role() = 'service_role');
create policy "pt_own_read"          on public.point_transactions  for select using (true);
create policy "pt_service_all"       on public.point_transactions  using (auth.role() = 'service_role');
create policy "ann_public_read"      on public.announcements       for select using (published = true);
create policy "ann_service_all"      on public.announcements       using (auth.role() = 'service_role');

-- Seed welcome announcement
insert into public.announcements (title, body, type, pinned) values
  ('Welcome to LuckAndLoadTV! 🎰', 'The community hub is live. More features dropping soon — stay tuned and join the Discord!', 'success', true)
on conflict do nothing;
