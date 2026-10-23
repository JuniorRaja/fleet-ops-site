import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

/** Custom cursor: a lagging ring + dot, grows on interactive targets, shows labels via data-cursor. */
export function Cursor() {
  const { motion, fine } = useMotion();
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const enabled = motion && fine;

  useEffect(() => {
    if (!enabled) return;
    const r = ring.current;
    const d = dot.current;
    const t = tag.current;
    if (!r || !d || !t) return;

    gsap.set([r, d, t], { xPercent: -50, yPercent: -50, opacity: 0 });
    const rx = gsap.quickTo(r, "x", { duration: 0.35, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.35, ease: "power3.out" });
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "none" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "none" });
    const tx = gsap.quickTo(t, "x", { duration: 0.28, ease: "power3.out" });
    const ty = gsap.quickTo(t, "y", { duration: 0.28, ease: "power3.out" });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set([r, d, t], { x: e.clientX, y: e.clientY });
        gsap.to([r, d], { opacity: 1, duration: 0.2 });
      }
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
      tx(e.clientX + 54);
      ty(e.clientY + 30);
    };
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(
        '[data-cursor], a, button, summary, select, input, textarea, label, [role="switch"], [role="radio"]'
      ) as HTMLElement | null;
      const lbl = el?.dataset.cursor ?? "";
      setLabel(lbl);
      gsap.to(r, { scale: el ? (lbl ? 0.55 : 1.7) : 1, duration: 0.2, ease: "power2.out", overwrite: "auto" });
      gsap.to(t, { opacity: lbl ? 1 : 0, duration: 0.15, overwrite: "auto" });
    };
    const onLeave = () => {
      shown = false;
      gsap.to([r, d, t], { opacity: 0, duration: 0.2 });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf([r, d, t]);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true">
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[200] size-9 rounded-full border border-white mix-blend-difference"
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[200] size-1.5 rounded-full bg-white mix-blend-difference"
      />
      <div
        ref={tag}
        className="pointer-events-none fixed left-0 top-0 z-[201] whitespace-nowrap rounded-full bg-ink px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-lime"
      >
        {label}
      </div>
    </div>
  );
}
