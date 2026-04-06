// src/pages/Index.tsx

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  type MotionValue,
} from 'framer-motion';
import { FileText, Wrench, BarChart3, Layers, Check, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useRef, useEffect, useState, useCallback, ReactNode } from 'react';
import { SEO } from '@/components/SEO';
import { ScrambleText } from '@/components/ScrambleText';
import { GallerySection3D } from '../components/3d';

const DEMO_VIDEO_SRC = '/vids/Product Demo Video in Green Blue Cool Corporate Style (1).mp4';
const PITCH_VIDEO_SRC =
  'https://www.youtube.com/embed/GIVzfvtqk3Y?autoplay=1&mute=1&loop=1&playlist=GIVzfvtqk3Y&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1';

const pressLinks = [
  { label: 'Techcouver', url: 'https://techcouver.com/2026/03/30/ubc-ventures-take-stage-at-investor-showcase/' },
  { label: 'UBC Investor Showcase', url: 'https://innovation.ubc.ca/news/march-03-2026/meet-12-ubc-ventures-presenting-innovation-ubcs-2026-investor-showcase' },
  { label: 'Venture Founder Cohort', url: 'https://innovation.ubc.ca/news/february-02-2026/meet-51st-venture-founder-cohort' },
  { label: 'Investor Spotlight', url: 'https://www.linkedin.com/feed/update/urn:li:share:7442251270310227970' },
];

const partnerLogos = [
  { src: '/clients/SenseEngineering.png', alt: 'Sense Engineering' },
  { src: '/clients/ubc-eng.jpg', alt: 'UBC Engineering' },
];

// =============================================================================
// Constants
// =============================================================================

const EASE = [0.22, 1, 0.36, 1] as const;

// =============================================================================
// Shared primitives
// =============================================================================

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 18, filter: 'blur(5px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE } },
};

function useCountUp(target: number, duration = 1.4) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return { ref, val };
}

