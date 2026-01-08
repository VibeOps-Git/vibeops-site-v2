import { useState } from "react";
import { FileText, Upload, Zap, Palette, Clock, Check, ArrowRight } from "lucide-react";
import AnimatedContent from "../components/AnimatedContent";
import { VibeCard } from "../components/ui/VibeCard";
import { Section, SectionDivider } from "../components/ui/Section";
import { StickyDeviceShowcase } from "../components/StickyDeviceShowcase";
import { ReportlySceneRenderer, REPORTLY_SCENES } from "../components/ReportlyScenes";

// =============================================================================
// Constants
// =============================================================================

const STATS = [
  { stat: "30-40%", label: "of engineer time", description: "Lost to documentation and formatting tasks" },
  { stat: "600-800", label: "hours per engineer", description: "Wasted annually on repetitive report work" },
  { stat: "$35K+", label: "per engineer", description: "In salary costs for non-engineering work" },
];

const STEPS = [
  { icon: Upload, step: "01", title: "Upload Templates", description: "Upload your existing Word and Excel templates. We map them once, and they're ready to use." },
  { icon: Zap, step: "02", title: "Instant Transformation", description: "Connect your data sources. Reportly fills in tables, charts, photos, and text automatically." },
  { icon: Palette, step: "03", title: "Branded Output", description: "Get audit-ready documents that match your firm's formatting and branding standards." },
];

const FEATURES = [
  "Works with your existing Word & Excel templates",
  "Charts and tables generated from live data",
  "Photo appendices with automatic formatting",
  "Brand-consistent, QA-ready output",
  "No changes to your existing workflow",
  "Secure, enterprise-grade infrastructure",
];

const USE_CASES = [
  "Dam Safety Reports", "Bridge Inspections", "Geotechnical Reports", "Environmental Monitoring",
  "Construction Documentation", "Instrumentation Reports", "Site Investigation Reports", "Progress Reports",
];

// =============================================================================
// Sub-components
// =============================================================================

function ComingSoonBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ffcc]/30 bg-[#00ffcc]/5 mb-8">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffcc] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffcc]" />
      </span>
      <span className="text-xs uppercase tracking-[0.2em] text-[#00ffcc]">Coming Soon</span>
    </div>
  );
}

function EmailSignupForm({
  email, setEmail, loading, submitted, onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  submitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#00ffcc]/10 border border-[#00ffcc]/30">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-[#00ffcc]/20">
            <Check className="w-5 h-5 text-[#00ffcc]" />
          </div>
          <p className="text-lg font-semibold text-white">You're on the list!</p>
        </div>
        <p className="text-sm text-gray-400">We'll notify you as soon as Reportly is ready for early access.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto">
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
            <>Get Early Access <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-3">Be first to know when we launch. No spam, ever.</p>
    </form>
  );
}

function StatCard({ stat, label, description }: { stat: string; label: string; description: string }) {
  return (
    <VibeCard className="p-6 text-center h-full">
      <p className="text-4xl font-bold text-[#00ffcc] mb-1">{stat}</p>
      <p className="text-sm font-medium text-white mb-2">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </VibeCard>
  );
}

function StepCard({ icon: Icon, step, title, description }: { icon: typeof Upload; step: string; title: string; description: string }) {
  return (
    <VibeCard variant="glow" className="p-6 h-full">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-[#00ffcc]/10">
          <Icon className="w-6 h-6 text-[#00ffcc]" />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-[#00ffcc]/70 mb-1">Step {step}</p>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </VibeCard>
  );
}

function FeatureItem({ feature }: { feature: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
      <Check className="w-5 h-5 text-[#00ffcc] flex-shrink-0" />
      <span className="text-gray-300">{feature}</span>
    </div>
  );
}

function UseCaseTag({ label }: { label: string }) {
  return (
    <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:border-[#00ffcc]/30 hover:text-[#00ffcc] transition-colors cursor-default">
      {label}
    </span>
  );
}

// =============================================================================
// Section Components
// =============================================================================

function HeroSection({ email, setEmail, loading, submitted, onSubmit }: {
  email: string; setEmail: (v: string) => void; loading: boolean; submitted: boolean; onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <AnimatedContent distance={100} direction="vertical" duration={1} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.1}>
          <ComingSoonBadge />
        </AnimatedContent>

        <AnimatedContent distance={80} direction="vertical" duration={1} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.1} delay={0.1}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20">
              <FileText className="w-8 h-8 text-[#00ffcc]" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">Reportly</h1>
          </div>
        </AnimatedContent>

        <AnimatedContent distance={60} direction="vertical" duration={1} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.1} delay={0.2}>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto">Stop wasting time on report formatting.</p>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">Automated reports from your existing Word and Excel templates. Upload once, generate forever.</p>
        </AnimatedContent>

        <AnimatedContent distance={40} direction="vertical" duration={0.8} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.1} delay={0.3}>
          <EmailSignupForm email={email} setEmail={setEmail} loading={loading} submitted={submitted} onSubmit={onSubmit} />
        </AnimatedContent>
      </div>
    </section>
  );
}

