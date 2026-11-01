declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
  }
}

/** Umami custom event. No-op when the script is blocked, offline, or not yet loaded. */
export function track(name: string, data?: Record<string, unknown>) {
  window.umami?.track(name, data);
}
