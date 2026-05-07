// src/pages/Index.tsx

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { FileText, Wrench, BarChart3, Layers, Check, ArrowUpRight, ArrowRight, MapPin } from 'lucide-react';
import { useRef, useEffect, useState, ReactNode } from 'react';
import { SEO } from '@/components/SEO';
import { ScrambleText } from '@/components/ScrambleText';
import { HomepageDeviceStage } from '@/components/homepage/DeviceScene';
import { HOMEPAGE_EASE, HOMEPAGE_MOTION } from '@/components/homepage/motion';

const HERO_VIDEO_SRC = '/vids/demo-vid.mp4';
const PLATFORM_VIDEO_SRC = '/vids/Product Demo Video in Green Blue Cool Corporate Style (1).mp4';
const PITCH_VIDEO_SRC =
  'https://www.youtube.com/embed/GIVzfvtqk3Y?autoplay=1&mute=1&loop=1&playlist=GIVzfvtqk3Y&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1';

const TICKER_ITEMS = [
  { type: 'logo' as const, src: '/clients/SenseEngineering.png', alt: 'Sense Engineering', url: 'https://senseengineering.com/' },
  { type: 'logo' as const, src: '/clients/ubc-eng.jpg', alt: 'UBC Engineering', url: 'https://engineering.ubc.ca/' },
  { type: 'text' as const, label: 'Techcouver', url: 'https://techcouver.com/2026/03/30/ubc-ventures-take-stage-at-investor-showcase/' },
  { type: 'text' as const, label: 'UBC Investor Showcase', url: 'https://innovation.ubc.ca/news/march-03-2026/meet-12-ubc-ventures-presenting-innovation-ubcs-2026-investor-showcase' },
  { type: 'text' as const, label: 'Venture Founder Cohort', url: 'https://innovation.ubc.ca/news/february-02-2026/meet-51st-venture-founder-cohort' },
  { type: 'text' as const, label: 'Investor Spotlight', url: 'https://www.linkedin.com/feed/update/urn:li:share:7442251270310227970' },
];

