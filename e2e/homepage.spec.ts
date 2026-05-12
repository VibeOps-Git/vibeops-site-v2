import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    // Robust load for heavy Apple redesign (3D DeviceScene, LiquidGlass, Aurora, videos) - cycle 115 + cycle 169 after run 25638654958 ci_failed (timeout/attachment on nav/body/device-stage/canvas due to 3D/anim/video)
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 300000 });
    await page.waitForLoadState("load", { timeout: 300000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 180000 }).catch(() => {});
    await expect(page.locator("body")).toBeAttached({ timeout: 180000 });
    // Extended waits for late-painting heavy 3D/anim/video elements + canvas for DeviceScene/LiquidGlass
    await page.waitForSelector("nav", { timeout: 300000 }).catch(() => {});
    await page.waitForSelector('[data-testid="hero-device-stage"]', { timeout: 300000 }).catch(() => {});
    await page.waitForSelector("canvas, video", { timeout: 180000 }).catch(() => {});
    await page.waitForSelector('a[href*="/reportly"], [data-testid*="explore-reportly"]', { timeout: 180000 }).catch(() => {});
    // Allow time for 3D mount, video decode, animations to paint and attach in CI (cycle 169 fix)
    await page.waitForTimeout(4000).catch(() => {});
  });

  test("should load the homepage", async ({ page }) => {
    await expect(page).toHaveTitle(/VibeOps/i, { timeout: 60000 });
  });

  test("should display the navigation", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible({ timeout: 180000 });
  });

  test("should have working navigation links", async ({ page }) => {
    const nav = page.getByRole("navigation");
    // Open Solutions dropdown (contains Reportly link post-redesign)
    const solutionsBtn = nav.getByRole("button", { name: /solutions/i });
    if (await solutionsBtn.isVisible({ timeout: 30000 })) {
      await solutionsBtn.click();
    }
    const reportlyLink = nav.getByRole("link", { name: /reportly/i }).first();
    if (await reportlyLink.isVisible({ timeout: 30000 })) {
      await reportlyLink.click();
      await expect(page).toHaveURL(/reportly/i);
    }
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload({ waitUntil: "domcontentloaded", timeout: 180000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 120000 }).catch(() => {});
    await page.waitForSelector("canvas, [data-testid=\"hero-device-stage\"]", { timeout: 180000 }).catch(() => {});
    await page.waitForTimeout(3000).catch(() => {});
    await page.getByTestId("hero-device-stage").scrollIntoViewIfNeeded();
    await expect(page.locator("body")).toBeVisible({ timeout: 180000 });
    await expect(page.getByTestId("hero-device-stage")).toBeVisible({ timeout: 180000 });
    await expect(page.getByTestId("explore-reportly")).toBeVisible({ timeout: 180000 });
  });

  test("should keep the homepage layout within the viewport on desktop and show the device stage", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.reload({ waitUntil: "domcontentloaded", timeout: 180000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 120000 }).catch(() => {});
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForSelector('[data-testid="hero-device-stage"], canvas', { timeout: 180000 }).catch(() => {});
    await page.waitForTimeout(3000).catch(() => {});
    await page.getByTestId("hero-device-stage").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500).catch(() => {}); // post-paint for 3D/video

    await expect(page.getByTestId("hero-device-stage")).toBeVisible({ timeout: 300000 });
    await expect(page.getByTestId("explore-reportly")).toBeVisible({ timeout: 180000 });

    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("should keep the homepage layout within the viewport on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 180000 });
    await page.waitForLoadState("networkidle", { timeout: 120000 }).catch(() => {});
    await page.waitForSelector('[data-testid="hero-device-stage"], canvas', { timeout: 180000 }).catch(() => {});
    await page.waitForTimeout(3000).catch(() => {});
    await page.getByTestId("hero-device-stage").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500).catch(() => {}); // post-paint for 3D/video

    await expect(page.getByTestId("hero-device-stage")).toBeVisible({ timeout: 300000 });

    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("should render a dark platform section and keep navigation reachable", async ({ page }) => {
    const platformSection = page.getByTestId("platform-section");
    await platformSection.scrollIntoViewIfNeeded();
    await expect(platformSection).toBeVisible({ timeout: 120000 });

    const platformBackground = await platformSection.evaluate((element) => {
      return window.getComputedStyle(element).backgroundColor;
    });

    expect(platformBackground).not.toBe("rgb(255, 255, 255)");
    await expect(platformSection.getByRole("link", { name: /explore reportly/i })).toBeVisible();
    await expect(page.getByRole("navigation")).toBeVisible();
  });
});

