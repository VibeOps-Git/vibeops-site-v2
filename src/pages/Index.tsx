// src/pages/Index.tsx
//
// Homepage. One job: make the category unmistakable in the first screen.
//
// VibeOps is the AI engineering team an AE firm has not hired: civil engineers
// who write software, working embedded inside the firm's own projects. Not a
// product, not a consultancy that delivers slides. Every engagement solves a
// real problem for one firm and leaves us with capability we carry to the next.
// The page is ordered so a visitor recognises their own problem before we
// describe anything we do:
//
//   hero (category) → the problem → the gap in the market → which of these is
//   you (six jobs) → an example of the work → how we work → security → team → CTA
//
// Nothing here should name a product. If a future implementation would require
// changing this page's structure, the structure was not abstract enough.

import {
  motion,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import {
  FileText, MapPin, Check, ArrowRight,
  ArrowUpRight, ShieldCheck,
} from 'lucide-react';
import { useRef, useEffect, useLayoutEffect, useState, useCallback, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { JOBS } from '@/data/jobs';
import { HomepageDeviceStage, LaptopShell, TabletShell, PhoneShell } from '@/components/homepage/DeviceScene';
import { VibeOpsShowcaseScreen } from '@/components/homepage/VibeOpsShowcase';
import { HOMEPAGE_EASE, HOMEPAGE_MOTION } from '@/components/homepage/motion';

// ─── Primitives ─────────────────────────────────────────────────────────────

const E = HOMEPAGE_EASE;

function Reveal({
  children, delay = 0, className,
}: { children: ReactNode; delay?: number; className?: string }) {
  const rm = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: rm ? 0 : HOMEPAGE_MOTION.revealDistance, filter: rm ? 'none' : HOMEPAGE_MOTION.revealBlur }}
      whileInView={{ opacity: 1, y: 0, filter: 'none' }}
      viewport={HOMEPAGE_MOTION.viewport}
      transition={{ duration: HOMEPAGE_MOTION.revealDuration, delay, ease: E }}
    >
      {children}
    </motion.div>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: E } },
};

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.35em] text-primary font-black mb-3">
      {children}
    </p>
  );
}

