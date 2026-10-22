import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_HREF } from "@/lib/config";
import { cn } from "@/utils/cn";

/** Thumb-reach conversion bar for small screens, shown after the hero. */
export function MobileCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-transform duration-300 ease-out lg:hidden",
        show ? "translate-y-0" : "translate-y-[120%]"
      )}
      aria-hidden={!show}
    >
      <div className="glass mx-auto flex max-w-md items-center gap-3 rounded-full p-2 pl-5">
        <p className="flex-1 text-sm font-semibold leading-tight">Papers in order, from day one.</p>
        <Button
          href={WHATSAPP_HREF}
          variant="brand"
          icon="chat"
          className="px-4 py-3 text-sm"
          tabIndex={show ? 0 : -1}
        >
          Book demo
        </Button>
      </div>
    </div>
  );
}
