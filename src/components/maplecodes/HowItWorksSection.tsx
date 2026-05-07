import { MapPin, Layers, Brain, FileText } from "lucide-react";
import AnimatedContent from "../AnimatedContent";
import { ScrambleText } from "../ScrambleText";

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Enter a Project Address",
    description:
      "Type any Canadian address. MapleCodes geocodes it and detects the exact municipal, provincial, and federal jurisdictions using GIS boundary matching.",
  },
  {
    number: "02",
    icon: Layers,
    title: "See the Jurisdiction Stack",
    description:
      "Instantly see which jurisdictions govern the site — from the National Building Code of Canada down to local municipal bylaws and referenced standards.",
  },
  {
    number: "03",
    icon: Brain,
    title: "Get an AI Governing Brief",
    description:
      "An AI-generated summary of the key compliance considerations for the project location, helping you understand what matters before you start.",
  },
  {
    number: "04",
    icon: FileText,
    title: "Create a Report with Codes Attached",
    description:
      "Click \"Create Report\" to hand off the verified code context directly into Reportly — no re-entering project data, no manual code lookups.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#d92f37]/3 to-[#0a0a0f]" />

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
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              <ScrambleText text="From Address to" />{" "}
              <span className="text-[#d92f37]">
                <ScrambleText text="Code Context" />
              </span>{" "}
              <ScrambleText text="in Seconds" />
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Four steps. No manual searching. No government portals.
              Just enter an address and go.
            </p>
          </div>
        </AnimatedContent>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[23px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-[#d92f37]/0 via-[#d92f37]/20 to-[#d92f37]/0 hidden md:block" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              return (
                <AnimatedContent
                  key={step.number}
                  distance={50}
                  direction="horizontal"
                  reverse={!isLeft}
                  duration={0.7}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.2}
                  delay={index * 0.1}
                >
                  <div
                    className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 ${
                      isLeft ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content card */}
                    <div className="flex-1 group">
                      <div className="relative p-6 md:p-8 rounded-2xl bg-[rgba(10,10,20,0.6)] border border-white/5 backdrop-blur-sm transition-all duration-300 group-hover:border-[#d92f37]/20 group-hover:bg-[rgba(10,10,20,0.8)]">
                        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#d92f37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#d92f37]/10 border border-[#d92f37]/20">
                            <step.icon className="w-6 h-6 text-[#d92f37]" />
                          </div>
                          <span className="text-4xl font-bold text-[#d92f37]/20">
                            {step.number}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-3">
                          {step.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Center dot (desktop) */}
                    <div className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-[#d92f37]/10 border-2 border-[#d92f37]/30 items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-[#d92f37]" />
                    </div>

                    {/* Spacer for alternation */}
                    <div className="flex-1 hidden md:block" />
                  </div>
                </AnimatedContent>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}