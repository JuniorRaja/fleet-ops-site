import { useLayoutEffect, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Picture } from "@/components/ui/Picture";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { PHOTOS } from "@/lib/config";

const ITEMS = [
  {
    k: "Fewer fines",
    body: "Every paper has a date, a lead time and a reminder. The renewal gets booked while it is still calm and cheap.",
  },
  {
    k: "Fewer days in the shed",
    body: "Service due and workshop status sit beside the papers. A vehicle on the lift is never sent out by mistake.",
  },
  {
    k: "Cleaner audits",
    body: "Open the matrix, filter to expired, show the proof. An audit takes minutes, not a weekend of files.",
  },
  {
    k: "A name on every exception",
    body: "When a held vehicle has to go, the reason, the person and the time are saved with the trip.",
  },
];

export function Benefits() {
  const { motion } = useMotion();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!motion || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".b-img",
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: ".b-frame", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [motion]);

  return (
    <section ref={root} id="benefits" aria-labelledby="benefits-title" className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="eyebrow text-brand">Why operators switch</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 id="benefits-title" className="display mt-4 text-[clamp(2.5rem,5.6vw,5.2rem)]">
                What changes on Monday morning.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink/70">
                The same fleet, the same people, one clear answer to the question that starts every day: can this
                vehicle go?
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div
                className="b-frame relative mt-10 aspect-[4/3] overflow-hidden rounded-[28px] bg-ink-soft"
                data-asset="BENEFIT-IMG-01"
              >
                <div className="b-img absolute -inset-y-[8%] inset-x-0">
                  <Picture
                    src={PHOTOS.aerial}
                    alt="Aerial view of freight trucks parked in a yard"
                    width={1400}
                    height={900}
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" aria-hidden="true" />
                <p className="absolute bottom-4 left-5 right-5 font-display text-xl font-semibold text-paper">
                  Every vehicle in the yard has a status. Every status has a reason.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <ol className="lg:col-span-7">
          {ITEMS.map((b, i) => (
            <Reveal
              as="li"
              key={b.k}
              delay={i * 40}
              className="group grid grid-cols-[auto_1fr] gap-x-6 border-t border-ink/15 py-9 transition-[background,padding] duration-200 ease-out last:border-b hover:bg-white/60 sm:gap-x-10 sm:py-12 lg:hover:pl-4"
            >
              <span className="font-display text-5xl font-bold text-outline text-[2.6rem] leading-none [--outline:rgba(11,15,13,0.35)] sm:text-6xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="display text-[clamp(1.9rem,3.6vw,3.2rem)] !leading-[0.98] transition-colors duration-200 group-hover:text-brand">
                  {b.k}
                </h3>
                <p className="mt-4 max-w-[48ch] text-[17px] leading-relaxed text-ink/70">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
