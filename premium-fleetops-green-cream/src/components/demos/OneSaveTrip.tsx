import { useState } from "react";
import { Reveal } from "../Reveal";
import { useMotionPref } from "../../lib/motion";

export function OneSaveTrip() {
  const { motionOn } = useMotionPref();
  const [isContainer, setIsContainer] = useState(true);
  const [saved, setSaved] = useState(false);

  const fields = [
    { label: "Route", value: "Chennai Port → Sriperumbudur" },
    { label: "Distance", value: "48 km" },
    { label: "Diesel", value: "₹5,920 · 62 L" },
    { label: "Toll", value: "₹340" },
    { label: "Batta", value: "₹600" },
    { label: "Driver advance", value: "₹2,000" },
  ];

  const results = [
    { title: "Trips", body: "Trip #4821 logged · cost per km ₹27.4", icon: "M3 12h18M3 6h18M3 18h12" },
    { title: "Fuel log", body: "62 L added · tank & mileage updated", icon: "M14 10V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14h10v-5m0-4h3a2 2 0 012 2v3a1.5 1.5 0 01-3 0V10" },
    { title: "Driver account", body: "₹2,000 advance · ₹600 batta posted", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" },
  ];

  return (
    <section id="onesave" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-24 lg:py-28">
      <Reveal className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          Product · One save
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Saved together, or not at all.
        </h2>
        <p className="mt-4 text-lg text-ink/60">
          One trip sheet writes to trips, the fuel log and the driver's account
          in a single save. No half-entered records, no reconciling later.
        </p>
      </Reveal>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Trip sheet */}
        <Reveal className="rounded-3xl border border-ink/8 bg-white/80 p-6 shadow-xl shadow-ink/5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl font-semibold text-ink">Trip sheet</p>
            <div className="flex rounded-xl bg-ink/5 p-1" role="group" aria-label="Trip type">
              {(["Container", "General"] as const).map((t) => {
                const on = (t === "Container") === isContainer;
                return (
                  <button
                    key={t}
                    onClick={() => setIsContainer(t === "Container")}
                    aria-pressed={on}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      on ? "bg-white text-ink shadow" : "text-ink/55"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <dl className="mt-5 space-y-2.5">
            {fields.map((f) => (
              <div key={f.label} className="flex items-center justify-between rounded-xl bg-ink/[0.03] px-3.5 py-2.5">
                <dt className="text-sm text-ink/55">{f.label}</dt>
                <dd className="text-sm font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
            {isContainer && (
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-3.5 py-2.5 ring-1 ring-brand-100">
                <dt className="text-sm text-brand-700">Container number</dt>
                <dd className="text-sm font-semibold text-brand-800">MSKU 445120 3</dd>
              </div>
            )}
          </dl>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setSaved(true)}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                saved ? "bg-brand-700" : "bg-brand-600 hover:bg-brand-700"
              }`}
            >
              {saved ? "Saved ✓" : "Save and close"}
            </button>
            <button
              onClick={() => setSaved(false)}
              className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-ink/70 ring-1 ring-ink/10 transition hover:bg-ink/5"
            >
              Reset
            </button>
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink/40">
            <span className="rounded bg-brand-50 px-1.5 py-0.5 font-semibold text-brand-700">Example data</span>
            One save writes to all three records below.
          </p>
        </Reveal>

        {/* Result cards */}
        <div className="relative grid gap-4" aria-live="polite">
          {/* connector */}
          <svg aria-hidden className="pointer-events-none absolute -left-6 top-0 hidden h-full w-6 lg:block" viewBox="0 0 24 300" preserveAspectRatio="none">
            <path
              d="M24 20 C4 20 4 60 24 60 M24 150 C4 150 4 150 24 150 M24 280 C4 280 4 240 24 240"
              fill="none"
              stroke={saved ? "var(--color-brand-500)" : "#d8ded8"}
              strokeWidth="2"
              strokeDasharray="4 4"
              className="transition-[stroke] duration-500"
            />
          </svg>

          {results.map((r, i) => (
            <div
              key={r.title}
              className={`flex items-center gap-4 rounded-2xl border p-5 transition-all duration-500 ${
                saved
                  ? "translate-x-0 border-brand-200 bg-gradient-to-br from-brand-50 to-white opacity-100 shadow-xl shadow-brand-600/10"
                  : motionOn
                    ? "translate-x-0 border-ink/8 bg-white/60 opacity-60"
                    : "border-ink/8 bg-white/60"
              }`}
              style={{ transitionDelay: saved ? `${i * 120}ms` : "0ms" }}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
                  saved ? "bg-brand-600 text-white" : "bg-ink/5 text-ink/40"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d={r.icon} />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-ink">{r.title}</p>
                <p className="text-sm text-ink/55">{saved ? r.body : "Waiting for save…"}</p>
              </div>
              {saved && (
                <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
