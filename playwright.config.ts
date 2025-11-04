import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: 2,
  timeout: 30 * 1000,
  reporter: [['html'], ['line']],
  use: {
    baseURL: 'https://workflow-energy.vercel.app',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'WebKit', use: { ...devices['Desktop Safari'] } },
  ],
});
