import { useState } from "react";
import { Reveal, Stagger, StaggerItem } from "./Reveal";
import { Magnetic } from "./Cursor";
import { WHATSAPP_LINK } from "../lib/constants";

const TIERS = [
  {
    name: "Starter",
    tag: "Small yards",
    monthly: 49,
    yearly: 39,
    unit: "per vehicle / month",
    features: [
      "Up to 10 vehicles",
      "All 6 documents + driver licences",
      "Expiry reminders with lead times",
      "Compliance matrix & list views",
      "Email + WhatsApp alerts",
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Operator",
    tag: "Most popular",
    monthly: 39,
    yearly: 31,
    unit: "per vehicle / month",
    features: [
      "Up to 100 vehicles",
      "Everything in Starter",
      "Document hold + written-reason dispatch",
      "Maintenance & service scheduling",
      "One-save trip sheets & cost per km",
      "Roles: owner, in-charge, accounts",
    ],
    cta: "Book a demo",
    highlight: true,
  },
  {
    name: "Enterprise",
    tag: "Large fleets",
    monthly: null,
    yearly: null,
    unit: "custom",
    features: [
      "Unlimited vehicles & depots",
      "Everything in Operator",
      "API & ERP/accounting export",
      "Audit trails & custom roles",
      "Dedicated onboarding + SLA",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-24 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          Pricing
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Priced per vehicle. No per-trip games.
        </h2>
        <p className="mt-5 text-lg text-ink/60">
          One fine avoided usually covers a year. Start with a free 14-day trial,
          no card required.
        </p>

        <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-ink/5 p-1.5">
          <button
            onClick={() => setYearly(false)}
            aria-pressed={!yearly}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${!yearly ? "bg-white text-ink shadow" : "text-ink/55"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            aria-pressed={yearly}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${yearly ? "bg-white text-ink shadow" : "text-ink/55"}`}
          >
            Yearly
            <span className="ml-1.5 rounded-md bg-brand-100 px-1.5 py-0.5 text-[11px] font-bold text-brand-700">
              −20%
            </span>
          </button>
        </div>
      </Reveal>

      <Stagger className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
        {TIERS.map((t) => (
          <StaggerItem key={t.name}>
            <div
              data-cursor
              className={`relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 ${
                t.highlight
                  ? "border-brand-300 bg-ink text-white shadow-2xl shadow-brand-600/20 lg:-translate-y-4"
                  : "border-ink/8 bg-white/70 backdrop-blur hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  {t.tag}
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className={`font-display text-xl font-semibold ${t.highlight ? "text-white" : "text-ink"}`}>
                  {t.name}
                </h3>
                {!t.highlight && (
                  <span className="text-xs font-semibold text-ink/40">{t.tag}</span>
                )}
              </div>

              <div className="mt-5">
                {t.monthly === null ? (
                  <p className={`font-display text-4xl font-bold ${t.highlight ? "text-white" : "text-ink"}`}>
                    Let's talk
                  </p>
                ) : (
                  <p className={`font-display text-4xl font-bold ${t.highlight ? "text-white" : "text-ink"}`}>
                    ₹{yearly ? t.yearly : t.monthly}
                    <span className={`ml-1 text-sm font-medium ${t.highlight ? "text-white/50" : "text-ink/45"}`}>
                      {t.unit}
                    </span>
                  </p>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <svg
                      viewBox="0 0 20 20"
                      className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${t.highlight ? "text-brand-400" : "text-brand-600"}`}
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M10 1.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zm4 6.3l-4.8 5a1 1 0 01-1.4 0L5.9 10.9a1 1 0 011.4-1.4l1.2 1.2 4.1-4.3a1 1 0 011.4 1.4z" />
                    </svg>
                    <span className={t.highlight ? "text-white/80" : "text-ink/70"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Magnetic className="mt-7 block">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className={`block rounded-xl px-5 py-3 text-center text-sm font-semibold transition ${
                    t.highlight
                      ? "bg-brand-500 text-white hover:bg-brand-400"
                      : "bg-ink text-white hover:bg-brand-700"
                  }`}
                >
                  {t.cta}
                </a>
              </Magnetic>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
