# Architecture

## Style and boundaries

Campus SaaS uses a modular monolith: one Next.js application and, when introduced, one PostgreSQL/Supabase data store. Features stay cohesive in one deployable unit while keeping domain rules out of route and presentation code. The repository currently uses the root-level `app/` App Router convention; retain it rather than moving routes to `src/app/` without a concrete need. `src/` is available for shared application modules.

Each feature should own its schemas, domain types, and operations where those are useful. Avoid duplicating domain types in `app/` or introducing generic service/repository layers without a real use case.

| Area | Responsibility |
| --- | --- |
| `app/` | Route segments, layouts, loading/error boundaries, and thin route handlers. Group routes by public, authentication, and signed-in experience when those routes exist. |
| `src/features/auth/` | Sign-up, sign-in, sign-out, confirmation, session lookup, safe redirects, and auth UI. |
| `src/features/app-shell/` | Authenticated navigation shell shared by app prototype routes. |
| `src/features/campus/` | Development-only fictional campus update and event fixtures; no campus data query exists. |
| `src/features/discovery/` | Discovery filter UI and isolated fictional development fixtures; no profile query or like/pass operation exists. |
| `src/features/profile-preview/` | Client-only profile form and photo preview; no persistence or upload operation exists. |
| `src/features/profiles/` | Reserved for future profile data, visibility rules, and server-side validation. |
| `src/features/matches/` | Reserved for future mutual-like lifecycle and unmatching. |
| `src/features/messaging/` | Reserved for future conversation membership and message operations. |
| `src/features/moderation/` | Blocks, reports, and account-safety operations. |
| `src/components/ui/` | Reusable presentation primitives, only as they are needed. |
| `src/components/shared/` | Shared product components that are not owned by one feature. |
| `src/lib/` | Shared infrastructure such as validated environment access and Supabase clients. Keep privileged clients server-only. |
| `src/types/` | Cross-feature types only when a type genuinely has multiple owners; feature-specific types stay with the feature. |
| `supabase/migrations/` | Reviewed, ordered SQL schema and RLS changes. No migration exists yet. |

These are intended ownership boundaries, not a mandate to create empty directories. Create feature code alongside the first implemented use case.

## Request and data flow

The auth foundation uses this flow:

1. The public pages render as Server Components. Session-aware navigation is rendered behind a Suspense boundary because it reads request cookies.
2. Sign-up and sign-in forms submit to Server Actions. Server-side Zod schemas validate email and password, and Supabase configuration is checked before a provider request.
3. `proxy.ts` creates a request-scoped SSR client, calls `auth.getClaims()` to verify/refresh its session, and forwards updated request and response cookies and refresh cache headers. It does not redirect or grant access to routes.
4. Protected server pages independently call `getCurrentUser()`, which verifies claims with `auth.getClaims()` before rendering. Client-supplied IDs and cookie contents alone are not identity proof.
5. The recommended email confirmation template links to `/auth/confirm` with Supabase's token hash. Its GET page does not consume the token; a user-submitted Server Action calls `verifyOtp({ token_hash, type: "email" })`, writes the cookie-backed session, and accepts only a safe internal return path. The older `/auth/callback` route still exchanges PKCE codes for deployments using the default Supabase template.
6. `/dashboard` is the authenticated Campus Home. It shows quick links, campus updates, and upcoming events; the campus update and event examples are fictional development-only fixtures, while production displays unavailable states. `/community` is a read-only feed preview with fictional development-only posts and no posting or reactions. `/events` shows fictional development-only event cards with a local details disclosure; it has no RSVP or persistence. `/discover` is the dedicated matching prototype; it receives fictional illustrated fixtures only when `NODE_ENV` is `development`, and Like/Pass advances a local preview without persisting. Matches contains no fixture matches. Messages is a labeled UI prototype with a disabled composer. Profile editing only previews form values and selected photos in the current browser page.

Sign-up provider responses for accepted requests and existing accounts use the same neutral message to reduce account enumeration. Other provider, transport, and local configuration failures return a generic error state instead of claiming sign-up succeeded. If Supabase returns a session during sign-up, the action asks Supabase to revoke the current refresh token and clears its local cookie; cookie clearing is the fallback if that request fails.

The browser and server client factories and public env validation live in `src/lib/`. Supabase credentials are validated only when a factory runs, so the public starter can render and build without them. When public Supabase configuration is missing, Proxy passes requests through and auth actions return a setup message.

Session-dependent rendering waits for a real request. The session helper calls Next.js `connection()` before checking configuration or reading claims, so build-time absence of credentials cannot bake a sign-in redirect or signed-out navigation into a shared static response.

Authentication for the example app routes is implemented, but the application has no product data operations, database migrations, or RLS. Authentication does not provide authorization to future student data. Those routes must enforce authorization in their server operations and PostgreSQL policies before accessing data. The current matching screens are interface prototypes, not production discovery, matching, messaging, or profile editing.

## Server and client boundaries

Keep session verification, auth actions, validation, and all future authorization on the server. The only value passed into the browser Supabase client is the public publishable key. Mark browser-interactive components with `"use client"` only where form action state is required. No service-role or secret key is configured. Never serialize private profile, report, or conversation data into client props. Public profile data should be purpose-built and minimized rather than exposing database rows wholesale.

## Deferred features

The initial product architecture reserves feature ownership for registration, student profiles and photos, campus membership, community posts and moderation, events and attendance, discovery, likes/passes, mutual matches, private messaging, unmatching, blocks, reports, and account deletion. These sections currently have UI previews only; no campus or social data tables, queries, or policies exist. Cross-school discovery is off by default; the initial discovery policy is intended to be same-school only once authorization is implemented.
