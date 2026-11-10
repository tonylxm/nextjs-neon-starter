# nextjs-neon-starter

Phase 0 walking skeleton for personal projects: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Zod + Postgres on Neon with Drizzle, and Better Auth, deployed on Cloudflare Workers through the OpenNext adapter. It passes lint, format, typecheck, unit tests, a Playwright phone-width smoke test and a build.

## Create a project from it

```bash
gh repo create <app> --template tonylxm/nextjs-neon-starter --private --clone
```

Then:

1. Rename: set `name` in `package.json`, and replace this README.
2. `pnpm install` (also installs the Husky hook).
3. `docker compose up -d` for a local Postgres, then copy `.env.example` to `.env.local` and set `BETTER_AUTH_SECRET` (`openssl rand -base64 32`).
4. `pnpm db:migrate`, then `pnpm dev` and open http://localhost:3000.
5. In the GitHub repo settings, turn on secret scanning and push protection (templates don't copy settings).
6. Create a Neon project (one per app). Run `pnpm db:migrate` with its connection string as `DATABASE_URL` (change `sslmode=require` to `sslmode=verify-full`, or `pg` prints a deprecation warning) before the first deploy and before any deploy that adds a migration.
7. `pnpm exec wrangler login`, then create a Hyperdrive config from Neon's **direct** (non-pooler) connection string, since Hyperdrive does the pooling: `pnpm exec wrangler hyperdrive create <app> --connection-string="<url>" --caching-disabled`. Put its `id` in `wrangler.jsonc` (replacing the zeros) and set `name` there. Caching stays off because Hyperdrive doesn't clear cached reads after a write, which would serve stale sessions.
8. `pnpm run deploy`. Add the secrets once with `pnpm exec wrangler secret put <NAME>` for `BETTER_AUTH_SECRET` (a new one, not the local value) and `BETTER_AUTH_URL` (the production URL), then deploy again. The Worker gets the database from the Hyperdrive binding, so it needs no `DATABASE_URL` secret. For deploys on push, connect the repo in the Cloudflare dashboard (Workers Builds) with `pnpm run deploy` as the deploy command. Roll back with `pnpm exec wrangler rollback`.

**Team mode** (branch + PR, CI blocks merge): remove the hook with `pnpm remove husky lint-staged && rm -rf .husky` (keep the gitleaks CI job), delete the `prepare` and `lint-staged` entries from `package.json`, and protect `main` so it requires the CI check.

## Scripts

| Script                                           | Does                                                                                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `dev` / `build` / `start`                        | Next.js on Node, for development and the e2e tests                                                                    |
| `preview` / `deploy`                             | Build for Workers with OpenNext, then run it locally in `workerd` (reads `.dev.vars`) or deploy it                    |
| `lint` / `format` / `format:check` / `typecheck` | ESLint, Prettier, `next typegen && tsc --noEmit` (route types live in gitignored `.next/`)                            |
| `test`                                           | Vitest (unit and component)                                                                                           |
| `test:e2e`                                       | Playwright: smoke tests plus a real sign-up and sign-in. Needs the local Postgres up and migrated, and port 3000 free |
| `db:generate` / `db:migrate`                     | Drizzle: create a migration from `src/db/schema.ts`, apply committed migrations to `DATABASE_URL`                     |

Run `pnpm exec playwright install chromium` once before the e2e tests.

## What's included

- Better Auth with the Drizzle adapter, deny by default: `src/proxy.ts` sends visitors without a session cookie to `/login`, except for the public paths in `src/lib/auth/routes.ts`. That check is optimistic only, so pages that show user data verify the session again (see `/account`).
  - `src/lib/auth.ts` is the server instance. `src/app/api/auth/[...all]/route.ts` mounts its API.
  - `/login` signs in or creates an account with email and password. There is no email verification or password reset yet: both need an email sender (`sendVerificationEmail`, `sendResetPassword`), so add Resend when the app needs them.
  - There is no browser auth client, since the forms use server actions. Add `createAuthClient` from `better-auth/react` when a client component needs it.
- Drizzle on `node-postgres` (`pg`). On Workers it connects through the `HYPERDRIVE` binding (`src/db/url.ts`); on Node (`dev`, `start`, tests) it uses `DATABASE_URL`, so tests run on plain Postgres. `pnpm preview` connects the binding to the docker-compose database through `localConnectionString` in `wrangler.jsonc`. Workers can't reuse a socket across requests, so `getDb()` and `getAuth()` build a fresh pool and auth instance per request (React `cache`), and the pool closes each connection after one use. Never hold a client at module level. `src/db/auth-schema.ts` is generated by `pnpm dlx auth@latest generate --config src/lib/auth.cli.ts --output src/db/auth-schema.ts`. After a Better Auth upgrade or plugin change, re-run it, then `pnpm db:generate` and `pnpm db:migrate`.
- Env validation in `src/lib/env.ts`, checked at server start by `src/instrumentation.ts`. A missing var fails with a clear message.
- CI (`.github/workflows/ci.yml`) and Dependabot, copied from the project-starter skill. The build step sets dummy auth env vars, since Better Auth logs errors at build time without them.
- A pre-commit hook that runs gitleaks on staged files (install it once with `brew install gitleaks`), then lint-staged (auto-fix only, no tests). CI has a matching `secrets` job. Both assume a private repo on a personal account. For a public repo, turn on GitHub secret scanning and push protection instead, and delete the `secrets` job and the two gitleaks lines in `.husky/pre-commit`.
- `AGENTS.md` holds only the Next.js agent rules block. project-starter's agents-md step fills in the rest.

## Known issues

Verified on Node against Docker Postgres (e2e), in `pnpm preview` (local `workerd`), and on a real Cloudflare deploy through Hyperdrive to Neon. With Hyperdrive, warm database requests from Sydney take about 0.25 s (about 0.5 to 1 s without it); a request on a fresh Worker isolate still takes up to 1 s. `pg-cloudflare` 1.4.1 still logs `unhandledRejection: This socket has been closed` on every database request in `workerd`, locally and in production; requests succeed.
