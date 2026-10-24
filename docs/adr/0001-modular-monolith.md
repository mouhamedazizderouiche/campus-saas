# ADR 0001: Use a modular monolith for the MVP

- **Status:** Accepted
- **Date:** 2026-10-24

## Context

The initial product serves one university and has a small team and an evolving domain. It needs clear ownership boundaries across profiles, discovery, matching, messaging, and moderation, while preserving transactional integrity and student privacy. There is no configured backend or database integration yet.

## Decision

Build one Next.js App Router application with feature-oriented modules and, when integrated, one PostgreSQL/Supabase database. Keep route components thin, feature rules cohesive, and authorization enforced on the server and by database RLS. Keep the existing root `app/` convention. Add feature code only when implementing behavior; this decision does not require placeholder directories.

## Alternatives considered

- **Single undivided application layer:** initially simple, but encourages route/UI code to own overlapping business rules and makes access boundaries hard to review.
- **Microservices or a separate backend framework:** introduces deployment, networking, and consistency costs before independent scaling or team ownership requires them.
- **Premature generic layers:** repositories, service buses, and complex state management would add indirection without current use cases.

## Consequences

One deployable unit supports atomic product changes and straightforward local development. Feature boundaries provide room to evolve without early infrastructure. The team must maintain those boundaries and explicitly test database authorization; a modular monolith does not make data safe by itself.

Revisit this choice if independent scaling needs, distinct team ownership, regulatory isolation, or operational constraints justify extracting a bounded capability. Preserve explicit data and authorization contracts if extraction becomes necessary.
