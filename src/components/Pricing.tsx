import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { WHATSAPP_HREF } from "@/lib/config";
import { cn } from "@/utils/cn";

interface Tier {
  name: string;
  blurb: string;
  monthly: number;
  yearly: number;
  popular?: boolean;
  custom?: boolean;
  features: string[];
}

const TIERS: Tier[] = [
  {
    name: "Yard",
    blurb: "Up to 10 vehicles",
    monthly: 2499,
    yearly: 1999,
    features: [
      "Six-paper compliance matrix",
      "Lead-time reminders by WhatsApp and email",
      "Document hold with written reasons",
      "One in-charge login",
    ],
  },
  {
    name: "Fleet",
    blurb: "Up to 50 vehicles",
    monthly: 7999,
    yearly: 6399,
    popular: true,
    features: [
      "Everything in Yard",
      "Workshop, service schedules and job cards",
      "Driver licences flagged 30 days ahead",
      "One-save trips: fuel log and driver account",
      "In-charge and owner roles with override log",
    ],
  },
  {
    name: "Network",
    blurb: "50+ vehicles, many depots",
    monthly: 0,
    yearly: 0,
    custom: true,
    features: [
      "Everything in Fleet",
      "Depot-wise views and approvals",
      "Bulk import of vehicles and papers",
      "Priority support and onboarding on site",
    ],
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="eyebrow text-brand">Pricing</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 id="pricing-title" className="display mt-4 text-[clamp(2.5rem,6.2vw,5.8rem)]">
                Priced by vehicle. Never by surprise.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120} className="lg:col-span-4 lg:justify-self-end">
            <div className="flex items-center gap-3">
              <span className={cn("text-sm font-semibold", !yearly ? "text-ink" : "text-ink/60")}>Monthly</span>
              <button
                type="button"
                role="switch"
                aria-checked={yearly}
                aria-label="Bill yearly and save 20%"
                onClick={() => setYearly((y) => !y)}
                className="relative grid h-11 w-14 place-items-center rounded-full bg-ink transition-colors duration-200"
              >
                <span
                  className="absolute left-1 top-1/2 size-6 -translate-y-1/2 rounded-full bg-brand ring-2 ring-paper transition-[left] duration-200 ease-out"
                  style={{ left: yearly ? 28 : 4 }}
                />
              </button>
              <span className={cn("text-sm font-semibold", yearly ? "text-ink" : "text-ink/60")}>
                Yearly <span className="ml-1 rounded-full bg-brand px-2 py-0.5 text-xs text-white">save 20%</span>
              </span>
            </div>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {TIERS.map((t, i) => {
            const popular = !!t.popular;
            const custom = !!t.custom;
            const price = yearly ? t.yearly : t.monthly;
            return (
              <Reveal as="li" key={t.name} delay={i * 70}>
                <article
                  className={cn(
                    "relative flex h-full flex-col rounded-[30px] border p-7 sm:p-9",
                    popular ? "border-ink bg-ink text-paper shadow-[0_50px_100px_-40px_rgba(11,15,13,.7)]" : "border-ink/12 bg-white/80"
                  )}
                >
                  {popular && (
                    <span className="absolute -top-3 right-7 rounded-full bg-paper px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
                      Most chosen
                    </span>
                  )}
                  <h3 className="font-display text-3xl font-bold tracking-tight">{t.name}</h3>
                  <p className={cn("mt-1 text-sm", popular ? "text-paper/75" : "text-ink/65")}>{t.blurb}</p>
                  <p className="mt-8 flex items-baseline gap-2">
                    {custom ? (
                      <span className="display text-5xl">Let's talk</span>
                    ) : (
                      <>
                        <span className="display text-6xl">₹{price.toLocaleString("en-IN")}</span>
                        <span className={cn("text-sm", popular ? "text-paper/75" : "text-ink/65")}>per month</span>
                      </>
                    )}
                  </p>
                  <p className={cn("mt-1 text-xs", popular ? "text-paper/70" : "text-ink/60")}>
                    {custom ? "Volume pricing for large fleets" : `Billed ${yearly ? "yearly" : "monthly"} · excl. GST`}
                  </p>
                  <ul className="mt-8 grid flex-1 content-start gap-3.5">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[15px]">
                        <span
                          className={cn(
                            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                            popular ? "bg-paper text-brand" : "bg-brand text-paper"
                          )}
                        >
                          <Icon name="check" size={12} stroke={2.8} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    href={WHATSAPP_HREF}
                    variant={popular ? "light" : "ghost"}
                    icon="chat"
                    className="mt-9 w-full"
                    cursor="Book"
                  >
                    {custom ? "Talk to us" : "Start with a demo"}
                  </Button>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
