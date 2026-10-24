# Architecture

## Style and boundaries

Campus SaaS uses a modular monolith: one Next.js application and, when introduced, one PostgreSQL/Supabase data store. Features stay cohesive in one deployable unit while keeping domain rules out of route and presentation code. The repository currently uses the root-level `app/` App Router convention; retain it rather than moving routes to `src/app/` without a concrete need. `src/` is available for shared application modules.

Each feature should own its schemas, domain types, and operations where those are useful. Avoid duplicating domain types in `app/` or introducing generic service/repository layers without a real use case.

| Area | Responsibility |
| --- | --- |
| `app/` | Route segments, layouts, loading/error boundaries, and thin route handlers. Group routes by public, authentication, and signed-in experience when those routes exist. |
| `src/features/auth/` | Registration, sign-in, session-aware operations, and auth input schemas. |
| `src/features/profiles/` | Profile data, visibility rules, and profile update validation. |
| `src/features/discovery/` | Same-school candidate selection and like/pass operations. |
| `src/features/matches/` | Mutual-like lifecycle and unmatching. |
| `src/features/messaging/` | Conversation membership and message operations. |
| `src/features/moderation/` | Blocks, reports, and account-safety operations. |
| `src/components/ui/` | Reusable presentation primitives, only as they are needed. |
| `src/components/shared/` | Shared product components that are not owned by one feature. |
| `src/lib/` | Shared infrastructure such as validated environment access and Supabase clients. Keep privileged clients server-only. |
| `src/types/` | Cross-feature types only when a type genuinely has multiple owners; feature-specific types stay with the feature. |
| `supabase/migrations/` | Reviewed, ordered SQL schema and RLS changes. No migration exists yet. |

These are intended ownership boundaries, not a mandate to create empty directories. Create feature code alongside the first implemented use case.

## Intended request and data flow

When product operations are implemented, requests should follow this path:

1. A route renders a Server Component by default.
2. A form or route handler parses untrusted input with a feature-owned runtime schema.
3. The server obtains the authenticated user from a server-verified Supabase session; client-supplied user IDs are not identity proof.
4. A focused feature operation enforces the business rule and accesses Supabase using the user-scoped client where possible.
5. PostgreSQL RLS independently checks the row-level authorization boundary. Sensitive multi-row transitions should use a reviewed database function/transaction with explicit grants and policies.
6. The route returns only the minimum data needed by the UI.

The public environment validator and browser/server Supabase client factories are implemented in `src/lib/`. Authentication flows, session refresh, validation of product inputs, and RLS are not configured. Client factories validate settings only when called, so the starter route can render and build without credentials.

## Server and client boundaries

Keep credentials, session verification, authorization, validation, and privileged database work on the server. Mark browser-interactive components with `"use client"` only when state, effects, or browser APIs require them. Never serialize service-role keys or private profile, report, or conversation data into client bundles or props. Public profile data should be purpose-built and minimized rather than exposing database rows wholesale.

## Deferred features

The initial product architecture reserves feature ownership for registration, student profiles and photos, discovery, likes/passes, mutual matches, private messaging, unmatching, blocks, reports, and account deletion. Groups, events, cross-school discovery, school branding, and subscriptions are future product scope and are not part of the current scaffold. Cross-school discovery is off by default; the initial discovery policy is same-school only.
