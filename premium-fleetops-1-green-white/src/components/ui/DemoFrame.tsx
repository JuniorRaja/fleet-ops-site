import type { ReactNode } from "react";
import { Icon } from "./Icons";
import { Reveal } from "./Reveal";
import { cn } from "@/utils/cn";

export function LiveRegion({ message }: { message: string }) {
  return (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
}

/** Interactive demo shell: "Example data" chip, Reset button and a polite live region. */
export function DemoFrame({
  children,
  onReset,
  announce,
  className,
}: {
  children: ReactNode;
  onReset: () => void;
  announce: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-ink/10 bg-white/85 p-3 shadow-[0_40px_90px_-50px_rgba(11,15,13,0.55)] backdrop-blur sm:p-5",
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink/70">
          <span className="size-1.5 rounded-full bg-warn" aria-hidden="true" />
          Example data
        </span>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-ink hover:text-paper"
        >
          <Icon name="undo" size={16} />
          Reset
        </button>
      </div>
      {children}
      <LiveRegion message={announce} />
    </div>
  );
}

export function DemoHead({
  id,
  tag,
  title,
  children,
}: {
  id: string;
  tag: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mb-8 grid gap-5 lg:mb-12 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <Reveal>
          <p className="eyebrow text-brand">{tag}</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 id={id} className="display mt-4 text-[clamp(2.3rem,5.4vw,4.8rem)]">
            {title}
          </h2>
        </Reveal>
      </div>
      <Reveal delay={120} className="lg:col-span-5">
        <p className="max-w-md text-[17px] leading-relaxed text-ink/70">{children}</p>
      </Reveal>
    </div>
  );
}
