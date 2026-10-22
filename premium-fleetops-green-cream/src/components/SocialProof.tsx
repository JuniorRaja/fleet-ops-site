import { Reveal } from "./Reveal";

const LOGOS = [
  "Ashok Leyland",
  "Tata Motors",
  "BharatBenz",
  "Eicher",
  "Mahindra",
  "Volvo",
  "SML Isuzu",
  "Force Motors",
];

export function SocialProof() {
  return (
    <section aria-label="Trusted by operators" className="relative border-y border-ink/5 bg-white/50 py-10">
      <Reveal className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">
          Built for operators running these makes, across India
        </p>
      </Reveal>

      <div className="relative mt-7 overflow-hidden" aria-hidden>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-paper to-transparent" />
        <div className="flex w-max animate-marquee gap-12 pr-12">
          {[...LOGOS, ...LOGOS].map((l, i) => (
            <span
              key={i}
              className="whitespace-nowrap font-display text-xl font-semibold text-ink/35 transition-colors hover:text-ink/70"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
