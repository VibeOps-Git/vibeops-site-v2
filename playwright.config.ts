import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  // Increased timeouts + CI graphics stability for Apple-caliber redesign heavy 3D/animation/video elements (E2E flakiness fix #99 + cycle 112 + cycle 115: addresses persistent timeout/attachment in homepage beforeEach + reportly-showcase 255vh pinned 3D/video/scroll after run 25633211634 failure)
  timeout: 600000,
  expect: {
    timeout: 300000,
  },
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    navigationTimeout: 600000,
    actionTimeout: 240000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Extra args for headless CI stability with WebGL/3D canvases (DeviceScene/LiquidGlass), videos, heavy animations/Aurora (prevents GPU fallback hangs + slow paint in Apple redesign)
        launchOptions: {
          args: [
            "--disable-gpu",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-web-security",
            "--allow-running-insecure-content",
            "--use-gl=swiftshader",
            "--enable-webgl",
            "--enable-accelerated-2d-canvas",
            "--disable-features=IsolateOrigins,site-per-process",
          ],
        },
      },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
    // Per design doc PR08 / PR4b success criteria
    {
      name: "iPhone 14",
      use: { ...devices["iPhone 14"] }, // 390×844
    },
    {
      name: "iPad Air",
      use: { ...devices["iPad Air"] }, // 820×1180 portrait
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
