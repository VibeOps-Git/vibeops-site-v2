import { describe, it, expect } from "vitest";
import { render, screen, within } from "@/test/test-utils";
import Layout from "./Layout";

describe("Layout", () => {
  describe("Footer Social Links", () => {
    it("renders all social media links", () => {
      render(<Layout>Test Content</Layout>);

      const socialLinksContainer = screen.getByTestId("social-links");
      expect(socialLinksContainer).toBeInTheDocument();

      // Check LinkedIn link
      const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute(
        "href",
        "https://www.linkedin.com/company/vibeops"
      );
      expect(linkedinLink).toHaveAttribute("target", "_blank");
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");

      // Check X link
      const xLink = screen.getByRole("link", { name: /^x$/i });
      expect(xLink).toBeInTheDocument();
      expect(xLink).toHaveAttribute(
        "href",
        "https://x.com/vibeops_ca"
      );
      expect(xLink).toHaveAttribute("target", "_blank");
      expect(xLink).toHaveAttribute("rel", "noopener noreferrer");

      // Check Instagram link
      const instagramLink = screen.getByRole("link", { name: /instagram/i });
      expect(instagramLink).toBeInTheDocument();
      expect(instagramLink).toHaveAttribute(
        "href",
        "https://instagram.com/vibeops"
      );
      expect(instagramLink).toHaveAttribute("target", "_blank");
      expect(instagramLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("social links have correct styling classes", () => {
      render(<Layout>Test Content</Layout>);

      const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
      expect(linkedinLink).toHaveClass("text-muted-foreground");
      expect(linkedinLink).toHaveClass("hover:text-primary");
      expect(linkedinLink).toHaveClass("transition-colors");
    });
  });

  describe("Footer Content", () => {
    it("renders footer navigation links in footer", () => {
      render(<Layout>Test Content</Layout>);

      const footer = screen.getByRole("contentinfo");
      const withinFooter = within(footer);

      // Footer surfaces these links (some appear in both a nav column and the
      // legal row), so assert at least one of each rather than a unique match.
      expect(withinFooter.getAllByRole("link", { name: /blog/i }).length).toBeGreaterThan(0);
      expect(withinFooter.getAllByRole("link", { name: /contact/i }).length).toBeGreaterThan(0);
      expect(withinFooter.getAllByRole("link", { name: /privacy/i }).length).toBeGreaterThan(0);
      expect(withinFooter.getAllByRole("link", { name: /terms/i }).length).toBeGreaterThan(0);
    });

    it("renders copyright notice", () => {
      render(<Layout>Test Content</Layout>);

      const currentYear = new Date().getFullYear();
      expect(
        screen.getByText(new RegExp(`© ${currentYear} VibeOps Technologies Inc.`))
      ).toBeInTheDocument();
    });
  });
});
