import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { cn } from "@/utils/cn";

/** Pulls its child a few pixels toward the pointer. Desktop + fine pointer + motion on only. */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { motion, fine } = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !motion || !fine) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power2.out" });
    let active = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const reach = Math.max(r.width, r.height) * 0.9;
      if (dist < reach) {
        active = true;
        xTo((e.clientX - cx) * strength);
        yTo((e.clientY - cy) * strength);
      } else if (active) {
        active = false;
        xTo(0);
        yTo(0);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [motion, fine, strength]);

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {children}
    </span>
  );
}
