import {useEffect, useRef, useState, type MouseEvent} from 'react';
import {brand, footer, nav, whatsappHref} from '../content';
import {useFitText} from '../hooks/useFitText';
import {setMotionOff, useReducedMotion} from '../hooks/useReducedMotion';
import {clamp, easeOutCubic, passProgress} from '../lib/math';
import {onFrame, scrollToHash} from '../lib/scroll';

function go(e: MouseEvent<HTMLAnchorElement>, then?: () => void) {
  const hash = e.currentTarget.getAttribute('href');
  if (!hash?.startsWith('#')) return;
  e.preventDefault();
  then?.();
  scrollToHash(hash);
}

/** "Fleet" + a yolk "OPS" chip: the wordmark, as in the app. */
export function Logo({className = ''}: {className?: string}) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-sans text-[1.0625rem] font-semibold tracking-[-0.01em] ${className}`}>
      Fleet
      <span className="rounded-[6px] bg-yolk px-1.5 py-0.5 font-display text-[0.875rem] font-extrabold tracking-[0.02em] text-ink [font-stretch:125%]">OPS</span>
    </span>
  );
}

/** Live India time, ticking once a second. */
function useIst() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now.toLocaleTimeString('en-GB', {timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit'});
}

export function Header() {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Hide on scroll down, show on scroll up. Written straight to the style.
  useEffect(() => {
    let lastY = window.scrollY;
    let hidden = false;
    return onFrame(() => {
      const y = window.scrollY;
      const dy = y - lastY;
      if (Math.abs(dy) < 4) return;
      const hide = dy > 0 && y > 120;
      if (hide !== hidden) {
        hidden = hide;
        barRef.current!.style.transform = hide ? 'translate3d(0,-110%,0)' : '';
      }
      barRef.current!.dataset.solid = String(y > 40);
      lastY = y;
    });
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-ink">
      <div
        ref={barRef}
        data-solid="false"
        className="flex items-center justify-between px-4 py-3.5 transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-out)] data-[solid=true]:bg-cream/85 data-[solid=true]:shadow-[0_1px_0_rgb(21_21_21/0.08)] data-[solid=true]:backdrop-blur-xl sm:px-6 md:px-[3vw]"
      >
        <a href="#top" onClick={(e) => go(e)} aria-label={`${brand.name} — back to top`}>
          <Logo />
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={(e) => go(e)} className="font-mono text-label text-ink/70 uppercase transition-colors hover:text-ink">
              {item.label}
            </a>
          ))}
          <a href={brand.appUrl} className="font-mono text-label text-ink/70 uppercase underline-offset-4 hover:text-ink hover:underline">
            Open the app
          </a>
          <a href="#demo" onClick={(e) => go(e)} className="rounded-full bg-ink px-4 py-2.5 font-mono text-label text-cream uppercase transition-colors hover:bg-yolk hover:text-ink">
            Book a demo
          </a>
        </nav>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="menu" className="min-h-11 font-mono text-label uppercase lg:hidden">
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <div id="menu" inert={!open} className={`fixed inset-0 -z-10 flex flex-col justify-center gap-6 bg-cream/95 px-6 backdrop-blur-xl transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        {nav.map((item, i) => (
          <a key={item.href} href={item.href} onClick={(e) => go(e, () => setOpen(false))} className="flex items-baseline gap-4 font-display text-[2rem] wide">
            <span className="font-mono text-label font-normal text-faint">0{i + 1}</span>
            {item.label}
          </a>
        ))}
        <a href="#demo" onClick={(e) => go(e, () => setOpen(false))} className="mt-4 self-start rounded-full bg-ink px-6 py-4 font-mono text-label text-cream uppercase">
          Book a demo
        </a>
        <a href={brand.appUrl} className="self-start font-mono text-label text-ink/70 uppercase">
          Open the app
        </a>
      </div>
    </header>
  );
}