function Rule({ className }: { className?: string }) {
  return (
    <motion.div
      className={`h-px bg-zinc-800/80 origin-left ${className ?? ''}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: EASE }}
    />
  );
}

// Infinite marquee
function Marquee({ children, speed = 38 }: { children: ReactNode; speed?: number }) {
  const [x, setX] = useState(0);
  const innerRef = useRef<HTMLDivElement>(null);
  const last = useRef(0);
  const raf = useRef(0);
  useEffect(() => {
    const tick = (ts: number) => {
      const dt = last.current ? ts - last.current : 0;
      last.current = ts;
      setX((prev) => {
        const w = (innerRef.current?.offsetWidth ?? 0) / 2;
        const n = prev - (speed * dt) / 1000;
        return w && n <= -w ? 0 : n;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [speed]);
  return (
    <div className="overflow-hidden w-full">
      <div ref={innerRef} className="flex whitespace-nowrap will-change-transform" style={{ transform: `translateX(${x}px)` }}>
        {children}{children}
      </div>
    </div>
  );
}

// =============================================================================
// Page
// =============================================================================

export default function Index() {
  return (
    <>
      <SEO
        title="VibeOps Technologies"
        description="Engineering automation for civil, construction, and infrastructure teams."
        canonical="https://www.vibeops.ca/"
      />
      <HeroSection />
      <LogoTicker />
      <FeaturesSection />
      <ReportlySection />
      <ProcessSection />
      <TeamSection />
      <CTASection />
      <div aria-hidden="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
        <a href="/services">Engineering automation services for civil and construction teams</a>
        <a href="/reportly">Reportly — automated engineering report generation software</a>
        <a href="/contact">Book a discovery call with VibeOps Technologies</a>
        <a href="/team">Meet the VibeOps engineering automation team</a>
        <a href="/blog">Engineering automation insights and case studies</a>
        <a href="https://reportly.ca" rel="noopener">Reportly report automation platform</a>
      </div>
    </>
  );
}

// =============================================================================
// Hero
// =============================================================================

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useSpring(mouseX, { stiffness: 55, damping: 22 });
  const spotY = useSpring(mouseY, { stiffness: 55, damping: 22 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      className="relative lg:h-screen min-h-screen w-full flex overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Cursor spotlight */}
      <motion.div
        className="absolute pointer-events-none z-0 w-[700px] h-[700px] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ left: spotX, top: spotY, background: 'radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 60%)' }}
      />

      {/* ── Left panel ── */}
      <motion.div
        className="relative z-10 flex flex-col justify-between w-full lg:w-[50%] px-6 sm:px-12 lg:px-16 xl:px-20 pt-28 pb-10"
        style={{ y: contentY }}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <div className="flex flex-col">
          <motion.p variants={item} className="text-[10px] uppercase tracking-[0.35em] text-zinc-600 mb-6">
            Civil · Construction · Infrastructure
          </motion.p>

          <motion.h1
            variants={item}
            className="text-[2.75rem] sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-semibold leading-[1.06] tracking-[-0.02em] mb-6"
          >
            <ScrambleText text="Less formatting." className="text-white" trigger="mount" duration={0.5} />
            <br />
            <ScrambleText text="More engineering." className="text-emerald-400" trigger="mount" duration={1.0} />
          </motion.h1>

          <motion.p variants={item} className="text-[0.95rem] text-zinc-400 leading-[1.7] mb-8 max-w-[21rem]">
            We automate reporting and documentation so your engineering team can focus on delivering work — not formatting it.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3 mb-6">
            <Btn href="/contact" primary>Book a Vibe Check <ArrowRight className="w-3.5 h-3.5" /></Btn>
            <Btn href="/services">See What We Build</Btn>
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap gap-x-6 gap-y-2">
            {['Integrates with your existing tools', 'No workflow disruption'].map((t) => (
              <span key={t} className="flex items-center gap-2 text-[13px] text-zinc-500">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Demo card */}
        <motion.div variants={item} className="w-full mt-8 lg:max-w-[500px]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch lg:block">
            <motion.div
              className="flex-1 min-w-0 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/70"
              whileHover={{ borderColor: 'rgba(52,211,153,0.25)', y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-zinc-900 border-b border-zinc-800">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                <a href="https://reportly.ca" target="_blank" rel="noopener noreferrer"
                  className="ml-2 flex-1 text-[9px] text-zinc-500 hover:text-emerald-400 tracking-wide truncate transition-colors duration-200">
                  reportly.ca — Try Now ↗
                </a>
              </div>
              <video src={DEMO_VIDEO_SRC} autoPlay muted loop playsInline className="w-full aspect-video object-cover" />
            </motion.div>
            {/* Pitch — mobile only */}
            <div className="sm:w-[38%] sm:flex-shrink-0 lg:hidden rounded-xl overflow-hidden border border-zinc-800 relative" style={{ minHeight: 120 }}>
              <iframe src={PITCH_VIDEO_SRC} allow="autoplay; encrypted-media" title="VibeOps Pitch"
                className="absolute inset-0 w-full h-full pointer-events-none" style={{ border: 'none' }} />
            </div>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div variants={item} className="pt-6 border-t border-zinc-900 mt-5">
          <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-700 mb-4">Trusted By & Featured In</p>
          <div className="flex flex-wrap items-center gap-5">
            {partnerLogos.map((logo) => (
              <img key={logo.alt} src={logo.src} alt={logo.alt}
                className="h-4 w-auto object-contain opacity-20 hover:opacity-40 transition-opacity duration-300" />
            ))}
            <div className="hidden sm:block w-px h-3 bg-zinc-800" />
            {pressLinks.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.15em] text-zinc-700 hover:text-zinc-400 transition-colors duration-200">
                {link.label} ↗
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Right: video ── */}
      <div className="hidden lg:block absolute right-0 top-0 w-[54%] h-full overflow-hidden bg-black">
        <motion.div className="absolute inset-0" style={{ y: videoY, opacity: videoOpacity }}>
          <iframe src={PITCH_VIDEO_SRC} allow="autoplay; encrypted-media" title="VibeOps Pitch"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ border: 'none', transform: 'scale(1.45)', transformOrigin: 'center center' }} />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
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
      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-none ${
        primary
          ? 'bg-white text-black'
          : 'border border-zinc-700 text-zinc-300'
      }`}
      whileHover={primary
        ? { scale: 1.03, backgroundColor: '#e4e4e7' }
        : { scale: 1.03, borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      {children}
    </motion.a>
  );
}

// =============================================================================
// Logo ticker
// =============================================================================

const TICKER_ITEMS = [
  'Techcouver', 'UBC Investor Showcase', 'Venture Founder Cohort',
  'Investor Spotlight', 'Sense Engineering', 'UBC Engineering',
];

function LogoTicker() {
  return (
    <div className="border-t border-b border-zinc-900 bg-black py-3.5 overflow-hidden">
      <Marquee speed={36}>
        {TICKER_ITEMS.map((t) => (
          <span key={t} className="inline-flex items-center gap-6 px-8 text-[10px] uppercase tracking-[0.28em] text-zinc-700">
            {t}
            <span className="w-1 h-1 rounded-full bg-zinc-800 flex-shrink-0" />
          </span>
        ))}
      </Marquee>
    </div>
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
    <section className="bg-black pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <Label>What We Build</Label>
          <h2 className="text-[2.2rem] sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-white max-w-2xl mb-5 leading-[1.1] mt-4">
            <ScrambleText text="Engineering automation for real-world teams." duration={0.9} />
          </h2>
          <p className="text-zinc-500 text-sm md:text-[0.95rem] max-w-lg mb-16 leading-[1.75]">
            We eliminate repetitive reporting and documentation work so your team can deliver more engineering per project.
          </p>
        </Reveal>

        <motion.div
          className="rounded-2xl overflow-hidden border border-zinc-800/60 mb-16"
          initial={{ opacity: 0, clipPath: 'inset(6% 0% 6% 0% round 16px)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.0, ease: EASE }}
        >
          <img src="/reportly-features.png" alt="Reportly capabilities" className="w-full object-cover" />
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
  'Works with templates you already use',
  'Charts, tables, and photos from live data',
  'Brand-consistent, QA-ready output',
  'No changes to your existing workflow',
];

const stats = [
  { value: 3, suffix: ' min', label: 'avg. report time' },
  { value: 100, suffix: '%', label: 'template-compatible' },
  { value: 0, suffix: ' changes', label: 'to your workflow' },
];

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, val } = useCountUp(value);
  return (
    <div className="px-7 sm:px-10 py-7 flex flex-col gap-1.5">
      <span ref={ref} className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
        {val}{suffix}
      </span>
      <span className="text-[10px] text-zinc-600 uppercase tracking-[0.14em]">{label}</span>
    </div>
  );
}

function ReportlySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [35, -35]);

  return (
    <section className="border-t border-zinc-900 bg-black pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10" ref={sectionRef}>

        <Reveal>
          <div className="flex items-center justify-between mb-14">
            <Label>Flagship Product</Label>
            <motion.a href="https://reportly.ca" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors duration-200"
              whileHover={{ x: 1 }} transition={{ duration: 0.15 }}>
              reportly.ca <ArrowUpRight className="w-3 h-3" />
            </motion.a>
          </div>
        </Reveal>

        <Rule className="mb-14" />

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 lg:gap-20 items-start">
          <div>
            <Reveal>
              <h2 className="text-[4rem] sm:text-[5rem] font-bold tracking-[-0.04em] text-white leading-none mb-6">
                <ScrambleText text="Reportly" duration={2.0} />
              </h2>
              <p className="text-zinc-500 text-sm md:text-[0.95rem] leading-[1.75] max-w-xs mb-10">
                Our flagship report automation engine. Plug in your existing Word templates, feed in data, and get review-ready documents — with none of the formatting overhead.
              </p>
            </Reveal>

            <motion.ul className="flex flex-col gap-3.5 mb-10"
              variants={{ ...stagger, show: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              {featureItems.map((fi) => (
                <motion.li key={fi} variants={item} className="flex items-center gap-3 text-sm text-zinc-300">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full border border-emerald-700/50 flex items-center justify-center bg-emerald-950/50">
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
              className="rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl shadow-black/60"
              style={{ y: imgY }}
              whileHover={{ scale: 1.012, borderColor: 'rgba(52,211,153,0.18)' }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            >
              <img src="/app-preview.png" alt="Reportly application" className="w-full object-cover" />
            </motion.div>
          </Reveal>
        </div>

        {/* Bridge */}
        <motion.div
          className="mt-20 rounded-2xl overflow-hidden border border-zinc-800/60"
          initial={{ opacity: 0, clipPath: 'inset(8% 0% 8% 0% round 16px)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <img src="/reportly-bridge.png" alt="Engineering workflow" className="w-full object-cover" />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-5 grid grid-cols-3 border border-zinc-800/60 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15, ease: EASE }}>
          {stats.map((s, i) => (
            <div key={s.label} className={i < 2 ? 'border-r border-zinc-800/60' : ''}>
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
  { step: '01', title: 'Discovery', description: 'We review your actual workflows, tools, and processes. No theoretical frameworks — just how work really gets done.' },
  { step: '02', title: 'Prototype', description: 'We build a narrow but complete solution: ingest data, automate the workflow, and walk it through your QA process.' },
  { step: '03', title: 'Rollout', description: 'Once the first workflow is trusted, we expand carefully. Proper versioning, access control, and documentation.' },
];

function ProcessSection() {
  return (
    <section className="border-t border-zinc-900 bg-black pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <Label>How We Work</Label>
          <h2 className="text-[2.2rem] sm:text-4xl font-semibold tracking-[-0.02em] text-white mb-5 mt-4">
            <ScrambleText text="Custom projects." duration={0.9} />
          </h2>
          <p className="text-zinc-500 text-sm md:text-[0.95rem] max-w-md mb-14 leading-[1.75]">
            We get one workflow right before moving to the next. Built to fit how your team actually operates.
          </p>
        </Reveal>

        <Rule className="mb-14" />

        <motion.div
          className="grid md:grid-cols-3 gap-3"
          variants={{ ...stagger, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
        >
          {processSteps.map((step) => (
            <motion.div
              key={step.step}
              variants={{ hidden: { opacity: 0, y: 24, filter: 'blur(5px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } } }}
              className="group relative border border-zinc-800/60 rounded-2xl p-8 flex flex-col overflow-hidden cursor-default"
              whileHover={{ borderColor: 'rgba(255,255,255,0.1)', y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <motion.div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)' }}
                initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.35 }}
              />
              <span className="block text-[3.5rem] font-black text-zinc-800/70 leading-none mb-5 tracking-tight select-none">
                {step.step}
              </span>
              <div className="w-5 h-px bg-zinc-800 mb-5 group-hover:bg-emerald-800 transition-colors duration-500" />
              <h3 className="text-[13px] font-semibold text-zinc-200 mb-2 tracking-tight">{step.title}</h3>
              <p className="text-[13px] text-zinc-500 leading-[1.7]">{step.description}</p>
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
    <section className="border-t border-zinc-900 bg-black pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
            <div>
              <Label>The People</Label>
              <h2 className="text-[2.2rem] sm:text-4xl font-semibold tracking-[-0.02em] text-white mt-4">
                <ScrambleText text="Built by engineers." duration={0.9} />
              </h2>
            </div>
            <motion.a href="/team"
              className="flex items-center gap-1.5 text-[11px] text-zinc-600 uppercase tracking-[0.15em] hover:text-zinc-300 transition-colors duration-200"
              whileHover={{ x: 1 }} transition={{ duration: 0.15 }}>
              Full team <ArrowUpRight className="w-3 h-3" />
            </motion.a>
          </div>
        </Reveal>

        <Rule className="mb-14" />

        {/* Team banner */}
        <Reveal className="mb-12">
          <motion.div
            className="relative rounded-2xl overflow-hidden border border-zinc-800/60"
            whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}
            transition={{ duration: 0.3 }}
          >
            <img src="/team/full-team-pic-optimized.jpg" alt="VibeOps founding team"
              className="w-full object-cover object-center" style={{ maxHeight: 420 }} />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 px-8 py-7 flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-zinc-500 mb-1">VibeOps Technologies Inc.</p>
                <p className="text-base md:text-lg font-medium text-white">Building software for engineering teams.</p>
              </div>
              <Btn href="/contact" primary>Talk to the Team</Btn>
            </div>
          </motion.div>
        </Reveal>

        {/* Avatar strip — centered */}
        <motion.div
          className="flex justify-center gap-8 sm:gap-12 flex-wrap"
          variants={{ ...stagger, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
        >
          {teamMembers.map((member) => (
            <motion.a
              key={member.name}
              href={`/team?member=${encodeURIComponent(member.name)}`}
              variants={{ hidden: { opacity: 0, y: 14, filter: 'blur(5px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE } } }}
              className="flex flex-col items-center gap-2.5 group"
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            >
              <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden border border-zinc-800 group-hover:border-zinc-600 transition-colors duration-300">
                <img src={member.image} alt={member.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="text-center">
                <p className="text-[12px] font-medium text-zinc-300 leading-tight">{member.name.split(' ')[0]}</p>
                <p className="text-[10px] text-zinc-600 leading-tight mt-0.5">{member.role}</p>
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
    <section className="border-t border-zinc-900 bg-black pt-28 pb-36 md:pt-36">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Rule className="mb-20" />
        <motion.div className="max-w-xl"
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          <motion.div variants={item}>
            <Label>Ready to move faster?</Label>
          </motion.div>
          <motion.h2 variants={item}
            className="text-[2.5rem] sm:text-5xl md:text-[3.5rem] font-semibold tracking-[-0.03em] text-white mb-6 mt-4 leading-[1.06]">
            <ScrambleText text="Get your engineering time back." duration={1.0} />
          </motion.h2>
          <motion.p variants={item} className="text-zinc-500 text-sm md:text-[0.95rem] leading-[1.75] mb-10 max-w-sm">
            We automate reporting and documentation so your team can focus on engineering — and deliver more per project.
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-3">
            <Btn href="/contact" primary>Book a Vibe Check <ArrowRight className="w-3.5 h-3.5" /></Btn>
            <Btn href="/services">Explore Our Services</Btn>
          </motion.div>
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
    <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-600 font-medium">
      {children}
    </p>
  );
}
