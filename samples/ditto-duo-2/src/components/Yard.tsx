import {useEffect, useRef, type MouseEvent} from 'react';
import {hero, whatsappHref} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {clamp, easeOutCubic, lerp, pinProgress, range} from '../lib/math';
import {onFrame, scrollToHash} from '../lib/scroll';
import {Asset} from './Asset';

/**
 * The hero: a morning yard, cleared of paperwork. Full-frame layers (sky,
 * yard, ground) plus three vehicle cutouts, stacked and pinned; one scroll
 * range moves each at its own rate:
 *
 *   0.00 – 0.16  a drift of loose paper blows off the screen
 *   0.08 – 0.24  the headline, lead and buttons settle in
 *   0.10 – 0.55  trailer, bus and lorry roll into the yard, each at its own
 *                depth (the nearest travels furthest)
 *   0.72 – 1.00  everything lifts away and the ground — with a cream apron
 *                below it — fills the frame and hands over to the page
 *
 * A thin readout rides on top: yard clock, papers due, site.
 * There is no WebGL: depth is the layers sliding past each other.
 */

const STAGE_VH = 320;

type Full = 'sky' | 'yard' | 'ground';
type Vehicle = 'trailer' | 'bus' | 'lorry';

/** Back to front. `travel` is how far (vw) each rolls in from; the nearest travels furthest. */
const VEHICLES: {name: Vehicle; travel: number; lift: number; cls: string}[] = [
  {name: 'trailer', travel: 30, lift: 30, cls: 'left-[-16%] bottom-[19%] w-[66vw] md:left-auto md:right-[30%] md:bottom-[30%] md:w-[27vw]'},
  {name: 'bus', travel: 46, lift: 44, cls: 'right-[-20%] bottom-[14%] w-[70vw] md:right-[-2%] md:bottom-[24%] md:w-[31vw]'},
  {name: 'lorry', travel: 74, lift: 66, cls: 'left-[4%] bottom-[3%] w-[88vw] md:left-auto md:right-[10%] md:bottom-[4%] md:w-[42vw]'},
];

const FIT = 'absolute inset-0 size-full object-cover object-[60%_50%] md:object-center';

type Sheet = {x: number; y: number; w: number; r: number; s: number; spin: number};

