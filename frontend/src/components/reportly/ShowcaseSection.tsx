import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SCENES, getPosition } from "./constants";
import { IPadDevice } from "./IPadDevice";
import { SceneDescription } from "./SceneDescription";

export function ShowcaseSection() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastStepChange = useRef(0);
  const stepCooldown = 500;

  // Handle step change animation
  useEffect(() => {
    if (sceneIndex !== displayIndex) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayIndex(sceneIndex);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [sceneIndex, displayIndex]);

  // Wheel navigation when section is in view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if section is mostly visible
      const isVisible = rect.top < viewportHeight * 0.3 && rect.bottom > viewportHeight * 0.7;
      if (!isVisible) return;

      const now = Date.now();
      if (now - lastStepChange.current < stepCooldown) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      if (scrollingDown && sceneIndex < SCENES.length - 1) {
        setSceneIndex(prev => prev + 1);
        lastStepChange.current = now;
      } else if (scrollingUp && sceneIndex > 0) {
        setSceneIndex(prev => prev - 1);
        lastStepChange.current = now;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isVisible = rect.top < viewportHeight * 0.3 && rect.bottom > viewportHeight * 0.7;
      if (!isVisible) return;

      const now = Date.now();
      if (now - lastStepChange.current < stepCooldown) return;

      if ((e.key === "ArrowDown" || e.key === "ArrowRight") && sceneIndex < SCENES.length - 1) {
        setSceneIndex(prev => prev + 1);
        lastStepChange.current = now;
      } else if ((e.key === "ArrowUp" || e.key === "ArrowLeft") && sceneIndex > 0) {
        setSceneIndex(prev => prev - 1);
        lastStepChange.current = now;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sceneIndex]);

  const goToPrev = () => {
    if (sceneIndex > 0) {
      setSceneIndex(prev => prev - 1);
      lastStepChange.current = Date.now();
    }
  };

  const goToNext = () => {
    if (sceneIndex < SCENES.length - 1) {
      setSceneIndex(prev => prev + 1);
      lastStepChange.current = Date.now();
    }
  };

  const currentScene = SCENES[displayIndex];
  const currentPosition = getPosition(displayIndex);
  const isRight = currentPosition === "right";
  const rotateZ = isRight ? -4 : 4;

  const transitionOpacity = isTransitioning ? 0 : 1;
  const transitionY = isTransitioning ? 15 : 0;

  const isFirst = sceneIndex === 0;
  const isLast = sceneIndex === SCENES.length - 1;

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center py-16 md:py-24 bg-[#0a0a0f] relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ffcc]/5 to-transparent pointer-events-none" />

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ffcc]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ffcc]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            See How It Works
          </h2>
          <p className="text-gray-400 text-base lg:text-lg max-w-2xl mx-auto">
            Three simple steps to transform your reporting workflow
          </p>
        </div>

        {/* Main content */}
        <div
          className={`flex items-center gap-8 md:gap-12 lg:gap-20 ${
            isRight ? "flex-col lg:flex-row" : "flex-col lg:flex-row-reverse"
          }`}
          style={{ transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
        >
          {/* Description */}
          <div
            className="w-full lg:w-2/5 order-2 lg:order-none"
            style={{
              opacity: transitionOpacity,
              transform: `translateY(${transitionY}px)`,
              transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
            }}
          >
            <SceneDescription
              scene={currentScene}
              sceneIndex={displayIndex}
              isLeft={isRight}
            />
          </div>

          {/* iPad */}
          <div
            className="w-full lg:w-3/5 flex justify-center order-1 lg:order-none"
            style={{ transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
          >
            <IPadDevice
              sceneIndex={displayIndex}
              rotateZ={rotateZ}
              isRight={isRight}
            />
          </div>
        </div>

        {/* Navigation */}
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
            {SCENES.map((scene, i) => (
              <div key={i} className="flex items-center">
                <button
                  onClick={() => {
                    setSceneIndex(i);
                    lastStepChange.current = Date.now();
                  }}
                  className="relative p-1"
                  aria-label={`Go to step ${i + 1}: ${scene.title}`}
                >
                  <div
                    className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transition-all duration-400 ${
                      i === displayIndex
                        ? "bg-[#00ffcc] shadow-lg shadow-[#00ffcc]/50 scale-125"
                        : i < displayIndex
                        ? "bg-[#00ffcc]/60"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                </button>
                {i < SCENES.length - 1 && (
                  <div className="w-6 md:w-8 h-0.5 mx-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00ffcc]/50 rounded-full transition-all duration-400"
                      style={{ width: i < displayIndex ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
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
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">
            Step{" "}
            <span className="text-[#00ffcc] font-semibold">{displayIndex + 1}</span>{" "}
            of {SCENES.length}
          </span>
        </div>
      </div>
    </section>
  );
}
