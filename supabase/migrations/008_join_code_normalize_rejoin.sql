-- Normalize invite codes (ignore spaces/punctuation) and make rejoin/sync reliable.
-- Fixes paste of formatted codes like "3081 F9E1" and returning members with left_at set.

create or replace function public.join_group_by_code(p_code text)
returns public.groups
language plpgsql
security definer
set search_path = public
as $$
declare
  g public.groups;
  member_count int;
  code_norm text;
  existing_left_at timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  code_norm := lower(regexp_replace(coalesce(p_code, ''), '[^a-zA-Z0-9]', '', 'g'));
  if code_norm = '' then
    raise exception 'Group not found';
  end if;

  select * into g
  from public.groups
  where lower(regexp_replace(invite_code, '[^a-zA-Z0-9]', '', 'g')) = code_norm
  limit 1;

  if g.id is null then
    raise exception 'Group not found';
  end if;

  if g.status <> 'active' then
    raise exception 'Group season has ended';
  end if;

  -- Already a row for this user in this group → sync / rejoin
  select left_at into existing_left_at
  from public.group_members
  where group_id = g.id and user_id = auth.uid();

  if found then
    if existing_left_at is not null then
      -- Re-activate seat (capacity check via trigger)
      update public.group_members
      set left_at = null, joined_at = now()
      where group_id = g.id and user_id = auth.uid();
    end if;
    -- If already active (left_at null), no-op sync
    return g;
  end if;

  select count(*) into member_count
  from public.group_members
  where group_id = g.id and left_at is null;

  if member_count >= 8 then
    raise exception 'Group can have at most 8 members';
  end if;

  insert into public.group_members (group_id, user_id)
  values (g.id, auth.uid());

  return g;
end;
$$;
