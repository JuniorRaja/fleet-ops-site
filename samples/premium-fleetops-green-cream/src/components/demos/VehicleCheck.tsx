import { useState } from "react";
import { Reveal } from "../Reveal";

type State = "available" | "ontrip" | "workshop" | "hold";

type Vehicle = {
  reg: string;
  make: string;
  state: State;
  note?: string;
};

const VEHICLES: Vehicle[] = [
  { reg: "TN 00 AB 1201", make: "Lorry · Ashok Leyland", state: "available" },
  { reg: "TN 00 CD 3307", make: "Trailer · BharatBenz", state: "ontrip" },
  { reg: "TN 00 EF 5520", make: "Bus · Tata Motors", state: "workshop" },
  {
    reg: "TN 00 GH 7714",
    make: "Lorry · Eicher",
    state: "hold",
    note: "Put on hold by Ravi, 12 Oct: insurance expired, renewal pending",
  },
];

const meta: Record<
  State,
  { label: string; chip: string; dot: string }
> = {
  available: { label: "Available", chip: "bg-brand-50 text-brand-700 ring-brand-200", dot: "bg-valid" },
  ontrip: { label: "On trip", chip: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" },
  workshop: { label: "In workshop", chip: "bg-amber-50 text-[#b54708] ring-amber-200", dot: "bg-soon" },
  hold: { label: "Document hold", chip: "bg-red-50 text-[#b42318] ring-red-200", dot: "bg-expired" },
};

export function VehicleCheck() {
  const [sel, setSel] = useState<Vehicle>(VEHICLES[0]);
  const [reason, setReason] = useState("");
  const [role, setRole] = useState<"incharge" | "owner">("incharge");
  const [records, setRecords] = useState<string[]>([]);
  const [overrideReason, setOverrideReason] = useState("");

  const needsReason = sel.state === "hold" || sel.state === "workshop";
  const canSave =
    sel.state === "available" || (needsReason && reason.trim().length > 3);
  const saveDisabled = sel.state === "ontrip" || !canSave;

  const pick = (v: Vehicle) => {
    setSel(v);
    setReason("");
    setOverrideReason("");
  };

  const dispatch = () => {
    if (saveDisabled) return;
    if (sel.state === "available") {
      setRecords((r) => [
        `Trip saved · ${sel.reg} · Driver assigned · 13 Oct, 7:42 AM`,
        ...r,
      ]);
    } else {
      setRecords((r) => [
        `Dispatched with reason · Ravi (Transport in-charge) · 13 Oct, 7:42 AM · "${reason.trim()}"`,
        ...r,
      ]);
    }
    setReason("");
  };

  const takeOffHold = () => {
    if (role === "owner" && overrideReason.trim().length > 3) {
      setRecords((r) => [
        `Released from hold (owner override) · 13 Oct, 7:45 AM · "${overrideReason.trim()}"`,
        ...r,
      ]);
      setOverrideReason("");
    }
  };

  return (
    <section
      id="dispatch"
      className="relative scroll-mt-24 overflow-hidden bg-ink py-24 text-white lg:py-28"
    >
      <div aria-hidden className="absolute inset-0 -z-0">
        <div className="animate-drift absolute -left-20 top-0 h-[28rem] w-[28rem] rounded-full bg-brand-600/20 blur-[120px]" />
        <div
          className="animate-drift absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-emerald-500/10 blur-[120px]"
          style={{ animationDelay: "-10s" }}
        />
        <div className="grain absolute inset-0 opacity-20" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
            Product · Dispatch guard
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Can this vehicle go today?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            One question, one honest answer. A vehicle on expired papers or in
            the workshop can only leave with a written reason — on the record.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          {/* Vehicle picker */}
          <Reveal className="space-y-3">
            {VEHICLES.map((v) => {
              const m = meta[v.state];
              const active = sel.reg === v.reg;
              return (
                <button
                  key={v.reg}
                  onClick={() => pick(v)}
                  aria-pressed={active}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-brand-400 bg-white/10 ring-1 ring-brand-400"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${m.dot}`} />
                    <div>
                      <p className="text-sm font-bold">{v.reg}</p>
                      <p className="text-xs text-white/45">{v.make}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${m.chip}`}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </Reveal>

          {/* Decision panel */}
          <Reveal delay={0.1} className="rounded-3xl glass-dark p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-xl font-semibold">{sel.reg}</p>
                <p className="text-sm text-white/50">{sel.make}</p>
              </div>
              <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${meta[sel.state].chip}`}>
                {meta[sel.state].label}
              </span>
            </div>

            <div aria-live="polite" className="mt-5 space-y-4">
              {sel.state === "available" && (
                <div className="rounded-2xl bg-brand-500/15 p-4 ring-1 ring-brand-400/30">
                  <p className="text-sm font-semibold text-brand-200">Free to go.</p>
                  <p className="mt-1 text-sm text-white/70">
                    Choose a driver and save the trip.
                  </p>
                </div>
              )}

              {sel.state === "ontrip" && (
                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <p className="text-sm font-semibold text-white/80">Already on a trip.</p>
                  <p className="mt-1 text-sm text-white/60">
                    It cannot be sent on a second trip. Save is disabled.
                  </p>
                </div>
              )}

              {needsReason && (
                <>
                  <div className="flex items-start gap-3 rounded-2xl bg-red-500/10 p-4 ring-1 ring-red-400/30">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-red-300" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 9v4m0 4h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm text-red-100">
                      {sel.state === "hold"
                        ? sel.note
                        : "This vehicle is in the workshop. Sending it out is not recommended."}
                    </p>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium text-white/80">
                      Why is it being dispatched anyway? <span className="text-red-300">*</span>
                    </span>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={2}
                      placeholder="Type a reason to enable Save…"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-brand-400"
                    />
                  </label>
                </>
              )}

              <button
                onClick={dispatch}
                disabled={saveDisabled}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  saveDisabled
                    ? "cursor-not-allowed bg-white/10 text-white/35"
                    : "bg-brand-500 text-white hover:bg-brand-400"
                }`}
              >
                {sel.state === "available" ? "Save the trip" : "Dispatch with reason"}
              </button>
            </div>

            {/* Take off hold */}
            {sel.state === "hold" && (
              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white/80">Take off hold</p>
                  <div className="flex rounded-xl bg-white/5 p-1 ring-1 ring-white/10" role="group" aria-label="Role">
                    {(["incharge", "owner"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setRole(r)}
                        aria-pressed={role === r}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          role === r ? "bg-white text-ink" : "text-white/60"
                        }`}
                      >
                        {r === "incharge" ? "In-charge" : "Owner"}
                      </button>
                    ))}
                  </div>
                </div>

                {role === "incharge" ? (
                  <p className="mt-3 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-100 ring-1 ring-amber-400/30">
                    Renew the expired document before releasing this vehicle from hold.
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    <textarea
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      rows={2}
                      placeholder="Reason for override…"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-brand-400"
                    />
                    <button
                      onClick={takeOffHold}
                      disabled={overrideReason.trim().length <= 3}
                      className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        overrideReason.trim().length <= 3
                          ? "cursor-not-allowed bg-white/10 text-white/35"
                          : "bg-white text-ink hover:bg-white/90"
                      }`}
                    >
                      Override and release
                    </button>
                  </div>
                )}
              </div>
            )}
          </Reveal>
        </div>

        {/* Records */}
        {records.length > 0 && (
          <Reveal className="mt-6 rounded-2xl glass-dark p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white/80">Audit trail</p>
              <button
                onClick={() => setRecords([])}
                className="text-xs font-semibold text-white/50 hover:text-white"
              >
                Clear
              </button>
            </div>
            <ul aria-live="polite" className="mt-3 space-y-2">
              {records.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
