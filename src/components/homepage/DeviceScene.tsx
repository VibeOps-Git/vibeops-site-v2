import "devices.css/dist/devices.min.css";
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

// ---------------------------------------------------------------------------
// Device shells — using devices.css for iPhone & iPad, custom for rugged laptop
// ---------------------------------------------------------------------------

/** iPhone 14 Pro — landscape via CSS rotation. devices.css provides the
 *  accurate frame, Dynamic Island, buttons, and all hardware details. */
function PhoneShell({ videoSrc }: { videoSrc: string }) {
  return (
    <div className="flex items-center justify-center" style={{ transform: "rotate(-90deg) scale(0.52)", transformOrigin: "center center" }}>
      <div className="device device-iphone-14-pro">
        <div className="device-frame">
          <AutoVideo src={videoSrc} className="device-screen" />
        </div>
        <div className="device-stripe" />
        <div className="device-header" />
        <div className="device-sensors" />
        <div className="device-btns" />
        <div className="device-power" />
      </div>
    </div>
  );
}

/** iPad Pro — devices.css provides accurate bezels, camera, and buttons. */
function TabletShell({ videoSrc }: { videoSrc: string }) {
  return (
    <div className="flex items-center justify-center" style={{ transform: "scale(0.72)", transformOrigin: "center center" }}>
      <div className="device device-ipad-pro">
        <div className="device-frame">
          <AutoVideo src={videoSrc} className="device-screen" />
        </div>
        <div className="device-stripe" />
        <div className="device-header" />
        <div className="device-sensors" />
        <div className="device-btns" />
        <div className="device-power" />
      </div>
    </div>
  );
}

