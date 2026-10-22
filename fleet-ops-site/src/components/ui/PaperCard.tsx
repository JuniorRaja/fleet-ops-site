import type { CSSProperties } from "react";
import type { DocId } from "@/lib/fleet";
import { cn } from "@/utils/cn";

export interface PaperDoc {
  id: DocId;
  short: string;
  title: string;
  form: string;
  /** Asset slot id: drop a real scan in later and keep the layer structure. */
  code: string;
  color: string;
  valid: string;
}

export const PAPER_DOCS: PaperDoc[] = [
  { id: "fitness", short: "Fitness", title: "Fitness Certificate", form: "Form 38", code: "PAPER-DOC-FIT-01", color: "#087a4d", valid: "03/27" },
  { id: "insurance", short: "Insurance", title: "Insurance Policy", form: "Commercial vehicle", code: "PAPER-DOC-INS-01", color: "#3a45a8", valid: "11/26" },
  { id: "puc", short: "PUC", title: "Pollution Under Control", form: "Emission test", code: "PAPER-DOC-PUC-01", color: "#5d7a14", valid: "04/27" },
  { id: "permit", short: "Permit", title: "National Permit", form: "Goods carriage", code: "PAPER-DOC-PER-01", color: "#a2501a", valid: "08/27" },
  { id: "rc", short: "RC", title: "Registration Certificate", form: "Form 23", code: "PAPER-DOC-RC-01", color: "#37465a", valid: "01/31" },
  { id: "tax", short: "Road tax", title: "Road Tax Receipt", form: "State transport", code: "PAPER-DOC-TAX-01", color: "#7b2f66", valid: "12/26" },
];

/** A paper cutout. Fixed 148 × 196 so scenes can scale it precisely. */
export function PaperCard({ doc, className, style }: { doc: PaperDoc; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={cn("relative h-[196px] w-[148px] overflow-hidden rounded-[4px] bg-[#fbfaf6] text-ink", className)}
      style={style}
      data-asset={doc.code}
    >
      <div className="px-3 pb-2.5 pt-3" style={{ background: doc.color }}>
        <p className="font-mono text-[7px] font-medium uppercase tracking-[0.16em] text-white/75">{doc.form}</p>
        <p className="mt-1 font-display text-[15px] font-bold leading-[1.02] tracking-tight text-white">{doc.title}</p>
      </div>
      <div className="space-y-[5px] px-3 pt-3.5">
        {[88, 72, 94, 60, 80, 46].map((w, i) => (
          <div key={i} className="h-[3px] rounded-full bg-ink/10" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div
        className="absolute bottom-[34px] right-3 grid size-[46px] -rotate-12 place-items-center rounded-full border-2 text-center font-mono text-[6px] font-bold uppercase leading-[1.25] tracking-wider opacity-85"
        style={{ borderColor: doc.color, color: doc.color }}
      >
        <span>
          Valid
          <br />
          till
          <br />
          {doc.valid}
        </span>
      </div>
      <p className="absolute inset-x-3 bottom-2.5 font-mono text-[6.5px] tracking-[0.1em] text-ink/55">{doc.code}</p>
    </div>
  );
}
