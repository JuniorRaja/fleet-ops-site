import { useState, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icons";
import { PH } from "@/lib/config";
import { cn } from "@/utils/cn";

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "Does Fleet OPS track my vehicles?",
    a: "No. There is no GPS, no live map and no driver monitoring. Fleet OPS covers compliance and maintenance: papers, lead times, workshop status, document hold and trip records.",
  },
  {
    q: "Which papers does it follow?",
    a: "Fitness, insurance, PUC, permit, RC and road tax for every vehicle, plus driver licences flagged 30 days before expiry. Lead times start at 15, 30, 7, 45, 30 and 15 days, and each paper keeps its own clock.",
  },
  {
    q: "What does document hold actually do?",
    a: "It marks a vehicle as not fit to roll. A held vehicle can still be dispatched, but only with a written reason, saved with the person's name, role and the time. The in-charge has to renew the paper; only the owner can override a hold.",
  },
  {
    q: "Can a vehicle be sent on two trips at once?",
    a: "No. A vehicle that is out on a trip cannot be sent on a second one until the first is closed.",
  },
  {
    q: "What happens when I press Save and close?",
    a: "The trip record, the fuel log and the driver account update in one save, or none of them do. Cost per km appears as soon as the trip is closed.",
  },
  {
    q: "How long does setup take?",
    a: (
      <>
        Most fleets are live within a day. Send us the vehicle list and the papers, we load them, and your in-charge starts
        from the matrix. Ask for a demo and we reply within {PH.reply}.
      </>
    ),
  },
  {
    q: "Does it work on a phone?",
    a: "Yes. The in-charge can check the matrix, open a paper and save a trip from a phone at the gate.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="eyebrow text-brand">Questions</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 id="faq-title" className="display mt-4 text-[clamp(2.5rem,5vw,4.6rem)]">
              Asked before every demo.
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <Reveal key={f.q} delay={Math.min(i, 4) * 40} className="border-b border-ink/15 first:border-t">
                <h3>
                  <button
                    type="button"
                    id={`${id}-b`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-p`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left font-display text-[clamp(1.2rem,2vw,1.7rem)] font-semibold tracking-tight"
                  >
                    <span className="transition-colors duration-200 group-hover:text-brand">{f.q}</span>
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-full border transition-[transform,background,color] duration-200 ease-out",
                        isOpen ? "rotate-45 border-ink bg-ink text-lime" : "border-ink/25"
                      )}
                    >
                      <Icon name="plus" size={18} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-p`}
                  role="region"
                  aria-labelledby={`${id}-b`}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className="max-w-[62ch] pb-7 text-[17px] leading-relaxed text-ink/75">{f.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