function Rule({ className }: { className?: string }) {
  return (
    <motion.div
      className={`h-px bg-border origin-left ${className ?? ''}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: E }}
    />
  );
}

function PrimaryBtn({ href, children }: { href: string; children: ReactNode }) {
  return (
    <motion.a
      href={href}
      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground text-[14px] font-bold whitespace-nowrap shadow-sm"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={HOMEPAGE_MOTION.hoverSpring}
    >
      {children}
    </motion.a>
  );
}

function SecondaryBtn({ href, children }: { href: string; children: ReactNode }) {
  return (
    <motion.a
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-secondary text-muted-foreground text-[13.5px] font-semibold hover:border-foreground/30 hover:text-foreground transition-colors duration-200 whitespace-nowrap"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={HOMEPAGE_MOTION.hoverSpring}
    >
      {children}
    </motion.a>
  );
}

// ─── Ticker ─────────────────────────────────────────────────────────────────

// `tone` describes the logo artwork's own color so we can render every logo as
// a consistent, readable monochrome in BOTH light and dark mode:
//   'light' = light/white artwork  -> invert in light mode, leave in dark
//   'dark'  = dark/ink artwork      -> leave in light mode, invert in dark
const TICKER_ITEMS = [
  { type: 'logo' as const, tone: 'light' as const, src: '/clients/SenseEngineering.png', alt: 'Sense Engineering', url: 'https://senseengineering.com/' },
  { type: 'logo' as const, tone: 'dark' as const,  src: '/clients/ubc-eng.jpg', alt: 'UBC Engineering', url: 'https://engineering.ubc.ca/' },
  { type: 'logo' as const, tone: 'dark' as const,  src: '/clients/grantfundpro.avif', alt: 'GrantFundPro', url: 'https://www.grantfundpro.com/' },
  { type: 'logo' as const, tone: 'dark' as const,  src: '/clients/effortlo.png', alt: 'Effortlo', url: 'https://www.effortlo.com/' },
  { type: 'text' as const, label: 'Techcouver', url: 'https://techcouver.com/2026/03/30/ubc-ventures-take-stage-at-investor-showcase/' },
  { type: 'text' as const, label: 'UBC Investor Showcase', url: 'https://innovation.ubc.ca/news/march-03-2026/meet-12-ubc-ventures-presenting-innovation-ubcs-2026-investor-showcase' },
  { type: 'text' as const, label: 'Venture Founder Cohort', url: 'https://innovation.ubc.ca/news/february-02-2026/meet-51st-venture-founder-cohort' },
];

function TickerItem({ t }: { t: typeof TICKER_ITEMS[number] }) {
  return (
    <span className="inline-flex items-center gap-4 px-8">
      {t.type === 'logo'
        ? <a href={t.url} target="_blank" rel="noopener noreferrer" aria-label={t.alt}>
            {/* eager + decoding=sync: all 4 marquee copies must resolve to the
                same width at the same time, or the -25% loop point drifts and
                the ticker visibly jumps on reset. Lazy-loading the off-screen
                copies was the cause of that jump. */}
            <img src={t.src} alt={t.alt} className={`w-auto max-w-[160px] object-contain grayscale opacity-70 hover:opacity-100 transition-opacity duration-300 ${t.alt === 'Effortlo' ? 'h-11 md:h-12' : 'h-7 md:h-8'} ${t.tone === 'light' ? 'invert dark:invert-0' : 'dark:invert'}`} loading="eager" decoding="sync" />
          </a>
        : <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors duration-200 font-semibold whitespace-nowrap">{t.label}</a>
      }
      <span className="w-1.5 h-1.5 rounded-full bg-border flex-shrink-0" aria-hidden="true" />
    </span>
  );
}

// ─── Seamless marquee ─────────────────────────────────────────────────────────
// Measures ONE content group + the container, then renders enough identical
// groups to always overflow the viewport and translates by exactly one group
// width (in px, via the --mq-shift custom property). Because the shift equals an
// integer number of repeating units, the loop is pixel-perfect at ANY width and
// never jumps on reset. It re-measures on resize AND once web-fonts settle
// (ResizeObserver on the group) - late-loading assets changing the group width
// was exactly what made the old fixed-percentage marquees jump.
function Marquee({
  children,
  pxPerSec = 38,
  className = '',
}: {
  children: ReactNode;
  pxPerSec?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [groupW, setGroupW] = useState(0);
  const [groups, setGroups] = useState(2);

  useLayoutEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      const g = groupRef.current;
      if (!c || !g) return;
      const gw = g.getBoundingClientRect().width;
      const cw = c.getBoundingClientRect().width;
      if (gw < 1) return;
      setGroupW(gw);
      // After a one-group shift, the remaining (groups - 1) groups must still
      // cover the viewport. Render ceil(viewport / group) + 2 for headroom.
      setGroups(Math.max(2, Math.ceil(cw / gw) + 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (groupRef.current) ro.observe(groupRef.current);
    const fonts = (document as unknown as { fonts?: { ready?: Promise<unknown> } }).fonts;
    fonts?.ready?.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [children]);

  const dur = groupW > 0 ? groupW / pxPerSec : 0;

  return (
    // isolation:isolate + translateZ(0) gives the marquee its own GPU layer so
    // unrelated fixed-overlay/viewport repaints don't jitter the animation.
    <div
      ref={containerRef}
      className={`overflow-hidden w-full select-none ${className}`}
      style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
    >
      <div
        className="flex w-max flex-nowrap"
        style={{
          animation: dur ? `marquee-shift ${dur}s linear infinite` : undefined,
          ['--mq-shift' as string]: groupW ? `-${groupW}px` : '-50%',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {Array.from({ length: groups }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? groupRef : undefined}
            aria-hidden={i > 0}
            className="flex flex-nowrap shrink-0"
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfiniteMarquee({ speed: _speed }: { speed?: number }) {
  return (
    <Marquee pxPerSec={38}>
      {TICKER_ITEMS.map((t, i) => <TickerItem key={i} t={t} />)}
    </Marquee>
  );
}

// ─── Problem cards (driven by src/data/jobs.ts) ─────────────────────────────
// Deliberately data-driven: a seventh job appears here automatically, and no
// homepage restructuring is needed when new implementations land.

function ProblemCard({ job, delay = 0 }: { job: typeof JOBS[number]; delay?: number }) {
  const Icon = job.icon;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay, ease: E }}
    >
      <Link
        to={`/what-we-solve/${job.id}`}
        className="group relative flex h-full cursor-pointer flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-secondary">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="mb-2 text-[15.5px] font-bold leading-snug text-foreground">
            “{job.headline}”
          </h3>
          <p className="text-[12.5px] leading-[1.65] text-muted-foreground">{job.summary}</p>
        </div>
        <div className="mt-auto flex items-center gap-1 text-primary">
          <span className="text-[11px] font-semibold">How we solve it</span>
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Index() {
  return (
    <>
      <SEO
        title="The AI Engineering Team for Architecture & Engineering Firms"
        description="VibeOps is the AI engineering team your firm hasn't hired. Civil engineers who write software, embedded in your projects: AI that runs on confidential data, the systems you already own finally talking, and the internal tools nobody sells you."
        canonical="https://www.vibeops.ca/"
      />
      <HeroSection />
      <ProblemSection />
      <TheGapSection />
      <SixProblemsSection />
      <CodeIntelligenceSection />
      {/* Continuous opaque backing: prevents the fixed hero background from
          bleeding through sub-pixel seams between these stacked sections during
          fast smooth-scroll (the "separation"/jump on fast scroll). */}
      <div className="relative z-20 bg-background">
        <HowWeWorkSection />
        <SecuritySection />
        <TeamSection />
        <FinalCTASection />
      </div>
    </>
  );
}

// ─── 1. Hero ─────────────────────────────────────────────────────────────────

// Renders screen content into a larger virtual canvas, then CSS-scales it down
// to fit the device screen. The showcase uses fixed-px text and fills its box,
// so a bigger virtual canvas = relatively smaller text + more vertical room
// (nothing clips). `scale` is how much bigger the canvas is than the screen
// (e.g. 2 = render at 200% then shrink to 50%). Higher = smaller, denser UI.
function FittedScreen({ scale, children }: { scale: number; children: React.ReactNode }) {
  const pct = `${scale * 100}%`;
  return (
    <div className="w-full h-full overflow-hidden">
      <div className="origin-top-left" style={{ width: pct, height: pct, transform: `scale(${1 / scale})` }}>
        {children}
      </div>
    </div>
  );
}

// Renders screen content at a fixed reference size and scales it to COVER the
// box it is given. Without this the showcase renders at its native pixel size,
// so on a 27" monitor the laptop screen is ~1400px wide with 8px text sitting in
// the top third and nothing underneath. Scaling to cover keeps the UI
// proportional at every viewport: same composition, just larger.
// Reference size must roughly match the aspect of the shell it is going into,
// otherwise contain-scaling letterboxes hard. The showcase is a landscape
// desktop UI, so it gets a landscape reference on the laptop and a squarer one
// on the tablet. The phone does NOT use this — see the note at its call site.
function ScaledScreen({
  children,
  refW = 900,
  refH = 560,
}: {
  children: React.ReactNode;
  refW?: number;
  refH?: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width < 1 || height < 1) return;
      // CONTAIN, not cover. The three device shells have very different
      // aspects (laptop ~16:10, tablet ~4:3, phone portrait), so scaling to
      // cover a single reference box crops the sides on the narrower ones.
      // Contain guarantees nothing clips; the wrapper carries the same
      // background as the screen so any letterboxing is invisible.
      setScale(Math.min(width / refW, height / refH));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [refW, refH]);

  return (
    <div ref={boxRef} className="relative h-full w-full overflow-hidden" style={{ background: '#070d1a' }}>
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: refW,
          height: refH,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Scroll-driven phase for the hero device reveal.
// 0=none, 1=laptop, 2=iPad, 3=phone (holds until scroll exits)
type DevicePhase = 0 | 1 | 2 | 3;

function HeroSection() {
  const rm = useReducedMotion();
  const spacerRef = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number | null>(null);

  const [isInView, setIsInView] = useState(true); // start true so fixed overlay shows immediately
  const [phase, setPhase] = useState<DevicePhase>(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Laptop is shown open; devices auto-cycle on a timer (no scroll gating).
  const lidProgress = 1;

  const updateScroll = useCallback(() => {
    const el = spacerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vpH  = window.innerHeight;

    const inView = rect.top < vpH && rect.bottom > 0;
    setIsInView(inView); // only re-renders at the in/out boundary

    // Seamless exit: shrink the overlay from the bottom as the spacer exits the
    // viewport, revealing ProblemSection beneath. Driven directly on the DOM via
    // a ref (no React re-render) so the fixed hero + its bottom ticker stay
    // pixel-synced with the scrolling section during fast/smooth scroll.
    if (overlayRef.current) {
      // 1px overlap so the ticker always slightly overlaps ProblemSection (both
      // bg-background) - no hairline seam at the dock point.
      const b = Math.max(0, vpH - Math.max(0, rect.bottom));
      overlayRef.current.style.bottom = `${b > 0 ? b - 1 : 0}px`;
    }

    rafRef.current = null;
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(updateScroll);
    }
  }, [updateScroll]);

  // Auto-cycle the devices (laptop -> tablet -> phone) on a timer so the hero
  // is no longer scroll-gated. The page scrolls freely.
  useEffect(() => {
    if (rm) { setPhase(3); return; }
    setPhase(1);
    const id = setInterval(() => {
      setPhase((p) => (p >= 3 ? 1 : ((p + 1) as DevicePhase)));
    }, 2800);
    return () => clearInterval(id);
  }, [rm]);

  // Desktop (>=1024px) uses the pinned fixed-overlay scroll choreography.
  // Mobile renders a simple normal-flow hero (text -> device -> logos) so
  // nothing is clipped and the logo bar can't separate on scroll.
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (rm || !isDesktop) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    // Double-deferred init so layout is settled after SPA navigation
    let t: ReturnType<typeof setTimeout>;
    const t0 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        handleScroll();
        t = setTimeout(handleScroll, 200);
      });
    });

    let ro: ResizeObserver | null = null;
    if (spacerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => handleScroll());
      ro.observe(spacerRef.current);
    }

    // Sync the overlay exit to Lenis's smooth-scroll tick (runs in the same frame
    // Lenis sets scrollTop) so the fixed hero's bottom ticker stays locked to the
    // natively-scrolling ProblemSection beneath it - no separation on fast scroll.
    type Lenis = { on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void };
    let lenis: Lenis | null = null;
    const attachLenis = () => {
      const l = (window as unknown as { __lenis?: Lenis }).__lenis;
      if (l && !lenis) { lenis = l; l.on('scroll', updateScroll); }
    };
    attachLenis();
    const lenisTimer = setTimeout(attachLenis, 400); // Lenis inits async in Layout

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(t0);
      clearTimeout(t);
      clearTimeout(lenisTimer);
      lenis?.off('scroll', updateScroll);
      ro?.disconnect();
    };
  }, [rm, handleScroll, isDesktop, updateScroll]);

  const heroText = (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-4 lg:gap-6">
      <motion.h1 variants={fadeUp} className="font-black text-foreground leading-[1.03] tracking-[-0.04em]"
        style={{ fontSize: 'clamp(2.2rem, 4.6vw, 6.2rem)' }}>
        The AI engineering team{' '}
        <span className="text-primary">your firm hasn’t hired.</span>
      </motion.h1>
      <motion.p variants={fadeUp} className="text-muted-foreground leading-[1.75]"
        style={{ fontSize: 'clamp(0.95rem, 1.05vw, 1.35rem)', maxWidth: '44rem' }}>
        Your firm has engineering capacity and no software team. We&rsquo;re civil engineers who write software, and we work embedded in your projects: AI that runs on confidential data, the systems you already own finally talking, and the internal tools you keep putting off.
      </motion.p>
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-1">
        <PrimaryBtn href="/what-we-solve">See what we solve <ArrowRight className="w-4 h-4" /></PrimaryBtn>
        <SecondaryBtn href="/contact">Book a call</SecondaryBtn>
      </motion.div>
      <motion.p variants={fadeUp} className="text-[11px] text-muted-foreground tracking-wide">
        <a href="/what-we-solve/secure-ai" className="hover:text-primary transition-colors">AI on confidential data</a>
        {' · '}
        <a href="/what-we-solve/internal-tools" className="hover:text-primary transition-colors">Tools that don’t exist</a>
        {' · '}
        <a href="/what-we-solve/ai-governance" className="hover:text-primary transition-colors">Oversight</a>
      </motion.p>
    </motion.div>
  );

  const tickerBar = (
    <div className="relative z-10 bg-background border-t border-border flex-shrink-0 py-4 overflow-hidden">
      <InfiniteMarquee speed={28} />
    </div>
  );

  // Mobile: simple, fully-dynamic normal-flow hero. No fixed overlay or scroll
  // spacer, so nothing is clipped and the logo bar sits in flow (can't separate).
  if (!isDesktop) {
    return (
      <section className="px-6 pt-24 pb-2">
        {heroText}
        {/* Cycling devices. Each is sized to fill the stage height so it uses the
            space well, and its screen content is rendered into a larger virtual
            canvas (FittedScreen) then scaled down — so the UI text/buttons read
            proportionately small for that device and nothing clips. */}
        <div className="relative w-full mx-auto mt-8 h-[clamp(310px,86vw,380px)]" data-testid="hero-device-stage">
          <motion.div className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: phase === 1 ? 1 : 0 }} transition={{ duration: 0.5 }}
            style={{ pointerEvents: phase === 1 ? 'auto' : 'none' }}>
            <div className="w-full max-w-[340px]">
              <LaptopShell reducedMotion={Boolean(rm)} skipEntrance>
                <FittedScreen scale={1.18}><VibeOpsShowcaseScreen /></FittedScreen>
              </LaptopShell>
            </div>
          </motion.div>
          <motion.div className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: phase === 2 ? 1 : 0 }} transition={{ duration: 0.5 }}
            style={{ pointerEvents: phase === 2 ? 'auto' : 'none' }}>
            <div className="w-full max-w-[284px]">
              <TabletShell>
                <FittedScreen scale={1.5}><VibeOpsShowcaseScreen /></FittedScreen>
              </TabletShell>
            </div>
          </motion.div>
          <motion.div className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: phase === 3 ? 1 : 0 }} transition={{ duration: 0.5 }}
            style={{ pointerEvents: phase === 3 ? 'auto' : 'none' }}>
            <div className="w-[170px]">
              <PhoneShell>
                <FittedScreen scale={1.7}><VibeOpsShowcaseScreen /></FittedScreen>
              </PhoneShell>
            </div>
          </motion.div>
        </div>
        <div className="mt-8 -mx-6">
          {tickerBar}
        </div>
      </section>
    );
  }

  // Desktop: pinned fixed-overlay scroll choreography.
  return (
    <>
      {/* Scroll spacer - keeps the fixed hero overlay pinned for a short, normal
          hero height, then releases so the page scrolls freely. Devices auto-cycle
          on a timer rather than being gated by scroll position. */}
      <div ref={spacerRef} style={{ height: '140vh' }} aria-hidden="true" />

      {/* Fixed overlay - only mounted while spacer is in view (same as ShowcaseSection).
          This avoids Lenis / sticky incompatibility entirely. */}
      {isInView && (
        <div
          ref={overlayRef}
          className="fixed z-30 w-full bg-background overflow-hidden flex flex-col"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Main content (pt clears the fixed nav) */}
          <div className="flex-1 flex items-start lg:items-center min-h-0 overflow-hidden">
            <div className="mx-auto w-full max-w-[min(93vw,2560px)] px-6 pb-4 pt-16 sm:px-10 lg:px-14 lg:pb-12 lg:pt-20 3xl:px-20">
              <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10 3xl:gap-16 4xl:gap-20">

                {/* LEFT - text + CTAs */}
                <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-4 lg:gap-6">
                  <motion.h1 variants={fadeUp} className="font-black text-foreground leading-[1.03] tracking-[-0.04em]"
                    style={{ fontSize: 'clamp(2.2rem, 4.6vw, 6.2rem)' }}>
                    The AI engineering team{' '}
                    <span className="text-primary">your firm hasn’t hired.</span>
                  </motion.h1>

                  <motion.p variants={fadeUp} className="text-muted-foreground leading-[1.75]"
                    style={{ fontSize: 'clamp(0.95rem, 1.05vw, 1.35rem)', maxWidth: '44rem' }}>
                    Your firm has engineering capacity and no software team. We&rsquo;re civil engineers who write software, and we work embedded in your projects: AI that runs on confidential data, the systems you already own finally talking, and the internal tools you keep putting off.
                  </motion.p>

                  <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-1">
                    <PrimaryBtn href="/what-we-solve">See what we solve <ArrowRight className="w-4 h-4" /></PrimaryBtn>
                    <SecondaryBtn href="/contact">Book a call</SecondaryBtn>
                  </motion.div>

                  <motion.p variants={fadeUp} className="text-[11px] text-muted-foreground tracking-wide">
                    <a href="/what-we-solve/secure-ai" className="hover:text-primary transition-colors">AI on confidential data</a>
                    {' · '}
                    <a href="/what-we-solve/internal-tools" className="hover:text-primary transition-colors">Tools that don’t exist</a>
                    {' · '}
                    <a href="/what-we-solve/ai-governance" className="hover:text-primary transition-colors">Oversight</a>
                  </motion.p>

                </motion.div>

                {/* Devices - on mobile the box is height-bounded to the viewport so
                    every device (incl. the tall portrait phone) fits short screens
                    like the iPhone SE; desktop keeps the fixed 16/9.5 aspect box. */}
                <div className="relative mx-auto h-[26vh] max-h-[220px] w-full max-w-[240px] lg:aspect-[16/9.5] lg:h-auto lg:max-h-none lg:max-w-none lg:min-h-[min(62vh,980px)]">
                  <AnimatePresence>
                    {phase === 0 && (
                      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2, delay: 0 } }}
                        transition={{ duration: 0.7, delay: 1.6 }}>
                        <motion.svg width="52" height="72" viewBox="0 0 20 28" fill="none" className="text-muted-foreground/40"
                          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                          <path d="M10 2L10 24M10 24L3 17M10 24L17 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div className="absolute inset-0 flex items-center justify-center"
                    animate={{ opacity: phase === 1 ? 1 : 0, scale: phase === 1 ? 1 : phase > 1 ? 0.94 : 0.86, x: phase === 1 ? 0 : phase > 1 ? '-10%' : 0, y: phase === 1 ? 0 : phase < 1 ? 18 : 0 }}
                    transition={{ duration: 0.65, ease: E }} style={{ pointerEvents: phase === 1 ? 'auto' : 'none' }}>
                    <HomepageDeviceStage screenContent={<ScaledScreen><VibeOpsShowcaseScreen /></ScaledScreen>} lockedDevice="laptop" hideDots lidProgress={lidProgress} />
                  </motion.div>
                  <motion.div className="absolute inset-0 flex items-center justify-center"
                    animate={{ opacity: phase === 2 ? 1 : 0, scale: phase === 2 ? 1 : phase > 2 ? 0.94 : 0.92, x: phase === 2 ? 0 : phase > 2 ? '-10%' : '18%' }}
                    transition={{ duration: 0.65, ease: E }} style={{ pointerEvents: phase === 2 ? 'auto' : 'none' }}>
                    <HomepageDeviceStage screenContent={<ScaledScreen refW={900} refH={700}><VibeOpsShowcaseScreen /></ScaledScreen>} lockedDevice="tablet" hideDots />
                  </motion.div>
                  <motion.div className="absolute inset-0 flex items-center justify-center"
                    animate={{ opacity: phase === 3 ? 1 : 0, scale: phase === 3 ? 1 : 0.92, x: phase === 3 ? 0 : '18%' }}
                    transition={{ duration: 0.65, ease: E }} style={{ pointerEvents: phase === 3 ? 'auto' : 'none' }}>
                    {/* Phone is portrait - constrain width on mobile so it looks iPhone SE sized */}
                    <div className="w-[12vh] max-w-[120px] lg:w-[min(27vh,420px)] lg:max-w-none">
                      <HomepageDeviceStage screenContent={<ScaledScreen refW={400} refH={866}><VibeOpsShowcaseScreen /></ScaledScreen>} lockedDevice="phone" hideDots />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticker bar */}
          <div className="relative z-10 bg-background border-t border-border flex-shrink-0 py-4 overflow-hidden">
            <InfiniteMarquee speed={28} />
          </div>
        </div>
      )}
    </>
  );
}

// ─── 2. Problem ───────────────────────────────────────────────────────────────

// A realistic half-assembled engineering report - engineers immediately recognise
// the version chaos, reviewer comments about code year disputes, missing load
// values, and photo placeholders with notes from a colleague.
// Every AE engineer has a project folder that looks exactly like this.
// No explanation needed. They feel it immediately.
function ProblemLegacyVisual() {
  const FILES = [
    { name: 'Queensborough_Report_Draft.docx',          date: 'Feb 14',  note: null },
    { name: 'Queensborough_Report_Draft_v2.docx',       date: 'Feb 22',  note: null },
    { name: 'Queensborough_Report_JA_edits.docx',       date: 'Mar 3',   note: null },
    { name: 'Queensborough_Report_FINAL.docx',          date: 'Mar 11',  note: null },
    { name: 'Queensborough_Report_FINAL_v2.docx',       date: 'Mar 18',  note: null },
    { name: 'Queensborough_Report_FINAL_client.docx',   date: 'Mar 25',  note: null },
    { name: 'Queensborough_Report_FINAL_FINAL.docx',    date: 'Apr 4',   note: 'sent to client' },
    { name: 'Queensborough_Report_FINAL_FINAL_rev.docx',date: 'Apr 9',   note: 'client comments' },
  ] as const;

  return (
    <div className="relative w-full">
      {/* Folder header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <p className="text-[11px] text-muted-foreground ml-2">Projects / Bridge_Inspections / Queensborough_2024</p>
      </div>

      {/* File list */}
      <div className="space-y-0.5">
        {FILES.map((f, i) => {
          const isLast = i === FILES.length - 1;
          const isSent = f.note === 'sent to client';
          return (
            <motion.div
              key={f.name}
              className="flex items-center gap-3 px-3 py-2 rounded-lg group"
              style={{
                background: isLast ? 'rgba(239,68,68,0.07)' : i % 2 === 0 ? 'hsl(var(--secondary))' : 'transparent',
                border: isLast ? '1px solid rgba(239,68,68,0.22)' : '1px solid transparent',
              }}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Word icon */}
              <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(43,92,230,0.22)' }}>
                <FileText className="w-3 h-3" style={{ color: '#5b8def' }} />
              </div>

              {/* Filename */}
              <p
                className={`text-[11.5px] flex-1 truncate ${isLast ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
              >
                {f.name}
              </p>

              {/* Date + note */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-muted-foreground">{f.date}</span>
                {f.note && (
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded"
                    style={{
                      background: isSent ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)',
                      color: isSent ? '#34d399' : '#f87171',
                      border: `1px solid ${isSent ? 'rgba(52,211,153,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    }}
                  >
                    {f.note}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom line */}
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">8 versions. 1 report. 7 weeks.</p>
        <p className="text-[11px] font-semibold" style={{ color: 'rgba(239,68,68,0.7)' }}>
          Every. Single. Project.
        </p>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="relative z-20 border-t border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[min(92vw,1900px)] px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-center">
          <div className="order-last lg:order-first max-h-[72vh] lg:max-h-none overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm"><ProblemLegacyVisual /></div>
          <div className="order-first lg:order-last">
            <Label>The Problem</Label>
            <h2
              className="font-bold text-foreground tracking-[-0.03em] leading-[1.08] mb-5 mt-3"
              style={{ fontSize: 'clamp(1.7rem, 2.3vw, 3.2rem)' }}
            >
              Every firm has a list of fixes nobody has time to build.
            </h2>
            <p className="text-muted-foreground leading-[1.78] mb-4" style={{ fontSize: 'clamp(0.92rem, 0.95vw, 1.2rem)' }}>
              This folder is one version of it, and every engineer recognises it. Yours might be the systems that don’t talk to each other, the spreadsheet one person maintains, or twenty years of past projects nobody can search.
            </p>
            <p className="text-muted-foreground leading-[1.78]" style={{ fontSize: 'clamp(0.92rem, 0.95vw, 1.2rem)' }}>
              The fixes are obvious. Nobody builds them, because a firm full of engineers has no reason to also employ software engineers. That’s the job we take.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 3. The gap in the market ────────────────────────────────────────────────
// The wedge, and the most-repeated structural finding in discovery: the largest
// firms built internal AI capability, the smallest have no budget, and the
// firms in between appointed an AI champion who already has a full-time job.

function TheGapSection() {
  return (
    <section className="relative z-20 border-t border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[min(92vw,1800px)] px-6 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <Label>The gap</Label>
            <h2
              className="mb-6 mt-3 font-bold leading-[1.08] tracking-[-0.03em] text-foreground"
              style={{ fontSize: 'clamp(1.8rem, 2.4vw, 3.4rem)' }}
            >
              The largest firms built AI teams.{' '}
              <span className="text-primary">You got an AI committee.</span>
            </h2>
            <p className="mb-5 leading-[1.8] text-muted-foreground" style={{ fontSize: 'clamp(0.92rem, 0.95vw, 1.2rem)' }}>
              Firms of 10,000 and up have digital centres of excellence and internal
              software teams. Firms under fifty have neither the budget nor the need.
              Almost everyone else sits in between: enough scale to have the problem,
              nowhere near enough to justify hiring software engineers into an
              engineering practice.
            </p>
            <p className="mb-8 leading-[1.8] text-muted-foreground" style={{ fontSize: 'clamp(0.92rem, 0.95vw, 1.2rem)' }}>
              So those firms appoint someone. An AI champion, an innovation lead, a
              committee. Capable people handed a mandate and no engineering capacity
              to deliver it. We fill that gap with software that ships, not advice.
            </p>
            <div className="flex flex-wrap gap-3">
              <PrimaryBtn href="/how-we-work">How we work <ArrowRight className="h-4 w-4" /></PrimaryBtn>
              <SecondaryBtn href="/proof">See what we have built</SecondaryBtn>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-3">
              {[
                {
                  size: '10,000+ staff',
                  state: 'Has an internal AI team',
                  quote: 'By the time the internal team delivers the tool, the moment for it has passed.',
                  who: 'Engineer, multinational AE firm',
                  dim: true,
                },
                {
                  size: '75–750 staff',
                  state: 'Has a mandate and no team',
                  quote: 'They were weighing whether to spend capital building internally. So far the internal attempt had failed.',
                  who: 'Coordinator, national construction group',
                  dim: false,
                },
                {
                  size: 'Under 50 staff',
                  state: 'Not yet the problem',
                  quote: 'Everything still runs on paper and spreadsheets.',
                  who: 'President, regional engineering firm',
                  dim: true,
                },
              ].map((t) => (
                <div
                  key={t.size}
                  className={`rounded-2xl border p-6 transition-colors ${
                    t.dim
                      ? 'border-border bg-card opacity-60'
                      : 'border-primary/30 bg-primary/[0.05]'
                  }`}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-foreground">
                      {t.size}
                    </p>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${t.dim ? 'text-muted-foreground' : 'text-primary'}`}>
                      {t.state}
                    </p>
                  </div>
                  <p className="mb-2 text-[13.5px] italic leading-relaxed text-muted-foreground">
                    “{t.quote}”
                  </p>
                  <p className="text-[10.5px] uppercase tracking-[0.13em] text-muted-foreground">
                    {t.who}
                  </p>
                </div>
              ))}
              <p className="pt-2 text-center text-[11.5px] text-muted-foreground">
                Drawn from documented conversations with 100+ AE and construction professionals.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── 4. Which of these is you ────────────────────────────────────────────────
// The primary navigation device on the page. Someone should find themselves
// here without needing a view on AI.

function SixProblemsSection() {
  return (
    <section className="relative z-20 border-t border-b border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[min(92vw,1800px)] px-6 lg:px-10">
        <div className="mb-10 md:mb-14">
          <Label>Which of these is you?</Label>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-8">
            <h2
              className="font-bold leading-[1.06] tracking-[-0.025em] text-foreground"
              style={{ fontSize: 'clamp(1.9rem, 2.6vw, 3.8rem)' }}
            >
              Six problems we hear<br />
              <span className="text-primary">in almost every firm.</span>
            </h2>
            <p className="max-w-xs text-[14px] leading-[1.7] text-muted-foreground">
              You don’t need an opinion about AI to recognise these. Pick the one
              that sounds like your week.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 3xl:gap-6">
          {JOBS.map((j, i) => (
            <ProblemCard key={j.id} job={j} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 5. Code Intelligence Preview - animated workflow ────────────────────────
// Bug fix: outer wrapper remounts inner via key so the loop restarts cleanly.
// Root cause: the typing useEffect only ran once (dep=[rm]) so after the first
// cycle reset phase→'input', the typewriter never restarted.

type MCCode = { name: string; short: string; level: string; color: string };
type MCScenario = {
  address: string; province: string; city: string;
  codes: MCCode[];
  standards: { name: string; desc: string }[];
};

const MC_SCENARIOS: MCScenario[] = [
  {
    address: '800 Robson St, Vancouver, BC', province: 'BC', city: 'Vancouver',
    codes: [
      { name: 'National Building Code of Canada', short: 'NBC 2020',  level: 'Federal',    color: '#34d399' },
      { name: 'National Fire Code of Canada',     short: 'NFC 2020',  level: 'Federal',    color: '#34d399' },
      { name: 'BC Building Code',                 short: 'BCBC 2024', level: 'Provincial', color: '#34d399' },
      { name: 'BC Fire Code',                     short: 'BCFC 2024', level: 'Provincial', color: '#34d399' },
      { name: 'Vancouver Building By-law',         short: 'VBL 12511', level: 'Municipal',  color: '#34d399' },
    ],
    standards: [
      { name: 'CSA A23.3-19', desc: 'Concrete structures' },
      { name: 'CSA S16-19',   desc: 'Steel structures' },
      { name: 'CSA O86-19',   desc: 'Engineering timber' },
    ],
  },
  {
    address: '20 Bay St, Toronto, ON', province: 'ON', city: 'Toronto',
    codes: [
      { name: 'National Building Code of Canada', short: 'NBC 2020',  level: 'Federal',    color: '#34d399' },
      { name: 'National Fire Code of Canada',     short: 'NFC 2020',  level: 'Federal',    color: '#34d399' },
      { name: 'Ontario Building Code',            short: 'OBC 2024',  level: 'Provincial', color: '#34d399' },
      { name: 'Toronto Building By-law 569-13',   short: 'TBL 569',   level: 'Municipal',  color: '#34d399' },
    ],
    standards: [
      { name: 'CSA A23.3-19', desc: 'Concrete structures' },
      { name: 'CSA S16-14',   desc: 'Steel structures' },
      { name: 'CSA B44-16',   desc: 'Elevators' },
    ],
  },
  {
    address: '10101 Jasper Ave, Edmonton, AB', province: 'AB', city: 'Edmonton',
    codes: [
      { name: 'National Building Code of Canada', short: 'NBC 2020',  level: 'Federal',    color: '#34d399' },
      { name: 'National Fire Code of Canada',     short: 'NFC 2020',  level: 'Federal',    color: '#34d399' },
      { name: 'Alberta Building Code',            short: 'ABC 2019',  level: 'Provincial', color: '#34d399' },
      { name: 'Edmonton Zoning By-law 12800',     short: 'EZB 12800', level: 'Municipal',  color: '#34d399' },
    ],
    standards: [
      { name: 'CSA A23.3-19', desc: 'Concrete structures' },
      { name: 'CSA S16-19',   desc: 'Steel structures' },
      { name: 'CSA Z662-19',  desc: 'Oil and gas pipelines' },
    ],
  },
  {
    address: '1000 De La Gauchetiere O, Montreal, QC', province: 'QC', city: 'Montreal',
    codes: [
      { name: 'National Building Code of Canada', short: 'NBC 2020', level: 'Federal',    color: '#34d399' },
      { name: 'National Fire Code of Canada',     short: 'NFC 2020', level: 'Federal',    color: '#34d399' },
      { name: 'Code de construction du Quebec',   short: 'CCQ 2023', level: 'Provincial', color: '#34d399' },
      { name: 'Reglement urbanisme Montreal',     short: 'RU MTL',   level: 'Municipal',  color: '#34d399' },
    ],
    standards: [
      { name: 'CSA A23.3-19', desc: 'Concrete structures' },
      { name: 'CSA S16-19',   desc: 'Steel structures' },
      { name: 'CSA S6-19',    desc: 'Bridge design' },
    ],
  },
];

type MCPhase = 'input' | 'analyzing' | 'jurisdictions' | 'codes' | 'standards';

// Outer wrapper: increments key to remount inner and restart the loop
function CodeIntelligenceAnimation() {
  const [loopKey, setLoopKey] = useState(0);
  const [addrIdx, setAddrIdx] = useState(0);
  return (
    <MCAnimInner
      key={loopKey}
      scenario={MC_SCENARIOS[addrIdx % MC_SCENARIOS.length]}
      onDone={() => {
        setAddrIdx((i) => i + 1);
        setLoopKey((k) => k + 1);
      }}
    />
  );
}

function MCAnimInner({
  scenario,
  onDone,
}: {
  scenario: MCScenario;
  onDone: () => void;
}) {
  const rm = useReducedMotion();
  const [phase, setPhase] = useState<MCPhase>('input');
  const [typed, setTyped] = useState('');
  const [visibleCodes, setVisibleCodes] = useState(0);

  // Typing effect - runs once on mount (correct, because component remounts each loop)
  useEffect(() => {
    if (rm) {
      setTyped(scenario.address);
      setPhase('standards');
      setVisibleCodes(scenario.codes.length);
      return;
    }
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      i++;
      setTyped(scenario.address.slice(0, i));
      if (i >= scenario.address.length) {
        clearInterval(id);
        t = setTimeout(() => setPhase('analyzing'), 500);
      }
    }, 42);
    return () => { clearInterval(id); clearTimeout(t); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Phase progression
  useEffect(() => {
    if (phase === 'analyzing') {
      const t = setTimeout(() => setPhase('jurisdictions'), 1100);
      return () => clearTimeout(t);
    }
    if (phase === 'jurisdictions') {
      const t = setTimeout(() => setPhase('codes'), 700);
      return () => clearTimeout(t);
    }
    if (phase === 'codes') {
      let idx = 0;
      const id = setInterval(() => {
        idx++;
        setVisibleCodes(idx);
        if (idx >= scenario.codes.length) {
          clearInterval(id);
          setTimeout(() => setPhase('standards'), 350);
        }
      }, 160);
      return () => clearInterval(id);
    }
    if (phase === 'standards') {
      const t = setTimeout(onDone, 3800);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  const statusColor = phase === 'standards' ? '#34d399' : phase === 'analyzing' ? '#fbbf24' : '#34d399';
  const statusLabel = phase === 'input' ? 'Ready' : phase === 'analyzing' ? 'Analyzing…' : phase === 'jurisdictions' ? 'Mapping stack…' : phase === 'codes' ? 'Loading codes…' : '✓ Grounded';

  return (
    <div
      className="rounded-2xl overflow-hidden border border-border bg-card w-full max-w-[460px] shadow-sm"
      style={{ minHeight: '560px' }}
    >
      {/* App chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 mx-2">
          <div className="bg-muted rounded-md px-2 py-1 text-center text-[8px] text-muted-foreground border border-border truncate">
            Code Intelligence · Jurisdictional Lookup
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={phase}
            initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="text-[7.5px] font-bold uppercase tracking-wider flex-shrink-0"
            style={{ color: statusColor }}
          >
            {statusLabel}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="p-4 space-y-3">
        {/* Canadian flag strip + address input */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[7.5px] uppercase tracking-[0.18em] text-muted-foreground font-bold">Project Address</p>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0 rounded-xl border border-border bg-secondary px-3 py-2.5 flex items-center gap-2 min-h-[40px]">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#34d399' }} />
              <span className="text-[11px] text-foreground font-mono truncate flex-1">
                {typed}
                {phase === 'input' && <span className="inline-block w-0.5 h-3 bg-foreground/60 ml-0.5 animate-pulse" />}
              </span>
            </div>
            <motion.div
              className="px-4 py-2 rounded-xl text-[10px] font-bold text-primary-foreground flex items-center flex-shrink-0"
              style={{ background: '#34d399' }}
              animate={{ opacity: phase === 'input' ? 0.45 : 1, scale: phase === 'analyzing' ? [1, 0.96, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              Analyze
            </motion.div>
          </div>
        </div>

        {/* Analyzing pulse */}
        <AnimatePresence>
          {phase === 'analyzing' && (
            <motion.div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.18)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"
                animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.7, repeat: Infinity }}
              />
              <p className="text-[9px] text-amber-400/80 font-semibold">Resolving jurisdiction stack…</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jurisdiction layer badges */}
        <AnimatePresence>
          {(phase === 'jurisdictions' || phase === 'codes' || phase === 'standards') && (
            <motion.div
              className="space-y-1.5"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[7.5px] uppercase tracking-[0.15em] text-muted-foreground font-bold mb-1">Jurisdiction layers</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Federal - Canada',       color: '#34d399' },
                  { label: `Provincial - ${scenario.province}`, color: '#34d399' },
                  { label: `Municipal - ${scenario.city}`,      color: '#34d399' },
                ].map((j, i) => (
                  <motion.span
                    key={j.label}
                    initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22, delay: i * 0.1 }}
                    className="text-[8px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${j.color}12`, color: j.color, border: `1px solid ${j.color}28` }}
                  >
                    {j.label}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Codes list */}
        <AnimatePresence>
          {(phase === 'codes' || phase === 'standards') && (
            <motion.div
              className="rounded-xl border border-border overflow-hidden"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-secondary">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Applicable Codes</p>
                <span className="text-[7.5px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.22)' }}>
                  {visibleCodes} matched
                </span>
              </div>
              {scenario.codes.slice(0, visibleCodes).map((c, i) => (
                <motion.div
                  key={c.name}
                  className="flex items-center justify-between px-3 py-2 border-b border-border last:border-0"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-foreground truncate">{c.name}</p>
                    <p className="text-[7px] text-muted-foreground font-mono">{c.short}</p>
                  </div>
                  <span
                    className="text-[7px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                    style={{ background: `${c.color}14`, color: c.color, border: `1px solid ${c.color}28` }}
                  >
                    {c.level}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CSA referenced standards */}
        <AnimatePresence>
          {phase === 'standards' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.32 }}
            >
              <p className="text-[7.5px] uppercase tracking-[0.15em] text-muted-foreground font-bold mb-1.5">CSA Referenced Standards</p>
              <div className="grid grid-cols-3 gap-1.5">
                {scenario.standards.map((s, i) => (
                  <motion.div
                    key={s.name}
                    className="rounded-lg px-2 py-2 text-center"
                    style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.16)' }}
                    initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.08 }}
                  >
                    <p className="text-[8.5px] font-bold" style={{ color: '#34d399' }}>{s.name}</p>
                    <p className="text-[7px] text-muted-foreground mt-0.5">{s.desc}</p>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CodeIntelligenceSection() {
  return (
    <section className="relative z-[30] border-t border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[min(92vw,1800px)] px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left: copy */}
          <Reveal>
            <Label>Something we already built</Label>
            <h2
              className="font-black text-foreground tracking-[-0.035em] leading-[1.06] mb-5 mt-2"
              style={{ fontSize: 'clamp(1.9rem, 2.6vw, 3.8rem)' }}
            >
              Every code that applies,{' '}
              <span className="text-primary">tied to the address.</span>
            </h2>
            <p className="text-muted-foreground leading-[1.75] mb-5" style={{ fontSize: 'clamp(0.95rem, 1vw, 1.25rem)', maxWidth: '46rem' }}>
              North American projects sit under federal, state or provincial and municipal codes at once, and working out which apply is a tax every project pays. So we built the lookup. Enter a project address, get the applicable code stack and the referenced standards, with every citation traceable to source.
            </p>
            <p className="text-muted-foreground leading-[1.75] mb-7" style={{ fontSize: 'clamp(0.95rem, 1vw, 1.25rem)', maxWidth: '46rem' }}>
              This one is ours, and it is the point of working the way we do. Every engagement leaves us with something we can carry into the next one, so the firm after you isn’t paying us to learn civil engineering from scratch.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'Federal, state/provincial and municipal layers resolved together',
                'Municipal bylaws and site-specific overlays surfaced for you',
                'Referenced standards pulled in alongside the codes that invoke them',
                'Every citation traceable to source, so a reviewer checks it instead of trusting it',
                'Deployed inside the environment your security team approved',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.28)' }}>
                    <Check className="w-2.5 h-2.5" style={{ color: '#34d399' }} />
                  </div>
                  <p className="text-[13.5px] text-muted-foreground leading-[1.65]">{item}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <PrimaryBtn href="/proof">See our work <ArrowRight className="w-4 h-4" /></PrimaryBtn>
              <SecondaryBtn href="/what-we-solve">All six problems</SecondaryBtn>
            </div>
          </Reveal>

          {/* Right: animated workflow */}
          <Reveal delay={0.1} className="flex justify-center lg:justify-end overflow-hidden">
            <div className="w-full max-w-[480px] lg:max-w-none">
              <CodeIntelligenceAnimation />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── 6. How we work ──────────────────────────────────────────────────────────
// Step 2 of the journey lives here: the champion has forwarded the page and a
// principal wants to know what an engagement actually is.

function HowWeWorkSection() {
  return (
    <section className="relative z-20 border-t border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[min(92vw,1800px)] px-6 lg:px-10">
        <Reveal>
          <Label>How we work</Label>
          <h2
            className="mb-5 mt-3 max-w-2xl font-bold leading-[1.08] tracking-[-0.025em] text-foreground"
            style={{ fontSize: 'clamp(1.8rem, 2.4vw, 3.4rem)' }}
          >
            We embed with your team{' '}
            <span className="text-primary">and scope it in writing first.</span>
          </h2>
          <p className="mb-12 max-w-2xl leading-[1.8] text-muted-foreground" style={{ fontSize: 'clamp(0.92rem, 0.95vw, 1.2rem)' }}>
            Our engineers work inside your projects, on your real files, next to the
            people who do the work. It’s the only way to learn a workflow well enough
            to build for it. Discovery writes that down as a technical plan, a data
            governance and security plan and a prioritised backlog, and you approve all
            of it before anyone starts building. Where the work depends on AI doing
            something specific, we prove it on your own documents first.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 3xl:gap-6">
          {[
            { n: '01', t: 'Discovery', d: 'We sit with your team, learn the workflow and write it down. You approve it.' },
            { n: '02', t: 'Proof gate', d: 'We prove the hard part on your real documents before you fund the build.' },
            { n: '03', t: 'Build', d: 'Fixed scope, fixed fee, defined acceptance tests.' },
            { n: '04', t: 'Pilot', d: 'Your team runs it on live work through structured revisions.' },
            { n: '05', t: 'You own it', d: 'Codebase, workflows and documentation transfer to you.' },
          ].map((step, i) => (
            <Reveal key={step.n} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                  {step.n}
                </p>
                <h3 className="mb-2 text-[14.5px] font-bold text-foreground">{step.t}</h3>
                <p className="text-[12.5px] leading-[1.6] text-muted-foreground">{step.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap gap-3">
            <PrimaryBtn href="/how-we-work">See the full engagement <ArrowRight className="h-4 w-4" /></PrimaryBtn>
            <SecondaryBtn href="/proof">What we have built</SecondaryBtn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 7. Security ─────────────────────────────────────────────────────────────
// Step 3 of the journey. Discovery said the IT gate kills more deals than the
// technology does, so it gets a homepage slot and a no-form destination.

function SecuritySection() {
  return (
    <section className="relative z-20 border-t border-border bg-background py-20 md:py-24">
      <div className="mx-auto max-w-[min(92vw,1800px)] px-6 lg:px-10">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm md:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary">
                  <ShieldCheck className="h-4.5 w-4.5 text-primary" />
                </div>
                <Label>For whoever has to approve this</Label>
                <h2
                  className="mb-5 mt-3 font-bold leading-[1.1] tracking-[-0.025em] text-foreground"
                  style={{ fontSize: 'clamp(1.6rem, 2vw, 2.9rem)' }}
                >
                  Your IT department is right to block the public tools.
                </h2>
                <p className="mb-7 leading-[1.8] text-muted-foreground" style={{ fontSize: 'clamp(0.9rem, 0.92vw, 1.15rem)' }}>
                  Project material is client property under confidentiality terms. Most
                  firms told us the blocker was never the technology, it was the
                  approval. So we design for that review from the first week:
                  deployment inside your boundary, no training on your data, and a
                  written governance plan your team signs off before we build.
                </p>
                <VibeLinkishBtn />
              </div>
              <div className="space-y-2.5">
                {[
                  'Deployed in your tenancy, your infrastructure, or a dedicated environment',
                  'Your data is never used to train models or pooled across clients',
                  'Data residency treated as a hard requirement, not a preference',
                  'Governance and security plan approved in writing before development',
                  'Audit trail of what was generated, from what source, reviewed by whom',
                ].map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <div
                      className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.28)' }}
                    >
                      <Check className="h-2.5 w-2.5" style={{ color: '#34d399' }} />
                    </div>
                    <p className="text-[13px] leading-[1.65] text-muted-foreground">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function VibeLinkishBtn() {
  return (
    <div className="flex flex-wrap gap-3">
      <PrimaryBtn href="/security">Read our data handling <ArrowRight className="h-4 w-4" /></PrimaryBtn>
      <SecondaryBtn href="/what-we-solve/secure-ai">AI on confidential data</SecondaryBtn>
    </div>
  );
}

// ─── 7. Team ──────────────────────────────────────────────────────────────────

const TEAM_MEMBERS = [
  { name: 'Zander Dent',      role: 'CEO',                    image: '/team/zander-optimized.jpg' },
  { name: 'Félix Stewart',    role: 'Co-Founder & Co-Owner',  image: '/team/felix-optimized.jpg'  },
];

function TeamSection() {
  return (
    <section className="relative z-20 border-t border-border bg-background py-20 md:py-24">
      <div className="mx-auto max-w-[min(92vw,1600px)] px-6 md:px-10">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-6 md:mb-14">
            <div>
              <Label>Built by engineers, for engineers</Label>
              <h2 className="text-[2.1rem] sm:text-4xl font-bold tracking-[-0.025em] text-foreground mt-3">
Civil engineers who can also ship the software.
              </h2>
            </div>
            <motion.a
              href="/team"
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-[0.15em] hover:text-foreground transition-colors duration-200"
              whileHover={{ x: 1 }}
            >
              Full team <ArrowUpRight className="w-3 h-3" />
            </motion.a>
          </div>
        </Reveal>

        <Rule className="mb-6 md:mb-14" />

        <Reveal className="mb-12">
          <motion.div
            className="relative rounded-2xl overflow-hidden border border-border shadow-sm"
            transition={{ duration: 0.3, ease: E }}
          >
            <img
              src="/team/full-team-pic-optimized.jpg"
              alt="VibeOps founding team"
              className="w-full h-auto block"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 px-8 py-7 flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-white/60 mb-1">VibeOps Technologies Inc. - Vancouver, BC</p>
                <p className="text-base md:text-lg font-semibold text-white">Built on documented conversations with 100+ AE professionals across North America.</p>
              </div>
              <motion.a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-[13.5px] font-bold whitespace-nowrap shadow-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={HOMEPAGE_MOTION.hoverSpring}
              >
                Talk to the team
              </motion.a>
            </div>
          </motion.div>
        </Reveal>

        <motion.div
          className="flex justify-center gap-12 sm:gap-20 flex-wrap"
          variants={{ ...stagger, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {TEAM_MEMBERS.map((m) => (
            <motion.a
              key={m.name}
              href={`/team?member=${encodeURIComponent(m.name)}`}
              variants={fadeUp}
              className="flex flex-col items-center gap-3 group"
              whileHover={{ y: -3 }}
              transition={HOMEPAGE_MOTION.hoverSpring}
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-border group-hover:border-primary/50 transition-colors duration-300">
                <img
                  src={m.image}
                  alt={`${m.name} - ${m.role}`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground leading-tight">{m.name.split(' ')[0]}</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-1">{m.role}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── 8. Final CTA ─────────────────────────────────────────────────────────────

const PITCH_VIDEO_SRC =
  'https://www.youtube.com/embed/Ul6O1bC7TzE?controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1';

function FinalCTASection() {
  return (
    <section className="relative z-20 border-t border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[min(92vw,1600px)] px-6 md:px-10">
        <Reveal className="text-center mb-14">
          <div className="space-y-2 mb-2">
            <p className="font-semibold text-muted-foreground tracking-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>Your firm has an AI mandate.</p>
            <p className="font-semibold text-muted-foreground tracking-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>It doesn’t have AI engineers.</p>
            <p className="font-bold text-foreground tracking-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>That’s the whole of what we do.</p>
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
          <motion.div variants={fadeUp}><Label>Ready when you are</Label></motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-[2.4rem] sm:text-5xl md:text-[3.4rem] font-bold tracking-[-0.03em] text-foreground mb-6 mt-4 leading-[1.06]"
          >
            Become a firm that builds its own tools.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground text-[0.95rem] leading-[1.8] mb-10 max-w-sm"
          >
            You already have the engineering capacity. What you don’t have is a
            software team built around it. That’s our half of the work.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <PrimaryBtn href="/contact">Book a call <ArrowRight className="w-3.5 h-3.5" /></PrimaryBtn>
            <SecondaryBtn href="/what-we-solve">See what we solve</SecondaryBtn>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative rounded-2xl overflow-hidden border border-border shadow-sm"
          style={{ paddingBottom: '56.25%', height: 0 }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: E }}
        >
          <iframe
            src={PITCH_VIDEO_SRC}
            allow="encrypted-media"
            title="VibeOps - the AI engineering team for architecture and engineering firms"
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}
