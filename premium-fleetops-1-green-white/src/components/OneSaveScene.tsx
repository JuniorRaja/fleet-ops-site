import { useLayoutEffect, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icons";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { cn } from "@/utils/cn";

const FIELDS: { label: string; value: string; span?: boolean }[] = [
  { label: "Route", value: "Chennai Port → Sriperumbudur", span: true },
  { label: "KM", value: "142" },
  { label: "Diesel ₹", value: "3,420" },
  { label: "Litres", value: "38.0" },
  { label: "Toll ₹", value: "410" },
  { label: "Batta ₹", value: "800" },
  { label: "Advance ₹", value: "2,000" },
  { label: "Container no.", value: "MSKU 482913 7", span: true },
];

const RESULTS: { icon: IconName; title: string; line: string }[] = [
  { icon: "route", title: "Trips", line: "142 km closed · ₹32.6 per km" },
  { icon: "fuel", title: "Fuel log", line: "38 L diesel · 3.74 km per litre" },
  { icon: "user", title: "Driver account", line: "Advance ₹2,000 · batta ₹800" },
];

const CAPTION = "Saved together, or not at all.";

function TripSlip({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-asset="PAPER-SLIP-01"
      className={cn("relative h-full overflow-hidden rounded-[12px] bg-[#f6efd8] p-6 text-[#1f2f6b] shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]", className)}
      style={{ backgroundImage: "repeating-linear-gradient(transparent 0 31px, rgba(31,47,107,.16) 31px 32px)" }}
    >
      <div className="flex items-start justify-between">
        <p className="font-display text-2xl font-extrabold uppercase tracking-tight text-[#b3261e]">Trip slip</p>
        <p className="font-mono text-xs font-semibold">No. 0417</p>
      </div>
      <div className="mt-5 space-y-[9px] font-mono text-[15px] italic leading-[23px]">
        <p>Chennai Port to Sriperumbudur</p>
        <p>KM 142 &nbsp; Diesel 3,420 / 38 L</p>
        <p>Toll 410 &nbsp; Batta 800</p>
        <p>Adv. 2,000</p>
        <p>Cont. MSKU 482913 7</p>
        <p className="pt-2 text-right not-italic">~ Selvam</p>
      </div>
      <p className="absolute bottom-3 left-6 font-mono text-[9px] uppercase tracking-[0.14em] text-[#1f2f6b]/60">PAPER-SLIP-01 · placeholder</p>
    </div>
  );
}

function PanelSheet() {
  return (
    <div className="s5-panel rounded-[28px] bg-paper p-5 text-ink shadow-[0_50px_100px_-40px_rgba(0,0,0,.9)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-xl font-bold">Trip sheet</p>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/65">TRIP-0417 · 13 Oct</span>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2.5">
        {FIELDS.map((f) => (
          <div key={f.label} className={cn("s5-field rounded-xl border border-ink/15 bg-white px-3 py-2.5", f.span && "col-span-3")}>
            <dt className="eyebrow text-[10px] text-ink/65">{f.label}</dt>
            <dd className="mt-1 overflow-hidden">
              <span className="s5-val inline-block font-semibold">{f.value}</span>
            </dd>
          </div>
        ))}
      </dl>
      <div
        aria-hidden="true"
        className="s5-btn mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-[15px] font-semibold text-paper"
      >
        <Icon name="check" size={17} />
        Save and close
      </div>
    </div>
  );
}

function ResultCard({ r }: { r: (typeof RESULTS)[number] }) {
  return (
    <div className="s5-card glass-dark flex items-center gap-4 rounded-2xl p-4 text-paper">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-lime text-ink">
        <Icon name={r.icon} />
      </span>
      <div className="min-w-0">
        <p className="font-display text-xl font-bold leading-tight">{r.title}</p>
        <p className="mt-0.5 text-sm text-paper/75">{r.line}</p>
      </div>
      <span className="ml-auto grid size-7 shrink-0 place-items-center rounded-full bg-lime text-ink" aria-hidden="true">
        <Icon name="check" size={15} stroke={2.8} />
      </span>
    </div>
  );
}

export function OneSaveScene() {
  const { pin } = useMotion();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!pin || !root.current) return;
    const el = root.current;
    let layoutFn: (() => void) | null = null;
    const ctx = gsap.context(() => {
      const wrap = el.querySelector<HTMLElement>(".s5-wrap")!;
      const slip = el.querySelector<HTMLElement>(".s5-slip")!;
      const panel = el.querySelector<HTMLElement>(".s5-panel")!;
      const btn = el.querySelector<HTMLElement>(".s5-btn")!;
      const caption = el.querySelector<HTMLElement>(".s5-caption")!;
      const vals = Array.from(el.querySelectorAll<HTMLElement>(".s5-val"));
      const cards = Array.from(el.querySelectorAll<HTMLElement>(".s5-card"));
      const paths = Array.from(el.querySelectorAll<SVGPathElement>(".s5-line"));
      const dots = Array.from(el.querySelectorAll<SVGCircleElement>(".s5-end"));

      const box = (n: HTMLElement) => {
        let x = 0;
        let y = 0;
        let c: HTMLElement | null = n;
        while (c && c !== wrap) {
          x += c.offsetLeft;
          y += c.offsetTop;
          c = c.offsetParent as HTMLElement | null;
        }
        return { x, y, w: n.offsetWidth, h: n.offsetHeight };
      };
      const layout = () => {
        const b = box(btn);
        const sx = b.x + b.w;
        const sy = b.y + b.h / 2;
        cards.forEach((c, i) => {
          const t = box(c);
          const ex = t.x;
          const ey = t.y + t.h / 2;
          const mx = sx + (ex - sx) * 0.5;
          paths[i].setAttribute("d", `M${sx} ${sy} C${mx} ${sy}, ${mx} ${ey}, ${ex} ${ey}`);
          dots[i].setAttribute("cx", String(ex));
          dots[i].setAttribute("cy", String(ey));
        });
      };
      layout();
      layoutFn = layout;
      ScrollTrigger.addEventListener("refreshInit", layout);

      gsap.set(slip, { rotation: -4 });
      gsap.set(panel, { opacity: 0, scale: 0.96 });
      gsap.set(vals, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(cards, { opacity: 0, x: -40 });
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(dots, { opacity: 0 });
      gsap.set(caption, { opacity: 0, y: 14 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=150%", pin: true, scrub: 0.6, anticipatePin: 1 },
      });
      // 1 · the paper slip crossfades into the trip sheet
      tl.to(slip, { opacity: 0, rotation: 0, scale: 1.02, duration: 0.8, ease: "power2.inOut" }, 0).to(
        panel,
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.inOut" },
        0.1
      );
      // 2 · fields fill in order
      vals.forEach((v, i) => tl.to(v, { clipPath: "inset(0 0% 0 0)", duration: 0.3, ease: "none" }, 1.0 + i * 0.28));
      // 3 · Save and close is pressed
      tl.to(btn, { scale: 0.95, duration: 0.15 }, 3.4).to(
        btn,
        { scale: 1, backgroundColor: "#c9f26b", color: "#0b0f0d", duration: 0.25 },
        3.55
      );
      // 4 · three cards slide out, lines draw to them
      cards.forEach((c, i) => {
        const at = 3.9 + i * 0.35;
        tl.to(paths[i], { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" }, at)
          .to(dots[i], { opacity: 1, duration: 0.1 }, at + 0.5)
          .to(c, { opacity: 1, x: 0, duration: 0.5 }, at + 0.4);
      });
      tl.to(caption, { opacity: 1, y: 0, duration: 0.5 }, 5.5);
      tl.to({}, { duration: 0.4 });
    }, root);
    return () => {
      if (layoutFn) ScrollTrigger.removeEventListener("refreshInit", layoutFn);
      ctx.revert();
    };
  }, [pin]);

  const head = (
    <>
      <p className="eyebrow text-lime">One save</p>
      <h2 id="s5-title" className="display mt-3 text-[clamp(2.4rem,4vw,3.9rem)]">
        Press save once.
        <br />
        <span className="text-lime">Everything follows.</span>
      </h2>
    </>
  );

  const backdrop = (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[700px] rounded-full bg-[radial-gradient(circle,rgba(201,242,107,.2),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[clamp(8rem,22vw,22rem)] font-extrabold leading-none tracking-tighter text-outline [--outline:rgba(255,255,255,0.06)]"
      >
        ONE SAVE
      </div>
      <div className="grain grain-light pointer-events-none absolute inset-0" aria-hidden="true" />
    </>
  );

  if (pin) {
    return (
      <section id="one-save" ref={root} aria-labelledby="s5-title" className="on-dark relative bg-ink text-paper">
        <div className="relative flex h-screen items-center overflow-hidden">
          {backdrop}
          <div className="relative mx-auto w-full max-w-7xl px-8 pt-14">
            <div className="mb-8 flex items-end justify-between gap-10">
              <div>{head}</div>
              <p className="s5-caption max-w-[14ch] pb-2 text-right font-display text-[clamp(1.6rem,2.6vw,2.6rem)] font-bold leading-[1.02] tracking-tight text-lime">
                {CAPTION}
              </p>
            </div>
            <div className="s5-wrap relative grid grid-cols-[1.05fr_0.5fr_0.95fr] items-center">
              <div className="grid">
                <div className="[grid-area:1/1]">
                  <PanelSheet />
                </div>
                <div className="s5-slip [grid-area:1/1]">
                  <TripSlip />
                </div>
              </div>
              <div aria-hidden="true" />
              <div className="grid gap-3.5">
                {RESULTS.map((r) => (
                  <ResultCard key={r.title} r={r} />
                ))}
              </div>
              <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                {RESULTS.map((r) => (
                  <g key={r.title}>
                    <path className="s5-line" pathLength={1} fill="none" stroke="#c9f26b" strokeWidth="2" strokeLinecap="round" />
                    <circle className="s5-end" r="4.5" fill="#c9f26b" />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="one-save" aria-labelledby="s5-title" className="on-dark relative overflow-hidden bg-ink py-20 text-paper sm:py-28">
      {backdrop}
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>{head}</Reveal>
        <ol className="mt-12 grid justify-items-center gap-5">
          <Reveal as="li" className="w-full max-w-sm" style={{ rotate: "-2deg" }}>
            <TripSlip className="min-h-[300px]" />
          </Reveal>
          <li aria-hidden="true" className="grid size-10 place-items-center rounded-full border border-white/20 text-lime">
            <Icon name="arrow-down" size={18} />
          </li>
          <Reveal as="li" className="w-full">
            <PanelSheet />
          </Reveal>
          <li aria-hidden="true" className="grid size-10 place-items-center rounded-full border border-white/20 text-lime">
            <Icon name="arrow-down" size={18} />
          </li>
          <li className="grid w-full gap-3">
            {RESULTS.map((r, i) => (
              <Reveal key={r.title} delay={i * 70}>
                <ResultCard r={r} />
              </Reveal>
            ))}
          </li>
        </ol>
        <Reveal>
          <p className="mt-10 font-display text-3xl font-bold tracking-tight">{CAPTION}</p>
        </Reveal>
      </div>
    </section>
  );
}
