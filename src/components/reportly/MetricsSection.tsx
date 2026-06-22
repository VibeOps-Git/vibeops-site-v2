import { useEffect, useRef, useState } from "react";
import { Clock, DollarSign, TrendingUp, Users } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "", decimals = 0 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const startTime = performance.now();
            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic for smooth deceleration
              const easeOut = 1 - Math.pow(1 - progress, 3);
              setCount(easeOut * end);
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  const displayValue = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString();

  return (
    <span ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

const metrics = [
  {
    icon: Clock,
    value: 700,
    prefix: "",
    suffix: "+",
    label: "Hours Lost",
    context: "Per engineer annually on documentation",
    range: "600-800 hrs",
  },
  {
    icon: DollarSign,
    value: 35,
    prefix: "$",
    suffix: "k",
    label: "Salary Wasted",
    context: "Per year for a $100k engineer",
    range: "~$35k annually",
  },
  {
    icon: TrendingUp,
    value: 35,
    prefix: "",
    suffix: "%",
    label: "Time Reclaimed",
    context: "Project time lost to reporting",
    range: "30-40% of projects",
  },
  {
    icon: Users,
    value: 200,
    prefix: "",
    suffix: "+",
    label: "Firms We Talked To",
    context: "Across Canada",
    range: "Validated demand",
  },
];

export function MetricsSection() {
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
          threshold={0.05}
        >
          <div className="text-center mb-16">
            <span className="inline-block text-xs uppercase tracking-[0.2em] text-primary mb-4">
              The Numbers
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              What manual reporting actually costs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We sat down with 100+ firms and engineers across Vancouver. Here is what they told us.
            </p>
          </div>
        </AnimatedContent>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((metric, index) => (
            <AnimatedContent
              key={metric.label}
              distance={60}
              direction="vertical"
              duration={0.8}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.05}
              delay={index * 0.1}
            >
              <div className="relative group h-full">
                {/* Card */}
                <div className="relative h-full p-6 lg:p-8 rounded-2xl bg-card border border-border shadow-sm transition-colors duration-300 group-hover:border-primary/40">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary border border-border mb-4">
                    <metric.icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Counter */}
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2 tabular-nums">
                    <AnimatedCounter
                      end={metric.value}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                      duration={2000 + index * 200}
                    />
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {metric.label}
                  </h3>

                  {/* Context */}
                  <p className="text-sm text-muted-foreground">
                    {metric.context}
                  </p>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>

        {/* Bottom tagline */}
        <AnimatedContent
          distance={30}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.05}
          delay={0.4}
        >
          <p className="text-center text-muted-foreground mt-12 text-lg">
            Engineers told us <span className="text-foreground font-semibold">30-40%</span> of project time
            disappears into documentation alone.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
