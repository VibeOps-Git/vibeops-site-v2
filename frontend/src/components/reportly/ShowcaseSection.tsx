import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SCENES, getPosition } from "./constants";
import { IPadDevice } from "./IPadDevice";
import { SceneDescription } from "./SceneDescription";

export function ShowcaseSection() {
  const [sceneIndex, setSceneIndex] = useState(0);

  const currentScene = SCENES[sceneIndex];
  const currentPosition = getPosition(sceneIndex);
  const isRight = currentPosition === "right";

  // Rotation based on position
  const rotateZ = isRight ? -6 : 6;

  const goToPrev = () => {
    setSceneIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setSceneIndex((prev) => Math.min(SCENES.length - 1, prev + 1));
  };

  const isFirst = sceneIndex === 0;
  const isLast = sceneIndex === SCENES.length - 1;

  return (
    <section className="min-h-screen flex items-center py-16 md:py-24">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Main content */}
        <div
          className={`flex items-center gap-6 sm:gap-10 md:gap-16 lg:gap-20 transition-all duration-700 ${
            isRight ? "flex-row" : "flex-row-reverse"
          }`}
        >
          {/* Description */}
          <SceneDescription
            scene={currentScene}
            sceneIndex={sceneIndex}
            isLeft={isRight}
          />

          {/* iPad */}
          <IPadDevice
            sceneIndex={sceneIndex}
            rotateZ={rotateZ}
            isRight={isRight}
          />
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-center gap-4 mt-12 md:mt-16">
          <button
            onClick={goToPrev}
            disabled={isFirst}
            className={`p-3 md:p-4 rounded-full border transition-all duration-300 ${
              isFirst
                ? "border-white/10 text-white/20 cursor-not-allowed"
                : "border-[#00ffcc]/30 text-[#00ffcc] hover:bg-[#00ffcc]/10 hover:border-[#00ffcc]/50"
            }`}
            aria-label="Previous step"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Step indicators */}
          <div className="flex items-center gap-2 px-4">
            {SCENES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSceneIndex(i)}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  i === sceneIndex
                    ? "bg-[#00ffcc] scale-125"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={isLast}
            className={`p-3 md:p-4 rounded-full border transition-all duration-300 ${
              isLast
                ? "border-white/10 text-white/20 cursor-not-allowed"
                : "border-[#00ffcc]/30 text-[#00ffcc] hover:bg-[#00ffcc]/10 hover:border-[#00ffcc]/50"
            }`}
            aria-label="Next step"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
