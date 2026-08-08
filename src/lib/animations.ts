import type { Variants, Transition } from "framer-motion";

// ── Easing curves ──────────────────────────────────────────────
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  spring: { type: "spring" as const, stiffness: 400, damping: 30 },
  springSoft: { type: "spring" as const, stiffness: 300, damping: 25 },
};

// ── Duration (seconds) ─────────────────────────────────────────
export const duration = {
  fast: 0.2,
  base: 0.3,
  slow: 0.45,
};

// ── Page / Section transitions ─────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0 },
};

// ── Stagger containers ────────────────────────────────────────
export function staggerContainer(staggerAmount: number = 0.06): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerAmount,
        delayChildren: 0.1,
      },
    },
  };
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
};

// ── Standard transition presets ────────────────────────────────
export const transitionFade: Transition = {
  duration: duration.base,
  ease: ease.out,
};

export const transitionSpring: Transition = ease.spring;

// ── Hover / Tap presets (for motion components) ───────────────
export const hoverLift = {
  y: -2,
  transition: { duration: duration.fast, ease: ease.out },
};

export const hoverScale = {
  scale: 1.02,
  transition: { duration: duration.fast, ease: ease.out },
};

export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

// ── Scroll reveal config ──────────────────────────────────────
export const viewportOnce = { once: true, margin: "-40px" } as const;
