import { MapPin, ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedContent from "../AnimatedContent";

const flow = [
  {
    step: "MapleCodes",
    icon: MapPin,
    color: "amber",
    items: [
      "Enter project address",
      "GIS detects jurisdictions",
      "View codes, bylaws, standards",
      "AI generates governing brief",
    ],
  },
  {
    step: "Reportly",
    icon: FileText,
    color: "cyan",
    items: [
      "Pinecone RAG verifies references",
      "Select your Word template",
      "AI generates report sections",
      "Download audit-ready document",
    ],
  },
];

export function IntegrationSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-background">
      <div className="container mx-auto max-w-5xl relative z-10">
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
              The VibeOps Suite
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              From code lookup to{" "}
              <span className="text-[#d92f37]">
                finished report
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              MapleCodes finds the code context. Reportly turns it into a report.
              Put them together and the whole research phase at the start of a project is just gone.
            </p>
          </div>
        </AnimatedContent>

        {/* Flow diagram */}
        <AnimatedContent
          distance={40}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.2}
        >
          <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-4">
            {flow.map((block, blockIndex) => {
              const isMaple = block.color === "amber";
              return (
                <div key={block.step} className="flex-1 flex flex-col md:flex-row items-stretch gap-4">
                  <div
                    className={`flex-1 relative p-6 md:p-8 rounded-2xl bg-card border shadow-sm transition-colors duration-300 ${
                      isMaple
                        ? "border-[#d92f37]/20 hover:border-[#d92f37]/40"
                        : "border-primary/30 hover:border-primary/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border ${
                          isMaple
                            ? "bg-[#d92f37]/10 border-[#d92f37]/20"
                            : "bg-primary/10 border-primary/20"
                        }`}
                      >
                        <block.icon
                          className={`w-5 h-5 ${isMaple ? "text-[#d92f37]" : "text-primary"}`}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{block.step}</h3>
                    </div>

                    <ul className="space-y-3">
                      {block.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              isMaple
                                ? "bg-[#d92f37]/20 text-[#d92f37]"
                                : "bg-primary/20 text-primary"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow between blocks */}
                  {blockIndex < flow.length - 1 && (
                    <div className="flex items-center justify-center md:flex-col py-2 md:py-0 md:px-0">
                      <div className="flex items-center gap-1">
                        <div className="w-8 h-px md:w-px md:h-8 bg-gradient-to-r md:bg-gradient-to-b from-[#d92f37]/50 to-primary/50" />
                        <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90 md:rotate-0" />
                        <div className="w-8 h-px md:w-px md:h-8 bg-gradient-to-r md:bg-gradient-to-b from-[#d92f37]/50 to-primary/50" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </AnimatedContent>

        {/* Bottom tagline */}
        <AnimatedContent
          distance={20}
          direction="vertical"
          duration={0.6}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.4}
        >
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Part of the{" "}
              <span className="text-foreground font-semibold">VibeOps</span>{" "}
              engineering automation suite.
            </p>
            <Link
              to="/reportly"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
            >
              Learn more about Reportly
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}