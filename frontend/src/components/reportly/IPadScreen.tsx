import { FileText } from "lucide-react";
import { Scene } from "./types";
import { SCENES } from "./constants";

interface IPadScreenProps {
  sceneIndex: number;
}

export function IPadScreen({ sceneIndex }: IPadScreenProps) {
  const scene: Scene = SCENES[sceneIndex];
  const Icon = scene.icon;

  return (
    <div className="w-full h-full p-4 sm:p-6 bg-gradient-to-br from-[#0f1115] to-[#0a0a0f] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-[#00ffcc]/10">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#00ffcc]" />
          </div>
          <span className="text-sm sm:text-base font-semibold text-white">Reportly</span>
        </div>
        <div className="px-2 sm:px-3 py-1 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/20">
          <span className="text-[10px] sm:text-xs text-[#00ffcc]">
            {sceneIndex + 1}/{SCENES.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
        <div className="p-4 sm:p-6 rounded-2xl bg-[#00ffcc]/5 border border-[#00ffcc]/20 mb-3 sm:mb-4 transition-all duration-500">
          <Icon className="w-10 h-10 sm:w-14 sm:h-14 text-[#00ffcc]" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{scene.title}</h3>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{scene.description}</p>
      </div>

      {/* Progress */}
      <div className="mt-auto pt-4">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00ffcc] transition-all duration-500"
            style={{ width: `${((sceneIndex + 1) / SCENES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
