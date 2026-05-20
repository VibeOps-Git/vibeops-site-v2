import {
  HeroSection,
  MetricsSection,
  ProblemSection,
  ShowcaseSection,
  FeaturesSection,
  IntegrationSection,
  CTASection,
} from "../components/maplecodes";
import { SEO } from "@/components/SEO";

/**
 * MapleCodes Landing Page
 *
 * Structure:
 * 1. HeroSection - Full viewport intro with typewriter search and CTA
 * 2. ProblemSection - Pain points of manual code research
 * 3. ShowcaseSection - Rich product mockup with real data
 * 4. MetricsSection - Building code landscape stats
 * 5. FeaturesSection - Key features and capabilities
 * 6. IntegrationSection - How MapleCodes connects with Reportly
 * 7. CTASection - Final CTA
 * 8. Footer - Handled by Layout component
 */
export default function MapleCodes() {
  return (
    <>
      <SEO
        title="Canadian Building Code Intelligence for AE Teams - MapleCodes"
        description="MapleCodes resolves the full federal, provincial, and municipal building code stack for any Canadian project address. Built for architects, engineers, and construction administrators."
        canonical="https://www.vibeops.ca/maplecodes"
      />
      <div className="relative">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Problem Statement */}
        <ProblemSection />

        {/* Section 3: Product Showcase - the real app */}
        <ShowcaseSection />

        {/* Section 4: Code Landscape Metrics */}
        <MetricsSection />

        {/* Section 5: Features */}
        <FeaturesSection />

        {/* Section 6: Suite Integration */}
        <IntegrationSection />

        {/* Section 7: Final CTA */}
        <CTASection />

        {/* Section 8: Footer provided by Layout */}
      </div>
    </>
  );
}