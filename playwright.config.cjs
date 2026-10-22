const { defineConfig, devices } = require("@playwright/test");

const baseURL = "http://localhost:3080";

module.exports = defineConfig({
  testDir: "./tests/e2e",
  // site-links.spec.js uses node:test, not Playwright, but its filename
  // matches Playwright's default *.spec.js glob. Left unignored, a bare
  // `npx playwright test` imports it, which executes its node:test suite
  // as an import side effect outside Playwright's runner (spawning its own
  // server) alongside the real Playwright tests. Run it via `node --test`
  // (see `npm run test:e2e:links`) instead.
  testIgnore: ["**/site-links.spec.js"],
  fullyParallel: false, // Disable parallel execution to avoid overwhelming the API
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Use single worker to avoid API rate limits
  reporter: "html",
  timeout: 60000, // Increase test timeout to 60 seconds for AI responses
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    actionTimeout: 10000, // 10 seconds for actions
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    // CI already builds for this origin. Local runs rebuild first so a prior
    // production <base> cannot send same-origin scripts to the production site.
    command: process.env.CI
      ? "npx --no-install http-server _site -p 3080"
      : "npm run build && npm run api:dev",
    url: baseURL,
    // Reusing an unrelated server could silently test stale production output.
    reuseExistingServer: false,
    timeout: 180 * 1000,
    env: {
      // Set PORT for API server in local dev mode
      PORT: "3080",
      SITE_URL: baseURL,
      // Only needed for local dev server (not for static file serving)
      ...(!process.env.CI && {
        CI: process.env.CI || "",
      }),
    },
  },
});
