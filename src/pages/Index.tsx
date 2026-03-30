// src/pages/Index.tsx

import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, Wrench, BarChart3, Layers, Check, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { SEO } from '@/components/SEO';
import { ReportlyHomepagePreview } from '@/components/ReportlyHomepagePreview';
import AnimatedContent from '../components/AnimatedContent';
import { VibeLinkButton } from '@/components/ui/VibeButton';
import { Section, SectionWithHeader, SectionDivider } from '@/components/ui/Section';
import { GallerySection3D } from '../components/3d';

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
      <HeroSection />
      <div>
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex overflow-hidden bg-[#0a0a0f]">

      {/* ── Left: Content panel ── */}
      <div className="relative z-10 flex flex-col justify-between w-full lg:w-[50%] px-8 sm:px-12 lg:px-16 xl:px-20 pt-28 lg:pt-32 pb-10">

        <div className="flex flex-col justify-center flex-1">

          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[11px] uppercase tracking-[0.32em] text-[#00ffcc]/60 mb-5"
          >
            Civil · Construction · Infrastructure
          </motion.p>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[2.8rem] sm:text-5xl lg:text-[3.4rem] xl:text-[3.8rem] font-bold leading-[1.06] tracking-tight mb-6"
          >
            <span className="text-white">Less formatting.</span>
            <br />
            <span className="bg-gradient-to-r from-[#00ffcc] via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              More engineering.
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-base lg:text-lg text-gray-300 leading-relaxed mb-8 max-w-md"
          >
            We automate reporting and workflows so engineers can focus on engineering.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3 mb-8"
          >
            <VibeLinkButton href="/contact" variant="primary" size="lg">
              Book a Vibe Check
            </VibeLinkButton>
            <VibeLinkButton href="/services" variant="outline" size="lg">
              See What We Build
            </VibeLinkButton>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500"
          >
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#00ffcc] shrink-0" />
              Integrates with your existing tools
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#00ffcc] shrink-0" />
              No workflow disruption
            </span>
          </motion.div>
        </div>

        {/* ── Product demo card ── */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="hidden sm:block w-full max-w-sm sm:max-w-md pb-10 lg:pb-12"
        >
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 bg-[#0d0d0d]">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-[#111] border-b border-white/8">
              <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
              <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
              <div className="w-2 h-2 rounded-full bg-[#28C840]" />
              <a
                href="https://reportly.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 flex-1 bg-white/5 rounded px-2 py-0.5 text-[9px] text-gray-400 hover:text-[#00ffcc] tracking-wide truncate transition-colors duration-200 cursor-pointer"
              >
                reportly.ca - Try Now! ↗
              </a>
            </div>
            <iframe
              src="https://www.youtube.com/embed/-SGxzwsxL2U?autoplay=1&mute=1&loop=1&playlist=-SGxzwsxL2U&controls=0&showinfo=0&rel=0&modestbranding=1"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Reportly Product Demo"
              className="w-full aspect-video"
              style={{ border: 'none' }}
            />
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="pt-6 border-t border-white/8"
        >
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-gray-600 mb-3">
            Trusted By & Featured In
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {partnerLogos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="h-5 w-auto object-contain opacity-35 hover:opacity-60 transition-opacity duration-200"
              />
            ))}
            <div className="hidden sm:block w-px h-4 bg-white/15" />
            {pressLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-[0.15em] text-gray-500 hover:text-[#00ffcc] transition-colors duration-200"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right: Full-height video ── */}
      <div className="hidden lg:block absolute right-0 top-0 w-[56%] h-full bg-[#0a0a0f] overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/GIVzfvtqk3Y?autoplay=1&mute=1&loop=1&playlist=GIVzfvtqk3Y&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="VibeOps Promo"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ border: 'none', transform: 'scale(1.5)', transformOrigin: 'center center' }}
        />
        {/* Gradient: blends left edge of video into the dark bg */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-transparent to-transparent pointer-events-none z-10" style={{ backgroundSize: '50% 100%', backgroundRepeat: 'no-repeat' }} />
      </div>
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
    machineType: 'printer' as const,
  },
  {
    icon: Wrench,
    title: 'Workflow Automation',
    subtitle: 'Custom Builds',
    description: 'Remove repetitive documentation from engineering and construction workflows. Field data, checklists, and more.',
    features: ['Field data ingestion', 'Inspection checklists', 'Site documentation', 'White-labeled tools'],
    href: '/services',
    machineType: 'conveyor' as const,
  },
  {
    icon: BarChart3,
    title: 'Engineering Dashboards',
    subtitle: 'Data Visualization',
    description: 'Turn raw technical data into actionable insight. Instrumentation, construction tracking, and live field ops views.',
    features: ['Instrument dashboards', 'Construction tracking', 'Map-based views', 'Shareable dashboards'],
    href: '/services',
    machineType: 'controlPanel' as const,
  },
  {
    icon: Layers,
    title: 'Internal Tools',
    subtitle: 'Lightweight Apps',
    description: 'Rapid engineering calculators and tools that mirror your workflows without the overhead of a full platform.',
    features: ['Cost estimators', 'Asset tracking', 'Pilot tools', 'Secure deployment'],
    href: '/services',
    machineType: 'toolbox' as const,
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
      <GallerySection3D items={services} />
    </SectionWithHeader>
  );
}

// =============================================================================
// Reportly Section — Immersive editorial layout
// =============================================================================

function ReportlySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  const featureItems = [
    'Works with templates you already use',
    'Charts, tables, and photos from live data',
    'Brand-consistent, QA-ready output',
    'No changes to your existing workflow',
  ];

  return (
    <Section divider>
      <AnimatedContent
        distance={50}
        direction="vertical"
        duration={0.9}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.15}
      >
        {/* Outer wrapper — full-bleed feel with clipped overflow */}
        <div
          ref={sectionRef}
          className="relative rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0c1a15 0%, #091211 50%, #0a0f1a 100%)' }}
        >

          {/* ── Ambient background glow ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            {/* Large emerald bloom — top-left */}
            <div
              className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.12]"
              style={{ background: 'radial-gradient(circle, #00ffcc 0%, transparent 65%)' }}
            />
            {/* Cyan accent — bottom-right */}
            <div
              className="absolute -bottom-24 right-0 w-[380px] h-[380px] rounded-full opacity-[0.08]"
              style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 65%)' }}
            />
            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0,255,204,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.4) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* ── Top label bar ── */}
          <div className="relative flex items-center justify-between px-8 md:px-12 pt-8 pb-0">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#00ffcc]/50 font-medium">
              Flagship Product
            </span>
            <a
              href="https://reportly.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#00ffcc]/40 hover:text-[#00ffcc] transition-colors duration-300"
            >
              reportly.ca
              <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </a>
          </div>

          {/* ── Main content grid ── */}
          <div className="relative grid lg:grid-cols-[1fr_1.1fr] gap-0">

            {/* LEFT — Text content */}
            <div className="flex flex-col justify-between px-8 md:px-12 pt-10 pb-10 lg:pb-14">

              {/* Wordmark */}
              <div>
                <h2
                  className="text-[4.5rem] sm:text-[5.5rem] lg:text-[6rem] font-black leading-[0.88] tracking-[-0.04em] mb-2 select-none"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #a8f0e0 40%, #00ffcc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Reportly
                  <br />
                </h2>

                <p className="text-gray-400 text-[0.95rem] leading-relaxed max-w-sm mb-8 mt-5">
                  Our flagship report automation engine. Plug in your existing Word
                  templates, feed in data, and get review-ready documents — with none
                  of the formatting overhead.
                </p>

                {/* Feature list — horizontal pill style */}
                <ul className="flex flex-col gap-2.5 mb-10">
                  {featureItems.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: 'easeOut' }}
                      className="flex items-center gap-3 text-sm text-gray-300"
                    >
                      {/* Custom tick */}
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(0,255,204,0.12)', border: '1px solid rgba(0,255,204,0.25)' }}
                      >
                        <Check className="w-3 h-3 text-[#00ffcc]" />
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <VibeLinkButton href="/reportly" variant="primary">
                  Learn About Reportly
                </VibeLinkButton>
                <VibeLinkButton href="/contact" variant="outline">
                  Schedule Demo
                </VibeLinkButton>
              </div>
            </div>

            {/* RIGHT — Preview, inset with its own treatment */}
            <div className="relative flex items-center justify-center p-6 md:p-10 lg:pt-10 lg:pb-10">

              {/* Inner card — elevated from background */}
              <div
                className="relative w-full rounded-xl overflow-hidden"
                style={{
                  boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,204,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                  background: 'rgba(10,12,18,0.8)',
                }}
              >
                {/* Faint top glow on the card */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,204,0.4), transparent)' }}
                />

                {/* Micro browser chrome */}
                <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.06]"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                  <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                  <span className="ml-2 flex-1 text-[9px] text-gray-500 tracking-wide truncate">
                    <a
                      href="https://reportly.ca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-2 flex-1 bg-white/5 rounded px-2 py-0.5 text-[9px] text-gray-400 hover:text-[#00ffcc] tracking-wide truncate transition-colors duration-200 cursor-pointer"
                    >
                      reportly.ca - Try Now! ↗
                    </a>
                  </span>
                </div>

                <div className="p-4 md:p-6">
                  <ReportlyHomepagePreview />
                </div>
              </div>
            </div>

          </div>

          {/* ── Bottom stat strip ── */}
          <div
            className="relative grid grid-cols-3 border-t"
            style={{ borderColor: 'rgba(0,255,204,0.08)' }}
          >
            {[
              { value: '3 min', label: 'avg. report time' },
              { value: '100%', label: 'template-compatible' },
              { value: '0 changes', label: 'to your workflow' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`px-8 py-5 flex flex-col gap-0.5 ${i < 2 ? 'border-r' : ''}`}
                style={{ borderColor: 'rgba(0,255,204,0.08)' }}
              >
                <span className="text-xl font-bold text-white tracking-tight">{stat.value}</span>
                <span className="text-[11px] text-gray-500 uppercase tracking-[0.15em]">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>
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
      <div className="grid md:grid-cols-3 gap-5">
        {processSteps.map((step, i) => (
          <AnimatedContent
            key={step.step}
            distance={24}
            direction="vertical"
            duration={0.7}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={i * 0.15}
          >
            <div className="group relative border border-white/8 rounded-xl p-7 bg-white/[0.02] h-full flex flex-col overflow-hidden transition-colors duration-300 hover:border-[#00ffcc]/20 hover:bg-white/[0.035]">
              {/* Step number — large ghost */}
              <span className="block text-[4rem] font-black text-white/[0.05] leading-none mb-4 tracking-tight select-none group-hover:text-[#00ffcc]/[0.07] transition-colors duration-500">
                {step.step}
              </span>
              {/* Thin accent line */}
              <div className="w-8 h-px bg-[#00ffcc]/30 mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          </AnimatedContent>
        ))}
      </div>
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
        distance={40}
        direction="vertical"
        duration={0.8}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.3}
      >
        <div className="relative rounded-2xl overflow-hidden text-center max-w-3xl mx-auto">
          {/* Background treatment — diagonal split */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(150deg, #0d1a14 0%, #080d0d 60%, #090912 100%)',
            }}
          />
          {/* Accent glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px"
            style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(0,255,204,0.3) 40%, rgba(0,255,204,0.3) 60%, transparent 95%)' }}
          />
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full opacity-[0.09] pointer-events-none"
            style={{ background: 'radial-gradient(circle, #00ffcc 0%, transparent 70%)' }}
          />

          <div className="relative px-10 md:px-16 py-14 md:py-16">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#00ffcc]/50 mb-5">
              Ready to move faster?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Get your engineering time back.
            </h2>
            <p className="text-gray-400 mb-10 max-w-md mx-auto leading-relaxed text-[0.95rem]">
              We automate reporting and documentation so your team can focus on
              engineering — and deliver more per project.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <VibeLinkButton href="/contact" variant="primary" size="lg">
                Book a Vibe Check
              </VibeLinkButton>
              <VibeLinkButton href="/services" variant="outline" size="lg">
                Explore Our Services
              </VibeLinkButton>
            </div>
          </div>
        </div>
      </AnimatedContent>
    </Section>
  );
}