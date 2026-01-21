import { FileText, Wrench, BarChart3, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedContent from "../components/AnimatedContent";
import { SectionWithHeader, SectionDivider } from "../components/ui/Section";
import { VibeCard, VibeCardHeader, VibeCardContent, VibeCardTitle, VibeCardDescription } from "../components/ui/VibeCard";
import { GallerySection3D } from "../components/3d/sections/GallerySection3D";
import { VibeLinkButton } from "@/components/ui/VibeButton";

export default function Services() {
  const services = [
    {
      icon: FileText,
      title: "Report Automation",
      subtitle: "Reportly Engine",
      description:
        "Transform hours of manual formatting into minutes of audit-ready, on-brand reporting using your existing Word and Excel templates.",
      features: [
        "Word & Excel template automation",
        "Charts, tables & summaries from live data",
        "Automated inspection photo appendices",
        "Brand-consistent, QA-ready output",
      ],
    },
    {
      icon: Wrench,
      title: "Workflow Automation",
      subtitle: "Custom Builds",
      description:
        "We build software that removes repetitive documentation and data-handling from engineering, construction, and inspection workflows.",
      features: [
        "Field data ingestion & cleaning",
        "Inspection checklist automation",
        "Construction & site documentation flows",
        "White-labeled internal tooling",
      ],
    },
    {
      icon: BarChart3,
      title: "Engineering Dashboards",
      subtitle: "Data Visualization",
      description:
        "Turn raw technical data into actionable insight — without hiring a full-time developer or maintaining internal software.",
      features: [
        "Instrumentation dashboards (inclinometers, piezometers, VWs)",
        "Construction & inspection data tracking",
        "Map-based outage & condition views",
        "Live, shareable dashboards for field ops",
      ],
    },
    {
      icon: Layers,
      title: "Internal Tools",
      subtitle: "Lightweight Apps",
      description:
        "Rapid engineering tools and calculators that mirror your existing workflows, without the overhead of a full custom platform.",
      features: [
        "Cost estimators & calculators",
        "Tracking systems for teams & assets",
        "Pilot tools to validate ROI fast",
        "Secure deployment & long-term support",
      ],
    },
  ];

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-20 px-4">
        <AnimatedContent
          distance={80}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="container mx-auto text-center max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">
              Services
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Choose Your Automation
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Four types of engineering automation. Pick the one that solves your biggest bottleneck first—then expand from there.
            </p>
          </div>
        </AnimatedContent>
      </section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* Service Cards - Liquid Glass */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <GallerySection3D items={services} />
        </div>
      </section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={0.7}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.3}
          >
            <VibeCard variant="gradient" hover={false} className="text-center p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                We'll help you pick the right automation for your team and build a working prototype in weeks, not months.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <VibeLinkButton href="/contact" variant="primary" size="lg">
                  Book a Vibe Check
                </VibeLinkButton>
                <VibeLinkButton href="/case-studies" variant="outline" size="lg">
                  View Case Studies
                </VibeLinkButton>
              </div>
            </VibeCard>
          </AnimatedContent>
        </div>
      </section>
    </div>
  );
}
