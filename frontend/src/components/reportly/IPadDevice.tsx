import { IPadScreen } from "./IPadScreen";

interface IPadDeviceProps {
  sceneIndex: number;
  rotateZ: number;
  isRight: boolean;
}

export function IPadDevice({ sceneIndex, rotateZ, isRight }: IPadDeviceProps) {
  return (
    <div
      className="flex-shrink-0 relative transition-transform duration-700 ease-out"
      style={{
        transform: `rotateZ(${rotateZ}deg)`,
        transformOrigin: isRight ? "bottom right" : "bottom left",
      }}
    >
      {/* Glow */}
      <div className="absolute -inset-6 sm:-inset-10 bg-gradient-to-br from-[#00ffcc]/20 via-transparent to-[#00ffcc]/10 rounded-[2rem] sm:rounded-[3rem] blur-2xl opacity-50" />

      {/* iPad Frame */}
      <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-[1.5rem] sm:rounded-[2rem] p-1.5 sm:p-2 shadow-2xl border border-white/10">
        <div className="relative bg-gradient-to-br from-gray-700 to-gray-900 rounded-[1.25rem] sm:rounded-[1.5rem] p-1">
          {/* Camera */}
          <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-600 border border-gray-500" />

          {/* Screen - Portrait orientation */}
          <div className="relative bg-[#0a0a0f] rounded-[1rem] sm:rounded-[1.25rem] overflow-hidden w-[220px] h-[330px] sm:w-[300px] sm:h-[450px] md:w-[340px] md:h-[510px]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />
            <IPadScreen sceneIndex={sceneIndex} />
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-0.5 sm:h-1 rounded-full bg-gray-600" />
      </div>
    </div>
  );
}
