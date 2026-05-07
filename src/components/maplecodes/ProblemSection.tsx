import { Search, Clock, ShieldAlert, FileWarning } from "lucide-react";
import AnimatedContent from "../AnimatedContent";
import { ScrambleText } from "../ScrambleText";

const problems = [
  {
    icon: Search,
    title: "Manual Code Hunting",
    stat: "4+ hrs/project",
    description:
      "Engineers spend hours searching government websites, PDFs, and municipal portals to identify which codes apply to a project location.",
  },
  {
    icon: FileWarning,
    title: "Jurisdiction Confusion",
    stat: "3 levels deep",
    description:
      "Federal, provincial, and municipal codes stack and overlap. Missing one level means incomplete compliance — and potential liability.",
  },
  {
    icon: ShieldAlert,
    title: "Outdated References",
    stat: "High risk",
    description:
      "Codes update on different cycles across jurisdictions. Referencing a superseded edition in a report is a compliance failure waiting to happen.",
  },
  {
    icon: Clock,
    title: "Repeated Work",
    stat: "Every project",
    description:
      "Even experienced engineers re-research codes for each new project because jurisdiction boundaries and amendments change constantly.",
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-24">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-red-950/5 to-[#0a0a0f]" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Code chaos visualization */}
          <AnimatedContent
            distance={60}
            direction="horizontal"
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
          >
            <div className="relative">
              <div className="relative aspect-[4/3] max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/10 to-transparent rounded-3xl blur-2xl" />

                <div className="relative h-full rounded-2xl bg-[rgba(10,10,20,0.8)] border border-red-500/20 backdrop-blur-sm overflow-hidden">
                  {/* Top bar mimicking a browser */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-gray-500 font-mono">
                        gov.bc.ca/building-codes → 404
                      </span>
                    </div>
                  </div>

                  {/* Scattered code documents */}
                  <div className="p-6 space-y-3">
                    {/* Fake jurisdiction tabs */}
                    <div className="flex gap-2">
                      <div className="px-3 py-1.5 text-[10px] rounded bg-red-500/20 border border-red-500/30 text-red-400">
                        Federal?
                      </div>
                      <div className="px-3 py-1.5 text-[10px] rounded bg-yellow-500/20 border border-yellow-500/30 text-yellow-400">
                        Provincial?
                      </div>
                      <div className="px-3 py-1.5 text-[10px] rounded bg-orange-500/20 border border-orange-500/30 text-orange-400">
                        Municipal?
                      </div>
                    </div>

                    {/* Fake search results */}
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-6 bg-red-500/30 rounded animate-pulse" />
                        <div className="h-4 flex-1 bg-white/10 rounded" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-6 bg-white/10 rounded" />
                        <div className="h-4 flex-1 bg-white/5 rounded" />
                        <div className="h-4 w-16 bg-yellow-500/30 rounded" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-6 bg-white/10 rounded" />
                        <div className="h-4 flex-1 bg-white/5 rounded" />
                      </div>
                    </div>

                    {/* Fake PDF icons scattered */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {["NBCC 2020", "BC Code", "Bylaw #4321", "CSA A23.3", "ASTM E119", "???"].map(
                        (label, i) => (
                          <div
                            key={i}
                            className={`p-2 text-center rounded-lg text-[9px] font-mono ${
                              i === 5
                                ? "bg-red-500/20 border border-red-500/40 text-red-400"
                                : i === 0
                                  ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                                  : "bg-white/5 border border-white/10 text-gray-500"
                            }`}
                          >
                            {label}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 backdrop-blur-sm">
                    <span className="text-xs text-red-400 font-medium">
                      Which codes apply?
                    </span>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-2 -right-2 px-2 py-1 rounded bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-500/30 animate-bounce">
                  OUTDATED
                </div>
                <div className="absolute top-1/3 -left-3 px-2 py-1 rounded bg-yellow-500 text-black text-xs font-bold shadow-lg shadow-yellow-500/30">
                  WHICH EDITION?
                </div>
              </div>

              <p className="text-center text-gray-500 text-sm mt-6">
                Every project starts with this headache.
              </p>
            </div>
          </AnimatedContent>

          {/* Right: Problem cards */}
          <div>
            <AnimatedContent
              distance={40}
              direction="vertical"
              duration={0.8}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.2}
            >
              <div className="text-left">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] text-red-400 border border-red-500/30 bg-red-500/5 mb-4">
                  The Problem
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  <ScrambleText text="Code Research is" />{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                    <ScrambleText text="a Maze" />
                  </span>
                </h2>
                <p className="text-gray-400 mb-8">
                  Canada has <span className="text-white font-semibold">three layers</span> of building regulations
                  that vary by location, project type, and construction phase.
                </p>
              </div>
            </AnimatedContent>

            <div className="space-y-3">
              {problems.map((problem, index) => (
                <AnimatedContent
                  key={problem.title}
                  distance={30}
                  direction="horizontal"
                  duration={0.6}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.2}
                  delay={0.1 + index * 0.1}
                >
                  <div className="group relative flex gap-4 p-4 rounded-xl bg-gradient-to-r from-[rgba(10,10,20,0.6)] to-[rgba(10,10,20,0.4)] border border-white/5 hover:border-red-500/30 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                    <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/20 flex items-center justify-center">
                      <problem.icon className="w-6 h-6 text-red-400" />
                    </div>

                    <div className="relative flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">
                          {problem.title}
                        </h3>
                        <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 whitespace-nowrap">
                          {problem.stat}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </AnimatedContent>
              ))}
            </div>

            <AnimatedContent
              distance={20}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.2}
              delay={0.6}
            >
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-500/10 via-orange-500/5 to-transparent border border-red-500/20">
                <p className="text-sm text-gray-300">
                  <span className="text-2xl font-bold text-white">4+ hours</span>
                  <span className="text-gray-400 ml-2">
                    spent per project just identifying applicable codes and standards
                  </span>
                </p>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </section>
  );
}