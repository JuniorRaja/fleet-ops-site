export function Logo({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/30">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden>
          <path
            d="M3 13l2-5a2 2 0 011.9-1.4h7.2A2 2 0 0118 8l1 3 2 .6V16a1 1 0 01-1 1h-1"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7.5" cy="17" r="2" stroke="white" strokeWidth="1.8" />
          <circle cx="16.5" cy="17" r="2" stroke="white" strokeWidth="1.8" />
          <path d="M3 13h13" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span className={`font-display text-xl tracking-tight ${onDark ? "text-white" : "text-ink"}`}>
        <span className="font-semibold">Fleet</span>
        <span className="font-bold text-brand-600">OPS</span>
      </span>
    </span>
  );
}
