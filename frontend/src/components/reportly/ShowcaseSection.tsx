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
  const rotateZ = isRight ? -4 : 4;

  const goToPrev = () => {
    setSceneIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setSceneIndex((prev) => Math.min(SCENES.length - 1, prev + 1));
  };

  const isFirst = sceneIndex === 0;
  const isLast = sceneIndex === SCENES.length - 1;

  return (
    <section className="min-h-screen flex items-center justify-center py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ffcc]/5 to-transparent pointer-events-none" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ffcc]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ffcc]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            See How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Three simple steps to transform your reporting workflow
          </p>
        </div>

        {/* Main content */}
        <div
          className={`flex items-center gap-8 md:gap-12 lg:gap-20 transition-all duration-700 ${
            isRight ? "flex-col lg:flex-row" : "flex-col lg:flex-row-reverse"
          }`}
        >
          {/* Description - takes less space */}
          <div className="w-full lg:w-2/5">
            <SceneDescription
              scene={currentScene}
              sceneIndex={sceneIndex}
              isLeft={isRight}
            />
          </div>

          {/* iPad - takes more space and is larger */}
          <div className="w-full lg:w-3/5 flex justify-center">
            <IPadDevice
              sceneIndex={sceneIndex}
              rotateZ={rotateZ}
              isRight={isRight}
            />
          </div>
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
          <div className="flex items-center gap-3 px-6">
            {SCENES.map((scene, i) => (
              <button
                key={i}
                onClick={() => setSceneIndex(i)}
                className={`relative transition-all duration-300 ${
                  i === sceneIndex
                    ? "scale-110"
                    : "hover:scale-105"
                }`}
                aria-label={`Go to step ${i + 1}: ${scene.title}`}
              >
                <div
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                    i === sceneIndex
                      ? "bg-[#00ffcc] shadow-lg shadow-[#00ffcc]/50"
                      : i < sceneIndex
                      ? "bg-[#00ffcc]/50"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                />
                {i === sceneIndex && (
                  <div className="absolute -inset-1 border-2 border-[#00ffcc]/30 rounded-full animate-ping" />
                )}
              </button>
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

        {/* Step counter */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-500">
            Step <span className="text-[#00ffcc] font-semibold">{sceneIndex + 1}</span> of {SCENES.length}
          </span>
        </div>
      </div>
    </section>
  );
}
