import { Copy, FileWarning, ShieldAlert, Clock } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

const problems = [
  {
    icon: Copy,
    title: "Copy-Paste Hell",
    stat: "6+ hrs/week",
    description: "Engineers spend hours copying data between Word reports and Excel calculations. Every project, every time.",
    color: "red",
  },
  {
    icon: FileWarning,
    title: "Template Chaos",
    stat: "40% rework",
    description: "Templates break when specs change mid-project. One error cascades across dozens of documents.",
    color: "orange",
  },
  {
    icon: ShieldAlert,
    title: "Compliance Risk",
    stat: "$50k+ fines",
    description: "Missing signatures, outdated formats, lost archives. Each error is a potential audit failure.",
    color: "yellow",
  },
  {
    icon: Clock,
    title: "Talent Wasted",
    stat: "35% of time",
    description: "Your best engineers spend a third of their time formatting instead of engineering.",
    color: "red",
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-24">
      {/* Background elements - in overflow-hidden wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-red-950/5 to-[#0a0a0f]" />
        {/* Animated gradient orb */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Document chaos visualization */}
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
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/10 to-transparent rounded-3xl blur-2xl" />

                {/* Main container - fake spreadsheet/doc chaos */}
                <div className="relative h-full rounded-2xl bg-[rgba(10,10,20,0.8)] border border-red-500/20 backdrop-blur-sm overflow-hidden">
                  {/* Top bar mimicking app */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-gray-500 font-mono">Report_Final_v23_FINAL_edited(2).docx</span>
                    </div>
                  </div>

                  {/* Chaotic document content */}
                  <div className="p-6 space-y-4">
                    {/* Error highlights */}
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-24 bg-red-500/30 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-white/10 rounded" />
                      <div className="h-4 w-20 bg-yellow-500/30 rounded" />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-4 w-32 bg-white/10 rounded" />
                      <div className="h-4 w-12 bg-red-500/30 rounded animate-pulse" style={{ animationDelay: "0.5s" }} />
                    </div>

                    {/* Fake table with errors */}
                    <div className="mt-4 border border-white/10 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 gap-px bg-white/10">
                        {[...Array(16)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-8 ${
                              i === 5 || i === 11
                                ? "bg-red-500/20 border border-red-500/40"
                                : i === 7
                                  ? "bg-yellow-500/20 border border-yellow-500/40"
                                  : "bg-[rgba(10,10,20,0.6)]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* More content lines */}
                    <div className="space-y-2 mt-4">
                      <div className="flex gap-2">
                        <div className="h-3 w-full bg-white/5 rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-3 w-3/4 bg-white/5 rounded" />
                        <div className="h-3 w-12 bg-orange-500/30 rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-3 w-1/2 bg-white/5 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Overlay with error count */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 backdrop-blur-sm">
                    <span className="text-xs text-red-400 font-medium">12 errors found</span>
                  </div>
                </div>

                {/* Floating error badges */}
                <div className="absolute -top-2 -right-2 px-2 py-1 rounded bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-500/30 animate-bounce">
                  ERROR
                </div>
                <div className="absolute top-1/3 -left-3 px-2 py-1 rounded bg-yellow-500 text-black text-xs font-bold shadow-lg shadow-yellow-500/30" style={{ animationDelay: "0.3s" }}>
                  OUTDATED
                </div>
              </div>

              {/* Caption */}
              <p className="text-center text-gray-500 text-sm mt-6">
                Sound familiar? You're not alone.
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
                  Manual Reporting is{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Broken</span>
                </h2>
                <p className="text-gray-400 mb-8">
                  Validated through meetings with <span className="text-white font-semibold">20+ firms</span> and engineers across Vancouver and beyond.
                </p>
              </div>
            </AnimatedContent>

            {/* Problem cards with stats */}
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
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                    {/* Icon */}
                    <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/20 flex items-center justify-center">
                      <problem.icon className="w-6 h-6 text-red-400" />
                    </div>

                    {/* Content */}
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

            {/* Bottom stat callout */}
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
                  <span className="text-2xl font-bold text-white">$35,000</span>
                  <span className="text-gray-400 ml-2">wasted per engineer annually on report formatting</span>
                </p>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </section>
  );
}
