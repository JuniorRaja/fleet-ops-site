import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

export function TripSheetPaper() {
  const host = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setNearby(entry.isIntersecting), {
      rootMargin: "25% 0px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return (
    <section id="trip-sheet" aria-labelledby="trip-sheet-title" className="on-dark overflow-hidden bg-ink py-24 text-paper sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <Reveal>
            <p className="eyebrow text-lime">One trip sheet</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 id="trip-sheet-title" className="display mt-4 text-[clamp(2.7rem,6vw,5.8rem)]">
              Turn paper into one clean record.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/70">
              Drag the sheet. One save updates trips, fuel, and driver accounts.
            </p>
          </Reveal>
        </div>

        <div ref={host} className="relative aspect-[4/5] min-h-[480px] overflow-hidden rounded-[32px] border border-white/12 bg-[#08080a] shadow-2xl">
          {nearby && visible ? (
            <iframe
              title="Interactive Fleet OPS trip sheet"
              src="/effects/3d-paper.html?v=3"
              sandbox="allow-scripts"
              loading="lazy"
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-paper/45">Interactive trip sheet</div>
          )}
        </div>
      </div>
    </section>
  );
}
