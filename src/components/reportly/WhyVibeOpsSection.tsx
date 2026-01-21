import { Users, BarChart3, HardHat, TrendingUp } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

const reasons = [
  {
    icon: Users,
    title: "Built by Engineers",
    description: "Our team has lived the pain. Civil engineering students solving their own industry's problems.",
    color: "blue",
  },
  {
    icon: BarChart3,
    title: "Proven Market Demand",
    description: "Validated need through direct market engagement with 20+ firms across Vancouver.",
    color: "green",
  },
  {
    icon: HardHat,
    title: "Civil Engineering Specific",
    description: "Not a generic reporting tool. Purpose-built for structural and civil workflows.",
    color: "orange",
  },
  {
    icon: TrendingUp,
    title: "High ROI Potential",
    description: "Clear pain point, proven demand, and strong technical direction. Real savings, fast.",
    color: "purple",
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    glow: "group-hover:border-blue-500/30",
  },
  green: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "group-hover:border-emerald-500/30",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
    glow: "group-hover:border-orange-500/30",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    glow: "group-hover:border-purple-500/30",
  },
};

export function WhyVibeOpsSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#00ffcc]/3 to-[#0a0a0f]" />

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
              Why Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Why <span className="text-[#00ffcc]">VibeOps</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're not just building software. We're solving a problem we've experienced firsthand.
            </p>
          </div>
        </AnimatedContent>

        {/* Reasons grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {reasons.map((reason, index) => {
            const colors = colorClasses[reason.color as keyof typeof colorClasses];
            return (
              <AnimatedContent
                key={reason.title}
                distance={50}
                direction="vertical"
                duration={0.7}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                threshold={0.2}
                delay={index * 0.1}
              >
                <div className={`group relative p-8 rounded-2xl bg-[rgba(10,10,20,0.6)] border border-white/5 backdrop-blur-sm transition-all duration-300 ${colors.glow} h-full`}>
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${colors.bg} ${colors.border} border mb-6`}>
                    <reason.icon className={`w-7 h-7 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </AnimatedContent>
            );
          })}
        </div>

        {/* Team photo hint */}
        <AnimatedContent
          distance={30}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.5}
        >
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Built by engineers, for engineers.
            </p>
            <div className="inline-flex items-center justify-center">
              {[
                { name: "Zander", image: "/team/zander-optimized.jpg" },
                { name: "Hrudai", image: "/team/hrudai-optimized.jpg" },
                { name: "Eric", image: "/team/eric-optimized.jpg" },
                { name: "Felix", image: "/team/felix-optimized.jpg" },
                { name: "Gabriel", image: "/team/gabriel-optimized.jpg" },
              ].map((member, i) => (
                <img
                  key={member.name}
                  src={member.image}
                  alt={member.name}
                  className="w-10 h-10 rounded-full border-2 border-[#0a0a0f] object-cover"
                  style={{ marginLeft: i > 0 ? "-8px" : "0" }}
                />
              ))}
              <span className="ml-4 text-sm text-gray-400">
                The VibeOps Team
              </span>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
