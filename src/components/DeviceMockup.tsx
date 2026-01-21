import { ReactNode, useRef, useEffect, useState } from "react";

// =============================================================================
// Types
// =============================================================================

interface DeviceMockupProps {
  children: ReactNode;
  className?: string;
}

interface InteractiveTabletProps {
  /** Render prop that receives scroll progress (0-1) */
  children: ReactNode | ((progress: number) => ReactNode);
  className?: string;
  /** Scale range [min, max] based on scroll progress */
  scaleRange?: [number, number];
  /** Rotation range in degrees [min, max] for subtle 3D effect */
  rotateRange?: [number, number];
}

// =============================================================================
// Hooks
// =============================================================================

function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress: 0 when element enters viewport, 1 when it leaves
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Start tracking when element is 20% into viewport
      const startPoint = windowHeight * 0.8;
      // End when element center passes viewport center
      const endPoint = windowHeight * 0.3;

      const rawProgress = (startPoint - elementTop) / (startPoint - endPoint);
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      setProgress(clampedProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return progress;
}

// =============================================================================
// Device Frame Components
// =============================================================================

function TabletFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-[2.5rem] p-3 shadow-2xl border border-white/10">
      {/* Inner bezel */}
      <div className="relative bg-gradient-to-br from-gray-700 to-gray-900 rounded-[2rem] p-1">
        {/* Camera */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-600 border border-gray-500" />

        {/* Screen */}
        <div className="relative bg-[#0a0a0f] rounded-[1.75rem] overflow-hidden">
          {/* Screen reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />
          {children}
        </div>
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gray-600" />
    </div>
  );
}

function DeviceGlow({ intensity = 0.5 }: { intensity?: number }) {
  return (
    <div
      className="absolute -inset-4 bg-gradient-to-br from-[#00ffcc]/20 via-transparent to-[#00ffcc]/10 rounded-[3rem] blur-xl transition-opacity duration-300"
      style={{ opacity: intensity }}
    />
  );
}

// =============================================================================
// Static Tablet (No interactions)
// =============================================================================

export function TabletMockup({ children, className = "" }: DeviceMockupProps) {
  return (
    <div className={`relative ${className}`}>
      <DeviceGlow />
      <TabletFrame>{children}</TabletFrame>
    </div>
  );
}

// =============================================================================
// Interactive Tablet with Scroll-based Animations
// =============================================================================

export function InteractiveTablet({
  children,
  className = "",
  scaleRange = [0.85, 1],
  rotateRange = [3, 0],
}: InteractiveTabletProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(containerRef);

  // Interpolate values based on scroll progress
  const scale = scaleRange[0] + (scaleRange[1] - scaleRange[0]) * progress;
  const rotateX = rotateRange[0] + (rotateRange[1] - rotateRange[0]) * progress;
  const glowIntensity = 0.3 + progress * 0.4;

  return (
    <div
      ref={containerRef}
      className={`relative perspective-1000 ${className}`}
      style={{ perspective: "1000px" }}
    >
      <div
        className="transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${scale}) rotateX(${rotateX}deg)`,
          transformOrigin: "center center",
        }}
      >
        <DeviceGlow intensity={glowIntensity} />
        <TabletFrame>
          {typeof children === "function" ? children(progress) : children}
        </TabletFrame>
      </div>
    </div>
  );
}

// =============================================================================
// Laptop Mockup
// =============================================================================

export function LaptopMockup({ children, className = "" }: DeviceMockupProps) {
  return (
    <div className={`relative ${className}`}>
      <DeviceGlow intensity={0.4} />

      {/* Screen portion */}
      <div className="relative">
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-t-2xl p-2 border border-white/10 border-b-0">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-600" />

          <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg p-0.5">
            <div className="relative bg-[#0a0a0f] rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />
              {children}
            </div>
          </div>
        </div>

        {/* Base */}
        <div className="h-2 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-sm" />
        <div className="h-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl border border-t-0 border-white/5">
          <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-gray-700/50" />
        </div>
      </div>
    </div>
  );
}
