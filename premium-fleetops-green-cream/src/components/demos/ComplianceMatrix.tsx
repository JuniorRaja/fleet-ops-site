import { useMemo, useState } from "react";
import { Reveal } from "../Reveal";

type Status = "valid" | "soon" | "expired" | "pending";

type Cell = { status: Status; date: string; note?: string };
type Vehicle = { reg: string; make: string; cells: Record<string, Cell> };

const COLS = ["Fitness", "Insurance", "PUC", "Permit", "RC", "Road tax"];

const DATA: Vehicle[] = [
  {
    reg: "TN 81 F 2504",
    make: "Bus · Ashok Leyland",
    cells: {
      Fitness: { status: "valid", date: "5 Nov 2026" },
      Insurance: { status: "valid", date: "21 Sep 2027" },
      PUC: { status: "valid", date: "1 Jul 2027" },
      Permit: { status: "valid", date: "16 Aug 2028" },
      RC: { status: "soon", date: "5 Nov 2026", note: "Within lead time" },
      "Road tax": { status: "soon", date: "12 Oct 2026", note: "Pending proof" },
    },
  },
  {
    reg: "TN 81 F 2505",
    make: "Bus · Ashok Leyland",
    cells: {
      Fitness: { status: "valid", date: "6 Nov 2028" },
      Insurance: { status: "valid", date: "21 Sep 2027" },
      PUC: { status: "valid", date: "10 Apr 2027" },
      Permit: { status: "valid", date: "17 Oct 2028" },
      RC: { status: "soon", date: "6 Nov 2026", note: "Within lead time" },
      "Road tax": { status: "valid", date: "1 Dec 2026" },
    },
  },
  {
    reg: "TN 81 H 9779",
    make: "Bus · Ashok Leyland",
    cells: {
      Fitness: { status: "valid", date: "23 Feb 2028" },
      Insurance: { status: "valid", date: "21 Sep 2027" },
      PUC: { status: "pending", date: "22 Apr 2027", note: "Proof not uploaded" },
      Permit: { status: "valid", date: "3 Mar 2029" },
      RC: { status: "valid", date: "23 Feb 2028" },
      "Road tax": { status: "soon", date: "31 Oct 2026", note: "Due in 18 days" },
    },
  },
  {
    reg: "TN 81 H 9797",
    make: "Bus · Ashok Leyland",
    cells: {
      Fitness: { status: "valid", date: "23 Feb 2028" },
      Insurance: { status: "valid", date: "30 Mar 2027" },
      PUC: { status: "valid", date: "22 Apr 2027" },
      Permit: { status: "valid", date: "3 Mar 2029" },
      RC: { status: "valid", date: "24 Oct 2030" },
      "Road tax": { status: "valid", date: "3 Dec 2026" },
    },
  },
  {
    reg: "TN 81 R 8181",
    make: "Lorry · Ashok Leyland",
    cells: {
      Fitness: { status: "valid", date: "2 Feb 2028" },
      Insurance: { status: "valid", date: "7 Dec 2026" },
      PUC: { status: "valid", date: "2 Jan 2027" },
      Permit: { status: "valid", date: "2 Feb 2031" },
      RC: { status: "valid", date: "2 Feb 2028" },
      "Road tax": { status: "expired", date: "30 Jun 2026", note: "Expired 105 days ago" },
    },
  },
  {
    reg: "TN 81 T 4410",
    make: "Trailer · BharatBenz",
    cells: {
      Fitness: { status: "soon", date: "28 Oct 2026", note: "Due in 15 days" },
      Insurance: { status: "valid", date: "19 May 2027" },
      PUC: { status: "pending", date: "9 Mar 2027", note: "Proof not uploaded" },
      Permit: { status: "valid", date: "11 Jan 2029" },
      RC: { status: "valid", date: "5 Aug 2028" },
      "Road tax": { status: "valid", date: "22 Feb 2027" },
    },
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "expired", label: "Expired" },
  { key: "soon", label: "Expiring soon" },
  { key: "pending", label: "Pending proof" },
] as const;

const dotColor: Record<Status, string> = {
  valid: "bg-valid",
  soon: "bg-soon",
  expired: "bg-expired",
  pending: "bg-soon",
};
const ringColor: Record<Status, string> = {
  valid: "ring-valid/40",
  soon: "ring-soon/40",
  expired: "ring-expired/40",
  pending: "ring-soon/40",
};
const label: Record<Status, string> = {
  valid: "Valid",
  soon: "Expiring soon",
  expired: "Expired",
  pending: "Pending proof",
};

