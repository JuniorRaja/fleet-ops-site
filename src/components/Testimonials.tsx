import { Reveal } from "@/components/ui/Reveal";

const QUOTES = [
  {
    q: "A solution that is built around our daily workflow. Easy to adapt and great insights. The onboarding was smooth and my team loves this new software.",
    n: "KV Prijesh",
    r: "PAS Transports",
    tone: "bg-ink text-paper",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="quotes-title" className="relative overflow-hidden bg-paper-deep/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow text-brand">Proven outcomes</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 id="quotes-title" className="display mt-4 max-w-[16ch] text-[clamp(2.5rem,6vw,5.6rem)]">
            Built around real fleet workflows.
          </h2>
        </Reveal>

        <ul
          className="mt-14 max-w-3xl"
          aria-label="Operator testimonials"
          tabIndex={0}
        >
          {QUOTES.map((t, i) => (
            <Reveal
              as="li"
              key={t.n}
              delay={i * 70}
              className="w-full"
            >
              <figure
                className={`flex h-full flex-col justify-between rounded-[28px] border border-ink/10 p-7 transition-transform duration-200 ease-out hover:-translate-y-1 sm:p-9 ${t.tone}`}
              >
                <span aria-hidden="true" className="font-display text-7xl font-extrabold leading-none opacity-40">
                  “
                </span>
                <blockquote className="mt-2 font-display text-[clamp(1.35rem,2vw,1.75rem)] font-semibold leading-[1.18] tracking-tight">
                  {t.q}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full border border-current/30 font-display font-bold">
                    {t.n
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span>
                    <span className="block font-semibold">{t.n}</span>
                    <span className="block text-sm opacity-75">{t.r}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
