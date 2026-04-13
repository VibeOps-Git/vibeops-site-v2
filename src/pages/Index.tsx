// src/pages/Index.tsx

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { FileText, Wrench, BarChart3, Layers, Check, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useRef, useEffect, useState, ReactNode } from 'react';
import { SEO } from '@/components/SEO';
import { ScrambleText } from '@/components/ScrambleText';
import { GallerySection3D } from '../components/3d';
import { HomepageDeviceStage } from '@/components/homepage/DeviceScene';
import { HOMEPAGE_EASE, HOMEPAGE_MOTION } from '@/components/homepage/motion';

// Hero uses the branded demo video (full background)
const HERO_VIDEO_SRC = '/vids/demo-vid.mp4';
// Platform section uses the polished corporate demo
const PLATFORM_VIDEO_SRC = '/vids/Product Demo Video in Green Blue Cool Corporate Style (1).mp4';
// YouTube pitch embed shown in CTA
const PITCH_VIDEO_SRC =
  'https://www.youtube.com/embed/GIVzfvtqk3Y?autoplay=1&mute=1&loop=1&playlist=GIVzfvtqk3Y&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1';

const TICKER_ITEMS = [
  { type: 'logo' as const, src: '/clients/SenseEngineering.png', alt: 'Sense Engineering' },
  { type: 'logo' as const, src: '/clients/ubc-eng.jpg', alt: 'UBC Engineering' },
  { type: 'text' as const, label: 'Techcouver', url: 'https://techcouver.com/2026/03/30/ubc-ventures-take-stage-at-investor-showcase/' },
  { type: 'text' as const, label: 'UBC Investor Showcase', url: 'https://innovation.ubc.ca/news/march-03-2026/meet-12-ubc-ventures-presenting-innovation-ubcs-2026-investor-showcase' },
  { type: 'text' as const, label: 'Venture Founder Cohort', url: 'https://innovation.ubc.ca/news/february-02-2026/meet-51st-venture-founder-cohort' },
  { type: 'text' as const, label: 'Investor Spotlight', url: 'https://www.linkedin.com/feed/update/urn:li:share:7442251270310227970' },
];

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : HOMEPAGE_MOTION.revealDistance,
        filter: reducedMotion ? 'blur(0px)' : HOMEPAGE_MOTION.revealBlur,
      }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={HOMEPAGE_MOTION.viewport}
      transition={{ duration: HOMEPAGE_MOTION.revealDuration, delay, ease: HOMEPAGE_EASE }}
    >
      {children}
    </motion.div>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.065, delayChildren: 0.03 } },
};
const item = {
  hidden: { opacity: 0, y: HOMEPAGE_MOTION.revealDistance, filter: HOMEPAGE_MOTION.revealBlur },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: HOMEPAGE_MOTION.revealDuration, ease: HOMEPAGE_EASE } },
};

function useCountUp(target: number, duration = 1.8) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    // Use framer-motion animate for smoother easing + proper cleanup
    import('framer-motion').then(({ animate }) => {
      const controls = animate(0, target, {
        duration,
        ease: HOMEPAGE_EASE,
        onUpdate: (v) => setVal(Math.round(v)),
      });
      return () => controls.stop();
    });
  }, [inView, target, duration]);
  return { ref, val };
}

