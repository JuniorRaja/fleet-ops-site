import {fleet, more} from '../content';
import {useReveals} from '../hooks/useReveals';

const SPAN: Record<string, string> = {
  wide: 'md:col-span-2',
  tall: 'md:row-span-2',
  base: '',
  phone: 'md:col-span-2 md:row-span-2',
};

/** The rest of the office as a bento grid. One phone tile shows the matrix at 375px. */
export function More() {
  const ref = useReveals<HTMLElement>();
  return (
    <section ref={ref} aria-labelledby="more-title" className="bg-cream px-4 pb-24 sm:px-6 md:px-[4vw] md:pb-40">
      <div data-reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-label text-muted uppercase">{more.eyebrow}</p>
          <h2 id="more-title" className="mt-3 max-w-[18ch] font-display text-display wide">
            {more.heading}
          </h2>
        </div>
      </div>

      <ul className="mt-10 grid auto-rows-[minmax(10rem,auto)] gap-3 md:mt-14 md:grid-flow-dense md:grid-cols-4 md:gap-4">
        {more.tiles.map((t, i) => (
          <li
            key={t.name}
            data-reveal
            style={{transitionDelay: `${i * 60}ms`}}
            className={`relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-paper p-6 ring-1 ring-ink/8 transition-transform duration-500 hover:-translate-y-1 ${SPAN[t.size]} ${t.size === 'phone' ? 'bg-yolk ring-0 md:flex-row md:items-end md:gap-6' : ''}`}
          >
            <div className="max-w-[24rem]">
              <span className="font-mono text-label text-faint">0{i + 1}</span>
              <h3 className="mt-6 font-display text-[1.375rem] wide">{t.name}</h3>
              <p className={`mt-2 text-body ${t.size === 'phone' ? 'text-ink/80' : 'text-muted'}`}>{t.body}</p>
            </div>
            {t.size === 'phone' && (
              <div aria-hidden="true" className="mx-auto mt-6 w-[11.5rem] shrink-0 translate-y-10 rounded-[28px] bg-ink p-2 shadow-[0_30px_60px_-20px_rgb(21_21_21/0.5)] md:mx-0 md:mt-0 md:translate-y-14">
                <div className="rounded-[22px] bg-paper p-3 pb-10">
                  <p className="font-mono text-[0.5rem] tracking-[0.1em] text-muted uppercase">Compliance</p>
                  <div className="mt-2 space-y-1.5">
                    {fleet.map((v) => (
                      <div key={v.plate} className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[0.5rem]">{v.plate.slice(6)}</span>
                        <span className="flex gap-[3px]">
                          {v.cells.map(([s], c) => (
                            <span key={c} className={`size-2 ${s === 'p' ? 'rounded-[2px]' : 'rounded-full'} ${s === 'v' ? 'bg-ok' : s === 'x' ? 'bg-bad' : 'bg-due'}`} />
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
