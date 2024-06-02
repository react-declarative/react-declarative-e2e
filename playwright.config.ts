import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/spec",
  fullyParallel: false,
  retries: 3,
  workers: 1,
  reporter: [
    [
      "html",
      {
        open: "always",
        host: "127.0.0.1",
        port: 9223,
      },
    ],
  ],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "on",
    testIdAttribute: "data-testid",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:3000",
  },
});
