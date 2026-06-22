import { useEffect, useRef, useState } from "react";
import { Layers } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }: CounterProps) {
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

  return (
    <span ref={ref}>
      {prefix}{Math.round(count).toLocaleString()}{suffix}
    </span>
  );
}

const metrics = [
  {
    icon: Layers,
    value: 3,
    suffix: "",
    label: "Jurisdiction Levels",
    context: "Federal, provincial, and municipal, layered automatically",
  },
];

export function MetricsSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-background">
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
            <span className="inline-block text-xs uppercase tracking-[0.2em] text-[#d92f37] mb-4">
              The Scale
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Canada's building code landscape
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              It's big and it's scattered across three levels of government.
              MapleCodes pulls it into one place.
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
                <div className="relative p-6 lg:p-8 rounded-2xl bg-card border border-border shadow-sm transition-colors duration-300 group-hover:border-[#d92f37]/30">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#d92f37]/10 border border-[#d92f37]/20 mb-4">
                    <metric.icon className="w-6 h-6 text-[#d92f37]" />
                  </div>

                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2 tabular-nums">
                    <AnimatedCounter
                      end={metric.value}
                      suffix={metric.suffix}
                      duration={2000 + index * 200}
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {metric.label}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {metric.context}
                  </p>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>

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
          <p className="text-center text-muted-foreground mt-12 text-lg">
            Every project sits under <span className="text-foreground font-semibold">several overlapping jurisdictions</span>.
            MapleCodes sorts out the whole stack in one shot.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}