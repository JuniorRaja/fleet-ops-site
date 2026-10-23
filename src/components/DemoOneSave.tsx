import { useState, type KeyboardEvent } from "react";
import { DemoFrame, DemoHead } from "@/components/ui/DemoFrame";
import { Icon, type IconName } from "@/components/ui/Icons";
import { cn } from "@/utils/cn";

interface Sheet {
  route: string;
  km: string;
  diesel: string;
  litres: string;
  toll: string;
  batta: string;
  advance: string;
  container: string;
  size: string;
  seal: string;
}

const START: Sheet = {
  route: "Chennai Port to Sriperumbudur",
  km: "142",
  diesel: "3420",
  litres: "38",
  toll: "410",
  batta: "800",
  advance: "2000",
  container: "MSKU 482913 7",
  size: "40 ft",
  seal: "SL 118204",
};

const num = (s: string) => {
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};
const inr = (n: number, d = 0) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: d, minimumFractionDigits: d });

const inputCls =
  "w-full rounded-xl border border-ink/20 bg-white px-3.5 py-3 text-[15px] placeholder:text-ink/45 focus:border-ink disabled:bg-ink/5 disabled:text-ink/70";

function Field({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  numeric,
  disabled,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  numeric?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow mb-1.5 block text-ink/70">
        {label}
      </label>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/60">{prefix}</span>}
        <input
          id={id}
          value={value}
          disabled={disabled}
          inputMode={numeric ? "decimal" : undefined}
          type={numeric ? "number" : "text"}
          step={numeric ? "any" : undefined}
          min={numeric ? 0 : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputCls, prefix && "pl-8", suffix && "pr-12")}
        />
        {suffix && <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink/60">{suffix}</span>}
      </div>
    </div>
  );
}

