import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icons";
import { StatusChip } from "@/components/ui/StatusDot";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { DOC_META, DOC_ORDER, VEHICLES, daysFrom, statusOf } from "@/lib/fleet";
import { STATUS_META } from "@/components/ui/StatusDot";

/* ---------- Visual panels (illustrative; the text beside them carries the meaning) ---------- */

function PanelCapture() {
  const rows = [
    ["Vehicle", "TN 00 CD 3307"],
    ["Paper", "PUC (emission test)"],
    ["New expiry", "2 Oct 2027"],
  ];
  return (
    <div aria-hidden="true" className="rounded-[28px] border border-ink/10 bg-white p-5 shadow-[0_40px_80px_-40px_rgba(11,15,13,.5)] sm:p-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-xl font-bold">Add a paper</p>
        <span className="rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/65">Step 1 of 1</span>
      </div>
      <dl className="mt-5 grid gap-3">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-ink/10 bg-paper/60 px-4 py-3">
            <dt className="eyebrow text-ink/60">{k}</dt>
            <dd className="mt-1 font-semibold">{v}</dd>
          </div>
        ))}
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-brand/50 bg-brand/5 px-4 py-3">
          <span className="grid size-10 place-items-center rounded-xl bg-brand text-white">
            <Icon name="file" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[13px] font-semibold">puc_oct26.pdf</p>
            <p className="text-xs text-ink/65">1.2 MB · proof attached</p>
          </div>
          <Icon name="check" className="text-brand" />
        </div>
      </dl>
      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3.5 text-paper">
        <span className="text-sm font-semibold">Save paper</span>
        <span className="font-mono text-[11px] text-lime">first reminder: 25 Sep 2027</span>
      </div>
    </div>
  );
}

