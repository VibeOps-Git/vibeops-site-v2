import { Scene } from "./types";

interface SceneDescriptionProps {
  scene: Scene;
  sceneIndex: number;
  isLeft: boolean;
}

export function SceneDescription({ scene, sceneIndex, isLeft }: SceneDescriptionProps) {
  const Icon = scene.icon;

  return (
    <div className={`${isLeft ? "text-left" : "text-right lg:text-right"}`}>
      {/* Step badge */}
      <div className={`inline-flex items-center gap-3 mb-6 ${!isLeft ? "flex-row-reverse" : ""}`}>
        <div className="relative">
          <div className="absolute inset-0 bg-[#00ffcc]/30 rounded-xl blur-lg" />
          <div className="relative p-3 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/30">
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-[#00ffcc]" />
          </div>
        </div>
        <div className={`${isLeft ? "text-left" : "text-right"}`}>
          <span className="text-xs uppercase tracking-[0.2em] text-[#00ffcc] font-medium">
            Step {sceneIndex + 1}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
        {scene.title}
      </h3>

      {/* Description */}
      <p className="text-base md:text-lg lg:text-xl text-gray-400 leading-relaxed max-w-md">
        {scene.description}
      </p>

      {/* Feature highlights based on step */}
      <div className={`mt-8 space-y-3 ${!isLeft ? "ml-auto" : ""}`}>
        {getStepFeatures(sceneIndex).map((feature, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 text-sm text-gray-500 ${
              !isLeft ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ffcc]" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStepFeatures(index: number): string[] {
  const features = [
    ["Word & Excel support", "Preserves your formatting", "Auto-detects tables"],
    ["Smart data mapping", "Consistent styling", "Real-time preview"],
    ["Export to PDF", "Share via link", "Version history"],
  ];
  return features[index] || [];
}
