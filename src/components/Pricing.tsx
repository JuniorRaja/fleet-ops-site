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
  "Guided onboarding and Excel import",
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
                Simple, transparent pricing.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120} className="lg:col-span-4 lg:justify-self-end">
            <p className="max-w-sm text-lg leading-relaxed text-ink/65">
              Pay one monthly price per truck. A one-time onboarding charge applies.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14 max-w-3xl">
          <article className="price-card group relative isolate overflow-hidden rounded-[30px] p-7 text-white sm:p-10">
            <div className="relative z-10">
              <p className="eyebrow text-white">Simple fleet pricing</p>
              <p className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="price-figure display text-7xl">₹499</span>
                <span className="text-base font-medium text-white">per truck, per month</span>
              </p>
              <p className="mt-2 text-sm text-white">Excluding GST. One-time vehicle onboarding applies.</p>
              <ul className="mt-9 grid gap-3.5 sm:grid-cols-2">
                {FEATURES.map((feature, i) => (
                  <Reveal as="li" key={feature} delay={120 + i * 70} className="flex items-start gap-3 text-[15px]">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-paper text-brand shadow-[0_0_0_0_rgb(243_241_234_/_0.5)] transition-shadow duration-500 group-hover:shadow-[0_0_0_4px_rgb(243_241_234_/_0.14)]">
                      <Icon name="check" size={12} stroke={2.8} />
                    </span>
                    {feature}
                  </Reveal>
                ))}
              </ul>
              <span className="cta-halo mt-9">
                <Button href={WHATSAPP_HREF} variant="light" icon="chat" cursor="Book" sound="checkout" hoverSound="checkpoint" data-umami-event-source="pricing">
                  Start with a demo
                </Button>
              </span>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
