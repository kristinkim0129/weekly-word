-- Weekly Word initial schema (safe for empty project)
-- All public tables enable RLS immediately after create.
-- Paste into Supabase SQL Editor and Run.

create extension if not exists "pgcrypto";

-- ========== profiles ==========
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '나',
  theme_id text not null default 'mint',
  nudge_time text not null default '08:00',
  group_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.profiles force row level security;

-- ========== groups ==========
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null default '우리 그룹',
  invite_code text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.groups enable row level security;
alter table public.groups force row level security;

create table if not exists public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
alter table public.group_members enable row level security;
alter table public.group_members force row level security;

-- Helpers
create or replace function public.is_group_member(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = auth.uid()
  );
$$;

create or replace function public.enforce_group_size()
returns trigger
language plpgsql
as $$
declare
  member_count int;
begin
  select count(*) into member_count
  from public.group_members
  where group_id = new.group_id;
  if member_count >= 5 then
    raise exception 'Group can have at most 5 members';
  end if;
  return new;
end;
$$;

-- Create trigger only if missing (avoids DROP)
do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'trg_group_size'
      and tgrelid = 'public.group_members'::regclass
  ) then
    create trigger trg_group_size
      before insert on public.group_members
      for each row execute function public.enforce_group_size();
  end if;
end $$;

-- Join by invite code
create or replace function public.join_group_by_code(p_code text)
returns public.groups
language plpgsql
security definer
set search_path = public
as $$
declare
  g public.groups;
  member_count int;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into g
  from public.groups
  where lower(invite_code) = lower(trim(p_code))
  limit 1;

  if g.id is null then
    raise exception 'Group not found';
  end if;

  select count(*) into member_count
  from public.group_members
  where group_id = g.id;

  if member_count >= 5 then
    raise exception 'Group can have at most 5 members';
  end if;

  insert into public.group_members (group_id, user_id)
  values (g.id, auth.uid())
  on conflict do nothing;

  return g;
end;
$$;

revoke all on function public.join_group_by_code(text) from public;
grant execute on function public.join_group_by_code(text) to authenticated;

