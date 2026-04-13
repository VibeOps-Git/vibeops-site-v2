// src/pages/Index.tsx

import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import { FileText, Wrench, BarChart3, Layers, Check, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useRef, useEffect, useState, useMemo, ReactNode, Suspense } from 'react';
import { SEO } from '@/components/SEO';
import { ScrambleText } from '@/components/ScrambleText';
import { GallerySection3D } from '../components/3d';
import { Canvas, useFrame } from '@react-three/fiber';
import { useVideoTexture, OrbitControls, Float, Environment, RoundedBox, ContactShadows } from '@react-three/drei';
import { MathUtils, CanvasTexture, Group, Texture, Mesh } from 'three';
import { DoubleSide, SRGBColorSpace } from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

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
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
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
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } },
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
        ease: [0.22, 1, 0.36, 1],
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
      transition={{ duration: 0.9, ease: EASE }}
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
      {/* Stats bar ends dark → dark ticker: seamless */}
      <TrustedByTicker />
      {/* dark ticker → white platform */}
      <SectionBridge from="#0c1220" to="#ffffff" height={80} />
      <PlatformSection />
      {/* white platform → dark features */}
      <SectionBridge from="#ffffff" to="#060b14" height={120} />
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

// ─── 3-D laptop mesh (must render inside a Canvas) ───────────────────────────
function LaptopMesh({
  videoTexture,
  opacity = 1,
}: {
  videoTexture: Texture;
  opacity?: number;
}) {
  const hingeRef = useRef<Group>(null);

  // Canvas texture that draws rows of key shapes - built once
  const keyboardTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 800; canvas.height = 300;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0b0b0d';
    ctx.fillRect(0, 0, 800, 300);
    // Key rows: [key-count, key-width, key-height, top-offset]
    const rows: [number, number, number, number][] = [
      [14, 50, 34, 10],
      [13, 54, 40, 53],
      [12, 58, 40, 102],
      [11, 62, 40, 151],
      [10, 68, 40, 200],
    ];
    rows.forEach(([n, kw, kh, y]) => {
      const gap = 4;
      const total = n * kw + (n - 1) * gap;
      const x0 = (800 - total) / 2;
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(x0 + i * (kw + gap), y, kw, kh);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x0 + i * (kw + gap) + 0.5, y + 0.5, kw - 1, kh - 1);
      }
    });
    // Spacebar
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(225, 250, 350, 42);
    const tex = new CanvasTexture(canvas);
    tex.anisotropy = 16; // Fixes blurriness at angles
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Lid opens: starts flat/closed (-Math.PI = over keyboard), lerps to ~110° open (-1.92)
  const TARGET = -5.0;
  useFrame((state) => {
    if (!hingeRef.current) return;
    // Stay closed for the first 2 s so the lid opens as the canvas fades in
    if (state.clock.elapsedTime < 2) return;

    hingeRef.current.rotation.x = MathUtils.lerp(
      hingeRef.current.rotation.x,
      TARGET,
      0.01,
    );
  });

  // Dimensions (world units)
  const W = 2.55, BH = 0.06, BD = 1.45, LH = 0.038, LD = 1.44;
  const bezelInsetX = 0.14; // smaller = screen closer to edges
  const bezelInsetY = 0.10;

  const screenW = W - bezelInsetX * 2;
  const screenH = LD - bezelInsetY * 2;

  return (
    <group>

      {/* ── Base ── */}
      <RoundedBox args={[W, BH, BD]} radius={0.032} smoothness={4} position={[0, BH / 2, 0]}>
        <meshStandardMaterial color="#1d1d21" metalness={0.78} roughness={0.22} transparent opacity={opacity} />
      </RoundedBox>

      {/* Keyboard (canvas texture with real key shapes) */}
      <mesh 
        position={[0, BH + 0.008, -BD * 0.04]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[W * 0.86, BD * 0.72]} />
        {/* Switch to StandardMaterial so it reacts to the city environment lights */}
        <meshStandardMaterial 
          map={keyboardTexture} 
          transparent
          opacity={opacity}
          metalness={0.4}
          roughness={0.1}
        />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, BH + 0.001, BD * 0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 0.27, BD * 0.17]} />
        <meshStandardMaterial color="#161619" roughness={0.45} metalness={0.4} transparent opacity={opacity} />
      </mesh>

      {/* ── Lid pivot - hinge at rear edge of base ── */}
      <group position={[0, BH, -(BD / 2) + 0.07]}>
        {/* -Math.PI = closed (lid lying over keyboard); lerps to -1.92 = ~110° open */}
        <group ref={hingeRef} rotation={[-Math.PI, 0, 0]}>

          {/* Lid body at -LD/2 so that at -π it sits over the keyboard */}
          <RoundedBox args={[W, LH, LD]} radius={0.024} smoothness={4} position={[0, 0, -LD / 2]}>
            <meshStandardMaterial color="#1b1b1f" metalness={0.82} roughness={0.16} transparent opacity={opacity} />
          </RoundedBox>

          {/* Black bezel - on the +Y (inner) face of the lid */}
          <mesh position={[0, LH / 2 + 0.001, -LD / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W * 0.88, LD * 0.9]} />
            <meshStandardMaterial color="#080808" roughness={0.9} transparent opacity={opacity} />
          </mesh>

          {/* Video screen - pinned to inner face, same centre as lid */}
          <mesh position={[0, 0.036, -LD / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[screenW, screenH]} />
            <meshBasicMaterial map={videoTexture} toneMapped={false} transparent opacity={opacity} />
          </mesh>

          {/* Screen glare */}
          <mesh position={[W * 0.18, 0.05, -LD / 2]} rotation={[-Math.PI / 2, 0.08, 0]}>
            <planeGeometry args={[W * 0.22, LD * 0.28]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.016 * opacity} depthWrite={false} />
          </mesh>

        </group>
      </group>
    </group>
  );
}


