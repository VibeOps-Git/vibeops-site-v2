import { MapPin, ChevronDown, ArrowRight } from "lucide-react";
import AnimatedContent from "../AnimatedContent";
import { ScrambleText } from "../ScrambleText";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative">
      {/* Badge */}
      <AnimatedContent
        distance={80}
        direction="vertical"
        duration={1}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.1}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d92f37]/30 bg-[#d92f37]/5 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d92f37] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d92f37]" />
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-[#d92f37]">Part of the VibeOps Suite</span>
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
          <div className="p-3 rounded-xl bg-[#d92f37]/10 border border-[#d92f37]/20">
            <MapPin className="w-10 h-10 text-[#d92f37]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            <ScrambleText text="MapleCodes" trigger="mount" />
          </h1>
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
          Canadian Building Code Intelligence.
        </p>
        <p className="text-lg text-gray-500 max-w-xl text-center mb-10">
          Enter a project address. Get the full jurisdiction stack, applicable codes, bylaws,
          and referenced standards — instantly.
        </p>
      </AnimatedContent>

      {/* CTA */}
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
          href="https://maplecodes.ca/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#d92f37] text-white font-semibold hover:bg-[#b91f29] transition-all group shadow-[0_12px_32px_rgba(217,47,55,0.3)]"
        >
          <span>Try MapleCodes</span>
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