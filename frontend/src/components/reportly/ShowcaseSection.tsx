import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SCENES } from "./constants";
import { IPadDevice } from "./IPadDevice";
import { SceneDescription } from "./SceneDescription";

/**
 * Apple-style scroll-driven showcase section.
 *
 * Phases:
 * 1. ENTER (0-8%): Section fades in, iPad rises from below
 * 2. INTRO (8-20%): App launches on iPad with progress bar filling
 * 3. SCENES (20-85%): Cycle through steps 1-2-3
 * 4. OUTRO (85-100%): Fade out to footer
 *
 * iPad stays centered with subtle float animation - no left/right movement.
 */
export function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Scroll phases - added ENTER phase for smooth transition from hero
  const ENTER_END = 0.08;
  const INTRO_START = 0.08;
  const INTRO_END = 0.20;
  const SCENES_START = 0.20;
  const SCENES_END = 0.85;
  const OUTRO_START = 0.85;

  // Calculate scene progress
  const totalScenes = SCENES.length;
  const scenesProgress = Math.max(0, Math.min(1,
    (scrollProgress - SCENES_START) / (SCENES_END - SCENES_START)
  ));
  const rawSceneFloat = scenesProgress * totalScenes;
  const currentSceneIndex = Math.min(totalScenes - 1, Math.floor(rawSceneFloat));
  const sceneProgress = rawSceneFloat - currentSceneIndex;

  // Display index switches at midpoint of transition
  const displayIndex = sceneProgress > 0.5 && currentSceneIndex < totalScenes - 1
    ? currentSceneIndex + 1
    : currentSceneIndex;

  // Animation progress for each phase
  const enterProgress = Math.min(1, scrollProgress / ENTER_END);
  const introProgress = scrollProgress >= INTRO_START
    ? Math.min(1, (scrollProgress - INTRO_START) / (INTRO_END - INTRO_START))
    : 0;
  const outroProgress = scrollProgress > OUTRO_START
    ? (scrollProgress - OUTRO_START) / (1 - OUTRO_START)
    : 0;

  // Phase states
  const isInEnter = scrollProgress < ENTER_END;
  const isInIntro = scrollProgress >= INTRO_START && scrollProgress < INTRO_END;
  const isInOutro = scrollProgress >= OUTRO_START;

  const updateScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;

    const inView = rect.top < viewportHeight && rect.bottom > 0;
    setIsInView(inView);

    if (!inView) {
      rafRef.current = null;
      return;
    }

    const scrollableDistance = sectionHeight - viewportHeight;
    if (scrollableDistance <= 0) {
      setScrollProgress(0);
      rafRef.current = null;
      return;
    }

    const scrolledAmount = -rect.top;
    const clampedProgress = Math.max(0, Math.min(1, scrolledAmount / scrollableDistance));
    setScrollProgress(clampedProgress);
    rafRef.current = null;
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(updateScroll);
    }
  }, [updateScroll]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  // Manual navigation
  const scrollToScene = (targetIndex: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = sectionHeight - viewportHeight;

    const targetScenesProgress = (targetIndex + 0.5) / totalScenes;
    const targetOverallProgress = SCENES_START + targetScenesProgress * (SCENES_END - SCENES_START);
    const targetScrollY = sectionTop + scrollableDistance * targetOverallProgress;

    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  const goToPrev = () => {
    if (displayIndex > 0) scrollToScene(displayIndex - 1);
  };

  const goToNext = () => {
    if (displayIndex < SCENES.length - 1) scrollToScene(displayIndex + 1);
  };

  // === ENTER PHASE ANIMATIONS ===
  // Container fades in
  const enterOpacity = enterProgress;
  // iPad rises from below (starts 100px down, ends at 0)
  const enterTranslateY = (1 - enterProgress) * 100;
  // iPad starts smaller and scales up
  const enterScale = 0.8 + enterProgress * 0.2;

  // === INTRO PHASE ANIMATIONS ===
  // iPad continues to scale slightly during intro
  const introScale = 1 + introProgress * 0.02;

  // === OUTRO PHASE ANIMATIONS ===
  const outroScale = 1 - outroProgress * 0.1;
  const outroOpacity = 1 - outroProgress;
  const outroTranslateY = outroProgress * -50;

  // === COMBINED TRANSFORMS ===
  let ipadScale = 1;
  let ipadTranslateY = 0;

  if (isInEnter) {
    ipadScale = enterScale;
    ipadTranslateY = enterTranslateY;
  } else if (isInIntro) {
    ipadScale = introScale;
  } else if (isInOutro) {
    ipadScale = outroScale;
    ipadTranslateY = outroTranslateY;
  }

  // Subtle floating effect (only after enter)
  const floatY = isInEnter ? 0 : Math.sin(scrollProgress * Math.PI * 4) * 3;
  const floatRotate = isInEnter ? 0 : Math.sin(scrollProgress * Math.PI * 2) * 1;

  const ipadOpacity = isInOutro ? outroOpacity : 1;

  // Container opacity
  const containerOpacity = isInEnter ? enterOpacity : (isInOutro ? outroOpacity : 1);

  // Content visibility - only show after intro
  const showSceneContent = scrollProgress >= INTRO_END;
  const sceneContentOpacity = showSceneContent
    ? Math.min(1, (scrollProgress - INTRO_END) / 0.05)
    : 0;
  const finalContentOpacity = isInOutro ? Math.max(0, 1 - outroProgress * 1.5) : sceneContentOpacity;

  // Text transition during scene changes
  const transitionStart = 0.3;
  const transitionEnd = 0.7;
  let textTransitionOpacity = 1;
  if (sceneProgress >= transitionStart && sceneProgress <= transitionEnd && currentSceneIndex < totalScenes - 1) {
    const transitionProgress = (sceneProgress - transitionStart) / (transitionEnd - transitionStart);
    textTransitionOpacity = transitionProgress < 0.5
      ? 1 - (transitionProgress * 2)
      : (transitionProgress - 0.5) * 2;
  }

  // Header animation
  const headerOpacity = isInEnter
    ? enterProgress
    : isInOutro
      ? Math.max(0, 1 - outroProgress * 2)
      : 1;
  const headerTranslateY = isInEnter
    ? (1 - enterProgress) * -30
    : isInOutro
      ? -outroProgress * 40
      : 0;

  const isFirst = displayIndex === 0;
  const isLast = displayIndex === SCENES.length - 1;

  const getLineProgress = (index: number) => {
    if (index < currentSceneIndex) return 1;
    if (index === currentSceneIndex) return sceneProgress;
    return 0;
  };

  // Determine header text based on phase
  const isShowingLaunch = scrollProgress < INTRO_END;

  return (
    <>
      {/* Scroll spacer */}
      <section
        ref={sectionRef}
        className="relative"
        style={{ height: "400vh" }}
        aria-hidden="true"
      />

      {/* Fixed content */}
      {isInView && (
        <div
          className="fixed inset-0 z-20 flex items-center bg-[#0a0a0f]"
          style={{
            opacity: containerOpacity,
            pointerEvents: isInView && enterProgress > 0.5 ? "auto" : "none",
          }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ffcc]/5 to-transparent pointer-events-none" />

          {/* Background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ffcc]/10 rounded-full blur-3xl"
              style={{
                transform: `translate(${scrollProgress * 50}px, ${scrollProgress * 30}px)`,
                opacity: (0.2 + enterProgress * 0.2 + introProgress * 0.4),
              }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ffcc]/5 rounded-full blur-3xl"
              style={{
                transform: `translate(${-scrollProgress * 40}px, ${-scrollProgress * 20}px)`,
                opacity: (0.1 + enterProgress * 0.2 + introProgress * 0.4),
              }}
            />
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            {/* Header */}
            <div
              className="text-center mb-8 lg:mb-12"
              style={{
                opacity: headerOpacity,
                transform: `translateY(${headerTranslateY}px)`,
              }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                {isShowingLaunch ? "Launching Reportly" : "See How It Works"}
              </h2>
              <p className="text-gray-400 text-base lg:text-lg max-w-2xl mx-auto">
                {isShowingLaunch
                  ? "Your automated report generation platform"
                  : "Three simple steps to transform your reporting workflow"
                }
              </p>
            </div>

            {/* Main content - centered layout */}
            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16">
              {/* Description - left side, only visible after intro */}
              <div
                className="w-full lg:w-2/5 order-2 lg:order-1"
                style={{
                  opacity: finalContentOpacity * textTransitionOpacity,
                  transform: `translateY(${textTransitionOpacity < 1 ? (1 - textTransitionOpacity) * 15 : 0}px)`,
                }}
              >
                {showSceneContent && (
                  <SceneDescription
                    scene={SCENES[displayIndex]}
                    sceneIndex={displayIndex}
                    isLeft={true}
                  />
                )}
              </div>

              {/* iPad - with enter/intro/outro animations */}
              <div
                className="w-full lg:w-3/5 flex justify-center order-1 lg:order-2"
                style={{
                  opacity: ipadOpacity,
                  transform: `
                    scale(${ipadScale})
                    translateY(${ipadTranslateY + floatY}px)
                    rotateZ(${floatRotate}deg)
                  `,
                }}
              >
                <IPadDevice
                  sceneIndex={displayIndex}
                  rotateZ={0}
                  isRight={true}
                  launchProgress={isInIntro ? introProgress : (isInEnter ? 0 : undefined)}
                />
              </div>
            </div>

            {/* Navigation - only visible after intro */}
            <div
              className="flex items-center justify-center gap-4 mt-10 md:mt-14"
              style={{
                opacity: finalContentOpacity,
                pointerEvents: showSceneContent ? "auto" : "none",
              }}
            >
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
                      onClick={() => scrollToScene(i)}
                      className="relative p-1"
                      aria-label={`Go to step ${i + 1}: ${scene.title}`}
                    >
                      <div
                        className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transition-all duration-300 ${
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
                          className="h-full bg-[#00ffcc]/50 rounded-full"
                          style={{
                            width: `${getLineProgress(i) * 100}%`,
                            transition: "width 0.1s linear",
                          }}
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

            {/* Step counter - only visible after intro */}
            <div
              className="text-center mt-4"
              style={{ opacity: finalContentOpacity }}
            >
              <span className="text-sm text-gray-500">
                Step <span className="text-[#00ffcc] font-semibold">{displayIndex + 1}</span> of{" "}
                {SCENES.length}
              </span>
            </div>

            {/* Scroll hint - visible during enter and early intro */}
            {(isInEnter || isInIntro) && (
              <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                style={{ opacity: Math.max(0, 1 - (enterProgress + introProgress) * 0.8) }}
              >
                <span className="text-xs text-gray-500">Scroll to explore</span>
                <div className="w-5 h-8 rounded-full border-2 border-gray-500/50 flex justify-center pt-1.5">
                  <div className="w-1 h-2 bg-gray-500/50 rounded-full animate-scroll-indicator" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
