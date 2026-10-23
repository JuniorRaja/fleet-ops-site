import { motion, useScroll, useSpring } from "framer-motion";
import { useMotionPref } from "../lib/motion";

export function ScrollProgress() {
  const { motionOn } = useMotionPref();
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  if (!motionOn) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-brand-500 via-brand-600 to-emerald-400"
      style={{ scaleX: x }}
    />
  );
}
