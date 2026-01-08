import { useState } from "react";
import { FileText, Upload, Zap, Palette, Clock, Check, ArrowRight, Table, Image, BarChart2 } from "lucide-react";
import AnimatedContent from "../components/AnimatedContent";
import { VibeCard } from "../components/ui/VibeCard";
import { Section, SectionDivider } from "../components/ui/Section";
import { TabletMockup } from "../components/DeviceMockup";

export default function Reportly() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    // Simulate submission - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <AnimatedContent
            distance={100}
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
              <span className="text-xs uppercase tracking-[0.2em] text-[#00ffcc]">
                Coming Soon
              </span>
            </div>
          </AnimatedContent>

          <AnimatedContent
            distance={80}
            direction="vertical"
            duration={1}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.1}
            delay={0.1}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20">
                <FileText className="w-8 h-8 text-[#00ffcc]" />
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                Reportly
              </h1>
            </div>
          </AnimatedContent>

          <AnimatedContent
            distance={60}
            direction="vertical"
            duration={1}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.1}
            delay={0.2}
          >
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto">
              Stop wasting time on report formatting.
            </p>
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
              Automated reports from your existing Word and Excel templates.
              Upload once, generate forever.
            </p>
          </AnimatedContent>

          <AnimatedContent
            distance={40}
            direction="vertical"
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.1}
            delay={0.3}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ffcc]/50 focus:bg-white/10 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-full bg-[#00ffcc] text-black font-semibold hover:bg-[#00ffcc]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="inline-block w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        Get Early Access
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Be first to know when we launch. No spam, ever.
                </p>
              </form>
            ) : (
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#00ffcc]/10 border border-[#00ffcc]/30">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-[#00ffcc]/20">
                    <Check className="w-5 h-5 text-[#00ffcc]" />
                  </div>
                  <p className="text-lg font-semibold text-white">You're on the list!</p>
                </div>
                <p className="text-sm text-gray-400">
                  We'll notify you as soon as Reportly is ready for early access.
                </p>
              </div>
            )}
          </AnimatedContent>
        </div>
      </section>

      {/* Device Preview */}
      <Section className="py-16 overflow-hidden">
        <AnimatedContent
          distance={80}
          direction="vertical"
          duration={1}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="max-w-4xl mx-auto">
            <TabletMockup>
              {/* Fake Reportly Interface */}
              <div className="aspect-[4/3] p-6 bg-gradient-to-br from-[#0f1115] to-[#0a0a0f]">
                {/* Header bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#00ffcc]/10">
                      <FileText className="w-4 h-4 text-[#00ffcc]" />
                    </div>
                    <span className="text-sm font-semibold text-white">Reportly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/20">
                      <span className="text-xs text-[#00ffcc]">Dam Safety Report</span>
                    </div>
                  </div>
                </div>

                {/* Main content area */}
                <div className="grid grid-cols-3 gap-4 h-[calc(100%-4rem)]">
                  {/* Left sidebar - Template info */}
                  <div className="col-span-1 space-y-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[0.6rem] uppercase tracking-wider text-gray-500 mb-2">Template</p>
                      <p className="text-xs text-white font-medium">Annual Monitoring Report</p>
                      <p className="text-[0.6rem] text-gray-500 mt-1">v2.4 • Word + Excel</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[0.6rem] uppercase tracking-wider text-gray-500 mb-2">Data Source</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <p className="text-xs text-white">Connected</p>
                      </div>
                      <p className="text-[0.6rem] text-gray-500 mt-1">147 records loaded</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#00ffcc]/5 border border-[#00ffcc]/20">
                      <p className="text-[0.6rem] uppercase tracking-wider text-[#00ffcc] mb-2">Status</p>
                      <p className="text-xs text-white font-medium">Ready to Generate</p>
                    </div>
                  </div>

                  {/* Right content - Preview */}
                  <div className="col-span-2 rounded-xl bg-white/[0.02] border border-white/10 p-4 overflow-hidden">
                    <p className="text-[0.6rem] uppercase tracking-wider text-gray-500 mb-3">Report Preview</p>

                    {/* Fake document preview */}
                    <div className="space-y-3">
                      {/* Title block */}
                      <div className="h-4 w-3/4 rounded bg-white/10" />
                      <div className="h-2 w-1/2 rounded bg-white/5" />

                      {/* Table preview */}
                      <div className="mt-4 p-2 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Table className="w-3 h-3 text-[#00ffcc]/60" />
                          <span className="text-[0.6rem] text-gray-500">Instrumentation Data</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-2 rounded bg-white/10" />
                          ))}
                        </div>
                      </div>

                      {/* Chart preview */}
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart2 className="w-3 h-3 text-[#00ffcc]/60" />
                          <span className="text-[0.6rem] text-gray-500">Piezometer Readings</span>
                        </div>
                        <div className="flex items-end gap-1 h-8">
                          {[40, 65, 45, 80, 55, 70, 50, 75, 60].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t bg-gradient-to-t from-[#00ffcc]/40 to-[#00ffcc]/20"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Photos preview */}
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Image className="w-3 h-3 text-[#00ffcc]/60" />
                          <span className="text-[0.6rem] text-gray-500">Photo Appendix</span>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex-1 aspect-square rounded bg-white/10" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabletMockup>
          </div>
        </AnimatedContent>

        <AnimatedContent
          distance={40}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.3}
          delay={0.2}
        >
          <p className="text-center text-sm text-gray-500 mt-8 max-w-md mx-auto">
            Upload your templates, connect your data, and generate audit-ready reports in minutes.
          </p>
        </AnimatedContent>
      </Section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* The Problem */}
      <Section className="py-20">
        <AnimatedContent
          distance={60}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">
              The Problem
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Engineers Shouldn't Be Formatting Documents
            </h2>
            <p className="text-gray-400 text-lg">
              Your team spends countless hours on repetitive report formatting
              instead of actual engineering work.
            </p>
          </div>
        </AnimatedContent>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              stat: "30-40%",
              label: "of engineer time",
              description: "Lost to documentation and formatting tasks",
            },
            {
              stat: "600-800",
              label: "hours per engineer",
              description: "Wasted annually on repetitive report work",
            },
            {
              stat: "$35K+",
              label: "per engineer",
              description: "In salary costs for non-engineering work",
            },
          ].map((item, index) => (
            <AnimatedContent
              key={item.label}
              distance={50}
              direction="vertical"
              duration={0.7}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.3}
              delay={index * 0.1}
            >
              <VibeCard className="p-6 text-center h-full">
                <p className="text-4xl font-bold text-[#00ffcc] mb-1">{item.stat}</p>
                <p className="text-sm font-medium text-white mb-2">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </VibeCard>
            </AnimatedContent>
          ))}
        </div>
      </Section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* How It Works */}
      <Section className="py-20">
        <AnimatedContent
          distance={60}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Three Steps to Automated Reports
            </h2>
            <p className="text-gray-400 text-lg">
              Keep your existing templates. Keep your existing workflow.
              Just remove the manual work.
            </p>
          </div>
        </AnimatedContent>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: Upload,
              step: "01",
              title: "Upload Templates",
              description:
                "Upload your existing Word and Excel templates. We map them once, and they're ready to use.",
            },
            {
              icon: Zap,
              step: "02",
              title: "Instant Transformation",
              description:
                "Connect your data sources. Reportly fills in tables, charts, photos, and text automatically.",
            },
            {
              icon: Palette,
              step: "03",
              title: "Branded Output",
              description:
                "Get audit-ready documents that match your firm's formatting and branding standards.",
            },
          ].map((item, index) => (
            <AnimatedContent
              key={item.step}
              distance={50}
              direction="vertical"
              duration={0.7}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.3}
              delay={index * 0.12}
            >
              <VibeCard variant="glow" className="p-6 h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#00ffcc]/10">
                    <item.icon className="w-6 h-6 text-[#00ffcc]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#00ffcc]/70 mb-1">
                      Step {item.step}
                    </p>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
              </VibeCard>
            </AnimatedContent>
          ))}
        </div>
      </Section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* What You Get */}
      <Section className="py-20">
        <AnimatedContent
          distance={60}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">
              What You Get
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Built for Engineering Teams
            </h2>
          </div>
        </AnimatedContent>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            "Works with your existing Word & Excel templates",
            "Charts and tables generated from live data",
            "Photo appendices with automatic formatting",
            "Brand-consistent, QA-ready output",
            "No changes to your existing workflow",
            "Secure, enterprise-grade infrastructure",
          ].map((feature, index) => (
            <AnimatedContent
              key={feature}
              distance={40}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.3}
              delay={index * 0.08}
            >
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Check className="w-5 h-5 text-[#00ffcc] flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </Section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* Use Cases */}
      <Section className="py-20">
        <AnimatedContent
          distance={60}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">
              Use Cases
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Perfect For
            </h2>
          </div>
        </AnimatedContent>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {[
            "Dam Safety Reports",
            "Bridge Inspections",
            "Geotechnical Reports",
            "Environmental Monitoring",
            "Construction Documentation",
            "Instrumentation Reports",
            "Site Investigation Reports",
            "Progress Reports",
          ].map((useCase, index) => (
            <AnimatedContent
              key={useCase}
              distance={30}
              direction="vertical"
              duration={0.5}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.3}
              delay={index * 0.05}
            >
              <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:border-[#00ffcc]/30 hover:text-[#00ffcc] transition-colors">
                {useCase}
              </span>
            </AnimatedContent>
          ))}
        </div>
      </Section>

      <SectionDivider className="mx-auto max-w-5xl" />

      {/* Final CTA */}
      <Section className="py-20 pb-32">
        <AnimatedContent
          distance={60}
          direction="vertical"
          duration={0.9}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.3}
        >
          <VibeCard variant="gradient" hover={false} className="p-8 md:p-12 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-[#00ffcc]" />
              <span className="text-sm text-[#00ffcc]">Launching Soon</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Be First in Line
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join our early access list and be the first to know when Reportly
              is ready. Early subscribers get priority onboarding.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ffcc]/50 focus:bg-white/10 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-full bg-[#00ffcc] text-black font-semibold hover:bg-[#00ffcc]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "..." : "Notify Me"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-[#00ffcc]">
                <Check className="w-5 h-5" />
                <span>You're on the list!</span>
              </div>
            )}
          </VibeCard>
        </AnimatedContent>
      </Section>
    </div>
  );
}
