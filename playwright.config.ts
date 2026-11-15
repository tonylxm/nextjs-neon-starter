import { defineConfig, devices } from "@playwright/test";

// Own port (not the dev server's 3000) so parallel worktrees can each set E2E_PORT and DB_PORT.
const port = Number(process.env.E2E_PORT ?? 3100);
const dbPort = Number(process.env.DB_PORT ?? 5433);
const origin = `http://localhost:${port}`;

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: origin },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm build && pnpm start -p ${port}`,
    url: origin,
    // Never reuse a running server: it may be a dev server or another worktree's build.
    reuseExistingServer: false,
    env: {
      DATABASE_URL: `postgres://postgres:postgres@localhost:${dbPort}/app`,
      BETTER_AUTH_SECRET: "e2e-secret-e2e-secret-e2e-secret-00",
      BETTER_AUTH_URL: origin,
    },
  },
});
