import { useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export interface NavScrollState {
  hidden: boolean;
  isScrolled: boolean;
  style: { y: import('framer-motion').MotionValue<number> };
}

/**
 * Apple-caliber velocity-aware nav hide/show hook (PR02).
 * Hides on fast down-scroll (v > 0.55 px/ms, dy>12), shows on up or near top.
 * Uses framer useScroll + useSpring for 60fps buttery translate.
 * Respects reduced-motion (no hide, instant).
 */
export function useNavScroll(): NavScrollState {
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const lastT = useRef(Date.now());
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (reduced) {
      setHidden(false);
      return;
    }

    const unsubscribe = scrollY.on('change', (y: number) => {
      const t = Date.now();
      const dy = y - lastY.current;
      const dt = Math.max(1, t - lastT.current);
      const v = dy / dt; // px per ms

      setIsScrolled(y > 12);

      if (y < 80) {
        setHidden(false);
      } else if (v > 0.55 && dy > 12) {
        setHidden(true);
      } else if (v < -0.35) {
        setHidden(false);
      }
      lastY.current = y;
      lastT.current = t;
    });

    return unsubscribe;
  }, [scrollY, reduced]);

  const targetY = reduced ? 0 : (hidden ? -88 : 0);
  const y = useSpring(targetY, {
    stiffness: reduced ? 1000 : 280,
    damping: reduced ? 80 : 32,
    mass: 1,
    restDelta: 0.5,
  });

  return { hidden, isScrolled, style: { y } };
}
