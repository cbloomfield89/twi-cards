-- Database change #6 — TWI card open tracking
-- Adds one table to the SHARED Kata/TWI Supabase project. Nothing in the
-- Kata tables is touched. Safe to re-run: every statement is guarded.
--
-- Rules enforced here (not just in the app):
--   * Each person can record opens only for themselves, and only while their
--     account is active. The database stamps who and when, so neither can be
--     faked from the browser.
--   * Nobody can edit or delete an open once recorded (no update/delete rules).
--   * Learners read only their own opens; coaches ("leads") and owners read
--     everyone's.

create table if not exists public.twi_card_views (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  card text not null check (card in ('ji', 'jm', 'jr')),
  viewed_at timestamptz not null default now()
);

create index if not exists twi_card_views_user_time_idx on public.twi_card_views (user_id, viewed_at);
create index if not exists twi_card_views_time_idx on public.twi_card_views (viewed_at);

-- Stamp the signed-in user and the server time on every insert, overriding
-- whatever the browser sent. The SQL Editor (no signed-in user) keeps the
-- values it was given, which allows manual corrections or imports.
create or replace function public.stamp_twi_card_view()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null then
    new.user_id := auth.uid();
    new.viewed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists stamp_twi_card_view on public.twi_card_views;
create trigger stamp_twi_card_view
  before insert on public.twi_card_views
  for each row execute function public.stamp_twi_card_view();

alter table public.twi_card_views enable row level security;

drop policy if exists twi_card_views_select on public.twi_card_views;
create policy twi_card_views_select on public.twi_card_views
  for select using (user_id = auth.uid() or public.current_role() in ('coach', 'owner'));

drop policy if exists twi_card_views_insert on public.twi_card_views;
create policy twi_card_views_insert on public.twi_card_views
  for insert with check (user_id = auth.uid() and public.is_active());

-- Rolling counts per person per card: last 7, 30 and 365 days.
-- SECURITY INVOKER (the default) means the rules above still apply, so a
-- learner calling this gets only their own rows back.
create or replace function public.twi_view_counts()
returns table (
  user_id uuid,
  card text,
  last_7_days bigint,
  last_30_days bigint,
  last_365_days bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    v.user_id,
    v.card,
    count(*) filter (where v.viewed_at >= now() - interval '7 days'),
    count(*) filter (where v.viewed_at >= now() - interval '30 days'),
    count(*)
  from public.twi_card_views v
  where v.viewed_at >= now() - interval '365 days'
  group by v.user_id, v.card;
$$;

grant execute on function public.twi_view_counts() to authenticated;
