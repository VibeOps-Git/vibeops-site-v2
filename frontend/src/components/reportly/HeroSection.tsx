import { FileText, ArrowDown } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <AnimatedContent
        distance={80}
        direction="vertical"
        duration={1}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.1}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ffcc]/30 bg-[#00ffcc]/5 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffcc] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffcc]" />
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-[#00ffcc]">Coming Soon</span>
        </div>
      </AnimatedContent>

      <AnimatedContent
        distance={60}
        direction="vertical"
        duration={1}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.1}
        delay={0.1}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20">
            <FileText className="w-10 h-10 text-[#00ffcc]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white">Reportly</h1>
        </div>
      </AnimatedContent>

      <AnimatedContent
        distance={40}
        direction="vertical"
        duration={1}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.1}
        delay={0.2}
      >
        <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl">
          Stop wasting time on report formatting.
        </p>
        <p className="text-lg text-gray-500 max-w-xl mb-12">
          Automated reports from your existing Word and Excel templates.
        </p>
      </AnimatedContent>

      <AnimatedContent
        distance={20}
        direction="vertical"
        duration={0.8}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.1}
        delay={0.3}
      >
        <div className="flex items-center gap-2 text-gray-500 animate-bounce">
          <span className="text-sm">Scroll to explore</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </AnimatedContent>
    </section>
  );
}
