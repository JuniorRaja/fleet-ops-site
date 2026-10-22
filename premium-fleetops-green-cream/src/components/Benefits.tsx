import { Reveal, Stagger, StaggerItem } from "./Reveal";

const BENEFITS = [
  {
    stat: "₹0",
    label: "fines from expired papers",
    body: "Every document watched with its own lead time means renewals happen before the deadline, not after the challan.",
  },
  {
    stat: "−40%",
    label: "breakdowns on the road",
    body: "Odometer-based service reminders keep maintenance on schedule, so vehicles fail in the yard, not on a highway.",
  },
  {
    stat: "100%",
    label: "dispatches on the record",
    body: "No vehicle leaves on expired papers without a named, written reason — protecting the owner and the in-charge.",
  },
  {
    stat: "1",
    label: "source of truth",
    body: "Trips, fuel, driver accounts and documents live together, so cost per km is real, not reconstructed.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="relative mx-auto max-w-6xl px-4 py-24 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
            Why operators switch
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            The quiet wins add up fast.
          </h2>
          <p className="mt-5 text-lg text-ink/60">
            Fleet OPS pays for itself the first time a vehicle doesn't leave the
            yard on an expired fitness certificate. Everything after that is
            margin.
          </p>
          <div className="mt-8 rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6">
            <p className="font-display text-lg font-semibold text-brand-900">
              "On hold for papers."
            </p>
            <p className="mt-2 text-sm text-brand-800/80">
              It goes out only with a written reason — and that reason stays on
              the record forever. That one rule changes how a yard runs.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid gap-5 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <StaggerItem key={b.label}>
              <div
                data-cursor
                className="group h-full rounded-3xl border border-ink/8 bg-white/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5"
              >
                <p className="font-display text-4xl font-bold tracking-tight text-brand-600">
                  {b.stat}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{b.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{b.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
