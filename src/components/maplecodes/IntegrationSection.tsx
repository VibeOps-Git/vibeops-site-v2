import { MapPin, ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedContent from "../AnimatedContent";
import { ScrambleText } from "../ScrambleText";

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
      "Select your Word/Excel template",
      "AI generates report sections",
      "Download audit-ready document",
    ],
  },
];

export function IntegrationSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#d92f37]/3 to-[#0a0a0f]" />

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
            <span className="inline-block px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] text-[#d92f37] border border-[#d92f37]/30 bg-[#d92f37]/5 mb-4">
              The VibeOps Suite
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              <ScrambleText text="From Code Lookup to" />{" "}
              <span className="text-[#d92f37]">
                <ScrambleText text="Finished Report" />
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              MapleCodes finds the code context. Reportly turns it into a professional report.
              Together they eliminate the entire front-end research phase of every project.
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
                    className={`flex-1 relative p-6 md:p-8 rounded-2xl bg-[rgba(10,10,20,0.6)] border transition-all duration-300 ${
                      isMaple
                        ? "border-[#d92f37]/20 hover:border-[#d92f37]/40"
                        : "border-[#00ffcc]/20 hover:border-[#00ffcc]/40"
                    }`}
                  >
                    <div
                      className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent ${
                        isMaple ? "via-[#d92f37]/30" : "via-[#00ffcc]/30"
                      } to-transparent`}
                    />

                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border ${
                          isMaple
                            ? "bg-[#d92f37]/10 border-[#d92f37]/20"
                            : "bg-[#00ffcc]/10 border-[#00ffcc]/20"
                        }`}
                      >
                        <block.icon
                          className={`w-5 h-5 ${isMaple ? "text-[#d92f37]" : "text-[#00ffcc]"}`}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white">{block.step}</h3>
                    </div>

                    <ul className="space-y-3">
                      {block.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              isMaple
                                ? "bg-[#d92f37]/20 text-[#d92f37]"
                                : "bg-[#00ffcc]/20 text-[#00ffcc]"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <span className="text-sm text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow between blocks */}
                  {blockIndex < flow.length - 1 && (
                    <div className="flex items-center justify-center md:flex-col py-2 md:py-0 md:px-0">
                      <div className="flex items-center gap-1">
                        <div className="w-8 h-px md:w-px md:h-8 bg-gradient-to-r md:bg-gradient-to-b from-[#d92f37]/50 to-[#00ffcc]/50" />
                        <ArrowRight className="w-5 h-5 text-gray-500 rotate-90 md:rotate-0" />
                        <div className="w-8 h-px md:w-px md:h-8 bg-gradient-to-r md:bg-gradient-to-b from-[#d92f37]/50 to-[#00ffcc]/50" />
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
            <p className="text-gray-400 mb-4">
              Part of the{" "}
              <span className="text-white font-semibold">VibeOps</span>{" "}
              engineering automation suite.
            </p>
            <Link
              to="/reportly"
              className="inline-flex items-center gap-2 text-[#00ffcc] hover:underline text-sm"
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