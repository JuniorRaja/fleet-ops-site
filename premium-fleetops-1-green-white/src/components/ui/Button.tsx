import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Icon, type IconName } from "./Icons";

type Variant = "primary" | "brand" | "ghost" | "light" | "ghostDark";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-paper [--sweep:var(--color-lime)] hover:text-ink focus-visible:text-ink",
  brand: "bg-brand text-white [--sweep:var(--color-ink)]",
  ghost:
    "border border-ink/25 text-ink [--sweep:var(--color-ink)] hover:text-paper focus-visible:text-paper hover:border-ink",
  light: "bg-paper text-ink [--sweep:var(--color-lime)]",
  ghostDark:
    "border border-paper/30 text-paper [--sweep:var(--color-paper)] hover:text-ink focus-visible:text-ink hover:border-paper",
};

interface Common {
  variant?: Variant;
  icon?: IconName | null;
  children: ReactNode;
  className?: string;
  cursor?: string;
}

type LinkProps = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">;
type BtnProps = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button(props: LinkProps | BtnProps) {
  const { variant = "primary", icon = "arrow-right", children, className, cursor, ...rest } = props;
  const cls = cn(
    "btn group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[15px] font-semibold leading-none whitespace-nowrap",
    VARIANTS[variant],
    className
  );
  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <Icon
          name={icon}
          size={18}
          className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-px"
        />
      )}
    </>
  );

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as Omit<LinkProps, keyof Common>;
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={cls}
        data-cursor={cursor}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...anchorRest}
      >
        {inner}
      </a>
    );
  }
  const btnRest = rest as Omit<BtnProps, keyof Common>;
  return (
    <button type="button" className={cls} data-cursor={cursor} {...btnRest}>
      {inner}
    </button>
  );
}
