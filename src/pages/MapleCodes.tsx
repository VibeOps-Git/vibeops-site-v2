import {
  HeroSection,
  MetricsSection,
  ProblemSection,
  HowItWorksSection,
  FeaturesSection,
  IntegrationSection,
  CTASection,
} from "../components/maplecodes";
import { SEO } from "@/components/SEO";

/**
 * MapleCodes Landing Page
 *
 * Structure:
 * 1. HeroSection - Full viewport intro with title and CTA
 * 2. MetricsSection - Building code landscape stats
 * 3. ProblemSection - Pain points of manual code research
 * 4. HowItWorksSection - Step-by-step flow from address to code context
 * 5. FeaturesSection - Key features and capabilities
 * 6. IntegrationSection - How MapleCodes connects with Reportly
 * 7. CTASection - Final CTA
 * 8. Footer - Handled by Layout component
 */
export default function MapleCodes() {
  return (
    <>
      <SEO
        title="MapleCodes"
        description="Canadian Building Code Intelligence. Enter a project address and instantly get the full jurisdiction stack, applicable codes, bylaws, and referenced standards."
        canonical="https://www.vibeops.ca/maplecodes"
      />
      <div className="relative">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Code Landscape Metrics */}
        <MetricsSection />

        {/* Section 3: Problem Statement */}
        <ProblemSection />

        {/* Section 4: How It Works */}
        <HowItWorksSection />

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