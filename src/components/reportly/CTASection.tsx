import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedContent from "../AnimatedContent";
import { EmailSignup } from "./EmailSignup";

export function CTASection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#00ffcc]/5 to-[#0a0a0f]" />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00ffcc]/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#00ffcc]/5 rounded-full blur-3xl opacity-50" />

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
          <div className="relative p-8 md:p-12 lg:p-16 rounded-3xl bg-[rgba(10,10,20,0.8)] border border-[#00ffcc]/20 backdrop-blur-sm">
            {/* Top edge glow */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#00ffcc]/40 to-transparent" />

            {/* Content */}
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ffcc]/30 bg-[#00ffcc]/5 mb-6">
                <Sparkles className="w-4 h-4 text-[#00ffcc]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#00ffcc]">
                  Early Access
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Stop Wasting Time on{" "}
                <span className="text-[#00ffcc]">Formatting</span>?
              </h2>

              {/* Subheadline */}
              <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Join the waitlist to be first in line when Reportly launches.
                Less formatting, more engineering.
              </p>

              {/* Email signup */}
              <div className="max-w-lg mx-auto mb-8">
                <EmailSignup />
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00ffcc]" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00ffcc]" />
                  <span>Free early access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00ffcc]" />
                  <span>Cancel anytime</span>
                </div>
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
          <p className="text-center text-gray-500 text-sm mt-8">
            Questions?{" "}
            <Link
              to="/contact"
              className="text-[#00ffcc] hover:underline"
            >
              Get in touch
            </Link>
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
