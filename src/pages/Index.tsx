// src/pages/Index.tsx

import { FileText, Wrench, BarChart3, Layers, ArrowRight, Check } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { ReportlyHomepagePreview } from '@/components/ReportlyHomepagePreview';
import AnimatedContent from '../components/AnimatedContent';
import { VibeCard } from '@/components/ui/VibeCard';
import { VibeLinkButton } from '@/components/ui/VibeButton';
import { Section, SectionWithHeader, SectionDivider } from '@/components/ui/Section';
import { GallerySection3D, ContentOverlay } from '../components/3d';
import { ProcessTimeline } from '@/components/process/ProcessTimeline';

const pressLinks = [
  {
    label: "UBC Investor Showcase",
    url: "https://innovation.ubc.ca/news/march-03-2026/meet-12-ubc-ventures-presenting-innovation-ubcs-2026-investor-showcase",
  },
  {
    label: "Venture Founder Cohort",
    url: "https://innovation.ubc.ca/news/february-02-2026/meet-51st-venture-founder-cohort",
  },
];

const partnerLogos = [
  { src: "/clients/SenseEngineering.png", alt: "Sense Engineering" },
  { src: "/clients/ubc-eng.jpg", alt: "UBC Engineering" },
];

export default function Index() {
  return (
    <>
      <SEO
        title="VibeOps Technologies"
        description="Engineering automation for civil, construction, and infrastructure teams. We automate reporting and workflows so engineers can focus on engineering."
        canonical="https://www.vibeops.ca/"
      />
      <div className="pt-20">
        <HeroSection />
        <SectionDivider className="mx-auto max-w-5xl" />
        <ServicesSection />
        <SectionDivider className="mx-auto max-w-5xl" />
        <ReportlySection />
        <SectionDivider className="mx-auto max-w-5xl" />
        <ProcessSection />
        <SectionDivider className="mx-auto max-w-5xl" />
        <CTASection />
      </div>
    </>
  );
}

// =============================================================================
// Hero Section
// =============================================================================

