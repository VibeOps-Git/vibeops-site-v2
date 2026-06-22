import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedContent from "../AnimatedContent";

export function CTASection() {
  return (
    <section className="relative py-24 px-4">
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
          {/* Card container */}
          <div className="relative p-8 md:p-12 lg:p-16 rounded-3xl bg-card border border-border shadow-sm">
            {/* Content */}
            <div className="text-center">
              {/* Badge */}
              <span className="inline-block text-xs uppercase tracking-[0.2em] text-primary mb-6">
                Now Available
              </span>

              {/* Headline */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Stop losing time to{" "}
                <span className="text-primary">formatting</span>
              </h2>

              {/* Subheadline */}
              <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Upload your template. Drop in your data. Get a formatted, reference-accurate first draft in minutes. Your team keeps working the way it already does.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://reportly.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors group"
                >
                  <span>See Reportly</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-secondary font-semibold hover:bg-secondary/70 transition-colors group text-foreground"
                >
                  <span>Book a Demo</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </AnimatedContent>

        {/* Bottom tagline */}
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
            <Link
              to="/contact"
              className="text-primary hover:underline"
            >
              Get in touch
            </Link>
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
