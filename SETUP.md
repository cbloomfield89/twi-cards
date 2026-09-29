# TWI Cards — setup & deploy guide

TWI Cards is a separate web app that shares the Kata Tracker's Supabase
project, so everyone signs in with their existing Kata email and password.
There is no new database to create and no new keys to generate.

## 1. Run the database change (once)

Supabase → SQL Editor → New query → paste all of
`supabase/update-6-twi-card-views.sql` → Run. It adds one table
(`twi_card_views`) and one function (`twi_view_counts`). It doesn't touch any
Kata table, and it's safe to run again.

## 2. Create the GitHub repo

Create a new repository named `twi-cards`. Upload every file from this zip
(drag and drop in the GitHub web UI), then commit.

## 3. Create the Vercel project

1. Vercel → Add New → Project → import `twi-cards`. Vercel detects Vite.
2. Before the first deploy, open Environment Variables and add the same two
   values the Kata project uses (copy them from the Kata project's
   Settings → Environment Variables): `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY`.
3. Deploy. Vercel gives you an address like `https://twi-cards.vercel.app`.

## 4. Run it locally (optional)

```bash
cp .env.example .env   # paste the same two values
npm install
npm run dev
```

## Notes

- New people create their account in Kata Tracker. The TWI sign-in screen
  links there.
- Each app keeps its own sign-in, so people sign in once on each app (same
  email and password).
- On a phone, add it to the home screen the same way as Kata: Safari → Share →
  Add to Home Screen, or Chrome → ⋮ → Install app.
