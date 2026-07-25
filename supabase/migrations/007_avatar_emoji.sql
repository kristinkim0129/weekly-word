-- Optional per-user profile emoji (display override over Google/avatar_url).

alter table public.profiles
  add column if not exists avatar_emoji text;

comment on column public.profiles.avatar_emoji is
  'Optional emoji avatar override. When set, UI shows emoji instead of avatar_url.';
