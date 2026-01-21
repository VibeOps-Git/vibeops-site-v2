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

      // Total scrollable height within the section (section height minus one viewport)
      const sectionHeight = section.offsetHeight;
      const scrollableDistance = sectionHeight - viewportHeight;

      if (scrollableDistance <= 0) {
        setState({ sceneIndex: 0, sceneProgress: 0 });
        return;
      }

      // How far the section top has scrolled past the viewport top
      // rect.top = 0 means section just entered
      // rect.top = -scrollableDistance means we've scrolled through the whole section
      const scrolledIntoSection = -rect.top;

      // Clamp to valid range
      const clampedScroll = Math.max(0, Math.min(scrollableDistance, scrolledIntoSection));

      // Progress from 0 to 1 through the entire section
      const totalProgress = clampedScroll / scrollableDistance;

      // Map to scene index (0, 1, 2 for 3 scenes)
      const totalScenes = SCENES.length;
      const sceneFloat = totalProgress * totalScenes;
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
