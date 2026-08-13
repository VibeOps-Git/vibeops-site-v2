import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the homepage", async ({ page }) => {
    await expect(page).toHaveTitle(/VibeOps/i);
  });

  test("should display the navigation", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
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
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByTestId("hero-device-stage").first()).toBeAttached();
  });

  test("should keep the homepage layout within the viewport on desktop and show the device stage", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });

    await expect(page.getByTestId("hero-device-stage").first()).toBeAttached();
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      const { documentElement, body } = document;
      return Math.max(documentElement.scrollWidth, body.scrollWidth) > window.innerWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });

  test("should keep the homepage layout within the viewport on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByTestId("hero-device-stage").first()).toBeAttached();

    const hasHorizontalOverflow = await page.evaluate(() => {
      const { documentElement, body } = document;
      return Math.max(documentElement.scrollWidth, body.scrollWidth) > window.innerWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });

  test("should keep navigation reachable and surface the core journey links", async ({ page }) => {
    await expect(page.getByRole("navigation")).toBeVisible();
    // The nav is the buyer journey: what we solve -> how we work -> our work.
    await expect(page.getByRole("link", { name: /how we work/i }).first()).toBeAttached();
    await expect(page.getByRole("link", { name: /our work/i }).first()).toBeAttached();
    await expect(page.getByRole("link", { name: /book a call/i }).first()).toBeAttached();
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
    await page.goto("/");
  });

  test("should display social media links in the footer", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const socialLinks = footer.getByTestId("social-links");
    await expect(socialLinks).toBeVisible();

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

// ─── New architecture: the six job pages plus the journey destinations ───────
// Added with the jobs-to-be-done restructure. Guards the two things most likely
// to regress as pages are edited: that every route still renders a single H1,
// and that nothing overflows the viewport on a phone.

const NEW_ROUTES = [
  "/what-we-solve",
  "/what-we-solve/secure-ai",
  "/what-we-solve/document-production",
  "/what-we-solve/systems-integration",
  "/what-we-solve/internal-tools",
  "/what-we-solve/institutional-knowledge",
  "/what-we-solve/ai-governance",
  "/how-we-work",
  "/security",
  "/proof",
];

test.describe("Repositioned architecture", () => {
  for (const route of NEW_ROUTES) {
    test(`${route} renders with one H1 and no horizontal overflow`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);

      const h1 = page.locator("h1");
      await expect(h1).toHaveCount(1);
      await expect(h1).toBeVisible();

      const overflows = await page.evaluate(() => {
        const { documentElement, body } = document;
        const maxScrollWidth = Math.max(
          documentElement.scrollWidth,
          body.scrollWidth
        );
        return maxScrollWidth > window.innerWidth;
      });
      expect(overflows).toBe(false);
    });
  }

  test("an unknown job slug redirects to the index rather than 404ing", async ({ page }) => {
    await page.goto("/what-we-solve/not-a-real-job");
    await expect(page).toHaveURL(/\/what-we-solve$/);
  });

  test("legacy paths still land somewhere useful", async ({ page }) => {
    await page.goto("/services");
    await expect(page).toHaveURL(/\/what-we-solve$/);

    await page.goto("/case-studies");
    await expect(page).toHaveURL(/\/proof$/);
  });
});
