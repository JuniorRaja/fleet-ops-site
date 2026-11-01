import { PAPER_DOCS, PaperCard } from "@/components/ui/PaperCard";

/**
 * Static poster of the desk. This is the mobile hero, the reduced-motion hero and the
 * no-WebGL fallback, and it sits under the 3D canvas while three.js loads.
 * Layer ids (HERO-BG-01 / HERO-MG-01 / HERO-FG-01) mark where real art can be dropped in.
 */
const LAYOUT = [
  { l: 36, t: 24, r: -4, s: 0.7 },
  { l: 42, t: 32, r: -2.5, s: 0.76 },
  { l: 48, t: 40, r: -1, s: 0.82 },
  { l: 54, t: 48, r: 0.5, s: 0.88 },
  { l: 60, t: 56, r: 2, s: 0.94 },
  { l: 66, t: 64, r: 3.5, s: 1 },
];

export function PaperPoster() {
  return (
    <div
      className="absolute inset-0 [--ps:.72] min-[520px]:[--ps:.88] lg:[--ps:1.05]"
      data-asset="HERO-MG-01"
      aria-hidden="true"
    >
      <div
        className="absolute inset-[6%] rounded-[36px] border border-ink/10"
        style={{
          background:
            "linear-gradient(rgba(11,15,13,.06) 1px, transparent 1px) 0 0/48px 48px, linear-gradient(90deg, rgba(11,15,13,.06) 1px, transparent 1px) 0 0/48px 48px, #e6e3d8",
        }}
        data-asset="HERO-BG-01"
      />
      {PAPER_DOCS.map((doc, i) => {
        const p = LAYOUT[i];
        return (
          <div
            key={doc.id}
            className="absolute"
            style={{ left: `${p.l}%`, top: `${p.t}%`, width: 148, height: 196, marginLeft: -74, marginTop: -98, zIndex: i + 1 }}
          >
            <div style={{ transform: `rotate(${p.r}deg) scale(calc(var(--ps) * ${p.s}))` }}>
              <PaperCard
                doc={doc}
                className="shadow-[0_26px_34px_-14px_rgba(11,15,13,.38),0_4px_8px_rgba(11,15,13,.12)]"
              />
            </div>
          </div>
        );
      })}
      {/* HERO-FG-01: foreground clip */}
      <svg
        className="absolute left-[8%] top-[10%] w-10 rotate-[18deg] text-ink/70 sm:w-14"
        viewBox="0 0 40 90"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        data-asset="HERO-FG-01"
      >
        <path d="M28 18v48a10 10 0 0 1-20 0V22a7 7 0 0 1 14 0v42a4 4 0 0 1-8 0V28" />
      </svg>
    </div>
  );
}
