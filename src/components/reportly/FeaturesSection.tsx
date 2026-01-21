import { Check, Cog, Brain, FileText, Calculator, Wand2, HardHat } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

const features = [
  {
    icon: Cog,
    title: "Eng-Specific Automation",
    description: "Built for civil engineering workflows, not generic documents.",
    highlight: true,
  },
  {
    icon: Brain,
    title: "AI Engineering Reports",
    description: "Intelligent document parsing that understands engineering context.",
    highlight: true,
  },
  {
    icon: FileText,
    title: "Uses Your Templates",
    description: "Upload your existing Word and Excel templates. We work with them.",
    highlight: true,
  },
  {
    icon: Calculator,
    title: "Cost Sheet Automation",
    description: "Automatically populate calculations and cost estimates.",
    highlight: true,
  },
  {
    icon: Wand2,
    title: "No-Code Setup",
    description: "No technical skills required. Just upload templates and go.",
    highlight: true,
  },
  {
    icon: HardHat,
    title: "Structural & Civil Focus",
    description: "Purpose-built for structural and civil engineering firms.",
    highlight: true,
  },
];

const competitors = [
  { name: "Domo", checks: [false, true, false, true, false, false] },
  { name: "Jaspersoft", checks: [false, false, false, false, false, false] },
  { name: "Autodesk CC", checks: [true, false, false, true, false, true] },
  { name: "Power BI", checks: [false, true, false, true, true, false] },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f] to-[#0a0a0f]" />

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
            <span className="inline-block px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] text-[#00ffcc] border border-[#00ffcc]/30 bg-[#00ffcc]/5 mb-4">
              Why Reportly
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              The Only Solution Built for{" "}
              <span className="text-[#00ffcc]">Civil Engineering</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're not a generic reporting tool. Reportly is purpose-built for civil and structural engineering workflows.
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
              delay={index * 0.1}
            >
              <div className="group relative p-6 rounded-2xl bg-[rgba(10,10,20,0.6)] border border-white/5 backdrop-blur-sm transition-all duration-300 hover:border-[#00ffcc]/20 hover:bg-[rgba(10,10,20,0.8)] h-full">
                {/* Top edge glow */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#00ffcc]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20 mb-4">
                  <feature.icon className="w-6 h-6 text-[#00ffcc]" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {feature.description}
                </p>

                {/* Check badge */}
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/30 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[#00ffcc]" />
                  </div>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>

        {/* Comparison table hint */}
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
            <div className="inline-flex flex-wrap items-center justify-center gap-4 p-4 rounded-2xl bg-[rgba(10,10,20,0.4)] border border-white/5">
              <span className="text-sm text-gray-500">Compared to:</span>
              {["Domo", "Jaspersoft", "Autodesk CC", "Power BI"].map((name) => (
                <span
                  key={name}
                  className="text-sm text-gray-400 px-3 py-1 rounded-full bg-white/5"
                >
                  {name}
                </span>
              ))}
              <span className="text-sm text-[#00ffcc]">
                Only Reportly checks all boxes ✓
              </span>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
