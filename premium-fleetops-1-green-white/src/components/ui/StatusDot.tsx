import type { Status } from "@/lib/fleet";
import { cn } from "@/utils/cn";

export const STATUS_META: Record<
  Status,
  { label: string; bg: string; ring: string; fg: string; chip: string; glyph: string }
> = {
  valid: {
    label: "Valid",
    bg: "#0f9d6a",
    ring: "#0f9d6a",
    fg: "#ffffff",
    chip: "bg-[#dff5ea] text-[#05603a]",
    glyph: "M2.6 6.4 5 8.8l4.4-5.2",
  },
  expiring: {
    label: "Expiring soon",
    bg: "#f0a020",
    ring: "#f0a020",
    fg: "#2b1a00",
    chip: "bg-[#fdf0cc] text-[#7a4a00]",
    glyph: "M6 2.8v4M6 9.2v.1",
  },
  pending: {
    label: "Pending proof",
    bg: "#fff3d6",
    ring: "#e08a00",
    fg: "#7a4a00",
    chip: "bg-[#fff7e0] text-[#7a4a00] ring-1 ring-[#f0a020]/60",
    glyph: "M6 9.4V3M3.2 5.6 6 2.8l2.8 2.8",
  },
  expired: {
    label: "Expired",
    bg: "#d92d2d",
    ring: "#d92d2d",
    fg: "#ffffff",
    chip: "bg-[#fde4e2] text-[#a4191a]",
    glyph: "M3.2 3.2l5.6 5.6M8.8 3.2 3.2 8.8",
  },
};

/** Status is never colour-only: every state has its own glyph. */
export function StatusDot({ status, size = 22, className }: { status: Status; size?: number; className?: string }) {
  const m = STATUS_META[status];
  return (
    <span
      className={cn("relative inline-grid shrink-0 place-items-center rounded-full bg-ink/10", className)}
      style={{ width: size, height: size }}
    >
      <span
        className="dot-fill absolute inset-0 rounded-full"
        style={{ background: m.bg, boxShadow: status === "pending" ? `inset 0 0 0 2px ${m.ring}` : undefined }}
      />
      <svg
        className="dot-glyph relative"
        width={size * 0.56}
        height={size * 0.56}
        viewBox="0 0 12 12"
        fill="none"
        stroke={m.fg}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={m.glyph} />
      </svg>
    </span>
  );
}

export function StatusChip({ status, children }: { status: Status; children?: React.ReactNode }) {
  const m = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        m.chip
      )}
    >
      <span className="size-1.5 rounded-full" style={{ background: m.ring }} />
      {children ?? m.label}
    </span>
  );
}
