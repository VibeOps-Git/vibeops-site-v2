// src/components/AnimatedContent.tsx
import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnimatedContentProps = {
  children: ReactNode;
  distance?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  onComplete?: () => void;
};

const AnimatedContent = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  onComplete,
}: AnimatedContentProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const axis = direction === "horizontal" ? "x" : "y";
    const offset = reverse ? -distance : distance;
    const startPct = (1 - threshold) * 100;

    gsap.set(el, {
      [axis]: offset,
      scale,
      opacity: animateOpacity ? initialOpacity : 1,
    });

    // Safety fallback: if ScrollTrigger never fires (e.g. completely failed
    // measurement), force the element visible - but ONLY if it's currently
    // visible in (or just above) the viewport. Elements below the fold remain
    // hidden until scroll reaches them, preventing everything popping in at once.
    const fallback = setTimeout(() => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Only show elements that are currently visible in (or just above) the viewport.
      // Elements below the fold remain hidden until scroll reaches them.
      const isVisible = rect.top < window.innerHeight * 1.1 && rect.bottom > -50;
      if (!isVisible) return;
      const currentOpacity = parseFloat(el.style.opacity ?? '1');
      if (currentOpacity < 0.5) {
        gsap.to(el, { [axis]: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'power2.out' });
      }
    }, 1400); // longer - give ScrollTrigger time to fire on scroll

    const tween = gsap.to(el, {
      [axis]: 0,
      scale: 1,
      opacity: 1,
      duration,
      ease,
      delay,
      onComplete,
      scrollTrigger: {
        trigger: el,
        start: `top ${startPct}%`,
        toggleActions: "play none none none",
        once: true,
      },
    });

    // Double-RAF refresh so new page DOM and layout settle before
    // ScrollTrigger measures positions. ScrollToTop.tsx also does this
    // at the page level, but individual components may mount after that
    // refresh fires (e.g. lazy images, video, deferred sections).
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });

    return () => {
      clearTimeout(fallback);
      cancelAnimationFrame(raf);
      tween.kill();
    };
  }, [
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
    onComplete,
  ]);

  return <div ref={ref}>{children}</div>;
};

export default AnimatedContent;
