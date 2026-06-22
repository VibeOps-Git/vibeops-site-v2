import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedContent from "../AnimatedContent";

export function CTASection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-background">
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
          <div className="relative p-8 md:p-12 lg:p-16 rounded-2xl bg-card border border-border shadow-sm">
            <div className="text-center">
              <span className="inline-block text-xs uppercase tracking-[0.2em] text-[#d92f37] mb-6">
                Part of the VibeOps Suite
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Want to know your{" "}
                <span className="text-[#d92f37]">
                  code context
                </span>
                ?
              </h2>

              <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Stop digging through government portals. Type an address, get the full
                building code picture, then hand it to Reportly to write the report.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#d92f37] text-white font-semibold hover:bg-[#b91f29] transition-colors group"
                >
                  <span>Get Early Access</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  to="/reportly"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-secondary text-foreground font-semibold hover:border-primary transition-colors group"
                >
                  <span>See Reportly</span>
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
          <p className="text-center text-muted-foreground text-sm mt-8">
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