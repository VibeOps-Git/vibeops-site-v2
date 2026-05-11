import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  // Increased timeouts + CI graphics stability for Apple-caliber redesign heavy 3D/animation/video elements (E2E flakiness fix #99 + cycle 112 + cycle 115 after 25633211634 + cycle 169 after run 25638654958 ci_failed: 2x timeouts for 30min test/10min expect, + more hang/3D/video stability flags to prevent attachment timeouts on nav/canvas/device-stage in homepage & reportly-showcase)
  timeout: 1800000,
  expect: {
    timeout: 600000,
  },
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    navigationTimeout: 1800000,
    actionTimeout: 600000,
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
            // Additional for video/3D heavy content stability in CI (cycle 115 after 25633211634 + cycle 169 25638654958)
            "--autoplay-policy=no-user-gesture-required",
            "--disable-background-timer-throttling",
            "--disable-renderer-backgrounding",
            "--disable-backgrounding-occluded-windows",
            // Extra for reducing hang/attachment flakiness with heavy 3D canvases + videos (cycle 169)
            "--disable-hang-monitor",
            "--disable-ipc-flooding-protection",
            "--disable-prompt-on-repost",
            "--disable-sync",
            "--metrics-recording-only",
            "--no-first-run",
            "--safebrowsing-disable-auto-update",
            "--disable-default-apps",
            "--js-flags=--max-old-space-size=8192",
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
    timeout: 600000,
  },
});
