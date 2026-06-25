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
      {/* iPad Frame - matches the homepage device frame: clean aluminium, thin uniform bezel */}
      <div
        className="relative rounded-[1.9rem] sm:rounded-[2.1rem] border border-white/12 p-2.5 sm:p-3 shadow-[0_30px_90px_rgba(0,0,0,0.42)]"
        style={{ background: "linear-gradient(180deg,#7f8792 0%,#49525d 40%,#1a2027 100%)" }}
      >
        {/* Front camera dot */}
        <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black/50 ring-1 ring-white/10 z-10" />

        {/* Screen */}
        <div className="relative bg-[#0a0a0f] rounded-[1.4rem] sm:rounded-[1.55rem] overflow-hidden w-[236px] h-[348px] sm:w-[248px] sm:h-[372px] md:w-[280px] md:h-[404px] lg:w-[320px] lg:h-[480px] xl:w-[420px] xl:h-[630px]">
          <div className="relative w-full h-full">
            <IPadScreen sceneIndex={sceneIndex} launchProgress={launchProgress} />
          </div>
        </div>
      </div>
    </div>
  );
}
