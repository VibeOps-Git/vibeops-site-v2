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
      { threshold: 0.3 }
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
    value: 100,
    prefix: "",
    suffix: "+",
    label: "Firms Interviewed",
    context: "Across Vancouver and beyond",
    range: "Validated demand",
  },
];

export function MetricsSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#00ffcc]/5 to-[#0a0a0f]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                           linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

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
              The Impact
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              The Cost of Manual Reporting
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We met with 100+ firms and engineers across Vancouver.
              The numbers speak for themselves.
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
              threshold={0.2}
              delay={index * 0.1}
            >
              <div className="relative group">
                {/* Card */}
                <div className="relative p-6 lg:p-8 rounded-2xl bg-[rgba(10,10,20,0.6)] border border-white/5 backdrop-blur-sm transition-all duration-300 group-hover:border-[#00ffcc]/20 group-hover:bg-[rgba(10,10,20,0.8)]">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20 mb-4">
                    <metric.icon className="w-6 h-6 text-[#00ffcc]" />
                  </div>

                  {/* Counter */}
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tabular-nums">
                    <AnimatedCounter
                      end={metric.value}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                      duration={2000 + index * 200}
                    />
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {metric.label}
                  </h3>

                  {/* Context */}
                  <p className="text-sm text-gray-500">
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
          threshold={0.2}
          delay={0.5}
        >
          <p className="text-center text-gray-400 mt-12 text-lg">
            Engineers estimate <span className="text-white font-semibold">30-40%</span> of project time
            is lost to documentation alone.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
