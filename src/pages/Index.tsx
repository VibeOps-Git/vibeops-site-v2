// src/pages/Index.tsx
// VibeOps platform homepage - customer-conversion focused.
// Promotes the full ecosystem: Reportly, Custom Rollouts.
// Hero: clean platform reveal, no GSAP pin.
// Sections: problem → products → previews → proof → CTA.

import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import {
  FileText, MapPin, Wrench, Check, ArrowRight,
  ArrowUpRight, Star,
} from 'lucide-react';
import { useRef, useEffect, useLayoutEffect, useState, useCallback, ReactNode } from 'react';
import { SEO } from '@/components/SEO';
import { HomepageDeviceStage, SectionLaptop, LaptopShell, TabletShell, PhoneShell } from '@/components/homepage/DeviceScene';
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

function useCountUp(target: number, duration = 1.8) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    import('framer-motion').then(({ animate }) => {
      const c = animate(0, target, {
        duration,
        ease: E,
        onUpdate: (v) => setVal(Math.round(v)),
      });
      return () => c.stop();
    });
  }, [inView, target, duration]);
  return { ref, val };
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

// ─── Platform Ecosystem Visual ───────────────────────────────────────────────

const PRODUCTS = [
  {
    id: 'reportly',
    name: 'Reportly',
    tag: 'Report Automation',
    description: 'Engineering report drafts pulled from your templates, field notes, and data. Code references included.',
    accent: '#34d399',
    icon: FileText,
    href: '/reportly',
    badge: null,
  },
  {
    id: 'codes',
    name: 'Code Intelligence',
    tag: 'Building Code Intelligence',
    description: 'Type in a project address. Get every Canadian building code that applies to it.',
    accent: '#34d399',
    icon: MapPin,
    href: '/reportly',
    badge: null,
  },
  {
    id: 'custom',
    name: 'Custom Rollouts',
    tag: 'Firm-Specific Software',
    description: 'Tools, dashboards, and automations built around the way your firm already works.',
    accent: '#60a5fa',
    icon: Wrench,
    href: '/services',
    badge: null,
  },
] as const;

