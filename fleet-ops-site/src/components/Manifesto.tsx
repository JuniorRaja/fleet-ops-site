import { useLayoutEffect, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icons";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

const TEXT =
  "A lapsed fitness certificate doesn't cost you a reminder. It costs you a day's trip, a fine at the checkpost, and a customer who stops calling.";
const HL = new Set(["lapsed", "fine", "trip,"]);

const PAINS: { icon: IconName; title: string; body: string }[] = [
  { icon: "file", title: "Papers in drawers", body: "Six documents a vehicle, spread across files, phones and one very tired clerk." },
  { icon: "calendar", title: "Dates in diaries", body: "Renewals tracked on a calendar nobody opens until the checkpost does." },
  { icon: "key", title: "Trips on trust", body: "A vehicle is sent out because it was needed. Nobody wrote down why." },
];

export function Manifesto() {
  const { motion } = useMotion();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!motion || !root.current) return;
    const ctx = gsap.context(() => {
      const words = Array.from(root.current!.querySelectorAll<HTMLElement>(".mw"));
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: root.current!.querySelector(".mtext"),
            start: "top 82%",
            end: "bottom 52%",
            scrub: true,
          },
        }
      );
      gsap.to(".m-ghost", {
        y: -30,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [motion]);

  const words = TEXT.split(" ");

  return (
    <section ref={root} aria-labelledby="manifesto-title" className="relative overflow-hidden bg-paper py-24 sm:py-32 lg:py-44">
      <div
        aria-hidden="true"
        className="m-ghost marquee-pause pointer-events-none absolute inset-x-0 top-6 select-none overflow-hidden"
      >
        <div className="marquee-track slow flex font-display text-[clamp(5rem,16vw,14rem)] font-extrabold leading-none tracking-tighter text-outline [--outline:rgba(11,15,13,0.13)]">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="pr-10">
              FITNESS · INSURANCE · PUC · PERMIT · RC · ROAD TAX ·
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow text-brand">The problem, plainly</p>
        </Reveal>
        <h2 id="manifesto-title" className="sr-only">
          What a lapsed paper really costs
        </h2>
        <p className="mtext display mt-8 max-w-[26ch] text-[clamp(2.2rem,6vw,5.8rem)] !leading-[1.02]">
          {words.map((w, i) => (
            <span key={i} className={`mw inline-block ${HL.has(w) ? "text-brand" : ""}`}>
              {w}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </p>

        <ul className="mt-16 grid gap-4 sm:grid-cols-3 lg:mt-24">
          {PAINS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 70} className="rounded-3xl border border-ink/10 bg-white/60 p-6 backdrop-blur">
              <span className="grid size-11 place-items-center rounded-2xl bg-ink text-lime">
                <Icon name={p.icon} />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
