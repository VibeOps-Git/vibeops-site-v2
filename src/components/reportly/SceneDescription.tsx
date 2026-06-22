import { Scene } from "./types";

interface SceneDescriptionProps {
  scene: Scene;
  sceneIndex: number;
  isLeft: boolean;
}

export function SceneDescription({ scene, sceneIndex, isLeft }: SceneDescriptionProps) {
  const Icon = scene.icon;

  return (
    <div className={`text-center lg:${isLeft ? "text-left" : "text-right"}`}>
      {/* Step badge */}
      <div className={`inline-flex items-center gap-3 mb-6 ${!isLeft ? "lg:flex-row-reverse" : ""}`}>
        <div className="relative">
          <div className="relative p-3 rounded-xl bg-secondary border border-border">
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </div>
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
            Step {sceneIndex + 1}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
        {scene.title}
      </h3>

      {/* Description */}
      <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
        {scene.description}
      </p>
    </div>
  );
}
