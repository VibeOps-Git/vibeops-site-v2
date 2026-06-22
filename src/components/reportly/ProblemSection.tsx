import { Copy, FileWarning, ShieldAlert, Clock } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

const problems = [
  {
    icon: Copy,
    title: "Copy-Paste Assembly",
    stat: "6+ hrs/week",
    description: "Copying inspection data from Excel into Word, embedding photos that break formatting, manually assembling O&M manuals from six different spreadsheets. Every project, every team member.",
    color: "red",
  },
  {
    icon: FileWarning,
    title: "Inconsistent Formatting",
    stat: "40% rework",
    description: "Reports formatted differently by every engineer. Templates drift across projects. Embedded photos shift layouts. Continuity is lost across revisions. QA catches it too late.",
    color: "orange",
  },
  {
    icon: ShieldAlert,
    title: "Wrong Code References",
    stat: "Compliance risk",
    description: "Citing the wrong code edition, missing municipal bylaws, or referencing outdated standards. In compliance-critical work, one bad reference in an inspection report or EA can invalidate the entire submission.",
    color: "yellow",
  },
  {
    icon: Clock,
    title: "Engineering Time Lost",
    stat: "35% of time",
    description: "Your structural, geotech, and environmental engineers spend a third of their week on formatting and document assembly instead of the technical work that drives revenue.",
    color: "red",
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-24">
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
                {/* Main container - fake spreadsheet/doc chaos */}
                <div className="relative h-full rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
                  {/* Top bar mimicking app */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-muted-foreground font-mono">Report_Final_v23_FINAL_edited(2).docx</span>
                    </div>
                  </div>

                  {/* Chaotic document content */}
                  <div className="p-6 space-y-4">
                    {/* Error highlights */}
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-24 bg-red-500/30 rounded" />
                      <div className="h-4 w-16 bg-muted rounded" />
                      <div className="h-4 w-20 bg-yellow-500/30 rounded" />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-4 w-12 bg-red-500/30 rounded" />
                    </div>

                    {/* Fake table with errors */}
                    <div className="mt-4 border border-border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 gap-px bg-border">
                        {[...Array(16)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-8 ${
                              i === 5 || i === 11
                                ? "bg-red-500/20 border border-red-500/40"
                                : i === 7
                                  ? "bg-yellow-500/20 border border-yellow-500/40"
                                  : "bg-card"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* More content lines */}
                    <div className="space-y-2 mt-4">
                      <div className="flex gap-2">
                        <div className="h-3 w-full bg-muted rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-3 w-3/4 bg-muted rounded" />
                        <div className="h-3 w-12 bg-orange-500/30 rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-3 w-1/2 bg-muted rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Overlay with error count */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 backdrop-blur-sm">
                    <span className="text-xs text-red-400 font-medium">12 errors found</span>
                  </div>
                </div>

                {/* Floating error badges */}
                <div className="absolute -top-2 -right-2 px-2 py-1 rounded bg-red-500 text-white text-xs font-bold">
                  ERROR
                </div>
                <div className="absolute top-1/3 -left-3 px-2 py-1 rounded bg-yellow-500 text-black text-xs font-bold">
                  OUTDATED
                </div>
              </div>

              {/* Caption */}
              <p className="text-center text-muted-foreground text-sm mt-6">
                Look familiar? You are not the only one.
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
                <span className="inline-block text-xs uppercase tracking-[0.2em] text-red-500 mb-4">
                  The Problem
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Manual reporting is broken
                </h2>
                <p className="text-muted-foreground mb-8">
                  We heard the same story in <span className="text-foreground font-semibold">200+ discovery calls</span>, from Stantec, AECOM, Jacobs, and Tetra Tech down to mid-size civil, geotechnical, and environmental shops across Canada.
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
                  <div className="group relative flex gap-4 p-4 rounded-xl bg-card border border-border shadow-sm hover:border-red-500/30 transition-colors duration-300">
                    {/* Icon */}
                    <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <problem.icon className="w-6 h-6 text-red-500" />
                    </div>

                    {/* Content */}
                    <div className="relative flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-foreground font-semibold">
                          {problem.title}
                        </h3>
                        <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 whitespace-nowrap">
                          {problem.stat}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
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
              delay={0.4}
            >
              <div className="mt-6 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <p className="text-sm text-foreground">
                  <span className="text-2xl font-bold text-foreground">$35,000</span>
                  <span className="text-muted-foreground ml-2">per engineer, per year, spent on formatting and document assembly</span>
                </p>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </section>
  );
}
