import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Icon } from "@/components/ui/Icons";
import { PaperPoster } from "@/components/PaperPoster";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { WHATSAPP_HREF } from "@/lib/config";
import { hasWebGL } from "@/lib/webgl";
import { cn } from "@/utils/cn";

function Words({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-top">
          <span className={cn("h1-in inline-block", className)}>{w}</span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const { motion, pin } = useMotion();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [gl, setGl] = useState<"idle" | "ready" | "fail">("idle");

  // three.js: desktop + WebGL only, after first paint, never blocking the poster
  useEffect(() => {
    if (!pin || !hasWebGL()) return;
    let disposed = false;
    let dispose: (() => void) | undefined;
    const boot = () => {
      import("@/three/heroScene")
        .then(async (m) => {
          if (disposed || !stage.current) return;
          const d = await m.mountHeroScene(stage.current, {
            onReady: () => !disposed && setGl("ready"),
            onFail: () => !disposed && setGl("fail"),
          });
          if (disposed) d();
          else dispose = d;
        })
        .catch(() => !disposed && setGl("fail"));
    };
    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(boot, { timeout: 1500 });
      else boot();
    }, 350);
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      dispose?.();
      setGl("idle");
    };
  }, [pin]);

  useLayoutEffect(() => {
    if (!motion || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".h1-in", { yPercent: 115, duration: 0.85, ease: "power3.out", stagger: 0.07, delay: 0.1 });
      gsap.from(".hero-fade", { opacity: 0, y: 16, duration: 0.55, ease: "power2.out", stagger: 0.07, delay: 0.45 });
      if (pin) {
        const trig = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-copy", { y: -30, ease: "none", scrollTrigger: trig });
        gsap.to(".hero-papers", { y: 26, ease: "none", scrollTrigger: trig });
      }
    }, root);
    return () => ctx.revert();
  }, [motion, pin]);

  return (
    <section id="top" ref={root} aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="desk-surface absolute inset-0 -z-20" aria-hidden="true" />
      <div className="grain absolute inset-0 -z-10" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1480px] items-center gap-8 px-5 pb-12 pt-28 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:px-12 lg:pb-20">
        <div className="hero-copy relative z-20 max-w-[680px]">
          <p className="hero-fade eyebrow inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-white/60 py-2 pl-3 pr-4 text-ink/80 backdrop-blur">
            <span className="relative grid size-2 place-items-center text-valid">
              <span className="pulse-dot relative size-2 rounded-full bg-valid" />
            </span>
            A platform built for modern fleet operations
          </p>
          <h1
            id="hero-title"
            className="display mt-6 text-[clamp(3.2rem,14.5vw,5.6rem)] sm:text-[clamp(4.2rem,12vw,7.2rem)] lg:text-[clamp(4.2rem,6.4vw,7.3rem)]"
          >
            <Words text="Run your fleet." />
            <br />
            <Words text="Move your business" className="text-brand" /> <Words text="forward." />
          </h1>
          <p className="hero-fade mt-7 max-w-[560px] text-[17px] leading-relaxed text-ink/75 sm:text-lg">
            Monitor documents, trips, fuel, maintenance and driver payments from one place. Get clear alerts, useful
            reports and the information you need to make faster decisions.
          </p>
          <div className="hero-fade mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button href={WHATSAPP_HREF} variant="brand" icon="chat" cursor="Book" sound="send" hoverSound="focus" data-umami-event-source="hero">
                Book a demo on WhatsApp
              </Button>
            </Magnetic>
            <Button href="/demo.html" variant="ghost" icon="arrow-up-right" cursor="Try demo" sound="play" hoverSound="select" data-umami-event="demo_open" data-umami-event-source="hero">
              Try the interactive demo
            </Button>
          </div>
          <ul className="hero-fade mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-medium text-ink/75">
            {["Real-time fleet status", "WhatsApp and email alerts", "Reports that help cut costs"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-brand text-white">
                  <Icon name="check" size={12} stroke={2.6} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-papers relative z-10 mt-4 lg:mt-0 lg:h-[min(78vh,760px)]">
          <div ref={stage} className="relative h-[410px] w-full min-[520px]:h-[520px] lg:h-full">
            <div className={cn("absolute inset-0 transition-opacity duration-300", gl === "ready" && "opacity-0")}>
              <PaperPoster />
            </div>
            <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/50 lg:bottom-8">
              Hover to lift · click to wiggle
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-5 hidden items-center gap-3 sm:left-8 lg:left-12 lg:flex" aria-hidden="true">
          <span className="relative block h-10 w-px overflow-hidden bg-ink/20 scroll-cue" />
          <span className="eyebrow text-ink/65">Scroll</span>
        </div>
      </div>
    </section>
  );
}