// ─── Phone mesh — landscape orientation ──────────────────────────────────────
function PhoneMesh({
  videoTexture,
  opacity = 1,
}: {
  videoTexture: Texture;
  opacity?: number;
}) {
  const W = 1.65, H = 0.82, D = 0.065;
  const bX = 0.05, bY = 0.05;
  return (
    <group>
      <RoundedBox args={[W, H, D]} radius={0.09} smoothness={4}>
        <meshStandardMaterial color="#111115" metalness={0.88} roughness={0.12} transparent opacity={opacity} />
      </RoundedBox>
      {/* Screen */}
      <mesh position={[0, 0, D / 2 + 0.002]}>
        <planeGeometry args={[W - bX * 2, H - bY * 2]} />
        <meshBasicMaterial map={videoTexture} toneMapped={false} transparent opacity={opacity} />
      </mesh>
      {/* Dynamic island */}
      <RoundedBox args={[0.12, 0.035, 0.01]} radius={0.015} smoothness={4}
        position={[0, H / 2 - bY * 0.65, D / 2 + 0.003]}>
        <meshBasicMaterial color="#000000" transparent opacity={opacity} />
      </RoundedBox>
      {/* Power button — right edge */}
      <mesh position={[W / 2 + 0.005, 0.12, 0]}>
        <boxGeometry args={[0.012, 0.14, D * 0.55]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.9} roughness={0.1} transparent opacity={opacity} />
      </mesh>
      {/* Volume up — left edge */}
      <mesh position={[-(W / 2 + 0.005), 0.16, 0]}>
        <boxGeometry args={[0.012, 0.09, D * 0.55]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.9} roughness={0.1} transparent opacity={opacity} />
      </mesh>
      {/* Volume down — left edge */}
      <mesh position={[-(W / 2 + 0.005), 0.02, 0]}>
        <boxGeometry args={[0.012, 0.09, D * 0.55]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.9} roughness={0.1} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// ─── Tablet mesh — landscape orientation ─────────────────────────────────────
function TabletMesh({
  videoTexture,
  opacity = 1,
}: {
  videoTexture: Texture;
  opacity?: number;
}) {
  const W = 2.45, H = 1.74, D = 0.042;
  const bX = 0.045, bY = 0.045;
  return (
    <group>
      <RoundedBox args={[W, H, D]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color="#1a1a1e" metalness={0.85} roughness={0.14} transparent opacity={opacity} />
      </RoundedBox>
      {/* Screen */}
      <mesh position={[0, 0, D / 2 + 0.002]}>
        <planeGeometry args={[W - bX * 2, H - bY * 2]} />
        <meshBasicMaterial map={videoTexture} toneMapped={false} transparent opacity={opacity} />
      </mesh>
      {/* Front camera dot — right bezel */}
      <mesh position={[W / 2 - bX * 0.75, 0, D / 2 + 0.003]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#0a0a0a" transparent opacity={opacity} />
      </mesh>
      {/* Power button — top edge */}
      <mesh position={[0.35, H / 2 + 0.004, 0]}>
        <boxGeometry args={[0.1, 0.01, D * 0.65]} />
        <meshStandardMaterial color="#222225" metalness={0.9} roughness={0.1} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// ─── Fluid device morph transition ───────────────────────────────────────────

// Each device in its "standing, screen-forward" orientation used during the morph
const MORPH_CFG = [
  { w: 2.55, h: 1.58, d: 0.09,  oy: -0.6, color: '#1b1b1f', insetX: 0.14, insetY: 0.10 }, // laptop
  { w: 2.45, h: 1.74, d: 0.042, oy: 0,   color: '#1a1a1e', insetX: 0.045, insetY: 0.045 }, // tablet
  { w: 1.65, h: 0.82, d: 0.065, oy: 0,   color: '#111115', insetX: 0.05, insetY: 0.05 }, // phone
] as const;

// Peak rotation at the midpoint of each transition (gives the "fold / tilt" feel)
const MORPH_ROT: Record<string, [rx: number, ry: number]> = {
  '0-1': [-0.45,  0.2 ],  // laptop -> tablet
  '1-2': [ 0.0,   0.35],  // tablet -> phone
  '2-0': [ 0.45,  0.2 ],  // phone -> laptop
  '1-0': [ 0.45, -0.2 ],
  '2-1': [ 0.0,  -0.35],
  '0-2': [-0.45, -0.2 ],
};

function MorphTransition({
  fromIdx,
  toIdx,
  progressRef,
  videoTexture,
  opacity = 1,
}: {
  fromIdx: number;
  toIdx: number;
  progressRef: { current: number };
  videoTexture: Texture;
  opacity?: number;
}) {
  const groupRef      = useRef<Group>(null);
  const matBody       = useRef<any>(null);
  const screenMeshRef = useRef<Mesh>(null);
  const matScreen     = useRef<any>(null);
  const from = MORPH_CFG[fromIdx];
  const to   = MORPH_CFG[toIdx];
  const [rx, ry] = MORPH_ROT[`${fromIdx}-${toIdx}`] ?? [0, 0.3];
  const maxD = Math.max(from.d, to.d, 0.05);

  useFrame(() => {
    if (!groupRef.current || !matBody.current || !matScreen.current) return;
    const p = progressRef.current;

    // Cubic ease-in-out — smooth dimension morph
    const e = p < 0.5 ? 4*p*p*p : 1 - (-2*p + 2)**3 / 2;
    // Sine arc — rotation peaks at midpoint, zero at both ends
    const s = Math.sin(p * Math.PI);

    const localFadeIn = p < 0.2 ? p / 0.2 : 1;
    const finalOpacity = localFadeIn * opacity;

    const w = from.w + (to.w - from.w) * e;
    const h = from.h + (to.h - from.h) * e;
    const d = from.d + (to.d - from.d) * e;
    const insetX = from.insetX + (to.insetX - from.insetX) * e;
    const insetY = from.insetY + (to.insetY - from.insetY) * e;
    const screenW = w - insetX * 2;
    const screenH = h - insetY * 2;
    const screenWUnit = screenW / w;
    const screenHUnit = screenH / h;

    // Scale all 3 axes so thickness morphs too (box is unit 1×1×maxD)
    groupRef.current.scale.set(w, h, d / maxD);
    groupRef.current.position.y = from.oy + (to.oy - from.oy) * e;
    groupRef.current.rotation.x = s * rx;
    groupRef.current.rotation.y = s * ry;

    matBody.current.opacity = finalOpacity;
    if (matScreen.current) matScreen.current.opacity = finalOpacity;
    if (screenMeshRef.current) screenMeshRef.current.scale.set(screenWUnit, screenHUnit, 1);
  });

  return (
    <group ref={groupRef}>
      <RoundedBox args={[1, 1, maxD]} radius={0.06} smoothness={4}>
        <meshStandardMaterial
          ref={matBody}
          color={from.color}
          metalness={0.88}
          roughness={0.12}
          transparent
        />
      </RoundedBox>
      {/* Screen — position in local space; Z-scale moves it to the correct face */}
      <mesh position={[0, 0, 0.2]} ref={screenMeshRef} renderOrder={1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={matScreen} map={videoTexture} toneMapped={false} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

// ─── Scene: video, smart variable-speed orbit, and per-rotation device switching
function RotatingDeviceScene() {
  const videoTexture = useVideoTexture(HERO_VIDEO_SRC, {
    muted: true,
    loop: true,
    playsInline: true,
    crossOrigin: 'Anonymous',
  });

  useEffect(() => {
    const video = videoTexture.image as HTMLVideoElement;
    if (!video) return;
    video.muted = true; video.loop = true; video.playsInline = true; video.crossOrigin = 'anonymous';
    videoTexture.colorSpace = SRGBColorSpace;
    videoTexture.needsUpdate = true;
    const play = async () => { try { await video.play(); } catch (e) { console.warn('Video autoplay failed:', e); } };
    if (video.readyState >= 2) { play(); } else { video.addEventListener('loadeddata', play); }
    return () => { video.removeEventListener('loadeddata', play); };
  }, [videoTexture]);

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  // Use refs for values read in useFrame to avoid stale closures
  const deviceIndexRef = useRef(0);
  const [renderDevice, setRenderDevice] = useState(0);
  const [showMorph, setShowMorph] = useState(false);
  const [morphDevices, setMorphDevices] = useState({ from: 0, to: 1 });
  const transActiveRef = useRef(false);
  const transProgressRef = useRef(0);
  const morphOpacityRef = useRef(0);
  const finalOpacityRef = useRef(0);
  const [finalFadeDevice, setFinalFadeDevice] = useState<number | null>(null);
  const lastAngle = useRef<number | null>(null);
  const cumAngle = useRef(0);
  const completedRotations = useRef(0);
  const nextDevice = useRef(0);

  useFrame((_, delta) => {
    if (videoTexture) videoTexture.needsUpdate = true;

    const controls = controlsRef.current;
    if (controls) {
      // ── Variable-speed orbit ──────────────────────────────────────────────
      const azimuth = controls.getAzimuthalAngle();
      const normalized = ((azimuth % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const fastCenter = Math.PI * 1.0;
      const fastWidth = Math.PI / 1.5;
      const halfWidth = fastWidth / 2;
      const feather = Math.PI / 7;
      const angleDelta = Math.atan2(Math.sin(normalized - fastCenter), Math.cos(normalized - fastCenter));
      const distance = Math.abs(angleDelta);
      const normalSpeed = 0.64;
      const fastSpeed = 6.0;
      let speedMultiplier = 1;
      if (distance <= halfWidth) {
        speedMultiplier = fastSpeed / normalSpeed;
      } else if (distance <= halfWidth + feather) {
        const t = 1 - (distance - halfWidth) / feather;
        speedMultiplier = MathUtils.lerp(1, fastSpeed / normalSpeed, t * t * (3 - 2 * t));
      }
      controls.autoRotateSpeed = normalSpeed * speedMultiplier * 60 * delta;
      controls.update();

      // ── Detect full rotation → kick off particle transition ───────────────
      if (lastAngle.current !== null) {
        let d = azimuth - lastAngle.current;
        if (d > Math.PI) d -= 2 * Math.PI;
        if (d < -Math.PI) d += 2 * Math.PI;
        cumAngle.current += d;
        const completed = Math.floor(Math.abs(cumAngle.current) / (2 * Math.PI));
        if (completed > completedRotations.current && !transActiveRef.current) {
          completedRotations.current = completed;
          const nextDev = (deviceIndexRef.current + 1) % 3;
          nextDevice.current = nextDev;
          transProgressRef.current = 0;
          transActiveRef.current = true;
          setMorphDevices({ from: deviceIndexRef.current, to: nextDev });
          setShowMorph(true);
        }
      }
      lastAngle.current = azimuth;
    }

    // ── Drive particle transition progress ────────────────────────────────
    if (transActiveRef.current) {
      transProgressRef.current = Math.min(1, transProgressRef.current + delta * 0.36);

      const p = transProgressRef.current;

      // crossfade over final 20%
      if (p < 0.8) {
        morphOpacityRef.current = 1;
        finalOpacityRef.current = 0;
        setFinalFadeDevice(null);
      } else {
        const t = (p - 0.8) / 0.2;
        const eased = t * t * (3 - 2 * t);
        morphOpacityRef.current = 1 - eased;
        finalOpacityRef.current = eased;
        setFinalFadeDevice(nextDevice.current);
      }

      if (transProgressRef.current >= 1) {
        const nextDev = nextDevice.current;
        deviceIndexRef.current = nextDev;
        transActiveRef.current = false;
        setRenderDevice(nextDev);
        setShowMorph(false);
        setFinalFadeDevice(null);
        morphOpacityRef.current = 0;
        finalOpacityRef.current = 0;
      }
    }
  });

  return (
    <>
      <Float speed={0.9} rotationIntensity={0.05} floatIntensity={0.1}>
        <group position={[-1.8, -2, 0]}>
          <group scale={1.9}>
            {!showMorph && renderDevice === 0 && <group position={[0, 1.6, 0]}><LaptopMesh videoTexture={videoTexture} /></group>}
            {!showMorph && renderDevice === 1 && <group position={[0, 1.6, 0]}><TabletMesh videoTexture={videoTexture} /></group>}
            {!showMorph && renderDevice === 2 && <group position={[0, 1.6, 0]}><PhoneMesh videoTexture={videoTexture} /></group>}
            {showMorph && (
              <group position={[0, 1.6, 0]}>
                <MorphTransition
                  fromIdx={morphDevices.from}
                  toIdx={morphDevices.to}
                  progressRef={transProgressRef}
                  videoTexture={videoTexture}
                  opacity={morphOpacityRef.current}
                />
              </group>
            )}
            {finalFadeDevice === 0 && (
              <group position={[0, 1.6, 0]}>
                <LaptopMesh videoTexture={videoTexture} opacity={finalOpacityRef.current} />
              </group>
            )}
            {finalFadeDevice === 1 && (
              <group position={[0, 1.6, 0]}>
                <TabletMesh videoTexture={videoTexture} opacity={finalOpacityRef.current} />
              </group>
            )}
            {finalFadeDevice === 2 && (
              <group position={[0, 1.6, 0]}>
                <PhoneMesh videoTexture={videoTexture} opacity={finalOpacityRef.current} />
              </group>
            )}
          </group>
        </group>
      </Float>
      <ContactShadows position={[-0.1, -0.15, 0]} opacity={0.3} scale={6} blur={2.5} far={3} />
      <OrbitControls
        ref={controlsRef}
        target={[-1.5, 1, 0]}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.46}
        autoRotate
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

/** Interactive device carousel — switches on each full orbit */
function LaptopMockup() {
  return (
    // Mobile: fixed height. Desktop: fills the full right column height.
    <div
      className="relative h-[340px] sm:h-[440px] md:h-full"
      style={{
        width: 'calc(100% + 18vw)',
        marginLeft: '-9vw',
        marginRight: '-9vw',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 65%, rgba(52,211,153,0.1) 0%, transparent 70%)',
        }}
      />

      <Canvas
        camera={{ position: [0, 0.8, 10], fov: 24 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 4]}   intensity={1.4} />
        <directionalLight position={[-3, 2, -1]} intensity={0.25} color="#6ee7b7" />
        <pointLight       position={[0, 3, 2]}   intensity={0.55} color="#34d399" />
        <Environment preset="city" />

        <Suspense fallback={null}>
          <RotatingDeviceScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const laptopY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const laptopOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col bg-[#060b14] overflow-hidden"
      aria-label="VibeOps - AI Engineering Report Automation for Civil & Construction"
    >
      {/* ── Background layers - overflow-hidden here so gradients don't escape section ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Emerald spotlight - desktop only (right half) */}
        <div className="absolute inset-0 hidden md:block"
          style={{ background: 'radial-gradient(ellipse 65% 55% at 83% 50%, rgba(16,185,129,0.055) 0%, transparent 70%)' }} />

        {/* DESKTOP: dark bleeds left→right + top/bottom vignette */}
        <div className="absolute inset-0 hidden md:block" style={{
          background: `
            linear-gradient(to right,  #060b14 0%, #060b14 26%, rgba(6,11,20,0.85) 38%, rgba(6,11,20,0.3) 50%, transparent 64%),
            linear-gradient(to bottom, rgba(6,11,20,0.65) 0%, transparent 25%),
            linear-gradient(to top,    rgba(6,11,20,0.65) 0%, transparent 25%)
          `,
        }} />

        {/* MOBILE: fully dark background with subtle lighter area around the 3D scene */}
        <div className="absolute inset-0 md:hidden" style={{
          background: 'linear-gradient(to bottom, #060b14 0%, #060b14 50%, rgba(6,11,20,0.92) 70%, #060b14 90%)',
        }} />
      </div>

      {/* ── Main split layout - full-height flex ── */}
      <div className="relative z-10 flex flex-col md:flex-row flex-1 w-full pt-24 md:pt-0">

        {/* Left: copy - 1/3 on desktop; text overflows into laptop area on lg */}
        <motion.div
          className="flex flex-col justify-center flex-1 md:flex-none md:w-[34%] md:overflow-visible px-6 sm:px-10 md:px-12 xl:px-16 pt-16 pb-8 md:py-28"
          style={{ y: contentY }}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Badge with live-dot */}
          <motion.a
            variants={item}
            href="https://reportly.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mb-8 w-fit px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/6 hover:border-emerald-500/45 hover:bg-emerald-500/10 transition-all duration-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Reportly</span>
            <span className="text-[10px] text-white/30">- Early Access</span>
          </motion.a>

          <motion.h1
            variants={item}
            className="font-bold leading-[0.97] tracking-[-0.035em] mb-7 md:whitespace-nowrap"
            style={{ fontSize: 'clamp(2.6rem, 4.5vw, 4.4rem)' }}
          >
            <span className="block text-white">Less formatting.</span>
            <span className="block text-emerald-400">More engineering.</span>
          </motion.h1>

          <motion.p variants={item} className="text-[0.92rem] text-white/40 leading-[1.8] mb-9 max-w-[20rem]">
            AI-powered report automation for civil and construction teams. Plug in your templates and project data, get polished output in minutes.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-3 mb-5">
            <motion.a
              href="https://reportly.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-400 text-black text-[13px] font-bold hover:bg-emerald-300 transition-colors duration-200"
              style={{ boxShadow: '0 0 20px rgba(52,211,153,0.25)' }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Get Started Free <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
            <Btn href="/services">See What We Build</Btn>
          </motion.div>

          <motion.p variants={item} className="text-[11px] text-white/22 tracking-wide tabular-nums">
            No credit card required · Free during early access
          </motion.p>
        </motion.div>

        {/* Right: laptop - full-height column on desktop, stacked below text on mobile */}
        {/* scroll-based y + opacity handled by MotionValues; intro handled by inner div */}
        <motion.div
          className="flex w-full md:w-[66%] flex-shrink-0 items-center justify-center md:items-stretch md:justify-stretch px-6 sm:px-12 md:px-0 pb-14 md:pb-0"
          style={{ y: laptopY, opacity: laptopOpacity, perspective: 1200 }}
        >
          {/* 2 s blank → 2 s fade-in (lid opens in sync via useFrame clock) */}
          <motion.div
            className="w-full max-w-[520px] md:max-w-none md:h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1, ease: 'easeIn' }}
          >
            <LaptopMockup />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade - mobile only: ensures seamless transition to stats bar */}
      <div
        aria-hidden="true"
        className="relative z-10 h-8 w-full pointer-events-none md:hidden"
        style={{ background: '#060b14', marginBottom: -1 }}
      />

      {/* Stats bar - no entrance animation; only numbers count up */}
      <div className="relative z-10 w-full bg-[#060b14]">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 py-6">
          <div className="grid grid-cols-3 gap-4 text-center sm:text-left sm:flex sm:justify-evenly sm:gap-0">
            {heroStats.map((s) => (
              <HeroStatItem key={s.label} {...s} />
            ))}
          </div>
        </div>
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
      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13.5px] font-semibold transition-none ${
        primary
          ? 'bg-emerald-400 text-black hover:bg-emerald-300'
          : 'border border-white/20 text-white/80 hover:border-white/40 hover:text-white'
      }`}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      {children}
    </motion.a>
  );
}

// =============================================================================
// Trusted By - infinite scrolling ticker
// =============================================================================

function TrustedByTicker() {
  return (
    <section className="bg-[#0c1220] border-t border-white/5 py-6 overflow-hidden">
      <p className="text-center text-[9px] uppercase tracking-[0.38em] text-white/25 mb-5 font-medium px-6">
        Trusted by Engineering Professionals &amp; Featured In
      </p>
      <InfiniteMarquee speed={35} />
    </section>
  );
}

// =============================================================================
// Platform Showcase
// =============================================================================

function PlatformSection() {
  return (
    <section className="bg-white pt-16 pb-24 md:pt-20 md:pb-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <Reveal>
          <p className="text-center text-[10px] uppercase tracking-[0.38em] text-emerald-600 mb-5 font-semibold">
            One Platform
          </p>
          {/* h2 targets "ai tools for report writing in civil engineering" */}
          <h2 className="text-center text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-bold tracking-[-0.025em] text-zinc-900 leading-[1.1] mb-5 max-w-3xl mx-auto">
            AI Tools for Report Writing,{' '}
            <span className="text-emerald-500">Workflows &amp; Engineering</span>
            <br />
            <span className="text-emerald-500">Documentation</span>
          </h2>
          <p className="text-center text-[0.9rem] text-zinc-500 max-w-xl mx-auto mb-12 leading-[1.8]">
            Replace hours of manual civil engineering documentation with minutes of automated, QA-ready output - without changing a single thing about how your team works.
          </p>
          <div className="flex justify-center mb-14">
            <Btn href="/services" primary>Explore the Platform <ArrowRight className="w-3.5 h-3.5" /></Btn>
          </div>
        </Reveal>

        {/* Browser-chrome video player */}
        <motion.div
          className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-2xl shadow-zinc-200/60 bg-zinc-900"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: EASE }}
          role="img"
          aria-label="VibeOps engineering report automation platform demo"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800 border-b border-zinc-700/60">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" aria-hidden="true" />
            <a
              href="https://reportly.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 flex-1 text-[10px] text-zinc-500 hover:text-emerald-400 tracking-wide truncate transition-colors"
            >
              reportly.ca - AI Engineering Report Automation Software
            </a>
          </div>

          <div className="relative aspect-video bg-black">
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
          transition={{ duration: 1.0, ease: EASE }}
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
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
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
          transition={{ duration: 1.1, ease: EASE }}
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
          transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
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
                show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } },
              }}
              className="group relative border border-white/8 rounded-2xl p-8 flex flex-col overflow-hidden cursor-default"
              whileHover={{ borderColor: 'rgba(52,211,153,0.2)', y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
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
            transition={{ duration: 0.3 }}
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
                show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE } },
              }}
              className="flex flex-col items-center gap-2.5 group"
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
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
          transition={{ duration: 0.85, ease: EASE }}
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
