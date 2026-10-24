# Compuce

Compuce is a campus social platform prototype for student community, campus activities, and finding friendship, dating, or both. It combines Supabase email authentication with a campus dashboard and clearly labeled UI previews.

## Current experience

- Sign-up, sign-in, sign-out, email confirmation, session refresh, and protected app pages use Supabase Auth.
- `/dashboard` is the authenticated Campus Home, with quick links, campus updates, and upcoming events. Campus updates and events are fictional, explicitly labeled development fixtures; production has honest unavailable states until a real backend is connected.
- `/community` is a feed preview. Its development sample posts are fictional and cannot be posted to, reacted to, or replied to.
- `/discover` is the dedicated matching preview. In development it shows clearly labeled fictional illustration fixtures; those fixtures are never returned in production. Like and Pass only advance the local preview and are not saved.
- `/events` shows event discovery cards in development with fictional dates, locations, and organizers. The details disclosure works locally; no event data or RSVP is stored.
- `/matches` shows an honest empty state. It does not invent or claim real matches.
- `/messages` is a visual conversation prototype. Sample bubbles are labeled as such, and the disabled composer cannot send or save messages.
- `/profile` is a local-only editing preview. Validation, interests, intention selection, and a selected image preview work in the current page, but no profile or photo is saved or uploaded.

The app has no profile, likes, matches, conversations, messages, blocks, reports, campus membership, community posts, or events tables; no migrations or RLS policies exist. Do not use it with real student data or treat a signed-in user as authorized to access student profiles.

## Prerequisites

- Node.js 22 or newer (the installed Supabase JavaScript client requires 22; Next.js requires 20.9)
- npm
- A Supabase project for live authentication

## Configure Supabase

1. Copy `.env.example` to `.env.local` and set the Supabase project URL and publishable key. Keep `APP_URL` set to the trusted application origin. Do not commit `.env.local`, and never put a secret/service-role key in a `NEXT_PUBLIC_` variable.
2. In Supabase **Authentication → Providers → Email**, enable email/password sign-in and email confirmation.
3. In **Authentication → URL Configuration**, set the Site URL to the app origin and allow `${APP_URL}/auth/callback` as a redirect URL.
4. In **Authentication → Email Templates → Confirm signup**, replace the default confirmation URL link with this user-confirmed token-hash link:

   ```html
   <h2>Confirm your email</h2>
   <p>Press the button below to finish signing up.</p>
   <p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&amp;type=email&amp;next=%2Fdashboard">Confirm email address</a></p>
   ```

   The `/auth/confirm` GET page does not consume the token. The user presses the button to submit it to a Server Action, which verifies it with Supabase and writes the session cookie. Without the custom template, Supabase's default one-time confirmation link continues to use the PKCE callback and may be consumed by email scanners or fail when opened in a browser without the verifier cookie.

The Site URL and `APP_URL` should point to the same app origin. Keep the callback redirect allowlisted because sign-up still passes that redirect URL to Supabase.

## Run locally

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, then confirm your email using the custom email template above. The public landing page and production build work without real Supabase credentials; live authentication requires a configured Supabase project.

## Available scripts

- `npm run dev` — start Next.js in development mode
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript without emitting files
- `npm test` — run Vitest once
- `npm run build` — create a production build
- `npm run start` — serve a production build

## Product backend still required

Before real discovery or social data is introduced, implement and review:

- `schools` and `profiles` with explicit campus membership and visibility/consent fields
- Directional `likes` and atomic mutual-match creation with uniqueness constraints
- Match-scoped `conversations` and participant-authorized `messages`
- `blocks` and `reports` with restricted moderation access
- Private profile-photo storage and upload validation
- RLS for every user-data table and storage bucket, plus server-side authorization on every action
- Disposable-project tests for owner, unrelated user, blocked user, match participant, and moderator access

See [database design](docs/database-design.md) for the proposed schema, [architecture](docs/architecture.md) for module boundaries, and [security](docs/security.md) for current controls and remaining requirements. The schema document is a proposal and has not been migrated.