function HeroSection() {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center px-4 pt-8 sm:pt-20 pb-6 sm:pb-12">
      <div className="text-center max-w-5xl mx-auto flex-1 flex flex-col justify-center">
        <AnimatedContent
          distance={100}
          direction="vertical"
          duration={1}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.1}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-[#00ffcc] mb-4 sm:mb-6">
            Civil · Construction · Infrastructure
          </p>
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6">
            <span className="text-white">Less formatting.</span>
            <br />
            <span className="bg-gradient-to-r from-[#00ffcc] via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              More engineering.
            </span>
          </h1>
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
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
            We automate reporting and workflows so engineers can focus on engineering.
          </p>
          <p className="text-sm text-gray-500 mb-6 sm:mb-10">
            Focused solutions that fit how your team actually works.
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
          <div className="flex flex-wrap justify-center gap-4">
            <VibeLinkButton href="/contact" variant="primary" size="lg">
              Book a Vibe Check
            </VibeLinkButton>
            <VibeLinkButton href="/services" variant="outline" size="lg">
              See What We Build
            </VibeLinkButton>
          </div>
        </AnimatedContent>

        <AnimatedContent
          distance={30}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.1}
          delay={0.4}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mt-6 sm:mt-10 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#00ffcc]" />
              Integrates with your existing tools
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#00ffcc]" />
              No workflow disruption
            </span>
          </div>
        </AnimatedContent>
      </div>

      {/* Social Proof */}
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
        <div className="text-center mt-auto pt-4 sm:pt-8">
          {/* Trusted By - Partner Logos */}
          <div className="mb-6">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gray-500 mb-4">
              Trusted By
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {partnerLogos.map((logo) => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-6 w-auto object-contain opacity-50 hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Featured In - Press Links */}
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gray-500 mb-3">
              Featured In
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              {pressLinks.map((link, index) => (
                <span key={link.url} className="flex items-center">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-[0.15em] text-gray-400 hover:text-[#00ffcc] transition-colors"
                  >
                    {link.label} ↗
                  </a>
                  {index < pressLinks.length - 1 && (
                    <span className="hidden sm:inline mx-3 text-gray-600">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}

// =============================================================================
// Services Section
// =============================================================================

const services = [
  {
    icon: FileText,
    title: 'Report Automation',
    subtitle: 'Reportly Engine',
    description: 'Transform hours of manual formatting into minutes. We automate Word and Excel reports using your existing templates.',
    features: ['Template automation', 'Charts & tables from live data', 'Photo appendices', 'QA-ready output'],
    href: '/services#reportly',
    highlight: true,
    machineType: 'printer' as const, // Printer machine for report generation
  },
  {
    icon: Wrench,
    title: 'Workflow Automation',
    subtitle: 'Custom Builds',
    description: 'Remove repetitive documentation from engineering and construction workflows. Field data, checklists, and more.',
    features: ['Field data ingestion', 'Inspection checklists', 'Site documentation', 'White-labeled tools'],
    href: '/services',
    machineType: 'conveyor' as const, // Conveyor belt for workflow processing
  },
  {
    icon: BarChart3,
    title: 'Engineering Dashboards',
    subtitle: 'Data Visualization',
    description: 'Turn raw technical data into actionable insight. Instrumentation, construction tracking, and live field ops views.',
    features: ['Instrument dashboards', 'Construction tracking', 'Map-based views', 'Shareable dashboards'],
    href: '/services',
    machineType: 'controlPanel' as const, // Control panel for monitoring/dashboards
  },
  {
    icon: Layers,
    title: 'Internal Tools',
    subtitle: 'Lightweight Apps',
    description: 'Rapid engineering calculators and tools that mirror your workflows without the overhead of a full platform.',
    features: ['Cost estimators', 'Asset tracking', 'Pilot tools', 'Secure deployment'],
    href: '/services',
    machineType: 'toolbox' as const, // Toolbox for internal tools
  },
];

function ServicesSection() {
  return (
    <SectionWithHeader
      tag="What We Build"
      title="What We Automate"
      description="We eliminate repetitive reporting and documentation work, so your team can deliver more engineering per project."
      divider
    >
      {/* Liquid Glass Cards Gallery */}
      <GallerySection3D items={services} />
    </SectionWithHeader>
  );
}

interface ServiceCardProps {
  icon: typeof FileText;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  href: string;
  highlight?: boolean;
}

function ServiceCard({ icon: Icon, title, subtitle, description, features, href, highlight }: ServiceCardProps) {
  return (
    <a href={href} className="block group">
      <VibeCard variant={highlight ? 'glow' : 'default'} className="h-full p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${highlight ? 'bg-[#00ffcc]/10' : 'bg-white/5'} transition-colors group-hover:bg-[#00ffcc]/10`}>
            <Icon className={`w-6 h-6 ${highlight ? 'text-[#00ffcc]' : 'text-gray-400'} transition-colors group-hover:text-[#00ffcc]`} />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-[#00ffcc]/70 mb-1">{subtitle}</p>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#00ffcc] transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-400 mb-4">{description}</p>
            <ul className="grid grid-cols-2 gap-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-xs text-gray-500">
                  <Check className="w-3 h-3 text-[#00ffcc]/60" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-end">
          <span className="text-sm text-gray-500 group-hover:text-[#00ffcc] transition-colors flex items-center gap-1">
            Learn more <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </VibeCard>
    </a>
  );
}

// =============================================================================
// Reportly Section (Featured Product)
// =============================================================================

function ReportlySection() {
  return (
    <Section divider>
      <AnimatedContent
        distance={80}
        direction="vertical"
        duration={1}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.2}
      >
        <VibeCard variant="gradient" hover={false} className="p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#00ffcc]/70 mb-4">
                Featured Product
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Reportly
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Our flagship report automation engine. Plug in your existing Word
                templates, input your data, and generate review-ready documents with none of the formatting hassle.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Works with templates you already use',
                  'Charts, tables, and photos from live data',
                  'Brand-consistent, QA-ready output',
                  'No changes to your existing workflow',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[#00ffcc]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <VibeLinkButton
                  href="/reportly"
                  variant="primary"
                >
                  Learn About Reportly
                </VibeLinkButton>
                <VibeLinkButton href="/contact" variant="outline">
                  Schedule Demo
                </VibeLinkButton>
              </div>
            </div>
            <div className="relative">
              <ReportlyHomepagePreview />
            </div>
          </div>
        </VibeCard>
      </AnimatedContent>
    </Section>
  );
}

// =============================================================================
// Process Section
// =============================================================================

const processSteps = [
  {
    step: '01',
    title: 'Discovery',
    description: 'We review your actual workflows, tools, and processes. No theoretical frameworks — just how work really gets done.',
  },
  {
    step: '02',
    title: 'Prototype',
    description: 'We build a narrow but complete solution: ingest data, automate the workflow, and walk it through your QA process.',
  },
  {
    step: '03',
    title: 'Rollout',
    description: 'Once the first workflow is trusted, we expand carefully. Proper versioning, access control, and documentation.',
  },
];

function ProcessSection() {
  return (
    <SectionWithHeader
      tag="How We Work"
      title="Custom Projects"
      description="We get one workflow right before moving to the next. Built to fit how your team actually operates."
      maxWidth="lg"
      divider
    >
      <ProcessTimeline steps={processSteps} />
    </SectionWithHeader>
  );
}

// =============================================================================
// CTA Section
// =============================================================================

function CTASection() {
  return (
    <Section className="pb-32" divider>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get engineering time back?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            We automate reporting and documentation, so your team can focus on engineering work - and deliver more per project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <VibeLinkButton href="/contact" variant="primary" size="lg">
              Book a Vibe Check
            </VibeLinkButton>
            <VibeLinkButton href="/services" variant="outline" size="lg">
              Explore Our Services
            </VibeLinkButton>
          </div>
        </VibeCard>
      </AnimatedContent>
    </Section>
  );
}
