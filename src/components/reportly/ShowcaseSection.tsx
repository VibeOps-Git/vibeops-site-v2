import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SCENES } from "./constants";
import { IPadDevice } from "./IPadDevice";
import { SceneDescription } from "./SceneDescription";

/**
 * Apple-style scroll-driven showcase section.
 *
 * Phases (500vh scroll height for longer steps):
 * 1. ENTER (0-5%): Section fades in, iPad rises from below
 * 2. INTRO (5-15%): App launches on iPad with progress bar filling
 * 3. SCENES (15-90%): Cycle through steps 1-2-3 (~25% each)
 * 4. OUTRO (90-100%): Fade out to footer
 *
 * iPad stays centered with subtle float animation.
 */
export function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Auto-scroll state
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUserScrollRef = useRef<number>(0);

  // Scroll phases with crossfade transition
  // Total scrollable: ~80% (5% enter, 5% outro leaves 90%)
  // Intro + 3 scenes = 4 equal sections of ~21% each
  const ENTER_END = 0.05;
  const INTRO_START = 0.05;
  const INTRO_END = 0.22;         // ~17% for intro (matching step duration)
  const CROSSFADE_START = 0.22;   // Crossfade from launch to step 1
  const CROSSFADE_END = 0.28;     // 6% for smooth crossfade
  const SCENES_START = 0.28;
  const SCENES_END = 0.90;
  const OUTRO_START = 0.90;

  // Calculate scene progress (0-1 across all scenes)
  const totalScenes = SCENES.length;
  const scenesProgress = Math.max(0, Math.min(1,
    (scrollProgress - SCENES_START) / (SCENES_END - SCENES_START)
  ));

  // Current scene index and progress within that scene
  const rawSceneFloat = scenesProgress * totalScenes;
  const currentSceneIndex = Math.min(totalScenes - 1, Math.floor(rawSceneFloat));
  const sceneProgress = rawSceneFloat - currentSceneIndex; // 0-1 within current scene

  // Animation progress for each phase
  const enterProgress = Math.min(1, scrollProgress / ENTER_END);
  const introProgress = scrollProgress >= INTRO_START
    ? Math.min(1, (scrollProgress - INTRO_START) / (INTRO_END - INTRO_START))
    : 0;
  const crossfadeProgress = scrollProgress >= CROSSFADE_START
    ? Math.min(1, (scrollProgress - CROSSFADE_START) / (CROSSFADE_END - CROSSFADE_START))
    : 0;
  const outroProgress = scrollProgress > OUTRO_START
    ? (scrollProgress - OUTRO_START) / (1 - OUTRO_START)
    : 0;

  // Phase states
  const isInEnter = scrollProgress < ENTER_END;
  const isInIntro = scrollProgress >= INTRO_START && scrollProgress < INTRO_END;
  const isInCrossfade = scrollProgress >= CROSSFADE_START && scrollProgress < CROSSFADE_END;
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

  // Auto-scroll to a target progress value
  const scrollToProgress = useCallback((targetProgress: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = sectionHeight - viewportHeight;

    const targetScrollY = sectionTop + scrollableDistance * targetProgress;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  }, []);

  // Auto-scroll effect - starts after 3s of inactivity when in view
  useEffect(() => {
    // Don't auto-scroll if not in view or already past outro
    if (!isInView || scrollProgress >= OUTRO_START || isAutoScrollPaused) {
      return;
    }

    // Clear any existing timeout
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }

    // Start auto-scroll after 3 seconds of inactivity
    autoScrollTimeoutRef.current = setTimeout(() => {
      // Only auto-scroll if user hasn't scrolled recently
      const timeSinceLastScroll = Date.now() - lastUserScrollRef.current;
      if (timeSinceLastScroll >= 2900 && isInView && scrollProgress < OUTRO_START) {
        setIsAutoScrolling(true);

        // Determine next target based on current progress
        let nextProgress: number;

        if (scrollProgress < INTRO_END) {
          // During intro, scroll to crossfade end (step 1 start)
          nextProgress = CROSSFADE_END + 0.05;
        } else if (scrollProgress < SCENES_END) {
          // During scenes, scroll to next scene
          const nextSceneIndex = Math.min(totalScenes - 1, currentSceneIndex + 1);
          if (nextSceneIndex > currentSceneIndex) {
            const targetScenesProgress = (nextSceneIndex + 0.3) / totalScenes;
            nextProgress = SCENES_START + targetScenesProgress * (SCENES_END - SCENES_START);
          } else {
            // At last scene, scroll to outro
            nextProgress = OUTRO_START + 0.02;
          }
        } else {
          nextProgress = 1;
        }

        scrollToProgress(nextProgress);
      }
    }, 3000);

    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, [isInView, scrollProgress, isAutoScrollPaused, currentSceneIndex, totalScenes, scrollToProgress, INTRO_END, CROSSFADE_END, SCENES_START, SCENES_END, OUTRO_START]);

  // Track user scroll activity to pause auto-scroll
  useEffect(() => {
    const handleUserScroll = () => {
      lastUserScrollRef.current = Date.now();
      setIsAutoScrolling(false);
    };

    // Use wheel and touch events to detect user-initiated scrolls
    window.addEventListener("wheel", handleUserScroll, { passive: true });
    window.addEventListener("touchmove", handleUserScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleUserScroll);
      window.removeEventListener("touchmove", handleUserScroll);
    };
  }, []);

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
    if (currentSceneIndex > 0) scrollToScene(currentSceneIndex - 1);
  };

  const goToNext = () => {
    if (currentSceneIndex < SCENES.length - 1) scrollToScene(currentSceneIndex + 1);
  };

  // === ENTER PHASE ANIMATIONS ===
  const enterOpacity = enterProgress;
  const enterTranslateY = (1 - enterProgress) * 100;
  const enterScale = 0.8 + enterProgress * 0.2;

  // === INTRO PHASE ANIMATIONS ===
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

  // Subtle floating effect
  const floatY = isInEnter ? 0 : Math.sin(scrollProgress * Math.PI * 3) * 4;
  const floatRotate = isInEnter ? 0 : Math.sin(scrollProgress * Math.PI * 1.5) * 0.8;

  const ipadOpacity = isInOutro ? outroOpacity : 1;
  const containerOpacity = isInEnter ? enterOpacity : (isInOutro ? outroOpacity : 1);

  // Content visibility - show after intro ends
  const showSceneContent = scrollProgress >= INTRO_END;
  const sceneContentOpacity = showSceneContent
    ? Math.min(1, (scrollProgress - INTRO_END) / 0.05) // Quick fade in over 5%
    : 0;
  const finalContentOpacity = isInOutro ? Math.max(0, 1 - outroProgress * 1.5) : sceneContentOpacity;

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

  const isFirst = currentSceneIndex === 0;
  const isLast = currentSceneIndex === SCENES.length - 1;

  // Show launch content during enter and intro phases
  const isShowingLaunch = isInEnter || isInIntro;

  return (
    <>
      {/* Scroll spacer - increased height for longer steps */}
      <section
        ref={sectionRef}
        className="relative"
        style={{ height: "500vh" }}
        aria-hidden="true"
      />

      {/* Fixed content */}
      {isInView && (
        <div
          className="fixed inset-0 z-20 flex items-center bg-[#0a0a0f] overflow-y-auto"
          style={{
            opacity: containerOpacity,
            pointerEvents: isInView && enterProgress > 0.5 ? "auto" : "none",
          }}
          onMouseEnter={() => setIsAutoScrollPaused(true)}
          onMouseLeave={() => setIsAutoScrollPaused(false)}
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

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 my-auto relative z-10">
            {/* Header - hidden on mobile to give more space for step content */}
            <div
              className="hidden md:block text-center mb-8 lg:mb-12"
              style={{
                opacity: headerOpacity,
                transform: `translateY(${headerTranslateY}px)`,
              }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                {isShowingLaunch ? "Introducing Reportly" : "See How It Works"}
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
              {/* Description - left side */}
              <div
                className="w-full lg:w-2/5 order-2 lg:order-1"
                style={{
                  opacity: isShowingLaunch
                    ? Math.min(1, introProgress * 2)
                    : finalContentOpacity,
                  transform: `translateY(${
                    isShowingLaunch
                      ? (1 - Math.min(1, introProgress * 2)) * 20
                      : 0
                  }px)`,
                  transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                }}
              >
                {isShowingLaunch ? (
                  <div className="lg:text-left text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] text-[#00ffcc] border border-[#00ffcc]/30 bg-[#00ffcc]/5 mb-4">
                      The Solution
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Meet <span className="text-[#00ffcc]">Reportly</span>
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Automated, audit-ready reports from your existing templates.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ffcc]/20 flex items-center justify-center mt-0.5">
                          <span className="text-[#00ffcc] text-sm">✓</span>
                        </div>
                        <p className="text-gray-300">
                          <span className="text-white font-medium">Upload once</span> — your existing Word and Excel templates work instantly
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ffcc]/20 flex items-center justify-center mt-0.5">
                          <span className="text-[#00ffcc] text-sm">✓</span>
                        </div>
                        <p className="text-gray-300">
                          <span className="text-white font-medium">AI-powered</span> — understands engineering context and terminology
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ffcc]/20 flex items-center justify-center mt-0.5">
                          <span className="text-[#00ffcc] text-sm">✓</span>
                        </div>
                        <p className="text-gray-300">
                          <span className="text-white font-medium">Audit-ready</span> — compliant reports every time, no manual checks
                        </p>
                      </div>
                    </div>
                  </div>
                ) : showSceneContent && (
                  <SceneDescription
                    scene={SCENES[currentSceneIndex]}
                    sceneIndex={currentSceneIndex}
                    isLeft={true}
                  />
                )}
              </div>

              {/* iPad - with enter/intro/outro animations */}
              <div
                className="w-full lg:w-3/5 flex justify-center order-1 lg:order-2 will-change-transform"
                style={{
                  opacity: ipadOpacity,
                  transform: `
                    translateZ(0)
                    scale(${ipadScale})
                    translateY(${ipadTranslateY + floatY}px)
                    rotateZ(${floatRotate}deg)
                  `,
                  transition: isInEnter || isInOutro
                    ? "none"
                    : "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease-out",
                }}
              >
                <IPadDevice
                  sceneIndex={currentSceneIndex}
                  rotateZ={0}
                  isRight={true}
                  launchProgress={
                    isInEnter ? 0 :
                    isInIntro ? introProgress :
                    isInCrossfade ? 1 + crossfadeProgress : // 1.0 to 2.0 for crossfade
                    undefined
                  }
                />
              </div>
            </div>

            {/* Navigation - only visible after intro */}
            <div
              className="flex items-center justify-center gap-4 mt-8 md:mt-12"
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

              {/* Step progress indicators - dots that expand to progress bars */}
              <div className="flex items-center gap-2 md:gap-3 px-4">
                {SCENES.map((scene, i) => {
                  // Determine state: completed, active, or upcoming
                  const isCompleted = i < currentSceneIndex;
                  const isActive = i === currentSceneIndex;
                  const isUpcoming = i > currentSceneIndex;

                  // Progress within this step (0-1)
                  const stepFill = isCompleted ? 1 : isActive ? sceneProgress : 0;

                  // Expanded width when active or completed
                  const isExpanded = isCompleted || isActive;

                  return (
                    <button
                      key={i}
                      onClick={() => scrollToScene(i)}
                      className="group relative flex items-center justify-center"
                      aria-label={`Go to step ${i + 1}: ${scene.title}`}
                    >
                      {/* Container that morphs from dot to bar */}
                      <div
                        className="relative h-2 rounded-full overflow-hidden transition-all duration-300 ease-out"
                        style={{
                          width: isExpanded ? "4.5rem" : "0.5rem", // 72px expanded, 8px as dot
                          backgroundColor: isUpcoming
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(0, 255, 204, 0.2)",
                        }}
                      >
                        {/* Fill bar */}
                        <div
                          className="absolute inset-y-0 left-0 bg-[#00ffcc] rounded-full"
                          style={{
                            width: `${stepFill * 100}%`,
                            transition: "width 0.05s linear",
                          }}
                        />
                      </div>

                      {/* Step number - only show when expanded */}
                      <span
                        className="absolute -top-5 text-[10px] font-medium transition-all duration-300"
                        style={{
                          opacity: isExpanded ? 1 : 0,
                          color: isActive ? "#00ffcc" : isCompleted ? "rgba(0, 255, 204, 0.6)" : "rgba(255, 255, 255, 0.4)",
                        }}
                      >
                        {i + 1}
                      </span>
                    </button>
                  );
                })}
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

            {/* Current step label */}
            <div
              className="text-center mt-4"
              style={{ opacity: finalContentOpacity }}
            >
              <span className="text-xs text-gray-400 transition-all duration-300">
                Step {currentSceneIndex + 1}: {SCENES[currentSceneIndex]?.title}
              </span>
            </div>

            {/* Scroll hint - visible during enter and early intro */}
            {(isInEnter || isInIntro) && (
              <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                style={{ opacity: Math.max(0, 1 - (enterProgress + introProgress) * 0.8) }}
              >
                <span className="text-xs text-gray-500">
                  {isAutoScrolling ? "Auto-playing..." : "Scroll to explore or wait"}
                </span>
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
