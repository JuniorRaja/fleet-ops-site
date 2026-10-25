export type DocId = "fitness" | "insurance" | "puc" | "permit" | "rc" | "tax";
export type Status = "valid" | "expiring" | "pending" | "expired";

/** Sample records keep their relative status as the calendar moves. */
const REFERENCE_DATE = "2026-10-13";

export const DOC_ORDER: DocId[] = ["fitness", "insurance", "puc", "permit", "rc", "tax"];

export const DOC_META: Record<DocId, { short: string; abbr: string; title: string; lead: number }> = {
  fitness: { short: "Fitness", abbr: "Fit.", title: "Fitness certificate", lead: 15 },
  insurance: { short: "Insurance", abbr: "Ins.", title: "Insurance policy", lead: 30 },
  puc: { short: "PUC", abbr: "PUC", title: "Pollution under control", lead: 7 },
  permit: { short: "Permit", abbr: "Perm.", title: "National permit", lead: 45 },
  rc: { short: "RC", abbr: "RC", title: "Registration certificate", lead: 30 },
  tax: { short: "Road tax", abbr: "Tax", title: "Road tax receipt", lead: 15 },
};

export interface DocEntry {
  expiry: string; // ISO yyyy-mm-dd
  pending?: boolean; // renewed, proof not uploaded yet
}

export interface Vehicle {
  plate: string;
  kind: string;
  docs: Record<DocId, DocEntry>;
}

const d = (expiry: string, pending = false): DocEntry => ({ expiry, pending });

