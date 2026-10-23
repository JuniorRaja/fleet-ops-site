import {honest, whatsappHref} from '../content';
import {useReveals} from '../hooks/useReveals';

/**
 * What it does not do, said plainly, then five straight answers.
 * The FAQ uses <details>, so it works with no script and with the keyboard.
 */
export function Honest() {
  const ref = useReveals<HTMLElement>();
  return (
    <section ref={ref} id="faq" aria-labelledby="faq-title" className="border-t border-ink/10 bg-cream px-4 py-24 sm:px-6 md:grid md:grid-cols-[0.9fr_1.1fr] md:gap-[6vw] md:px-[4vw] md:py-32">
      <div data-reveal>
        <p className="font-mono text-label text-muted uppercase">{honest.eyebrow}</p>
        <h2 id="faq-title" className="mt-3 max-w-[14ch] font-display text-display wide">
          {honest.heading}
        </h2>
        <ul className="mt-8 flex flex-wrap gap-2">
          {honest.nots.map((n) => (
            <li key={n} className="flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.875rem] ring-1 ring-ink/15">
              <svg viewBox="0 0 16 16" className="size-3.5 text-bad" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M3.5 12.5 12.5 3.5" />
              </svg>
              {n}
            </li>
          ))}
        </ul>
        <a href={whatsappHref('Hi, I have a question about Fleet Ops:')} target="_blank" rel="noopener" className="mt-6 inline-block font-mono text-label uppercase underline underline-offset-4 hover:text-muted">
          {honest.notsNote}
        </a>
      </div>

      <div data-reveal className="mt-14 md:mt-0">
        {honest.faq.map((f) => (
          <details key={f.q} className="group border-b border-ink/12 py-5 first:border-t">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lead font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-ink/20 transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-[56ch] text-body text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
