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
  FileText, MapPin, Wrench, BarChart3, Check, ArrowRight,
  ArrowUpRight, Download, Camera, ClipboardList, Star,
} from 'lucide-react';
import { useRef, useEffect, useLayoutEffect, useState, useCallback, ReactNode } from 'react';
import { SEO } from '@/components/SEO';
import SpaceField from '@/components/SpaceField';
import { HomepageDeviceStage } from '@/components/homepage/DeviceScene';
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
    <p className="bp-label text-[10px] uppercase tracking-[0.35em] text-emerald-500/70 font-black mb-3">
      {children}
    </p>
  );
}

function Rule({ className }: { className?: string }) {
  return (
    <motion.div
      className={`h-px bg-white/8 origin-left ${className ?? ''}`}
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
      // glow-pulse: the CTA breathes with a slow box-shadow in/out at 3.5s.
      // WHY: Creates subliminal urgency - users report the button "wanting to
      // be clicked" without knowing why. This is the highest-ROI single-class
      // change for conversion rate on dark-theme landing pages.
      className="glow-pulse inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400 text-black text-[14px] font-bold whitespace-nowrap"
      style={{ boxShadow: '0 16px 40px rgba(52,211,153,0.24)' }}
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
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/14 bg-white/[0.03] text-white/78 text-[13.5px] font-semibold hover:border-white/28 hover:text-white transition-colors duration-200 whitespace-nowrap"
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

const TICKER_ITEMS = [
  { type: 'logo' as const, src: '/clients/SenseEngineering.png', alt: 'Sense Engineering', url: 'https://senseengineering.com/' },
  { type: 'logo' as const, src: '/clients/ubc-eng.jpg', alt: 'UBC Engineering', url: 'https://engineering.ubc.ca/' },
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
            <img src={t.src} alt={t.alt} className="h-8 w-auto max-w-[110px] object-contain opacity-55 hover:opacity-85 transition-opacity duration-300 grayscale brightness-150" loading="eager" decoding="sync" />
          </a>
        : <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase tracking-[0.22em] text-white/45 hover:text-white/75 transition-colors duration-200 font-semibold whitespace-nowrap">{t.label}</a>
      }
      <span className="w-1.5 h-1.5 rounded-full bg-white/15 flex-shrink-0" aria-hidden="true" />
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
    description: 'Code-aware engineering report drafts from templates, notes, and field data.',
    accent: '#34d399',
    icon: FileText,
    href: '/reportly',
    badge: null,
  },
  {
    id: 'codes',
    name: 'Code Intelligence',
    tag: 'Building Code Intelligence',
    description: 'Canadian building code context for any project address, instantly.',
    accent: '#00ffcc',
    icon: MapPin,
    href: '/reportly',
    badge: null,
  },
  {
    id: 'custom',
    name: 'Custom Rollouts',
    tag: 'Firm-Specific Software',
    description: 'Tools, dashboards, automations, and workflows built around how your firm works.',
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

  // Mouse-tracking spotlight state.
  // WHY: A radial gradient that follows the cursor inside the card mimics a
  // light source moving across a physical surface. This is the "card glow"
  // effect used by Linear.app, Vercel dashboard, and Stripe Elements.
  // The effect makes the card feel like an illuminated panel rather than a
  // flat rectangle - triggering the brain's "depth perception" circuits.
  // HOW: onMouseMove maps clientX/Y to % coords relative to the card bounds,
  // then sets them as the center of a radial-gradient overlay.
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, show: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    setSpot({
      x: ((e.clientX - r.left) / r.width)  * 100,
      y: ((e.clientY - r.top)  / r.height) * 100,
      show: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpot(s => ({ ...s, show: false }));
  }, []);

  return (
    <motion.a
      ref={cardRef}
      href={product.href}
      // shimmer-card: adds a ::after pseudo-element that sweeps a thin highlight
      // across the card surface on a staggered timer (via :nth-child delays).
      className="shimmer-card group relative rounded-2xl border p-5 flex flex-col gap-3 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${product.accent}09 0%, rgba(6,11,20,0.96) 100%)`,
        borderColor: `${product.accent}22`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.35)`,
      }}
      initial={skipReveal ? false : { opacity: 0 }}
      whileInView={skipReveal ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay, ease: E }}
      whileHover={{ y: -3, borderColor: `${product.accent}40`, transition: { duration: 0.2 } }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mouse-tracking spotlight overlay - follows cursor within the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: spot.show ? 1 : 0,
          background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, ${product.accent}16 0%, transparent 58%)`,
          zIndex: 0,
        }}
      />

      <div className="relative z-[1] flex items-start justify-between gap-2">
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
      <div className="relative z-[1]">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: `${product.accent}80` }}>
          {product.tag}
        </p>
        <h3 className="text-[16px] font-bold text-white leading-tight mb-1.5">{product.name}</h3>
        <p className="text-[12.5px] text-white/45 leading-[1.65]">{product.description}</p>
      </div>
      <div className="relative z-[1] flex items-center gap-1 mt-auto" style={{ color: product.accent }}>
        <span className="text-[11px] font-semibold">Explore</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
      </div>
    </motion.a>
  );
}

