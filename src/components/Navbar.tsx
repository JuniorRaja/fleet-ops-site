import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Icon } from "@/components/ui/Icons";
import { scrollToId } from "@/lib/gsap";
import { WHATSAPP_HREF } from "@/lib/config";
import { cn } from "@/utils/cn";

const LINKS = [
  { id: "features", label: "Features" },
  { id: "matrix-scene", label: "Matrix" },
  { id: "roles", label: "Roles" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? Math.min(window.scrollY / h, 1) : 0})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <div
        ref={bar}
        aria-hidden="true"
        style={{ transform: "scaleX(0)" }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-brand"
      />
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between rounded-full border px-3 py-2 transition-[background,box-shadow,border-color,backdrop-filter] duration-300 sm:pl-5",
            scrolled ? "glass border-white/70" : "border-transparent"
          )}
        >
          <a href="#top" onClick={go("top")} className="rounded-full py-1" aria-label="Fleet OPS, back to top">
            <Logo />
          </a>
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  className="rounded-full px-4 py-2 text-[14px] font-medium text-ink/75 transition-colors duration-200 hover:bg-ink/5 hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Magnetic className="hidden sm:inline-block">
              <Button href={WHATSAPP_HREF} variant="primary" icon="chat" className="px-5 py-3 text-[14px]" cursor="Say hi">
                Book a demo
              </Button>
            </Magnetic>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full border border-ink/15 bg-white/60 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <Icon name={open ? "x" : "menu"} />
            </button>
          </div>
        </nav>
        {open && (
          <div id="mobile-menu" className="menu-enter glass mx-auto mt-2 max-w-6xl rounded-3xl p-3 lg:hidden">
            <ul className="grid">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[17px] font-semibold hover:bg-ink/5"
                  >
                    {l.label}
                    <Icon name="arrow-right" size={18} />
                  </a>
                </li>
              ))}
            </ul>
            <Button href={WHATSAPP_HREF} variant="brand" icon="chat" className="mt-2 w-full">
              Book a demo on WhatsApp
            </Button>
          </div>
        )}
      </header>
    </>
  );
}
