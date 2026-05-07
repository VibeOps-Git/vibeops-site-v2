import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

function AutoVideo({ src, className = "" }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true;
    const play = async () => { try { await v.play(); } catch { /* */ } };
    if (v.readyState >= 2) void play();
    else v.addEventListener("loadeddata", play, { once: true });
    return () => v.removeEventListener("loadeddata", play);
  }, [src]);
  return <video ref={ref} src={src} autoPlay muted loop playsInline preload="auto" className={className} />;
}

// ---------------------------------------------------------------------------
// 1. Rugged Field Laptop - Toughbook / Dell Latitude Rugged
// ---------------------------------------------------------------------------

function LaptopShell({ videoSrc, reducedMotion }: { videoSrc: string; reducedMotion: boolean }) {
  return (
    <div className="w-full" style={{ perspective: 1400 }}>
      <motion.div
        initial={reducedMotion ? false : { rotateX: -80, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ rotateX: { duration: reducedMotion ? 0 : 2.2, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.6 } }}
        style={{ transformOrigin: "center bottom", transformStyle: "preserve-3d" }}
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
            {/* Screen */}
            <div className="relative overflow-hidden rounded-sm bg-black" style={{ aspectRatio: "16/10", border: "2px solid #111" }}>
              <AutoVideo src={videoSrc} className="h-full w-full object-cover" />
            </div>
            <div className="flex justify-center mt-1.5">
              <span className="text-[6px] font-bold tracking-[0.3em] uppercase text-white/10 select-none">Toughbook</span>
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
// 2. iPad Pro - LANDSCAPE (screen 3:2 = clearly wider than tall)
// ---------------------------------------------------------------------------

function TabletShell({ videoSrc }: { videoSrc: string }) {
  return (
    <div className="w-full">
      <div className="relative" style={{ border: "1px solid #babdbf", borderRadius: 14, background: "#0d0d0d", boxShadow: "inset 0 0 0 3px #e2e3e4, 0 30px 80px rgba(0,0,0,0.45)" }}>
        {/* Frame padding - thinner on long edges (top/bottom), thicker on short edges (left/right) for landscape iPad */}
        <div style={{ padding: "10px 14px" }}>
          <div className="relative overflow-hidden bg-black" style={{ aspectRatio: "16/10", borderRadius: 6, border: "2px solid #121212" }}>
            <AutoVideo src={videoSrc} className="h-full w-full object-cover" />
          </div>
        </div>
        {/* Front camera - right short edge in landscape */}
        <div className="absolute right-[5px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#1a1a1a] ring-1 ring-[#333]" />
        {/* Power - top long edge */}
        <div className="absolute top-[-2px] right-[12%] w-[5%] h-[2px] rounded-full bg-[#babdbf]" />
        {/* Volume - left short edge */}
        <div className="absolute left-[-2px] top-[25%] h-[6%] w-[2px] rounded-full bg-[#babdbf]" />
        <div className="absolute left-[-2px] top-[35%] h-[6%] w-[2px] rounded-full bg-[#babdbf]" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. iPhone 14 Pro - LANDSCAPE (screen 16:9 to match demo video)
// ---------------------------------------------------------------------------

function PhoneShell({ videoSrc }: { videoSrc: string }) {
  return (
    <div className="w-full">
      <div className="relative" style={{ border: "1px solid #1b1721", borderRadius: 20, background: "#010101", boxShadow: "inset 0 0 4px 2px #c0b7cd, inset 0 0 0 5px #342c3f, 0 25px 70px rgba(0,0,0,0.5)" }}>
        {/* Frame padding - thin bezel on long edges, slightly thicker on short edges */}
        <div style={{ padding: "6px 10px" }}>
          <div className="relative overflow-hidden bg-black" style={{ aspectRatio: "16/9", borderRadius: 14 }}>
            <AutoVideo src={videoSrc} className="h-full w-full object-cover" />
            {/* Dynamic Island - left short edge in landscape */}
            <div className="absolute left-[10px] top-1/2 -translate-y-1/2 z-10 bg-black rounded-full" style={{ width: 18, height: "28%", minHeight: 22 }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-[#0a0a12] ring-1 ring-[#222]" />
            </div>
            {/* Home indicator */}
            <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 z-10 w-[20%] h-[3px] rounded-full bg-white/20" />
          </div>
        </div>
        {/* Power - top long edge in landscape */}
        <div className="absolute top-[-2px] right-[14%] w-[7%] h-[2px] rounded-full bg-[#342c3f]" />
        {/* Volume - bottom long edge in landscape */}
        <div className="absolute bottom-[-2px] left-[12%] w-[4%] h-[2px] rounded-full bg-[#342c3f]" />
        <div className="absolute bottom-[-2px] left-[18%] w-[5%] h-[2px] rounded-full bg-[#342c3f]" />
        {/* Mute switch */}
        <div className="absolute bottom-[-2px] left-[8%] w-[2%] h-[2px] rounded-full bg-[#342c3f]" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Carousel - no peek devices, clean centered carousel
// ---------------------------------------------------------------------------

const DEVICES = ["laptop", "tablet", "phone"] as const;
type DeviceType = (typeof DEVICES)[number];

const DEVICE_MAX_W: Record<DeviceType, string> = {
  laptop: "max-w-[1100px]",
  tablet: "max-w-[1000px]",
  phone: "max-w-[1100px]",
};

const AUTO_ROTATE_MS = 8000;

const slideTransition = {
  x: { type: "spring" as const, stiffness: 180, damping: 26, mass: 0.9 },
  scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  opacity: { duration: 0.4 },
};

function DeviceShellByType({ device, videoSrc, reducedMotion }: { device: DeviceType; videoSrc: string; reducedMotion: boolean }) {
  if (device === "laptop") return <LaptopShell videoSrc={videoSrc} reducedMotion={reducedMotion} />;
  if (device === "tablet") return <TabletShell videoSrc={videoSrc} />;
  return <PhoneShell videoSrc={videoSrc} />;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function HomepageDeviceStage({ videoSrc }: { videoSrc: string }) {
  const reducedMotion = Boolean(useReducedMotion());
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % DEVICES.length), AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const handleManual = useCallback((idx: number) => {
    if (idx !== activeIdx) setActiveIdx(idx);
  }, [activeIdx]);

  return (
    <div className="relative w-full overflow-x-hidden" data-testid="hero-device-stage">
      <div className="absolute inset-x-[15%] bottom-0 h-[18%] rounded-full bg-black/25 blur-3xl" />

      {/* Fixed-height wrapper so the section doesn't jump between device sizes.
          aspect-ratio 16/10 matches the tallest device (laptop). */}
      <div className="relative w-full" style={{ aspectRatio: "16 / 9.5" }}>
        {DEVICES.map((device, i) => {
          const isActive = i === activeIdx;
          const offset = ((i - activeIdx + DEVICES.length) % DEVICES.length);
          const xDir = offset === 0 ? 0 : offset <= DEVICES.length / 2 ? 1 : -1;
          return (
            <motion.div
              key={device}
              className={`absolute inset-0 flex items-center justify-center px-2 sm:px-0`}
              animate={isActive ? { x: 0, scale: 1, opacity: 1, zIndex: 2 } : { x: `${xDir * 80}%`, scale: 0.8, opacity: 0, zIndex: 1 }}
              transition={slideTransition}
            >
              <div className={`w-full mx-auto ${DEVICE_MAX_W[device]}`}>
                <DeviceShellByType device={device} videoSrc={videoSrc} reducedMotion={reducedMotion} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Device indicator dots */}
      <div className="flex justify-center gap-2 mt-6">
        {DEVICES.map((d, i) => (
          <button
            key={d}
            type="button"
            onClick={() => handleManual(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIdx ? "bg-emerald-400 scale-125" : "bg-white/15 hover:bg-white/30"}`}
            aria-label={`Show ${d}`}
          />
        ))}
      </div>
    </div>
  );
}