function PlatformEcosystemCard({
  product, delay = 0, skipReveal = false,
}: {
  product: typeof PRODUCTS[number];
  delay?: number;
  // skipReveal: pass true when rendering inside a fixed overlay.
  // Fixed elements are always "in view" so whileInView would flash opacity:0
  // for one frame before the observer fires. Skip it and just render visible.
  skipReveal?: boolean;
}) {
  const Icon = product.icon;

  return (
    <motion.a
      href={product.href}
      className="group relative rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 cursor-pointer shadow-sm"
      initial={skipReveal ? false : { opacity: 0 }}
      whileInView={skipReveal ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay, ease: E }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${product.accent}14`, border: `1px solid ${product.accent}28` }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color: product.accent }} />
        </div>
        {product.badge && (
          <span
            className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: `${product.accent}14`, color: product.accent, border: `1px solid ${product.accent}28` }}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: product.accent }}>
          {product.tag}
        </p>
        <h3 className="text-[16px] font-bold text-foreground leading-tight mb-1.5">{product.name}</h3>
        <p className="text-[12.5px] text-muted-foreground leading-[1.65]">{product.description}</p>
      </div>
      <div className="flex items-center gap-1 mt-auto" style={{ color: product.accent }}>
        <span className="text-[11px] font-semibold">Take a look</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
      </div>
    </motion.a>
  );
}


// ─── Page ───────────────────────────────────────────────────────────────────

export default function Index() {
  return (
    <>
      <SEO
        title="Engineering Report Automation & Building Code Intelligence for AE Firms"
        description="VibeOps builds report automation, building code intelligence, and workflow software for civil and structural AE firms, cutting manual work out of compliance."
        canonical="https://www.vibeops.ca/"
      />
      <HeroSection />
      <ProblemSection />
      <ProductPillarsSection />
      <ReportlyRevealSection />
      <CodeIntelligenceSection />
      {/* Continuous opaque backing: prevents the fixed hero background from
          bleeding through sub-pixel seams between these stacked sections during
          fast smooth-scroll (the testimonials "separation"/jump). */}
      <div className="relative z-20 bg-background">
        <TestimonialsSection />
        <ProofSection />
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
        style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}>
        Building code smarts and reporting software{' '}
        <span className="text-primary">for AE firms.</span>
      </motion.h1>
      <motion.p variants={fadeUp} className="text-muted-foreground leading-[1.75]"
        style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', maxWidth: '36rem' }}>
        We help architecture and engineering teams cut down the manual work in reporting, code compliance, and field workflows. The tools fit the way your firm already works, not the other way around.
      </motion.p>
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-1">
        <PrimaryBtn href="/services">See what we build <ArrowRight className="w-4 h-4" /></PrimaryBtn>
        <SecondaryBtn href="/contact">Book a call</SecondaryBtn>
      </motion.div>
      <motion.p variants={fadeUp} className="text-[11px] text-muted-foreground tracking-wide">
        <a href="/reportly" className="hover:text-primary transition-colors">Reportly</a>
        {' · '}
        <a href="/services" className="hover:text-primary transition-colors">Custom Rollouts</a>
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

      {/* Reportly - laptop + text, fixed at z-2, vertically centered.
          Reportly section (z-10) is transparent so this shows through.
          Covered by Three Ways z-20 above and MapleCodes z-30 below. */}
      <div className="pointer-events-none fixed inset-0 flex items-center" style={{ zIndex: 2 }}>
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-14">
          {/* Desktop: laptop left, text right */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-center">
            <HomepageDeviceStage videoSrc="/vids/demo-vid.mp4" lockedDevice="laptop" hideDots />
            <div style={{ pointerEvents: 'auto' }} className="flex flex-col">
              <p className="text-[10px] uppercase tracking-[0.35em] text-primary font-black mb-3">Reportly</p>
              <h2 className="font-bold text-foreground tracking-[-0.03em] leading-[1.1] mb-4"
                style={{ fontSize: 'clamp(1.6rem, 2.2vw, 2.4rem)' }}>
                Scattered inputs in,{' '}
                <span className="text-primary">a report draft out.</span>
              </h2>
              <p className="text-muted-foreground leading-[1.75] mb-6 text-[15px]">
                Templates, field notes, photos, tables, and the right code references. You get a first draft in minutes, not days.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/reportly" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground text-[14px] font-bold whitespace-nowrap shadow-sm">
                  See Reportly <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-secondary text-muted-foreground text-[13.5px] font-semibold whitespace-nowrap">
                  Book a call
                </a>
              </div>
            </div>
          </div>
          {/* Mobile: laptop full width, generous gap, text centered below */}
          <div className="lg:hidden flex flex-col items-center gap-12">
            <div className="w-full">
              <HomepageDeviceStage videoSrc="/vids/demo-vid.mp4" lockedDevice="laptop" hideDots />
            </div>
            <div style={{ pointerEvents: 'auto' }} className="w-full text-center px-2">
              <p className="text-[10px] uppercase tracking-[0.35em] text-primary font-black mb-3">Reportly</p>
              <h2 className="font-bold text-foreground tracking-[-0.03em] leading-[1.1] mb-4"
                style={{ fontSize: 'clamp(1.5rem, 5.5vw, 2.1rem)' }}>
                Scattered inputs in,{' '}
                <span className="text-primary">a report draft out.</span>
              </h2>
              <div className="flex flex-wrap gap-2 justify-center">
                <a href="/reportly" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-bold whitespace-nowrap shadow-sm">
                  See Reportly <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a href="/contact" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-secondary text-muted-foreground text-[13px] font-semibold whitespace-nowrap">
                  Book a call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>


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
            <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-14 pt-16 pb-4 lg:pt-28 lg:pb-20">
              <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-10 items-center">

                {/* LEFT - text + CTAs */}
                <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-4 lg:gap-6">
                  <motion.h1 variants={fadeUp} className="font-black text-foreground leading-[1.03] tracking-[-0.04em]"
                    style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}>
                    Building code smarts and reporting software{' '}
                    <span className="text-primary">for AE firms.</span>
                  </motion.h1>

                  <motion.p variants={fadeUp} className="text-muted-foreground leading-[1.75]"
                    style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', maxWidth: '36rem' }}>
                    We help architecture and engineering teams cut down the manual work in reporting, code compliance, and field workflows. The tools fit the way your firm already works, not the other way around.
                  </motion.p>

                  <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-1">
                    <PrimaryBtn href="/services">See what we build <ArrowRight className="w-4 h-4" /></PrimaryBtn>
                    <SecondaryBtn href="/contact">Book a call</SecondaryBtn>
                  </motion.div>

                  <motion.p variants={fadeUp} className="text-[11px] text-muted-foreground tracking-wide">
                    <a href="/reportly" className="hover:text-primary transition-colors">Reportly</a>
                    {' · '}
                    <a href="/services" className="hover:text-primary transition-colors">Custom Rollouts</a>
                  </motion.p>

                </motion.div>

                {/* Devices - on mobile the box is height-bounded to the viewport so
                    every device (incl. the tall portrait phone) fits short screens
                    like the iPhone SE; desktop keeps the fixed 16/9.5 aspect box. */}
                <div className="relative w-full max-w-[240px] mx-auto h-[26vh] max-h-[220px] lg:max-w-none lg:h-auto lg:max-h-none lg:aspect-[16/9.5]">
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
                    <HomepageDeviceStage screenContent={<VibeOpsShowcaseScreen />} lockedDevice="laptop" hideDots lidProgress={lidProgress} />
                  </motion.div>
                  <motion.div className="absolute inset-0 flex items-center justify-center"
                    animate={{ opacity: phase === 2 ? 1 : 0, scale: phase === 2 ? 1 : phase > 2 ? 0.94 : 0.92, x: phase === 2 ? 0 : phase > 2 ? '-10%' : '18%' }}
                    transition={{ duration: 0.65, ease: E }} style={{ pointerEvents: phase === 2 ? 'auto' : 'none' }}>
                    <HomepageDeviceStage screenContent={<VibeOpsShowcaseScreen />} lockedDevice="tablet" hideDots />
                  </motion.div>
                  <motion.div className="absolute inset-0 flex items-center justify-center"
                    animate={{ opacity: phase === 3 ? 1 : 0, scale: phase === 3 ? 1 : 0.92, x: phase === 3 ? 0 : '18%' }}
                    transition={{ duration: 0.65, ease: E }} style={{ pointerEvents: phase === 3 ? 'auto' : 'none' }}>
                    {/* Phone is portrait - constrain width on mobile so it looks iPhone SE sized */}
                    <div className="w-[12vh] max-w-[120px] lg:contents">
                      <HomepageDeviceStage screenContent={<VibeOpsShowcaseScreen />} lockedDevice="phone" hideDots />
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
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-center">
          <div className="order-last lg:order-first max-h-[72vh] lg:max-h-none overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm"><ProblemLegacyVisual /></div>
          <div className="order-first lg:order-last">
            <Label>The Problem</Label>
            <h2
              className="font-bold text-foreground tracking-[-0.03em] leading-[1.08] mb-5 mt-3"
              style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.5rem)' }}
            >
              AE teams lose months to scattered reporting.
            </h2>
            <p className="text-muted-foreground leading-[1.78] mb-4" style={{ fontSize: 'clamp(0.92rem, 1.3vw, 1rem)' }}>
              Templates, field photos, code references, and spreadsheets all live in different places. Every report gets assembled by hand. Every project means looking up the same codes again.
            </p>
            <p className="text-muted-foreground leading-[1.78]" style={{ fontSize: 'clamp(0.92rem, 1.3vw, 1rem)' }}>
              We pull that work into real software, so your engineers can spend their time on engineering instead of formatting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 3. Product Pillars + Laptop Reveal ──────────────────────────────────────
// The Three Ways section lives in normal DOM flow (min-h-screen so it fills the
// viewport). When it starts to scroll off the top, a fixed overlay activates at
// z=25 with the FRONT LAYER (Three Ways clone) positioned at translateY=0
// (matching the DOM section exactly - seamless handoff). The DOM section is
// immediately hidden via direct DOM mutation. The front layer then slides upward
// at 1.2× scroll speed, revealing the laptop + Reportly text behind it.
// No pop-in. No black gap. No z-index tricks needed.


function ProductPillarsSection() {
  return (
    <section className="relative z-20 border-t border-b border-border bg-background py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="mb-10 md:mb-14">
          <Label>What we do</Label>
          <div className="flex items-end justify-between gap-8 flex-wrap mt-3">
            <h2
              className="font-bold text-foreground tracking-[-0.025em] leading-[1.06]"
              style={{ fontSize: 'clamp(1.9rem, 3vw, 2.8rem)' }}
            >
              Three ways we help<br />
              <span className="text-primary">AE firms move faster.</span>
            </h2>
            <p className="text-[14px] text-muted-foreground max-w-xs leading-[1.7]">
              Software we built, plus custom work for firms that need it. Either way, it fits how you already work.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTS.map((p, i) => (
            <PlatformEcosystemCard key={p.id} product={p} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReportlyRevealSection() {
  return (
    <>
      {/* Desktop: transparent gap that reveals the fixed z-2 "Scattered inputs" scene */}
      <section className="relative z-[10] border-t border-border hidden lg:block"
        style={{ minHeight: '85vh', background: 'transparent' }} />
      {/* Mobile: render that same scene inline, in normal flow */}
      <section className="relative z-20 bg-background border-t border-border py-16 px-6 lg:hidden">
        <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
          <div className="w-full max-w-[320px]">
            <SectionLaptop videoSrc="/vids/demo-vid.mp4" />
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-primary font-black mb-3">Reportly</p>
            <h2 className="font-bold text-foreground tracking-[-0.03em] leading-[1.1] mb-4"
              style={{ fontSize: 'clamp(1.6rem, 6vw, 2.1rem)' }}>
              Scattered inputs in,{' '}
              <span className="text-primary">a report draft out.</span>
            </h2>
            <p className="text-muted-foreground leading-[1.7] mb-6 text-[15px]">
              Templates, field notes, photos, tables, and the right code references. You get a first draft in minutes, not days.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/reportly" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-[14px] font-bold shadow-sm">
                See Reportly <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-secondary text-muted-foreground text-[13.5px] font-semibold">
                Book a call
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
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
            Reportly - Canadian Building Code Intelligence
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
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left: copy */}
          <Reveal>
            <Label>Code Intelligence</Label>
            <h2
              className="font-black text-foreground tracking-[-0.035em] leading-[1.06] mb-5 mt-2"
              style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)' }}
            >
              Every Canadian code that applies,{' '}
              <span className="text-primary">tied to the address.</span>
            </h2>
            <p className="text-muted-foreground leading-[1.75] mb-7" style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)', maxWidth: '36rem' }}>
              Canadian projects sit under federal, provincial, and municipal codes all at once. Type in a project address and Reportly works out which codes apply, across all 10 provinces and 3 territories, then pulls the right CSA standards into every draft.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'National Building Code, National Fire Code, and federal standards',
                'Provincial codes (BC, ON, AB, QC, and the rest) resolved per address',
                'Municipal bylaws and site-specific overlays surfaced for you',
                'CSA, ASTM, and ISO referenced standards pulled in alongside',
                'Code references cited right inside your report draft',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.28)' }}>
                    <Check className="w-2.5 h-2.5" style={{ color: '#34d399' }} />
                  </div>
                  <p className="text-[13.5px] text-muted-foreground leading-[1.65]">{item}</p>
                </div>
              ))}
            </div>
            <PrimaryBtn href="/reportly">See Reportly <ArrowRight className="w-4 h-4" /></PrimaryBtn>
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

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  { name: 'Jonathan Stacey', title: 'Co-Founder, GrantFundPro', image: '/clients/jonathan.jpg' },
  { name: 'Steve Lisle',     title: 'CEO & Founder, Effortlo',  image: '/clients/steve.png'    },
  { name: 'Ryan Snair',      title: 'Owner, Pro Painting LLC',  image: '/clients/ryan.jpg'     },
];

function TestimonialsSection() {
  return (
    <section className="relative z-20 bg-background py-10 overflow-hidden border-t border-border">
      <p className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-6">
        Trusted by founders and engineers.
      </p>
      <div className="relative">
        <Marquee pxPerSec={34}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-3 px-5 py-4 rounded-2xl border border-border bg-card shadow-sm flex items-center gap-4"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-border flex-shrink-0"
                loading="eager"
                decoding="sync"
              />
              <div>
                <div className="flex gap-0.5 mb-1.5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-[14px] font-semibold text-foreground leading-tight">{t.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{t.title}</p>
              </div>
            </div>
          ))}
        </Marquee>
        <div className="absolute inset-y-0 left-0 w-24 pointer-events-none z-[1]" style={{ background: 'linear-gradient(to right, hsl(var(--background)), transparent)' }} />
        <div className="absolute inset-y-0 right-0 w-24 pointer-events-none z-[1]" style={{ background: 'linear-gradient(to left, hsl(var(--background)), transparent)' }} />
      </div>
    </section>
  );
}

// ─── 6. Proof / credibility ───────────────────────────────────────────────────

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, val } = useCountUp(value, 1.8);
  return (
    <div className="flex flex-col items-center text-center">
      <span ref={ref} className="text-4xl sm:text-5xl font-black text-foreground tabular-nums tracking-tight">
        {val}{suffix}
      </span>
      <span className="text-[12px] text-muted-foreground mt-2 leading-tight max-w-[130px]">{label}</span>
    </div>
  );
}

function ProofSection() {
  return (
    <section className="relative z-20 border-t border-border bg-background py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Stats row */}
        <Reveal className="mb-16">
          <div className="flex flex-wrap justify-center gap-10 sm:gap-16 lg:gap-20">
            <StatItem value={200} suffix="+" label="AE firms we talked to before building" />
            <StatItem value={70} suffix="%" label="Reporting time we aim to cut per firm" />
          </div>
        </Reveal>

        <Rule className="mb-16" />

        {/* Custom Rollouts section */}
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <Label>Custom Rollouts</Label>
            <h2
              className="font-bold text-foreground tracking-[-0.025em] leading-[1.08] mb-5"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
            >
              We build tools around{' '}
              <span className="text-primary">how your firm actually works.</span>
            </h2>
            <p className="text-muted-foreground leading-[1.75] mb-6" style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1rem)' }}>
              Off-the-shelf software rarely fits a firm's workflow. So we set Reportly up around your templates and process, build the dashboards you actually need, automate the document grind, and hook into the tools your team already uses.
            </p>
            <p className="text-muted-foreground leading-[1.75] text-[14px] mb-8">
              Bring us the workflow that slows your team down. We'll map it out and show you what software built around it would look like.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.a
                href="/services"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold bg-primary text-primary-foreground text-[14px] shadow-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={HOMEPAGE_MOTION.hoverSpring}
              >
                See what we build <ArrowRight className="w-4 h-4" />
              </motion.a>
              <SecondaryBtn href="/contact">Book a call</SecondaryBtn>
            </div>
          </Reveal>

          {/* Pillar checklist card */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-4">What we build</p>
              {[
                { label: 'Private Reportly Deployments', detail: 'Your templates, your writing rules, your QA workflow' },
                { label: 'Building Code AI Systems', detail: 'Jurisdiction-specific code search and project workflows' },
                { label: 'Dashboards & Internal Tools', detail: 'Project trackers, asset databases, compliance tools' },
                { label: 'Document Workflow Automation', detail: 'Generation, review, and delivery, done for you' },
                { label: 'Integration with What You Already Use', detail: 'SharePoint, Bluebeam, Procore, and custom APIs' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-primary/10 border border-primary/25">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-foreground">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── 7. Team ──────────────────────────────────────────────────────────────────

const TEAM_MEMBERS = [
  { name: 'Zander Dent',      role: 'CEO',                    image: '/team/zander-optimized.jpg' },
  { name: 'Félix Stewart',    role: 'Co-Founder & Co-Owner',  image: '/team/felix-optimized.jpg'  },
  { name: 'Qazi Omair Ahmed', role: 'CTO',                    image: '/team/omair-optimized.jpg'  },
];

function TeamSection() {
  return (
    <section className="relative z-20 border-t border-border bg-background py-20 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-6 md:mb-14">
            <div>
              <Label>Built by engineers, for engineers</Label>
              <h2 className="text-[2.1rem] sm:text-4xl font-bold tracking-[-0.025em] text-foreground mt-3">
                Civil engineers who can also ship the fix.
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
                <p className="text-base md:text-lg font-semibold text-white">Built off 200+ calls with AE firms across Canada.</p>
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
          className="flex justify-center gap-8 sm:gap-14 flex-wrap"
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
              className="flex flex-col items-center gap-2.5 group"
              whileHover={{ y: -3 }}
              transition={HOMEPAGE_MOTION.hoverSpring}
            >
              <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden border border-border group-hover:border-primary/50 transition-colors duration-300">
                <img
                  src={m.image}
                  alt={`${m.name} - ${m.role}`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="text-center">
                <p className="text-[12px] font-medium text-foreground leading-tight">{m.name.split(' ')[0]}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{m.role}</p>
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
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal className="text-center mb-14">
          <div className="space-y-2 mb-2">
            <p className="font-semibold text-muted-foreground tracking-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>Your engineers already have the field data.</p>
            <p className="font-semibold text-muted-foreground tracking-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>Your firm already has the templates.</p>
            <p className="font-bold text-foreground tracking-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>Stop losing weeks to the assembly in between.</p>
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
            Get your engineering hours back.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground text-[0.95rem] leading-[1.8] mb-10 max-w-sm"
          >
            The average AE engineer loses 30-40% of the week to formatting, code lookups, and writing reports. Reportly hands that time back.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <PrimaryBtn href="/contact">Book a call <ArrowRight className="w-3.5 h-3.5" /></PrimaryBtn>
            <SecondaryBtn href="/services">See what we build</SecondaryBtn>
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
            title="VibeOps - the reporting layer for AE firms"
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}
