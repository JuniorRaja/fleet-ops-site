import type { SVGProps } from "react";

const PATHS = {
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "arrow-up-right": "M7 17 17 7M8 7h9v9",
  "arrow-down": "M12 5v14M6 13l6 6 6-6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  menu: "M4 7h16M4 12h16M4 17h16",
  chat: "M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z",
  mail: "M4 6h16v12H4zM4 7.5l8 6 8-6",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  upload: "M12 16V4M7 9l5-5 5 5M5 20h14",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3ZM9 12l2 2 4-4",
  wrench:
    "M14.7 6.3a4 4 0 0 0-5 5L3.5 17.5l3 3 6.2-6.2a4 4 0 0 0 5-5l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5Z",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 17h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6",
  fuel: "M5 20V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15M3 20h13M14 9h2.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V8l-3-3M7 8h5",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0",
  file: "M7 3h7l5 5v13H7zM14 3v5h5",
  alert: "M12 4 3 20h18L12 4ZM12 10v4M12 17v.1",
  undo: "M4 12a8 8 0 1 0 3-6.2M4 4v5h5",
  bell: "M6 17v-6a6 6 0 1 1 12 0v6l2 2H4l2-2ZM10 21h4",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  key: "M15 9a4 4 0 1 0-3.5 4l.5.5V16h2v2h2v2h3v-3l-4.6-4.6A4 4 0 0 0 15 9Z",
  book: "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4ZM5 17a3 3 0 0 1 3-3h11",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18",
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name" | "stroke"> {
  name: IconName;
  size?: number;
  stroke?: number;
}

export function Icon({ name, size = 20, stroke = 1.8, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
