import { Reveal, Stagger, StaggerItem } from "./Reveal";

type Feature = {
  title: string;
  body: string;
  icon: React.ReactNode;
  span?: string;
  accent?: boolean;
};

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const FEATURES: Feature[] = [
  {
    title: "Expiry tracking that nags you first",
    body: "Fitness, Insurance, PUC, Permit, RC and Road tax — every document watched with its own lead time, so renewals start before the penalty does.",
    icon: <Icon d="M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    span: "lg:col-span-2 lg:row-span-1",
    accent: true,
  },
  {
    title: "Driver licence watch",
    body: "Licences flagged 30 days before expiry, tied to the driver, not lost in a drawer.",
    icon: <Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />,
  },
  {
    title: "Document hold, with a reason",
    body: "A vehicle can be held for papers. It only moves with a written reason, saved to the record.",
    icon: <Icon d="M12 9v4m0 4h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />,
  },
  {
    title: "Service & maintenance log",
    body: "Odometer-based service reminders, workshop status, and a full repair history per vehicle.",
    icon: <Icon d="M14.7 6.3a4 4 0 00-5.4 5.4l-5 5a2 2 0 002.8 2.8l5-5a4 4 0 005.4-5.4l-2.5 2.5-2.1-2.1 2.5-2.5z" />,
  },
  {
    title: "Cost per km, once trips close",
    body: "Fuel, toll, batta and advances roll into a clean cost-per-km the day a trip is closed.",
    icon: <Icon d="M3 3v18h18M7 14l3-3 3 3 5-6" />,
    accent: true,
  },
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-4 py-24 lg:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          What Fleet OPS does
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Compliance and maintenance,
          <br className="hidden sm:block" /> handled in one place.
        </h2>
        <p className="mt-5 text-lg text-ink/60">
          Not a tracker. A control room for keeping every vehicle legal,
          serviced and ready — and for refusing the ones that aren't.
        </p>
      </Reveal>

      <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <StaggerItem key={f.title} className={f.span ?? ""}>
            <article
              data-cursor
              className={`group relative h-full overflow-hidden rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                f.accent
                  ? "border-brand-200 bg-gradient-to-br from-brand-50 to-white hover:shadow-2xl hover:shadow-brand-600/10"
                  : "border-ink/8 bg-white/70 backdrop-blur hover:shadow-xl hover:shadow-ink/5"
              }`}
            >
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-300/20 blur-2xl transition-opacity duration-300 group-hover:opacity-100 sm:opacity-0"
              />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white shadow-lg shadow-ink/20 transition group-hover:bg-brand-600">
                {f.icon}
              </div>
              <h3 className="relative mt-5 font-display text-xl font-semibold text-ink">
                {f.title}
              </h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-ink/60">
                {f.body}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
