-- ================================================
-- LuckAndLoadTV – Chat vs LuckAndLoad results
-- ================================================

-- One row per Throwdown Thursday (Chat vs LuckAndLoad bonus hunt): who won. Admins and mods add
-- results in the admin panel, and the stream overlay /overlay/chat-vs shows the running score.
create table if not exists public.chat_vs_results (
  id          uuid primary key default uuid_generate_v4(),
  winner      text not null check (winner in ('luckandload', 'chat')),
  played_on   date not null default current_date,
  created_at  timestamptz not null default now(),
  created_by  uuid references public.users(id) on delete set null
);

create index if not exists chat_vs_results_played on public.chat_vs_results (played_on desc, created_at desc);

alter table public.chat_vs_results enable row level security;

drop policy if exists "chat_vs_results_service" on public.chat_vs_results;
create policy "chat_vs_results_service" on public.chat_vs_results using (auth.role() = 'service_role');