export function Yard() {
  const rootRef = useRef<HTMLElement>(null);
  const fullRefs = useRef<Partial<Record<Full, HTMLDivElement>>>({});
  const vehRefs = useRef<Partial<Record<Vehicle, HTMLDivElement>>>({});
  const veilRef = useRef<HTMLDivElement>(null);
  const veilTextRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const dueRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  // Paper canvas size.
  useEffect(() => {
    const c = paperRef.current!;
    const sync = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = paperRef.current!;
    const ctx = canvas.getContext('2d')!;
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const sheets: Sheet[] = Array.from({length: 40}, () => ({x: rand(), y: rand(), w: 0.6 + rand() * 0.8, r: (rand() - 0.5) * 1.2, s: 0.4 + rand(), spin: (rand() - 0.5) * 2}));
    let lastP = -1;
    let lastTime = 0;
    let drift = 0;

    const setFull = (name: Full, y: number, scale = 1) => {
      const el = fullRefs.current[name];
      if (el) el.style.transform = `translate3d(0, ${y}vh, 0) scale(${scale})`;
    };

    return onFrame((time) => {
      const dt = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      const root = rootRef.current;
      if (!root) return;
      const pin = pinProgress(root);
      if (pin.rect.bottom < 0) return;
      // Reduced motion: no pin, just the settled yard.
      const p = reducedRef.current ? 0.6 : pin.p;

      // Loose paper drifts while it's on screen, then blows up and away.
      const clear = range(p, 0, 0.16);
      const veil = 1 - clear;
      if (veil > 0.001) {
        if (!reducedRef.current) drift += dt;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const dpr = canvas.width / Math.max(1, w);
        const base = Math.max(38, Math.min(w, h) * 0.085);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        for (const s of sheets) {
          const sw = base * s.w;
          const sh = sw * 1.32;
          const x = ((s.x + drift * 0.004 * s.s) % 1) * w + clear * (s.x - 0.5) * w * 0.9;
          const y = s.y * h - clear * h * (0.8 + s.s);
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(s.r + drift * 0.02 * s.spin + clear * s.spin * 2);
          ctx.globalAlpha = veil;
          ctx.shadowColor = 'rgba(21,21,21,0.12)';
          ctx.shadowBlur = 14;
          ctx.shadowOffsetY = 6;
          ctx.fillStyle = '#fbf6e9';
          ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(21,21,21,0.16)';
          for (let l = 0; l < 5; l++) ctx.fillRect(-sw * 0.36, -sh * 0.32 + l * sh * 0.13, sw * (l === 0 ? 0.42 : 0.72), Math.max(1, sh * 0.018));
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      }

      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      const exit = range(p, 0.72, 1);
      const settle = easeOutCubic(range(p, 0, 0.5));

      veilRef.current!.style.opacity = String(veil);
      veilRef.current!.style.transform = `translate3d(0, ${-clear * 18}vh, 0)`;
      canvas.style.opacity = String(veil);
      veilTextRef.current!.style.opacity = String(1 - range(p, 0, 0.08));

      // Far → near, each faster than the one behind it.
      setFull('sky', lerp(0, -6, p), lerp(1.12, 1, settle));
      setFull('yard', lerp(8, 0, settle) - exit * 22);
      const roll = easeOutCubic(range(p, 0.1, 0.55));
      for (const v of VEHICLES) {
        const el = vehRefs.current[v.name];
        if (!el) continue;
        el.style.transform = `translate3d(${lerp(v.travel, 0, roll)}vw, ${-exit * v.lift}vh, 0)`;
        el.style.opacity = String(clamp(roll * 3));
      }
      const ground = easeOutCubic(range(p, 0.12, 0.5));
      setFull('ground', lerp(26, 0, ground) - exit * 82);

      // Headline settles in, then lifts away before the ground arrives.
      const tIn = easeOutCubic(range(p, 0.08, 0.24));
      const tOut = range(p, 0.66, 0.8);
      const title = titleRef.current!;
      title.style.opacity = String(tIn * (1 - tOut));
      title.style.transform = `translate3d(0, ${(1 - tIn) * 4 - tOut * 10}vh, 0)`;
      title.style.pointerEvents = tIn > 0.6 && tOut < 0.5 ? 'auto' : 'none';

      // Readouts: the yard clock runs 07:00 → 09:30, papers due count up to 3.
      hudRef.current!.style.opacity = String(range(p, 0.1, 0.2) * (1 - range(p, 0.66, 0.74)));
      const mins = 7 * 60 + Math.round(p * 150);
      clockRef.current!.textContent = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
      dueRef.current!.textContent = String(Math.round(range(p, 0.2, 0.5) * 3));
    });
  }, []);

  const full = (name: Full) => (
    <div
      key={name}
      ref={(el) => {
        if (el) fullRefs.current[name] = el;
      }}
      className="absolute inset-0 will-change-transform"
    >
      <picture>
        <source media="(max-width: 767px)" srcSet={`/layers/m/${name}.webp`} />
        <img
          src={`/layers/d/${name}.webp`}
          alt=""
          aria-hidden="true"
          className={FIT}
          decoding="async"
          fetchPriority={name === 'sky' ? 'high' : 'auto'}
          onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
        />
      </picture>
      {/* The ground carries a cream apron below it, so when it climbs it
          fills the screen and hands straight over to the page below. */}
      {name === 'ground' && <div className="absolute inset-x-0 top-full h-[110vh] bg-cream" />}
    </div>
  );

  const toDemo = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToHash('#demo');
  };

  return (
    <section id="top" ref={rootRef} aria-label="Fleet Ops" className="relative" style={{height: `${reduced ? 100 : STAGE_VH}svh`}}>
      {/* Base colour stands in for the sky until sky.webp is added. */}
      <div className="sticky top-0 h-screen-s overflow-hidden bg-[linear-gradient(180deg,#f7dcc0_0%,#f6e8d6_42%,#f3efe6_100%)]">
        {full('sky')}
        {full('yard')}

        {VEHICLES.map((v) => (
          <div
            key={v.name}
            ref={(el) => {
              if (el) vehRefs.current[v.name] = el;
            }}
            className={`absolute aspect-[16/9] will-change-transform ${v.cls}`}
            style={{opacity: 0}}
          >
            <Asset src={`/media/vehicles/${v.name}.webp`} className="size-full" imgClassName="size-full object-contain object-bottom" width={1600} height={900} priority={v.name === 'lorry'} />
          </div>
        ))}

        {full('ground')}

        {/* Headline block. */}
        <div ref={titleRef} className="absolute inset-x-0 top-[13%] px-4 sm:px-6 md:top-[17%] md:px-[4vw]" style={{opacity: 0}}>
          <p className="font-mono text-label text-ink/65 uppercase">{hero.kicker}</p>
          <h1 className="mt-4 font-display text-hero wide">
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-[46ch] text-lead text-ink/75 max-sm:text-[0.9375rem]">{hero.lead}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href={whatsappHref()} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-6 font-mono text-label text-cream uppercase transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-ink-2">
              WhatsApp a demo request <span aria-hidden="true">→</span>
            </a>
            <a href="#demo" onClick={toDemo} className="inline-flex min-h-12 items-center rounded-full px-6 font-mono text-label uppercase ring-1 ring-ink/30 transition-colors hover:bg-ink hover:text-cream">
              Email us
            </a>
          </div>
          <p className="mt-4 font-mono text-[0.625rem] tracking-[0.12em] text-ink/55 uppercase">{hero.note}</p>
        </div>

        {/* Loose paper on top of everything; the line to scroll sits above the paper. */}
        <div ref={veilRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_45%,rgb(243_239_230/0.75),rgb(233_226_212/0.96))]" />
        <canvas ref={paperRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
        <div ref={veilTextRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center">
            <div className="mx-auto w-fit rounded-[20px] bg-cream/85 px-6 py-5 shadow-[0_20px_60px_-20px_rgb(21_21_21/0.25)] backdrop-blur-md md:px-10 md:py-7">
            <p className="font-mono text-label text-ink/65 uppercase">{hero.kicker}</p>
            <p className="mt-4 font-display text-[clamp(1.5rem,3.4vw,2.75rem)] wide">{hero.veil}</p>
            <span aria-hidden="true" className="mt-4 inline-block animate-bounce text-ink/60 motion-reduce:animate-none">
              ↓
            </span>
            </div>
          </div>
        </div>

        {/* Readouts. */}
        <div ref={hudRef} aria-hidden="true" className="pointer-events-none absolute inset-3 font-mono text-[0.625rem] tracking-[0.14em] text-ink/70 uppercase sm:inset-5 md:text-label" style={{opacity: 0}}>
          <div className="brackets absolute inset-0 text-ink/25" />
          <div className="absolute top-16 right-3 space-y-1 text-right max-md:hidden md:top-20 md:right-4">
            <p>
              Yard <span ref={clockRef} className="text-ink tabular-nums">07:00</span> IST
            </p>
            <p className="text-ink/45">Morning dispatch</p>
            <p className="pt-3">
              Papers due · 30 days <span ref={dueRef} className="rounded-[3px] bg-yolk px-1.5 py-0.5 text-ink tabular-nums">0</span>
            </p>
          </div>
          <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">{hero.site}</div>
          <div className="absolute right-3 bottom-3 md:right-4 md:bottom-4">
            Scroll <span className="inline-block animate-bounce motion-reduce:animate-none">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
