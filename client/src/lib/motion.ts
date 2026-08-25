import type { Variants } from "framer-motion";

export const easeOut = [0.33, 1, 0.68, 1] as const;

export const viewportOnce = { once: true, amount: 0.1 };

export const slideMask: Variants = {
  initial: { y: "100%" },
  enter: (i: number = 0) => ({
    y: "0%",
    transition: {
      duration: 0.75,
      ease: easeOut,
      delay: 0.075 * i,
    },
  }),
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export const staggerContainer = (stagger: number = 0.08): Variants => ({
  initial: {},
  enter: {
    transition: { staggerChildren: stagger },
  },
});

export const wordReveal: Variants = {
  initial: { opacity: 0.15 },
  enter: {
    opacity: 1,
    transition: { duration: 0.3, ease: "linear" },
  },
};
