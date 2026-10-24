<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Campus SaaS contribution rules

- Inspect relevant files and the applicable Next.js guides in `node_modules/next/dist/docs/` before editing.
- Make small, focused changes and follow the existing TypeScript and App Router conventions.
- Prefer Server Components; add client components only for browser interaction.
- Keep authorization and sensitive business logic on the server and in PostgreSQL RLS policies. A hidden UI control is never authorization.
- Validate all external input at runtime (use Zod when schemas are introduced).
- Never expose secrets or service-role keys to client code or `NEXT_PUBLIC_` variables. Never log secret values.
- Add tests for meaningful business logic and security-sensitive behavior when a test framework is configured.
- Run the available lint, type-check, test, and build commands relevant to the change. Report commands truthfully; do not claim a command passed unless it ran successfully.
- Do not silently change dependencies or unrelated files. Explain assumptions, limitations, and security work that remains unimplemented.