/** Rugged field laptop — Toughbook / Dell Latitude Rugged style.
 *  Thick bezels, reinforced corners, industrial aesthetic, rubber bumpers. */
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
        {/* === SCREEN / LID === */}
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: "10px 10px 3px 3px",
            border: "6px solid #2d3038",
            background: "linear-gradient(180deg, #393d44 0%, #2d3038 30%, #22252b 100%)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Rubber bumper corners */}
          <div className="absolute top-0 left-0 w-[18px] h-[18px] rounded-br-[8px] bg-[#1a1c20] z-10" />
          <div className="absolute top-0 right-0 w-[18px] h-[18px] rounded-bl-[8px] bg-[#1a1c20] z-10" />
          <div className="absolute bottom-0 left-0 w-[14px] h-[14px] rounded-tr-[6px] bg-[#1a1c20] z-10" />
          <div className="absolute bottom-0 right-0 w-[14px] h-[14px] rounded-tl-[6px] bg-[#1a1c20] z-10" />

          {/* Thick bezel area */}
          <div className="p-[14px]">
            {/* Webcam */}
            <div className="flex justify-center mb-[6px]">
              <div className="w-[8px] h-[8px] rounded-full bg-[#15171b] border border-[#3a3d44]" />
            </div>
            {/* Screen */}
            <div
              className="relative overflow-hidden bg-black"
              style={{ aspectRatio: "16 / 10", borderRadius: 4, border: "2px solid #15171b" }}
            >
              <AutoVideo src={videoSrc} className="h-full w-full object-cover object-center" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.03)_0%,transparent_40%)]" />
            </div>
            {/* Model label under screen */}
            <div className="flex justify-center mt-[6px]">
              <span className="text-[7px] font-bold tracking-[0.25em] uppercase text-white/12 select-none">Toughbook</span>
            </div>
          </div>

          {/* Latch notch at bottom center */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40px] h-[5px] rounded-t-[3px] bg-[#1a1c20]" />
        </div>

        {/* === HINGE === */}
        <div
          className="relative mx-auto -mt-px w-[96%]"
          style={{
            height: 8,
            background: "linear-gradient(180deg, #1a1c20 0%, #2d3038 100%)",
            borderRadius: "0 0 3px 3px",
          }}
        >
          {/* Hinge barrels */}
          <div className="absolute top-0 left-[15%] w-[12%] h-full rounded-b-[2px] bg-[#3a3d44]" />
          <div className="absolute top-0 left-[44%] w-[12%] h-full rounded-b-[2px] bg-[#3a3d44]" />
          <div className="absolute top-0 left-[73%] w-[12%] h-full rounded-b-[2px] bg-[#3a3d44]" />
        </div>

        {/* === BASE / KEYBOARD DECK === */}
        <div
          className="relative mx-auto w-[102%] -ml-[1%] overflow-hidden"
          style={{
            height: "clamp(50px, 5vw, 70px)",
            borderRadius: "0 0 10px 10px",
            border: "6px solid #2d3038",
            borderTop: "none",
            background: "linear-gradient(180deg, #22252b 0%, #2d3038 40%, #393d44 100%)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
          }}
        >
          {/* Rubber bumper corners on base */}
          <div className="absolute bottom-0 left-0 w-[18px] h-[18px] rounded-tr-[8px] bg-[#1a1c20] z-10" />
          <div className="absolute bottom-0 right-0 w-[18px] h-[18px] rounded-tl-[8px] bg-[#1a1c20] z-10" />

          {/* Keyboard area */}
          <div className="absolute inset-x-[8%] top-[15%] bottom-[30%] rounded-[3px] bg-[#15171b] border border-[#3a3d44]/30 overflow-hidden">
            {/* Key rows */}
            <div className="grid grid-rows-3 gap-[2px] p-[4px] h-full">
              <div className="grid grid-cols-14 gap-[2px]">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="rounded-[1px] bg-[#2a2d33]" />
                ))}
              </div>
              <div className="grid grid-cols-13 gap-[2px]">
                {Array.from({ length: 13 }).map((_, i) => (
                  <div key={i} className="rounded-[1px] bg-[#2a2d33]" />
                ))}
              </div>
              <div className="grid grid-cols-12 gap-[2px]">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-[1px] bg-[#2a2d33]" />
                ))}
                <div className="col-span-6 rounded-[1px] bg-[#2a2d33]" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`r${i}`} className="rounded-[1px] bg-[#2a2d33]" />
                ))}
              </div>
            </div>
          </div>

          {/* Trackpad */}
          <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[18%] h-[20%] rounded-[3px] bg-[#1e2025] border border-[#3a3d44]/25" />

          {/* Status LEDs */}
          <div className="absolute top-[18%] right-[5%] flex gap-[4px]">
            <div className="w-[4px] h-[4px] rounded-full bg-emerald-500/40" />
            <div className="w-[4px] h-[4px] rounded-full bg-amber-500/25" />
          </div>
        </div>

        {/* Contact shadow */}
        <div className="mx-auto h-[5px] w-[90%] rounded-b-full bg-black/20 blur-[4px]" />
      </motion.div>
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
// Shell dispatcher & peek devices
// ---------------------------------------------------------------------------

function DeviceShellByType({ device, videoSrc, reducedMotion }: { device: DeviceType; videoSrc: string; reducedMotion: boolean }) {
  if (device === "laptop") return <LaptopShell videoSrc={videoSrc} reducedMotion={reducedMotion} />;
  if (device === "tablet") return <TabletShell videoSrc={videoSrc} />;
  return <PhoneShell videoSrc={videoSrc} />;
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

  const prevIdx = (activeIdx - 1 + DEVICES.length) % DEVICES.length;
  const nextIdx = (activeIdx + 1) % DEVICES.length;

  return (
    <>
      {/* Peek devices — spans full viewport width */}
      <div
        className="pointer-events-none absolute inset-y-0 z-[5] hidden md:block"
        style={{ width: "100vw", left: "50%", transform: "translateX(-50%)" }}
      >
        <div className="relative h-full w-full">
          <PeekDevice device={DEVICES[prevIdx]} videoSrc={videoSrc} reducedMotion={reducedMotion} side="left" onClick={() => handleManual(prevIdx)} />
          <PeekDevice device={DEVICES[nextIdx]} videoSrc={videoSrc} reducedMotion={reducedMotion} side="right" onClick={() => handleManual(nextIdx)} />
        </div>
      </div>

      {/* Main carousel */}
      <div className="relative w-full" data-testid="hero-device-stage">
        <div className="absolute inset-x-[15%] bottom-0 h-[18%] rounded-full bg-black/25 blur-3xl" />

        <div className="relative flex items-center justify-center">
          {DEVICES.map((device, i) => {
            const isActive = i === activeIdx;
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
