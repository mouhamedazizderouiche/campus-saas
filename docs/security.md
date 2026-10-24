# Security and privacy

## Current status

This repository includes Supabase email/password sign-up, sign-in, sign-out, a token-hash email confirmation flow, a PKCE callback for the default template, a session-refresh Proxy, and protected Compuce app routes. The token-hash confirmation page does not verify on GET; verification occurs only on form submission to reduce one-time-link consumption by email scanners. The Confirm signup template must be customized as documented in the README for this flow to be used. Campus update, community post, and event fixtures are fictional, visibly labeled, and served only in development; discovery fixtures follow the same rule. Like/Pass is local preview state; profile editing and photo selection are not saved or uploaded. Matches has no fixture records, and the disabled message composer cannot send messages. These flows require valid Supabase project configuration and have not been verified against a live project. No database schema, RLS policy, profile/photo storage, campus membership authorization, community feed, event source, or moderation workflow exists. Do not use this scaffold with real student data.

## Threat model

Protect student identity and profile details, private photos, discovery and like activity, match status, conversation contents, and safety reports from unauthenticated visitors, other students, blocked users, compromised client code, and overly broad moderator access. Account takeover, scraping, harassment, spam, enumeration, and unauthorized access through guessed identifiers are relevant threats.

## Authentication and authorization

Authentication establishes the signed-in identity; authorization decides what that identity may do. The example dashboard verifies the session server-side with Supabase `getClaims()`. The Proxy refreshes cookies but does not grant access; every protected page/action must independently verify the session. Never trust user IDs, school IDs, match IDs, or role claims supplied in request bodies without checking them against the verified principal and database state. Enforce sensitive row access in PostgreSQL RLS as well as in server operations. UI visibility is not an access control.

RLS must cover all user data tables, including storage objects. Scope profile update to the profile owner; scope discovery to eligible same-school profiles; scope matches and conversations to their participants; scope message read/write to current conversation members and active matched participants. A user must not read another conversation by changing an identifier. Test policies using separate user sessions, not only an elevated service role.

## Discovery, blocking, and messaging

Discovery must filter hidden/ineligible profiles and exclude either direction of a block before returning candidates. Enforce same-school membership in the database transaction. Like/pass endpoints need input validation, rate limits, and authorization. Create a match only from reciprocal likes in an atomic operation and prevent duplicates with a canonical unique participant pair.

Only matched participants may create a conversation. Only current members of an active match may read or send messages; enforce this on the server and in RLS. Define the effect of unmatching on existing conversation reads and sends before implementation. Blocking should immediately prevent future discovery and messaging both ways. Do not expose likes or reports to other students.

## Photos and profile privacy

Use private storage buckets for student photos. Issue short-lived, authorized access rather than public object URLs. Validate file type, size, and image content; strip metadata where practical; rate-limit uploads; and clean up files during account deletion. Default new profiles to non-discoverable until the student intentionally completes setup and opts in. Return only profile fields needed by discovery. Establish consent, retention, and deletion behavior before collecting student data.

## Secrets and environment

The checked-in `.env.example` contains placeholders for `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `APP_URL`. The first two values identify the public Supabase project component; neither is an authorization secret. `APP_URL` is server-only and provides a trusted base URL for email-confirmation redirects. `src/lib/env.ts` validates Supabase settings when a client factory is called and reports variable names without their values. No service-role or secret key is configured. Never put Supabase secret keys in `NEXT_PUBLIC_` variables or browser code. Keep actual `.env*` files out of Git; `.env.example` is intentionally allowed.

## Reporting, abuse prevention, and account deletion

Email confirmation should be enabled in Supabase Auth. The sign-up action does not treat account creation as a verified sign-in; when Supabase returns a session because confirmation is disabled, it asks Supabase to revoke the current refresh token and clears the local session cookie. If the revocation request fails, it still attempts cookie cleanup, but that does not revoke the server-side refresh token. Provider responses for accepted requests and existing accounts remain neutral; other provider, transport, or local configuration failures are errors, not success messages. Sign-out also requests current-session refresh-token revocation and removes local cookies. If Supabase cannot confirm revocation, the UI reports that limitation; any already issued access token can remain valid until its expiry. The authentication foundation does not provide school membership authorization, RLS, registration rate limiting beyond Supabase defaults, a report flow, moderation operations, or account deletion. Provide a restricted moderation queue, documented escalation and retention rules, and auditable moderator access before launch. Minimize retained data and define appeals and urgent safety handling. Account deletion must revoke sessions, remove or anonymize profile and photo data, and handle message/report retention under a documented policy; do not promise full erasure until those dependencies are designed and implemented.
