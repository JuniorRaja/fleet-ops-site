import { motion } from "framer-motion";
import { Magnetic } from "./Cursor";
import { useMotionPref } from "../lib/motion";
import { WHATSAPP_LINK } from "../lib/constants";

const PAPERS = [
  { label: "Fitness", color: "valid", x: "6%", y: "14%", r: -9, d: "7s", z: 1 },
  { label: "Insurance", color: "valid", x: "78%", y: "10%", r: 8, d: "8.5s", z: 2 },
  { label: "PUC", color: "soon", x: "2%", y: "58%", r: -6, d: "6.5s", z: 1 },
  { label: "Permit", color: "valid", x: "84%", y: "52%", r: 10, d: "9s", z: 2 },
  { label: "RC", color: "soon", x: "14%", y: "84%", r: 5, d: "7.8s", z: 1 },
  { label: "Road tax", color: "expired", x: "72%", y: "82%", r: -7, d: "8s", z: 2 },
];

const colorMap: Record<string, string> = {
  valid: "text-brand-600 bg-brand-50 ring-brand-200",
  soon: "text-[#b54708] bg-amber-50 ring-amber-200",
  expired: "text-[#b42318] bg-red-50 ring-red-200",
};
const dotMap: Record<string, string> = {
  valid: "bg-valid",
  soon: "bg-soon",
  expired: "bg-expired",
};

export function Hero() {
  const { motionOn } = useMotionPref();

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-4 pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-44"
    >
      {/* ambient background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/70 via-paper to-paper" />
        <div className="animate-drift absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-brand-300/30 blur-[120px]" />
        <div
          className="animate-drift absolute -right-32 top-40 h-[30rem] w-[30rem] rounded-full bg-emerald-200/40 blur-[120px]"
          style={{ animationDelay: "-8s" }}
        />
        <div className="grain absolute inset-0 opacity-[0.5] mix-blend-soft-light" />
        {/* grid lines */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(5,96,58,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(5,96,58,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left copy */}
        <div className="relative z-10">
          <motion.div
            initial={motionOn ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            Compliance &amp; maintenance — not tracking
          </motion.div>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            <Line delay={0.05}>Never miss</Line>
            <Line delay={0.12}>
              a <span className="text-brand-600">renewal</span>
            </Line>
            <Line delay={0.19}>again.</Line>
          </h1>

          <motion.p
            initial={motionOn ? { opacity: 0, y: 12 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-ink/65"
          >
            Fleet OPS keeps every lorry, trailer and bus road-legal. Six papers
            per vehicle plus driver licences, tracked to expiry — so nothing
            leaves the yard on expired documents.
          </motion.p>

          <motion.div
            initial={motionOn ? { opacity: 0, y: 12 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-brand-600/25 transition hover:bg-brand-700"
              >
                Book a demo
                <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none">
                  <path d="M3 8h9m0 0L8 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Magnetic>
            <a
              href="#demos"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/70 px-6 py-3.5 text-base font-semibold text-ink ring-1 ring-ink/10 backdrop-blur transition hover:bg-white"
            >
              Try the live demo
            </a>
          </motion.div>

          <motion.dl
            initial={motionOn ? { opacity: 0 } : false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-6"
          >
            {[
              ["6+1", "papers tracked per vehicle"],
              ["0", "trips on expired papers"],
              ["1 tap", "can this vehicle go?"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-bold text-ink">{n}</dt>
                <dd className="mt-1 text-xs leading-snug text-ink/55">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Right visual — floating papers + board */}
        <div className="relative">
          <HeroBoard />
          {/* Floating paper cutouts */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -m-6 hidden sm:block"
            style={{ perspective: "1200px" }}
          >
            {PAPERS.map((p, i) => (
              <motion.div
                key={p.label}
                className="absolute"
                style={{ left: p.x, top: p.y }}
                initial={motionOn ? { opacity: 0, y: 40, rotateX: 40 } : false}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className={`animate-floaty`}
                  style={{ ["--r" as string]: `${p.r}deg`, ["--d" as string]: p.d }}
                >
                  <div
                    className="flex w-[120px] items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-3 py-2.5 shadow-xl shadow-ink/10 backdrop-blur"
                    style={{ transform: `translateZ(${p.z * 30}px)` }}
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${dotMap[p.color]}`} />
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-ink">{p.label}</p>
                      <p className={`mt-0.5 inline-block rounded px-1 text-[9px] font-medium ring-1 ${colorMap[p.color]}`}>
                        {p.color === "valid" ? "Valid" : p.color === "soon" ? "Soon" : "Expired"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  const { motionOn } = useMotionPref();
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={motionOn ? { y: "110%" } : false}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function HeroBoard() {
  const rows = [
    { v: "TN 00 AB 1201", s: ["valid", "valid", "valid", "valid", "valid", "valid"] },
    { v: "TN 00 CD 3307", s: ["valid", "valid", "soon", "valid", "valid", "valid"] },
    { v: "TN 00 EF 5520", s: ["valid", "valid", "valid", "valid", "soon", "valid"] },
    { v: "TN 00 GH 7714", s: ["valid", "valid", "valid", "valid", "valid", "expired"] },
  ];
  const cols = ["Fitness", "Insurance", "PUC", "Permit", "RC", "Road tax"];
  const { motionOn } = useMotionPref();

  return (
    <motion.div
      initial={motionOn ? { opacity: 0, y: 30, scale: 0.97 } : false}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto max-w-md rounded-3xl border border-white/70 bg-white/80 p-4 shadow-2xl shadow-ink/10 backdrop-blur-xl sm:p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-base font-semibold text-ink">Compliance matrix</p>
          <p className="text-xs text-ink/50">6 documents per vehicle, tracked to expiry</p>
        </div>
        <span className="rounded-lg bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          80% clear
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-ink/5">
        <div className="grid grid-cols-[1.4fr_repeat(6,1fr)] gap-px bg-ink/5 text-[9px]">
          <div className="bg-paper px-2 py-2 font-semibold text-ink/60">Vehicle</div>
          {cols.map((c) => (
            <div key={c} className="bg-paper px-1 py-2 text-center font-semibold text-ink/55">
              {c.split(" ")[0]}
            </div>
          ))}
          {rows.map((r) => (
            <Row key={r.v} r={r} />
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 ring-1 ring-red-100">
        <span className="rounded-md bg-expired px-1.5 py-0.5 text-[9px] font-bold text-white">
          Document hold
        </span>
        <p className="text-[11px] text-[#912018]">
          On hold for papers. Goes out only with a written reason.
        </p>
      </div>
    </motion.div>
  );
}

function Row({ r }: { r: { v: string; s: string[] } }) {
  return (
    <>
      <div className="flex flex-col justify-center bg-white px-2 py-2.5">
        <span className="text-[10px] font-semibold text-ink">{r.v}</span>
        <span className="text-[8px] text-ink/40">Bus · Ashok Leyland</span>
      </div>
      {r.s.map((st, i) => (
        <div key={i} className="flex items-center justify-center bg-white py-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${dotMap[st]}`} />
        </div>
      ))}
    </>
  );
}
