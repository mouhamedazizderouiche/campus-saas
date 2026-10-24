# Campus SaaS

Campus SaaS is a campus-focused social discovery platform. The initial MVP targets one university, with a data model intended to support additional universities later. This repository currently contains the Next.js starter application and architecture documentation; student accounts, discovery, matching, messaging, moderation, and Supabase integration are not implemented yet.

## Prerequisites

- Node.js 20.9 or newer (required by the installed Next.js version)
- npm

Supabase credentials are not required to render or run the starter application.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The existing route is `app/page.tsx`.

## Available scripts

- `npm run dev` — start Next.js in development mode
- `npm run build` — create a production build
- `npm run start` — serve a production build
- `npm run lint` — run ESLint

There are currently no type-check, unit-test, or end-to-end-test scripts. Vitest and Playwright are not configured.

## Architecture and security

- [Architecture](docs/architecture.md) describes module boundaries and request flow.
- [Database design](docs/database-design.md) describes the planned multi-school PostgreSQL schema.
- [Security](docs/security.md) documents the threat model and controls required before launch.
- [ADR 0001](docs/adr/0001-modular-monolith.md) records the architectural decision.

The database design is documentation only. No Supabase client, authentication flow, migration, RLS policy, or production integration is configured. Treat this scaffold as a starting point, not a deployed social platform.
