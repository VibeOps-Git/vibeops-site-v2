import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedContent from "../AnimatedContent";

export function CTASection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#d92f37]/5 to-[#0a0a0f]" />

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#d92f37]/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#d92f37]/5 rounded-full blur-3xl opacity-50" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <AnimatedContent
          distance={60}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="relative p-8 md:p-12 lg:p-16 rounded-3xl bg-[rgba(10,10,20,0.8)] border border-[#d92f37]/20 backdrop-blur-sm">
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#d92f37]/40 to-transparent" />

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d92f37]/30 bg-[#d92f37]/5 mb-6">
                <Sparkles className="w-4 h-4 text-[#d92f37]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#d92f37]">
                  Part of the VibeOps Suite
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Know Your{" "}
                <span className="text-[#d92f37]">
                  Code Context
                </span>
                ?
              </h2>

              <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Stop hunting through government portals. Enter an address and get
                the full building code picture, then create your report with Reportly.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#d92f37] text-white font-semibold hover:bg-[#b91f29] transition-all group shadow-[0_12px_32px_rgba(217,47,55,0.3)]"
                >
                  <span>Join the Early Access List</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  to="/reportly"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/[0.03] text-white/70 font-semibold hover:border-white/20 hover:text-white transition-all group"
                >
                  <span>Explore Reportly</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </AnimatedContent>

        <AnimatedContent
          distance={30}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.3}
        >
          <p className="text-center text-gray-500 text-sm mt-8">
            Questions?{" "}
            <Link to="/contact" className="text-[#d92f37] hover:underline">
              Get in touch
            </Link>
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}