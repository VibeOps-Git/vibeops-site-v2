// src/lib/motion.ts
// Centralized Apple-caliber motion system (single source of truth).
// All framer-motion transitions and GSAP sites should use these.
// Thin GSAP wrapper for perceptual parity included.

import type { Transition } from 'framer-motion';

export const APPLE_EASE = [0.23, 1.0, 0.32, 1] as const;
export const APPLE_REVEAL_SPRING = { type: 'spring' as const, stiffness: 320, damping: 32, mass: 1.0 };
export const APPLE_HOVER_SPRING = { type: 'spring' as const, stiffness: 420, damping: 26, mass: 0.85 };
export const APPLE_CARD_SPRING = { type: 'spring' as const, stiffness: 280, damping: 30, mass: 1.05 };
export const CROSSFADE_MS = 620;
export const SCRAMBLE_DURATION = 2.1;

// Canonical helpers (use in every framer <motion.* transition={getTransition(reduced, APPLE_XXX)} > )
export const getTransition = (reduced: boolean, base?: Transition): Transition =>
  reduced ? { duration: 0.01 } : (base ?? { duration: 0.4 });

export const REDUCED_MOTION_VARIANTS = {
  initial: { opacity: 0, y: 0, filter: 'none' },
  animate: { opacity: 1, y: 0, filter: 'none' },
} as const;

// Thin GSAP compatibility wrapper (power3.out ≈ APPLE_EASE within blind test tolerance)
export const GSAP_EASE = 'power3.out';
export const GSAP_SPRING = { ease: GSAP_EASE, duration: 0.65 };

// Aggregate MOTION object for design-tokens consumers
export const MOTION = {
  APPLE_EASE,
  APPLE_REVEAL_SPRING,
  APPLE_HOVER_SPRING,
  APPLE_CARD_SPRING,
  CROSSFADE_MS,
  SCRAMBLE_DURATION,
} as const;
