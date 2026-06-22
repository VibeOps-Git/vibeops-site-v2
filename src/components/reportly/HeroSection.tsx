import { FileText, ChevronDown, ArrowRight } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative">
      {/* Status badge */}
      <AnimatedContent
        distance={80}
        direction="vertical"
        duration={1}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.1}
      >
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-primary mb-8">Now Available</span>
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
          <div className="p-3 rounded-xl bg-secondary border border-border">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground">Reportly</h1>
        </div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-semibold text-center mt-2">
          Engineering report automation for AE firms
        </p>
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
        <p className="text-xl md:text-2xl text-foreground mb-4 max-w-2xl text-center">
          Your inspection data deserves better than copy and paste.
        </p>
        <p className="text-lg text-muted-foreground max-w-xl text-center mb-10">
          Upload your Word templates. Drop in photos, measurements, and project data. Get formatted, reference-accurate reports with a real executive summary in minutes.
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
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors group"
        >
          <span>See Reportly</span>
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
          delay={0.4}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">Scroll to see how it works</span>
            <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
