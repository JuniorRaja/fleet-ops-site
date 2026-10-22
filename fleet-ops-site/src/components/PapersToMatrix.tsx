import { useLayoutEffect, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icons";
import { PAPER_DOCS, PaperCard } from "@/components/ui/PaperCard";
import { STATUS_META, StatusDot } from "@/components/ui/StatusDot";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { DOC_META, DOC_ORDER, VEHICLES, fmtDate, fmtShort, statusOf } from "@/lib/fleet";

const ROWS = VEHICLES.slice(0, 5);
const HOLD_PLATE = "TN 00 GH 7714";

/** Where each paper rests on the desk, and how high / how tilted it lifts. */
const SLOTS = [
  { l: 17, t: 66, rot: -10, lift: 130, tiltX: -16, tiltY: 10 },
  { l: 34, t: 54, rot: 6, lift: 210, tiltX: -20, tiltY: -8 },
  { l: 51, t: 70, rot: -4, lift: 90, tiltX: -12, tiltY: 6 },
  { l: 66, t: 52, rot: 11, lift: 250, tiltX: -22, tiltY: -12 },
  { l: 83, t: 68, rot: -8, lift: 160, tiltX: -14, tiltY: 9 },
  { l: 44, t: 84, rot: 5, lift: 190, tiltX: -18, tiltY: -6 },
];

const REST = "0 1px 1px 0px rgba(11,15,13,.3), 0 3px 6px 0px rgba(11,15,13,.14)";
const SMALL = "0 6px 10px -4px rgba(11,15,13,.28), 0 1px 2px 0px rgba(11,15,13,.2)";
const BIG = "0 70px 70px -26px rgba(11,15,13,.42), 0 26px 30px -14px rgba(11,15,13,.22)";

const COLS = "grid-cols-[92px_repeat(6,minmax(0,1fr))] sm:grid-cols-[190px_repeat(6,minmax(0,1fr))]";

function HoldBadge() {
  return (
    <span
      aria-label="Document hold"
      className="s4-badge mt-0.5 inline-flex items-center gap-1 rounded-full bg-[#fde4e2] px-2 py-1 text-[10px] font-semibold leading-none text-[#a4191a] sm:text-[11px]"
    >
      <Icon name="lock" size={11} aria-hidden="true" />
      <span aria-hidden="true" className="sm:hidden">
        Hold
      </span>
      <span aria-hidden="true" className="hidden sm:inline">
        Document hold
      </span>
    </span>
  );
}

function MatrixPanel() {
  return (
    <div
      role="table"
      aria-label="Compliance matrix: five vehicles by six papers"
      className="s4-panel overflow-hidden rounded-[24px] border border-ink/10 bg-white/92 shadow-[0_50px_100px_-50px_rgba(11,15,13,.6)] backdrop-blur"
    >
      <div role="row" className={`grid h-[64px] items-center border-b border-ink/10 ${COLS}`}>
        <div role="columnheader" className="eyebrow px-3 text-ink/65 sm:px-5">
          Vehicle
        </div>
        {PAPER_DOCS.map((d) => (
          <div key={d.id} role="columnheader" className="s4-head grid h-full place-items-center px-0.5 text-center">
            <span className="s4-head-label text-[11px] font-semibold sm:text-[13px]">
              <span className="sm:hidden">{DOC_META[d.id].abbr}</span>
              <span className="hidden sm:inline">{d.short}</span>
            </span>
          </div>
        ))}
      </div>
      {ROWS.map((v) => {
        const [a, b, ...rest] = v.plate.split(" ");
        return (
          <div
            key={v.plate}
            role="row"
            className={`s4-row grid h-[60px] items-center border-b border-ink/10 last:border-b-0 ${COLS}`}
          >
            <div role="rowheader" className="min-w-0 px-3 sm:px-5">
              <p className="font-mono text-[11px] font-semibold leading-tight sm:text-[13px]">
                <span className="block sm:inline">
                  {a} {b}
                </span>{" "}
                <span>{rest.join(" ")}</span>
              </p>
              {v.plate === HOLD_PLATE ? (
                <HoldBadge />
              ) : (
                <p className="hidden truncate text-xs text-ink/60 sm:block">{v.kind}</p>
              )}
            </div>
            {DOC_ORDER.map((id) => {
              const e = v.docs[id];
              const st = statusOf(id, e);
              return (
                <div
                  key={id}
                  role="cell"
                  aria-label={`${DOC_META[id].short}: ${STATUS_META[st].label}, ${fmtDate(e.expiry)}`}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <StatusDot status={st} size={22} />
                  <span aria-hidden="true" className="hidden text-[11px] text-ink/65 sm:block">
                    {fmtShort(e.expiry)}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const CAPTION = "On hold for papers. It goes out only with a written reason.";

export function PapersToMatrix() {
  const { pin } = useMotion();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!pin || !root.current) return;
    const el = root.current;
    const ctx = gsap.context(() => {
      const q = <T extends HTMLElement>(s: string) => Array.from(el.querySelectorAll<T>(s));
      const stage = el.querySelector<HTMLElement>(".s4-stage")!;
      const slots = q(".s4-slot");
      const papers = q(".s4-paper");
      const shadows = q(".s4-shadow");
      const heads = q(".s4-head");
      const labels = q(".s4-head-label");
      const rows = q(".s4-row");
      const panel = el.querySelector(".s4-panel");
      const badge = el.querySelector(".s4-badge");
      const caption = el.querySelector(".s4-caption");

      const geo = (i: number) => {
        const sr = stage.getBoundingClientRect();
        const hr = heads[i].getBoundingClientRect();
        const slot = slots[i];
        return {
          dx: hr.left - sr.left + hr.width / 2 - (slot.offsetLeft + slot.offsetWidth / 2),
          dy: hr.top - sr.top + hr.height / 2 - (slot.offsetTop + slot.offsetHeight / 2),
          s: Math.min((hr.height * 0.9) / 196, (hr.width * 0.75) / 148),
        };
      };

      gsap.set(papers, { rotation: (i: number) => SLOTS[i].rot, boxShadow: REST });
      gsap.set(shadows, { opacity: 0.5 });
      gsap.set(panel, { opacity: 0.16 });
      gsap.set(labels, { opacity: 0 });
      gsap.set(rows, { opacity: 0, y: 18 });
      gsap.set(el.querySelectorAll(".s4-row .dot-fill"), { scale: 0 });
      gsap.set(el.querySelectorAll(".s4-row .dot-glyph"), { opacity: 0 });
      gsap.set(badge, { opacity: 0, scale: 0.85 });
      gsap.set(caption, { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1 · lift off the desk at different depths, shadows growing
      papers.forEach((p, i) => {
        const s = SLOTS[i];
        tl.to(p, { z: s.lift, rotationX: s.tiltX, rotationY: s.tiltY, boxShadow: BIG, duration: 1 }, i * 0.07).to(
          shadows[i],
          { x: s.lift * 0.22, y: s.lift * 0.3, scale: 1.2 + s.lift / 260, opacity: 0.22, duration: 1 },
          i * 0.07
        );
      });
      tl.to(panel, { opacity: 1, duration: 0.8 }, 1.2);

      // 2 · straighten, shrink, fly into the six column headers
      papers.forEach((p, i) => {
        const at = 1.35 + i * 0.07;
        tl.to(
          p,
          {
            z: 0,
            rotationX: 0,
            rotationY: 0,
            rotation: 0,
            scale: () => geo(i).s,
            x: () => geo(i).dx,
            y: () => geo(i).dy,
            boxShadow: SMALL,
            duration: 1.15,
            ease: "power3.inOut",
          },
          at
        )
          .to(shadows[i], { opacity: 0, duration: 0.4, ease: "none" }, at)
          .to(p, { opacity: 0, duration: 0.22, ease: "none" }, at + 1.0)
          .to(labels[i], { opacity: 1, duration: 0.25, ease: "none" }, at + 0.95);
      });

      // 3 · rows reveal top to bottom, dots fill with status colours
      rows.forEach((r, i) => {
        const at = 3.0 + i * 0.4;
        tl.to(r, { opacity: 1, y: 0, duration: 0.35 }, at)
          .to(r.querySelectorAll(".dot-fill"), { scale: 1, duration: 0.3, stagger: 0.05 }, at + 0.1)
          .to(r.querySelectorAll(".dot-glyph"), { opacity: 1, duration: 0.2, stagger: 0.05 }, at + 0.25);
      });

      // 4 · the hold row speaks
      tl.to(badge, { opacity: 1, scale: 1, duration: 0.3 }, 4.55).to(caption, { opacity: 1, y: 0, duration: 0.4 }, 4.9);
      tl.to({}, { duration: 0.5 });
    }, root);
    return () => ctx.revert();
  }, [pin]);

  if (pin) {
    return (
      <section id="matrix-scene" ref={root} aria-labelledby="s4-title" className="relative bg-paper">
        <div className="s4-stage relative h-screen overflow-hidden">
          <div className="desk-surface absolute inset-0" aria-hidden="true" />
          <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-8 pt-16">
            <div className="mb-6 flex items-end justify-between gap-10">
              <div>
                <p className="eyebrow text-brand">The matrix</p>
                <h2 id="s4-title" className="display mt-3 text-[clamp(2.4rem,4.6vw,4.4rem)]">
                  Six papers. One matrix.
                </h2>
              </div>
              <p className="max-w-[300px] pb-1 text-[15px] leading-relaxed text-ink/70">
                Every certificate on the desk becomes a column. Every vehicle becomes a row you can read in a second.
              </p>
            </div>
            <MatrixPanel />
            <p className="s4-caption mt-5 flex items-center gap-3 text-[15px] font-semibold">
              <span className="grid size-8 place-items-center rounded-full bg-[#fde4e2] text-[#a4191a]">
                <Icon name="lock" size={15} />
              </span>
              {CAPTION}
            </p>
          </div>

          <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
            {PAPER_DOCS.map((doc, i) => {
              const s = SLOTS[i];
              return (
                <div
                  key={doc.id}
                  className="s4-slot absolute"
                  style={{
                    left: `${s.l}%`,
                    top: `${s.t}%`,
                    width: 148,
                    height: 196,
                    marginLeft: -74,
                    marginTop: -98,
                    perspective: 1100,
                  }}
                >
                  <div
                    className="s4-shadow absolute left-3 right-3 top-[68%] h-[44%] rounded-full bg-ink/70"
                    style={{ filter: "blur(18px)" }}
                  />
                  <PaperCard doc={doc} className="s4-paper absolute inset-0" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="matrix-scene" aria-labelledby="s4-title" className="relative overflow-hidden bg-paper py-20 sm:py-28">
      <div className="desk-surface absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow text-brand">The matrix</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 id="s4-title" className="display mt-3 text-[clamp(2.4rem,9vw,4.4rem)]">
            Six papers. One matrix.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink/70">
            Every certificate on the desk becomes a column. Every vehicle becomes a row you can read in a second.
          </p>
        </Reveal>

        <Reveal className="mt-10" data-asset="PAPER-DOC-SET-01">
          <ul className="grid grid-cols-3 justify-items-center gap-y-6 sm:grid-cols-6" aria-label="The six papers">
            {PAPER_DOCS.map((doc, i) => (
              <li
                key={doc.id}
                className="relative h-[118px] w-[89px] sm:h-[147px] sm:w-[111px]"
                style={{ transform: `rotate(${SLOTS[i].rot / 2}deg)` }}
              >
                <PaperCard
                  doc={doc}
                  className="absolute left-0 top-0 origin-top-left scale-[0.6] shadow-[0_18px_24px_-12px_rgba(11,15,13,.4)] sm:scale-[0.75]"
                />
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-10" delay={80}>
          <MatrixPanel />
        </Reveal>
        <Reveal className="mt-5" delay={120}>
          <p className="flex items-center gap-3 text-[15px] font-semibold">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fde4e2] text-[#a4191a]">
              <Icon name="lock" size={15} />
            </span>
            {CAPTION}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
