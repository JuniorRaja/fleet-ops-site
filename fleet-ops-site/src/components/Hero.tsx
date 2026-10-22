import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Icon } from "@/components/ui/Icons";
import { StatusChip } from "@/components/ui/StatusDot";
import { PaperPoster } from "@/components/PaperPoster";
import { gsap, scrollToId } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { WHATSAPP_HREF } from "@/lib/config";
import { DOC_META, attentionList, complianceSummary, dueLabel } from "@/lib/fleet";
import { cn } from "@/utils/cn";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

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

function HeroBoard() {
  const { pct, clear, total } = complianceSummary();
  const rows = attentionList(3);
  return (
    <aside
      aria-label="Example compliance board"
      className="hero-board glass relative z-30 w-full rounded-[28px] p-4 sm:max-w-[420px] sm:p-5 lg:absolute lg:bottom-10 lg:right-10 lg:w-[410px]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-ink/65">Fleet compliance</p>
        <span className="rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink/65">
          Example data
        </span>
      </div>
      <div className="mt-3 flex items-end gap-3">
        <span className="font-display text-5xl font-bold leading-none tracking-tight text-[#c42222]">{pct}%</span>
        <span className="pb-1 text-sm text-ink/70">
          {clear} of {total} vehicles clear
        </span>
      </div>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-[#c42222]/25"
        role="img"
        aria-label={`${clear} of ${total} vehicles have no expired paper`}
      >
        <div className="hero-fill h-full origin-left rounded-full bg-valid" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-5 text-sm font-semibold">Needs attention</p>
      <ul className="mt-1 divide-y divide-ink/10">
        {rows.map((r) => (
          <li key={r.plate + r.doc} className="hero-row flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 py-2.5">
            <div>
              <p className="font-mono text-[12px] font-semibold tracking-tight">{r.plate}</p>
              <p className="text-[13px] text-ink/65">{DOC_META[r.doc].short}</p>
            </div>
            <StatusChip status={r.status}>{dueLabel(r.days)}</StatusChip>
          </li>
        ))}
      </ul>
    </aside>
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
      gsap.from(".hero-board", { opacity: 0, y: 28, duration: 0.6, ease: "power2.out", delay: 0.75 });
      gsap.from(".hero-fill", { scaleX: 0, duration: 0.9, ease: "power2.out", delay: 1.1 });
      gsap.from(".hero-row", { opacity: 0, x: -10, duration: 0.4, ease: "power2.out", stagger: 0.1, delay: 1.0 });
      if (pin) {
        const trig = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-copy", { y: -30, ease: "none", scrollTrigger: trig });
        gsap.to(".hero-board", { y: 30, ease: "none", scrollTrigger: trig });
      }
    }, root);
    return () => ctx.revert();
  }, [motion, pin]);

  return (
    <section id="top" ref={root} aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="desk-surface absolute inset-0 -z-20" aria-hidden="true" />
      <div className="grain absolute inset-0 -z-10" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1480px] flex-col justify-center px-5 pb-12 pt-28 sm:px-8 lg:px-12 lg:pb-24">
        <div className="hero-copy relative z-20 max-w-[880px] lg:max-w-[1120px]">
          <p className="hero-fade eyebrow inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-white/60 py-2 pl-3 pr-4 text-ink/80 backdrop-blur">
            <span className="relative grid size-2 place-items-center text-valid">
              <span className="pulse-dot relative size-2 rounded-full bg-valid" />
            </span>
            Compliance &amp; maintenance. Not tracking.
          </p>
          <h1
            id="hero-title"
            className="display mt-6 text-[clamp(3.2rem,14.5vw,5.6rem)] sm:text-[clamp(4.2rem,12vw,7.6rem)] lg:text-[clamp(4.4rem,7.6vw,9rem)]"
          >
            <Words text="Papers in order." />
            <br />
            <Words text="Wheels" className="text-brand" /> <Words text="on road." />
          </h1>
          <p className="hero-fade mt-7 max-w-[560px] text-[17px] leading-relaxed text-ink/75 sm:text-lg">
            Fleet OPS watches the six papers behind every lorry, trailer and bus: fitness, insurance, PUC, permit, RC
            and road tax. It warns you before they lapse and stops an unfit vehicle leaving the yard without a written
            reason.
          </p>
          <div className="hero-fade mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button href={WHATSAPP_HREF} variant="brand" icon="chat" cursor="Book">
                Book a demo on WhatsApp
              </Button>
            </Magnetic>
            <Button variant="ghost" icon="arrow-down" onClick={() => scrollToId("matrix-scene")} cursor="See matrix">
              See the compliance matrix
            </Button>
          </div>
          <ul className="hero-fade mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-medium text-ink/75">
            {["Six papers, every vehicle", "Lead-time warnings", "Every override has a name"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-brand text-white">
                  <Icon name="check" size={12} stroke={2.6} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 mt-10 lg:absolute lg:inset-y-0 lg:right-[-3%] lg:mt-0 lg:w-[62%]">
          <div ref={stage} className="relative h-[340px] w-full min-[520px]:h-[440px] lg:h-full">
            <div className={cn("absolute inset-0 transition-opacity duration-300", gl === "ready" && "opacity-0")}>
              <PaperPoster />
            </div>
          </div>
        </div>

        <div className="relative z-30 mt-6 lg:static lg:mt-0">
          <HeroBoard />
        </div>

        <div className="absolute bottom-6 left-5 hidden items-center gap-3 sm:left-8 lg:left-12 lg:flex" aria-hidden="true">
          <span className="relative block h-10 w-px overflow-hidden bg-ink/20 scroll-cue" />
          <span className="eyebrow text-ink/65">Scroll</span>
        </div>
      </div>
    </section>
  );
}
