import { Check, MapPin, Zap, Globe, Brain, ShieldCheck, Link2 } from "lucide-react";
import AnimatedContent from "../AnimatedContent";
import { ScrambleText } from "../ScrambleText";

const features = [
  {
    icon: MapPin,
    title: "GIS Jurisdiction Detection",
    description:
      "Point-in-polygon boundary matching pinpoints exactly which jurisdictions govern any Canadian address.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "No waiting for research agents. Get the full code stack in under a second from our indexed corpus.",
  },
  {
    icon: Globe,
    title: "Pan-Canadian Coverage",
    description:
      "Federal, provincial, and municipal codes from coast to coast — continuously updated as regulations change.",
  },
  {
    icon: Brain,
    title: "AI Governing Briefs",
    description:
      "LLM-generated summaries explain why each code applies and what compliance questions to resolve first.",
  },
  {
    icon: ShieldCheck,
    title: "Edition Tracking",
    description:
      "Know the current enforceable edition vs. the latest published edition for every code and standard.",
  },
  {
    icon: Link2,
    title: "Reportly Integration",
    description:
      "One click sends verified code references into Reportly to create a report with context already attached.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4">
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
            <span className="inline-block px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] text-[#d92f37] border border-[#d92f37]/30 bg-[#d92f37]/5 mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              <ScrambleText text="Built for" />{" "}
              <span className="text-[#d92f37]">
                <ScrambleText text="Canadian Construction" />
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              MapleCodes is purpose-built for the Canadian regulatory environment.
              Not a generic code lookup — a complete building code intelligence layer.
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
              <div className="group relative p-6 rounded-2xl bg-[rgba(10,10,20,0.6)] border border-white/5 backdrop-blur-sm transition-all duration-300 hover:border-[#d92f37]/20 hover:bg-[rgba(10,10,20,0.8)] h-full">
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#d92f37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#d92f37]/10 border border-[#d92f37]/20 mb-4">
                  <feature.icon className="w-6 h-6 text-[#d92f37]" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>

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
            <div className="inline-flex flex-wrap items-center justify-center gap-4 p-4 rounded-2xl bg-[rgba(10,10,20,0.4)] border border-white/5">
              <span className="text-sm text-gray-500">Replaces:</span>
              {[
                "Manual PDF searches",
                "Government portals",
                "Spreadsheet trackers",
                "Guesswork",
              ].map((name) => (
                <span
                  key={name}
                  className="text-sm text-gray-400 px-3 py-1 rounded-full bg-white/5"
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