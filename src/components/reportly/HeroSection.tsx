import { FileText, ChevronDown } from "lucide-react";
import AnimatedContent from "../AnimatedContent";
import { EmailSignup } from "./EmailSignup";

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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ffcc]/30 bg-[#00ffcc]/5 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffcc] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffcc]" />
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-[#00ffcc]">Coming Soon</span>
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
          <div className="p-3 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20">
            <FileText className="w-10 h-10 text-[#00ffcc]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white">Reportly</h1>
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

      {/* Email Signup */}
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
        <div className="w-full max-w-lg">
          <EmailSignup />
        </div>
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
