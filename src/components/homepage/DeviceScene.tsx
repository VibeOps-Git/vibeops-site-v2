import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { APPLE_HOVER_SPRING, getTransition } from '@/lib/motion';

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
  // Unification: cyan legacy mapped to emerald-accent (PR03)
  const c = "rgba(52,211,153,0.12)"; // emerald-accent
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
    <div className="w-full" style={{ perspective: 1200 }}>
      <motion.div
        initial={reducedMotion ? false : { rotateX: -85, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{
          rotateX: { duration: reducedMotion ? 0 : 2.4, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.6 },
        }}
        style={{ transformOrigin: "center bottom", transformStyle: "preserve-3d" }}
      >
        <div className="relative rounded-[28px] border border-white/16 bg-[linear-gradient(180deg,#dbe2ea_0%,#9da6b1_20%,#4d5662_56%,#1b212a_100%)] p-[10px] shadow-[0_40px_120px_rgba(0,0,0,0.4)]">
          {!reducedMotion && <EdgeGlow color="emerald" />}
          <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#05070c]">
            <div className="absolute inset-[10px] overflow-hidden rounded-[14px] bg-black">
              <AutoVideo src={videoSrc} className="h-full w-full object-cover object-center brightness-[1.12] contrast-[1.06]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.16),transparent_30%),linear-gradient(135deg,transparent_32%,rgba(255,255,255,0.07)_58%,transparent_82%)]" />
            </div>
            <div className="absolute left-1/2 top-[5px] h-[8px] w-[118px] -translate-x-1/2 rounded-b-[10px] bg-[#05070c]" />
            <div className="absolute left-1/2 top-[9px] h-[8px] w-[8px] -translate-x-1/2 rounded-full bg-[#141922] ring-1 ring-white/10" />
          </div>
        </div>
        <div className="relative mx-auto -mt-[2px] h-[18px] w-[104%] max-w-[1020px] rounded-b-[28px] border-x border-b border-white/12 bg-[linear-gradient(180deg,#d8dee6_0%,#adb5bf_32%,#7e8895_72%,#69727f_100%)] shadow-[0_30px_50px_rgba(0,0,0,0.22)]">
          <div className="mx-auto mt-[4px] h-[6px] w-[22%] rounded-full bg-[#8993a0]" />
        </div>
      </motion.div>
    </div>
  );
}

function TabletShell({ videoSrc, reducedMotion }: { videoSrc: string; reducedMotion: boolean }) {
  return (
    <div className="relative rounded-[34px] border border-white/12 bg-[linear-gradient(180deg,#7f8792_0%,#49525d_40%,#1a2027_100%)] p-[12px] shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
      {!reducedMotion && <EdgeGlow color="cyan" />}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#05070c]">
        <div className="absolute inset-[6px] overflow-hidden rounded-[18px] bg-black">
          <AutoVideo src={videoSrc} className="h-full w-full object-cover object-center brightness-[1.1] contrast-[1.04]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.09),transparent_36%,transparent_68%,rgba(255,255,255,0.08))]" />
        </div>
        <div className="absolute left-1/2 top-[8px] h-[10px] w-[10px] -translate-x-1/2 rounded-full bg-[#151a22] ring-1 ring-white/10" />
      </div>
      <div className="absolute left-[-3px] top-[24%] h-[12%] w-[3px] rounded-full bg-[#8e96a2]" />
      <div className="absolute left-[-3px] top-[39%] h-[18%] w-[3px] rounded-full bg-[#8e96a2]" />
    </div>
  );
}

function PhoneShell({ videoSrc, reducedMotion }: { videoSrc: string; reducedMotion: boolean }) {
  return (
    <div className="relative rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,#818994_0%,#49515d_36%,#161b22_100%)] p-[7px] shadow-[0_22px_70px_rgba(0,0,0,0.4)]">
      {!reducedMotion && <EdgeGlow color="emerald" />}
      <div className="relative aspect-[19.5/9] overflow-hidden rounded-[24px] bg-[#05070c]">
        <div className="absolute inset-[4px] overflow-hidden rounded-[18px] bg-black">
          <AutoVideo src={videoSrc} className="h-full w-full object-cover object-center brightness-[1.08] contrast-[1.04]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.1),transparent_32%,transparent_70%,rgba(255,255,255,0.08))]" />
        </div>
        <div className="absolute left-[7px] top-1/2 h-[52px] w-[20px] -translate-y-1/2 rounded-full bg-[#05070c]" />
      </div>
      <div className="absolute bottom-[-2px] left-[22%] h-[2px] w-[16%] rounded-full bg-[#8c95a1]" />
      <div className="absolute top-[-2px] left-[26%] h-[2px] w-[10%] rounded-full bg-[#8c95a1]" />
      <div className="absolute top-[-2px] left-[39%] h-[2px] w-[14%] rounded-full bg-[#8c95a1]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Carousel config
// ---------------------------------------------------------------------------

const DEVICES = ["laptop", "tablet", "phone"] as const;
type DeviceType = (typeof DEVICES)[number];

const DEVICE_MAX_W: Record<DeviceType, string> = {
  laptop: "max-w-[760px]",
  tablet: "max-w-[760px]",
  phone: "max-w-[840px]",
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
  const reduced = useReducedMotion() ?? false;
  const [activeIdx, setActiveIdx] = useState(0);

  // Mouse tilt for cinematic hero device (PR03: ±5° desktop, spring return) — 2D CSS only
  const tiltRef = useRef<HTMLDivElement>(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(useTransform(tiltY, [-140, 140], [-5, 5]), APPLE_HOVER_SPRING);
  const rotateY = useSpring(useTransform(tiltX, [-140, 140], [5, -5]), APPLE_HOVER_SPRING); // inverted for natural

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (reduced) return;
    const rect = tiltRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    tiltX.set((e.clientX - cx) * 0.6);
    tiltY.set((e.clientY - cy) * 0.5);
  }, [reduced, tiltX, tiltY]);

  const handlePointerLeave = useCallback(() => {
    if (reduced) return;
    tiltX.set(0);
    tiltY.set(0);
  }, [reduced, tiltX, tiltY]);

  // Continuous auto-rotate — never pauses, never resets
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % DEVICES.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [reduced]);

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
            reducedMotion={reduced}
            side="left"
            onClick={() => handleManual(prevIdx)}
          />
          <PeekDevice
            device={DEVICES[nextIdx]}
            videoSrc={videoSrc}
            reducedMotion={reduced}
            side="right"
            onClick={() => handleManual(nextIdx)}
          />
        </div>
      </div>

      {/* Main carousel (PR03 enhanced: mouse tilt ±5° desktop via useMotionValue+useSpring + APPLE_HOVER_SPRING, reduced-motion instant/no tilt) */}
      <motion.div
        ref={tiltRef}
        className="relative w-full"
        data-testid="hero-device-stage"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          perspective: 1100,
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
        }}
        transition={getTransition(reduced, APPLE_HOVER_SPRING)}
      >
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
      </motion.div>
    </>
  );
}
