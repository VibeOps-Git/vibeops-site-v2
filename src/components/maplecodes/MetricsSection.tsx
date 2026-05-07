import { useEffect, useRef, useState } from "react";
import { BookOpen, Scale, Globe, Layers } from "lucide-react";
import AnimatedContent from "../AnimatedContent";
import { ScrambleText } from "../ScrambleText";

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
    icon: BookOpen,
    value: 85,
    suffix: "+",
    label: "Building Codes",
    context: "Federal, provincial, and municipal codes tracked",
  },
  {
    icon: Scale,
    value: 375,
    suffix: "+",
    label: "Referenced Standards",
    context: "CSA, ASTM, and other standards catalogued",
  },
  {
    icon: Globe,
    value: 55,
    suffix: "+",
    label: "Municipal Bylaws",
    context: "Local bylaws indexed across Canadian jurisdictions",
  },
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
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#d92f37]/5 to-[#0a0a0f]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                           linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
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
            <span className="inline-block px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] text-[#d92f37] border border-[#d92f37]/30 bg-[#d92f37]/5 mb-4">
              The Scale
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              <ScrambleText text="Canada's Building Code Landscape" />
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The regulatory landscape is massive and fragmented.
              MapleCodes maps it all in one place.
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
                <div className="relative p-6 lg:p-8 rounded-2xl bg-[rgba(10,10,20,0.6)] border border-white/5 backdrop-blur-sm transition-all duration-300 group-hover:border-[#d92f37]/20 group-hover:bg-[rgba(10,10,20,0.8)]">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#d92f37]/10 border border-[#d92f37]/20 mb-4">
                    <metric.icon className="w-6 h-6 text-[#d92f37]" />
                  </div>

                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tabular-nums">
                    <AnimatedCounter
                      end={metric.value}
                      suffix={metric.suffix}
                      duration={2000 + index * 200}
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">
                    {metric.label}
                  </h3>

                  <p className="text-sm text-gray-500">
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
          <p className="text-center text-gray-400 mt-12 text-lg">
            Every project sits under <span className="text-white font-semibold">multiple overlapping jurisdictions</span>.
            MapleCodes resolves the stack instantly.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}