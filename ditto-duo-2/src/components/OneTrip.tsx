import {useEffect, useRef, useState} from 'react';
import {slip, trip} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {clamp, easeOutCubic, lerp, pinProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';

/**
 * One trip entry, everything follows. The section pins and spends WINDOW of
 * its scroll on five beats, one after another:
 *
 *   1 The slip          a handwritten trip slip slides in
 *   2 The pile          more slips drop behind it; the month's count ticks up
 *   3 Entered once      the slip's fields light up one by one and fill the
 *                       on-screen trip sheet; container fields appear
 *   4 Save              the button is pressed once
 *   5 Everything follows six records light up, each on a line drawn from
 *                       the save button
 *
 * The sheet and the six records are ghosted from the start, so the stage is
 * never half empty. Connector lines are measured from the layout, so they
 * fit both the side-by-side desktop stage and the stacked phone stage.
 */

const SECTION_VH = 420;
const WINDOW = [0.04, 0.94] as const;
const BEATS = trip.beats.length;
const PILE = [
  {r: -9, x: -10, y: 8},
  {r: 7, x: 12, y: 4},
  {r: -3, x: -4, y: -6},
  {r: 12, x: 16, y: 12},
  {r: -14, x: -16, y: -2},
  {r: 4, x: 6, y: 14},
];

export function OneTrip() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const slipRef = useRef<HTMLDivElement>(null);
  const pileRefs = useRef<HTMLDivElement[]>([]);
  const slipFieldRefs = useRef<HTMLDivElement[]>([]);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetFieldRefs = useRef<HTMLSpanElement[]>([]);
  const typeRef = useRef<HTMLSpanElement>(null);
  const saveRef = useRef<HTMLSpanElement>(null);
  const outWrapRefs = useRef<HTMLLIElement[]>([]);
  const outRefs = useRef<HTMLDivElement[]>([]);
  const lineRefs = useRef<SVGPathElement[]>([]);
  const slipsRef = useRef<HTMLSpanElement>(null);
  const recordsRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    let lastP = -1;
    let current = -1;
    let lastBox = '';
    return onFrame(() => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage) return;
      const pin = pinProgress(root);
      if (pin.rect.bottom < 0 || pin.rect.top > pin.vh) return;
      const p = reducedRef.current ? 1 : pin.p;
      const sr = stage.getBoundingClientRect();
      const box = `${Math.round(sr.width)}x${Math.round(sr.height)}`;
      if (Math.abs(p - lastP) < 0.00005 && box === lastBox) return;
      lastP = p;

      const wide = window.innerWidth >= 1024;
      const u = range(p, ...WINDOW) * BEATS;
      const b = clamp(Math.floor(u), 0, BEATS - 1);
      if (b !== current) {
        current = b;
        setBeat(b);
      }
      barRef.current!.style.transform = `scaleX(${range(p, ...WINDOW)})`;

      // 1 · The slip slides in.
      const k1 = easeOutCubic(clamp(u));
      // 3 · On phones the paper steps aside for the sheet.
      const handoff = wide ? 0 : easeOutCubic(range(u, 2, 2.35));
      // The slip (and its pile) always fits its zone, however short the screen.
      const paper = paperRef.current!;
      const zone = paper.parentElement!.getBoundingClientRect().height;
      const fit = Math.min(1, (zone * 0.9) / Math.max(1, paper.offsetHeight + 24));
      paper.style.transform = `translate3d(${-handoff * 18}%, ${(1 - k1) * 60 - handoff * 14}%, 0) scale(${fit * (1 - handoff * 0.45)})`;
      paper.style.opacity = String(clamp(k1 * 2) * (1 - handoff * 0.75));
      slipRef.current!.style.transform = `rotate(${lerp(-10, -2, k1)}deg)`;

      // 2 · The pile drops in behind it; the month's count ticks up.
      pileRefs.current.forEach((el, j) => {
        const k = easeOutCubic(range(u, 1 + j * 0.11, 1.32 + j * 0.11));
        const pp = PILE[j];
        el.style.transform = `translate3d(${pp.x}px, ${lerp(-pin.vh * 0.4, pp.y, k)}px, 0) rotate(${pp.r}deg)`;
        el.style.opacity = String(clamp(k * 3));
      });
      slipsRef.current!.textContent = String(Math.round(easeOutCubic(range(u, 1, 2)) * trip.slipsThisMonth));

      // 3 · Fields move from the slip to the sheet, one by one.
      const sheetIn = wide ? 0.45 + 0.55 * range(u, 1.8, 2.1) : easeOutCubic(range(u, 2.05, 2.4));
      sheetRef.current!.style.opacity = String(sheetIn);
      sheetRef.current!.style.transform = wide ? '' : `translate3d(0, ${(1 - sheetIn) * 30}px, 0)`;
      typeRef.current!.dataset.on = String(u >= 2.05);
      slip.forEach((_, f) => {
        const k = range(u, 2.05 + f * 0.065, 2.3 + f * 0.065);
        const on = k > 0 && k < 1;
        slipFieldRefs.current[f].dataset.state = on ? 'on' : k >= 1 ? 'done' : 'idle';
        const v = sheetFieldRefs.current[f];
        v.style.opacity = String(0.0 + k);
        v.style.transform = `translate3d(${(1 - easeOutCubic(k)) * -12}px, 0, 0)`;
      });

      // 4 · Save, once.
      const k4 = range(u, 3, 3.7);
      const save = saveRef.current!;
      save.style.transform = `scale(${1 - 0.06 * Math.sin(Math.PI * clamp(k4 * 2))})`;
      save.dataset.state = k4 >= 0.5 ? 'saved' : k4 > 0 ? 'press' : 'idle';

      // 5 · Lines draw; records light up in order.
      const svg = svgRef.current!;
      if (box !== lastBox) {
        lastBox = box;
        svg.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
        const s = save.getBoundingClientRect();
        const sx = wide ? s.right - sr.left : s.left + s.width / 2 - sr.left;
        const sy = wide ? s.top + s.height / 2 - sr.top : s.bottom - sr.top;
        outWrapRefs.current.forEach((w, j) => {
          const r = w.getBoundingClientRect();
          const ex = wide ? r.left - sr.left : r.left + r.width / 2 - sr.left;
          const ey = wide ? r.top + r.height / 2 - sr.top : r.top - sr.top;
          const d = wide
            ? `M${sx} ${sy} C ${sx + (ex - sx) * 0.55} ${sy}, ${sx + (ex - sx) * 0.45} ${ey}, ${ex} ${ey}`
            : `M${sx} ${sy} C ${sx} ${sy + (ey - sy) * 0.6}, ${ex} ${sy + (ey - sy) * 0.4}, ${ex} ${ey}`;
          lineRefs.current[j].setAttribute('d', d);
        });
      }
      let records = 0;
      outRefs.current.forEach((card, j) => {
        const k = easeOutCubic(range(u, 4 + j * 0.1, 4.35 + j * 0.1));
        lineRefs.current[j].style.strokeDashoffset = String(1 - k);
        card.dataset.on = String(k > 0.98);
        card.style.opacity = String(0.4 + 0.6 * k);
        card.style.transform = `translate3d(${(1 - k) * (wide ? 10 : 0)}px, ${(1 - k) * (wide ? 0 : 8)}px, 0)`;
        if (k > 0.9) records++;
      });
      recordsRef.current!.textContent = `${records}/${trip.outputs.length}`;
    });
  }, []);

  const now = trip.beats[beat];

  return (
    <section ref={rootRef} id="trips" data-pin={reduced ? undefined : ''} aria-labelledby="trips-title" className="relative bg-ink text-cream" style={{height: reduced ? 'auto' : `${SECTION_VH}svh`}}>
      <div className={`${reduced ? 'relative py-24' : 'sticky top-0 h-screen-s overflow-hidden'} flex flex-col px-4 pt-20 pb-5 sm:px-6 lg:px-[4vw] lg:pt-24 lg:pb-8`}>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-label text-yolk uppercase">{trip.eyebrow}</p>
            <h2 id="trips-title" className="mt-3 max-w-[18ch] font-display text-[clamp(1.75rem,3.6vw,3.5rem)] leading-[0.96] tracking-[-0.025em] wide">
              {trip.heading}
            </h2>
          </div>
          <div className="flex gap-6 font-mono text-label text-cream/55 uppercase max-lg:hidden" aria-hidden="true">
            <span>
              Slips this month <span ref={slipsRef} className="text-cream tabular-nums">0</span>
            </span>
            <span>
              Records updated <span ref={recordsRef} className="text-yolk tabular-nums">0/6</span>
            </span>
          </div>
        </div>

        {/* The stage. */}
        <div ref={stageRef} className={`relative mt-4 grid min-h-0 flex-1 gap-3 lg:mt-6 lg:grid-cols-[0.9fr_1fr_0.9fr] lg:items-center lg:gap-[3vw] ${reduced ? '' : 'max-lg:grid-rows-[1fr_auto]'}`}>
          <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
            {trip.outputs.map((o, j) => (
              <path
                key={o.name}
                ref={(el) => {
                  if (el) lineRefs.current[j] = el;
                }}
                pathLength={1}
                fill="none"
                stroke="var(--color-yolk)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="1 1"
                strokeDashoffset="1"
              />
            ))}
          </svg>

          {/* Paper: the pile and the slip on top. */}
          <div className="relative min-h-0 max-lg:col-start-1 max-lg:row-start-1 max-lg:flex max-lg:items-center max-lg:justify-center">
            <div ref={paperRef} className="relative mx-auto w-[min(17rem,72vw)] will-change-transform lg:w-full lg:max-w-[19rem]" style={{opacity: 0}}>
              {PILE.map((_, j) => (
                <div
                  key={j}
                  ref={(el) => {
                    if (el) pileRefs.current[j] = el;
                  }}
                  aria-hidden="true"
                  className="ruled absolute inset-0 rounded-[3px] shadow-[0_10px_24px_rgb(0_0_0/0.35)]"
                  style={{opacity: 0}}
                />
              ))}
              <div ref={slipRef} className="ruled relative rounded-[3px] px-4 pt-3 pb-4 pl-[2.6rem] text-ink shadow-[0_18px_40px_rgb(0_0_0/0.45)]">
                <p className="font-mono text-[0.5625rem] tracking-[0.12em] text-ink/55 uppercase">Trip slip · No. 0412</p>
                <div className="mt-1 space-y-0">
                  {slip.map((f, i) => (
                    <div
                      key={f.label}
                      ref={(el) => {
                        if (el) slipFieldRefs.current[i] = el;
                      }}
                      data-state="idle"
                      className="flex h-[1.6rem] items-baseline justify-between gap-2 rounded-[2px] transition-[background-color,opacity] duration-200 data-[state=done]:opacity-40 data-[state=on]:bg-yolk/60"
                    >
                      <span className="font-mono text-[0.5625rem] tracking-[0.08em] text-ink/50 uppercase">{f.label}</span>
                      <span className="font-hand text-[1.1875rem] leading-none font-bold text-[#26408b]">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* The trip sheet. */}
          <div ref={sheetRef} className="relative min-h-0 max-lg:col-start-1 max-lg:row-start-1 max-lg:self-center" style={{opacity: 0.45}}>
            <div className="mx-auto max-w-[24rem] rounded-[20px] bg-ink-2 p-3 ring-1 ring-cream/10 lg:p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-label text-cream/55 uppercase">Trip sheet · New trip</p>
                <span className="rounded-full bg-cream/10 px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.1em] text-cream/60 uppercase">Example data</span>
              </div>
              <div className="mt-3 flex gap-1 rounded-full bg-cream/5 p-1 font-mono text-[0.625rem] tracking-[0.08em] uppercase" aria-hidden="true">
                <span className="flex-1 rounded-full py-1 text-center text-cream/45">General</span>
                <span ref={typeRef} data-on="false" className="flex-1 rounded-full py-1 text-center text-cream/45 transition-colors data-[on=true]:bg-yolk data-[on=true]:text-ink">
                  Container
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-x-3 gap-y-1 text-[0.8125rem]">
                {slip.map((f, i) => (
                  <div key={f.label} className={`border-b border-cream/8 pb-1 ${i === slip.length - 1 ? 'col-span-3' : ''}`}>
                    <dt className="font-mono text-[0.5625rem] tracking-[0.1em] text-cream/40 uppercase">{f.label}</dt>
                    <dd className="mt-0.5 min-h-[1.2em]">
                      <span
                        ref={(el) => {
                          if (el) sheetFieldRefs.current[i] = el;
                        }}
                        className="inline-block font-mono text-[0.6875rem] text-cream lg:text-[0.75rem]"
                        style={{opacity: 0}}
                      >
                        {f.value}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
              <span
                ref={saveRef}
                data-state="idle"
                className="group mt-3 flex min-h-10 lg:mt-4 lg:min-h-11 items-center justify-center rounded-full bg-cream font-mono text-label text-ink uppercase ring-yolk/40 transition-[box-shadow,background-color] duration-300 data-[state=press]:ring-8 data-[state=saved]:bg-yolk"
              >
                <span className="group-data-[state=saved]:hidden">Save and close</span>
                <span className="hidden group-data-[state=saved]:inline">Saved ✓</span>
              </span>
            </div>
          </div>

          {/* What follows. */}
          <ol className="relative grid grid-cols-3 gap-2 max-lg:row-start-2 lg:grid-cols-1 lg:gap-2" aria-label="Records updated by one trip">
            {trip.outputs.map((o, j) => (
              <li
                key={o.name}
                ref={(el) => {
                  if (el) outWrapRefs.current[j] = el;
                }}
              >
                <div
                  ref={(el) => {
                    if (el) outRefs.current[j] = el;
                  }}
                  data-on="false"
                  className="rounded-[14px] bg-ink-2 p-2.5 ring-1 ring-cream/10 transition-[box-shadow] duration-300 data-[on=true]:ring-yolk/70 lg:grid lg:grid-cols-[7.5rem_1fr] lg:items-baseline lg:gap-x-3 lg:px-4 lg:py-2.5"
                  style={{opacity: 0.4}}
                >
                  <p className="font-mono text-[0.5625rem] tracking-[0.1em] text-cream/50 uppercase lg:text-label">{o.name}</p>
                  <p className="mt-1 text-[0.75rem] leading-snug font-semibold lg:mt-0 lg:text-[0.9375rem]">{o.value}</p>
                  <p className="text-[0.6875rem] text-cream/50 max-lg:hidden lg:col-start-2">{o.sub}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Reduced motion: the five beats as a plain list, under the final stage. */}
        {reduced && (
          <ol className="mt-10 grid gap-5 border-t border-cream/10 pt-6 lg:grid-cols-5">
            {trip.beats.map((bt, i) => (
              <li key={bt.title}>
                <p className="font-mono text-label text-yolk uppercase">
                  0{i + 1} · {bt.title}
                </p>
                <p className="mt-2 font-semibold">{bt.line}</p>
                <p className="mt-1 text-[0.875rem] text-cream/65">{bt.body}</p>
              </li>
            ))}
          </ol>
        )}

        {/* Current beat. */}
        <div hidden={reduced} className="mt-4 grid gap-2 border-t border-cream/10 pt-4 lg:mt-6 lg:grid-cols-[auto_1fr_auto] lg:items-end lg:gap-10 lg:pt-5">
          <p className="font-mono text-label text-yolk uppercase">
            0{beat + 1} / 0{BEATS} · {now.title}
          </p>
          <div key={beat} className="animate-[beat-in_0.6s_var(--ease-out)]" aria-live="polite">
            <h3 className="font-display text-[1.125rem] wide lg:text-[1.5rem]">{now.line}</h3>
            <p className="mt-1 max-w-[46rem] text-body text-cream/65 max-lg:hidden [@media(max-height:820px)]:hidden">{now.body}</p>
          </div>
          <span className="relative h-1 w-full rounded-full bg-cream/15 lg:w-40" aria-hidden="true">
            <span ref={barRef} className="absolute inset-0 origin-left rounded-full bg-yolk" style={{transform: 'scaleX(0)'}} />
          </span>
        </div>
      </div>
    </section>
  );
}
