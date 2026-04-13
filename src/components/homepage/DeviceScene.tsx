import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

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
      try {
        await video.play();
      } catch {
        // Ignore autoplay rejection.
      }
    };

    if (video.readyState >= 2) {
      void playVideo();
    } else {
      video.addEventListener("loadeddata", playVideo, { once: true });
    }

    return () => video.removeEventListener("loadeddata", playVideo);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={className}
    />
  );
}


function LaptopDevice({ videoSrc, reducedMotion }: { videoSrc: string; reducedMotion: boolean }) {
  return (
    <motion.div
      className="relative z-20 w-full max-w-[1320px]"
      initial={reducedMotion ? false : { opacity: 0, y: 26, rotateX: 22, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
    >
      <motion.div
        className="relative"
        animate={reducedMotion ? undefined : { y: [0, -8, 0], rotateZ: [0, -0.35, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative rounded-[28px] border border-white/16 bg-[linear-gradient(180deg,#dbe2ea_0%,#9da6b1_20%,#4d5662_56%,#1b212a_100%)] p-[10px] shadow-[0_40px_120px_rgba(0,0,0,0.4)]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#05070c]">
            <div className="absolute inset-[10px] overflow-hidden rounded-[14px] bg-black">
              <AutoVideo
                src={videoSrc}
                className="h-full w-full scale-[1.06] object-cover object-top brightness-[1.12] contrast-[1.06]"
              />
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
    </motion.div>
  );
}

function TabletDevice({
  videoSrc,
  reducedMotion,
  translateX,
  translateY,
  rotateZ,
}: {
  videoSrc: string;
  reducedMotion: boolean;
  translateX: ReturnType<typeof useSpring>;
  translateY: ReturnType<typeof useSpring>;
  rotateZ: ReturnType<typeof useSpring>;
}) {
  return (
    <motion.div
      className="absolute bottom-[0%] right-[-8%] z-30 hidden w-[34%] min-w-[260px] max-w-[400px] md:block xl:right-[-5%]"
      initial={reducedMotion ? false : { opacity: 0, x: 36, y: 26, rotateZ: 2, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, y: 0, rotateZ: -8, scale: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.66, delay: reducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ x: translateX, y: translateY, rotateZ }}
    >
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -10, 0], rotateZ: [-8, -6.5, -8] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative rounded-[34px] border border-white/12 bg-[linear-gradient(180deg,#7f8792_0%,#49525d_40%,#1a2027_100%)] p-[12px] shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#05070c]">
            <div className="absolute inset-[10px] overflow-hidden rounded-[18px] bg-black">
              <AutoVideo
                src={videoSrc}
                className="h-full w-full scale-[1.08] object-cover object-center brightness-[1.1] contrast-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.09),transparent_36%,transparent_68%,rgba(255,255,255,0.08))]" />
            </div>

            <div className="absolute left-1/2 top-[8px] h-[10px] w-[10px] -translate-x-1/2 rounded-full bg-[#151a22] ring-1 ring-white/10" />
          </div>

          <div className="absolute left-[-3px] top-[24%] h-[12%] w-[3px] rounded-full bg-[#8e96a2]" />
          <div className="absolute left-[-3px] top-[39%] h-[18%] w-[3px] rounded-full bg-[#8e96a2]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function PhoneDevice({
  videoSrc,
  reducedMotion,
  translateX,
  translateY,
  rotateZ,
}: {
  videoSrc: string;
  reducedMotion: boolean;
  translateX: ReturnType<typeof useSpring>;
  translateY: ReturnType<typeof useSpring>;
  rotateZ: ReturnType<typeof useSpring>;
}) {
  return (
    <motion.div
      className="absolute bottom-[2%] left-[-6%] z-40 hidden w-[17%] min-w-[140px] max-w-[200px] md:block lg:left-[-4%]"
      initial={reducedMotion ? false : { opacity: 0, x: -28, y: 18, rotateZ: -11, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, rotateZ: 9, scale: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.64, delay: reducedMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
      style={{ x: translateX, y: translateY, rotateZ }}
    >
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -7, 0], rotateZ: [9, 11, 9] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,#818994_0%,#49515d_36%,#161b22_100%)] p-[7px] shadow-[0_22px_70px_rgba(0,0,0,0.4)]">
          <div className="relative aspect-[9/19.5] overflow-hidden rounded-[24px] bg-[#05070c]">
            <div className="absolute inset-[6px] overflow-hidden rounded-[18px] bg-black">
              <AutoVideo
                src={videoSrc}
                className="h-full w-full scale-[1.1] object-cover object-top brightness-[1.08] contrast-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.1),transparent_32%,transparent_70%,rgba(255,255,255,0.08))]" />
            </div>

            <div className="absolute left-1/2 top-[7px] h-[20px] w-[52px] -translate-x-1/2 rounded-full bg-[#05070c]" />
          </div>

          <div className="absolute right-[-2px] top-[22%] h-[16%] w-[2px] rounded-full bg-[#8c95a1]" />
          <div className="absolute left-[-2px] top-[26%] h-[10%] w-[2px] rounded-full bg-[#8c95a1]" />
          <div className="absolute left-[-2px] top-[39%] h-[14%] w-[2px] rounded-full bg-[#8c95a1]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HomepageDeviceStage({ videoSrc }: { videoSrc: string }) {
  const reducedMotion = Boolean(useReducedMotion());
  const stageRef = useRef<HTMLDivElement | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const tabletX = useSpring(pointerX, { stiffness: 110, damping: 20, mass: 0.5 });
  const tabletY = useSpring(pointerY, { stiffness: 110, damping: 20, mass: 0.5 });
  const phoneX = useSpring(useMotionValue(0), { stiffness: 115, damping: 18, mass: 0.45 });
  const phoneY = useSpring(useMotionValue(0), { stiffness: 115, damping: 18, mass: 0.45 });
  const tabletRotate = useSpring(useMotionValue(-8), { stiffness: 120, damping: 20, mass: 0.45 });
  const phoneRotate = useSpring(useMotionValue(9), { stiffness: 120, damping: 20, mass: 0.45 });
  const sceneRotate = useSpring(useMotionValue(0), { stiffness: 90, damping: 18, mass: 0.55 });

  const sceneTransform = useMotionTemplate`perspective(1400px) rotateY(${sceneRotate}deg)`;

  useEffect(() => {
    if (reducedMotion) {
      pointerX.set(0);
      pointerY.set(0);
      tabletRotate.set(-8);
      phoneRotate.set(9);
      sceneRotate.set(0);
    }
  }, [phoneRotate, pointerX, pointerY, reducedMotion, sceneRotate, tabletRotate]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    pointerX.set(x * 18);
    pointerY.set(y * 14);
    phoneX.set(x * -22);
    phoneY.set(y * -16);
    tabletRotate.set(-8 + x * 7);
    phoneRotate.set(9 + x * 10);
    sceneRotate.set(x * -4);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
    phoneX.set(0);
    phoneY.set(0);
    tabletRotate.set(-8);
    phoneRotate.set(9);
    sceneRotate.set(0);
  };

  return (
    <div
      ref={stageRef}
      className="relative w-full"
      data-testid="hero-device-stage"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="absolute inset-x-[6%] bottom-[2.5%] h-[17%] rounded-full bg-black/35 blur-3xl md:inset-x-[8%] md:bottom-[5%]" />

      <div className="relative flex items-center justify-center px-2 sm:px-4 md:px-0">
        <motion.div className="relative w-full max-w-[1480px] md:ml-4 md:mt-2 lg:ml-8 lg:mt-0 xl:ml-12 xl:mt-0" style={{ transform: sceneTransform }}>
          <LaptopDevice videoSrc={videoSrc} reducedMotion={reducedMotion} />
          <TabletDevice
            videoSrc={videoSrc}
            reducedMotion={reducedMotion}
            translateX={tabletX}
            translateY={tabletY}
            rotateZ={tabletRotate}
          />
          <PhoneDevice
            videoSrc={videoSrc}
            reducedMotion={reducedMotion}
            translateX={phoneX}
            translateY={phoneY}
            rotateZ={phoneRotate}
          />
        </motion.div>
      </div>
    </div>
  );
}
