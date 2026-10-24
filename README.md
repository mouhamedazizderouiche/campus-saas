# Campus SaaS

Campus SaaS is a campus-focused social discovery platform. The initial MVP targets one university, with a data model intended to support additional universities later. The repository provides a Next.js starter, architecture guidance, and Supabase client foundations. Authentication flows, database schema, authorization policies, and product features are not implemented.

## Prerequisites

- Node.js 22 or newer (the Supabase client requires 22; installed Next.js requires 20.9)
- npm

A real Supabase project is needed to initialize either Supabase client. Credentials are not needed to render the current starter page, run tests, or create a production build.

## Local development

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Before using a Supabase client, replace the URL and publishable-key placeholders in `.env.local` with values from your Supabase project. Never add secret or service-role keys to `NEXT_PUBLIC_` variables. `.env.local` and other real environment files are ignored by Git; `.env.example` is the committed template.

Open [http://localhost:3000](http://localhost:3000). The existing route is `app/page.tsx`.

## Available scripts

- `npm run dev` — start Next.js in development mode
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript without emitting files
- `npm test` — run Vitest once
- `npm run build` — create a production build
- `npm run start` — serve a production build

## Supabase foundation

`src/lib/supabase/client.ts` creates a browser client; `src/lib/supabase/server.ts` creates a request-scoped server client using Next.js cookies. Both validate the public URL and publishable key only when the factory is called. This setup does not implement sign-in, session verification, authorization, database security, or RLS. Session refresh through a Next.js Proxy is deferred until authentication flows are introduced.

## Architecture and security

- [Architecture](docs/architecture.md) describes module boundaries and request flow.
- [Database design](docs/database-design.md) describes the planned multi-school PostgreSQL schema.
- [Security](docs/security.md) documents the threat model and controls required before launch.
- [ADR 0001](docs/adr/0001-modular-monolith.md) records the architectural decision.

The database design is documentation only. No database migration, RLS policy, or production integration is configured. Do not use this scaffold with real student data.
