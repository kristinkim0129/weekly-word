-- Once-per-account usage flags for AI reply and pastor summary copy
-- Run after 002_group_seasons.sql

alter table public.profiles
  add column if not exists ai_reply_used_at timestamptz,
  add column if not exists pastor_summary_copied_at timestamptz;

comment on column public.profiles.ai_reply_used_at is
  'Set when the account successfully generates an AI reply (lifetime, once).';
comment on column public.profiles.pastor_summary_copied_at is
  'Set when the account successfully copies the pastor summary (lifetime, once).';
