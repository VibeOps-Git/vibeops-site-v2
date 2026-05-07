import { useEffect, useState } from "react";
import { MapPin, ChevronDown, ArrowRight, Search } from "lucide-react";
import AnimatedContent from "../AnimatedContent";
import { ScrambleText } from "../ScrambleText";

const TYPED_ADDRESSES = [
  "800 Robson St, Vancouver, BC",
  "100 Queen St W, Toronto, ON",
  "400 Laurier Ave W, Ottawa, ON",
  "1200 Commissioner St, Vancouver, BC",
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
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[rgba(10,10,20,0.8)] border border-white/10 backdrop-blur-sm">
        <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
        <span className="text-gray-300 text-left truncate flex-1">
          {text}
          <span className="inline-block w-0.5 h-5 bg-amber-400 ml-0.5 align-middle animate-pulse" />
        </span>
        <span className="px-4 py-1.5 rounded-lg bg-amber-400 text-black text-sm font-semibold flex-shrink-0">
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
        <p className="text-xl md:text-2xl text-gray-300 mb-2 max-w-2xl text-center">
          Enter an address. Get every governing code.
        </p>
        <p className="text-base text-gray-500 max-w-lg text-center mb-10">
          Jurisdiction stack, applicable building codes, municipal bylaws,
          referenced standards, and an AI governing brief — in seconds.
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
          href="https://maplecodes.ca/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-400 text-black font-semibold hover:bg-amber-400/90 transition-all group"
        >
          <span>Try MapleCodes Free</span>
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
          delay={0.7}
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