// Central workspace card in hero
function HeroPlatformVisual() {
  const rm = useReducedMotion();
  return (
    <div className="relative w-full max-w-[520px] mx-auto lg:mx-0">
      {/* Ambient glow behind workspace */}
      <div
        aria-hidden="true"
        className="absolute -inset-12 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(52,211,153,0.08) 0%, transparent 70%)' }}
      />

      {/* Central platform workspace */}
      <motion.div
        className="relative rounded-2xl overflow-hidden border"
        style={{
          background: '#0a1422',
          borderColor: 'rgba(255,255,255,0.12)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
        initial={rm ? false : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, delay: 0.35, ease: E }}
      >
        {/* Workspace chrome bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8" style={{ background: '#080e1c' }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 mx-2">
            <div className="bg-white/[0.05] rounded-md px-3 py-1 text-center text-[9px] text-white/25 tracking-wide border border-white/6">
              vibeops.ca - AE Workflow Platform
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Workspace content */}
        <div className="p-5 space-y-3">
          {/* Header row */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[8px] uppercase tracking-[0.25em] text-emerald-500/60 font-bold mb-0.5">VibeOps Platform</p>
              <p className="text-[14px] font-bold text-white">Engineering Workflow Suite</p>
            </div>
            <div className="flex gap-1.5">
              {PRODUCTS.map((p) => (
                <div
                  key={p.id}
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: `${p.accent}14`, border: `1px solid ${p.accent}28` }}
                  title={p.name}
                >
                  <p.icon className="w-3 h-3" style={{ color: p.accent }} />
                </div>
              ))}
            </div>
          </div>

          {/* Three module rows */}
          {[
            { label: 'Report Generated', detail: 'Bridge Inspection 2024 · NBCC 2020', accent: '#34d399', icon: FileText, status: 'Complete', pct: 100 },
            { label: 'Code Context', detail: '800 Robson St · BC · 5 codes matched', accent: '#34d399', icon: MapPin, status: 'Grounded', pct: 100 },
            { label: 'Custom Dashboard', detail: 'AE Firm Workflow · Q3 Rollout', accent: '#60a5fa', icon: Wrench, status: 'Deploying', pct: 72 },
          ].map((row) => (
            <div
              key={row.label}
              className="rounded-xl border px-3.5 py-2.5 flex items-center gap-3"
              style={{ background: `${row.accent}06`, borderColor: `${row.accent}18` }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${row.accent}14` }}>
                <row.icon className="w-3.5 h-3.5" style={{ color: row.accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-white truncate">{row.label}</p>
                <p className="text-[9px] text-white/35 truncate mt-0.5">{row.detail}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[8px] font-bold uppercase tracking-wide" style={{ color: row.accent }}>{row.status}</span>
                <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: `${row.accent}18` }}>
                  <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.accent }} />
                </div>
              </div>
            </div>
          ))}

          {/* Bottom stat row */}
          <div className="flex items-center gap-3 pt-1">
            {[
              { val: '70%', label: 'Reporting reduction' },
              { val: '3 min', label: 'First draft time' },
              { val: '85+', label: 'Codes indexed' },
            ].map((s) => (
              <div key={s.label} className="flex-1 text-center rounded-lg border border-white/6 py-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-[13px] font-black text-white leading-none">{s.val}</p>
                <p className="text-[7.5px] text-white/30 mt-0.5 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Index() {
  return (
    <>
      <SEO
        title="Engineering Report Automation & Building Code Intelligence for AE Firms"
        description="VibeOps builds reporting automation, building code intelligence, and custom workflow software for architecture and engineering firms. Automate construction administration, field reports, and code compliance workflows."
        canonical="https://www.vibeops.ca/"
      />
      <HeroSection />
      <ProblemSection />
      <ProductPillarsSection />
      <ReportlyRevealSection />
      <CodeIntelligenceSection />
      <TestimonialsSection />
      <ProofSection />
      <TeamSection />
      <FinalCTASection />
    </>
  );
}

// ─── 1. Hero ─────────────────────────────────────────────────────────────────

// Scroll-driven phase for the hero device reveal.
// 0=none, 1=laptop, 2=iPad, 3=phone (holds until scroll exits)
type DevicePhase = 0 | 1 | 2 | 3;

function HeroSection() {
  const rm = useReducedMotion();
  const spacerRef = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number | null>(null);

  const [isInView, setIsInView] = useState(true); // start true so fixed overlay shows immediately
  const [scrollProgress, setScrollProgress] = useState(0);
  const [overlayBottom, setOverlayBottom] = useState(0);
  const [phase, setPhase] = useState<DevicePhase>(0);

  // Lid opens as user scrolls through the laptop zone (0.04 → 0.42). Reverses on scroll-up.
  const lidProgress = Math.max(0, Math.min(1, (scrollProgress - 0.04) / 0.38));

  const updateScroll = useCallback(() => {
    const el = spacerRef.current;
    if (!el) return;
    const rect   = el.getBoundingClientRect();
    const elH    = el.offsetHeight;
    const vpH    = window.innerHeight;

    const inView = rect.top < vpH && rect.bottom > 0;
    setIsInView(inView);

    // Seamless exit: shrink overlay from the bottom as spacer exits the viewport.
    // When rect.bottom drops below vpH, ProblemSection slides up into view beneath.
    setOverlayBottom(Math.max(0, vpH - Math.max(0, rect.bottom)));

    if (!inView) { rafRef.current = null; return; }

    const maxScroll = elH - vpH;
    if (maxScroll <= 0) { rafRef.current = null; return; }

    const scrolled = Math.max(0, Math.min(1, -rect.top / maxScroll));
    setScrollProgress(scrolled);

    // Phase is purely position-based - scroll up reverses, scroll down advances.
    // Thresholds spread across full scroll range so each device gets ~30% of scroll time.
    let next: DevicePhase = 0;
    if      (scrolled > 0.72) next = 3; // phone - holds until overlay exits
    else if (scrolled > 0.42) next = 2; // iPad
    else if (scrolled > 0.04) next = 1; // laptop (lid opens 0.04→0.42)
    setPhase(next);

    rafRef.current = null;
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(updateScroll);
    }
  }, [updateScroll]);

  useEffect(() => {
    if (rm) { setPhase(3); return; }

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

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(t0);
      clearTimeout(t);
      ro?.disconnect();
    };
  }, [rm, handleScroll]);

  return (
    <>
      {/* Scroll spacer - 500vh creates the scroll distance for the device reveal.
          The fixed overlay below paints on top while this spacer is in the viewport. */}
      <div ref={spacerRef} style={{ height: '500vh' }} aria-hidden="true" />

      {/* Reportly - laptop + text, fixed at z-2, vertically centered.
          Reportly section (z-10) is transparent so this shows through.
          Covered by Three Ways z-20 above and MapleCodes z-30 below. */}
      <div className="pointer-events-none fixed inset-0 flex items-center" style={{ zIndex: 2 }}>
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-14">
          {/* Desktop: laptop left, text right */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-center">
            <HomepageDeviceStage videoSrc="/vids/demo-vid.mp4" lockedDevice="laptop" hideDots />
            <div style={{ pointerEvents: 'auto' }} className="flex flex-col">
              <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-500/70 font-black mb-3">Reportly</p>
              <h2 className="font-bold text-white tracking-[-0.03em] leading-[1.1] mb-4"
                style={{ fontSize: 'clamp(1.6rem, 2.2vw, 2.4rem)' }}>
                Turn scattered inputs into{' '}
                <span className="text-emerald-400">QA-ready drafts.</span>
              </h2>
              <p className="text-white/50 leading-[1.75] mb-6 text-[15px]">
                Templates, field notes, photos, tables, and code context. First draft in minutes, not days.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/reportly" className="glow-pulse inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400 text-black text-[14px] font-bold whitespace-nowrap">
                  Explore Reportly <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/14 bg-white/[0.03] text-white/78 text-[13.5px] font-semibold whitespace-nowrap">
                  Book a Demo
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
              <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-500/70 font-black mb-3">Reportly</p>
              <h2 className="font-bold text-white tracking-[-0.03em] leading-[1.1] mb-4"
                style={{ fontSize: 'clamp(1.5rem, 5.5vw, 2.1rem)' }}>
                Turn scattered inputs into{' '}
                <span className="text-emerald-400">QA-ready drafts.</span>
              </h2>
              <div className="flex flex-wrap gap-2 justify-center">
                <a href="/reportly" className="glow-pulse inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400 text-black text-[13px] font-bold whitespace-nowrap">
                  Explore Reportly <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a href="/contact" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/14 bg-white/[0.03] text-white/78 text-[13px] font-semibold whitespace-nowrap">
                  Book a Demo
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
          className="fixed z-30 w-full bg-[#050912] overflow-hidden flex flex-col"
          style={{ top: 0, left: 0, right: 0, bottom: `${overlayBottom}px` }}
        >

          {/* Ambient glows - drift-1/2 classes apply slow sinusoidal paths
              so these feel like atmosphere rather than static decoration */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <div
              className="ambient-drift-1"
              style={{ position: 'absolute', top: '-10%', left: '-5%', width: '55%', height: '70%', background: 'radial-gradient(ellipse, rgba(52,211,153,0.07) 0%, transparent 65%)', filter: 'blur(60px)' }}
            />
            <div
              className="ambient-drift-2"
              style={{ position: 'absolute', bottom: '-5%', right: '0%', width: '45%', height: '55%', background: 'radial-gradient(ellipse, rgba(96,165,250,0.05) 0%, transparent 65%)', filter: 'blur(50px)' }}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 flex items-start lg:items-center min-h-0 overflow-hidden">
            <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-14 lg:py-20 pt-10 pb-4">
              <div className="grid lg:grid-cols-[1fr_1.1fr] gap-[100px] lg:gap-10 items-center">

                {/* LEFT - text + CTAs */}
                <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-4 lg:gap-6">
                  <motion.h1 variants={fadeUp} className="font-black text-white leading-[1.03] tracking-[-0.04em]"
                    style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}>
                    Building-code intelligence and reporting software{' '}
                    {/* text-gradient-animate: slowly pans the gradient left→right→left at 7s.
                        WHY: Like holographic foil shifting as you tilt it - gives the key
                        phrase dimensional depth without animation that competes with reading. */}
                    <span
                      className="text-gradient-animate text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300"
                    >for AE firms.</span>
                  </motion.h1>

                  <motion.p variants={fadeUp} className="text-white/55 leading-[1.75]"
                    style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', maxWidth: '36rem' }}>
                    VibeOps helps AE teams automate reporting, code compliance, and field workflows - with tools built around how your firm already works.
                  </motion.p>

                  <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-1">
                    <PrimaryBtn href="/services">See Our Products <ArrowRight className="w-4 h-4" /></PrimaryBtn>
                    <SecondaryBtn href="/contact">Book a Demo</SecondaryBtn>
                  </motion.div>

                  <motion.p variants={fadeUp} className="text-[11px] text-white/22 tracking-wide">
                    <a href="/reportly" className="hover:text-emerald-400/60 transition-colors">Reportly</a>
                    {' · '}
                    <a href="/services" className="hover:text-blue-400/60 transition-colors">Custom Rollouts</a>
                  </motion.p>

                </motion.div>

                {/* Devices - full width, phone scaled down on mobile only via inner wrapper */}
                <div className="relative w-full" style={{ aspectRatio: '16/9.5' }}>
                  <AnimatePresence>
                    {phase === 0 && (
                      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2, delay: 0 } }}
                        transition={{ duration: 0.7, delay: 1.6 }}>
                        <motion.svg width="52" height="72" viewBox="0 0 20 28" fill="none" className="text-white/10"
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
                    <div className="w-[52%] lg:contents">
                      <HomepageDeviceStage screenContent={<VibeOpsShowcaseScreen />} lockedDevice="phone" hideDots />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticker bar */}
          <div className="relative z-10 bg-[#050912]/80 backdrop-blur-md flex-shrink-0 py-4 overflow-hidden">
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
    <div className="relative w-full font-mono">
      {/* Folder header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <p className="text-[11px] text-white/30 ml-2">Projects / Bridge_Inspections / Queensborough_2024</p>
      </div>

      {/* File list */}
      <div className="space-y-0.5">
        {FILES.map((f, i) => {
          const isLast = i === FILES.length - 1;
          const isSent = f.note === 'sent to client';
          const isRevised = f.note === 'client comments';
          return (
            <motion.div
              key={f.name}
              className="flex items-center gap-3 px-3 py-2 rounded-lg group"
              style={{
                background: isLast ? 'rgba(239,68,68,0.06)' : i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
                border: isLast ? '1px solid rgba(239,68,68,0.18)' : '1px solid transparent',
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
                className="text-[11.5px] flex-1 truncate"
                style={{ color: isLast ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.45)', fontWeight: isLast ? 600 : 400 }}
              >
                {f.name}
              </p>

              {/* Date + note */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-white/22">{f.date}</span>
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
      <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between">
        <p className="text-[11px] text-white/28">8 versions. 1 report. 7 weeks.</p>
        <p className="text-[11px] font-semibold" style={{ color: 'rgba(239,68,68,0.55)' }}>
          Every. Single. Project.
        </p>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="relative z-20 border-t border-white/6 bg-[#060b14] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-center">
          <div className="order-last lg:order-first max-h-[72vh] lg:max-h-none overflow-hidden"><ProblemLegacyVisual /></div>
          <div className="order-first lg:order-last">
            <Label>The Problem</Label>
            <h2
              className="font-bold text-white tracking-[-0.03em] leading-[1.08] mb-5 mt-3"
              style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.5rem)' }}
            >
              AE teams lose months to fragmented reporting workflows.
            </h2>
            <p className="text-white/52 leading-[1.78] mb-4" style={{ fontSize: 'clamp(0.92rem, 1.3vw, 1rem)' }}>
              Templates, field photos, code references, and spreadsheets live in separate places. Every report means manual assembly. Every project means re-doing the same code lookups.
            </p>
            <p className="text-white/52 leading-[1.78]" style={{ fontSize: 'clamp(0.92rem, 1.3vw, 1rem)' }}>
              VibeOps brings those workflows into structured software - so your engineers spend time on engineering, not formatting.
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
    <section className="relative z-20 border-t border-b border-white/8 bg-[#060b14] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="mb-10 md:mb-14">
          <Label>The Platform</Label>
          <div className="flex items-end justify-between gap-8 flex-wrap mt-3">
            <h2
              className="font-bold text-white tracking-[-0.025em] leading-[1.06]"
              style={{ fontSize: 'clamp(1.9rem, 3vw, 2.8rem)' }}
            >
              Three ways VibeOps helps<br />
              <span className="text-emerald-400">AE firms move faster.</span>
            </h2>
            <p className="text-[14px] text-white/40 max-w-xs leading-[1.7]">
              Purpose-built software and firm-specific implementations, built around how AE firms work.
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
    <section className="relative z-[10] border-t border-white/6"
      style={{ minHeight: '85vh', background: 'transparent' }} />
  );
}

function ReportlyScreenContent() {
  const rm = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('ingest');

  useEffect(() => {
    if (rm) { setPhase('ready'); return; }
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % PHASES.length;
      setPhase(PHASES[idx]);
    }, PHASE_DURATION);
    return () => clearInterval(id);
  }, [rm]);

  const statusMap: Record<Phase, { label: string; color: string }> = {
    ingest:     { label: 'Loading template…',     color: '#fbbf24' },
    sources:    { label: 'Inputs detected',        color: '#34d399' },
    generating: { label: 'Generating draft…',      color: '#34d399' },
    ready:      { label: 'Export ready',           color: '#34d399' },
  };
  const s = statusMap[phase];

  const rows = [
    { num: '01', title: 'Executive Summary',  code: 'NBCC 2020' },
    { num: '02', title: 'Inspection Findings', code: 'CSA S6-19' },
    { num: '03', title: 'Code References',     code: 'BCBC 2024' },
    { num: '04', title: 'Recommendations',     code: null },
  ];

  const showRows    = phase === 'generating' || phase === 'ready';
  const showExport  = phase === 'ready';
  const showSources = phase === 'sources';

  return (
    <div className="w-full h-full bg-[#070d1a] flex flex-col text-white overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-white/8 flex-shrink-0" style={{ background: '#050a14' }}>
        <div className="flex-1 min-w-0">
          <div className="bg-white/[0.05] rounded px-1.5 py-0.5 text-center text-[7px] text-white/22 border border-white/6 truncate">
            Reportly - Structural Assessment 2024
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={phase}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            className="text-[6.5px] font-bold uppercase tracking-wider flex-shrink-0"
            style={{ color: s.color }}
          >
            {s.label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex-1 p-2.5 overflow-hidden flex flex-col gap-1.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-1 flex-shrink-0">
          <div>
            <p className="text-[6px] uppercase tracking-[0.2em] text-emerald-500/55 font-bold">Reportly</p>
            <p className="text-[10px] font-bold text-white leading-tight">Structural Assessment Report</p>
            <p className="text-[7px] text-white/30">Bridge Inspection 2024 · Vancouver, BC</p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`progress-${phase}`}
              className="flex-shrink-0 text-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[6px] text-white/25 uppercase tracking-wider mb-0.5">Progress</p>
              <div className="w-14 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: s.color }}
                  initial={{ width: '0%' }}
                  animate={{ width: phase === 'ingest' ? '20%' : phase === 'sources' ? '48%' : phase === 'generating' ? '76%' : '100%' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Phase: sources */}
        <AnimatePresence>
          {showSources && (
            <motion.div
              className="grid grid-cols-2 gap-1"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {[
                { label: 'Report Template', sub: 'Word · .docx', color: '#2b5ce6', Icon: FileText },
                { label: 'Field Photos', sub: '24 images', color: '#7c3aed', Icon: Camera },
                { label: 'Inspection Data', sub: 'Excel · 847 rows', color: '#16a34a', Icon: BarChart3 },
                { label: 'Site Notes', sub: '3 pages', color: '#d97706', Icon: ClipboardList },
              ].map((src) => (
                <div
                  key={src.label}
                  className="rounded-md px-1.5 py-1 flex items-center gap-1"
                  style={{ background: `${src.color}10`, border: `1px solid ${src.color}20` }}
                >
                  <src.Icon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: src.color }} />
                  <div className="min-w-0">
                    <p className="text-[7px] font-semibold text-white/75 truncate">{src.label}</p>
                    <p className="text-[6px] text-white/30 truncate">{src.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase: generating / ready - report rows */}
        <AnimatePresence>
          {showRows && (
            <motion.div
              className="flex flex-col gap-0.5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {rows.map((r, i) => {
                const isDone = phase === 'ready' || i < 3;
                return (
                  <motion.div
                    key={r.num}
                    className="flex items-center justify-between px-1.5 py-1 rounded border border-white/5"
                    style={{ background: 'rgba(255,255,255,0.025)' }}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[5.5px] text-white/20 font-black flex-shrink-0">{r.num}</span>
                      <p className="text-[8px] font-semibold text-white/65 truncate">{r.title}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {r.code && (
                        <span className="text-[5.5px] font-bold px-1 py-0.5 rounded-full" style={{ color: '#f08080', border: '1px solid rgba(217,47,55,0.2)', background: 'rgba(217,47,55,0.08)' }}>
                          {r.code}
                        </span>
                      )}
                      {isDone ? (
                        <div className="w-3 h-3 rounded-full border border-emerald-500/40 bg-emerald-950/70 flex items-center justify-center flex-shrink-0">
                          <Check className="w-1.5 h-1.5 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="flex gap-0.5">
                          {[0, 1, 2].map((k) => (
                            <motion.div
                              key={k}
                              className="w-0.5 h-0.5 rounded-full bg-emerald-400"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: k * 0.25 }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase: ingest - template loading */}
        <AnimatePresence>
          {phase === 'ingest' && (
            <motion.div
              className="flex-1 flex flex-col items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <FileText className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-[8px] font-semibold text-white/70">Loading template…</p>
                <p className="text-[6.5px] text-white/30 mt-0.5">Structural_Template_v4.docx</p>
              </div>
              <div className="w-24 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  className="h-full rounded-full bg-amber-400"
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: PHASE_DURATION / 1000, ease: 'linear', repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase: ready - export row */}
        <AnimatePresence>
          {showExport && (
            <motion.div
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg flex-shrink-0"
              style={{ border: '1px solid rgba(52,211,153,0.22)', background: 'rgba(52,211,153,0.06)' }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Download className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[8px] font-bold text-white truncate">Structural_Bridge_Report.docx</p>
                <p className="text-[6.5px] text-white/35">NBCC 2020 · BCBC 2024 · CSA S6-19 - Ready</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
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
      className="rounded-2xl overflow-hidden border w-full max-w-[460px]"
      style={{ background: '#08091a', borderColor: 'rgba(52,211,153,0.22)', boxShadow: '0 32px 72px rgba(0,0,0,0.55)', minHeight: '560px' }}
    >
      {/* App chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8" style={{ background: '#06070f' }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 mx-2">
          <div className="bg-white/[0.05] rounded-md px-2 py-1 text-center text-[8px] text-white/22 border border-white/6 truncate">
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
            <p className="text-[7.5px] uppercase tracking-[0.18em] text-white/30 font-bold">Project Address</p>
          </div>
          <div className="flex gap-2">
            <div
              className="flex-1 min-w-0 rounded-xl border px-3 py-2.5 flex items-center gap-2 min-h-[40px]"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.10)' }}
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#34d399' }} />
              <span className="text-[11px] text-white/70 font-mono truncate flex-1">
                {typed}
                {phase === 'input' && <span className="inline-block w-0.5 h-3 bg-white/60 ml-0.5 animate-pulse" />}
              </span>
            </div>
            <motion.div
              className="px-4 py-2 rounded-xl text-[10px] font-bold text-white flex items-center flex-shrink-0"
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
              <p className="text-[7.5px] uppercase tracking-[0.15em] text-white/25 font-bold mb-1">Jurisdiction layers</p>
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
              className="rounded-xl border border-white/8 overflow-hidden"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <div className="px-3 py-2 border-b border-white/6 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.025)' }}>
                <p className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Applicable Codes</p>
                <span className="text-[7.5px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.22)' }}>
                  {visibleCodes} matched
                </span>
              </div>
              {scenario.codes.slice(0, visibleCodes).map((c, i) => (
                <motion.div
                  key={c.name}
                  className="flex items-center justify-between px-3 py-2 border-b border-white/5 last:border-0"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-white/80 truncate">{c.name}</p>
                    <p className="text-[7px] text-white/30 font-mono">{c.short}</p>
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
              <p className="text-[7.5px] uppercase tracking-[0.15em] text-white/25 font-bold mb-1.5">CSA Referenced Standards</p>
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
                    <p className="text-[7px] text-white/30 mt-0.5">{s.desc}</p>
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
    <section className="relative z-[30] border-t-2 border-white/20 bg-[#060b14] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left: copy */}
          <Reveal>
            <Label>Code Intelligence</Label>
            <h2
              className="font-black text-white tracking-[-0.035em] leading-[1.06] mb-5 mt-2"
              style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)' }}
            >
              Every applicable Canadian code,{' '}
              <span style={{ color: '#34d399' }}>grounded to the address.</span>
            </h2>
            <p className="text-white/52 leading-[1.75] mb-7" style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)', maxWidth: '36rem' }}>
              Canadian construction projects sit under overlapping federal, provincial, and municipal codes. Enter a project address and Reportly identifies every applicable code, across all 10 provinces and 3 territories, and includes the right CSA standards in every draft.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'National Building Code, National Fire Code, and federal standards',
                'Provincial codes - BC, ON, AB, QC, and all others - resolved per address',
                'Municipal bylaws and site-specific overlays surfaced automatically',
                'CSA, ASTM, and ISO referenced standards included in context',
                'Code references grounded and cited directly in your report draft',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.28)' }}>
                    <Check className="w-2.5 h-2.5" style={{ color: '#34d399' }} />
                  </div>
                  <p className="text-[13.5px] text-white/58 leading-[1.65]">{item}</p>
                </div>
              ))}
            </div>
            <motion.a
              href="/reportly"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white text-[14px]"
              style={{ background: '#34d399', boxShadow: '0 16px 40px rgba(52,211,153,0.25)' }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              transition={HOMEPAGE_MOTION.hoverSpring}
            >
              Explore Reportly <ArrowRight className="w-4 h-4" />
            </motion.a>
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
  { name: 'Ryan Snair',      title: 'Owner, Pro Painting LLC',  image: '/clients/ryan.png'     },
];

function TestimonialsSection() {
  return (
    <section className="relative z-20 bg-[#060b14] py-10 overflow-hidden border-t border-white/6">
      <p className="text-center text-[10px] uppercase tracking-[0.3em] text-white/25 font-semibold mb-6">
        Trusted by founders and engineers.
      </p>
      <div className="relative">
        <Marquee pxPerSec={34}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-3 px-5 py-4 rounded-2xl border border-white/8 bg-white/[0.03] flex items-center gap-4"
              style={{ backdropFilter: 'blur(12px)' }}
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/12 flex-shrink-0"
                loading="eager"
                decoding="sync"
              />
              <div>
                <div className="flex gap-0.5 mb-1.5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                <p className="text-[14px] font-semibold text-white leading-tight">{t.name}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{t.title}</p>
              </div>
            </div>
          ))}
        </Marquee>
        <div className="absolute inset-y-0 left-0 w-24 pointer-events-none z-[1]" style={{ background: 'linear-gradient(to right, #060b14, transparent)' }} />
        <div className="absolute inset-y-0 right-0 w-24 pointer-events-none z-[1]" style={{ background: 'linear-gradient(to left, #060b14, transparent)' }} />
      </div>
    </section>
  );
}

// ─── 6. Proof / credibility ───────────────────────────────────────────────────

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, val } = useCountUp(value, 1.8);
  return (
    <div className="flex flex-col items-center text-center">
      <span ref={ref} className="text-4xl sm:text-5xl font-black text-white tabular-nums tracking-tight">
        {val}{suffix}
      </span>
      <span className="text-[12px] text-white/40 mt-2 leading-tight max-w-[130px]">{label}</span>
    </div>
  );
}

function ProofSection() {
  return (
    <section className="relative z-20 border-t border-white/6 bg-[#060b14] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Stats row */}
        <Reveal className="mb-16">
          <div className="flex flex-wrap justify-center gap-10 sm:gap-16 lg:gap-20">
            <StatItem value={175} suffix="+" label="AE firms surveyed before building" />
            <StatItem value={70} suffix="%" label="Target reporting time reduction per firm" />
            <StatItem value={85} suffix="+" label="Canadian building codes indexed" />
            <StatItem value={3} suffix=" min" label="Time to first report draft" />
          </div>
        </Reveal>

        <Rule className="mb-16" />

        {/* Custom Rollouts section */}
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <Label>Custom Rollouts</Label>
            <h2
              className="font-bold text-white tracking-[-0.025em] leading-[1.08] mb-5"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
            >
              We build tools around{' '}
              <span className="text-blue-400">how your firm actually works.</span>
            </h2>
            <p className="text-white/50 leading-[1.75] mb-6" style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1rem)' }}>
              Off-the-shelf software doesn't fit every firm's workflow. We configure Reportly around your templates and processes, build firm-specific dashboards, automate your document workflows, and connect the tools your team already uses.
            </p>
            <p className="text-white/40 leading-[1.75] text-[14px] mb-8">
              Bring us the workflow slowing your team down. We'll map it and show you what software built around it looks like.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.a
                href="/services"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white text-[14px]"
                style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', boxShadow: '0 16px 40px rgba(59,130,246,0.22)' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={HOMEPAGE_MOTION.hoverSpring}
              >
                See Our Services <ArrowRight className="w-4 h-4" />
              </motion.a>
              <SecondaryBtn href="/contact">Book a Workflow Audit</SecondaryBtn>
            </div>
          </Reveal>

          {/* Pillar checklist card */}
          <Reveal delay={0.1}>
            <div
              className="rounded-2xl border p-6"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, #060b14 100%)', borderColor: 'rgba(59,130,246,0.18)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400/70 mb-4">What We Deliver</p>
              {[
                { label: 'Private Reportly Deployments', detail: 'Custom firm templates, writing rules, QA workflows' },
                { label: 'Building Code AI Systems', detail: 'Jurisdiction-specific code search and project workflows' },
                { label: 'Dashboards & Internal Tools', detail: 'Project trackers, asset databases, compliance tools' },
                { label: 'Document Workflow Automation', detail: 'Automated generation, review, and delivery pipelines' },
                { label: 'Integration with Existing Systems', detail: 'SharePoint, Bluebeam, Procore, and custom APIs' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-white/6 last:border-0">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                    <Check className="w-2.5 h-2.5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-white/80">{item.label}</p>
                    <p className="text-[11px] text-white/35 mt-0.5">{item.detail}</p>
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
    <section className="relative z-20 border-t border-white/6 bg-[#060b14] py-20 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-6 md:mb-14">
            <div>
              <Label>Built by engineers, for engineers</Label>
              <h2 className="text-[2.1rem] sm:text-4xl font-bold tracking-[-0.025em] text-white mt-3">
                Civil engineers who can ship the fix.
              </h2>
            </div>
            <motion.a
              href="/team"
              className="flex items-center gap-1.5 text-[11px] text-white/30 uppercase tracking-[0.15em] hover:text-white/70 transition-colors duration-200"
              whileHover={{ x: 1 }}
            >
              Full team <ArrowUpRight className="w-3 h-3" />
            </motion.a>
          </div>
        </Reveal>

        <Rule className="mb-6 md:mb-14" />

        <Reveal className="mb-12">
          <motion.div
            className="relative rounded-2xl overflow-hidden border border-white/8"
            whileHover={{ borderColor: 'rgba(255,255,255,0.14)' }}
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
                <p className="text-[9px] uppercase tracking-[0.28em] text-white/40 mb-1">VibeOps Technologies Inc. - Vancouver, BC</p>
                <p className="text-base md:text-lg font-semibold text-white">Built from 175+ discovery calls with AE firms across Canada.</p>
              </div>
              <motion.a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400 text-black text-[13.5px] font-bold whitespace-nowrap"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={HOMEPAGE_MOTION.hoverSpring}
              >
                Talk to the Team
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
              <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden border border-white/12 group-hover:border-emerald-500/40 transition-colors duration-300">
                <img
                  src={m.image}
                  alt={`${m.name} - ${m.role}`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="text-center">
                <p className="text-[12px] font-medium text-white/75 leading-tight">{m.name.split(' ')[0]}</p>
                <p className="text-[10px] text-white/30 leading-tight mt-0.5">{m.role}</p>
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
    <section className="relative z-20 border-t border-white/6 bg-[#060b14] py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal className="text-center mb-14">
          <div className="space-y-2 mb-2">
            <p className="font-semibold text-white/35 tracking-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>Your engineers already have the field data.</p>
            <p className="font-semibold text-white/35 tracking-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>Your firm already has the templates.</p>
            <p className="font-bold text-white/80 tracking-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>Stop spending weeks in between on manual assembly.</p>
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
          <motion.div variants={fadeUp}><Label>Ready to move faster?</Label></motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-[2.4rem] sm:text-5xl md:text-[3.4rem] font-bold tracking-[-0.03em] text-white mb-6 mt-4 leading-[1.06]"
          >
            Get your engineering hours back.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-white/40 text-[0.95rem] leading-[1.8] mb-10 max-w-sm"
          >
            The average AE engineer loses 30-40% of their week to formatting, code lookups, and report writing. Reportly gives that time back.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <PrimaryBtn href="/contact">Book a Demo <ArrowRight className="w-3.5 h-3.5" /></PrimaryBtn>
            <SecondaryBtn href="/services">Explore Products</SecondaryBtn>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
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
