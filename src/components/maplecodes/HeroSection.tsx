import { useEffect, useState } from "react";
import { MapPin, ChevronDown, ArrowRight, Search } from "lucide-react";
import AnimatedContent from "../AnimatedContent";

const TYPED_ADDRESSES = [
  "800 Robson St, Vancouver, BC",
  "20 Bay St, Toronto, ON",
  "10101 Jasper Ave, Edmonton, AB",
  "1000 De La Gauchetière O, Montréal, QC",
  "1700 Alta Vista Dr, Ottawa, ON",
  "999 Canada Pl, Vancouver, BC",
];

function TypewriterSearch() {
  const [text, setText] = useState("");
  const [addrIndex, setAddrIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const address = TYPED_ADDRESSES[addrIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < address.length) {
      timeout = setTimeout(() => {
        setText(address.slice(0, charIndex + 1));
        setCharIndex((i) => i + 1);
      }, 45 + Math.random() * 35);
    } else if (!deleting && charIndex >= address.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setText(address.slice(0, charIndex - 1));
        setCharIndex((i) => i - 1);
      }, 20);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setAddrIndex((i) => (i + 1) % TYPED_ADDRESSES.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, addrIndex]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-card border border-border shadow-sm">
        <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <span className="text-foreground text-left truncate flex-1">
          {text}
          <span className="inline-block w-0.5 h-5 bg-[#d92f37] ml-0.5 align-middle animate-pulse" />
        </span>
        <span className="px-4 py-1.5 rounded-lg bg-[#d92f37] text-white text-sm font-semibold flex-shrink-0">
          Analyze Site
        </span>
      </div>
    </div>
  );
}

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
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-[#d92f37] mb-8">Part of the VibeOps Suite</span>
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
          <h1 className="text-5xl md:text-7xl font-bold text-foreground">
            MapleCodes
          </h1>
        </div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#d92f37] font-semibold text-center mt-2">
          Canadian building code lookup for AE teams
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
        <p className="text-xl md:text-2xl text-foreground mb-2 max-w-2xl text-center">
          Type an address. Get every code that governs it.
        </p>
        <p className="text-base text-muted-foreground max-w-lg text-center mb-10">
          The jurisdiction stack, the building codes that apply, municipal bylaws,
          referenced standards, and a plain-language brief. In seconds, not hours.
        </p>
      </AnimatedContent>

      {/* Typewriter search bar */}
      <AnimatedContent
        distance={30}
        direction="vertical"
        duration={0.8}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.1}
        delay={0.35}
      >
        <TypewriterSearch />
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
        delay={0.5}
      >
        <a
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#d92f37] text-white font-semibold hover:bg-[#b91f29] transition-colors group"
        >
          <span>Get Early Access</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
      </AnimatedContent>

      {/* Scroll */}
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
            <span className="text-xs text-muted-foreground">Scroll to explore</span>
            <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}