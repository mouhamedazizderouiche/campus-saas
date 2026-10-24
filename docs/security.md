# Security and privacy

## Current status

This repository is a Next.js starter. It has no authentication, Supabase client, database schema, RLS policy, profile/photo storage, or moderation workflow. The controls below are requirements for implementation, not claims about existing protection. Do not use this scaffold with real student data.

## Threat model

Protect student identity and profile details, private photos, discovery and like activity, match status, conversation contents, and safety reports from unauthenticated visitors, other students, blocked users, compromised client code, and overly broad moderator access. Account takeover, scraping, harassment, spam, enumeration, and unauthorized access through guessed identifiers are relevant threats.

## Authentication and authorization

Authentication establishes the signed-in identity; authorization decides what that identity may do. Verify sessions on the server for every protected operation. Never trust user IDs, school IDs, match IDs, or role claims supplied in request bodies without checking them against the verified principal and database state. Enforce sensitive row access in PostgreSQL RLS as well as in server operations. UI visibility is not an access control.

RLS must cover all user data tables, including storage objects. Scope profile update to the profile owner; scope discovery to eligible same-school profiles; scope matches and conversations to their participants; scope message read/write to current conversation members and active matched participants. A user must not read another conversation by changing an identifier. Test policies using separate user sessions, not only an elevated service role.

## Discovery, blocking, and messaging

Discovery must filter hidden/ineligible profiles and exclude either direction of a block before returning candidates. Enforce same-school membership in the database transaction. Like/pass endpoints need input validation, rate limits, and authorization. Create a match only from reciprocal likes in an atomic operation and prevent duplicates with a canonical unique participant pair.

Only matched participants may create a conversation. Only current members of an active match may read or send messages; enforce this on the server and in RLS. Define the effect of unmatching on existing conversation reads and sends before implementation. Blocking should immediately prevent future discovery and messaging both ways. Do not expose likes or reports to other students.

## Photos and profile privacy

Use private storage buckets for student photos. Issue short-lived, authorized access rather than public object URLs. Validate file type, size, and image content; strip metadata where practical; rate-limit uploads; and clean up files during account deletion. Default new profiles to non-discoverable until the student intentionally completes setup and opts in. Return only profile fields needed by discovery. Establish consent, retention, and deletion behavior before collecting student data.

## Secrets and environment

The checked-in `.env.example` contains placeholders for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Those public values identify the project and are not authorization secrets. Never put Supabase secret/service-role keys in `NEXT_PUBLIC_` variables or browser code. Validate required variables on the server when adding the integration, and report missing variable names without printing values. Keep actual `.env*` files out of Git; `.env.example` is intentionally allowed.

## Reporting, abuse prevention, and account deletion

Provide a clear report flow, restricted moderation queue, documented escalation and retention rules, and auditable moderator access. Add rate limits and abuse monitoring for registration, likes, reports, messaging, and uploads. Minimize retained data and define appeals and urgent safety handling before launch. Account deletion must revoke sessions, remove or anonymize profile and photo data, and handle message/report retention under a documented policy; do not promise full erasure until those dependencies are designed and implemented.
