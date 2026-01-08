import { useEffect, useState, RefObject } from "react";
import { ScrollState } from "./types";
import { SCENES } from "./constants";

export function useShowcaseScroll(sectionRef: RefObject<HTMLElement | null>): ScrollState {
  const [state, setState] = useState<ScrollState>({
    sceneIndex: 0,
    sceneProgress: 0,
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Section starts when its top reaches viewport top
      // Section ends when its bottom reaches viewport bottom
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const scrollableDistance = sectionHeight - viewportHeight;

      if (scrollableDistance <= 0) return;

      // Calculate how far we've scrolled into this section
      // When sectionTop = 0, we're at the start
      // When sectionTop = -scrollableDistance, we're at the end
      const scrolledAmount = Math.max(0, Math.min(scrollableDistance, -sectionTop));
      const progress = scrolledAmount / scrollableDistance;

      // Map progress (0-1) to scene index
      const totalScenes = SCENES.length;
      const sceneFloat = progress * totalScenes;
      const sceneIndex = Math.min(totalScenes - 1, Math.floor(sceneFloat));
      const sceneProgress = sceneFloat - sceneIndex;

      setState({ sceneIndex, sceneProgress });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sectionRef]);

  return state;
}
