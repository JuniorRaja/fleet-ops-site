import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { WHATSAPP_HREF } from "@/lib/config";

const FEATURES = [
  "Six-paper compliance matrix",
  "Lead-time reminders by WhatsApp and email",
  "Trips, fuel, maintenance and driver accounts",
  "Owner, in-charge and accountant roles",
  "Reports and accountable override history",
];

export function Pricing() {
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
            <p className="max-w-sm text-lg leading-relaxed text-ink/65">
              One clear monthly price. A one-time vehicle onboarding charge applies.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14 max-w-3xl">
          <article className="relative rounded-[30px] border border-ink bg-ink p-7 text-paper shadow-[0_50px_100px_-40px_rgba(11,15,13,.7)] sm:p-10">
            <p className="eyebrow text-lime">Simple fleet pricing</p>
            <p className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="display text-7xl">₹499</span>
              <span className="text-base text-paper/70">per truck, per month</span>
            </p>
            <p className="mt-2 text-sm text-paper/65">Excluding GST. One-time vehicle onboarding applies.</p>
            <ul className="mt-9 grid gap-3.5 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-paper text-brand">
                    <Icon name="check" size={12} stroke={2.8} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <Button href={WHATSAPP_HREF} variant="light" icon="chat" className="mt-9" cursor="Book" sound="checkout" hoverSound="checkpoint">
              Start with a demo
            </Button>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
