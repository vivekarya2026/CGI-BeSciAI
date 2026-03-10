import type { MotionProps, Transition } from "motion/react";

/**
 * Global motion configuration for consistent microinteractions across the app.
 * All durations, springs, and hover/press behaviors are defined here.
 * 
 * ACCESSIBILITY: Respects prefers-reduced-motion user preference.
 */

// ============================================
// ACCESSIBILITY CHECK
// ============================================

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// ============================================
// MOTION TOKENS
// ============================================

export const motionDurations = {
  fast: 0.15,
  medium: 0.22,
  slow: 0.35,
} as const;

export const motionSprings = {
  soft: { type: "spring", stiffness: 260, damping: 22 } as Transition,
  firm: { type: "spring", stiffness: 320, damping: 24 } as Transition,
  bouncy: { type: "spring", stiffness: 400, damping: 18 } as Transition,
} as const;

export const motionEasing = {
  easeOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeInOut: [0.45, 0, 0.55, 1] as [number, number, number, number],
} as const;

// ============================================
// TIER 1 — HERO PRIMARY ACTIONS
// ============================================

export function primaryButtonMotion(): Pick<MotionProps, "whileHover" | "whileTap" | "transition"> {
  if (prefersReducedMotion()) {
    return {
      whileHover: { opacity: 0.9 },
      whileTap: { opacity: 0.8 },
      transition: { duration: 0.1 },
    };
  }
  return {
    whileHover: { scale: 1.04, y: -2, boxShadow: "0 6px 20px rgba(82,54,171,0.35)" },
    whileTap: { scale: 0.97, y: 0 },
    transition: motionSprings.soft,
  };
}

export function heroCTAMotion(): Pick<MotionProps, "whileHover" | "whileTap" | "transition"> {
  if (prefersReducedMotion()) {
    return {
      whileHover: { opacity: 0.9 },
      whileTap: { opacity: 0.8 },
      transition: { duration: 0.1 },
    };
  }
  return {
    whileHover: { scale: 1.05, y: -3, boxShadow: "0 8px 28px rgba(79,70,229,0.45)" },
    whileTap: { scale: 0.96 },
    transition: motionSprings.bouncy,
  };
}

// ============================================
// TIER 2 — SECONDARY BUTTONS & CHIPS
// ============================================

export function secondaryButtonMotion(): Pick<MotionProps, "whileHover" | "whileTap" | "transition"> {
  if (prefersReducedMotion()) {
    return {
      whileHover: { opacity: 0.85 },
      whileTap: { opacity: 0.7 },
      transition: { duration: 0.1 },
    };
  }
  return {
    whileHover: { scale: 1.02, y: -1 },
    whileTap: { scale: 0.98 },
    transition: { duration: motionDurations.fast, ease: motionEasing.easeOut },
  };
}

export function chipToggleMotion(): Pick<MotionProps, "whileHover" | "whileTap" | "transition"> {
  if (prefersReducedMotion()) {
    return {
      whileHover: { opacity: 0.9 },
      whileTap: { opacity: 0.8 },
      transition: { duration: 0.1 },
    };
  }
  return {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.96 },
    transition: { duration: motionDurations.fast, ease: motionEasing.easeOut },
  };
}

// ============================================
// TIER 2 — INTERACTIVE CARDS
// ============================================

export function cardHoverMotion(): Pick<MotionProps, "whileHover" | "whileTap" | "transition"> {
  if (prefersReducedMotion()) {
    return {
      whileHover: { boxShadow: "0 10px 30px rgba(15,23,42,0.14)" },
      whileTap: { opacity: 0.95 },
      transition: { duration: 0.15 },
    };
  }
  return {
    whileHover: { y: -4, scale: 1.01, boxShadow: "0 10px 30px rgba(15,23,42,0.14)" },
    whileTap: { scale: 0.99, y: -2 },
    transition: motionSprings.soft,
  };
}

export function cardSubtleMotion(): Pick<MotionProps, "whileHover" | "transition"> {
  if (prefersReducedMotion()) {
    return {
      whileHover: { boxShadow: "0 6px 18px rgba(15,23,42,0.10)" },
      transition: { duration: 0.15 },
    };
  }
  return {
    whileHover: { y: -2, boxShadow: "0 6px 18px rgba(15,23,42,0.10)" },
    transition: { duration: motionDurations.medium, ease: motionEasing.easeOut },
  };
}

// ============================================
// TIER 3 — ICON BUTTONS & SMALL ACTIONS
// ============================================

export function iconButtonMotion(): Pick<MotionProps, "whileHover" | "whileTap" | "transition"> {
  if (prefersReducedMotion()) {
    return {
      whileHover: { opacity: 0.8 },
      whileTap: { opacity: 0.6 },
      transition: { duration: 0.1 },
    };
  }
  return {
    whileHover: { scale: 1.08, rotate: 2 },
    whileTap: { scale: 0.92, rotate: -2 },
    transition: motionSprings.bouncy,
  };
}

// ============================================
// PAGE & SECTION TRANSITIONS
// ============================================

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: motionDurations.medium, ease: motionEasing.easeOut },
};

export const sectionTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: motionDurations.medium, ease: motionEasing.easeOut },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// ============================================
// LOADING & FEEDBACK
// ============================================

export const pulseMotion = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const shimmerMotion = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "linear",
  },
};