export function ComplianceMatrix() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [sel, setSel] = useState<{ reg: string; col: string } | null>(null);

  const matches = (s: Status) =>
    filter === "all" ? true : filter === s || (filter === "soon" && s === "soon");

  const summary = useMemo(() => {
    const counts: Record<string, { ok: number; total: number }> = {};
    COLS.forEach((c) => (counts[c] = { ok: 0, total: 0 }));
    DATA.forEach((v) =>
      COLS.forEach((c) => {
        counts[c].total++;
        if (v.cells[c].status === "valid") counts[c].ok++;
      }),
    );
    return counts;
  }, []);

  const selected = sel ? DATA.find((d) => d.reg === sel.reg)?.cells[sel.col] : null;

  return (
    <section id="compliance" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-24 lg:py-28">
      <Reveal className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          Product · Compliance
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          The whole fleet, one honest grid.
        </h2>
        <p className="mt-4 text-lg text-ink/60">
          Six documents per vehicle plus driver licences, each tracked to its
          expiry. Tap any dot to see the exact date. This demo uses example data.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <div className="overflow-hidden rounded-3xl border border-ink/8 bg-white/80 shadow-2xl shadow-ink/5 backdrop-blur-xl">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/5 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter documents">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                  className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                    filter === f.key
                      ? "bg-ink text-white shadow"
                      : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
                Example data
              </span>
              <button
                onClick={() => {
                  setFilter("all");
                  setSel(null);
                }}
                className="rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-ink/70 ring-1 ring-ink/10 transition hover:bg-ink/5"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Column summary */}
          <div className="hidden grid-cols-[1.4fr_repeat(6,1fr)] gap-px border-b border-ink/5 bg-ink/5 lg:grid">
            <div className="bg-white px-4 py-3 text-xs font-semibold text-ink/50">
              {DATA.length} vehicles
            </div>
            {COLS.map((c) => {
              const s = summary[c];
              return (
                <div key={c} className="bg-white px-3 py-3">
                  <p className="text-xs font-semibold text-ink">{c}</p>
                  <p className="text-[11px] text-ink/50">
                    {s.ok}/{s.total} valid
                  </p>
                </div>
              );
            })}
          </div>

          {/* Rows */}
          <div
            aria-live="polite"
            className="divide-y divide-ink/5"
          >
            {DATA.map((v, idx) => (
              <div
                key={v.reg}
                className="grid grid-cols-2 gap-y-3 px-4 py-4 transition hover:bg-brand-50/40 sm:px-5 lg:grid-cols-[1.4fr_repeat(6,1fr)] lg:items-center lg:gap-y-0"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="col-span-2 lg:col-span-1">
                  <p className="text-sm font-bold tracking-tight text-ink">{v.reg}</p>
                  <p className="text-xs text-ink/45">{v.make}</p>
                </div>
                {COLS.map((c) => {
                  const cell = v.cells[c];
                  const dim = !matches(cell.status);
                  const active = sel?.reg === v.reg && sel?.col === c;
                  return (
                    <div key={c} className="flex items-center gap-2 lg:justify-center">
                      <button
                        onClick={() => setSel(active ? null : { reg: v.reg, col: c })}
                        aria-label={`${v.reg} ${c}: ${label[cell.status]}, ${cell.date}`}
                        className={`flex items-center gap-2 rounded-lg px-1.5 py-1 transition lg:gap-0 ${
                          dim ? "opacity-25" : "opacity-100"
                        } ${active ? "ring-2 ring-brand-500 ring-offset-1" : ""}`}
                      >
                        <span
                          className={`h-3 w-3 rounded-full ring-4 ${dotColor[cell.status]} ${ringColor[cell.status]}`}
                        />
                        <span className="text-[11px] font-medium text-ink/50 lg:hidden">{c}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Legend + selected card */}
      <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-4 text-xs text-ink/60">
          {(["valid", "soon", "pending", "expired"] as Status[]).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${dotColor[s]}`} />
              {label[s]}
            </span>
          ))}
        </div>
        <p className="text-xs text-ink/40">
          Lead times: Fitness 15 · Insurance 30 · PUC 7 · Permit 45 · RC 30 · Road tax 15 days
        </p>
      </div>

      {selected && sel && (
        <div
          role="status"
          aria-live="polite"
          className="mt-5 inline-flex w-full max-w-md items-start gap-3 rounded-2xl border border-ink/8 bg-white p-4 shadow-xl shadow-ink/5"
        >
          <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${dotColor[selected.status]}`} />
          <div>
            <p className="text-sm font-semibold text-ink">
              {sel.col}: {label[selected.status].toLowerCase()}
            </p>
            <p className="mt-0.5 text-sm text-ink/60">
              {sel.reg} —{" "}
              {selected.status === "expired"
                ? `expired ${selected.date}`
                : selected.status === "valid"
                  ? `valid till ${selected.date}`
                  : `${selected.date}${selected.note ? ` · ${selected.note}` : ""}`}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
