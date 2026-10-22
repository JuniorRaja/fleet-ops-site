import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, Flip);
ScrollTrigger.config({ ignoreMobileResize: true });

/** Holds the Lenis instance while smooth scroll is active (desktop + motion on). */
export const smooth: { lenis: Lenis | null } = { lenis: null };

export function scrollToId(id: string, offset = -72) {
  const el = document.getElementById(id);
  if (!el) return;
  if (smooth.lenis) {
    smooth.lenis.scrollTo(el, { offset, duration: 1.3 });
  } else {
    const reduce = document.documentElement.dataset.motion === "off";
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  try {
    history.replaceState(null, "", `#${id}`);
  } catch {
    /* ignore */
  }
}

export { gsap, ScrollTrigger, Flip };
