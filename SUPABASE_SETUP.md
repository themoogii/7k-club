# 7K Supabase Setup

This prototype now has a Supabase bridge. It still works locally when Supabase keys are empty, but it will sync real data after these steps.

## 1. Create Supabase Project

Create a project in Supabase, then open:

- Project Settings -> API
- Copy the project URL
- Copy the public publishable key or anon key

Never paste a service role key into this website.

## 2. Add Browser Keys

Open `supabase-config.js` and fill:

```js
window.SEVENK_SUPABASE_CONFIG = {
  url: "https://YOUR_PROJECT_REF.supabase.co",
  publishableKey: "YOUR_PUBLIC_KEY",
  redirectTo: `${window.location.origin}${window.location.pathname}`,
};
```

## 3. Create Tables, Storage, and Policies

Open Supabase SQL Editor and run everything inside:

```txt
supabase-schema.sql
```

This creates:

- `profiles`
- `event_rsvps`
- `race_photo_folders`
- `race_photos`
- `karma_challenges`
- `karma_ledger_entries`
- `profile-avatars` storage bucket
- `race-photos` storage bucket
- RLS policies and browser API grants

## 4. Enable Auth

In Supabase Auth providers, enable the methods you want:

- Google OAuth
- Email OTP / magic link
- Phone OTP
- Apple OAuth, optional

Add this app URL to allowed redirect URLs:

```txt
http://localhost:YOUR_PORT
https://YOUR_DOMAIN
```

For production, use the real domain. For local OAuth/OTP testing, serve the folder over `http://localhost`; do not rely on raw `file://` redirects.

## 5. Admin Roles

New accounts start as `member`.

To make someone an admin, run this after they sign in once:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

Admin/host/cohost can manage race photo folders, uploaded photos, and Karma challenges.

## 6. What Syncs Now

When configured:

- Google, email, and phone sign-in use Supabase Auth
- Profile avatars upload to Supabase Storage
- Profile rows save to `profiles`
- Event RSVP rows save to `event_rsvps`
- Admin race photo uploads save original files to `race-photos`
- Race photo folder rows save to `race_photo_folders`
- Karma challenge publishing saves to `karma_challenges`
- Karma commitment entries save to `karma_ledger_entries`

If Supabase is not configured or the user lacks admin permission, the prototype falls back to local mode and shows a toast.
