import { useCallback, useEffect, useRef, useState, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

function AutoVideo({ src, className = "", playbackRate = 2 }: { src: string; className?: string; playbackRate?: number }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true;
    v.playbackRate = playbackRate;
    const play = async () => {
      v.playbackRate = playbackRate;
      try { await v.play(); } catch { /* */ }
    };
    if (v.readyState >= 2) void play();
    else v.addEventListener("loadeddata", play, { once: true });
    return () => v.removeEventListener("loadeddata", play);
  }, [src, playbackRate]);
  return <video ref={ref} src={src} autoPlay muted loop playsInline preload="auto" className={className} />;
}

// ---------------------------------------------------------------------------
// 1. Rugged Field Laptop - Toughbook / Dell Latitude Rugged
// ---------------------------------------------------------------------------

// LaptopShell accepts either a videoSrc (legacy) or children (custom React content).
// Never pass both - children takes precedence.
// lidProgress: 0 = closed/tilted (-72°), 1 = fully open (0°). When provided, overrides mount animation.
export function LaptopShell({
  videoSrc,
  children,
  reducedMotion,
  skipEntrance = false,
  lidProgress,
}: {
  videoSrc?: string;
  children?: ReactNode;
  reducedMotion: boolean;
  skipEntrance?: boolean;
  lidProgress?: number;
}) {
  const isScrollDriven = lidProgress !== undefined;
  const clampedLid = isScrollDriven ? Math.max(0, Math.min(1, lidProgress)) : 1;
  const scrollRotateX = -72 * (1 - clampedLid);

  return (
    <div className="w-full" style={{ perspective: 1400 }}>
      <motion.div
        initial={reducedMotion || skipEntrance || isScrollDriven ? false : { rotateX: -72, opacity: 0 }}
        animate={isScrollDriven ? { opacity: 1 } : { rotateX: 0, opacity: 1 }}
        transition={isScrollDriven
          ? { opacity: { duration: 0.5 } }
          : { rotateX: { duration: reducedMotion ? 0 : 3.6, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.5 } }
        }
        style={{
          rotateX: isScrollDriven ? scrollRotateX : undefined,
          transformOrigin: "center bottom",
          transformStyle: "preserve-3d",
        }}
      >
        {/* LID */}
        <div className="relative" style={{ border: "5px solid #33363d", borderRadius: "8px 8px 2px 2px", background: "linear-gradient(180deg,#3a3e46,#2a2d34 40%,#22252b)", boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
          {/* Rubber bumpers */}
          <div className="absolute -top-[1px] -left-[1px] w-4 h-4 rounded-br-lg bg-[#1a1c20] z-10" />
          <div className="absolute -top-[1px] -right-[1px] w-4 h-4 rounded-bl-lg bg-[#1a1c20] z-10" />
          <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 rounded-tr-md bg-[#1a1c20] z-10" />
          <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 rounded-tl-md bg-[#1a1c20] z-10" />

          <div className="p-3 pt-2">
            {/* Cam */}
            <div className="flex justify-center mb-1.5">
              <div className="w-2 h-2 rounded-full bg-[#15171b] ring-1 ring-[#444]" />
            </div>
            {/* Screen - children OR video */}
            <div className="relative overflow-hidden rounded-sm bg-black" style={{ aspectRatio: "16/10", border: "2px solid #111" }}>
              {children
                ? <div className="absolute inset-0 overflow-hidden">{children}</div>
                : videoSrc
                  ? <AutoVideo src={videoSrc} className="h-full w-full object-cover" />
                  : null
              }
            </div>
            <div className="flex justify-center mt-1.5">
              <span className="text-[6px] font-bold tracking-[0.3em] uppercase text-white/18 select-none">VibeOps</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t bg-[#1a1c20]" />
        </div>

        {/* HINGE */}
        <div className="mx-auto -mt-px w-[97%] h-[6px] flex justify-between px-[14%]" style={{ background: "#1e2025", borderRadius: "0 0 2px 2px" }}>
          <div className="w-[14%] h-full rounded-b bg-[#3a3d44]" />
          <div className="w-[14%] h-full rounded-b bg-[#3a3d44]" />
          <div className="w-[14%] h-full rounded-b bg-[#3a3d44]" />
        </div>

        {/* BASE */}
        <div className="relative mx-auto w-full sm:w-[103%] sm:-ml-[1.5%] overflow-hidden" style={{ height: "clamp(42px,4.5vw,60px)", border: "5px solid #33363d", borderTop: "none", borderRadius: "0 0 8px 8px", background: "linear-gradient(180deg,#22252b,#2a2d34 50%,#33363d)", boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}>
          <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 rounded-tr-lg bg-[#1a1c20] z-10" />
          <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 rounded-tl-lg bg-[#1a1c20] z-10" />
          {/* Keyboard */}
          <div className="absolute inset-x-[7%] top-[12%] bottom-[28%] rounded bg-[#15171b]/80">
            <div className="grid grid-rows-3 gap-px p-[3px] h-full">
              {[14, 13, 12].map((cols, r) => (
                <div key={r} className={`grid gap-px`} style={{ gridTemplateColumns: r === 2 ? "1fr 1fr 1fr 6fr 1fr 1fr" : `repeat(${cols}, 1fr)` }}>
                  {Array.from({ length: r === 2 ? 6 : cols }).map((_, i) => <div key={i} className="rounded-[1px] bg-[#2a2d33]" />)}
                </div>
              ))}
            </div>
          </div>
          {/* Trackpad */}
          <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[16%] h-[18%] rounded bg-[#1e2025] border border-[#3a3d44]/20" />
          {/* LEDs */}
          <div className="absolute top-[16%] right-[4%] flex gap-1">
            <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
            <div className="w-1 h-1 rounded-full bg-amber-400/30" />
          </div>
        </div>
        <div className="mx-auto h-1 w-[88%] rounded-b-full bg-black/15 blur-[3px]" />
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// UAG-style rugged case helper - recessed screw bolt
// ---------------------------------------------------------------------------

function ScrewBolt({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute pointer-events-none z-10"
      style={{
        width: 7, height: 7,
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 30%, #3e4148, #1e2025)",
        border: "0.5px solid rgba(255,255,255,0.13)",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.04)",
        ...style,
      }}
    />
  );
}

// Horizontal grip rib strip - used on long edges of the case
function GripStrip({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute pointer-events-none flex gap-[3px] items-center" style={style}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} style={{ width: 3, height: 5, borderRadius: 1, background: "rgba(255,255,255,0.11)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }} />
      ))}
    </div>
  );
}

// Octagonal clip-path with consistent pixel chamfers at all 8 corners.
// ch = chamfer size in px - creates flat-cut corners like UAG/Pelican cases.
function uagClip(ch: number) {
  return `polygon(${ch}px 0px, calc(100% - ${ch}px) 0px, 100% ${ch}px, 100% calc(100% - ${ch}px), calc(100% - ${ch}px) 100%, ${ch}px 100%, 0px calc(100% - ${ch}px), 0px ${ch}px)`;
}

// ---------------------------------------------------------------------------
// 2. iPad in UAG PATHFINDER-STYLE RUGGED CASE - Landscape
// Octagonal silhouette, thick black bumper, raised inner frame, screw bolts,
// grip rails on long edges, angular back panel texture.
// ---------------------------------------------------------------------------

function TabletShell({ videoSrc, children }: { videoSrc?: string; children?: ReactNode }) {
  const CH = 18; // corner chamfer px
  return (
    <div className="w-full relative">
      {/* OUTER CASE BODY - octagonal clip-path = flat-cut corners */}
      <div
        className="relative"
        style={{
          clipPath: uagClip(CH),
          background: "linear-gradient(160deg, #252729, #18191c 55%, #1e2022)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05)",
          padding: "13px 15px",
        }}
      >
        {/* Outer raised bumper ring - 1px lighter inset border gives depth */}
        <div
          className="absolute"
          style={{
            clipPath: uagClip(CH - 4),
            inset: "3px",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 0,
            pointerEvents: "none",
          }}
        />

        {/* Corner screw bolts - inside octagonal clip bounds */}
        <ScrewBolt style={{ top: 7,  left: 10 }} />
        <ScrewBolt style={{ top: 7,  right: 10 }} />
        <ScrewBolt style={{ bottom: 7, left: 10 }} />
        <ScrewBolt style={{ bottom: 7, right: 10 }} />

        {/* Grip strips on long edges (top + bottom of landscape case) */}
        <GripStrip style={{ top: 4, left: "50%", transform: "translateX(-50%)" }} />
        <GripStrip style={{ bottom: 4, left: "50%", transform: "translateX(-50%)" }} />

        {/* Angular bevel lines near corners - UAG geometric panel detail */}
        {/* Top-left bevel */}
        <div className="absolute top-[18px] left-[18px] w-[22px] h-[1px]" style={{ background: "rgba(255,255,255,0.06)", transform: "rotate(-45deg)", transformOrigin: "left center" }} />
        {/* Top-right bevel */}
        <div className="absolute top-[18px] right-[18px] w-[22px] h-[1px]" style={{ background: "rgba(255,255,255,0.06)", transform: "rotate(45deg)", transformOrigin: "right center" }} />
        {/* Bottom-left bevel */}
        <div className="absolute bottom-[18px] left-[18px] w-[22px] h-[1px]" style={{ background: "rgba(255,255,255,0.06)", transform: "rotate(45deg)", transformOrigin: "left center" }} />
        {/* Bottom-right bevel */}
        <div className="absolute bottom-[18px] right-[18px] w-[22px] h-[1px]" style={{ background: "rgba(255,255,255,0.06)", transform: "rotate(-45deg)", transformOrigin: "right center" }} />

        {/* INNER SCREEN FRAME - raised inset panel */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "#0d0e10",
            border: "1.5px solid #2a2c30",
            borderRadius: 2,
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          {/* iPad Pro 11" landscape is 2388×1668 → 43:30 ≈ 4/3 */}
          <div className="relative overflow-hidden bg-black" style={{ aspectRatio: "4/3", display: "block" }}>
            {children
              ? <div className="absolute inset-0 overflow-hidden">{children}</div>
              : <AutoVideo src={videoSrc!} className="h-full w-full object-contain" />
            }
          </div>
        </div>

        {/* Front camera dot - right short edge */}
        <div className="absolute right-[5px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#0a0b0d] ring-1 ring-[#2a2c30]" />
      </div>

      {/* Ground shadow */}
      <div className="mx-auto h-1.5 w-[80%] rounded-b-full" style={{ background: "rgba(0,0,0,0.35)", filter: "blur(6px)" }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. iPhone in UAG PATHFINDER-STYLE RUGGED CASE - Landscape
// ---------------------------------------------------------------------------

function PhoneShell({ videoSrc, children }: { videoSrc?: string; children?: ReactNode }) {
  const CH = 16;
  return (
    <div className="w-full relative">
      {/* OUTER CASE BODY - portrait orientation */}
      <div
        className="relative"
        style={{
          clipPath: uagClip(CH),
          background: "linear-gradient(170deg, #252729, #18191c 55%, #1e2022)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05)",
          padding: "13px 11px",  // taller padding on top/bottom for portrait
        }}
      >
        {/* Raised bumper ring */}
        <div
          className="absolute"
          style={{
            clipPath: uagClip(CH - 4),
            inset: "3px",
            border: "1px solid rgba(255,255,255,0.07)",
            pointerEvents: "none",
          }}
        />

        {/* Corner screw bolts */}
        <ScrewBolt style={{ top: 6,  left: 9 }} />
        <ScrewBolt style={{ top: 6,  right: 9 }} />
        <ScrewBolt style={{ bottom: 6, left: 9 }} />
        <ScrewBolt style={{ bottom: 6, right: 9 }} />

        {/* Grip strips on long edges (left + right in portrait) */}
        <GripStrip style={{ left: 3, top: "50%", transform: "translateY(-50%) rotate(90deg)" }} />
        <GripStrip style={{ right: 3, top: "50%", transform: "translateY(-50%) rotate(90deg)" }} />

        {/* Angular bevel details */}
        <div className="absolute top-[15px] left-[15px] w-[18px] h-[1px]" style={{ background: "rgba(255,255,255,0.06)", transform: "rotate(-45deg)", transformOrigin: "left center" }} />
        <div className="absolute top-[15px] right-[15px] w-[18px] h-[1px]" style={{ background: "rgba(255,255,255,0.06)", transform: "rotate(45deg)", transformOrigin: "right center" }} />
        <div className="absolute bottom-[15px] left-[15px] w-[18px] h-[1px]" style={{ background: "rgba(255,255,255,0.06)", transform: "rotate(45deg)", transformOrigin: "left center" }} />
        <div className="absolute bottom-[15px] right-[15px] w-[18px] h-[1px]" style={{ background: "rgba(255,255,255,0.06)", transform: "rotate(-45deg)", transformOrigin: "right center" }} />

        {/* INNER SCREEN FRAME */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "#0d0e10",
            border: "1.5px solid #2a2c30",
            borderRadius: 2,
            boxShadow: "inset 0 2px 5px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          {/* iPhone 15 Pro portrait: 1179×2556 → 9/19.5
              Dynamic Island real dims: ~270px wide × ~37px tall on 1179px screen
              = ~23% of screen width, ~1.45% of screen height.
              In our proportional layout: 23% wide, height ≈ 23% * (9/19.5) = ~10.6% of width.
              We use 4% of screen HEIGHT as a safe approximation for the pill height. */}
          <div className="relative overflow-hidden bg-black" style={{ aspectRatio: "9/19.5", display: "block" }}>
            {children
              ? (
                /* Safe area: pushes content below Dynamic Island.
                   DI top=1.4% + height=1.8% = bottom at ~3.2%. Add ~1% gap = 4.5% total. */
                <div className="absolute inset-0 overflow-hidden" style={{ paddingTop: "5%" }}>
                  {children}
                </div>
              )
              : <AutoVideo src={videoSrc!} className="h-full w-full object-cover" />
            }

            {/* Dynamic Island — real iPhone 15 Pro: 270px wide × 37px tall on 1179×2556.
                Width = 23% of screen, height ≈ 1.45% of screen height.
                We use 1.8% for slight readability bump. */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-20 bg-black"
              style={{
                top: "1.4%",
                width: "23%",
                height: "1.8%",
                minHeight: 5,
                borderRadius: 999,
                boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
              }}
            >
              {/* Front camera dot inside the island */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ width: "22%", height: "65%", background: "#0a0a12", boxShadow: "0 0 0 1px rgba(255,255,255,0.10)" }} />
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-[1.2%] left-1/2 -translate-x-1/2 z-20 rounded-full bg-white/22"
              style={{ width: "28%", height: "0.45%", minHeight: 2 }} />
          </div>
        </div>
      </div>

      {/* Ground shadow */}
      <div className="mx-auto h-1.5 w-[80%] rounded-b-full" style={{ background: "rgba(0,0,0,0.35)", filter: "blur(5px)" }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Carousel - no peek devices, clean centered carousel
// ---------------------------------------------------------------------------

const DEVICES = ["laptop", "tablet", "phone"] as const;
type DeviceType = (typeof DEVICES)[number];

const DEVICE_MAX_W: Record<DeviceType, string> = {
  laptop: "max-w-[1000px]",
  tablet: "max-w-[720px]",  // iPad landscape: meaningfully smaller than laptop
  phone:  "max-w-[280px]",  // iPhone portrait: compact, phone-sized
};

const AUTO_ROTATE_MS = 8000;

const slideTransition = {
  x: { type: "spring" as const, stiffness: 180, damping: 26, mass: 0.9 },
  scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  opacity: { duration: 0.4 },
};

function DeviceShellByType({ device, videoSrc, screenContent, reducedMotion, lidProgress }: { device: DeviceType; videoSrc?: string; screenContent?: ReactNode; reducedMotion: boolean; lidProgress?: number }) {
  if (device === "laptop") return <LaptopShell videoSrc={videoSrc} reducedMotion={reducedMotion} lidProgress={lidProgress}>{screenContent}</LaptopShell>;
  if (device === "tablet") return <TabletShell videoSrc={videoSrc}>{screenContent}</TabletShell>;
  return <PhoneShell videoSrc={videoSrc}>{screenContent}</PhoneShell>;
}

// Convenience export: laptop shell sized for a section (not full-page hero),
// with custom React content as the screen. Uses whileInView reveal.
export function SectionLaptop({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const rm = Boolean(useReducedMotion());
  return (
    <motion.div
      className={`w-full max-w-[560px] ${className}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <LaptopShell reducedMotion={rm} skipEntrance>
        {children}
      </LaptopShell>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function HomepageDeviceStage({
  videoSrc,
  screenContent,
  hideDots = false,
  lockedDevice,
  allowedDevices,
  carouselActive = true,
  forcedActiveIdx,
  lidProgress,
  initialActiveIdx = 0,
}: {
  videoSrc?: string;
  screenContent?: ReactNode;
  hideDots?: boolean;
  lockedDevice?: DeviceType;
  allowedDevices?: DeviceType[];      // subset of DEVICES to show in the carousel
  carouselActive?: boolean;           // false = pause auto-rotate
  forcedActiveIdx?: number;           // externally control which device is front
  lidProgress?: number;               // 0=closed, 1=open - passed to laptop only
  initialActiveIdx?: number;          // which device the carousel starts on
}) {
  const reducedMotion = Boolean(useReducedMotion());
  const [activeIdx, setActiveIdx] = useState(initialActiveIdx);

  // Sync to externally forced index when provided
  useEffect(() => {
    if (forcedActiveIdx !== undefined) setActiveIdx(forcedActiveIdx);
  }, [forcedActiveIdx]);

  // Auto-rotate only when carouselActive=true and no lock/force
  useEffect(() => {
    if (reducedMotion || lockedDevice || !carouselActive || forcedActiveIdx !== undefined) return;
    const pool = allowedDevices ?? [...DEVICES];
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % pool.length), AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [reducedMotion, lockedDevice, carouselActive, forcedActiveIdx, allowedDevices]);

  const handleManual = useCallback((idx: number) => {
    if (idx !== activeIdx) setActiveIdx(idx);
  }, [activeIdx]);

  // Determine which devices to render
  const pool = allowedDevices ?? [...DEVICES];
  const visibleDevices = lockedDevice ? [lockedDevice] : pool;
  const effectiveIdx = lockedDevice ? 0 : activeIdx;

  return (
    <div className="relative w-full" data-testid="hero-device-stage">
      <div className="absolute inset-x-[15%] bottom-0 h-[18%] rounded-full bg-black/25 blur-3xl" />

      {/* Fixed-height wrapper so the section doesn't jump between device sizes.
          aspect-ratio 16/10 matches the tallest device (laptop). */}
      <div className="relative w-full" style={{ aspectRatio: "16 / 9.5" }}>
        {visibleDevices.map((device, i) => {
          const isActive = i === effectiveIdx;
          const n = visibleDevices.length;
          const offset = ((i - effectiveIdx + n) % n);
          const xDir = offset === 0 ? 0 : offset <= n / 2 ? 1 : -1;
          return (
            <motion.div
              key={device}
              className={`absolute inset-0 flex items-center justify-center px-2 sm:px-0`}
              animate={isActive ? { x: 0, scale: 1, opacity: 1, zIndex: 2 } : { x: `${xDir * 80}%`, scale: 0.8, opacity: 0, zIndex: 1 }}
              transition={slideTransition}
            >
              <div className={`w-full mx-auto ${DEVICE_MAX_W[device]}`}>
                <DeviceShellByType device={device} videoSrc={videoSrc} screenContent={screenContent} reducedMotion={reducedMotion} lidProgress={device === 'laptop' ? lidProgress : undefined} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Device indicator dots */}
      {!hideDots && (
        <div className="flex justify-center gap-2 mt-6">
          {visibleDevices.map((d, i) => (
            <button
              key={d}
              type="button"
              onClick={() => handleManual(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIdx ? "bg-emerald-400 scale-125" : "bg-white/15 hover:bg-white/30"}`}
              aria-label={`Show ${d}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
