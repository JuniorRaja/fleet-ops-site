import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";
import { hasWebGL } from "@/lib/webgl";

const SHEET = {
  ref: "TS-261102-042",
  plate: "TN 48 AK 2746",
  rows: [
    [
      ["Trip date", "02 Nov 2026"],
      ["Driver", "K. Ravi"],
      ["Start km", "84,210"],
    ],
    [
      ["From", "Chennai"],
      ["To", "Bengaluru"],
      ["End km", "84,552"],
    ],
    [
      ["Diesel", "168 L"],
      ["Toll", "₹1,460"],
      ["Driver advance", "₹3,500"],
    ],
    [
      ["Distance", "342 km"],
      ["Trip time", "10 h 35 m"],
      ["Load", "General"],
    ],
  ],
} as const;

/** Shown when the 3D scene cannot run: the same trip sheet, flat. */
function SheetFallback() {
  return (
    <div className="absolute inset-0 overflow-auto p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4 border-b border-white/15 pb-4">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/45">
          Trip sheet / {SHEET.ref}
        </p>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/45">Saved 18:42</p>
      </div>
      <p className="display mt-5 text-[clamp(1.6rem,3.4vw,2.4rem)] leading-none">{SHEET.plate}</p>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        {SHEET.rows.flat().map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/45">{label}</dt>
            <dd className="mt-1 text-lg font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-7 rounded-2xl border border-lime/25 bg-white/[0.06] p-5">
        <p className="eyebrow text-lime">Trip closed</p>
        <p className="mt-2 text-sm leading-relaxed text-paper/75">
          Trip, fuel log and driver account updated together. Signed by the driver.
        </p>
      </div>
      <p className="mt-5 text-sm text-paper/55">
        The turning 3D sheet needs WebGL, which this browser could not start.{" "}
        <a href="/demo.html#demo-save" className="font-semibold text-lime underline underline-offset-4">
          Try the one-save demo instead
        </a>
        .
      </p>
    </div>
  );
}

export function TripSheetPaper() {
  const host = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const [scene, setScene] = useState<"idle" | "ok" | "fail">("idle");
  const [frameLoaded, setFrameLoaded] = useState(false);
  const seen = useRef(false);
  const touched = useRef(false);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setNearby(entry.isIntersecting);
        if (entry.isIntersecting && !seen.current) {
          seen.current = true;
          track("trip_sheet_view");
        }
      },
      { rootMargin: "25% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // No WebGL at all: never mount the iframe, go straight to the flat sheet.
  useEffect(() => {
    if (!hasWebGL()) setScene("fail");
  }, []);

  // The scene reports back once it has rendered a frame, or when it cannot.
  useEffect(() => {
    if (scene !== "idle") return;
    const onMessage = (event: MessageEvent) => {
      const frame = host.current?.querySelector("iframe");
      if (!frame || event.source !== frame.contentWindow) return;
      const data = event.data as { type?: string; ok?: boolean } | null;
      if (data?.type !== "trip-sheet") return;
      setScene(data.ok ? "ok" : "fail");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [scene]);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // The scene lives in a sandboxed iframe, so its drags never reach this document.
  // Focus moving into that iframe is the one signal the parent page can see.
  useEffect(() => {
    const check = () => {
      const active = document.activeElement;
      if (touched.current || !active || active.tagName !== "IFRAME") return;
      if (!host.current?.contains(active)) return;
      touched.current = true;
      track("trip_sheet_interact");
    };
    const onBlur = () => window.setTimeout(check, 0);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  const showFrame = scene !== "fail" && nearby && visible;

  // Silence counts as a failure, so the panel is never left blank: a short grace
  // period once the frame's document is up, a long one while it is still coming.
  // A blocked or dead frame fires neither load nor error, so only the clock catches it.
  useEffect(() => {
    if (scene !== "idle" || !showFrame) return;
    const timer = window.setTimeout(
      () => setScene((s) => (s === "idle" ? "fail" : s)),
      frameLoaded ? 10000 : 15000
    );
    return () => window.clearTimeout(timer);
  }, [scene, showFrame, frameLoaded]);

  return (
    <section id="trip-sheet" aria-labelledby="trip-sheet-title" className="on-dark overflow-hidden bg-ink py-24 text-paper sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <Reveal>
            <p className="eyebrow text-lime">One trip sheet</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 id="trip-sheet-title" className="display mt-4 text-[clamp(2.7rem,6vw,5.8rem)]">
              Turn paper into one clean record.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/70">
              {scene === "fail"
                ? "One save updates trips, fuel, and driver accounts."
                : "Drag the sheet. One save updates trips, fuel, and driver accounts."}
            </p>
          </Reveal>
        </div>

        <div ref={host} className="relative aspect-[4/5] min-h-[480px] overflow-hidden rounded-[32px] border border-white/12 bg-[#08080a] shadow-2xl">
          {scene === "fail" ? (
            <SheetFallback />
          ) : showFrame ? (
            <iframe
              title="Interactive Fleet OPS trip sheet"
              src="/effects/3d-paper.html?v=4"
              sandbox="allow-scripts"
              loading="lazy"
              onLoad={() => setFrameLoaded(true)}
              onError={() => setScene("fail")}
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-paper/45">Interactive trip sheet</div>
          )}
        </div>
      </div>
    </section>
  );
}
