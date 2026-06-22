import { Users, BarChart3, HardHat, TrendingUp } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

const reasons = [
  {
    icon: Users,
    title: "Built by engineers",
    description: "We are civil engineering students who lived this problem. We are fixing our own industry's paperwork.",
  },
  {
    icon: BarChart3,
    title: "Demand we can point to",
    description: "We validated the need the slow way, talking to 200+ firms across Canada before writing much code.",
  },
  {
    icon: HardHat,
    title: "Civil-specific, on purpose",
    description: "Reportly is shaped around structural and civil workflows.",
  },
  {
    icon: TrendingUp,
    title: "Real savings, fast",
    description: "A clear pain point and proven demand. Firms get hours back in the first week.",
  },
];

export function WhyVibeOpsSection() {
  return (
    <section className="relative py-24 px-4">
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
            <span className="inline-block text-xs uppercase tracking-[0.2em] text-primary mb-4">
              Why Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Why <span className="text-primary">VibeOps</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are not building software in the abstract. We are solving a problem we have done by hand.
            </p>
          </div>
        </AnimatedContent>

        {/* Reasons grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {reasons.map((reason, index) => (
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
              <div className="group relative p-8 rounded-2xl bg-card border border-border shadow-sm transition-colors duration-300 hover:border-primary/40 h-full">
                {/* Icon */}
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary border border-border mb-6">
                  <reason.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </AnimatedContent>
          ))}
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
            <p className="text-muted-foreground text-sm mb-4">
              Built by engineers, for engineers.
            </p>
            <div className="inline-flex items-center justify-center">
              {[
                { name: "Zander", image: "/team/zander-optimized.jpg" },
                { name: "Omair", image: "/team/omair-optimized.jpg" },
                { name: "Felix", image: "/team/felix-optimized.jpg" },
              ].map((member, i) => (
                <img
                  key={member.name}
                  src={member.image}
                  alt={member.name}
                  className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  style={{ marginLeft: i > 0 ? "-8px" : "0" }}
                />
              ))}
              <span className="ml-4 text-sm text-muted-foreground">
                The VibeOps Team
              </span>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
