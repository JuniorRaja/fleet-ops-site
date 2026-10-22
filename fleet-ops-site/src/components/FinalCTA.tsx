import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { EMAIL_HREF, PH, WHATSAPP_HREF } from "@/lib/config";

export function FinalCTA() {
  return (
    <section id="demo" aria-labelledby="cta-title" className="bg-paper px-5 py-16 sm:px-8 sm:py-24">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative isolate overflow-hidden rounded-[32px] bg-brand px-6 py-16 text-center text-white sm:px-12 sm:py-20 lg:py-24">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black, transparent)",
            }}
          />
          <div className="grain-light pointer-events-none absolute inset-0 -z-10 opacity-25" aria-hidden="true" />

          <p className="eyebrow text-white/75">Fleet Ops · 20-minute demo</p>
          <h2 id="cta-title" className="display mx-auto mt-5 max-w-3xl text-[clamp(2.8rem,7vw,5.5rem)] text-white">
            Keep every vehicle road-legal.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            Book a demo on your own fleet. We'll typically reply within {PH.reply}.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic>
              <Button href={WHATSAPP_HREF} variant="light" icon="chat" className="px-7 py-4 text-base" cursor="Chat">
                Book a demo on WhatsApp
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href={EMAIL_HREF} variant="ghostDark" icon="mail" className="px-7 py-4 text-base" cursor="Email">
                Email us instead
              </Button>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
