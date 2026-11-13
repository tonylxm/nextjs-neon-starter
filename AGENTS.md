<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Database

- Roles: the Neon owner runs migrations (CI secret `DATABASE_URL`); `app_worker` is what the Worker connects as (Hyperdrive), with data access only. Local dev and e2e use the `postgres` superuser, so they don't prove grants or RLS.
- `drizzle/` holds schema changes only, written as expand and contract. Roles, grants, extensions and large or destructive backfills are owner-run by hand (`db/app-worker.sql`), never in a migration.
- RLS tables: `.enableRLS()` and policies `to: pgRole("app_worker").existing()` (without `.existing()`, drizzle-kit emits `CREATE ROLE`). Add `FORCE ROW LEVEL SECURITY` and a separate `ci_migrator` role when tenant tables arrive (see the project-starter tech-stack).
