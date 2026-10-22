import { Reveal } from "./Reveal";
import { Magnetic } from "./Cursor";
import { WHATSAPP_LINK, EMAIL_LINK } from "../lib/constants";

export function CTA() {
  return (
    <section id="demos-cta" className="relative mx-auto max-w-6xl px-4 py-16 lg:py-24">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center sm:px-12 lg:py-24">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="animate-drift absolute -left-20 -top-20 h-[26rem] w-[26rem] rounded-full bg-brand-600/30 blur-[110px]" />
            <div
              className="animate-drift absolute -bottom-24 -right-16 h-[26rem] w-[26rem] rounded-full bg-emerald-500/20 blur-[110px]"
              style={{ animationDelay: "-9s" }}
            />
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)",
                WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)",
              }}
            />
            <div className="grain absolute inset-0 opacity-20" />
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-200 ring-1 ring-white/15">
            Free 14-day trial · No card
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Keep every vehicle road-legal.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
            Book a 20-minute demo on your own fleet. We'll typically reply within{" "}
            {"{{REPLY_TIME}}"}.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-7 py-4 text-base font-semibold text-white shadow-xl shadow-brand-600/30 transition hover:bg-brand-400"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm5.9 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3.1-1.3-5.1-4.5-5.3-4.7-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4a1 1 0 01.8-.4h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5-.3.3c-.1.1-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.8 1.1 2.1 1.3.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.9.9c.3.1.5.2.5.4.1.2.1.9-.1 1.6z" />
                </svg>
                Book a demo on WhatsApp
              </a>
            </Magnetic>
            <a
              href={EMAIL_LINK}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-7 py-4 text-base font-semibold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
            >
              Email us instead
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
