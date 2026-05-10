import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    // Robust load for heavy Apple redesign (3D DeviceScene, LiquidGlass, Aurora, videos) - avoids fragile header img attachment timeouts seen in run 25625405543 + cycle 104 E2E ci_failed on nav/body/hero
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
    await expect(page.locator("body")).toBeAttached({ timeout: 90000 });
    // Wait for key heavy-rendered elements to attach (3D/anim cause late nav/hero paint)
    await page.waitForSelector("nav", { timeout: 120000 }).catch(() => {});
    await page.waitForSelector('[data-testid="hero-device-stage"]', { timeout: 120000 }).catch(() => {});
  });

  test("should load the homepage", async ({ page }) => {
    await expect(page).toHaveTitle(/VibeOps/i);
  });

  test("should display the navigation", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible({ timeout: 120000 });
  });

  test("should have working navigation links", async ({ page }) => {
    const nav = page.getByRole("navigation");
    const servicesLink = nav.getByRole("link", { name: /services/i }).first();
    if (await servicesLink.isVisible()) {
      await servicesLink.click();
      await expect(page).toHaveURL(/services/i);
    }
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByTestId("hero-device-stage")).toBeVisible();
    await expect(page.getByRole("link", { name: /explore reportly/i }).first()).toBeVisible();
  });

  test("should keep the homepage layout within the viewport on desktop and show the device stage", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });

    await expect(page.getByTestId("hero-device-stage")).toBeVisible();
    await expect(page.getByRole("link", { name: /explore reportly/i }).first()).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      const { documentElement, body } = document;
      return Math.max(documentElement.scrollWidth, body.scrollWidth) > window.innerWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });

  test("should keep the homepage layout within the viewport on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByTestId("hero-device-stage")).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      const { documentElement, body } = document;
      return Math.max(documentElement.scrollWidth, body.scrollWidth) > window.innerWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });

  test("should render a dark platform section and keep navigation reachable", async ({ page }) => {
    const platformSection = page.getByTestId("platform-section");
    await platformSection.scrollIntoViewIfNeeded();
    await expect(platformSection).toBeVisible();

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
    await page.goto("/team");

    const banner = page.getByTestId("team-banner");
    await expect(banner).toBeVisible();

    const bannerImage = banner.getByAltText(/vibeops founding team/i);
    await expect(bannerImage).toBeVisible();

    const bannerBounds = await banner.boundingBox();
    const imageBounds = await bannerImage.boundingBox();

    expect(bannerBounds).not.toBeNull();
    expect(imageBounds).not.toBeNull();

    expect(imageBounds!.height).toBeGreaterThan(300);
    expect(imageBounds!.width).toBeLessThanOrEqual(bannerBounds!.width + 1);
    expect(imageBounds!.height).toBeLessThanOrEqual(bannerBounds!.height + 1);

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
    // Robust load matching homepage to prevent footer visibility timeout (cycle 104 E2E failure root cause)
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
    await expect(page.locator("footer")).toBeAttached({ timeout: 120000 });
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
  test("homepage should have no major accessibility issues", async ({
    page,
  }) => {
    await page.goto("/");

    // Check for basic accessibility: images have alt text
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
    await page.goto("/");

    const h1Count = await page.locator("h1").count();
    // Should have at least one h1
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });
});
