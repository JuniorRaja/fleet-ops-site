import { Logo } from "./Logo";
import { useMotionPref } from "../lib/motion";
import { NAV, WHATSAPP_LINK, EMAIL_LINK, APP_URL } from "../lib/constants";

const COLS = [
  {
    title: "Product",
    links: NAV,
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#top" },
      { label: "Testimonials", href: "#benefits" },
      { label: "Benefits", href: "#benefits" },
      { label: "Book a demo", href: WHATSAPP_LINK },
    ],
  },
];

export function Footer() {
  const { motionOn, toggle } = useMotionPref();

  return (
    <footer className="relative mt-10 border-t border-ink/10 bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/55">
              Compliance and maintenance software for fleets — lorries, trailers
              and buses. Keep every vehicle road-legal and serviced.
            </p>
            <a
              href={APP_URL}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Open the app
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 8h9m0 0L8 4m4 4l-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold text-ink">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-ink/55 transition hover:text-brand-700">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-sm font-semibold text-ink">Contact</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="text-sm text-ink/55 transition hover:text-brand-700">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={EMAIL_LINK} className="text-sm text-ink/55 transition hover:text-brand-700">
                  {"{{DEMO_EMAIL}}"}
                </a>
              </li>
            </ul>

            {/* Motion switch */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium text-ink/70">Motion</span>
              <button
                role="switch"
                aria-checked={motionOn}
                aria-label="Toggle animations"
                onClick={toggle}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${motionOn ? "bg-brand-600" : "bg-ink/20"}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${motionOn ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
              <span className="text-xs text-ink/45">{motionOn ? "On" : "Off"}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-6 sm:flex-row">
          <p className="text-xs text-ink/45">
            © {new Date().getFullYear()} {"{{COMPANY_NAME}}"}. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-ink/45">
            <a href="#top" className="hover:text-brand-700">Privacy</a>
            <a href="#top" className="hover:text-brand-700">Terms</a>
            <a href="#top" className="hover:text-brand-700">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
