import { Copy, FileWarning, ShieldAlert, Clock } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

const problems = [
  {
    icon: Copy,
    title: "Inefficiencies",
    description: "Civil engineers spend hours copying between Word reports and Excel calculations. Every project, every time.",
  },
  {
    icon: FileWarning,
    title: "Formatting Nightmares",
    description: "Templates break when specs or formats change mid-project. Manual fixes compound across documents.",
  },
  {
    icon: ShieldAlert,
    title: "Compliance Risk",
    description: "Each report must be signed off and archived. Errors create compliance risk and rework cycles.",
  },
  {
    icon: Clock,
    title: "Time Sink",
    description: "30-40% of project time lost to documentation. That's engineering talent spent on formatting.",
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Visual */}
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
              {/* Frustrated engineer illustration placeholder */}
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent rounded-3xl blur-3xl" />

                {/* Main visual container */}
                <div className="relative h-full rounded-2xl bg-[rgba(10,10,20,0.6)] border border-white/5 backdrop-blur-sm p-8 flex flex-col items-center justify-center">
                  {/* Stack of papers visual */}
                  <div className="relative w-48 h-48">
                    {/* Paper layers */}
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="absolute w-32 h-40 bg-white/5 border border-white/10 rounded-lg"
                        style={{
                          transform: `rotate(${-15 + i * 10}deg) translateX(${i * 8}px)`,
                          zIndex: i,
                        }}
                      >
                        {/* Lines on paper */}
                        <div className="p-3 space-y-2">
                          <div className="h-2 w-full bg-white/10 rounded" />
                          <div className="h-2 w-3/4 bg-white/10 rounded" />
                          <div className="h-2 w-5/6 bg-white/10 rounded" />
                          <div className="h-2 w-2/3 bg-white/10 rounded" />
                        </div>
                      </div>
                    ))}

                    {/* Red X overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center">
                        <span className="text-red-400 text-4xl font-bold">✕</span>
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  <p className="mt-8 text-gray-400 text-center text-sm">
                    The manual reporting cycle
                  </p>
                </div>
              </div>
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
              <span className="inline-block px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] text-red-400 border border-red-500/30 bg-red-500/5 mb-4">
                The Problem
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Manual Reporting is{" "}
                <span className="text-red-400">Broken</span>
              </h2>
              <p className="text-gray-400 mb-8">
                Validated through meetings with 20+ firms and engineers across Vancouver and beyond.
              </p>
            </AnimatedContent>

            {/* Problem cards */}
            <div className="space-y-4">
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
                  <div className="group flex gap-4 p-4 rounded-xl bg-[rgba(10,10,20,0.4)] border border-white/5 hover:border-red-500/20 transition-all duration-300">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <problem.icon className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        {problem.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
