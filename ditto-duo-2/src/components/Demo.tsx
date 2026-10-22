import {useEffect, useRef, useState, type FormEvent} from 'react';
import {brand, demo, demoMessage, emailHref, whatsappHref} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {useReveals} from '../hooks/useReveals';
import {passProgress} from '../lib/math';
import {onFrame} from '../lib/scroll';

type Status = 'idle' | 'invalid' | 'sent' | 'copied';

/**
 * The yolk band. The form drafts a message and hands it to WhatsApp or the
 * visitor's mail app; there is no backend. A huge outlined wordmark slides
 * across the band as it passes.
 */
export function Demo() {
  const ref = useReveals<HTMLElement>();
  const markRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    let last = -1;
    return onFrame(() => {
      const section = ref.current;
      const mark = markRef.current;
      if (!section || !mark) return;
      const {p, rect, vh} = passProgress(section);
      if (rect.bottom < 0 || rect.top > vh) return;
      const x = reduced ? 0 : (0.5 - p) * 40;
      if (Math.abs(x - last) < 0.01) return;
      last = x;
      mark.style.transform = `translate3d(${x}vw, 0, 0)`;
    });
  }, [ref, reduced]);

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus('invalid');
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const text = demoMessage(data);
    const via = (e.nativeEvent as SubmitEvent).submitter?.getAttribute('value');
    if (via === 'email') window.location.href = emailHref(text);
    else window.open(whatsappHref(text), '_blank', 'noopener');
    setStatus('sent');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brand.email);
      setStatus('copied');
    } catch {
      setStatus('idle');
    }
  };

  const field = 'w-full rounded-[12px] bg-cream/70 px-4 py-3 text-body text-ink ring-1 ring-ink/15 outline-none placeholder:text-ink/40 focus:ring-2 focus:ring-ink user-invalid:ring-bad';
  const label = 'mb-1.5 block font-mono text-label text-ink/70 uppercase';

  return (
    <section ref={ref} id="demo" aria-labelledby="demo-title" className="relative overflow-hidden bg-yolk px-4 pt-24 pb-40 text-ink sm:px-6 md:px-[4vw] md:pt-32 md:pb-56">
      <div className="relative z-10 grid gap-12 md:grid-cols-2 md:gap-[5vw]">
        <div data-reveal>
          <p className="font-mono text-label uppercase">{demo.eyebrow}</p>
          <h2 id="demo-title" className="mt-3 max-w-[13ch] font-display text-[clamp(2.4rem,5.4vw,5.5rem)] leading-[0.92] tracking-[-0.03em] wide">
            {demo.heading}
          </h2>
          <p className="mt-6 max-w-[34rem] text-lead">{demo.body}</p>
          <p className="mt-6 text-body">
            {demo.signIn}{' '}
            <a href={brand.appUrl} className="font-semibold underline underline-offset-4">
              Open the app
            </a>
          </p>
        </div>

        <form noValidate onSubmit={send} aria-describedby="demo-status" className="space-y-3 self-start rounded-[24px] bg-paper/60 p-5 ring-1 ring-ink/10 backdrop-blur md:p-7" data-reveal>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Your name</span>
              <input name="name" required autoComplete="name" className={field} onInput={() => setStatus('idle')} />
            </label>
            <label className="block">
              <span className={label}>Company</span>
              <input name="company" required autoComplete="organization" className={field} onInput={() => setStatus('idle')} />
            </label>
          </div>
          <label className="block">
            <span className={label}>City</span>
            <input name="city" required autoComplete="address-level2" placeholder="Chennai" className={field} onInput={() => setStatus('idle')} />
          </label>
          <fieldset>
            <legend className={label}>Your fleet</legend>
            <div className="grid grid-cols-3 gap-3">
              {(['lorries', 'trailers', 'buses'] as const).map((k) => (
                <label key={k} className="block">
                  <span className="sr-only">Number of {k}</span>
                  <input name={k} inputMode="numeric" pattern="[0-9]*" placeholder="0" className={`${field} text-center`} />
                  <span aria-hidden="true" className="mt-1 block text-center font-mono text-[0.625rem] tracking-[0.1em] text-ink/60 uppercase">
                    {k}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <button type="submit" value="whatsapp" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 font-mono text-label text-cream uppercase transition-transform duration-300 hover:-translate-y-0.5">
              Send on WhatsApp <span aria-hidden="true">→</span>
            </button>
            <button type="submit" value="email" className="flex min-h-12 flex-1 items-center justify-center rounded-full px-5 font-mono text-label uppercase ring-1 ring-ink/40 transition-colors hover:bg-ink hover:text-cream">
              Send by email
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[0.8125rem]">
            <span>
              Or write to <span className="font-mono">{brand.email}</span>
            </span>
            <button type="button" onClick={copy} className="font-mono text-label uppercase underline underline-offset-4">
              Copy email
            </button>
          </div>
          <p id="demo-status" role="status" className="min-h-[1.25rem] text-[0.8125rem]">
            {status === 'invalid' && 'Your name, company and city, please.'}
            {status === 'sent' && `Your message is drafted. If nothing opened, write to ${brand.email}.`}
            {status === 'copied' && 'Email address copied.'}
          </p>
        </form>
      </div>

      {/* The outlined wordmark, sliding across the bottom of the band. */}
      <span
        ref={markRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-0.18em] left-[-4vw] font-display text-[26vw] leading-none whitespace-nowrap text-transparent wide [-webkit-text-stroke:1.5px_rgb(21_21_21/0.28)]"
      >
        FLEET OPS
      </span>
    </section>
  );
}
