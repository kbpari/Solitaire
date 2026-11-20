create table if not exists public.solitaire_patterns (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('completed','unfinished')),
  created_at timestamptz not null default now(),
  moves integer not null default 0 check (moves >= 0),
  open_count integer not null default 0 check (open_count between 0 and 52),
  hidden_count integer not null default 0 check (hidden_count between 0 and 52),
  open_cards jsonb not null default '[]'::jsonb,
  hidden_cards jsonb not null default '[]'::jsonb,
  final_state jsonb not null
);
create index if not exists solitaire_patterns_user_created_idx
  on public.solitaire_patterns(user_id, created_at desc);
alter table public.solitaire_patterns enable row level security;
grant select, insert, update, delete on public.solitaire_patterns to authenticated;
create policy "Users read own solitaire patterns"
  on public.solitaire_patterns for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users insert own solitaire patterns"
  on public.solitaire_patterns for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users update own solitaire patterns"
  on public.solitaire_patterns for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users delete own solitaire patterns"
  on public.solitaire_patterns for delete to authenticated
  using ((select auth.uid()) = user_id);
