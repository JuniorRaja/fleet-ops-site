import { more } from "@/lib/mergedContent";
import { DOC_ORDER, VEHICLES, statusOf } from "@/lib/fleet";
import { Icon } from "@/components/ui/Icons";
import { useReveals } from "@/hooks/useReveals";

const SPAN: Record<string, string> = {
  wide: 'md:col-span-2',
  tall: 'md:row-span-2',
  base: '',
  phone: 'md:col-span-2 md:row-span-2',
};

function TileObject({ name }: { name: string }) {
  if (name === "Fuel log") {
    return (
      <div aria-hidden="true" className="spot-object absolute bottom-[-1.25rem] right-[-0.75rem] w-40 rotate-[-6deg] rounded-lg border border-ink/10 bg-paper p-3 shadow-md md:right-[-0.5rem] md:w-44">
        <div className="flex items-center justify-between font-mono text-[0.55rem] text-ink/55">
          <span>FUEL LOG</span><Icon name="fuel" size={16} className="text-brand" />
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div><p className="font-mono text-xs font-semibold">42.8 L</p><p className="mt-1 text-[0.6rem] text-ink/55">Diesel · 14 Oct</p></div>
          <p className="display text-lg">₹4,108</p>
        </div>
        <div className="mt-2 h-1 rounded-full bg-brand/20"><div className="h-full w-2/3 rounded-full bg-brand" /></div>
      </div>
    );
  }

  if (name === "Maintenance") {
    return (
      <div aria-hidden="true" className="spot-object absolute bottom-[-2.5rem] right-[-1.25rem] flex min-h-36 w-52 rotate-[-4deg] items-end justify-between rounded-lg border border-ink/10 bg-paper p-4 shadow-md">
        <div>
          <p className="font-mono text-[0.55rem] text-ink/50">WORK ORDER 024</p>
          <p className="display mt-2 text-lg">Service due</p>
          <p className="mt-1 text-xs text-ink/60">TN 38 AB 1201 · 500 km</p>
          <div className="mt-3 h-1 w-28 rounded-full bg-brand/15"><div className="h-full w-3/4 rounded-full bg-brand" /></div>
        </div>
        <Icon name="wrench" size={46} stroke={1.4} className="mb-1 text-brand" />
      </div>
    );
  }

  if (name === "Tyres") {
    return (
      <div aria-hidden="true" className="spot-object absolute bottom-[-1.5rem] right-[-1.75rem] w-52 rotate-[-12deg] text-brand md:w-60">
        <svg className="spot-tyre-mark h-auto w-full" viewBox="0 0 220 150" fill="none">
          <defs>
            <pattern id="tyre-tread" width="22" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
              <path d="M3 2h7v6H3zM13 12h7v6h-7z" fill="currentColor" />
            </pattern>
          </defs>
          <rect x="26" y="12" width="168" height="46" rx="22" fill="url(#tyre-tread)" opacity=".2" transform="rotate(-14 110 35)" />
          <rect x="12" y="82" width="168" height="46" rx="22" fill="url(#tyre-tread)" opacity=".2" transform="rotate(-14 96 105)" />
          <path d="M31 26h158M17 96h158" stroke="currentColor" strokeWidth="2" strokeDasharray="3 8" opacity=".45" transform="rotate(-14 110 35)" />
        </svg>
      </div>
    );
  }

  if (name === "Works on your phone") {
    return (
      <div aria-hidden="true" className="spot-object absolute bottom-[-3.25rem] right-3 w-[9.5rem] rotate-[5deg] rounded-[28px] bg-ink p-2 shadow-[0_30px_60px_-20px_rgb(21_21_21/0.5)] md:right-5 md:w-[11.5rem]">
        <div className="rounded-[22px] bg-white p-3 pb-10 text-ink">
          <p className="font-mono text-[0.5rem] tracking-[0.1em] text-ink/65 uppercase">Compliance</p>
          <div className="mt-2 space-y-1.5">
            {VEHICLES.map((v) => (
              <div key={v.plate} className="flex items-center justify-between gap-1">
                <span className="font-mono text-[0.5rem]">{v.plate.slice(6)}</span>
                <span className="flex gap-[3px]">
                  {DOC_ORDER.map((doc) => {
                    const status = statusOf(doc, v.docs[doc]);
                    return <span key={doc} className={`size-2 ${status === "pending" ? "rounded-[2px]" : "rounded-full"} ${status === "valid" ? "bg-valid" : status === "expired" ? "bg-danger" : "bg-warn"}`} />;
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (name === "Reports") {
    return (
      <div aria-hidden="true" className="spot-object absolute bottom-[-1.5rem] right-[-1.5rem] flex h-20 items-end gap-2 rounded-lg border border-ink/10 bg-paper px-4 pb-3 pt-4 shadow-md">
        {[35, 58, 44, 82, 66].map((height, index) => (
          <span key={index} className="w-3 rounded-t-sm bg-brand/75" style={{ height: `${height}%` }} />
        ))}
        <div className="ml-2 border-l border-ink/10 pl-3 pb-1">
          <p className="font-mono text-[0.55rem] text-ink/50">COST / KM</p>
          <p className="display mt-1 text-lg">₹18.40</p>
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="spot-object absolute bottom-[-1.25rem] right-[-0.75rem] w-44 rotate-[-5deg] rounded-lg border border-ink/10 bg-paper p-3 shadow-md md:right-[-0.5rem] md:w-48">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[0.55rem] text-ink/55">FLEET_IMPORT.XLS</p>
        <Icon name="upload" size={16} className="text-brand" />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-px overflow-hidden rounded border border-ink/10 bg-ink/10">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} className={`h-3 ${index < 4 ? "bg-brand/15" : "bg-white"}`} />
        ))}
      </div>
    </div>
  );
}

/** The rest of the office as a bento grid. One phone tile shows the matrix at 375px. */
export function More() {
  const ref = useReveals<HTMLElement>();
  return (
    <section ref={ref} aria-labelledby="more-title" className="bg-paper px-4 pb-24 pt-24 sm:px-6 sm:pt-32 md:px-[4vw] md:pb-40">
      <div data-reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-ink/65">{more.eyebrow}</p>
          <h2 id="more-title" className="display mt-3 max-w-[18ch] text-[clamp(2rem,4.4vw,4.25rem)]">
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
            onPointerMove={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
              event.currentTarget.style.setProperty("--my", `${event.clientY - bounds.top}px`);
            }}
            className={`spot relative flex flex-col justify-between overflow-hidden rounded-[20px] p-6 ${SPAN[t.size]} ${t.size === 'phone' ? 'spot-brand bg-brand text-white md:flex-row md:items-end md:gap-6' : 'bg-white ring-1 ring-ink/8'}`}
          >
            <div className="relative z-10 max-w-[24rem]">
              <span className={`eyebrow ${t.size === 'phone' ? 'text-white' : 'text-ink/70'}`}>0{i + 1}</span>
              <h3 className="display mt-6 text-[1.375rem]">{t.name}</h3>
              <p className={`mt-2 text-[0.9375rem] leading-relaxed ${t.size === 'phone' ? 'text-white/85' : 'text-ink/65'}`}>{t.body}</p>
            </div>
            <TileObject name={t.name} />
          </li>
        ))}
      </ul>
    </section>
  );
}
