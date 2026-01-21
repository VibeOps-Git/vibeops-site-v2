import {
  HeroSection,
  MetricsSection,
  ProblemSection,
  ShowcaseSection,
  FeaturesSection,
  WhyVibeOpsSection,
  CTASection,
} from "../components/reportly";

/**
 * Reportly Landing Page
 *
 * Structure:
 * 1. HeroSection - Full viewport intro with title and waitlist signup
 * 2. MetricsSection - Big bold animated stats showing the impact
 * 3. ProblemSection - Pain points of manual reporting
 * 4. ShowcaseSection - Apple-style scroll animation with iPad demo
 * 5. FeaturesSection - Competitive advantages and features
 * 6. WhyVibeOpsSection - Team differentiators
 * 7. CTASection - Final waitlist signup
 * 8. Footer - Handled by Layout component
 */
export default function Reportly() {
  return (
    <div className="relative">
      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: Impact Metrics */}
      <MetricsSection />

      {/* Section 3: Problem Statement */}
      <ProblemSection />

      {/* Section 4: iPad Showcase with sticky scroll */}
      <ShowcaseSection />

      {/* Section 5: Features & Competitive Advantages */}
      <FeaturesSection />

      {/* Section 6: Why VibeOps */}
      <WhyVibeOpsSection />

      {/* Section 7: Final CTA */}
      <CTASection />

      {/* Section 8: Footer provided by Layout */}
    </div>
  );
}
