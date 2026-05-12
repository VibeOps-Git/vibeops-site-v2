import { FileText, ChevronDown, ArrowRight } from "lucide-react";
import AnimatedContent from "../AnimatedContent";
import { ScrambleText } from "../ScrambleText";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative">
      {/* Coming Soon Badge */}
      <AnimatedContent
        distance={80}
        direction="vertical"
        duration={1}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.1}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--emerald-accent)]/30 bg-[var(--emerald-accent)]/5 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--emerald-accent)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--emerald-accent)]" />
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--emerald-accent)]">Now Available</span>
        </div>
      </AnimatedContent>

      {/* Logo & Title */}
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
          <div className="p-3 rounded-xl bg-[var(--emerald-accent)]/10 border border-[var(--emerald-accent)]/20">
            <FileText className="w-10 h-10 text-[var(--emerald-accent)]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white"><ScrambleText text="Reportly" trigger="mount" /></h1>
        </div>
      </AnimatedContent>

      {/* Headline */}
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
        <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl text-center">
          Stop wasting time on report formatting.
        </p>
        <p className="text-lg text-gray-500 max-w-xl text-center mb-10">
          Automated, audit-ready reports from your existing Word and Excel templates.
          Built by engineers, for engineers.
        </p>
      </AnimatedContent>

      {/* CTA Button */}
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
        <a
          href="https://reportly.ca/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--emerald-accent)] text-black font-semibold hover:bg-[var(--emerald-accent)]/90 transition-all group"
        >
          <span>Try Reportly</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
      </AnimatedContent>

      {/* Scroll indicator */}
      <div className="mt-16">
        <AnimatedContent
          distance={20}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.1}
          delay={0.5}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-500">Scroll to explore</span>
            <ChevronDown className="w-5 h-5 text-gray-500 animate-bounce" />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