export function DemoOneSave() {
  const [sheet, setSheet] = useState<Sheet>(START);
  const [kind, setKind] = useState<"container" | "general">("container");
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");

  const set = (k: keyof Sheet) => (v: string) => setSheet((s) => ({ ...s, [k]: v }));

  const km = num(sheet.km);
  const litres = num(sheet.litres);
  const diesel = num(sheet.diesel);
  const toll = num(sheet.toll);
  const batta = num(sheet.batta);
  const advance = num(sheet.advance);
  const cpk = km > 0 ? (diesel + toll + batta) / km : 0;
  const mileage = litres > 0 ? km / litres : 0;
  const net = advance - batta;
  const isContainer = kind === "container";
  const canSave = km > 0 && sheet.route.trim().length > 0 && !saved;

  const save = () => {
    if (!canSave) return;
    setSaved(true);
    setMsg("Saved together. Trip closed, fuel log updated and driver account posted.");
  };

  const reset = () => {
    setSheet(START);
    setKind("container");
    setSaved(false);
    setMsg("Demo reset. The trip sheet is open again.");
  };

  const changeKind = (k: "container" | "general") => {
    setKind(k);
    setMsg(k === "container" ? "Container trip. Container fields shown." : "General cargo trip. Container fields hidden.");
  };

  const onKind = (e: KeyboardEvent<HTMLDivElement>) => {
    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      changeKind(kind === "container" ? "general" : "container");
    }
  };

  const results: { icon: IconName; title: string; idle: string; line: string }[] = [
    {
      icon: "route",
      title: "Trips",
      idle: "Waits for the save",
      line: `${isContainer ? sheet.container || "Container" : "General cargo"} · ${km} km closed · ${inr(cpk, 1)} per km`,
    },
    {
      icon: "fuel",
      title: "Fuel log",
      idle: "Waits for the save",
      line: `${litres} L diesel · ${inr(diesel)} · ${mileage.toFixed(2)} km per litre`,
    },
    {
      icon: "user",
      title: "Driver account",
      idle: "Waits for the save",
      line: `Advance ${inr(advance)} out · batta ${inr(batta)} in · ${inr(net)} to settle`,
    },
  ];

  return (
    <section id="demo-save" aria-labelledby="d3-title" className="relative bg-paper pb-24 pt-24 sm:pb-32 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <DemoHead id="d3-title" tag="Try it · Demo 3 of 3" title="One save. Three books.">
          Edit the example trip sheet, flip between container and general cargo, then press Save and close.
        </DemoHead>

        <DemoFrame onReset={reset} announce={msg}>
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
              className="rounded-2xl border border-ink/10 bg-paper/70 p-4 sm:p-5"
              aria-label="Trip sheet"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-xl font-bold">Trip sheet</p>
                <div role="radiogroup" aria-label="Cargo type" onKeyDown={onKind} className="inline-flex rounded-full bg-ink/8 p-1">
                  {(["container", "general"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={kind === k}
                      tabIndex={kind === k ? 0 : -1}
                      disabled={saved}
                      onClick={() => changeKind(k)}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed",
                        kind === k ? "bg-ink text-paper" : "text-ink/75 hover:text-ink"
                      )}
                    >
                      {k === "container" ? "Container" : "General"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field id="d3-route" label="Route" value={sheet.route} onChange={set("route")} disabled={saved} className="sm:col-span-2" />
                <Field id="d3-km" label="KM" value={sheet.km} onChange={set("km")} suffix="km" numeric disabled={saved} />
                <Field id="d3-litres" label="Diesel litres" value={sheet.litres} onChange={set("litres")} suffix="L" numeric disabled={saved} />
                <Field id="d3-diesel" label="Diesel ₹" value={sheet.diesel} onChange={set("diesel")} prefix="₹" numeric disabled={saved} />
                <Field id="d3-toll" label="Toll" value={sheet.toll} onChange={set("toll")} prefix="₹" numeric disabled={saved} />
                <Field id="d3-batta" label="Batta" value={sheet.batta} onChange={set("batta")} prefix="₹" numeric disabled={saved} />
                <Field id="d3-advance" label="Driver advance" value={sheet.advance} onChange={set("advance")} prefix="₹" numeric disabled={saved} />
              </div>

              <div className={cn("grid transition-[grid-template-rows] duration-200 ease-out", isContainer ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden" inert={!isContainer} aria-hidden={!isContainer}>
                  <div className="grid gap-3 pt-3 sm:grid-cols-3">
                    <Field id="d3-cont" label="Container number" value={sheet.container} onChange={set("container")} disabled={saved} className="sm:col-span-2" />
                    <Field id="d3-size" label="Size" value={sheet.size} onChange={set("size")} disabled={saved} />
                  </div>
                  <div className="pt-3">
                    <Field id="d3-seal" label="Seal number" value={sheet.seal} onChange={set("seal")} disabled={saved} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSave}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-[16px] font-semibold text-paper transition-colors duration-200 enabled:hover:bg-brand disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/60"
              >
                <Icon name="check" size={18} />
                {saved ? "Saved and closed" : "Save and close"}
              </button>
            </form>

            <div>
              <p className="eyebrow mb-3 text-ink/65">{saved ? "Saved together" : "On save, these update together"}</p>
              <ul className="grid gap-3">
                {results.map((r) => (
                  <li
                    key={r.title}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl border p-4 transition-[opacity,background,border-color,transform] duration-300 ease-out",
                      saved ? "lit translate-x-0 border-brand/40 bg-[#e9f7ef]" : "border-ink/10 bg-white/60 opacity-60"
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-12 shrink-0 place-items-center rounded-2xl transition-colors duration-300",
                        saved ? "bg-brand text-white" : "bg-ink/8 text-ink/60"
                      )}
                    >
                      <Icon name={r.icon} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-xl font-bold leading-tight">{r.title}</p>
                      <p className="mt-0.5 text-sm text-ink/75">{saved ? r.line : r.idle}</p>
                    </div>
                    <span
                      className={cn(
                        "ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-brand text-white transition-opacity duration-300",
                        saved ? "opacity-100" : "opacity-0"
                      )}
                      aria-hidden="true"
                    >
                      <svg className="draw-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-2xl bg-ink px-5 py-4 font-display text-xl font-semibold leading-snug text-paper">
                Saved together, or not at all.
              </p>
            </div>
          </div>
        </DemoFrame>
      </div>
    </section>
  );
}
