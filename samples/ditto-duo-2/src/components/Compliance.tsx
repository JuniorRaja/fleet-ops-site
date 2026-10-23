import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {compliance, fleet, papers, statusText, type Status} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {clamp, easeInOutCubic, easeOutCubic, lerp, pinProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';

/**
 * Compliance. The section pins while six loose papers lift off the panel,
 * straighten, shrink and fly into their column headers; then the rows fill
 * and the dots colour in; then the reminder email arrives on the left.
 *
 *   0.04 – 0.55  papers fly, one after another, into their columns
 *   0.55 – 0.86  rows fill top to bottom
 *   0.82 – 0.95  reminder card slides in
 *
 * Neither half is ever empty: before the scroll the right holds the papers
 * over a ghosted matrix, after it the left holds the reminder card.
 * The filters and dots stay clickable after the pin.
 */

const SECTION_VH = 300;

/** Where each paper lies at rest, as a fraction of the panel, plus its tilt in degrees. */
const HOME: [number, number, number][] = [
  [0.22, 0.42, -8],
  [0.48, 0.36, 5],
  [0.76, 0.42, -4],
  [0.28, 0.74, 6],
  [0.54, 0.7, -6],
  [0.8, 0.76, 9],
];

const DOT: Record<Status, string> = {v: 'var(--color-ok)', d: 'var(--color-due)', x: 'var(--color-bad)', p: 'var(--color-due)'};

const fmt = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'});

const dueSoon = fleet.flatMap((v) => v.cells.map(([s, date], c) => ({plate: v.plate, paper: papers[c].name, s, date}))).filter((x) => x.s === 'd');

type Filter = (typeof compliance.filters)[number]['key'];

function Dot({status, dim, style}: {status: Status; dim?: boolean; style?: CSSProperties}) {
  return (
    <span
      aria-hidden="true"
      className={`block size-3.5 transition-opacity duration-300 lg:size-4 ${status === 'p' ? 'rounded-[4px]' : 'rounded-full'} ${dim ? 'opacity-20' : ''}`}
      style={{
        background: `color-mix(in oklch, ${DOT[status]} calc(var(--k, 1) * 100%), var(--color-idle))`,
        transform: 'scale(calc(0.55 + 0.45 * var(--k, 1)))',
        ...style,
      }}
    />
  );
}

/** One loose paper. Uses the photographed paper if present, else a drawn one. */
function PaperSheet({i}: {i: number}) {
  const p = papers[i];
  return (
    <div className="ruled relative size-full overflow-hidden rounded-[3px] shadow-[0_var(--lift,6px)_calc(var(--lift,6px)*3)_rgb(21_21_21/0.18)]">
      <div className="absolute inset-0 p-[9%] pl-[24%]">
        <p className="font-mono text-[0.5rem] tracking-[0.1em] text-ink/60 uppercase lg:text-[0.5625rem]">{p.name}</p>
        <p className="mt-1 font-hand text-[0.875rem] leading-none text-[#26408b] lg:text-[1.0625rem]">valid till ____</p>
        <span className="absolute right-[10%] bottom-[10%] size-[30%] rounded-full border-2 border-[#26408b]/35" />
      </div>
      <img src={p.image} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
    </div>
  );
}

export function Compliance() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const paperRefs = useRef<HTMLDivElement[]>([]);
  const headRefs = useRef<HTMLTableCellElement[]>([]);
  const labelRefs = useRef<HTMLSpanElement[]>([]);
  const rowRefs = useRef<HTMLTableRowElement[]>([]);
  const stepRefs = useRef<HTMLLIElement[]>([]);
  const stepNowRef = useRef<HTMLParagraphElement>(null);
  const mailRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const [filter, setFilter] = useState<Filter>('all');
  const [picked, setPicked] = useState<{r: number; c: number} | null>(null);

  useEffect(() => {
    let lastP = -1;
    let lastW = 0;
    return onFrame(() => {
      const root = rootRef.current;
      const stage = stageRef.current;
      const panel = panelRef.current;
      if (!root || !stage || !panel) return;
      const pin = pinProgress(root);
      if (pin.rect.bottom < 0 || pin.rect.top > pin.vh) return;
      const p = reducedRef.current ? 1 : pin.p;
      const sr = stage.getBoundingClientRect();
      const pr = panel.getBoundingClientRect();
      if (Math.abs(p - lastP) < 0.00005 && sr.width === lastW) return;
      lastP = p;
      lastW = sr.width;

      // Papers: size from the panel, rest on it, then fly to their headers.
      const pw = clamp(pr.width * 0.21, 64, 150);
      paperRefs.current.forEach((el, i) => {
        const head = headRefs.current[i].getBoundingClientRect();
        const [hx, hy, tilt] = HOME[i];
        const t0 = 0.04 + i * 0.06;
        const k = easeInOutCubic(range(p, t0, t0 + 0.2));
        const homeX = pr.left - sr.left + pr.width * hx;
        const homeY = pr.top - sr.top + pr.height * hy;
        const toX = head.left - sr.left + head.width / 2;
        const toY = head.top - sr.top + head.height / 2;
        const lift = Math.sin(Math.PI * clamp(k * 1.4)) * 0.1;
        const scale = lerp(1, (head.width * 0.7) / pw, k) * (1 + lift);
        el.style.width = `${pw}px`;
        el.style.transform = `translate3d(${lerp(homeX, toX, k) - pw / 2}px, ${lerp(homeY, toY, k) - pw * 0.65}px, 0) rotate(${lerp(tilt, 0, k)}deg) scale(${scale})`;
        el.style.opacity = String(1 - range(k, 0.75, 1));
        el.style.setProperty('--lift', `${6 + lift * 160}px`);
        labelRefs.current[i].style.opacity = String(0.25 + 0.75 * range(k, 0.8, 1));
      });

      // Rows fill top to bottom.
      rowRefs.current.forEach((row, r) => {
        const k = easeOutCubic(range(p, 0.55 + r * 0.045, 0.62 + r * 0.045));
        row.style.setProperty('--k', String(k));
      });

      // Steps advance; the reminder arrives last.
      const step = p < 0.1 ? 0 : p < 0.62 ? 1 : 2;
      stepRefs.current.forEach((li, i) => (li.dataset.on = String(i === step)));
      if (stepNowRef.current) stepNowRef.current.textContent = compliance.steps[step];
      const m = easeOutCubic(range(p, 0.82, 0.95));
      mailRef.current!.style.opacity = String(m);
      mailRef.current!.style.transform = `translate3d(0, ${(1 - m) * 24}px, 0)`;
      mailRef.current!.inert = m < 0.5;
    });
  }, []);

  const pickedCell = picked ? {v: fleet[picked.r], c: picked.c, cell: fleet[picked.r].cells[picked.c]} : null;

  return (
    <section ref={rootRef} id="compliance" data-pin={reduced ? undefined : ''} aria-labelledby="compliance-title" className="relative bg-cream" style={{height: reduced ? 'auto' : `${SECTION_VH}svh`}}>
      <div ref={stageRef} className={`${reduced ? 'relative py-24' : 'sticky top-0 h-screen-s overflow-hidden'} grid content-center gap-6 px-4 pt-20 pb-6 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-[4vw] lg:px-[4vw] lg:pt-16`}>
        {/* Left: the story, then the reminder. */}
        <div className="lg:relative lg:z-10">
          <p className="font-mono text-label text-muted uppercase">{compliance.eyebrow}</p>
          <h2 id="compliance-title" className="mt-3 max-w-[16ch] font-display text-display wide max-lg:text-[1.875rem]">
            {compliance.heading}
          </h2>
          <ol className="mt-8 space-y-2.5 max-lg:hidden" aria-label="How it works">
            {compliance.steps.map((s, i) => (
              <li
                key={s}
                ref={(el) => {
                  if (el) stepRefs.current[i] = el;
                }}
                data-on={i === 0}
                className="flex items-baseline gap-4 text-lead text-ink/30 transition-colors duration-500 data-[on=true]:text-ink"
              >
                <span className="font-mono text-label">0{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p ref={stepNowRef} aria-hidden="true" className="mt-3 text-body text-ink/80 lg:hidden">
            {compliance.steps[0]}
          </p>

          {/* The reminder email — an email card, not a phone screen. */}
          <div ref={mailRef} className={`mt-8 max-w-[26rem] rounded-[16px] bg-paper p-4 shadow-[0_24px_48px_-24px_rgb(21_21_21/0.35)] ring-1 ring-ink/8 lg:p-5 ${reduced ? '' : 'max-lg:absolute max-lg:inset-x-4 max-lg:bottom-5 max-lg:z-20 max-lg:mt-0'}`} style={{opacity: 0}}>
            <div className="flex items-center justify-between gap-3 font-mono text-[0.625rem] tracking-[0.1em] text-muted uppercase">
              <span>✉ {compliance.reminder.from}</span>
              <span className="rounded-full bg-cream px-2 py-0.5">Example data</span>
            </div>
            <p className="mt-2 font-semibold">{compliance.reminder.subject}</p>
            <ul className="mt-3 space-y-1.5 text-[0.875rem]">
              {dueSoon.map((d) => (
                <li key={d.plate + d.paper} className="flex justify-between gap-3 border-t border-ink/8 pt-1.5">
                  <span className="font-mono text-[0.75rem]">{d.plate}</span>
                  <span className="text-muted">
                    {d.paper} · due {fmt(d.date)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.8125rem] text-muted">{compliance.proof}</p>
          </div>
        </div>

        {/* Right: the matrix. */}
        <div ref={panelRef} className="relative rounded-[20px] bg-paper p-3 shadow-[0_30px_60px_-30px_rgb(21_21_21/0.3)] ring-1 ring-ink/8 lg:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter papers">
              {compliance.filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  className="min-h-8 rounded-full px-3 font-mono text-[0.625rem] tracking-[0.08em] uppercase ring-1 ring-ink/15 transition-colors aria-pressed:bg-ink aria-pressed:text-cream lg:text-label"
                >
                  {f.label}
                </button>
              ))}
            </div>
            <span className="rounded-full bg-cream px-2 py-1 font-mono text-[0.625rem] tracking-[0.1em] text-muted uppercase">Example data</span>
          </div>

          <table className="mt-3 w-full border-collapse text-left">
            <caption className="sr-only">Six papers for six example vehicles. Select a dot for its date.</caption>
            <thead>
              <tr className="border-b border-ink/10">
                <th scope="col" className="py-2 pr-2 font-mono text-[0.625rem] font-normal tracking-[0.08em] text-muted uppercase lg:text-label">
                  Vehicle
                </th>
                {papers.map((pp, i) => (
                  <th
                    key={pp.name}
                    scope="col"
                    ref={(el) => {
                      if (el) headRefs.current[i] = el;
                    }}
                    className="px-0.5 py-2 text-center font-mono text-[0.625rem] font-normal tracking-[0.04em] text-muted uppercase lg:text-[0.75rem]"
                  >
                    <span
                      ref={(el) => {
                        if (el) labelRefs.current[i] = el;
                      }}
                    >
                      <span className="lg:hidden">{pp.short}</span>
                      <span className="max-lg:hidden">{pp.name}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fleet.map((v, r) => (
                <tr
                  key={v.plate}
                  ref={(el) => {
                    if (el) rowRefs.current[r] = el;
                  }}
                  className="border-b border-ink/6 last:border-0"
                >
                  <th scope="row" className="py-2 pr-2 font-normal lg:py-3">
                    <span className="block font-mono text-[0.6875rem] whitespace-nowrap lg:text-[0.8125rem]">{v.plate}</span>
                    <span className="block text-[0.6875rem] text-muted lg:text-[0.75rem]">{v.kind}</span>
                  </th>
                  {v.cells.map(([s, date], c) => (
                    <td key={c} className="p-0 text-center">
                      <button
                        type="button"
                        onClick={() => setPicked({r, c})}
                        aria-label={`${v.plate}, ${papers[c].name}: ${statusText[s]} ${fmt(date)}`}
                        className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-ink/5 lg:size-10"
                      >
                        <Dot status={s} dim={filter !== 'all' && filter !== s} />
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[0.75rem] text-muted" aria-label="Legend">
              {compliance.legend.map((l) => (
                <li key={l.key} className="flex items-center gap-1.5">
                  <Dot status={l.key} style={{transform: 'none', background: DOT[l.key]}} />
                  {l.label}
                </li>
              ))}
            </ul>
            <p className="min-h-[1.25rem] font-mono text-[0.6875rem] text-ink" aria-live="polite">
              {pickedCell ? `${pickedCell.v.plate} · ${papers[pickedCell.c].name} · ${statusText[pickedCell.cell[0]]} ${fmt(pickedCell.cell[1])}` : <span className="text-muted">Tap a dot for its date.</span>}
            </p>
          </div>
        </div>

        {/* Loose papers, above both halves. */}
        {!reduced &&
          papers.map((pp, i) => (
            <div
              key={pp.name}
              ref={(el) => {
                if (el) paperRefs.current[i] = el;
              }}
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 z-30 aspect-[100/130] origin-center will-change-transform"
              style={{width: 120, transform: 'translate3d(-200%,0,0)'}}
            >
              <PaperSheet i={i} />
            </div>
          ))}
      </div>
    </section>
  );
}