function DeviceShowcaseSection() {
  return (
    <StickyDeviceShowcase scenes={REPORTLY_SCENES}>
      {(sceneIndex, progress) => (
        <ReportlySceneRenderer sceneIndex={sceneIndex} progress={progress} />
      )}
    </StickyDeviceShowcase>
  );
}

function ProblemSection() {
  return (
    <Section className="py-20">
      <AnimatedContent distance={60} direction="vertical" duration={0.8} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.2}>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">The Problem</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Engineers Shouldn't Be Formatting Documents</h2>
          <p className="text-gray-400 text-lg">Your team spends countless hours on repetitive report formatting instead of actual engineering work.</p>
        </div>
      </AnimatedContent>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {STATS.map((item, i) => (
          <AnimatedContent key={item.label} distance={50} direction="vertical" duration={0.7} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.3} delay={i * 0.1}>
            <StatCard {...item} />
          </AnimatedContent>
        ))}
      </div>
    </Section>
  );
}

function HowItWorksSection() {
  return (
    <Section className="py-20">
      <AnimatedContent distance={60} direction="vertical" duration={0.8} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.2}>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Three Steps to Automated Reports</h2>
          <p className="text-gray-400 text-lg">Keep your existing templates. Keep your existing workflow. Just remove the manual work.</p>
        </div>
      </AnimatedContent>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {STEPS.map((item, i) => (
          <AnimatedContent key={item.step} distance={50} direction="vertical" duration={0.7} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.3} delay={i * 0.12}>
            <StepCard {...item} />
          </AnimatedContent>
        ))}
      </div>
    </Section>
  );
}

function FeaturesSection() {
  return (
    <Section className="py-20">
      <AnimatedContent distance={60} direction="vertical" duration={0.8} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.2}>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">What You Get</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built for Engineering Teams</h2>
        </div>
      </AnimatedContent>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {FEATURES.map((feature, i) => (
          <AnimatedContent key={feature} distance={40} direction="vertical" duration={0.6} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.3} delay={i * 0.08}>
            <FeatureItem feature={feature} />
          </AnimatedContent>
        ))}
      </div>
    </Section>
  );
}

function UseCasesSection() {
  return (
    <Section className="py-20">
      <AnimatedContent distance={60} direction="vertical" duration={0.8} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.2}>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc] mb-4">Use Cases</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Perfect For</h2>
        </div>
      </AnimatedContent>

      <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
        {USE_CASES.map((useCase, i) => (
          <AnimatedContent key={useCase} distance={30} direction="vertical" duration={0.5} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.3} delay={i * 0.05}>
            <UseCaseTag label={useCase} />
          </AnimatedContent>
        ))}
      </div>
    </Section>
  );
}

function FinalCTASection({ email, setEmail, loading, submitted, onSubmit }: {
  email: string; setEmail: (v: string) => void; loading: boolean; submitted: boolean; onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <Section className="py-20 pb-32">
      <AnimatedContent distance={60} direction="vertical" duration={0.9} ease="power3.out" initialOpacity={0} animateOpacity threshold={0.3}>
        <VibeCard variant="gradient" hover={false} className="p-8 md:p-12 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-[#00ffcc]" />
            <span className="text-sm text-[#00ffcc]">Launching Soon</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Be First in Line</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join our early access list and be the first to know when Reportly is ready. Early subscribers get priority onboarding.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-[#00ffcc]">
              <Check className="w-5 h-5" />
              <span>You're on the list!</span>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ffcc]/50 focus:bg-white/10 transition-all"
                />
                <button type="submit" disabled={loading} className="px-8 py-3 rounded-full bg-[#00ffcc] text-black font-semibold hover:bg-[#00ffcc]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "..." : "Notify Me"}
                </button>
              </div>
            </form>
          )}
        </VibeCard>
      </AnimatedContent>
    </Section>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function Reportly() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    setLoading(false);
  };

  const formProps = { email, setEmail, loading, submitted, onSubmit: handleSubmit };

  return (
    <div className="pt-24">
      <HeroSection {...formProps} />
      <DeviceShowcaseSection />
      <SectionDivider className="mx-auto max-w-5xl" />
      <ProblemSection />
      <SectionDivider className="mx-auto max-w-5xl" />
      <HowItWorksSection />
      <SectionDivider className="mx-auto max-w-5xl" />
      <FeaturesSection />
      <SectionDivider className="mx-auto max-w-5xl" />
      <UseCasesSection />
      <SectionDivider className="mx-auto max-w-5xl" />
      <FinalCTASection {...formProps} />
    </div>
  );
}