// =============================================================================
// Primitives
// =============================================================================

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reducedMotion ? 0 : HOMEPAGE_MOTION.revealDistance, filter: reducedMotion ? 'blur(0px)' : HOMEPAGE_MOTION.revealBlur }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={HOMEPAGE_MOTION.viewport}
      transition={{ duration: HOMEPAGE_MOTION.revealDuration, delay, ease: HOMEPAGE_EASE }}
    >
      {children}
    </motion.div>
  );
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.065, delayChildren: 0.03 } } };
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
    import('framer-motion').then(({ animate }) => {
      const controls = animate(0, target, { duration, ease: HOMEPAGE_EASE, onUpdate: (v) => setVal(Math.round(v)) });
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

function Label({ children }: { children: ReactNode }) {
  return <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-500/70 font-semibold">{children}</p>;
}

function Btn({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return (
    <motion.a
      href={href}
      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13.5px] font-semibold whitespace-nowrap transition-colors duration-300 ${
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

function SectionBridge({ from, to, height = 80 }: { from: string; to: string; height?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{ height, background: `linear-gradient(to bottom, ${from}, ${to})`, marginTop: -1, marginBottom: -1, position: 'relative', zIndex: 1 }}
    />
  );
}

function MarqueeSet() {
  return (
    <span className="inline-flex items-center shrink-0">
      {TICKER_ITEMS.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-3 px-6">
          {t.type === 'logo' ? (
            t.url ? (
              <a href={t.url} target="_blank" rel="noopener noreferrer" aria-label={t.alt}>
                <img src={t.src} alt={t.alt} className="h-7 w-auto max-w-[90px] object-contain opacity-40 hover:opacity-70 transition-opacity duration-300 grayscale brightness-150" loading="lazy" />
              </a>
            ) : (
              <img src={t.src} alt={t.alt} className="h-7 w-auto max-w-[90px] object-contain opacity-40 hover:opacity-65 transition-opacity duration-300 grayscale brightness-150" loading="lazy" />
            )
          ) : (
            <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.28em] text-white/35 hover:text-white/70 transition-colors duration-200 font-medium">
              {t.label}
            </a>
          )}
          <span className="w-1 h-1 rounded-full bg-white/15 flex-shrink-0" aria-hidden="true" />
        </span>
      ))}
    </span>
  );
}

function InfiniteMarquee({ speed = 35 }: { speed?: number }) {
  return (
    <div className="overflow-hidden w-full select-none">
      <div className="inline-flex whitespace-nowrap" style={{ animation: `marquee-scroll ${speed}s linear infinite` }}>
        <MarqueeSet />
        <MarqueeSet />
        <MarqueeSet />
        <MarqueeSet />
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
        title="AI Engineering Report Automation | VibeOps Technologies"
        description="Reportly turns your existing Word templates, inspection data, and field notes into formatted, reference-accurate engineering reports in minutes. MapleCodes handles building code research. Built for civil, construction, and environmental teams."
        canonical="https://www.vibeops.ca/"
      />
      <HeroSection />
      <SectionBridge from="#050912" to="#060b14" height={48} />
      <ModelSection />
      <SectionBridge from="#060b14" to="#08111b" height={32} />
      <PlatformSection />
      <SectionBridge from="#08111b" to="#060b14" height={32} />
      <ReportlySection />
      <PatternInterruptA />
      <FeaturesSection />
      <ProcessSection />
      <TeamSection />
      <CTASection />
      {/* Hidden internal links for SEO crawlability */}
      <div aria-hidden="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
        <a href="/services">AI engineering automation services for civil and construction teams</a>
        <a href="/reportly">Reportly - AI report writing software for civil engineers</a>
        <a href="/maplecodes">MapleCodes - Canadian building code intelligence by address</a>
        <a href="/contact">Book a demo for engineering report automation</a>
        <a href="/team">Meet the VibeOps engineering automation team</a>
        <a href="/blog">AI tools for civil engineering report writing and documentation</a>
        <a href="https://reportly.ca" rel="noopener">Reportly - automated engineering report generator</a>
        <a href="https://maplecodes.ca" rel="noopener">MapleCodes - Canadian building code lookup</a>
      </div>
    </>
  );
}

// =============================================================================
// Hero
// Research basis: NN/g — information scent above the fold determines whether
// users scroll. Hero must answer "who are you", "what do you do", and "why
// should I keep reading" in the first viewport. The dual-identity positioning
// line below the CTAs does this explicitly.
// Scroll cue: science shows directional motion cues (not arrows) are more
// effective. A glow bead traveling downward leverages motion parallax to imply
// depth and draw the eye toward the next section.
// =============================================================================

const heroStats = [
  { value: 80, suffix: '%+', label: 'Less Time on Formatting' },
  { value: 3, suffix: ' min', label: 'From Field Data to First Draft' },
  { value: 100, suffix: '%', label: 'Your Existing Templates' },
];

function HeroStatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, val } = useCountUp(value, 1.8);
  return (
    <div className="flex flex-col items-center sm:items-start">
      <span ref={ref} className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">{val}{suffix}</span>
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
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col overflow-hidden bg-[#050912]"
      aria-label="VibeOps - AI Engineering Report Automation for Civil and Construction"
    >
      <div className="relative z-10 flex w-full flex-1 flex-col md:flex-row md:items-center">
        {/* Left text column */}
        <motion.div
          className="relative z-20 flex flex-col justify-center px-6 pb-4 pt-20 sm:px-10 md:w-[38%] md:min-w-[400px] md:pb-6 md:pl-14 md:pt-24 lg:pl-20 xl:w-[34%] xl:pl-24"
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
            style={{ fontSize: 'clamp(2.2rem, 3.6vw, 4.2rem)' }}
          >
            <span className="block text-white">Less formatting.</span>
            <span className="block text-emerald-300">More engineering.</span>
          </motion.h1>

          <motion.p variants={item} className="mb-6 max-w-[26rem] text-[0.92rem] leading-[1.65] text-white/52 lg:text-[0.98rem]">
            Your team spends hours on formatting, not engineering. Reportly takes your existing Word templates, inspection data, and field notes and produces QA-ready reports in minutes, with accurate references and consistent formatting every time.
          </motion.p>

          <motion.div variants={item} className="flex flex-nowrap items-center gap-3 mb-3">
            <motion.a
              href="/reportly"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400 text-black text-[13.5px] font-bold whitespace-nowrap hover:from-emerald-200 hover:to-emerald-300 transition-colors duration-200"
              style={{ boxShadow: '0 18px 46px rgba(52, 211, 153, 0.18)' }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={HOMEPAGE_MOTION.hoverSpring}
            >
              Explore Reportly <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
            <Btn href="/services">See Custom Rollouts</Btn>
          </motion.div>

          <motion.p variants={item} className="max-w-[28rem] text-[11px] text-white/22 tracking-wide leading-relaxed">
            <a href="/reportly" className="hover:text-emerald-400/50 transition-colors">Reportly</a> &middot;{' '}
            <a href="/maplecodes" className="hover:text-[#d92f37]/50 transition-colors">MapleCodes</a> &middot;{' '}
            <a href="/services" className="hover:text-cyan-400/50 transition-colors">Custom Rollouts</a> &middot; Trusted by civil, construction &amp; environmental teams
          </motion.p>
        </motion.div>

        {/* Right device column */}
        <motion.div
          className="relative z-10 flex w-full items-center justify-center px-4 pb-4 pt-16 sm:px-6 md:w-[66%] md:px-0 md:pb-0 md:pt-24 xl:w-[70%]"
          style={{ y: deviceY, opacity: deviceOpacity }}
        >
          <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={HOMEPAGE_MOTION.heroFade}>
            <HomepageDeviceStage videoSrc={HERO_VIDEO_SRC} />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll path cue — glow bead traveling downward implies depth + pulls the eye.
          Fades out when user starts scrolling (already engaged). */}
      <motion.div
        className="relative z-10 flex justify-center pb-2 pt-0 pointer-events-none"
        style={{ opacity: cueOpacity }}
      >
        <div className="flex flex-col items-center">
          <div className="relative h-14 w-px overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/22 to-transparent" />
            {!reducedMotion && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.65)]"
                animate={{ y: [0, 48], opacity: [0, 0.85, 0] }}
                transition={{ duration: 1.9, repeat: Infinity, repeatDelay: 0.7, ease: 'easeInOut' }}
                style={{ top: 0 }}
              />
            )}
          </div>
        </div>
      </motion.div>

      <div aria-hidden="true" className="relative z-10 h-4 w-full pointer-events-none md:hidden" style={{ background: '#050912', marginBottom: -1 }} />

      <div className="relative z-10 w-full border-t border-white/6 bg-[#050912]/70 backdrop-blur-md">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 py-6">
          <div className="grid grid-cols-3 gap-4 text-center sm:text-left sm:flex sm:justify-evenly sm:gap-0">
            {heroStats.map((s) => <HeroStatItem key={s.label} {...s} />)}
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
// Model Section — dual-identity proof, the business model in two cards.
// Research basis: BJ Fogg's behavior model — reduce ambiguity to reduce
// cognitive load. Visitors who understand "what kind of company is this"
// within 10 seconds have dramatically lower bounce rates.
// =============================================================================

