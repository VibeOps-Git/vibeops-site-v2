import { HeroSection, ShowcaseSection } from "../components/reportly";

/**
 * Reportly Landing Page
 *
 * Structure:
 * 1. HeroSection - Full viewport intro with title and scroll prompt
 * 2. ShowcaseSection - Sticky scroll section where iPad hops between corners
 * 3. Footer - Handled by Layout component
 */
export default function Reportly() {
  return (
    <div className="relative">
      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: iPad Showcase with sticky scroll */}
      <ShowcaseSection />

      {/* Section 3: Footer provided by Layout */}
    </div>
  );
}
