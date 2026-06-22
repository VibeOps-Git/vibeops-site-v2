import { Check, MapPin, Zap, Globe, Brain, ShieldCheck, Link2 } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

const features = [
  {
    icon: MapPin,
    title: "GIS Boundary Matching",
    description:
      "Ray-casting point-in-polygon detection against real Canadian jurisdiction polygons. No guessing. Exact municipal, provincial, and federal zones resolved instantly.",
  },
  {
    icon: Zap,
    title: "Sub-Second Lookups",
    description:
      "Codes, standards, and bylaws indexed locally. Results appear before you finish reading the address.",
  },
  {
    icon: Globe,
    title: "Full Jurisdiction Stack",
    description:
      "Federal (NBCC, NFC), provincial (BC Building Code, OBC, etc.), and municipal bylaws. All three layers resolved and shown together.",
  },
  {
    icon: Brain,
    title: "AI Governing Briefs",
    description:
      "Azure OpenAI generates a plain-language brief explaining the code hierarchy, overlap points, and compliance questions worth resolving first.",
  },
  {
    icon: ShieldCheck,
    title: "Edition & Status Tracking",
    description:
      "Every code shows its enforceable edition year and adoption status. No more accidentally referencing a superseded code.",
  },
  {
    icon: Link2,
    title: "One-Click Reportly Handoff",
    description:
      "Click \"Create Report\" to trigger the full Pinecone RAG pipeline. References land in Reportly pre-approved. No re-entering anything.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section header */}
        <AnimatedContent
          distance={40}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="text-center mb-16">
            <span className="inline-block text-xs uppercase tracking-[0.2em] text-[#d92f37] mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Built for{" "}
              <span className="text-[#d92f37]">
                Canadian construction
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built specifically for how Canadian building codes stack up across
              federal, provincial, and municipal levels.
            </p>
          </div>
        </AnimatedContent>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <AnimatedContent
              key={feature.title}
              distance={40}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.2}
              delay={Math.min(index * 0.08, 0.4)}
            >
              <div className="group relative p-6 rounded-2xl bg-card border border-border shadow-sm transition-colors duration-300 hover:border-[#d92f37]/30 h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#d92f37]/10 border border-[#d92f37]/20 mb-4">
                  <feature.icon className="w-6 h-6 text-[#d92f37]" />
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>

                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 rounded-full bg-[#d92f37]/10 border border-[#d92f37]/30 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[#d92f37]" />
                  </div>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>

        {/* Bottom comparison */}
        <AnimatedContent
          distance={30}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.4}
        >
          <div className="text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
              <span className="text-sm text-muted-foreground">Replaces:</span>
              {[
                "Manual PDF searches",
                "Government portals",
                "Spreadsheet trackers",
                "Guesswork",
              ].map((name) => (
                <span
                  key={name}
                  className="text-sm text-muted-foreground"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}