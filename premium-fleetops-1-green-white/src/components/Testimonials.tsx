import { Reveal } from "@/components/ui/Reveal";

/* Sample operator quotes: swap in real customer quotes before launch. */
const QUOTES = [
  {
    q: "We used to find out about a lapsed fitness certificate at the checkpost. Now Ravi gets a message three weeks before, and the renewal is already booked.",
    n: "R. Senthil Kumar",
    r: "Owner · 42 lorries · Hosur",
    tone: "bg-ink text-paper",
  },
  {
    q: "Document hold changed our mornings. Nobody argues about whether a lorry can go. It either can, or someone writes down why.",
    n: "Meena Ravichandran",
    r: "Transport in-charge · Container fleet, Chennai",
    tone: "bg-white text-ink",
  },
  {
    q: "One save for the trip, the diesel and the driver advance. My accountant stopped calling me on Sundays.",
    n: "Abdul Hakeem",
    r: "Fleet manager · 28 buses · Tiruchirappalli",
    tone: "bg-lime text-ink",
  },
];

export function Testimonials() {
  return (
    <section aria-labelledby="quotes-title" className="relative overflow-hidden bg-paper-deep/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow text-brand">In their words</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 id="quotes-title" className="display mt-4 max-w-[16ch] text-[clamp(2.5rem,6vw,5.6rem)]">
            Quieter yards. Calmer owners.
          </h2>
        </Reveal>

        <ul
          className="rail -mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
          aria-label="Operator testimonials"
          tabIndex={0}
        >
          {QUOTES.map((t, i) => (
            <Reveal
              as="li"
              key={t.n}
              delay={i * 70}
              className="w-[84%] shrink-0 snap-center sm:w-[60%] lg:w-auto"
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
