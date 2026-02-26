-- ─── Enable UUID generation ───────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Beats ────────────────────────────────────────────────────────────────────
create table public.beats (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text unique not null,
  producer      text not null default 'Producer',
  bpm           integer not null,
  key           text not null,
  genre         text not null,
  mood          text[] default '{}',
  tags          text[] default '{}',
  preview_url   text not null,          -- watermarked preview MP3
  cover_art     text default '',        -- public image URL
  licenses      jsonb not null default '[]',
  plays         integer not null default 0,
  featured      boolean not null default false,
  exclusive_sold boolean not null default false,
  created_at    timestamptz default now()
);

-- Public read access on beats
alter table public.beats enable row level security;
create policy "Anyone can read beats" on public.beats for select using (true);
create policy "Service role can modify beats" on public.beats for all using (auth.role() = 'service_role');

-- ─── Orders ───────────────────────────────────────────────────────────────────
create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  email             text not null,
  stripe_session_id text unique not null,
  status            text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  items             jsonb not null default '[]',
  total             integer not null default 0,   -- in cents
  created_at        timestamptz default now()
);

-- Orders are only readable by service role (secure)
alter table public.orders enable row level security;
create policy "Service role only" on public.orders for all using (auth.role() = 'service_role');

-- ─── Storage bucket ───────────────────────────────────────────────────────────
-- Run this in the Supabase dashboard > Storage > New Bucket
-- Bucket name: beats
-- Public: NO (private bucket, access via signed URLs only)
-- File structure: beats/{beat_id}/mp3_lease.mp3
--                 beats/{beat_id}/wav_lease.wav
--                 beats/{beat_id}/trackout.zip
--                 beats/{beat_id}/exclusive.zip
--                 previews/{beat_id}/preview.mp3  ← watermarked, can be public

-- ─── Sample beat ──────────────────────────────────────────────────────────────
-- insert into public.beats (title, slug, bpm, key, genre, preview_url, licenses) values
-- ('Dark Intentions', 'dark-intentions', 140, 'F# Minor', 'Trap',
--  'https://your-supabase.storage/previews/dark-intentions.mp3',
--  '[{"type":"mp3_lease","label":"MP3 Lease","price":2999},{"type":"wav_lease","label":"WAV Lease","price":4999}]'
-- );
