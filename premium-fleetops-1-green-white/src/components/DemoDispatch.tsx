import { useRef, useState, type KeyboardEvent } from "react";
import { DemoFrame, DemoHead } from "@/components/ui/DemoFrame";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/utils/cn";

type VStatus = "available" | "trip" | "workshop" | "hold";
type Role = "incharge" | "owner";

interface Veh {
  plate: string;
  kind: string;
  status: VStatus;
  note?: string;
}

interface Rec {
  id: number;
  plate: string;
  parts: string[];
  reason?: string;
}

const START: Veh[] = [
  { plate: "TN 00 AB 1201", kind: "Lorry · Tata Prima 4028", status: "available" },
  { plate: "TN 00 CD 3307", kind: "Lorry · Ashok Leyland 3718", status: "trip", note: "Out since 6:10 AM on Chennai Port to Sriperumbudur." },
  { plate: "TN 00 EF 5520", kind: "Lorry · Eicher Pro 6049", status: "workshop", note: "Brake overhaul since 11 Oct. Job card JC-2291 is still open." },
  {
    plate: "TN 00 GH 7714",
    kind: "Lorry · BharatBenz 3523R",
    status: "hold",
    note: "Put on hold by Ravi, 12 Oct: insurance expired, renewal pending",
  },
];

const UI: Record<VStatus, { label: string; dot: string; chip: string }> = {
  available: { label: "Available", dot: "#0f9d6a", chip: "bg-[#dff5ea] text-[#05603a]" },
  trip: { label: "On trip", dot: "#2f7d8c", chip: "bg-[#dcf0f4] text-[#12525e]" },
  workshop: { label: "In workshop", dot: "#f0a020", chip: "bg-[#fdf0cc] text-[#7a4a00]" },
  hold: { label: "Document hold", dot: "#d92d2d", chip: "bg-[#fde4e2] text-[#a4191a]" },
};

const DRIVERS = ["Selvam K", "Murugan R", "Ibrahim S", "Karthik V"];
const ACTOR: Record<Role, string> = { incharge: "Ravi (Transport in-charge)", owner: "Owner" };

const stamp = (n: number) => `13 Oct, 7:${String(Math.min(42 + n, 59)).padStart(2, "0")} AM`;

const inputCls =
  "w-full rounded-xl border border-ink/20 bg-white px-3.5 py-3 text-[15px] placeholder:text-ink/45 focus:border-ink disabled:bg-ink/5";

