-- User-entered reading body for Today → Read (5 min).
-- `scripture` remains the chapter/reference line shown on the Today week card.
-- Run: supabase db push   (or apply this SQL in the Supabase SQL editor)

alter table public.week_captures
  add column if not exists passage text;

comment on column public.week_captures.scripture is
  'Chapter / reference line for Today week card (e.g. John 15 or John 15:1-8)';

comment on column public.week_captures.passage is
  'User-entered passage text shown in Today → Read';
