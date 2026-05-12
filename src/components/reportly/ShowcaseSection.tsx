import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useSpring, useReducedMotion, useMotionValue, useTransform } from 'framer-motion';
import { SCENES } from "./constants";
import { IPadDevice } from "./IPadDevice";
import { SceneDescription } from "./SceneDescription";
import { VibeButton } from "../ui/VibeButton";
import { APPLE_HOVER_SPRING, APPLE_REVEAL_SPRING, getTransition } from '@/lib/motion';

// --- Top-level hoisted components (Rules of Hooks safe, stable identity) ---

interface TiltGlareIPadProps {
  sceneIndex: number;
  reduced: boolean;
}
function TiltGlareIPad({ sceneIndex, reduced }: TiltGlareIPadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-140, 140], [-5, 5]), APPLE_HOVER_SPRING);
  const ry = useSpring(useTransform(x, [-140, 140], [5, -5]), APPLE_HOVER_SPRING);
  const gx = useMotionValue(52);
  const gy = useMotionValue(28);

  // Reactive glare background (live cursor-follow, no .get() snapshot)
  const glareBackground = useTransform([gx, gy], ([xVal, yVal]) =>
    `radial-gradient(circle at ${xVal}% ${yVal}%, rgba(255,255,255,0.28) 0%, transparent 52%)`
  );
  const gOp = useSpring(useTransform([x, y], ([xv, yv]) => 0.55 + Math.min(0.35, Math.hypot(xv, yv) * 0.001)), { stiffness: 180, damping: 24 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * 0.6);
    y.set((e.clientY - cy) * 0.5);
    gx.set(((e.clientX - r.left) / r.width) * 100);
    gy.set(((e.clientY - r.top) / r.height) * 100);
  };
  const onLeave = () => {
    if (reduced) return;
    x.set(0); y.set(0); gx.set(52); gy.set(28);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const dis = reduced || isMobile;
  const tStyle: React.CSSProperties = dis ? {} : { perspective: 1200, rotateX: rx as unknown as number, rotateY: ry as unknown as number };
  const gStyle = dis
    ? { background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 45%)' }
    : { background: glareBackground, mixBlendMode: 'screen' as const, opacity: gOp };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} style={tStyle}>
      <IPadDevice sceneIndex={sceneIndex} rotateZ={0} isRight={false} />
      <motion.div className="absolute inset-0 z-10 pointer-events-none rounded-[inherit]" style={gStyle} />
    </div>
  );
}

interface ProgressDotsProps {
  current: number;
  prog: number;
  onJump: (i: number) => void;
  onInteract: () => void;
  reduced: boolean;
}
function ProgressDots({ current, prog, onJump, onInteract, reduced }: ProgressDotsProps) {
  const cRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);

  const k = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      onInteract();
      const d = e.key === 'ArrowRight' ? 1 : -1;
      const next = Math.max(0, Math.min(2, current + d));
      onJump(next);
    }
  };

  const sd = (e: React.PointerEvent<HTMLDivElement>) => {
    onInteract();
    setDrag(true);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  // Continuous proportional live scrub (60fps instant scroll, no discrete floor jump)
  const dd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag || !cRef.current) return;
    const r = cRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const section = document.querySelector('[data-testid="reportly-showcase"]') as HTMLElement | null;
    if (!section) { onJump(Math.floor(p * 3)); return; }
    const h = section.offsetHeight;
    const vh = window.innerHeight || 800;
    const sc = Math.max(80, h - vh);
    const targetY = section.offsetTop + (0.05 + p * 0.85) * sc;
    window.scrollTo({ top: targetY, behavior: 'instant' });
  };

  const ed = (e: React.PointerEvent<HTMLDivElement>) => {
    setDrag(false);
    try { (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId); } catch { /* already released */ }
  };

  return (
    <div
      ref={cRef}
      role="group"
      tabIndex={0}
      aria-label="Reportly demo progress"
      onKeyDown={k}
      onPointerDown={sd}
      onPointerMove={dd}
      onPointerUp={ed}
      onPointerLeave={ed}
      className="flex gap-3 py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--emerald-accent)]"
      data-testid="showcase-progress"
    >
      {SCENES.map((_, i) => {
        const a = i === current;
        return (
          <button
            key={i}
            role="tab"
            aria-selected={a}
            aria-controls={`scene-${i}`}
            onClick={() => { onInteract(); onJump(i); }}
            className="relative h-8 w-[72px] flex items-center justify-center min-w-[44px] min-h-[44px] focus-visible:ring-1 focus-visible:ring-[var(--emerald-accent)]"
            style={{ padding: 4 }}
          >
            <div className={`h-2 rounded-full transition-[width] duration-[50ms] linear ${a ? 'bg-[var(--emerald-accent)]' : 'bg-white/20'}`} style={{ width: a ? '72px' : '8px' }}>
              {a && <div className="h-full bg-white/90 rounded-full" style={{ width: `${Math.round(prog * 100)}%` }} />}
            </div>
            {a && <span className="absolute -top-4 text-[10px] text-[var(--emerald-accent)]">{i + 1}</span>}
          </button>
        );
      })}
    </div>
  );
}