/** Phones: a bottom bar once the hero is gone, hidden again at the demo band. */
export function StickyCta() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let shown = false;
    return onFrame(() => {
      const el = ref.current;
      const demo = document.getElementById('demo');
      const trips = document.getElementById('compliance');
      if (!el || !demo || !trips) return;
      const vh = window.innerHeight;
      // Out of the way while a pinned scene fills the screen.
      const pinned = Array.from(document.querySelectorAll<HTMLElement>('[data-pin]')).some((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= 1 && r.bottom >= vh - 1;
      });
      const show = !pinned && trips.getBoundingClientRect().top < vh * 0.5 && demo.getBoundingClientRect().top > vh * 0.9;
      if (show === shown) return;
      shown = show;
      el.style.transform = show ? 'translate3d(0,0,0)' : 'translate3d(0,110%,0)';
      el.inert = !show;
    });
  }, []);

  return (
    <div
      ref={ref}
      inert
      className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink/10 bg-cream/90 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-300 md:hidden"
      style={{transform: 'translate3d(0,110%,0)'}}
    >
      <a href={whatsappHref()} target="_blank" rel="noopener" className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-ink font-mono text-label text-cream uppercase">
        WhatsApp a demo request →
      </a>
      <a href="#demo" onClick={(e) => go(e)} aria-label="Email us for a demo" className="flex size-12 items-center justify-center rounded-full ring-1 ring-ink/25">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      </a>
    </div>
  );
}

export function Footer() {
  const wordRef = useFitText<HTMLSpanElement>();
  const maskRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const ist = useIst();

  // The wordmark rises out of a clip as the footer comes into view.
  useEffect(() => {
    let last = -1;
    return onFrame(() => {
      const el = maskRef.current;
      if (!el) return;
      const {p} = passProgress(el);
      const k = reduced ? 1 : easeOutCubic(clamp(p * 2.2));
      if (Math.abs(k - last) < 0.0005) return;
      last = k;
      (el.firstElementChild as HTMLElement).style.transform = `translate3d(0, ${(1 - k) * 100}%, 0)`;
    });
  }, [reduced]);

  return (
    <footer className="bg-ink px-4 pt-20 pb-24 text-cream sm:px-6 md:px-[4vw] md:pt-28 md:pb-8">
      <div className="grid gap-14 md:grid-cols-[1.2fr_1fr] md:gap-10">
        <div>
          <p className="max-w-[14ch] font-display text-display wide">{footer.statement}</p>
          <a href={whatsappHref()} target="_blank" rel="noopener" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-yolk px-6 font-mono text-label text-ink uppercase transition-transform duration-300 hover:-translate-y-0.5">
            WhatsApp a demo request <span aria-hidden="true">→</span>
          </a>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 font-mono text-label uppercase sm:grid-cols-3">
          <div className="space-y-3">
            <p className="text-cream/45">Product</p>
            {nav.slice(0, 3).map((n) => (
              <a key={n.href} href={n.href} onClick={(e) => go(e)} className="block text-cream/85 hover:text-yolk">
                {n.label}
              </a>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-cream/45">Contact</p>
            <a href={whatsappHref()} target="_blank" rel="noopener" className="block text-cream/85 hover:text-yolk">
              WhatsApp
            </a>
            <a href={`mailto:${brand.email}`} className="block text-cream/85 normal-case [overflow-wrap:anywhere] hover:text-yolk">
              {brand.email}
            </a>
            <a href={brand.appUrl} className="block text-cream/85 hover:text-yolk">
              Open the app
            </a>
          </div>
          <div className="space-y-3">
            <p className="text-cream/45">Company</p>
            <p className="text-cream/85 normal-case [overflow-wrap:anywhere]">{brand.company}</p>
            <a href="/privacy" className="block text-cream/85 hover:text-yolk">
              Privacy
            </a>
          </div>
        </nav>
      </div>

      <div ref={maskRef} className="mt-20 overflow-hidden md:mt-28" aria-hidden="true">
        <div className="will-change-transform">
          <span ref={wordRef} className="inline-block font-display leading-[0.8] whitespace-nowrap wide">
            Fleet <span className="text-yolk">OPS</span>
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-cream/10 pt-6 font-mono text-label text-cream/55 uppercase md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} {brand.company}</span>
        <span>
          {brand.city} · <span className="text-cream tabular-nums">{ist}</span> IST
        </span>
        <button type="button" onClick={() => setMotionOff(!reduced)} aria-pressed={!reduced} className="flex items-center gap-3 self-start uppercase md:self-auto">
          <span className={`relative h-5 w-9 rounded-full transition-colors ${reduced ? 'bg-cream/20' : 'bg-yolk'}`}>
            <span className={`absolute top-0.5 size-4 rounded-full bg-ink transition-[left] ${reduced ? 'left-0.5' : 'left-[1.125rem]'}`} />
          </span>
          Motion: <span className="text-cream">{reduced ? 'off' : 'on'}</span>
        </button>
        <a href="#top" onClick={(e) => go(e)} className="hover:text-yolk">
          Back to top ↑
        </a>
      </div>
      <p className="mt-4 font-mono text-[0.625rem] tracking-[0.1em] text-cream/35 uppercase">{footer.small}</p>
    </footer>
  );
}
