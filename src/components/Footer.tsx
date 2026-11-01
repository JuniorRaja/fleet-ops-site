import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icons";
import { scrollToId } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { APP_HREF, EMAIL_HREF, PH, PHONE_HREF, WHATSAPP_HREF } from "@/lib/config";
import { cn } from "@/utils/cn";
import { useSound } from "@/lib/sound";
import { gsap } from "@/lib/gsap";

const PRODUCT = [
  { id: "matrix-scene", label: "Paper-to-matrix scene" },
  { id: "roles", label: "Roles" },
  { id: "more-title", label: "More in the office" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const { motion, setMotion, reducedPref } = useMotion();
  const { enabled: sound, setEnabled: setSound } = useSound();
  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };
  const link = "inline-flex min-h-11 items-center rounded text-paper/75 transition-colors duration-200 hover:text-paper";

  useLayoutEffect(() => {
    if (!motion || !root.current) return;
    const ctx = gsap.context(() => {
      const trigger = { trigger: ".footer-word", start: "top 90%", once: true };
      gsap.from(".footer-letter", {
        yPercent: 115,
        rotate: 4,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.045,
        scrollTrigger: trigger,
      });
      gsap.from(".footer-track", {
        scaleX: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: trigger,
      });
      gsap.fromTo(
        ".footer-truck",
        { x: 0, opacity: 0 },
        {
          x: () => Math.max(0, (root.current?.querySelector<HTMLElement>(".footer-track")?.offsetWidth ?? 40) - 40),
          opacity: 1,
          duration: 1.25,
          ease: "power2.inOut",
          scrollTrigger: trigger,
        }
      );
    }, root);
    return () => ctx.revert();
  }, [motion]);

  return (
    <footer ref={root} className="on-dark relative overflow-hidden bg-ink pb-28 pt-20 text-paper lg:pb-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a href="#top" onClick={go("top")} className="inline-flex min-h-11 items-center rounded-full" aria-label="Fleet OPS, back to top">
              <Logo dark className="[&_span]:text-paper" />
            </a>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-paper/75">
              Compliance and maintenance for fleet, truck and bus operators. No GPS, no tracking: just papers in order
              and wheels on road.
            </p>
          </div>

          <nav aria-label="Product" className="lg:col-span-3">
            <h2 className="eyebrow text-paper/60">Product</h2>
            <ul className="mt-5 grid gap-3 text-[15px]">
              {PRODUCT.map((p) => (
                <li key={p.id}>
                  <a href={`#${p.id}`} onClick={go(p.id)} className={link}>
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="eyebrow text-paper/60">Talk to us</h2>
            <ul className="mt-5 grid gap-3 text-[15px]">
              <li>
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" data-umami-event="demo_whatsapp" data-uisfx="send" data-uisfx-hover="notification" className={cn(link, "inline-flex items-center gap-2")}>
                  <Icon name="chat" size={17} /> WhatsApp a demo request
                </a>
              </li>
              <li>
                <a href={EMAIL_HREF} data-umami-event="contact_email" data-uisfx="forward" data-uisfx-hover="info" className={cn(link, "inline-flex items-center gap-2")}>
                  <Icon name="mail" size={17} /> {PH.email}
                </a>
              </li>
              <li>
                <a href={PHONE_HREF} data-umami-event="contact_phone" data-uisfx="connect" data-uisfx-hover="focus" className={cn(link, "inline-flex items-center gap-2")}>
                  {PH.phone}
                </a>
              </li>
              <li>
                <a href={APP_HREF} data-umami-event="open_app" data-uisfx="open" data-uisfx-hover="select" className={cn(link, "inline-flex items-center gap-2")}>
                  <Icon name="arrow-up-right" size={17} /> Open the app · {PH.app}
                </a>
              </li>
              <li className="text-paper/70">We reply within {PH.reply}.</li>
            </ul>
          </div>
        </div>

        <div aria-hidden="true" className="footer-word mt-20 select-none overflow-hidden">
          <div className="whitespace-nowrap text-center font-display text-[clamp(4.5rem,15vw,14rem)] font-extrabold leading-[0.8] tracking-tighter text-paper/[0.09]">
            {"FleetOPS".split("").map((c, i) => (
              <span
                key={i}
                className="footer-letter inline-block transition-colors duration-200 hover:text-paper/25"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="footer-track relative mt-5 h-px origin-left bg-white/20">
            <span className="footer-truck absolute -top-5 left-0 grid size-10 place-items-center rounded-full border border-white/20 bg-ink text-paper/75">
              <Icon name="truck" size={18} />
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5 border-t border-white/15 pt-6 text-sm text-paper/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {PH.company}. Fleet OPS is compliance and maintenance software. It does not track vehicles.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="/privacy.html" className={cn(link, "font-semibold")}>Privacy</a>
            <a href="/terms.html" className={cn(link, "font-semibold")}>Terms</a>
            <button
              type="button"
              role="switch"
              aria-checked={motion}
              onClick={() => setMotion(!motion)}
              className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-white/25 py-2 pl-4 pr-2 font-semibold text-paper transition-colors duration-200 hover:border-brand"
            >
              <span>Motion: {motion ? "on" : "off"}</span>
              <span
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors duration-200",
                  motion ? "bg-brand" : "bg-white/25"
                )}
                aria-hidden="true"
              >
                <span
                  className="absolute top-1 size-4 rounded-full bg-ink transition-[left] duration-200 ease-out"
                  style={{ left: motion ? 24 : 4, background: motion ? "#0b0f0d" : "#f3f1ea" }}
                />
              </span>
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={sound}
              onClick={() => void setSound(!sound)}
              className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-white/25 py-2 pl-4 pr-2 font-semibold text-paper transition-colors duration-200 hover:border-brand"
            >
              <span>Sound: {sound ? "on" : "off"}</span>
              <span
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors duration-200",
                  sound ? "bg-brand" : "bg-white/25"
                )}
                aria-hidden="true"
              >
                <span
                  className="absolute top-1 size-4 rounded-full transition-[left] duration-200 ease-out"
                  style={{ left: sound ? 24 : 4, background: sound ? "#0b0f0d" : "#f3f1ea" }}
                />
              </span>
            </button>
            {reducedPref && <span className="text-xs text-paper/60">Your device asks for reduced motion.</span>}
            <a href="#top" onClick={go("top")} className={cn(link, "inline-flex items-center gap-2 font-semibold")}>
              Back to top <Icon name="arrow-up-right" size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