// --- Main orchestrator (light, stable) ---

export function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.8 });
  const sceneFloat = useTransform(smoothProgress, [0.05, 0.90], [0, 3]);
  const currentSceneIndexMV = useTransform(sceneFloat, (v) => Math.min(2, Math.max(0, Math.floor(v))));
  const sceneProgressMV = useTransform(sceneFloat, (v) => v - Math.floor(v));

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  useEffect(() => {
    const u1 = currentSceneIndexMV.on('change', (v) => setCurrentSceneIndex(Math.floor(v)));
    const u2 = sceneProgressMV.on('change', (v) => setSceneProgress(v));
    return () => { u1(); u2(); };
  }, [currentSceneIndexMV, sceneProgressMV]);

  const [autoPlay, setAutoPlay] = useState(false);
  const [lastUserAction, setLastUserAction] = useState(Date.now());
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const onUserAction = useCallback(() => {
    setLastUserAction(Date.now());
    if (autoTimerRef.current) { clearTimeout(autoTimerRef.current); autoTimerRef.current = null; }
  }, []);

  // Auto (kept setTimeout + window.scrollTo for reliable 255vh scroll orchestration; 60fps proxy delivered by smoothProgress spring + instant drag scrolls + passive listeners. Framer animate on window scroll position is awkward and adds no measurable gain here.)
  useEffect(() => {
    if (reduced) { setAutoPlay(false); return; }
    if (!autoPlay) return;
    const advance = () => {
      if (Date.now() - lastUserAction < 5000) return;
      const s = sectionRef.current; if (!s) return;
      const h = s.offsetHeight; const vh = window.innerHeight || 800; const sc = Math.max(80, h - vh);
      const cur = smoothProgress.get();
      const curS = Math.floor(((cur - 0.05) / 0.85) * 3);
      const next = Math.min(2, curS + 1);
      const tp = 0.05 + (next / 3) * 0.85;
      window.scrollTo({ top: s.offsetTop + tp * sc, behavior: 'smooth' });
      setLastUserAction(Date.now());
      autoTimerRef.current = setTimeout(advance, 3100);
    };
    autoTimerRef.current = setTimeout(advance, 3100);
    return () => { if (autoTimerRef.current) clearTimeout(autoTimerRef.current); };
  }, [autoPlay, reduced, lastUserAction, smoothProgress]);

  useEffect(() => () => { if (autoTimerRef.current) clearTimeout(autoTimerRef.current); }, []);

  const scrollTo = (idx: number) => {
    const s = sectionRef.current; if (!s) return;
    const h = s.offsetHeight; const vh = window.innerHeight || 800; const sc = Math.max(80, h - vh);
    const tp = 0.05 + (idx / 3) * 0.85;
    window.scrollTo({ top: s.offsetTop + tp * sc, behavior: 'instant' });
    onUserAction();
  };

  return (
    <section ref={sectionRef} className="relative bg-[#0a0a0f] overflow-x-hidden" style={{ height: '255vh' }} data-testid="reportly-showcase" onPointerDown={onUserAction} onWheel={onUserAction}>
      <div className="sticky top-0 h-screen flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 px-6 pt-14 pb-10">
        <motion.div className="w-full max-w-[42ch] lg:max-w-[38ch] order-1 lg:order-2" style={{ opacity: useTransform(smoothProgress, [0.18, 0.32], [0.2, 1]), y: useTransform(smoothProgress, [0.18, 0.32], [14, 0]) }} transition={getTransition(reduced, APPLE_REVEAL_SPRING)}>
          <SceneDescription scene={SCENES[currentSceneIndex]} sceneIndex={currentSceneIndex} isLeft />
          <div aria-live="polite" role="status" className="sr-only" data-testid="scene-announcer">Scene {currentSceneIndex + 1}: {SCENES[currentSceneIndex].title}. {SCENES[currentSceneIndex].description.slice(0, 105)}…</div>
          <div className="mt-5"><VibeButton variant="glass" size="md" onClick={() => { setAutoPlay(!autoPlay); onUserAction(); }} data-testid="play-demo-toggle">{autoPlay ? 'Pause demo' : 'Play demo'}</VibeButton></div>
        </motion.div>
        <div className="order-2 lg:order-1 w-full max-w-[min(92vw, 420px)] lg:w-[58%] flex justify-center">
          <TiltGlareIPad sceneIndex={currentSceneIndex} reduced={reduced} />
        </div>
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 lg:static">
          <ProgressDots current={currentSceneIndex} prog={sceneProgress} onJump={scrollTo} onInteract={onUserAction} reduced={reduced} />
        </div>
      </div>
    </section>
  );
}
