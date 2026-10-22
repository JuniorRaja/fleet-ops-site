import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { useMotionPref } from "../lib/motion";

const FAQS = [
  {
    q: "Is this a GPS tracker?",
    a: "No. Fleet OPS is for compliance and maintenance — documents, renewals, service schedules and trip records. We don't do live location tracking or driver monitoring. It works alongside whatever tracker you already use.",
  },
  {
    q: "Which documents do you track?",
    a: "Six per vehicle — Fitness, Insurance, PUC, Permit, RC and Road tax — plus driver licences. Each has its own lead time so renewals start early. You can upload proof against each one.",
  },
  {
    q: "What does 'Document hold' actually do?",
    a: "It marks a vehicle as not-to-dispatch for a paper reason. The vehicle can still be sent out, but only with a written reason attached to a named person, which is kept on the audit trail. In-charges are asked to renew first; owners can override with a reason.",
  },
  {
    q: "Can I import my existing records?",
    a: "Yes. During onboarding we help you bulk-import vehicles, document expiry dates and driver details from a spreadsheet, so you start with your real fleet, not an empty screen.",
  },
  {
    q: "Does it work on phones?",
    a: "Fully. The whole app is mobile-first, so your dispatch desk and drivers can check 'Can this vehicle go today?' and save trip sheets from the yard.",
  },
  {
    q: "How are we billed?",
    a: "Per active vehicle, per month, with a discount on yearly plans. No per-trip or per-document fees. You can add or remove vehicles any time.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { motionOn } = useMotionPref();

  return (
    <section id="faq" className="relative mx-auto max-w-3xl scroll-mt-24 px-4 py-24 lg:py-28">
      <Reveal className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          Questions
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Everything you'd ask in a demo.
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="overflow-hidden rounded-2xl border border-ink/8 bg-white/70 backdrop-blur transition hover:border-brand-200"
            >
              <h3>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-display text-lg font-semibold text-ink">{f.q}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/5 transition-transform duration-300 ${isOpen ? "rotate-45 bg-brand-600 text-white" : "text-ink/60"}`}
                    aria-hidden
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={motionOn ? { height: 0, opacity: 0 } : false}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={motionOn ? { height: 0, opacity: 0 } : undefined}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink/60">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
