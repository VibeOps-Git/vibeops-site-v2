import { ReactNode } from "react";

interface DeviceMockupProps {
  children: ReactNode;
  className?: string;
}

export function TabletMockup({ children, className = "" }: DeviceMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-[#00ffcc]/20 via-transparent to-[#00ffcc]/10 rounded-[3rem] blur-xl opacity-50" />

      {/* Device frame */}
      <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-[2.5rem] p-3 shadow-2xl border border-white/10">
        {/* Inner bezel */}
        <div className="relative bg-gradient-to-br from-gray-700 to-gray-900 rounded-[2rem] p-1">
          {/* Camera notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-600 border border-gray-500" />

          {/* Screen */}
          <div className="relative bg-[#0a0a0f] rounded-[1.75rem] overflow-hidden">
            {/* Screen reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />

            {/* Content */}
            <div className="relative">
              {children}
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gray-600" />
      </div>
    </div>
  );
}

export function LaptopMockup({ children, className = "" }: DeviceMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-[#00ffcc]/15 via-transparent to-[#00ffcc]/10 rounded-3xl blur-xl opacity-50" />

      {/* Screen portion */}
      <div className="relative">
        {/* Lid/screen frame */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-t-2xl p-2 border border-white/10 border-b-0">
          {/* Camera */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-600" />

          {/* Screen bezel */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg p-0.5">
            {/* Actual screen */}
            <div className="relative bg-[#0a0a0f] rounded-md overflow-hidden">
              {/* Screen reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />

              {/* Content */}
              <div className="relative">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Base/keyboard portion */}
        <div className="relative">
          {/* Hinge */}
          <div className="h-2 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-sm" />

          {/* Keyboard base */}
          <div className="h-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl border border-t-0 border-white/5">
            {/* Trackpad hint */}
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-gray-700/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
