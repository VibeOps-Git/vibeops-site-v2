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

      // Check Twitter link
      const twitterLink = screen.getByRole("link", { name: /twitter/i });
      expect(twitterLink).toBeInTheDocument();
      expect(twitterLink).toHaveAttribute(
        "href",
        "https://twitter.com/vibeops"
      );
      expect(twitterLink).toHaveAttribute("target", "_blank");
      expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");

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
      expect(linkedinLink).toHaveClass("text-gray-400");
      expect(linkedinLink).toHaveClass("hover:text-[#00ffcc]");
      expect(linkedinLink).toHaveClass("transition-colors");
    });
  });

  describe("Footer Content", () => {
    it("renders footer navigation links in footer", () => {
      render(<Layout>Test Content</Layout>);

      const footer = screen.getByRole("contentinfo");
      const withinFooter = within(footer);

      expect(withinFooter.getByRole("link", { name: /blog/i })).toBeInTheDocument();
      expect(withinFooter.getByRole("link", { name: /contact/i })).toBeInTheDocument();
      expect(withinFooter.getByRole("link", { name: /privacy/i })).toBeInTheDocument();
      expect(withinFooter.getByRole("link", { name: /terms/i })).toBeInTheDocument();
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
