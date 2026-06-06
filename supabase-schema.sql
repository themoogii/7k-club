-- 7K Running Club Supabase foundation
-- Run this in the Supabase SQL editor after creating a project.
-- Never put a service_role key in browser code.

create extension if not exists "pgcrypto";

create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '7K Runner',
  email text,
  phone text,
  bio text,
  club_affiliation text,
  instagram_handle text,
  strava_profile text,
  avatar_url text,
  avatar_crop jsonb not null default '{}'::jsonb,
  role text not null default 'member' check (role in ('member', 'host', 'cohost', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('going', 'maybe', 'cant')),
  registered boolean not null default false,
  display_name text,
  emergency_contact text,
  pace_group text,
  notes text,
  form_answers jsonb not null default '{}'::jsonb,
  status_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table if not exists public.race_photo_folders (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  cover_photo_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.race_photos (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references public.race_photo_folders(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete set null,
  title text not null,
  bib text,
  zone text,
  file_path text not null,
  original_url text not null,
  preview_url text,
  width integer,
  height integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.karma_challenges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  goal text not null,
  commitment_amount_mnt integer not null check (commitment_amount_mnt >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published', 'settling', 'settled')),
  rules jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.karma_ledger_entries (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.karma_challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_mnt integer not null check (amount_mnt >= 0),
  status text not null default 'locked' check (status in ('locked', 'refunded', 'forfeited', 'split_paid')),
  goal_status text not null default 'pending' check (goal_status in ('pending', 'completed', 'missed')),
  proof jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  settled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (challenge_id, user_id)
);

create index if not exists event_rsvps_event_id_idx on public.event_rsvps(event_id);
create index if not exists event_rsvps_user_id_idx on public.event_rsvps(user_id);
create index if not exists race_photos_folder_id_idx on public.race_photos(folder_id);
create index if not exists race_photos_bib_idx on public.race_photos(bib);
create index if not exists karma_ledger_challenge_id_idx on public.karma_ledger_entries(challenge_id);
create index if not exists karma_ledger_user_id_idx on public.karma_ledger_entries(user_id);

create or replace function private.is_admin_or_host()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'host', 'cohost')
  );
$$;

create or replace function private.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' and new.role <> 'member' and not private.is_admin_or_host() then
    raise exception 'Only admins can create elevated profile roles.';
  end if;

  if tg_op = 'UPDATE' and new.role is distinct from old.role and not private.is_admin_or_host() then
    raise exception 'Only admins can change profile roles.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_profile_role_escalation on public.profiles;
create trigger prevent_profile_role_escalation
before insert or update on public.profiles
for each row execute function private.prevent_profile_role_escalation();

alter table public.profiles enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.race_photo_folders enable row level security;
alter table public.race_photos enable row level security;
alter table public.karma_challenges enable row level security;
alter table public.karma_ledger_entries enable row level security;

drop policy if exists "profiles are readable" on public.profiles;
create policy "profiles are readable"
on public.profiles for select
to anon, authenticated
using (true);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid() and role = 'member');

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "admins update profile roles" on public.profiles;
create policy "admins update profile roles"
on public.profiles for update
to authenticated
using (private.is_admin_or_host())
with check (private.is_admin_or_host());

drop policy if exists "users read own rsvps" on public.event_rsvps;
create policy "users read own rsvps"
on public.event_rsvps for select
to authenticated
using (user_id = auth.uid() or private.is_admin_or_host());

drop policy if exists "users write own rsvps" on public.event_rsvps;
create policy "users write own rsvps"
on public.event_rsvps for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "users update own rsvps" on public.event_rsvps;
create policy "users update own rsvps"
on public.event_rsvps for update
to authenticated
using (user_id = auth.uid() or private.is_admin_or_host())
with check (user_id = auth.uid() or private.is_admin_or_host());

drop policy if exists "photo folders are public" on public.race_photo_folders;
create policy "photo folders are public"
on public.race_photo_folders for select
to anon, authenticated
using (true);

drop policy if exists "hosts manage photo folders" on public.race_photo_folders;
create policy "hosts manage photo folders"
on public.race_photo_folders for all
to authenticated
using (private.is_admin_or_host())
with check (private.is_admin_or_host());

drop policy if exists "race photos are public" on public.race_photos;
create policy "race photos are public"
on public.race_photos for select
to anon, authenticated
using (true);

drop policy if exists "hosts manage race photos" on public.race_photos;
create policy "hosts manage race photos"
on public.race_photos for all
to authenticated
using (private.is_admin_or_host())
with check (private.is_admin_or_host());

drop policy if exists "published challenges are public" on public.karma_challenges;
create policy "published challenges are public"
on public.karma_challenges for select
to anon, authenticated
using (status <> 'draft' or private.is_admin_or_host());

drop policy if exists "hosts manage challenges" on public.karma_challenges;
create policy "hosts manage challenges"
on public.karma_challenges for all
to authenticated
using (private.is_admin_or_host())
with check (private.is_admin_or_host());

drop policy if exists "users read own karma ledger" on public.karma_ledger_entries;
create policy "users read own karma ledger"
on public.karma_ledger_entries for select
to authenticated
using (user_id = auth.uid() or private.is_admin_or_host());

drop policy if exists "users enter karma challenge" on public.karma_ledger_entries;
create policy "users enter karma challenge"
on public.karma_ledger_entries for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "users update pending own karma proof" on public.karma_ledger_entries;
create policy "users update pending own karma proof"
on public.karma_ledger_entries for update
to authenticated
using (user_id = auth.uid() or private.is_admin_or_host())
with check (user_id = auth.uid() or private.is_admin_or_host());

insert into storage.buckets (id, name, public)
values
  ('profile-avatars', 'profile-avatars', true),
  ('race-photos', 'race-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "avatar images are public" on storage.objects;
create policy "avatar images are public"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'profile-avatars');

drop policy if exists "users upload own avatar" on storage.objects;
create policy "users upload own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "users update own avatar" on storage.objects;
create policy "users update own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "race photos are public storage" on storage.objects;
create policy "race photos are public storage"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'race-photos');

drop policy if exists "hosts upload race photos" on storage.objects;
create policy "hosts upload race photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'race-photos' and private.is_admin_or_host());

drop policy if exists "hosts update race photos" on storage.objects;
create policy "hosts update race photos"
on storage.objects for update
to authenticated
using (bucket_id = 'race-photos' and private.is_admin_or_host())
with check (bucket_id = 'race-photos' and private.is_admin_or_host());

grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant select, insert, update on public.event_rsvps to authenticated;
grant select on public.race_photo_folders, public.race_photos to anon, authenticated;
grant insert, update, delete on public.race_photo_folders, public.race_photos to authenticated;
grant select on public.karma_challenges to anon, authenticated;
grant insert, update, delete on public.karma_challenges to authenticated;
grant select, insert, update on public.karma_ledger_entries to authenticated;
