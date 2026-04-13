export const HOMEPAGE_EASE = [0.22, 1, 0.36, 1] as const;

export const HOMEPAGE_MOTION = {
  revealDistance: 18,
  revealBlur: "blur(3px)",
  revealDuration: 0.58,
  hoverSpring: {
    type: "spring" as const,
    stiffness: 240,
    damping: 26,
    mass: 0.9,
  },
  gentleSpring: {
    type: "spring" as const,
    stiffness: 180,
    damping: 24,
    mass: 1,
  },
  heroFade: {
    duration: 1.1,
    ease: HOMEPAGE_EASE,
  },
  cardReveal: {
    duration: 0.72,
    ease: HOMEPAGE_EASE,
  },
  viewport: {
    once: true,
    margin: "-50px",
  },
} as const;
