import { Scene } from "./types";
import { SCENES } from "./constants";

interface SceneDescriptionProps {
  scene: Scene;
  sceneIndex: number;
  isLeft: boolean;
}

export function SceneDescription({ scene, sceneIndex, isLeft }: SceneDescriptionProps) {
  const Icon = scene.icon;

  return (
    <div className={`flex-1 min-w-0 ${isLeft ? "text-left" : "text-right"}`}>
      {/* Step indicator */}
      <div className={`flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 ${!isLeft ? "justify-end" : ""}`}>
        <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/20">
          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-[#00ffcc]" />
        </div>
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#00ffcc]">
          Step {sceneIndex + 1} of {SCENES.length}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 transition-all duration-500">
        {scene.title}
      </h2>

      {/* Description */}
      <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-4 sm:mb-6 leading-relaxed transition-all duration-500">
        {scene.description}
      </p>

      {/* Progress dots */}
      <div className={`flex gap-2 ${!isLeft ? "justify-end" : ""}`}>
        {SCENES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
              i === sceneIndex
                ? "bg-[#00ffcc] scale-125"
                : i < sceneIndex
                  ? "bg-[#00ffcc]/50"
                  : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
