import { Reveal } from "@/components/ui/Reveal";

const MANUFACTURERS = [
  { name: "Tata Motors", style: "font-display font-extrabold tracking-tight" },
  { name: "Ashok Leyland", style: "font-sans font-semibold tracking-wide" },
  { name: "BharatBenz", style: "font-display font-semibold" },
  { name: "Eicher", style: "font-mono font-bold tracking-tight" },
  { name: "Mahindra", style: "font-sans font-black tracking-tighter" },
  { name: "Volvo Trucks", style: "font-display font-bold tracking-wide uppercase text-[0.82em]" },
  { name: "Scania", style: "font-sans font-semibold" },
  { name: "MAN", style: "font-display font-extrabold tracking-[0.12em]" },
];

const STATS = [
  { n: "6", label: "papers tracked to expiry on every vehicle" },
  { n: "45", label: "days of warning on the permit, the longest lead time" },
  { n: "1", label: "save closes the trip, the fuel log and the driver account" },
  { n: "0", label: "silent dispatches. Every override carries a name and a reason" },
];

export function SocialProof() {
  return (
    <section aria-labelledby="proof-title" className="relative border-y border-ink/10 bg-paper-deep/60">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <Reveal>
          <h2 id="proof-title" className="eyebrow text-center text-ink/70">
            Built for the working machines already in your fleet.
          </h2>
        </Reveal>
      </div>

      <div className="marquee-pause relative overflow-hidden pb-14" aria-label="Truck manufacturers">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-paper to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-paper to-transparent sm:w-40" />
        <ul className="marquee-track flex items-center gap-14 pr-14 text-[26px] text-ink/60 sm:gap-20 sm:pr-20 sm:text-3xl">
          {[...MANUFACTURERS, ...MANUFACTURERS].map((o, i) => (
            <li key={i} aria-hidden={i >= MANUFACTURERS.length} className={`whitespace-nowrap ${o.style}`}>
              {o.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-7xl border-t border-ink/10 px-5 sm:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal
              key={s.n + i}
              delay={i * 60}
              className="border-ink/10 py-8 pr-4 odd:border-r max-lg:nth-[-n+2]:border-b lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"
            >
              <dt className="display text-[clamp(3.4rem,7vw,6rem)] text-ink">{s.n}</dt>
              <dd className="mt-3 max-w-[22ch] text-sm leading-snug text-ink/70">{s.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
