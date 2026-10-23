import { useEffect } from "react";
import Lenis from "lenis";
import { MotionProvider, useMotion } from "@/lib/motion";
import { gsap, ScrollTrigger, smooth } from "@/lib/gsap";
import { Cursor } from "@/components/Cursor";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { Manifesto } from "@/components/Manifesto";
import { Features } from "@/components/Features";
import { PapersToMatrix } from "@/components/PapersToMatrix";
import { Roles } from "@/components/Roles";
import { More } from "@/components/More";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { Honest } from "@/components/Honest";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { MobileCTA } from "@/components/MobileCTA";

/** Lenis smooth scroll, only when pinned scenes are active (desktop + motion on). Native scroll everywhere else. */
function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    smooth.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      smooth.lenis = null;
    };
  }, [enabled]);
}

function Page() {
  const { pin } = useMotion();
  useSmoothScroll(pin);

  // Re-measure pinned scenes once fonts and late layout settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    const t = window.setTimeout(refresh, 1200);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
    };
  }, [pin]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Cursor />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <SocialProof />
        <Manifesto />
        <Features />
        <PapersToMatrix />
        <Roles />
        <More />
        <Testimonials />
        <Pricing />
        <Honest />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}

export default function App() {
  return (
    <MotionProvider>
      <Page />
    </MotionProvider>
  );
}
