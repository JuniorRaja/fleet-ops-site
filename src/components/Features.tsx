import type { PointerEvent, ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { StatusDot } from "@/components/ui/StatusDot";
import { DOC_ORDER, VEHICLES, statusOf } from "@/lib/fleet";
import { PHOTOS } from "@/lib/config";
import { cn } from "@/utils/cn";

function SpotCard({ children, className }: { children: ReactNode; className?: string }) {
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <article
      onPointerMove={onMove}
      className={cn("spot group relative h-full overflow-hidden rounded-[28px] border border-ink/10 bg-white/80 p-6 backdrop-blur sm:p-7", className)}
    >
      {children}
    </article>
  );
}

function Tag({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-2 text-brand">
      <Icon name={icon} size={16} />
      {children}
    </p>
  );
}

function Title({ children }: { children: ReactNode }) {
  return <h3 className="display mt-4 text-[clamp(1.6rem,2.6vw,2.4rem)] !leading-[1]">{children}</h3>;
}

function Body({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mt-3 max-w-[44ch] text-[15px] leading-relaxed text-ink/70", className)}>{children}</p>;
}

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="eyebrow text-brand">What is inside</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 id="features-title" className="display mt-4 text-[clamp(2.4rem,5.2vw,5rem)]">
                Everything a fleet's paperwork and workshop needs. Nothing it doesn't.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120} className="lg:col-span-4">
            <p className="text-[17px] leading-relaxed text-ink/70">
              No GPS boxes, no live maps, no driver surveillance. Fleet OPS does one job: keeps every vehicle legal,
              serviced and accountable.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-6 lg:gap-5">
          <Reveal className="lg:col-span-4 lg:row-span-2">
            <SpotCard className="flex flex-col justify-between">
              <div>
                <Tag icon="shield">Compliance matrix</Tag>
                <Title>Six papers. Every vehicle. One glance.</Title>
                <Body>
                  Fitness, insurance, PUC, permit, RC and road tax in a single grid. Filter to what has expired or is
                  about to, and open any dot to see the paper behind it.
                </Body>
              </div>
              <div className="mt-8 rounded-2xl border border-ink/10 bg-paper/70 p-4" aria-hidden="true">
                <div className="grid grid-cols-[1fr_repeat(6,28px)] items-center gap-x-3 gap-y-3 sm:grid-cols-[1.4fr_repeat(6,36px)]">
                  {VEHICLES.slice(0, 5).map((v) => (
                    <div key={v.plate} className="contents">
                      <span className="truncate font-mono text-[11px] font-semibold text-ink/80">{v.plate}</span>
                      {DOC_ORDER.map((d) => (
                        <span key={d} className="justify-self-center transition-transform duration-200 group-hover:scale-110">
                          <StatusDot status={statusOf(d, v.docs[d])} size={22} />
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </SpotCard>
          </Reveal>

          <Reveal delay={60} className="lg:col-span-2">
            <SpotCard>
              <Tag icon="bell">Lead-time reminders</Tag>
              <p className="display mt-5 text-[clamp(4rem,7vw,6rem)] text-ink">
                45<span className="ml-1 text-2xl text-ink/60">days</span>
              </p>
              <Body>Permit warning starts 45 days out. PUC gets 7. Each paper keeps its own clock.</Body>
            </SpotCard>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-2">
            <SpotCard>
              <Tag icon="lock">Document hold</Tag>
              <Title>Stop it at the gate.</Title>
              <Body>An unfit vehicle leaves only with a written reason, a name and a time.</Body>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#fde4e2] px-3 py-1.5 text-xs font-semibold text-[#a4191a]">
                <Icon name="lock" size={13} /> Document hold
              </span>
            </SpotCard>
          </Reveal>

          <Reveal className="lg:col-span-3">
            <SpotCard className="min-h-[340px] !p-0">
              <Picture
                src={PHOTOS.workshop}
                alt="A mechanic inspecting a truck engine in a workshop"
                width={1200}
                height={800}
                className="absolute inset-0 block"
                imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/55 to-ink/10" aria-hidden="true" />
              <div className="relative flex h-full min-h-[340px] flex-col justify-end p-6 text-paper sm:p-7">
                <p className="eyebrow flex items-center gap-2 text-lime">
                  <Icon name="wrench" size={16} /> Workshop &amp; maintenance
                </p>
                <h3 className="display mt-4 text-[clamp(1.6rem,2.6vw,2.4rem)] !leading-[1]">Service due is a paper too.</h3>
                <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-paper/80">
                  Service schedules, job cards and an in-workshop status that guards dispatch, so a vehicle on the lift
                  isn't sent out by mistake.
                </p>
              </div>
            </SpotCard>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-3">
            <SpotCard>
              <Tag icon="route">One-save trips</Tag>
              <Title>Save once. Three books update.</Title>
              <Body>Close a trip and the trip record, fuel log and driver account update together, or not at all.</Body>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="What one save updates">
                {[
                  ["route", "Trips"],
                  ["fuel", "Fuel log"],
                  ["user", "Driver account"],
                ].map(([i, t]) => (
                  <li key={t} className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-2 text-sm font-semibold text-paper">
                    <Icon name={i as IconName} size={15} className="text-lime" />
                    {t}
                  </li>
                ))}
              </ul>
            </SpotCard>
          </Reveal>

          <Reveal className="lg:col-span-2">
            <SpotCard>
              <Tag icon="user">Driver licences</Tag>
              <Title>Flagged 30 days ahead.</Title>
              <Body>Licences sit beside vehicle papers, so a lapsed one never surprises a dispatch.</Body>
            </SpotCard>
          </Reveal>
          <Reveal delay={60} className="lg:col-span-2">
            <SpotCard>
              <Tag icon="key">Roles &amp; overrides</Tag>
              <Title>In-charge renews. Owner overrides.</Title>
              <Body>Release from hold needs a renewed paper, or an owner's reason on record.</Body>
            </SpotCard>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-2">
            <SpotCard>
              <Tag icon="book">Audit trail</Tag>
              <Title>Who, when, why.</Title>
              <Body>Every exception is a row: the name, the role, the time and the reason in their own words.</Body>
            </SpotCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
