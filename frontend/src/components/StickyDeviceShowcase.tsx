import { useRef, useEffect, useState, ReactNode } from "react";

// =============================================================================
// Types
// =============================================================================

interface Scene {
  id: string;
  label: string;
}

interface StickyDeviceShowcaseProps {
  scenes: Scene[];
  children: (sceneIndex: number, sceneProgress: number) => ReactNode;
  className?: string;
}

// =============================================================================
// Hook: useScrollScenes
// =============================================================================

function useScrollScenes(containerRef: React.RefObject<HTMLElement | null>, sceneCount: number) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [deviceScale, setDeviceScale] = useState(0.85);
  const [deviceRotateX, setDeviceRotateX] = useState(8);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Total scrollable distance within container
      const scrollableHeight = containerHeight - viewportHeight;

      // Current scroll position relative to container top
      const scrolled = -rect.top;

      // Overall progress through the container (0 to 1)
      const overallProgress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      // Divide progress into scenes
      const progressPerScene = 1 / sceneCount;
      const currentScene = Math.min(sceneCount - 1, Math.floor(overallProgress / progressPerScene));
      const progressInScene = (overallProgress - (currentScene * progressPerScene)) / progressPerScene;

      setSceneIndex(currentScene);
      setSceneProgress(Math.max(0, Math.min(1, progressInScene)));

      // Device transforms based on overall progress
      // Start small/tilted, grow to full size as user scrolls
      const scale = 0.85 + (overallProgress * 0.15);
      const rotateX = 8 - (overallProgress * 8);

      setDeviceScale(scale);
      setDeviceRotateX(rotateX);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [containerRef, sceneCount]);

  return { sceneIndex, sceneProgress, deviceScale, deviceRotateX };
}

// =============================================================================
// Sub-components
// =============================================================================

function DeviceFrame({ children, scale, rotateX }: { children: ReactNode; scale: number; rotateX: number }) {
  return (
    <div className="relative mx-auto max-w-3xl" style={{ perspective: "1200px" }}>
      <div
        className="transition-transform duration-150 ease-out"
        style={{
          transform: `scale(${scale}) rotateX(${rotateX}deg)`,
          transformOrigin: "center center",
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute -inset-6 bg-gradient-to-br from-[#00ffcc]/20 via-transparent to-[#00ffcc]/10 rounded-[3rem] blur-2xl transition-opacity duration-300"
          style={{ opacity: 0.3 + scale * 0.4 }}
        />

        {/* iPad frame */}
        <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-[2.5rem] p-3 shadow-2xl border border-white/10">
          {/* Inner bezel */}
          <div className="relative bg-gradient-to-br from-gray-700 to-gray-900 rounded-[2rem] p-1">
            {/* Camera */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-600 border border-gray-500 z-20" />

            {/* Screen - the content container */}
            <div className="relative bg-[#0a0a0f] rounded-[1.75rem] overflow-hidden">
              {/* Screen reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />
              {/* Content wrapper */}
              <div className="relative z-0">
                {children}
              </div>
            </div>
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gray-600" />
        </div>
      </div>
    </div>
  );
}

function SceneIndicators({ scenes, activeIndex, progress }: { scenes: Scene[]; activeIndex: number; progress: number }) {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
      {scenes.map((scene, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;

        return (
          <div key={scene.id} className="flex items-center gap-3">
            {/* Indicator dot */}
            <div className="relative">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive ? "bg-[#00ffcc] scale-125" : isPast ? "bg-[#00ffcc]/50" : "bg-white/20"
                }`}
              />
              {isActive && (
                <div
                  className="absolute inset-0 rounded-full bg-[#00ffcc] animate-ping opacity-50"
                  style={{ animationDuration: "2s" }}
                />
              )}
            </div>

            {/* Label - only show on active */}
            <span
              className={`text-xs uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                isActive ? "opacity-100 text-[#00ffcc]" : "opacity-0"
              }`}
            >
              {scene.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function StickyDeviceShowcase({ scenes, children, className = "" }: StickyDeviceShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { sceneIndex, sceneProgress, deviceScale, deviceRotateX } = useScrollScenes(containerRef, scenes.length);

  // Height multiplier for scroll space per scene
  const heightPerScene = 100; // vh per scene

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: `${scenes.length * heightPerScene}vh` }}
    >
      {/* Sticky container for device - fills viewport below navbar */}
      <div className="sticky top-0 h-screen flex items-center justify-center px-4 md:px-8 lg:px-16">
        <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center">
          {/* Scene indicators (desktop only) */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-8">
            <SceneIndicators scenes={scenes} activeIndex={sceneIndex} progress={sceneProgress} />
          </div>

          {/* Device */}
          <DeviceFrame scale={deviceScale} rotateX={deviceRotateX}>
            {children(sceneIndex, sceneProgress)}
          </DeviceFrame>
        </div>

        {/* Mobile scene indicator - fixed at bottom */}
        <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {scenes.map((scene, i) => (
            <div
              key={scene.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === sceneIndex ? "bg-[#00ffcc] scale-125" : i < sceneIndex ? "bg-[#00ffcc]/50" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StickyDeviceShowcase;
