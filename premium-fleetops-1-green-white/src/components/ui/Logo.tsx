import { cn } from "@/utils/cn";

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <rect width="32" height="32" rx="9" fill={dark ? "#c9f26b" : "#0b0f0d"} />
        <path
          d="M9 16.5l4.5 4.5L23 11"
          fill="none"
          stroke={dark ? "#0b0f0d" : "#c9f26b"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-[19px] leading-none tracking-tight">
        <span className="font-semibold">Fleet</span>
        <span className="font-bold">OPS</span>
      </span>
      <span className="sr-only"> home</span>
    </span>
  );
}