function Rule({ className }: { className?: string }) {
  return (
    <motion.div
      className={`h-px bg-white/8 origin-left ${className ?? ''}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: HOMEPAGE_EASE }}
    />
  );
}

// Infinite CSS marquee - 2 copies, translates -50% for a perfect loop
function InfiniteMarquee({ speed = 35 }: { speed?: number }) {
  return (
    <div className="overflow-hidden w-full select-none">
      <div
        className="flex whitespace-nowrap w-max"
        style={{ animation: `marquee-scroll ${speed}s linear infinite` }}
      >
        {[0, 1].map((pass) => (
          <span key={pass} className="flex items-center shrink-0">
            {TICKER_ITEMS.map((t, i) => (
              <span key={`${pass}-${i}`} className="inline-flex items-center gap-3 px-6">
                {t.type === 'logo' ? (
                  <img
                    src={t.src}
                    alt={t.alt}
                    className="h-7 w-auto max-w-[90px] object-contain opacity-40 hover:opacity-65 transition-opacity duration-300 grayscale brightness-150"
                    loading="lazy"
                  />
                ) : (
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-[0.28em] text-white/35 hover:text-white/70 transition-colors duration-200 font-medium"
                  >
                    {t.label}
                  </a>
                )}
                <span className="w-1 h-1 rounded-full bg-white/15 flex-shrink-0" aria-hidden="true" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Section transition bridge
// =============================================================================

/** Renders a gradient sliver that visually connects two sections.
 *  fromColor / toColor are full CSS color values (hex, hsl, etc.). */
function SectionBridge({ from, to, height = 80 }: { from: string; to: string; height?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        height,
        background: `linear-gradient(to bottom, ${from}, ${to})`,
        marginTop: -1,
        marginBottom: -1,
        position: 'relative',
        zIndex: 1,
      }}
    />
  );
}

// =============================================================================
// Page
// =============================================================================

export default function Index() {
  return (
    <>
      <SEO
        title="AI Engineering Report Automation | VibeOps Technologies"
        description="VibeOps automates engineering reports, documentation, and workflows for civil and construction teams. Replace hours of manual formatting with AI-powered report generation in minutes."
        canonical="https://www.vibeops.ca/"
      />
      <HeroSection />
      <SectionBridge from="#050912" to="#08111b" height={8} />
      <PlatformSection />
      <SectionBridge from="#08111b" to="#060b14" height={88} />
      <FeaturesSection />
      <ReportlySection />
      <ProcessSection />
      <TeamSection />
      <CTASection />
      {/* Hidden internal links for SEO crawlability */}
      <div aria-hidden="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
        <a href="/services">AI engineering automation services for civil and construction teams</a>
        <a href="/reportly">Reportly - AI report writing software for civil engineers</a>
        <a href="/contact">Book a demo for engineering report automation</a>
        <a href="/team">Meet the VibeOps engineering automation team</a>
        <a href="/blog">AI tools for civil engineering report writing and documentation</a>
        <a href="https://reportly.ca" rel="noopener">Reportly - automated engineering report generator</a>
      </div>
    </>
  );
}

// =============================================================================
// Hero
// =============================================================================

const heroStats = [
  { value: 80, suffix: '%+', label: 'Documentation Time Saved' },
  { value: 3, suffix: ' min', label: 'Avg. Report Generation Time' },
  { value: 100, suffix: '%', label: 'Existing Template Compatible' },
];

function HeroStatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, val } = useCountUp(value, 1.8);
  return (
    <div className="flex flex-col items-center sm:items-start">
      <span ref={ref} className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
        {val}{suffix}
      </span>
      <span className="text-[11px] text-white/50 mt-1 leading-tight text-center sm:text-left">{label}</span>
    </div>
  );
}

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const deviceY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 18 : 48]);
  const deviceOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 10 : 26]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col overflow-hidden bg-[#050912]"
      aria-label="VibeOps - AI Engineering Report Automation for Civil & Construction"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1660px] flex-1 flex-col px-6 pt-24 sm:px-10 md:flex-row md:items-center md:pl-16 md:pr-0 md:pt-28 lg:pl-22 xl:pl-28">
        <motion.div
          className="flex flex-col justify-center pb-8 pt-6 md:w-[32%] md:min-w-[340px] md:pb-12 md:pt-0 xl:w-[30%]"
          style={{ y: contentY }}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.a
            variants={item}
            href="https://reportly.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mb-7 w-fit px-4 py-2 rounded-full border border-emerald-400/20 bg-white/[0.03] shadow-[0_12px_30px_rgba(0,0,0,0.24)] backdrop-blur-md hover:border-emerald-400/40 hover:bg-white/[0.05] transition-colors duration-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-45" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-[0.28em]">Reportly</span>
            <span className="text-[10px] text-white/28">Early Access</span>
          </motion.a>

          <motion.h1
            variants={item}
            className="font-bold leading-[0.88] tracking-[-0.065em] mb-5"
            style={{ fontSize: 'clamp(3rem, 5vw, 5.8rem)' }}
          >
            <span className="block text-white">Less formatting.</span>
            <span className="block text-emerald-300">More engineering.</span>
          </motion.h1>

          <motion.p variants={item} className="mb-8 max-w-[32rem] text-[1.14rem] leading-[1.72] text-white/52 lg:text-[1.2rem]">
            AI-powered report automation for civil and construction teams. Plug in your templates and project data, get polished output in minutes.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-4 mb-4">
            <motion.a
              href="https://reportly.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400 text-black text-[15px] font-bold hover:from-emerald-200 hover:to-emerald-300 transition-colors duration-200"
              style={{ boxShadow: '0 18px 46px rgba(52, 211, 153, 0.18)' }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={HOMEPAGE_MOTION.hoverSpring}
            >
              Get Started Free <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
            <Btn href="/services">See What We Build</Btn>
          </motion.div>

          <motion.p variants={item} className="max-w-[24rem] text-[12px] text-white/25 tracking-wide tabular-nums">
            No credit card required · Free during early access
          </motion.p>
        </motion.div>

        <motion.div
          className="relative flex w-full flex-shrink-0 items-center justify-center self-stretch overflow-hidden pb-2 pt-2 md:w-[68%] md:overflow-visible md:pb-0 md:pt-0 xl:w-[70%]"
          style={{ y: deviceY, opacity: deviceOpacity, perspective: 1200 }}
        >
          <motion.div
            className="flex h-full w-full items-center md:ml-4 md:mr-0 lg:ml-6 xl:ml-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={HOMEPAGE_MOTION.heroFade}
          >
            <HomepageDeviceStage videoSrc={HERO_VIDEO_SRC} />
          </motion.div>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="relative z-10 h-8 w-full pointer-events-none md:hidden"
        style={{ background: '#050912', marginBottom: -1 }}
      />

      <div className="relative z-10 w-full border-t border-white/6 bg-[#050912]/70 backdrop-blur-md">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 py-6">
          <div className="grid grid-cols-3 gap-4 text-center sm:text-left sm:flex sm:justify-evenly sm:gap-0">
            {heroStats.map((s) => (
              <HeroStatItem key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full border-t border-white/5 bg-[#050912] pt-5 pb-1 overflow-hidden">
        <p className="text-center text-[9px] uppercase tracking-[0.38em] text-white/25 mb-4 font-medium px-6">
          Trusted by Engineering Professionals &amp; Featured In
        </p>
        <InfiniteMarquee speed={35} />
      </div>
    </section>
  );
}

// =============================================================================
// Helpers
// =============================================================================

function Btn({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return (
    <motion.a
      href={href}
      className={`inline-flex items-center gap-2 px-7 py-3 rounded-full text-[15px] font-semibold transition-colors duration-300 ${
        primary
          ? 'bg-gradient-to-r from-emerald-300 to-emerald-400 text-black hover:from-emerald-200 hover:to-emerald-300'
          : 'border border-white/14 bg-white/[0.03] text-white/78 hover:border-white/28 hover:bg-white/[0.06] hover:text-white'
      }`}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      transition={HOMEPAGE_MOTION.hoverSpring}
    >
      {children}
    </motion.a>
  );
}

// =============================================================================
// Trusted By - infinite scrolling ticker
// =============================================================================


// =============================================================================
// Platform Showcase
// =============================================================================

function PlatformSection() {
  return (
    <section className="relative overflow-hidden bg-[#08111b] pt-16 pb-24 md:pt-20 md:pb-32" data-testid="platform-section">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 18% 16%, rgba(125, 211, 252, 0.06) 0%, transparent 24%),
            radial-gradient(circle at 82% 28%, rgba(16, 185, 129, 0.08) 0%, transparent 28%),
            linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 24%)
          `,
        }}
      />
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <p className="text-center text-[10px] uppercase tracking-[0.38em] text-emerald-300/80 mb-5 font-semibold">
            One Platform
          </p>
          <h2 className="text-center text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-bold tracking-[-0.025em] text-white leading-[1.1] mb-5 max-w-3xl mx-auto">
            AI Tools for Report Writing,{' '}
            <span className="text-emerald-300">Workflows &amp; Engineering</span>
            <br />
            <span className="text-cyan-200">Documentation</span>
          </h2>
          <p className="text-center text-[0.95rem] text-white/48 max-w-xl mx-auto mb-12 leading-[1.8]">
            Replace hours of manual civil engineering documentation with minutes of automated, QA-ready output - without changing a single thing about how your team works.
          </p>
          <div className="flex justify-center mb-14">
            <Btn href="/services" primary>Explore the Platform <ArrowRight className="w-3.5 h-3.5" /></Btn>
          </div>
        </Reveal>

        <motion.div
          className="relative rounded-[1.75rem] overflow-hidden border border-white/10 bg-[#0b1624] shadow-[0_28px_80px_rgba(0,0,0,0.42)]"
          initial={{ opacity: 0, y: HOMEPAGE_MOTION.revealDistance, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={HOMEPAGE_MOTION.viewport}
          transition={HOMEPAGE_MOTION.cardReveal}
          role="img"
          aria-label="VibeOps engineering report automation platform demo"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1928] border-b border-white/8">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" aria-hidden="true" />
            <a
              href="https://reportly.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 flex-1 text-[10px] text-white/32 hover:text-emerald-300 tracking-[0.18em] uppercase truncate transition-colors"
            >
              reportly.ca - AI Engineering Report Automation Software
            </a>
          </div>

          <div className="relative aspect-video bg-black">
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-black/20 via-transparent to-white/5" />
            <video
              src={PLATFORM_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              aria-label="Reportly AI report automation demo video"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// Features
// =============================================================================

const services = [
  {
    icon: FileText, title: 'Report Automation', subtitle: 'Reportly Engine',
    description: 'Transform hours of manual formatting into minutes using your existing templates.',
    features: ['Template automation', 'Charts & tables from live data', 'Photo appendices', 'QA-ready output'],
    href: '/services#reportly', highlight: true, machineType: 'printer' as const,
  },
  {
    icon: Wrench, title: 'Workflow Automation', subtitle: 'Custom Builds',
    description: 'Remove repetitive documentation from engineering and construction workflows.',
    features: ['Field data ingestion', 'Inspection checklists', 'Site documentation', 'White-labeled tools'],
    href: '/services', machineType: 'conveyor' as const,
  },
  {
    icon: BarChart3, title: 'Engineering Dashboards', subtitle: 'Data Visualization',
    description: 'Turn raw technical data into actionable insight for instrumentation and construction tracking.',
    features: ['Instrument dashboards', 'Construction tracking', 'Map-based views', 'Shareable dashboards'],
    href: '/services', machineType: 'controlPanel' as const,
  },
  {
    icon: Layers, title: 'Internal Tools', subtitle: 'Lightweight Apps',
    description: 'Rapid engineering calculators and tools that mirror your workflows without overhead.',
    features: ['Cost estimators', 'Asset tracking', 'Pilot tools', 'Secure deployment'],
    href: '/services', machineType: 'toolbox' as const,
  },
];

function FeaturesSection() {
  return (
    <section className="bg-[#060b14] pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <Label>What We Build</Label>
          {/* h2 targets "engineering automation" + "civil engineering" */}
          <h2 className="text-[2.2rem] sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] text-white max-w-2xl mb-5 leading-[1.08] mt-4">
            Engineering automation for civil &amp; construction teams.
          </h2>
          <p className="text-white/40 text-sm md:text-[0.95rem] max-w-lg mb-16 leading-[1.8]">
            We eliminate repetitive civil engineering documentation and reporting so your team can deliver more per project.
          </p>
        </Reveal>

        <motion.div
          className="rounded-2xl overflow-hidden border border-white/8 mb-16"
          initial={{ opacity: 0, clipPath: 'inset(6% 0% 6% 0% round 16px)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: HOMEPAGE_EASE }}
        >
          <img
            src="/reportly-features.png"
            alt="Reportly AI report automation features - template engine, data integration, and QA-ready output for civil engineering"
            className="w-full object-cover"
            loading="lazy"
          />
        </motion.div>

        <GallerySection3D items={services} />
      </div>
    </section>
  );
}

// =============================================================================
// Reportly
// =============================================================================

const featureItems = [
  'Works with the Word templates you already use',
  'Charts, tables, and photos from live engineering data',
  'Brand-consistent, QA-ready civil engineering reports',
  'No changes to your existing workflow',
];

const stats = [
  { value: 80, suffix: '%+', label: 'Time saved on documentation' },
  { value: 3, suffix: ' min', label: 'Avg. report generation time' },
  { value: 100, suffix: '%', label: 'Template compatible' },
];

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, val } = useCountUp(value);
  return (
    <div className="px-7 sm:px-10 py-7 flex flex-col gap-1.5">
      <span ref={ref} className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums">
        {val}{suffix}
      </span>
      <span className="text-[10px] text-white/35 uppercase tracking-[0.14em]">{label}</span>
    </div>
  );
}

function ReportlySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [35, -35]);

  return (
    <section className="border-t border-white/6 bg-[#060b14] pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10" ref={sectionRef}>

        <Reveal>
          <div className="flex items-center justify-between mb-14">
            <Label>Flagship Product</Label>
            <motion.a href="https://reportly.ca" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/70 transition-colors duration-200"
              whileHover={{ x: 1 }} transition={{ duration: 0.15 }}>
              reportly.ca <ArrowUpRight className="w-3 h-3" />
            </motion.a>
          </div>
        </Reveal>

        <Rule className="mb-14" />

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 lg:gap-20 items-start">
          <div>
            <Reveal>
              <h2 className="text-[4rem] sm:text-[5rem] font-black tracking-[-0.04em] text-white leading-none mb-6">
                <ScrambleText text="Reportly" duration={2.2} trigger="inView" />
              </h2>
              <p className="text-white/45 text-sm md:text-[0.95rem] leading-[1.8] max-w-xs mb-10">
                Our flagship AI report writing tool for civil engineers. Connect your existing Word templates, feed in field data, and get review-ready engineering reports - automatically.
              </p>
            </Reveal>

            <motion.ul
              className="flex flex-col gap-3.5 mb-10"
              variants={{ ...stagger, show: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              {featureItems.map((fi) => (
                <motion.li key={fi} variants={item} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full border border-emerald-600/50 flex items-center justify-center bg-emerald-950/60">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </span>
                  {fi}
                </motion.li>
              ))}
            </motion.ul>

            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-3">
                <Btn href="/reportly" primary>Learn About Reportly</Btn>
                <Btn href="/contact">Schedule Demo</Btn>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <motion.div
              className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
              style={{ y: imgY }}
              whileHover={{ scale: 1.012, borderColor: 'rgba(52,211,153,0.2)' }}
              transition={HOMEPAGE_MOTION.gentleSpring}
            >
              <img
                src="/app-preview.png"
                alt="Reportly engineering report automation software - automated civil engineering reports in minutes"
                className="w-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </Reveal>
        </div>

        {/* Workflow bridge image */}
        <motion.div
          className="mt-20 rounded-2xl overflow-hidden border border-white/8"
          initial={{ opacity: 0, clipPath: 'inset(8% 0% 8% 0% round 16px)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.95, ease: HOMEPAGE_EASE }}
        >
          <img
            src="/reportly-bridge.png"
            alt="Engineering report automation workflow - from raw data to polished civil engineering documentation"
            className="w-full object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-5 grid grid-cols-3 border border-white/8 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12, ease: HOMEPAGE_EASE }}
        >
          {stats.map((s, i) => (
            <div key={s.label} className={i < 2 ? 'border-r border-white/8' : ''}>
              <StatCard {...s} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// Process
// =============================================================================

const processSteps = [
  {
    step: '01', title: 'Discovery',
    description: 'We review your actual civil engineering workflows, tools, and processes. No theoretical frameworks - just how your reporting and documentation really gets done.',
  },
  {
    step: '02', title: 'Prototype',
    description: 'We build a narrow but complete automation: ingest data, generate the report, and walk it through your QA process.',
  },
  {
    step: '03', title: 'Rollout',
    description: 'Once the first workflow is trusted, we expand carefully. Proper versioning, access control, and full documentation.',
  },
];

function ProcessSection() {
  return (
    <section className="border-t border-white/6 bg-[#060b14] pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <Label>How We Work</Label>
          <h2 className="text-[2.2rem] sm:text-4xl font-bold tracking-[-0.025em] text-white mb-5 mt-4">
            Custom engineering automation.
          </h2>
          <p className="text-white/40 text-sm md:text-[0.95rem] max-w-md mb-14 leading-[1.8]">
            We get one workflow right before moving to the next. Each civil engineering team is different - we build to fit yours.
          </p>
        </Reveal>

        <Rule className="mb-14" />

        <motion.div
          className="grid md:grid-cols-3 gap-3"
          variants={{ ...stagger, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {processSteps.map((step) => (
            <motion.div
              key={step.step}
              variants={{
                hidden: { opacity: 0, y: 24, filter: 'blur(5px)' },
                show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: HOMEPAGE_MOTION.revealDuration, ease: HOMEPAGE_EASE } },
              }}
              className="group relative border border-white/8 rounded-2xl p-8 flex flex-col overflow-hidden cursor-default"
              whileHover={{ borderColor: 'rgba(52,211,153,0.2)', y: -3 }}
              transition={HOMEPAGE_MOTION.gentleSpring}
            >
              <motion.div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)' }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              />
              <span className="block text-[3.5rem] font-black text-white/10 leading-none mb-5 tracking-tight select-none">
                {step.step}
              </span>
              <div className="w-5 h-px bg-white/12 mb-5 group-hover:bg-emerald-500/60 transition-colors duration-500" />
              <h3 className="text-[13px] font-semibold text-white/90 mb-2 tracking-tight">{step.title}</h3>
              <p className="text-[13px] text-white/40 leading-[1.75]">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// Team
// =============================================================================

const teamMembers = [
  { name: 'Zander Dent', role: 'CEO', image: '/team/zander-optimized.jpg' },
  { name: 'Félix Stewart', role: 'Sales & Ops', image: '/team/felix-optimized.jpg' },
  { name: 'Gabriel Comla', role: 'CMO', image: '/team/gabriel-optimized.jpg' },
  { name: 'Eric Balanecki', role: 'CTO', image: '/team/eric-optimized.jpg' },
  { name: 'Qazi Omair Ahmed', role: 'Head of Eng.', image: '/team/omair-optimized.jpg' },
];

function TeamSection() {
  return (
    <section className="border-t border-white/6 bg-[#060b14] pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
            <div>
              <Label>The People</Label>
              <h2 className="text-[2.2rem] sm:text-4xl font-bold tracking-[-0.025em] text-white mt-4">
                Built by engineers, for engineers.
              </h2>
            </div>
            <motion.a
              href="/team"
              className="flex items-center gap-1.5 text-[11px] text-white/30 uppercase tracking-[0.15em] hover:text-white/70 transition-colors duration-200"
              whileHover={{ x: 1 }}
              transition={{ duration: 0.15 }}
            >
              Full team <ArrowUpRight className="w-3 h-3" />
            </motion.a>
          </div>
        </Reveal>

        <Rule className="mb-14" />

        <Reveal className="mb-12">
          <motion.div
            className="relative rounded-2xl overflow-hidden border border-white/8"
              whileHover={{ borderColor: 'rgba(255,255,255,0.14)' }}
            transition={{ duration: 0.3, ease: HOMEPAGE_EASE }}
          >
            <img
              src="/team/full-team-pic-optimized.jpg"
              alt="VibeOps Technologies founding team - engineering automation specialists based in Vancouver, BC"
              className="w-full object-cover object-center"
              style={{ maxHeight: 420 }}
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 px-8 py-7 flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-white/40 mb-1">VibeOps Technologies Inc. - Vancouver, BC</p>
                <p className="text-base md:text-lg font-semibold text-white">Building AI tools for civil engineering teams.</p>
              </div>
              <Btn href="/contact" primary>Talk to the Team</Btn>
            </div>
          </motion.div>
        </Reveal>

        <motion.div
          className="flex justify-center gap-8 sm:gap-12 flex-wrap"
          variants={{ ...stagger, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {teamMembers.map((member) => (
            <motion.a
              key={member.name}
              href={`/team?member=${encodeURIComponent(member.name)}`}
              variants={{
                hidden: { opacity: 0, y: 14, filter: 'blur(5px)' },
                show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.48, ease: HOMEPAGE_EASE } },
              }}
              className="flex flex-col items-center gap-2.5 group"
              whileHover={{ y: -3 }}
              transition={HOMEPAGE_MOTION.hoverSpring}
            >
              <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden border border-white/12 group-hover:border-emerald-500/40 transition-colors duration-300">
                <img
                  src={member.image}
                  alt={`${member.name} - ${member.role} at VibeOps Technologies`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="text-center">
                <p className="text-[12px] font-medium text-white/75 leading-tight">{member.name.split(' ')[0]}</p>
                <p className="text-[10px] text-white/30 leading-tight mt-0.5">{member.role}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// CTA
// =============================================================================

function CTASection() {
  return (
    <section className="border-t border-white/6 bg-[#060b14] pt-28 pb-24 md:pt-36">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Rule className="mb-20" />

        {/* CTA copy */}
        <motion.div
          className="max-w-xl mb-20"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={item}>
            <Label>Ready to move faster?</Label>
          </motion.div>
          <motion.h2
            variants={item}
            className="text-[2.5rem] sm:text-5xl md:text-[3.5rem] font-bold tracking-[-0.03em] text-white mb-6 mt-4 leading-[1.06]"
          >
            <ScrambleText text="Get your engineering time back." duration={1.0} />
          </motion.h2>
          <motion.p variants={item} className="text-white/40 text-sm md:text-[0.95rem] leading-[1.8] mb-10 max-w-sm">
            Automate your civil engineering reports and documentation so your team can focus on what matters - and deliver more per project.
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-3">
            <Btn href="/contact" primary>Book a Demo <ArrowRight className="w-3.5 h-3.5" /></Btn>
            <Btn href="/services">Explore Our Services</Btn>
          </motion.div>
        </motion.div>

        {/* YouTube pitch embed */}
        <motion.div
          className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
          style={{ paddingBottom: '56.25%', height: 0 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: HOMEPAGE_EASE }}
        >
          <iframe
            src={PITCH_VIDEO_SRC}
            allow="autoplay; encrypted-media"
            title="VibeOps engineering automation platform pitch - AI report writing for civil engineers"
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// Label
// =============================================================================

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-500/70 font-semibold">
      {children}
    </p>
  );
}
