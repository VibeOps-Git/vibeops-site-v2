import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function AutoVideo({ src, className = "" }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;

    const playVideo = async () => {
      try { await video.play(); } catch { /* ignore */ }
    };

    if (video.readyState >= 2) {
      void playVideo();
    } else {
      video.addEventListener("loadeddata", playVideo, { once: true });
    }
    return () => video.removeEventListener("loadeddata", playVideo);
  }, [src]);

  return (
    <video ref={ref} src={src} autoPlay muted loop playsInline preload="auto" className={className} />
  );
}

function EdgeGlow({ color = "emerald" }: { color?: "emerald" | "cyan" }) {
  const c = color === "emerald" ? "rgba(52,211,153,0.12)" : "rgba(125,211,252,0.12)";
  return (
    <motion.div
      className="pointer-events-none absolute inset-[-1px] rounded-[inherit]"
      style={{ boxShadow: `inset 0 0 20px 1px ${c}, 0 0 24px 2px ${c}` }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ---------------------------------------------------------------------------
// Device shells
// ---------------------------------------------------------------------------

function LaptopShell({ videoSrc, reducedMotion }: { videoSrc: string; reducedMotion: boolean }) {
  return (
    <div className="w-full" style={{ perspective: 1400 }}>
      <motion.div
        initial={reducedMotion ? false : { rotateX: -85, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{
          rotateX: { duration: reducedMotion ? 0 : 2.4, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.6 },
        }}
        style={{ transformOrigin: "center bottom", transformStyle: "preserve-3d" }}
      >
        {/* MacBook Pro lid — space black aluminum */}
        <div
          className="relative rounded-t-[14px] rounded-b-[2px] p-[5px] shadow-[0_40px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)]"
          style={{ background: "linear-gradient(180deg, #2c2e33 0%, #1d1f23 50%, #151618 100%)" }}
        >
          {!reducedMotion && <EdgeGlow color="emerald" />}
          {/* Screen with thin bezel */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-[10px] rounded-b-[2px] bg-[#000]">
            {/* MacBook notch — camera housing */}
            <div
              className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-[8px]"
              style={{ width: "14%", height: "3.2%", background: "#000" }}
            />
            {/* Camera dot inside notch */}
            <div
              className="absolute left-1/2 z-20 -translate-x-1/2 rounded-full"
              style={{ top: "0.6%", width: "4px", height: "4px", background: "#1a1c20", boxShadow: "inset 0 0 2px rgba(255,255,255,0.15)" }}
            />
            {/* Actual screen content */}
            <div className="absolute inset-0 overflow-hidden bg-black">
              <AutoVideo src={videoSrc} className="h-full w-full object-cover object-center" />
              {/* Subtle glass reflection */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.04)_0%,transparent_40%,transparent_60%,rgba(255,255,255,0.02)_100%)]" />
            </div>
          </div>
        </div>
        {/* MacBook base / chin — wedge profile matching lid width */}
        <div
          className="relative mx-auto -mt-px w-full rounded-b-[8px] shadow-[0_20px_40px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.05)]"
          style={{ height: 14, background: "linear-gradient(180deg, #35373c 0%, #28292e 40%, #1e2023 100%)" }}
        >
          {/* Hinge line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          {/* Trackpad indent */}
          <div className="absolute left-1/2 top-[4px] h-[4px] w-[20%] -translate-x-1/2 rounded-full bg-white/[0.03]" />
        </div>
        {/* Contact shadow */}
        <div className="mx-auto h-[4px] w-[88%] rounded-b-full bg-black/15 blur-[3px]" />
      </motion.div>
    </div>
  );
}

function TabletShell({ videoSrc, reducedMotion }: { videoSrc: string; reducedMotion: boolean }) {
  return (
    <div
      className="relative rounded-[18px] p-[6px] shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)]"
      style={{ background: "linear-gradient(180deg, #2c2e33 0%, #1d1f23 50%, #151618 100%)" }}
    >
      {!reducedMotion && <EdgeGlow color="cyan" />}
      {/* iPad Pro screen — thin uniform bezels, no home button */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[#000]">
        {/* Front camera — landscape position (centered on the short edge) */}
        <div
          className="absolute left-1/2 top-[4px] z-10 -translate-x-1/2 rounded-full"
          style={{ width: 5, height: 5, background: "#111", boxShadow: "inset 0 0 2px rgba(255,255,255,0.12)" }}
        />
        {/* Screen content — edge-to-edge */}
        <div className="absolute inset-0 overflow-hidden rounded-[12px] bg-black">
          <AutoVideo src={videoSrc} className="h-full w-full object-cover object-center" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.03)_0%,transparent_45%,transparent_65%,rgba(255,255,255,0.02)_100%)]" />
        </div>
      </div>
      {/* Side buttons */}
      <div className="absolute right-[-2px] top-[16%] h-[4%] w-[2.5px] rounded-full bg-[#3a3d42]" />
      <div className="absolute right-[-2px] top-[24%] h-[8%] w-[2.5px] rounded-full bg-[#3a3d42]" />
      <div className="absolute left-[-2px] top-[20%] h-[10%] w-[2.5px] rounded-full bg-[#3a3d42]" />
    </div>
  );
}

function PhoneShell({ videoSrc, reducedMotion }: { videoSrc: string; reducedMotion: boolean }) {
  return (
    <div
      className="relative rounded-[18px] p-[5px] shadow-[0_22px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)]"
      style={{ background: "linear-gradient(180deg, #2c2e33 0%, #1d1f23 50%, #151618 100%)" }}
    >
      {!reducedMotion && <EdgeGlow color="emerald" />}
      {/* iPhone 16 Pro landscape — edge-to-edge */}
      <div className="relative aspect-[19.5/9] overflow-hidden rounded-[14px] bg-[#000]">
        {/* Dynamic Island — on the left edge in landscape orientation */}
        <div
          className="absolute left-[6px] top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#000]"
          style={{ width: 10, height: "26%" }}
        />
        {/* Camera lens inside Dynamic Island */}
        <div
          className="absolute left-[8px] z-10 rounded-full"
          style={{ top: "calc(50% - 3px)", width: 6, height: 6, background: "#111", boxShadow: "inset 0 0 2px rgba(255,255,255,0.1)" }}
        />
        {/* Screen content */}
        <div className="absolute inset-0 overflow-hidden rounded-[14px] bg-black">
          <AutoVideo src={videoSrc} className="h-full w-full object-cover object-center" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.03)_0%,transparent_45%,transparent_65%,rgba(255,255,255,0.02)_100%)]" />
        </div>
        {/* Home indicator — bottom center */}
        <div className="absolute bottom-[3px] left-1/2 z-10 h-[3px] w-[18%] -translate-x-1/2 rounded-full bg-white/25" />
      </div>
      {/* Hardware buttons — power on top edge, volume on bottom edge in landscape */}
      <div className="absolute top-[-2px] right-[18%] w-[10%] h-[2.5px] rounded-full bg-[#3a3d42]" />
      <div className="absolute bottom-[-2px] left-[16%] w-[5%] h-[2.5px] rounded-full bg-[#3a3d42]" />
      <div className="absolute bottom-[-2px] left-[24%] w-[8%] h-[2.5px] rounded-full bg-[#3a3d42]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Carousel config
// ---------------------------------------------------------------------------

const DEVICES = ["laptop", "tablet", "phone"] as const;
type DeviceType = (typeof DEVICES)[number];

const DEVICE_MAX_W: Record<DeviceType, string> = {
  laptop: "max-w-[1200px]",
  tablet: "max-w-[1100px]",
  phone: "max-w-[1200px]",
};

const PEEK_W: Record<DeviceType, string> = {
  laptop: "w-[330px]",
  tablet: "w-[300px]",
  phone: "w-[330px]",
};

const AUTO_ROTATE_MS = 8000;

const slideTransition = {
  x: { type: "spring" as const, stiffness: 180, damping: 26, mass: 0.9 },
  scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  opacity: { duration: 0.4 },
};

// ---------------------------------------------------------------------------
// Peek device — positioned from viewport edges
// ---------------------------------------------------------------------------

function DeviceShellByType({ device, videoSrc, reducedMotion }: { device: DeviceType; videoSrc: string; reducedMotion: boolean }) {
  if (device === "laptop") return <LaptopShell videoSrc={videoSrc} reducedMotion={reducedMotion} />;
  if (device === "tablet") return <TabletShell videoSrc={videoSrc} reducedMotion={reducedMotion} />;
  return <PhoneShell videoSrc={videoSrc} reducedMotion={reducedMotion} />;
}

function PeekDevice({
  device, videoSrc, reducedMotion, side, onClick,
}: {
  device: DeviceType; videoSrc: string; reducedMotion: boolean;
  side: "left" | "right"; onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      className={`pointer-events-auto absolute top-1/2 ${PEEK_W[device]} cursor-pointer`}
      style={{
        [side]: "-4vw",
        transform: `translateY(-50%) translateX(${side === "left" ? "-55%" : "55%"}) rotate(${side === "left" ? "-6deg" : "6deg"})`,
        filter: "blur(1.5px) brightness(0.6)",
      }}
      onClick={onClick}
      whileHover={{ opacity: 0.5, scale: 1.05 }}
      animate={{ opacity: 0.25 }}
      transition={{ duration: 0.3 }}
    >
      <DeviceShellByType device={device} videoSrc={videoSrc} reducedMotion={reducedMotion} />
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function HomepageDeviceStage({ videoSrc }: { videoSrc: string }) {
  const reducedMotion = Boolean(useReducedMotion());
  const [activeIdx, setActiveIdx] = useState(0);

  // Continuous auto-rotate — never pauses, never resets
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % DEVICES.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const handleManual = useCallback(
    (idx: number) => {
      if (idx === activeIdx) return;
      setActiveIdx(idx);
    },
    [activeIdx],
  );

  const activeDevice = DEVICES[activeIdx];
  const prevIdx = (activeIdx - 1 + DEVICES.length) % DEVICES.length;
  const nextIdx = (activeIdx + 1) % DEVICES.length;

  return (
    <>
      {/* Peek devices — spans full viewport width using the 100vw trick */}
      <div
        className="pointer-events-none absolute inset-y-0 z-[5] hidden md:block"
        style={{ width: "100vw", left: "50%", transform: "translateX(-50%)" }}
      >
        <div className="relative h-full w-full">
          <PeekDevice
            device={DEVICES[prevIdx]}
            videoSrc={videoSrc}
            reducedMotion={reducedMotion}
            side="left"
            onClick={() => handleManual(prevIdx)}
          />
          <PeekDevice
            device={DEVICES[nextIdx]}
            videoSrc={videoSrc}
            reducedMotion={reducedMotion}
            side="right"
            onClick={() => handleManual(nextIdx)}
          />
        </div>
      </div>

      {/* Main carousel — all devices stay mounted so videos keep playing */}
      <div className="relative w-full" data-testid="hero-device-stage">
        <div className="absolute inset-x-[15%] bottom-0 h-[18%] rounded-full bg-black/25 blur-3xl" />

        <div className="relative flex items-center justify-center">
          {DEVICES.map((device, i) => {
            const isActive = i === activeIdx;
            // Circular offset: figure out which direction the inactive item is
            const offset = ((i - activeIdx + DEVICES.length) % DEVICES.length);
            const xDir = offset === 0 ? 0 : offset <= DEVICES.length / 2 ? 1 : -1;

            return (
              <motion.div
                key={device}
                className={`${isActive ? "relative" : "absolute"} w-full ${DEVICE_MAX_W[device]}`}
                animate={
                  isActive
                    ? { x: 0, scale: 1, opacity: 1, zIndex: 2 }
                    : { x: `${xDir * 80}%`, scale: 0.8, opacity: 0, zIndex: 1 }
                }
                transition={slideTransition}
              >
                <DeviceShellByType device={device} videoSrc={videoSrc} reducedMotion={reducedMotion} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}