export function DemoDispatch() {
  const [vehicles, setVehicles] = useState<Veh[]>(START);
  const [plate, setPlate] = useState(START[0].plate);
  const [driver, setDriver] = useState("");
  const [reason, setReason] = useState("");
  const [releaseReason, setReleaseReason] = useState("");
  const [role, setRole] = useState<Role>("incharge");
  const [records, setRecords] = useState<Rec[]>([]);
  const [msg, setMsg] = useState("");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const v = vehicles.find((x) => x.plate === plate)!;
  const actor = ACTOR[role];
  const guarded = v.status === "hold" || v.status === "workshop";

  const canSave =
    v.status === "available" ? driver !== "" : guarded ? reason.trim().length > 0 : false;

  const hint: Record<VStatus, string> = {
    available: "Free. Choose a driver and save the trip.",
    trip: "It cannot be sent on a second trip.",
    workshop: "Warning: in workshop. A written reason is required to dispatch.",
    hold: "Warning: on document hold. A written reason is required to dispatch.",
  };

  const choose = (p: string) => {
    const next = vehicles.find((x) => x.plate === p)!;
    setPlate(p);
    setDriver("");
    setReason("");
    setReleaseReason("");
    setMsg(`${p} selected. ${UI[next.status].label}. ${hint[next.status]}`);
  };

  const onKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = vehicles.findIndex((x) => x.plate === plate);
    let n = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % vehicles.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + vehicles.length) % vehicles.length;
    else return;
    e.preventDefault();
    choose(vehicles[n].plate);
    refs.current[n]?.focus();
  };

  const setStatus = (p: string, status: VStatus, note?: string) =>
    setVehicles((list) => list.map((x) => (x.plate === p ? { ...x, status, note } : x)));

  const save = () => {
    if (!canSave) return;
    const id = records.length + 1;
    if (v.status === "available") {
      setRecords((r) => [{ id, plate, parts: ["Trip saved", `Driver ${driver}`, actor, stamp(records.length)] }, ...r]);
      setMsg(`Trip saved for ${plate} with driver ${driver}. The vehicle is now on trip.`);
    } else {
      setRecords((r) => [
        { id, plate, parts: ["Dispatched with reason", actor, stamp(records.length)], reason: reason.trim() },
        ...r,
      ]);
      setMsg(`${plate} dispatched with a written reason. A record row was added.`);
    }
    setStatus(plate, "trip", `Out now, saved ${stamp(records.length)}.`);
    setDriver("");
    setReason("");
  };

  const release = () => {
    if (role !== "owner" || !releaseReason.trim()) return;
    const id = records.length + 1;
    setRecords((r) => [
      { id, plate, parts: ["Hold released by override", "Owner", stamp(records.length)], reason: releaseReason.trim() },
      ...r,
    ]);
    setStatus(plate, "available");
    setReleaseReason("");
    setMsg(`${plate} released from hold by the owner. It is now available.`);
  };

  const reset = () => {
    setVehicles(START);
    setPlate(START[0].plate);
    setDriver("");
    setReason("");
    setReleaseReason("");
    setRole("incharge");
    setRecords([]);
    setMsg("Demo reset. TN 00 AB 1201 selected.");
  };

  return (
    <section id="demo-dispatch" aria-labelledby="d2-title" className="relative bg-paper pb-10 pt-24 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <DemoHead id="d2-title" tag="Try it · Demo 2 of 3" title="Can this vehicle go today?">
          Pick a vehicle. Fleet OPS tells you in one line, and asks for a written reason when a vehicle is not fit to roll.
        </DemoHead>

        <DemoFrame onReset={reset} announce={msg}>
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p id="d2-pick" className="eyebrow mb-3 text-ink/65">
                Choose a vehicle
              </p>
              <div role="radiogroup" aria-labelledby="d2-pick" onKeyDown={onKeys} className="grid gap-3 sm:grid-cols-2">
                {vehicles.map((x, i) => {
                  const active = x.plate === plate;
                  return (
                    <button
                      key={x.plate}
                      ref={(el) => {
                        refs.current[i] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      tabIndex={active ? 0 : -1}
                      onClick={() => choose(x.plate)}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition-[box-shadow,border-color,background] duration-200",
                        active ? "border-ink bg-white shadow-[0_0_0_2px_var(--color-ink)]" : "border-ink/15 bg-white/70 hover:border-ink/50"
                      )}
                    >
                      <span className="block font-mono text-[13px] font-semibold">{x.plate}</span>
                      <span className="mt-0.5 block text-xs text-ink/65">{x.kind}</span>
                      <span
                        className={cn(
                          "mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                          UI[x.status].chip
                        )}
                      >
                        <span className="size-1.5 rounded-full" style={{ background: UI[x.status].dot }} />
                        {UI[x.status].label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-paper/70 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[15px] font-semibold">{v.plate}</p>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", UI[v.status].chip)}>
                  <span className="size-1.5 rounded-full" style={{ background: UI[v.status].dot }} />
                  {UI[v.status].label}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink/65">Signed in as {actor}</p>

              {v.note && <p className="mt-3 rounded-xl bg-white px-3.5 py-3 text-sm text-ink/80">{v.note}</p>}

              {v.status === "available" && (
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#e4f6ec] p-3.5 text-sm text-[#05603a]">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0" />
                  <p>
                    <strong>Free.</strong> Choose a driver and save the trip.
                  </p>
                </div>
              )}
              {v.status === "trip" && (
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#dcf0f4] p-3.5 text-sm text-[#12525e]">
                  <Icon name="truck" size={18} className="mt-0.5 shrink-0" />
                  <p>
                    <strong>It cannot be sent on a second trip.</strong>
                  </p>
                </div>
              )}
              {guarded && (
                <div role="alert" className="mt-4 flex items-start gap-3 rounded-xl border border-[#f0a020]/60 bg-[#fff6dd] p-3.5 text-sm text-[#6b4000]">
                  <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
                  <p>
                    <strong>{v.status === "hold" ? "This vehicle is on document hold." : "This vehicle is in the workshop."}</strong>{" "}
                    It can still go, but only with a written reason, saved with your name and the time.
                  </p>
                </div>
              )}

              {v.status !== "trip" && (
                <div className="mt-4 grid gap-3">
                  <div>
                    <label htmlFor="d2-driver" className="eyebrow mb-1.5 block text-ink/70">
                      Driver {guarded && <span className="normal-case tracking-normal">(optional)</span>}
                    </label>
                    <select id="d2-driver" value={driver} onChange={(e) => setDriver(e.target.value)} className={inputCls}>
                      <option value="">Select a driver</option>
                      {DRIVERS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  {guarded && (
                    <div>
                      <label htmlFor="d2-reason" className="eyebrow mb-1.5 block text-ink/70">
                        Why is it being dispatched anyway? <span className="text-[#a4191a]">Required</span>
                      </label>
                      <textarea
                        id="d2-reason"
                        required
                        aria-required="true"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. Container is already gated in at the port, renewal done by evening."
                        className={inputCls}
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={save}
                disabled={!canSave}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-paper transition-colors duration-200 enabled:hover:bg-brand disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/60"
              >
                {v.status === "trip" ? <Icon name="lock" size={17} /> : <Icon name="check" size={17} />}
                {guarded ? "Dispatch anyway" : "Save trip"}
              </button>
              {v.status === "trip" && <p className="mt-2 text-center text-xs text-ink/65">Save is disabled while the vehicle is out.</p>}
              {guarded && !reason.trim() && <p className="mt-2 text-center text-xs text-ink/65">Save stays disabled until a reason is typed.</p>}

              {v.status === "hold" && (
                <div className="mt-5 border-t border-ink/10 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-lg font-bold">Take off hold</p>
                    <div role="radiogroup" aria-label="Role" className="inline-flex rounded-full bg-ink/8 p-1">
                      {(["incharge", "owner"] as Role[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          role="radio"
                          aria-checked={role === r}
                          onClick={() => {
                            setRole(r);
                            setMsg(r === "owner" ? "Role: Owner. Override and release is available." : "Role: In-charge. Renew the expired document before releasing.");
                          }}
                          className={cn(
                            "rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
                            role === r ? "bg-ink text-paper" : "text-ink/75 hover:text-ink"
                          )}
                        >
                          {r === "incharge" ? "In-charge" : "Owner"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {role === "incharge" ? (
                    <p className="mt-3 flex items-start gap-3 rounded-xl bg-white p-3.5 text-sm text-ink/80">
                      <Icon name="file" size={18} className="mt-0.5 shrink-0 text-ink/60" />
                      Renew the expired document before releasing this vehicle from hold.
                    </p>
                  ) : (
                    <div className="mt-3 grid gap-3">
                      <div>
                        <label htmlFor="d2-release" className="eyebrow mb-1.5 block text-ink/70">
                          Reason for the override <span className="text-[#a4191a]">Required</span>
                        </label>
                        <textarea
                          id="d2-release"
                          rows={2}
                          value={releaseReason}
                          onChange={(e) => setReleaseReason(e.target.value)}
                          placeholder="e.g. Renewal paid today, certificate arrives tomorrow."
                          className={inputCls}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={release}
                        disabled={!releaseReason.trim()}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-ink px-6 py-3 text-[15px] font-semibold transition-colors duration-200 enabled:hover:bg-ink enabled:hover:text-paper disabled:cursor-not-allowed disabled:border-ink/20 disabled:text-ink/55"
                      >
                        <Icon name="key" size={17} />
                        Override and release
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5">
            <p className="eyebrow mb-2.5 text-ink/65">Records</p>
            {records.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-ink/20 px-4 py-4 text-sm text-ink/65">
                Nothing yet. Save a trip, or dispatch a held vehicle with a reason, and the record lands here.
              </p>
            ) : (
              <ol className="grid gap-2">
                {records.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm">
                    <span className="rounded-md bg-ink px-2 py-0.5 font-mono text-[11px] font-semibold text-paper">{r.plate}</span>
                    <span>
                      <span className="font-semibold">{r.parts[0]}</span>
                      {r.parts.slice(1).map((p) => (
                        <span key={p}> · {p}</span>
                      ))}
                      {r.reason && <span> · “{r.reason}”</span>}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </DemoFrame>
      </div>
    </section>
  );
}