const BASE_VEHICLES: Vehicle[] = [
  {
    plate: "TN 00 AB 1201",
    kind: "Lorry · Tata Prima 4028",
    docs: {
      fitness: d("2027-03-05"),
      insurance: d("2026-11-14"),
      puc: d("2027-04-02"),
      permit: d("2027-08-21"),
      rc: d("2031-01-09"),
      tax: d("2026-12-30"),
    },
  },
  {
    plate: "TN 00 CD 3307",
    kind: "Lorry · Ashok Leyland 3718",
    docs: {
      fitness: d("2026-10-20"),
      insurance: d("2027-09-21"),
      puc: d("2026-10-02"),
      permit: d("2027-08-16"),
      rc: d("2030-06-04"),
      tax: d("2026-12-01"),
    },
  },
  {
    plate: "TN 00 EF 5520",
    kind: "Lorry · Eicher Pro 6049",
    docs: {
      fitness: d("2028-02-23"),
      insurance: d("2027-03-30"),
      puc: d("2027-04-22"),
      permit: d("2026-11-20"),
      rc: d("2026-11-05"),
      tax: d("2026-12-31"),
    },
  },
  {
    plate: "TN 00 GH 7714",
    kind: "Lorry · BharatBenz 3523R",
    docs: {
      fitness: d("2028-02-23"),
      insurance: d("2026-10-11"),
      puc: d("2027-01-02"),
      permit: d("2028-08-16"),
      rc: d("2030-10-24"),
      tax: d("2026-10-12", true),
    },
  },
  {
    plate: "TN 00 JK 9021",
    kind: "Bus · Ashok Leyland Viking",
    docs: {
      fitness: d("2026-10-28"),
      insurance: d("2027-09-21"),
      puc: d("2027-07-01"),
      permit: d("2028-08-16"),
      rc: d("2026-11-06", true),
      tax: d("2027-04-01"),
    },
  },
  {
    plate: "TN 00 LM 4410",
    kind: "Bus · Tata Starbus",
    docs: {
      fitness: d("2028-02-02"),
      insurance: d("2026-12-07"),
      puc: d("2027-01-02"),
      permit: d("2031-02-02"),
      rc: d("2031-02-02"),
      tax: d("2026-06-30"),
    },
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const parts = (iso: string) => iso.split("-").map(Number) as [number, number, number];
const pad = (value: number) => String(value).padStart(2, "0");

export function isoToday(date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function dayDifference(later: string, earlier: string): number {
  const [ly, lm, ld] = parts(later);
  const [ey, em, ed] = parts(earlier);
  return Math.round((Date.UTC(ly, lm - 1, ld) - Date.UTC(ey, em - 1, ed)) / 86400000);
}

export function shiftDate(iso: string, days: number): string {
  const [y, m, day] = parts(iso);
  const date = new Date(Date.UTC(y, m - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function createFleetSnapshot(today = isoToday()): { today: string; vehicles: Vehicle[] } {
  const offset = dayDifference(today, REFERENCE_DATE);
  return {
    today,
    vehicles: BASE_VEHICLES.map((vehicle) => ({
      ...vehicle,
      docs: Object.fromEntries(
        DOC_ORDER.map((id) => [id, { ...vehicle.docs[id], expiry: shiftDate(vehicle.docs[id].expiry, offset) }])
      ) as Record<DocId, DocEntry>,
    })),
  };
}

const DEFAULT_SNAPSHOT = createFleetSnapshot();
export const TODAY = DEFAULT_SNAPSHOT.today;
export const VEHICLES = DEFAULT_SNAPSHOT.vehicles;

export function fmtDate(iso: string): string {
  const [y, m, day] = parts(iso);
  return `${day} ${MONTHS[m - 1]} ${y}`;
}

export function demoDate(offset = 0, today = TODAY): string {
  return shiftDate(today, offset);
}

export function fmtShort(iso: string): string {
  const [y, m, day] = parts(iso);
  return `${day} ${MONTHS[m - 1]} '${String(y).slice(2)}`;
}

export function daysFrom(iso: string, today = TODAY): number {
  const [y, m, day] = parts(iso);
  const [ty, tm, td] = parts(today);
  return Math.round((Date.UTC(y, m - 1, day) - Date.UTC(ty, tm - 1, td)) / 86400000);
}

export function statusOf(type: DocId, e: DocEntry, today = TODAY): Status {
  if (e.pending) return "pending";
  const days = daysFrom(e.expiry, today);
  if (days < 0) return "expired";
  if (days <= DOC_META[type].lead) return "expiring";
  return "valid";
}

export function describe(type: DocId, e: DocEntry, today = TODAY): { headline: string; detail: string; status: Status } {
  const status = statusOf(type, e, today);
  const name = DOC_META[type].short;
  const days = daysFrom(e.expiry, today);
  const lead = DOC_META[type].lead;
  switch (status) {
    case "valid":
      return {
        status,
        headline: `${name}: valid till ${fmtDate(e.expiry)}`,
        detail: `${days} days left · reminder starts ${lead} days before expiry`,
      };
    case "expiring":
      return {
        status,
        headline: `${name}: expires ${fmtDate(e.expiry)}`,
        detail: `${days === 0 ? "Due today" : `${days} day${days === 1 ? "" : "s"} left`} · inside the ${lead}-day lead time`,
      };
    case "pending":
      return {
        status,
        headline: `${name}: pending proof`,
        detail: `Renewal for ${fmtDate(e.expiry)} is recorded. Upload the new certificate to clear it.`,
      };
    default:
      return {
        status,
        headline: `${name}: expired ${fmtDate(e.expiry)}`,
        detail: `${-days} day${-days === 1 ? "" : "s"} ago · renew it before this vehicle is dispatched`,
      };
  }
}

export function dueLabel(days: number): string {
  if (days < 0) return `Expired ${-days} day${-days === 1 ? "" : "s"} ago`;
  if (days === 0) return "Due today";
  return `Due in ${days} day${days === 1 ? "" : "s"}`;
}

export function attentionList(limit = 3, vehicles = VEHICLES, today = TODAY) {
  const out: { plate: string; doc: DocId; days: number; status: Status }[] = [];
  vehicles.forEach((v) =>
    DOC_ORDER.forEach((id) => {
      const st = statusOf(id, v.docs[id], today);
      if (st === "expired" || st === "expiring" || st === "pending") {
        out.push({ plate: v.plate, doc: id, days: daysFrom(v.docs[id].expiry, today), status: st });
      }
    })
  );
  return out.sort((a, b) => a.days - b.days).slice(0, limit);
}

export function complianceSummary(vehicles = VEHICLES, today = TODAY) {
  const total = vehicles.length;
  const clear = vehicles.filter((v) =>
    DOC_ORDER.every((id) => {
      const status = statusOf(id, v.docs[id], today);
      return status !== "expired" && status !== "pending";
    })
  ).length;
  return { total, clear, pct: Math.round((clear / total) * 100) };
}
