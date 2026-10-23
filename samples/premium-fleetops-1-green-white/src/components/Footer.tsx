import type { MouseEvent } from "react";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icons";
import { scrollToId } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { APP_HREF, EMAIL_HREF, PH, WHATSAPP_HREF } from "@/lib/config";
import { cn } from "@/utils/cn";

const PRODUCT = [
  { id: "how", label: "How it works" },
  { id: "features", label: "Features" },
  { id: "demo-matrix", label: "Compliance matrix demo" },
  { id: "demo-dispatch", label: "Dispatch demo" },
  { id: "demo-save", label: "One-save demo" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

export function Footer() {
  const { motion, setMotion, reducedPref } = useMotion();
  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };
  const link = "rounded text-paper/75 transition-colors duration-200 hover:text-lime";

  return (
    <footer className="on-dark relative overflow-hidden bg-ink pb-28 pt-20 text-paper lg:pb-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a href="#top" onClick={go("top")} className="inline-block rounded-full" aria-label="Fleet OPS, back to top">
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
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={cn(link, "inline-flex items-center gap-2")}>
                  <Icon name="chat" size={17} /> WhatsApp a demo request
                </a>
              </li>
              <li>
                <a href={EMAIL_HREF} className={cn(link, "inline-flex items-center gap-2")}>
                  <Icon name="mail" size={17} /> {PH.email}
                </a>
              </li>
              <li>
                <a href={APP_HREF} className={cn(link, "inline-flex items-center gap-2")}>
                  <Icon name="arrow-up-right" size={17} /> Open the app · {PH.app}
                </a>
              </li>
              <li className="text-paper/70">We reply within {PH.reply}.</li>
            </ul>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mt-20 select-none whitespace-nowrap text-center font-display text-[clamp(4.5rem,22vw,21rem)] font-extrabold leading-[0.8] tracking-tighter text-paper/[0.09]"
        >
          {"FleetOPS".split("").map((c, i) => (
            <span
              key={i}
              className="inline-block transition-[transform,color] duration-200 ease-out hover:-translate-y-3 hover:text-lime"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-5 border-t border-white/15 pt-6 text-sm text-paper/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {PH.company}. Fleet OPS is compliance and maintenance software. It does not track vehicles.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              role="switch"
              aria-checked={motion}
              onClick={() => setMotion(!motion)}
              className="group inline-flex items-center gap-3 rounded-full border border-white/25 py-2 pl-4 pr-2 font-semibold text-paper transition-colors duration-200 hover:border-lime"
            >
              <span>Motion: {motion ? "on" : "off"}</span>
              <span
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors duration-200",
                  motion ? "bg-lime" : "bg-white/25"
                )}
                aria-hidden="true"
              >
                <span
                  className="absolute top-1 size-4 rounded-full bg-ink transition-[left] duration-200 ease-out"
                  style={{ left: motion ? 24 : 4, background: motion ? "#0b0f0d" : "#f3f1ea" }}
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
