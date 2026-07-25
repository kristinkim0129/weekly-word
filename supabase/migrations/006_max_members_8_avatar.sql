-- Raise group member cap from 5 → 8, and add optional profile avatar_url.

alter table public.profiles
  add column if not exists avatar_url text;

comment on column public.profiles.avatar_url is
  'Optional avatar image URL (e.g. Google profile picture).';

-- Size trigger: count only active seats (left_at is null)
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
  select count(*) into member_count
  from public.group_members
  where group_id = new.group_id
    and left_at is null
    and user_id is distinct from new.user_id;
  if member_count >= 8 then
    raise exception 'Group can have at most 8 members';
  end if;
  return new;
end;
$$;

-- Join / rejoin by invite code (active seasons only) — max 8
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

  if member_count >= 8 then
    raise exception 'Group can have at most 8 members';
  end if;

  insert into public.group_members (group_id, user_id)
  values (g.id, auth.uid());

  return g;
end;
$$;