function ModelSection() {
  return (
    <section className="border-t border-white/6 bg-[#060b14] pt-20 pb-20 md:pt-24 md:pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <Label>The Suite</Label>
          <h2 className="text-[2.2rem] sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] text-white max-w-3xl mb-5 leading-[1.08] mt-4">
            Two products. One implementation team. Zero workflow disruption.
          </h2>
          <p className="text-white/40 text-sm md:text-[0.95rem] max-w-xl mb-14 leading-[1.8]">
            MapleCodes finds every applicable building code for your project address. Reportly takes your inspection data, field notes, and templates and produces formatted, reference-accurate reports. We customize both to fit your firm's existing process. No new tools to learn.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4">
          {/* MapleCodes card */}
          <motion.div
            className="group flex flex-col p-7 rounded-2xl border border-[#d92f37]/20 bg-gradient-to-br from-[#d92f37]/8 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: HOMEPAGE_EASE }}
            whileHover={{ borderColor: 'rgba(217,47,55,0.35)', y: -3 }}
          >
            <span className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d92f37]/10 border border-[#d92f37]/25 text-[9px] font-semibold text-[#d92f37] uppercase tracking-[0.22em] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d92f37] inline-block" /> Code Intelligence
            </span>
            <div className="flex items-center gap-2.5 mb-1">
              <MapPin className="w-5 h-5 text-[#d92f37]" />
              <h3 className="text-xl font-bold text-white">MapleCodes</h3>
            </div>
            <p className="text-[11px] text-[#d92f37]/70 font-medium tracking-wide mb-5">
              Every applicable code for any Canadian address, in seconds
            </p>
            <ul className="space-y-2.5 mb-8 flex-1">
              {[
                'Enter address, get full jurisdiction stack',
                '85+ codes, 375+ standards, 55+ bylaws',
                'Municipality-specific compliance briefs',
                'One-click handoff to Reportly',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/55">
                  <Check className="w-3.5 h-3.5 text-[#d92f37]/65 flex-shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <motion.a
              href="/maplecodes"
              className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#d92f37] hover:text-[#e54950] transition-colors"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              View MapleCodes <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </motion.div>

          {/* Reportly SaaS card */}
          <motion.div
            className="group flex flex-col p-7 rounded-2xl border border-emerald-500/18 bg-gradient-to-br from-emerald-950/22 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: 0.06, ease: HOMEPAGE_EASE }}
            whileHover={{ borderColor: 'rgba(52,211,153,0.28)', y: -3 }}
          >
            <span className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/28 text-[9px] font-semibold text-emerald-400 uppercase tracking-[0.22em] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Flagship Product
            </span>
            <div className="flex items-center gap-2.5 mb-1">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Reportly</h3>
            </div>
            <p className="text-[11px] text-emerald-400/58 font-medium tracking-wide mb-5">
              From inspection data and field notes to formatted reports
            </p>
            <ul className="space-y-2.5 mb-8 flex-1">
              {[
                'Your existing Word and Excel templates',
                'Photos, field data, tables, and charts',
                'Accurate references and exec summaries',
                'Consistent formatting across every report',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/55">
                  <Check className="w-3.5 h-3.5 text-emerald-500/65 flex-shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <motion.a
              href="/reportly"
              className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              View Reportly <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </motion.div>

          {/* Custom Rollouts card */}
          <motion.div
            className="group flex flex-col p-7 rounded-2xl border border-white/8 bg-white/[0.02]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: 0.12, ease: HOMEPAGE_EASE }}
            whileHover={{ borderColor: 'rgba(103,232,249,0.16)', y: -3 }}
          >
            <span className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-[9px] font-semibold text-cyan-400/80 uppercase tracking-[0.22em] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 inline-block" /> Implementation Partner
            </span>
            <div className="flex items-center gap-2.5 mb-1">
              <Wrench className="w-5 h-5 text-cyan-400/70" />
              <h3 className="text-xl font-bold text-white">Custom Rollouts</h3>
            </div>
            <p className="text-[11px] text-cyan-300/45 font-medium tracking-wide mb-5">
              Adapted to your templates, approval chain, and existing tools
            </p>
            <ul className="space-y-2.5 mb-8 flex-1">
              {[
                'Your template library, mapped and ready',
                'QA checklists and approval workflows built in',
                'SharePoint, Bluebeam, Excel pipelines',
                'On-premise deployment available',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/55">
                  <Check className="w-3.5 h-3.5 text-white/25 flex-shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <motion.a
              href="/services"
              className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-white/42 hover:text-white/72 transition-colors"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              See Services <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Platform Showcase — product "wow" moment. Comes after the model explanation
// so the demo lands with context: "ok I understand what this is, now show me."
// =============================================================================

function PlatformSection() {
  return (
    <section className="relative overflow-hidden bg-[#08111b] pt-20 pb-20 md:pt-24 md:pb-24" data-testid="platform-section">
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
            See It In Action
          </p>
          <h2 className="text-center text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-bold tracking-[-0.025em] text-white leading-[1.1] mb-5 max-w-3xl mx-auto">
            Your templates in. <span className="text-emerald-300">Polished reports out.</span>
          </h2>
          <p className="text-center text-[0.95rem] text-white/48 max-w-xl mx-auto mb-12 leading-[1.8]">
            Stop losing hours to formatting, reference hunting, and copy-paste assembly. Upload your data, pick your template, and get a QA-ready draft with accurate references. No changes to how your team works.
          </p>
          <div className="flex justify-center mb-14">
            <Btn href="/reportly" primary>Explore Reportly <ArrowRight className="w-3.5 h-3.5" /></Btn>
          </div>
        </Reveal>

        <motion.div
          className="relative rounded-[1.75rem] overflow-hidden border border-white/10 bg-[#0b1624] shadow-[0_28px_80px_rgba(0,0,0,0.42)]"
          initial={{ opacity: 0, y: HOMEPAGE_MOTION.revealDistance, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={HOMEPAGE_MOTION.viewport}
          transition={HOMEPAGE_MOTION.cardReveal}
          role="img"
          aria-label="Reportly engineering report automation platform demo"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1928] border-b border-white/8">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" aria-hidden="true" />
            <a href="https://reportly.ca" target="_blank" rel="noopener noreferrer" className="ml-3 flex-1 text-[10px] text-white/32 hover:text-emerald-300 tracking-[0.18em] uppercase truncate transition-colors">
              reportly.ca - AI Engineering Report Automation Software
            </a>
          </div>
          <div className="relative aspect-video bg-black">
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-black/20 via-transparent to-white/5" />
            <video src={PLATFORM_VIDEO_SRC} autoPlay muted loop playsInline className="w-full h-full object-cover" aria-label="Reportly AI report automation demo video" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// Reportly — flagship product deep dive. Now positioned AFTER the model and
// demo so visitors arrive here already understanding "this is their product."
// =============================================================================

const featureItems = [
  'Works with the Word and Excel templates you already use',
  'Photos, measurements, tables, and field data embedded automatically',
  'Accurate references, executive summaries, and consistent formatting',
  'No workflow changes. Fits your existing QA and approval process',
];

const stats = [
  { value: 80, suffix: '%+', label: 'Less time formatting reports' },
  { value: 3, suffix: ' min', label: 'From raw data to first draft' },
  { value: 100, suffix: '%', label: 'Your existing templates' },
];

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, val } = useCountUp(value);
  return (
    <div className="px-7 sm:px-10 py-7 flex flex-col gap-1.5">
      <span ref={ref} className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums">{val}{suffix}</span>
      <span className="text-[10px] text-white/35 uppercase tracking-[0.14em]">{label}</span>
    </div>
  );
}

function ReportlySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [35, -35]);

  return (
    <section className="border-t border-white/6 bg-[#060b14] pt-20 pb-20 md:pt-24 md:pb-24">
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
                Connect your existing Word templates. Feed in inspection data, field notes, photos, and measurements. Get a formatted first draft with embedded images, accurate references, and a proper executive summary, ready for QA review.
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
              <img src="/app-preview.png" alt="Reportly engineering report automation software - automated civil engineering reports in minutes" className="w-full object-cover" loading="lazy" />
            </motion.div>
          </Reveal>
        </div>

        <motion.div
          className="mt-20 rounded-2xl overflow-hidden border border-white/8"
          initial={{ opacity: 0, clipPath: 'inset(8% 0% 8% 0% round 16px)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.95, ease: HOMEPAGE_EASE }}
        >
          <img src="/reportly-bridge.png" alt="Engineering report automation workflow - from raw data to polished civil engineering documentation" className="w-full object-cover" loading="lazy" />
        </motion.div>

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
// Pattern Interrupt A — copy-based disruptor between product proof and the
// adoption ladder. Research basis: Cialdini's contrast principle. After the
// product section, a sharp reframe ("not a generic X") resets expectations and
// makes the following services section land with more specificity.
// =============================================================================

function PatternInterruptA() {
  return (
    <section className="py-16 md:py-20 bg-[#060b14] border-t border-white/5">
      <Reveal className="max-w-3xl mx-auto px-6 md:px-10 text-center">
        <p
          className="font-bold text-white/52 leading-[1.32] tracking-[-0.018em]"
          style={{ fontSize: 'clamp(1.15rem, 2.4vw, 1.75rem)' }}
        >
          Not a chatbot. Not a generic document tool. Not built for marketing teams.
        </p>
        <p
          className="font-bold text-white/88 leading-[1.32] tracking-[-0.018em] mt-2"
          style={{ fontSize: 'clamp(1.15rem, 2.4vw, 1.75rem)' }}
        >
          A reporting platform built for how civil and construction teams actually produce documents. Your templates. Your references. Your QA process.
        </p>
      </Reveal>
    </section>
  );
}

// =============================================================================
// Features / Adoption Ladder — replaces the equal-weight services grid.
// Research basis: Fitts's Law and progressive disclosure. A numbered progression
// (start here, then expand) is cognitively easier than four equal options.
// Reportly is visually dominant as step 01; the others are secondary steps.
// =============================================================================

const adoptionSteps = [
  {
    step: '01',
    icon: FileText,
    title: 'Reportly Platform',
    subtitle: 'Core SaaS',
    description: 'Generate formatted reports from your existing Word and Excel templates. Feed in inspection data, field notes, photos, and measurements. Get drafts with embedded images, accurate references, and executive summaries, ready for QA.',
    features: [
      'Your Word and Excel templates, automated',
      'Photos, field data, and measurements embedded',
      'Accurate references and consistent formatting',
    ],
    href: '/reportly',
    cta: 'Explore Reportly',
    primary: true,
  },
  {
    step: '02',
    icon: Wrench,
    title: 'Template + QA Rollout',
    subtitle: 'Implementation',
    description: "We map your firm's templates, QA checklists, and approval chains into Reportly. Your engineers keep working the way they already do. The formatting and assembly happens automatically.",
    href: '/services',
    cta: 'Learn more',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Data + Workflow Integrations',
    subtitle: 'Connections',
    description: 'Connect the tools your team already uses: Excel, SharePoint, Bluebeam, inspection forms, and project folders. Data flows into Reportly without manual re-entry.',
    href: '/services',
    cta: 'Learn more',
  },
  {
    step: '04',
    icon: Layers,
    title: 'Custom Add-ons',
    subtitle: 'Extensions',
    description: 'Dashboards, calculators, compliance trackers, and internal tools that plug into your reporting workflow and extend what Reportly can do for your firm.',
    href: '/services',
    cta: 'Learn more',
  },
];

function AdoptionLadder() {
  const primary = adoptionSteps[0];
  const supporting = adoptionSteps.slice(1);

  return (
    <div className="relative py-10 flex flex-col gap-3">
      {/* Step 01 — full-width featured */}
      <motion.a
        href={primary.href}
        className="group relative flex flex-col md:flex-row gap-8 p-7 md:p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/25 to-transparent cursor-pointer"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, ease: HOMEPAGE_EASE }}
        whileHover={{ borderColor: 'rgba(52,211,153,0.32)', y: -2 }}
      >
        {/* Subtle hover glow */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(52,211,153,0.055) 0%, transparent 55%)' }} />

        <div className="flex-1 relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black text-emerald-500/55 uppercase tracking-[0.22em]">{primary.step}</span>
            <span className="px-2 py-0.5 rounded-full border border-emerald-500/28 bg-emerald-950/50 text-[9px] text-emerald-400 font-semibold uppercase tracking-[0.18em]">Flagship Product</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{primary.title}</h3>
          <p className="text-[11px] font-medium text-emerald-400/58 tracking-wide mb-4">{primary.subtitle}</p>
          <p className="text-[13px] text-white/50 leading-relaxed mb-5 max-w-md">{primary.description}</p>
          <ul className="space-y-2 mb-6">
            {primary.features!.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-[12.5px] text-white/55">
                <Check className="w-3.5 h-3.5 text-emerald-500/65 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            {primary.cta} <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </motion.a>

      {/* Connector */}
      <div className="flex justify-center py-0.5" aria-hidden="true">
        <div className="w-px h-5 bg-gradient-to-b from-white/10 to-transparent" />
      </div>

      {/* Steps 02-04 — 3-column grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
        variants={{ ...stagger, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        {supporting.map((s) => (
          <motion.a
            key={s.step}
            href={s.href}
            variants={item}
            className="group flex flex-col p-6 rounded-xl border border-white/7 bg-white/[0.018] cursor-pointer"
            whileHover={{ borderColor: 'rgba(255,255,255,0.12)', y: -3 }}
            transition={HOMEPAGE_MOTION.gentleSpring}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] font-black text-white/22 uppercase tracking-[0.22em]">{s.step}</span>
              {s.icon && <s.icon className="w-4 h-4 text-white/28" />}
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-1">{s.title}</h3>
            <p className="text-[10px] font-medium text-white/28 tracking-wide mb-3">{s.subtitle}</p>
            <p className="text-[12.5px] text-white/40 leading-relaxed flex-1">{s.description}</p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/28 mt-4 group-hover:text-white/58 transition-colors">
              {s.cta} <ArrowRight className="w-3 h-3" />
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="border-t border-white/6 bg-[#060b14] pt-20 pb-20 md:pt-24 md:pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <Label>Implementation Path</Label>
          <h2 className="text-[2.2rem] sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] text-white max-w-2xl mb-5 leading-[1.08] mt-4">
            Start with the report that takes the longest.
          </h2>
          <p className="text-white/40 text-sm md:text-[0.95rem] max-w-lg mb-14 leading-[1.8]">
            Pick one report type: inspection reports, environmental assessments, O&amp;M manuals, compliance docs. Automate it. Then expand from there.
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

        <AdoptionLadder />
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
    description: 'We look at the report that costs you the most hours. The one with the most formatting, the most data sources, the most back-and-forth. That is where we start.',
  },
  {
    step: '02', title: 'Prototype',
    description: 'We build a working automation around your actual template. Real field data goes in, a formatted draft comes out, and we walk it through your QA process together.',
  },
  {
    step: '03', title: 'Rollout',
    description: 'Once the first report type is trusted and approved, we expand to the next. Proper versioning, access control, and secure deployment, including on-premise if required.',
  },
];

function ProcessSection() {
  return (
    <section className="border-t border-white/6 bg-[#060b14] pt-20 pb-20 md:pt-24 md:pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <Label>How We Work</Label>
          <h2 className="text-[2.2rem] sm:text-4xl font-bold tracking-[-0.025em] text-white mb-5 mt-4">
            We work the way your firm does.
          </h2>
          <p className="text-white/40 text-sm md:text-[0.95rem] max-w-md mb-14 leading-[1.8]">
            Every firm has different templates, different approval chains, different tools. We get one workflow right before touching the next. No disruption, no learning curve.
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
              <span className="block text-[3.5rem] font-black text-white/10 leading-none mb-5 tracking-tight select-none">{step.step}</span>
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
  { name: 'Qazi Omair Ahmed', role: 'CTO', image: '/team/omair-optimized.jpg' },
];

function TeamSection() {
  return (
    <section className="border-t border-white/6 bg-[#060b14] pt-20 pb-20 md:pt-24 md:pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
            <div>
              <Label>The People</Label>
              <h2 className="text-[2.2rem] sm:text-4xl font-bold tracking-[-0.025em] text-white mt-4">We've talked to 200+ firms. We built what they asked for.</h2>
            </div>
            <motion.a href="/team" className="flex items-center gap-1.5 text-[11px] text-white/30 uppercase tracking-[0.15em] hover:text-white/70 transition-colors duration-200" whileHover={{ x: 1 }} transition={{ duration: 0.15 }}>
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
            <img src="/team/full-team-pic-optimized.jpg" alt="VibeOps Technologies founding team - engineering automation specialists based in Vancouver, BC" className="w-full object-cover object-center" style={{ maxHeight: 420 }} loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 px-8 py-7 flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-white/40 mb-1">VibeOps Technologies Inc. - Vancouver, BC</p>
                <p className="text-base md:text-lg font-semibold text-white">Built from 200+ discovery calls with engineering firms across Canada.</p>
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
              variants={{ hidden: { opacity: 0, y: 14, filter: 'blur(5px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.48, ease: HOMEPAGE_EASE } } }}
              className="flex flex-col items-center gap-2.5 group"
              whileHover={{ y: -3 }}
              transition={HOMEPAGE_MOTION.hoverSpring}
            >
              <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden border border-white/12 group-hover:border-emerald-500/40 transition-colors duration-300">
                <img src={member.image} alt={`${member.name} - ${member.role} at VibeOps Technologies`} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" loading="lazy" />
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
// CTA — pre-CTA pattern interrupt (PatternInterruptB) lands just before the
// conversion ask. Research basis: reciprocity + the "almost there" effect.
// Naming what the visitor already has (templates, data) frames Reportly as
// the obvious missing piece rather than an unfamiliar new investment.
// =============================================================================

function CTASection() {
  return (
    <section className="border-t border-white/6 bg-[#060b14] pt-20 pb-20 md:pt-24 md:pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">

        {/* Pattern Interrupt B — frames Reportly as the obvious missing piece */}
        <Reveal className="text-center mb-14">
          <div className="space-y-1.5">
            <p className="font-semibold text-white/35 tracking-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)' }}>
              Your engineers already have the field data.
            </p>
            <p className="font-semibold text-white/35 tracking-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)' }}>
              Your firm already has the templates.
            </p>
            <p className="font-bold text-white/80 tracking-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)' }}>
              Stop spending the hours in between on formatting.
            </p>
          </div>
        </Reveal>

        <Rule className="mb-20" />

        <motion.div
          className="max-w-xl mb-20"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={item}><Label>Ready to move faster?</Label></motion.div>
          <motion.h2
            variants={item}
            className="text-[2.5rem] sm:text-5xl md:text-[3.5rem] font-bold tracking-[-0.03em] text-white mb-6 mt-4 leading-[1.06]"
          >
            Get your engineering hours back.
          </motion.h2>
          <motion.p variants={item} className="text-white/40 text-sm md:text-[0.95rem] leading-[1.8] mb-10 max-w-sm">
            The average engineer loses 30-40% of their week to formatting, reference assembly, and report revisions. Reportly handles all of it so your team delivers more projects, not more documents.
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-3">
            <Btn href="/contact" primary>Book a Demo <ArrowRight className="w-3.5 h-3.5" /></Btn>
            <Btn href="/services">Explore Our Services</Btn>
          </motion.div>
        </motion.div>

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
