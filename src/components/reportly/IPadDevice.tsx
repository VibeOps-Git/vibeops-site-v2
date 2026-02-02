import { IPadScreen } from "./IPadScreen";

interface IPadDeviceProps {
  sceneIndex: number;
  rotateZ: number;
  isRight: boolean;
  launchProgress?: number;
}

export function IPadDevice({ sceneIndex, rotateZ, isRight, launchProgress }: IPadDeviceProps) {
  return (
    <div
      className="flex-shrink-0 relative will-change-transform"
      style={{
        transform: `rotateZ(${rotateZ}deg)`,
        transformOrigin: isRight ? "bottom right" : "bottom left",
        transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      {/* Large glow effect */}
      <div
        className="absolute -inset-8 sm:-inset-12 md:-inset-16 bg-gradient-to-br from-[#00ffcc]/30 via-[#00ffcc]/10 to-transparent rounded-[3rem] sm:rounded-[4rem] blur-3xl opacity-60"
        style={{ transition: "all 0.6s ease-out" }}
      />

      {/* Secondary glow */}
      <div className="absolute -inset-4 sm:-inset-8 bg-[#00ffcc]/20 rounded-[2rem] sm:rounded-[3rem] blur-2xl animate-pulse" />

      {/* iPad Frame */}
      <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-[1.75rem] sm:rounded-[2.5rem] md:rounded-[3rem] p-2 sm:p-3 shadow-2xl border border-white/10">
        <div className="relative bg-gradient-to-br from-gray-700 to-gray-900 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-1.5 sm:p-2">
          {/* Camera */}
          <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-600 border border-gray-500" />

          {/* Screen */}
          <div className="relative bg-[#0a0a0f] rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[2rem] overflow-hidden w-[180px] h-[270px] sm:w-[280px] sm:h-[420px] md:w-[380px] md:h-[570px] lg:w-[420px] lg:h-[630px]">
            {/* Screen glare */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none z-10" />

            {/* Screen edge highlight */}
            <div className="absolute inset-0 border border-white/5 rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[2rem] pointer-events-none z-10" />

            {/* Screen content with crossfade */}
            <div className="relative w-full h-full">
              <IPadScreen sceneIndex={sceneIndex} launchProgress={launchProgress} />
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 w-16 sm:w-20 md:w-24 h-1 sm:h-1.5 rounded-full bg-gray-600" />
      </div>

      {/* Reflection */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-gradient-to-t from-[#00ffcc]/10 to-transparent blur-2xl opacity-50" />
    </div>
  );
}
