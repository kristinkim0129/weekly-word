-- Group seasons (periods), soft leave, prayer name snapshots
-- Run after 001_init.sql

alter table public.groups
  add column if not exists period_preset text not null default 'custom',
  add column if not exists period_label text not null default '기간 미정',
  add column if not exists starts_at date not null default current_date,
  add column if not exists ends_at date,
  add column if not exists status text not null default 'active'
    check (status in ('active', 'ended'));

alter table public.group_members
  add column if not exists left_at timestamptz;

-- Active membership only
create or replace function public.is_group_member(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id
      and user_id = auth.uid()
      and left_at is null
  );
$$;

-- Ever belonged (for reading past season prayer/cheers)
create or replace function public.was_group_member(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id
      and user_id = auth.uid()
  );
$$;

-- Snapshots so prayer history keeps names after leave / season end
alter table public.prayer_tokens
  add column if not exists from_name text,
  add column if not exists to_name text,
  add column if not exists group_name text;

-- Do not cascade-delete social history when a group row is removed;
-- seasons are normally soft-ended instead.
alter table public.prayer_tokens
  drop constraint if exists prayer_tokens_group_id_fkey;
alter table public.prayer_tokens
  add constraint prayer_tokens_group_id_fkey
  foreign key (group_id) references public.groups (id) on delete restrict;

alter table public.cheers
  drop constraint if exists cheers_group_id_fkey;
alter table public.cheers
  add constraint cheers_group_id_fkey
  foreign key (group_id) references public.groups (id) on delete restrict;

-- Read past season feed if you were ever a member
drop policy if exists "cheers_select_member" on public.cheers;
create policy "cheers_select_member"
  on public.cheers for select to authenticated
  using (public.was_group_member(group_id));

drop policy if exists "tokens_select_member" on public.prayer_tokens;
create policy "tokens_select_member"
  on public.prayer_tokens for select to authenticated
  using (public.was_group_member(group_id));

drop policy if exists "questions_select_member" on public.questions;
create policy "questions_select_member"
  on public.questions for select to authenticated
  using (public.was_group_member(group_id));

drop policy if exists "groups_select_member" on public.groups;
create policy "groups_select_member"
  on public.groups for select to authenticated
  using (public.was_group_member(id) or created_by = auth.uid());

-- Join / rejoin by invite code (active seasons only)
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

  if g.status <> 'active' then
    raise exception 'Group season has ended';
  end if;

  select count(*) into member_count
  from public.group_members
  where group_id = g.id and left_at is null;

  -- Rejoin path
  if exists (
    select 1 from public.group_members
    where group_id = g.id and user_id = auth.uid()
  ) then
    update public.group_members
    set left_at = null, joined_at = now()
    where group_id = g.id and user_id = auth.uid();
    return g;
  end if;

  if member_count >= 5 then
    raise exception 'Group can have at most 5 members';
  end if;

  insert into public.group_members (group_id, user_id)
  values (g.id, auth.uid());

  return g;
end;
$$;

-- Soft leave: keep row for history, clear active seat
create or replace function public.leave_group(p_group_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.group_members
  set left_at = now()
  where group_id = p_group_id
    and user_id = auth.uid()
    and left_at is null;
end;
$$;

revoke all on function public.leave_group(uuid) from public;
grant execute on function public.leave_group(uuid) to authenticated;

-- Creator ends season (묵상은 user week_captures에 그대로)
create or replace function public.end_group_season(p_group_id uuid)
returns public.groups
language plpgsql
security definer
set search_path = public
as $$
declare
  g public.groups;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into g from public.groups where id = p_group_id;
  if g.id is null then
    raise exception 'Group not found';
  end if;
  if g.created_by <> auth.uid() then
    raise exception 'Only creator can end season';
  end if;

  update public.groups
  set
    status = 'ended',
    ends_at = coalesce(ends_at, current_date)
  where id = p_group_id
  returning * into g;

  update public.group_members
  set left_at = coalesce(left_at, now())
  where group_id = p_group_id and left_at is null;

  return g;
end;
$$;

revoke all on function public.end_group_season(uuid) from public;
grant execute on function public.end_group_season(uuid) to authenticated;

-- Size trigger counts only active members (insert + rejoin via left_at clear)
create or replace function public.enforce_group_size()
returns trigger
language plpgsql
as $$
declare
  member_count int;
begin
  if new.left_at is not null then
    return new;
  end if;
  -- On update rejoin: old row was inactive, don't count self twice
  select count(*) into member_count
  from public.group_members
  where group_id = new.group_id
    and left_at is null
    and user_id is distinct from new.user_id;
  if member_count >= 5 then
    raise exception 'Group can have at most 5 members';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_group_size_update on public.group_members;
create trigger trg_group_size_update
  before update of left_at on public.group_members
  for each row
  when (old.left_at is not null and new.left_at is null)
  execute function public.enforce_group_size();
