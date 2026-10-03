import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:3000" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm build && pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL: "postgres://postgres:postgres@localhost:5432/app",
      BETTER_AUTH_SECRET: "e2e-secret-e2e-secret-e2e-secret-00",
      BETTER_AUTH_URL: "http://localhost:3000",
    },
  },
});