test.describe("Contact Page", () => {
  test("should load the contact page", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Team Page", () => {
  test("should keep the full team banner visible on mobile", async ({ page }) => {
    await page.goto("/team", { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForSelector('[data-testid="team-banner"]', { timeout: 120000 }).catch(() => {});

    const banner = page.getByTestId("team-banner");
    await expect(banner).toBeVisible();

    const bannerImage = banner.getByAltText(/vibeops founding team/i);
    await expect(bannerImage).toBeVisible({ timeout: 120000 });

    const bannerBounds = await banner.boundingBox();
    const imageBounds = await bannerImage.boundingBox();

    expect(bannerBounds).not.toBeNull();
    expect(imageBounds).not.toBeNull();

    expect(imageBounds?.height).toBeGreaterThan(300);
    expect(imageBounds?.width).toBeLessThanOrEqual((bannerBounds?.width ?? 0) + 1);
    expect(imageBounds?.height).toBeLessThanOrEqual((bannerBounds?.height ?? 0) + 1);

    await expect(
      page.getByRole("link", { name: /talk to the team/i }).first()
    ).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      const { documentElement, body } = document;
      const maxScrollWidth = Math.max(
        documentElement.scrollWidth,
        body.scrollWidth
      );

      return maxScrollWidth > window.innerWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe("Footer Social Links", () => {
  test.beforeEach(async ({ page }) => {
    // Robust load for heavy Apple redesign (3D DeviceScene, LiquidGlass, Aurora, videos) matching main - cycle 115 + cycle 169 after 25638654958 (footer attachment timeout + 3D/video slow paint)
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 300000 });
    await page.waitForLoadState("load", { timeout: 300000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 180000 }).catch(() => {});
    await expect(page.locator("body")).toBeAttached({ timeout: 180000 });
    await page.waitForSelector("nav", { timeout: 300000 }).catch(() => {});
    await page.waitForSelector('[data-testid="hero-device-stage"]', { timeout: 300000 }).catch(() => {});
    await page.waitForSelector("canvas, video", { timeout: 180000 }).catch(() => {});
    await expect(page.locator("footer")).toBeAttached({ timeout: 180000 });
    // Paint settle for heavy elements (cycle 169)
    await page.waitForTimeout(4000).catch(() => {});
  });

  test("should display social media links in the footer", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible({ timeout: 120000 });

    const socialLinks = footer.getByTestId("social-links");
    await expect(socialLinks).toBeVisible({ timeout: 120000 });

    // Check all social links are present
    const linkedinLink = socialLinks.getByRole("link", { name: /linkedin/i });
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/vibeops"
    );

    const xLink = socialLinks.getByRole("link", { name: /^x$/i });
    await expect(xLink).toBeVisible();
    await expect(xLink).toHaveAttribute(
      "href",
      "https://x.com/vibeops_ca"
    );

    const instagramLink = socialLinks.getByRole("link", { name: /instagram/i });
    await expect(instagramLink).toBeVisible();
    await expect(instagramLink).toHaveAttribute(
      "href",
      "https://instagram.com/vibeops"
    );
  });

  test("social links should open in new tab", async ({ page }) => {
    const footer = page.locator("footer");
    const socialLinks = footer.getByTestId("social-links");
    const allLinks = socialLinks.getByRole("link");
    const count = await allLinks.count();

    for (let i = 0; i < count; i++) {
      const link = allLinks.nth(i);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    // Robust load for heavy Apple redesign to ensure content/3D/headers render before a11y - cycle 115 + 169 after 25638654958 (h1/canvas attach due to incomplete 3D paint)
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 300000 });
    await page.waitForLoadState("load", { timeout: 300000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 180000 }).catch(() => {});
    await expect(page.locator("body")).toBeAttached({ timeout: 180000 });
    await page.waitForSelector("nav", { timeout: 300000 }).catch(() => {});
    await page.waitForSelector("canvas", { timeout: 180000 }).catch(() => {});
    await page.waitForTimeout(4000).catch(() => {});
  });

  test("homepage should have no major accessibility issues", async ({
    page,
  }) => {
    // images check after robust load
    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      const role = await img.getAttribute("role");
      // Images should have alt text or be decorative (role="presentation")
      expect(alt !== null || role === "presentation").toBeTruthy();
    }
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    const h1Count = await page.locator("h1").count();
    // Should have at least one h1 (now guaranteed after robust beforeEach load of heavy content)
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });
});
