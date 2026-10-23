import { roles } from "@/lib/mergedContent";
import { useReveals } from "@/hooks/useReveals";

/** Three roles, each with what they see. One record row shows a change kept on file. */
export function Roles() {
  const ref = useReveals<HTMLElement>();
  const r = roles.record;
  return (
    <section ref={ref} id="roles" aria-labelledby="roles-title" className="bg-paper px-4 pt-32 pb-20 sm:px-6 md:px-[4vw] md:pt-44 md:pb-28">
      <div data-reveal>
        <p className="eyebrow text-ink/65">{roles.eyebrow}</p>
        <h2 id="roles-title" className="display mt-3 max-w-[20ch] text-[clamp(2rem,4.4vw,4.25rem)]">
          {roles.heading}
        </h2>
      </div>

      <ol className="mt-12 grid gap-3 md:mt-16 md:grid-cols-3 md:gap-4">
        {roles.items.map((role, i) => (
          <li
            key={role.name}
            data-reveal
            style={{transitionDelay: `${i * 80}ms`}}
            className={`group relative flex flex-col rounded-[20px] p-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 md:p-8 ${
              role.featured ? 'bg-ink text-paper' : 'bg-white ring-1 ring-ink/8 hover:shadow-[0_24px_48px_-28px_rgb(21_21_21/0.35)]'
            }`}
          >
            <span className={`eyebrow ${role.featured ? 'text-lime' : 'text-ink/45'}`}>0{i + 1}</span>
            <h3 className="display mt-8 text-[1.5rem] md:text-[1.75rem]">{role.name}</h3>
            <ul className={`mt-6 space-y-2.5 border-t pt-5 ${role.featured ? 'border-cream/15' : 'border-ink/10'}`}>
              {role.lines.map((l) => (
                <li key={l} className={`flex gap-3 text-[0.9375rem] ${role.featured ? 'text-paper/85' : 'text-ink/80'}`}>
                  <span aria-hidden="true" className={`mt-2 size-1.5 shrink-0 rounded-full ${role.featured ? 'bg-lime' : 'bg-ink'}`} />
                  {l}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div data-reveal className="mt-4 flex flex-col gap-3 rounded-[16px] border border-dashed border-ink/20 p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <p className="font-mono text-[0.75rem] leading-relaxed">
          <span className="rounded-[4px] bg-brand px-1.5 py-0.5 text-white">{r.what}</span> · {r.who} · {r.when} · <span className="tabular-nums">{r.change}</span> · reason: “{r.reason}”
        </p>
        <p className="text-[0.8125rem] text-ink/65 md:max-w-[22rem] md:text-right">{roles.recordNote}</p>
      </div>
    </section>
  );
}
