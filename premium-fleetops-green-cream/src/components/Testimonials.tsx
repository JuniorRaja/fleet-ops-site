import { Reveal, Stagger, StaggerItem } from "./Reveal";

const QUOTES = [
  {
    quote:
      "We stopped getting surprised by RTO checks. Fitness and road tax now renew weeks early. The hold feature alone saved us two seizures last quarter.",
    name: "R. Senthil",
    role: "Owner · 42 lorries, Tiruppur",
    initials: "RS",
  },
  {
    quote:
      "'Can this vehicle go today?' is the only screen my dispatch desk needs in the morning. Nothing leaves on expired papers without my name on a reason.",
    name: "Ravi Kumar",
    role: "Transport in-charge · 18 trailers, Chennai",
    initials: "RK",
  },
  {
    quote:
      "One save writes the trip, fuel and driver advance together. Month-end used to take three days of reconciling. Now the cost per km is just there.",
    name: "Fatima N.",
    role: "Accounts · 30 buses, Madurai",
    initials: "FN",
  },
];

export function Testimonials() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-24 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          From the yard
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Operators who stopped losing sleep.
        </h2>
      </Reveal>

      <Stagger className="mt-14 grid gap-5 lg:grid-cols-3">
        {QUOTES.map((q) => (
          <StaggerItem key={q.name}>
            <figure
              data-cursor
              className="flex h-full flex-col rounded-3xl border border-ink/8 bg-white/70 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
            >
              <div className="flex gap-0.5 text-brand-500" aria-label="5 out of 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/75">
                "{q.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                  {q.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{q.name}</p>
                  <p className="text-xs text-ink/50">{q.role}</p>
                </div>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
