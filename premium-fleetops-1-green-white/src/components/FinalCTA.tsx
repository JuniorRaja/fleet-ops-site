import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Picture } from "@/components/ui/Picture";
import { APP_HREF, EMAIL_HREF, PH, PHOTOS, WHATSAPP_HREF } from "@/lib/config";

export function FinalCTA() {
  return (
    <section id="demo" aria-labelledby="cta-title" className="on-dark relative isolate overflow-hidden bg-ink py-28 text-paper sm:py-36">
      <div className="absolute inset-0 -z-20" data-asset="CTA-BG-01">
        <Picture src={PHOTOS.yard} alt="" width={1600} height={900} imgClassName="opacity-40 mix-blend-luminosity" />
      </div>
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(900px_500px_at_85%_10%,rgba(201,242,107,.22),transparent_60%),linear-gradient(180deg,rgba(11,15,13,.85),rgba(11,15,13,.7)_50%,#0b0f0d)]"
        aria-hidden="true"
      />
      <div className="grain grain-light pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow text-lime">Book a demo</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 id="cta-title" className="display mt-5 text-[clamp(3.2rem,9.4vw,9rem)]">
              Ready for a calmer <span className="text-lime">Monday?</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-7 max-w-[52ch] text-lg leading-relaxed text-paper/80">
              Tell us your fleet size and we'll walk you through your own vehicles, papers and dispatch rules. About 20
              minutes. We reply within {PH.reply}.
            </p>
          </Reveal>
          <Reveal delay={180} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button href={WHATSAPP_HREF} variant="light" icon="chat" className="px-7 py-4 text-base" cursor="Chat">
                Book on WhatsApp
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href={EMAIL_HREF} variant="ghostDark" icon="mail" className="px-7 py-4 text-base" cursor="Email">
                Request by email
              </Button>
            </Magnetic>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 text-sm text-paper/70">
              Already using Fleet OPS?{" "}
              <a href={APP_HREF} className="font-semibold text-lime underline underline-offset-4 hover:text-paper">
                Open the app
              </a>
            </p>
          </Reveal>
        </div>

        <Reveal delay={140} className="lg:col-span-5">
          <figure className="glass-dark rounded-[28px] p-5 sm:p-6" aria-label="What your WhatsApp message will say">
            <figcaption className="eyebrow flex items-center gap-2 text-paper/70">
              <span className="size-2 rounded-full bg-lime" aria-hidden="true" /> Your message is pre-filled
            </figcaption>
            <div className="mt-4 rounded-2xl rounded-tl-md bg-[#d9fdd3] p-4 text-[15px] leading-relaxed text-ink">
              <p>Hi, I would like a Fleet Ops demo.</p>
              <p className="mt-2">Company:</p>
              <p>City:</p>
              <p>Vehicles: __ lorries / __ trailers / __ buses</p>
              <p>Best time to call:</p>
              <p className="mt-2 text-right font-mono text-[11px] text-ink/60">now ✓✓</p>
            </div>
            <p className="mt-4 text-sm text-paper/70">Fill the blanks, press send. That's the whole form.</p>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
