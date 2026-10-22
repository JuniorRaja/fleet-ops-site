import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { DemoFrame, DemoHead } from "@/components/ui/DemoFrame";
import { STATUS_META, StatusChip, StatusDot } from "@/components/ui/StatusDot";
import { Flip } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { DOC_META, DOC_ORDER, VEHICLES, describe, fmtShort, statusOf, type DocId, type Status } from "@/lib/fleet";
import { cn } from "@/utils/cn";

type Filter = "all" | "expired" | "expiring" | "pending";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "expired", label: "Expired" },
  { id: "expiring", label: "Expiring soon" },
  { id: "pending", label: "Pending proof" },
];

const COLS = "grid-cols-[84px_repeat(6,minmax(0,1fr))] sm:grid-cols-[180px_repeat(6,minmax(0,1fr))]";
const TOTAL_PAPERS = VEHICLES.length * DOC_ORDER.length;

export function DemoMatrix() {
  const { motion } = useMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const [sel, setSel] = useState<{ plate: string; doc: DocId } | null>(null);
  const [msg, setMsg] = useState("");
  const flip = useRef<ReturnType<typeof Flip.getState> | null>(null);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: TOTAL_PAPERS, expired: 0, expiring: 0, pending: 0 };
    VEHICLES.forEach((v) =>
      DOC_ORDER.forEach((d) => {
        const s = statusOf(d, v.docs[d]);
        if (s !== "valid") c[s]++;
      })
    );
    return c;
  }, []);

  const matches = (plate: string, f: Filter) => {
    if (f === "all") return true;
    const v = VEHICLES.find((x) => x.plate === plate)!;
    return DOC_ORDER.some((d) => statusOf(d, v.docs[d]) === f);
  };

  const onFilter = (f: Filter) => {
    if (f === filter) return;
    if (motion) {
      try {
        flip.current = Flip.getState(".d1-row");
      } catch {
        flip.current = null;
      }
    }
    setFilter(f);
    const shown = VEHICLES.filter((v) => matches(v.plate, f)).length;
    const label = FILTERS.find((x) => x.id === f)!.label;
    setMsg(
      f === "all"
        ? `Showing all ${VEHICLES.length} vehicles.`
        : `Filter ${label}: ${counts[f]} paper${counts[f] === 1 ? "" : "s"} across ${shown} vehicle${shown === 1 ? "" : "s"}.`
    );
    if (sel && f !== "all") {
      const v = VEHICLES.find((x) => x.plate === sel.plate)!;
      if (statusOf(sel.doc, v.docs[sel.doc]) !== f) setSel(null);
    }
  };

  useLayoutEffect(() => {
    const st = flip.current;
    if (!st) return;
    flip.current = null;
    try {
      Flip.from(st, { duration: 0.3, ease: "power2.out", stagger: 0.02 });
    } catch {
      /* the demo works without GSAP */
    }
  }, [filter]);

  const select = (plate: string, doc: DocId) => {
    if (sel?.plate === plate && sel.doc === doc) {
      setSel(null);
      setMsg("Selection cleared.");
      return;
    }
    setSel({ plate, doc });
    const v = VEHICLES.find((x) => x.plate === plate)!;
    setMsg(`${plate}. ${describe(doc, v.docs[doc]).headline}.`);
  };

  const reset = () => {
    setFilter("all");
    setSel(null);
    setMsg(`Demo reset. Showing all ${VEHICLES.length} vehicles.`);
  };

  const selVehicle = sel ? VEHICLES.find((v) => v.plate === sel.plate)! : null;
  const selInfo = sel && selVehicle ? describe(sel.doc, selVehicle.docs[sel.doc]) : null;

  return (
    <section id="demo-matrix" aria-labelledby="d1-title" className="relative bg-paper pb-10 pt-24 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <DemoHead id="d1-title" tag="Try it · Demo 1 of 3" title="Tap a dot. See the paper.">
          Six example vehicles, six papers each. Filter to what needs action, then open any dot to read its status.
          Works with a mouse, a keyboard or a thumb.
        </DemoHead>

        <DemoFrame onReset={reset} announce={msg}>
          <div role="group" aria-label="Filter papers by status" className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onFilter(f.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-200",
                    active ? "border-ink bg-ink text-paper" : "border-ink/20 bg-white hover:border-ink"
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-mono text-[11px]",
                      active ? "bg-paper/20 text-paper" : "bg-ink/8 text-ink/70"
                    )}
                  >
                    {counts[f.id]}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="table"
            aria-label="Compliance matrix, six vehicles by six papers"
            className="overflow-hidden rounded-2xl border border-ink/10 bg-white"
          >
            <div role="row" className={`grid h-14 items-center border-b border-ink/10 bg-paper/50 ${COLS}`}>
              <div role="columnheader" className="eyebrow px-3 text-ink/65 sm:px-5">
                Vehicle
              </div>
              {DOC_ORDER.map((d) => (
                <div
                  key={d}
                  role="columnheader"
                  className="px-0.5 text-center text-[10px] font-semibold sm:text-[13px]"
                  aria-label={DOC_META[d].title}
                >
                  <span className="sm:hidden">{DOC_META[d].abbr}</span>
                  <span className="hidden sm:inline">{DOC_META[d].short}</span>
                </div>
              ))}
            </div>

            {VEHICLES.map((v) => {
              const show = matches(v.plate, filter);
              const [a, b, ...rest] = v.plate.split(" ");
              return (
                <div
                  key={v.plate}
                  role="row"
                  className={cn(
                    `d1-row grid min-h-[60px] items-center border-b border-ink/10 last:border-b-0 ${COLS}`,
                    !show && "hidden"
                  )}
                >
                  <div role="rowheader" className="min-w-0 px-3 py-1 sm:px-5">
                    <p className="font-mono text-[11px] font-semibold leading-tight sm:text-[13px]">
                      <span className="block sm:inline">
                        {a} {b}
                      </span>{" "}
                      <span>{rest.join(" ")}</span>
                    </p>
                    <p className="hidden truncate text-xs text-ink/60 sm:block">{v.kind}</p>
                  </div>
                  {DOC_ORDER.map((d) => {
                    const e = v.docs[d];
                    const st = statusOf(d, e);
                    const active = sel?.plate === v.plate && sel.doc === d;
                    const dim = filter !== "all" && st !== filter;
                    return (
                      <div key={d} role="cell" className="flex justify-center">
                        <button
                          type="button"
                          aria-pressed={active}
                          aria-label={`${describe(d, e).headline}. Vehicle ${v.plate}`}
                          onClick={() => select(v.plate, d)}
                          data-cursor=""
                          className={cn(
                            "flex h-11 w-full min-w-0 max-w-[76px] flex-col items-center justify-center gap-0.5 rounded-xl transition-[background,opacity,box-shadow] duration-200 hover:bg-ink/5",
                            dim && "opacity-25",
                            active && "bg-ink/5 shadow-[inset_0_0_0_2px_var(--color-ink)]"
                          )}
                        >
                          <StatusDot status={st} size={22} />
                          <span aria-hidden="true" className="hidden text-[11px] leading-none text-ink/65 sm:block">
                            {fmtShort(e.expiry)}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div
            role="status"
            aria-live="polite"
            className="mt-4 flex min-h-[88px] items-center gap-4 rounded-2xl border border-ink/10 bg-paper/70 p-4 sm:p-5"
          >
            {sel && selInfo && selVehicle ? (
              <>
                <StatusDot status={selInfo.status} size={34} />
                <div className="min-w-0">
                  <p className="font-display text-xl font-bold leading-tight tracking-tight sm:text-2xl">{selInfo.headline}</p>
                  <p className="mt-1 text-sm text-ink/70">
                    <span className="font-mono font-semibold text-ink">{selVehicle.plate}</span> · {selInfo.detail}
                  </p>
                </div>
                <span className="ml-auto hidden sm:block">
                  <StatusChip status={selInfo.status} />
                </span>
              </>
            ) : (
              <p className="text-[15px] text-ink/70">Tap any dot to open its paper. Try the red one.</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm text-ink/70">
            <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legend">
              {(Object.keys(STATUS_META) as Status[]).map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <StatusDot status={s} size={16} />
                  {STATUS_META[s].label}
                </li>
              ))}
            </ul>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em]">
              Lead times · Fitness 15 · Insurance 30 · PUC 7 · Permit 45 · RC 30 · Road tax 15 days
            </p>
          </div>
        </DemoFrame>
      </div>
    </section>
  );
}