function PanelWarn() {
  const v = VEHICLES[1];
  const SCALE = 120;
  return (
    <div aria-hidden="true" className="rounded-[28px] border border-ink/10 bg-white p-5 shadow-[0_40px_80px_-40px_rgba(11,15,13,.5)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold">{v.plate}</p>
          <p className="text-xs text-ink/65">Days left against each paper's lead time</p>
        </div>
        <StatusChip status="expired">1 expired</StatusChip>
      </div>
      <ul className="mt-5 grid gap-3.5">
        {DOC_ORDER.map((id) => {
          const e = v.docs[id];
          const st = statusOf(id, e);
          const days = daysFrom(e.expiry);
          const pct = (Math.max(0, Math.min(days, SCALE)) / SCALE) * 100;
          const leadPct = (DOC_META[id].lead / SCALE) * 100;
          return (
            <li key={id} className="grid grid-cols-[72px_1fr_52px] items-center gap-3 text-sm">
              <span className="font-medium">{DOC_META[id].short}</span>
              <span className="relative h-2.5 rounded-full bg-ink/10">
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${pct}%`, background: STATUS_META[st].bg }}
                />
                <span className="absolute -inset-y-1 w-px bg-ink/45" style={{ left: `${leadPct}%` }} />
              </span>
              <span className="text-right font-mono text-xs text-ink/70">{days < 0 ? `${days} d` : `${days >= SCALE ? SCALE + "+" : days} d`}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 flex items-center gap-2 text-xs text-ink/65">
        <span className="inline-block h-3 w-px bg-ink/45" /> lead time marker
      </p>
      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#e9f7ef] p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-white">
          <Icon name="bell" size={17} />
        </span>
        <p className="text-sm leading-snug">
          <span className="font-semibold">WhatsApp reminder · 8:00 AM</span>
          <br />
          Fitness for {v.plate} is 7 days from expiry. Book the test.
        </p>
      </div>
    </div>
  );
}

function PanelGate() {
  return (
    <div aria-hidden="true" className="rounded-[28px] border border-ink/10 bg-white p-5 shadow-[0_40px_80px_-40px_rgba(11,15,13,.5)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold">TN 00 GH 7714</p>
          <p className="text-xs text-ink/65">Lorry · BharatBenz 3523R</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fde4e2] px-3 py-1.5 text-xs font-semibold text-[#a4191a]">
          <Icon name="lock" size={13} /> Document hold
        </span>
      </div>
      <p className="mt-4 rounded-2xl bg-[#fff5f4] p-4 text-sm leading-snug text-[#7d1416]">
        Put on hold by Ravi, 12 Oct: insurance expired, renewal pending
      </p>
      <div className="mt-4">
        <p className="eyebrow text-ink/60">Why is it being dispatched anyway?</p>
        <div className="mt-2 flex h-20 items-start rounded-2xl border border-ink/15 bg-paper/60 px-4 py-3 text-sm text-ink/50">
          Required. Type the reason to continue.
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-ink/10 px-4 py-3.5 text-ink/55">
        <span className="text-sm font-semibold">Save trip</span>
        <Icon name="lock" size={16} />
      </div>
    </div>
  );
}

const STEPS: { n: string; kicker: string; title: string; body: string; points: string[]; Panel: () => ReactNode }[] = [
  {
    n: "01",
    kicker: "Capture",
    title: "Log each paper once.",
    body: "Add the six papers behind every vehicle with their expiry dates and a photo of the proof. Fleet OPS already knows each paper's lead time.",
    points: ["Fitness, insurance, PUC, permit, RC, road tax", "Driver licences flagged 30 days ahead", "Proof attached to the date it supports"],
    Panel: PanelCapture,
  },
  {
    n: "02",
    kicker: "Warn",
    title: "Hear about it before the officer does.",
    body: "Reminders start at each paper's own lead time: 7 days for PUC, 45 for the permit. Renewed but no proof yet? It stays flagged as pending proof.",
    points: ["Valid, expiring soon, pending proof, expired", "Reminders to the in-charge on WhatsApp or email", "One matrix to see the whole fleet at once"],
    Panel: PanelWarn,
  },
  {
    n: "03",
    kicker: "Gate",
    title: "Hold what is not fit to roll.",
    body: "A vehicle on document hold, or in the workshop, can still go out, but only with a written reason. The name, role, time and reason are saved with the trip.",
    points: ["Document hold and workshop status guard dispatch", "No second trip for a vehicle already out", "In-charge renews; only the owner can override a hold"],
    Panel: PanelGate,
  },
];

function StepText({ s }: { s: (typeof STEPS)[number] }) {
  return (
    <>
      <p className="eyebrow flex items-center gap-3 text-brand">
        <span className="font-display text-sm font-bold tracking-normal text-ink">{s.n}</span>
        <span className="h-px w-8 bg-brand/50" />
        {s.kicker}
      </p>
      <h3 className="display mt-4 text-[clamp(2rem,4.2vw,3.9rem)]">{s.title}</h3>
      <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink/75">{s.body}</p>
      <ul className="mt-6 grid gap-2.5">
        {s.points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-[15px] text-ink/85">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-lime">
              <Icon name="check" size={12} stroke={2.6} />
            </span>
            {p}
          </li>
        ))}
      </ul>
    </>
  );
}

export function HowItWorks() {
  const { pin } = useMotion();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!pin || !root.current) return;
    const el = root.current;
    const ctx = gsap.context(() => {
      const steps = Array.from(el.querySelectorAll<HTMLElement>(".s3-step"));
      const panels = Array.from(el.querySelectorAll<HTMLElement>(".s3-panel"));
      const ticks = Array.from(el.querySelectorAll<HTMLElement>(".s3-tick"));
      gsap.set(steps.slice(1), { opacity: 0, y: 40 });
      gsap.set(panels.slice(1), { opacity: 0, y: 50, scale: 0.96 });
      gsap.set(ticks.slice(1), { opacity: 0.35 });
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=300%", pin: true, scrub: 0.5, anticipatePin: 1 },
      });
      tl.fromTo(
        el.querySelector(".s3-fill"),
        { scaleY: 0 },
        { scaleY: 1, ease: "none", duration: 2.9 },
        0
      );
      for (let i = 1; i < steps.length; i++) {
        tl.to(steps[i - 1], { opacity: 0, y: -40, duration: 0.5 }, i - 0.1)
          .to(panels[i - 1], { opacity: 0, y: -50, scale: 0.96, duration: 0.5 }, i - 0.1)
          .to(steps[i], { opacity: 1, y: 0, duration: 0.5 }, i + 0.2)
          .to(panels[i], { opacity: 1, y: 0, scale: 1, duration: 0.5 }, i + 0.2)
          .to(ticks[i], { opacity: 1, duration: 0.3 }, i + 0.2);
      }
      tl.to({}, { duration: 0.2 });
    }, root);
    return () => ctx.revert();
  }, [pin]);

  if (pin) {
    return (
      <section id="how" ref={root} aria-labelledby="how-title" className="relative bg-paper">
        <div className="relative flex h-screen items-center overflow-hidden">
          <div className="desk-surface absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-10 px-8 pt-16">
            <div className="col-span-5">
              <h2 id="how-title" className="eyebrow mb-8 text-ink/70">
                How it works · three steps from drawer to dispatch
              </h2>
              <div className="grid">
                {STEPS.map((s) => (
                  <div key={s.n} className="s3-step [grid-area:1/1]">
                    <StepText s={s} />
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-1 flex h-[340px] justify-center" aria-hidden="true">
              <div className="relative h-full w-px bg-ink/15">
                <div className="s3-fill absolute inset-0 origin-top bg-brand" />
                {STEPS.map((s, i) => (
                  <span
                    key={s.n}
                    className="s3-tick absolute -left-[5px] size-[11px] rounded-full border-2 border-brand bg-paper"
                    style={{ top: `${i * 50}%`, transform: "translateY(-50%)" }}
                  />
                ))}
              </div>
            </div>
            <div className="col-span-6">
              <div className="grid">
                {STEPS.map((s) => (
                  <div key={s.n} className="s3-panel [grid-area:1/1]">
                    <s.Panel />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="how" aria-labelledby="how-title" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 id="how-title" className="eyebrow text-ink/70">
            How it works · three steps from drawer to dispatch
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-20 sm:gap-28">
          {STEPS.map((s, i) => (
            <li key={s.n} className="grid items-center gap-10 lg:grid-cols-2">
              <Reveal className={i % 2 ? "lg:order-2" : ""}>
                <StepText s={s} />
              </Reveal>
              <Reveal delay={100}>
                <s.Panel />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