-- Group policies (idempotent)
do $$ begin
  create policy "groups_select_member"
    on public.groups for select to authenticated
    using (public.is_group_member(id) or created_by = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "groups_insert_own"
    on public.groups for insert to authenticated
    with check (created_by = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "groups_update_creator"
    on public.groups for update to authenticated
    using (created_by = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "group_members_select"
    on public.group_members for select to authenticated
    using (public.is_group_member(group_id) or user_id = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "group_members_insert"
    on public.group_members for insert to authenticated
    with check (
      user_id = auth.uid()
      or exists (
        select 1 from public.groups g
        where g.id = group_id and g.created_by = auth.uid()
      )
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "group_members_delete_self"
    on public.group_members for delete to authenticated
    using (user_id = auth.uid());
exception when duplicate_object then null;
end $$;

-- ========== week_captures ==========
create table if not exists public.week_captures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  week_key text not null,
  scripture text not null,
  brief_point text not null,
  first_thought text not null,
  notes text,
  prayer_request text,
  meditation_point text,
  practice text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_key)
);
alter table public.week_captures enable row level security;
alter table public.week_captures force row level security;

do $$ begin
  create policy "week_captures_select"
    on public.week_captures for select to authenticated
    using (
      user_id = auth.uid()
      or exists (
        select 1
        from public.group_members gm1
        join public.group_members gm2 on gm1.group_id = gm2.group_id
        where gm1.user_id = auth.uid() and gm2.user_id = week_captures.user_id
      )
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "week_captures_insert_own"
    on public.week_captures for insert to authenticated
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "week_captures_update_own"
    on public.week_captures for update to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "week_captures_delete_own"
    on public.week_captures for delete to authenticated
    using (user_id = auth.uid());
exception when duplicate_object then null;
end $$;

-- ========== daily_checks ==========
create table if not exists public.daily_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date_key text not null,
  week_key text not null,
  completed_at timestamptz not null default now(),
  unique (user_id, date_key)
);
alter table public.daily_checks enable row level security;
alter table public.daily_checks force row level security;

do $$ begin
  create policy "daily_checks_select"
    on public.daily_checks for select to authenticated
    using (
      user_id = auth.uid()
      or exists (
        select 1
        from public.group_members gm1
        join public.group_members gm2 on gm1.group_id = gm2.group_id
        where gm1.user_id = auth.uid() and gm2.user_id = daily_checks.user_id
      )
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "daily_checks_insert_own"
    on public.daily_checks for insert to authenticated
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "daily_checks_delete_own"
    on public.daily_checks for delete to authenticated
    using (user_id = auth.uid());
exception when duplicate_object then null;
end $$;

-- ========== cheers ==========
create table if not exists public.cheers (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  text text not null,
  week_key text,
  created_at timestamptz not null default now()
);
alter table public.cheers enable row level security;
alter table public.cheers force row level security;

do $$ begin
  create policy "cheers_select_member"
    on public.cheers for select to authenticated
    using (public.is_group_member(group_id));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "cheers_insert_member"
    on public.cheers for insert to authenticated
    with check (author_id = auth.uid() and public.is_group_member(group_id));
exception when duplicate_object then null;
end $$;

-- ========== prayer_tokens ==========
create table if not exists public.prayer_tokens (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  from_id uuid not null references auth.users (id) on delete cascade,
  to_id uuid not null references auth.users (id) on delete cascade,
  date_key text not null,
  created_at timestamptz not null default now(),
  unique (from_id, to_id, date_key)
);
alter table public.prayer_tokens enable row level security;
alter table public.prayer_tokens force row level security;

do $$ begin
  create policy "tokens_select_member"
    on public.prayer_tokens for select to authenticated
    using (public.is_group_member(group_id));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "tokens_insert_member"
    on public.prayer_tokens for insert to authenticated
    with check (from_id = auth.uid() and public.is_group_member(group_id));
exception when duplicate_object then null;
end $$;

-- ========== questions ==========
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  author_id uuid references auth.users (id) on delete set null,
  text text not null,
  is_anonymous boolean not null default false,
  ai_reply text,
  week_key text,
  created_at timestamptz not null default now()
);
alter table public.questions enable row level security;
alter table public.questions force row level security;

do $$ begin
  create policy "questions_select_member"
    on public.questions for select to authenticated
    using (public.is_group_member(group_id));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "questions_insert_member"
    on public.questions for insert to authenticated
    with check (
      public.is_group_member(group_id)
      and (author_id = auth.uid() or author_id is null)
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "questions_update_member"
    on public.questions for update to authenticated
    using (public.is_group_member(group_id));
exception when duplicate_object then null;
end $$;

-- ========== feedbacks ==========
create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('feedback', 'fix')),
  text text not null,
  created_at timestamptz not null default now()
);
alter table public.feedbacks enable row level security;
alter table public.feedbacks force row level security;

do $$ begin
  create policy "feedbacks_own"
    on public.feedbacks for all to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end $$;

-- ========== profile policies ==========
do $$ begin
  create policy "profiles_select_own_or_group"
    on public.profiles for select to authenticated
    using (
      id = auth.uid()
      or exists (
        select 1
        from public.group_members gm1
        join public.group_members gm2 on gm1.group_id = gm2.group_id
        where gm1.user_id = auth.uid() and gm2.user_id = profiles.id
      )
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "profiles_insert_own"
    on public.profiles for insert to authenticated
    with check (id = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "profiles_update_own"
    on public.profiles for update to authenticated
    using (id = auth.uid())
    with check (id = auth.uid());
exception when duplicate_object then null;
end $$;

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '나')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'on_auth_user_created'
      and tgrelid = 'auth.users'::regclass
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();
  end if;
end $$;
