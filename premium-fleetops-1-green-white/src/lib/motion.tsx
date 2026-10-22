import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

function useMedia(query: string): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

interface MotionState {
  /** user-facing "Motion: on/off" (defaults to the OS preference) */
  motion: boolean;
  setMotion: (v: boolean) => void;
  reducedPref: boolean;
  desktop: boolean;
  fine: boolean;
  /** pinned scenes + 3D + smooth scroll are only for desktop with motion on */
  pin: boolean;
}

const Ctx = createContext<MotionState>({
  motion: true,
  setMotion: () => {},
  reducedPref: false,
  desktop: true,
  fine: true,
  pin: true,
});

const KEY = "fleetops-motion";

export function MotionProvider({ children }: { children: ReactNode }) {
  const reducedPref = useMedia("(prefers-reduced-motion: reduce)");
  const desktop = useMedia("(min-width: 1024px) and (min-height: 700px)");
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  const [override, setOverride] = useState<boolean | null>(() => {
    try {
      const v = localStorage.getItem(KEY);
      return v === "on" ? true : v === "off" ? false : null;
    } catch {
      return null;
    }
  });

  const motion = override ?? !reducedPref;

  useLayoutEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
  }, [motion]);

  const setMotion = useCallback((v: boolean) => {
    setOverride(v);
    try {
      localStorage.setItem(KEY, v ? "on" : "off");
    } catch {
      /* storage can be blocked */
    }
  }, []);

  const value = useMemo<MotionState>(
    () => ({ motion, setMotion, reducedPref, desktop, fine, pin: motion && desktop }),
    [motion, setMotion, reducedPref, desktop, fine]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useMotion = () => useContext(Ctx);
