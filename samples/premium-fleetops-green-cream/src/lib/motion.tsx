import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MotionCtx = {
  motionOn: boolean;
  setMotionOn: (v: boolean) => void;
  toggle: () => void;
};

const Ctx = createContext<MotionCtx>({
  motionOn: true,
  setMotionOn: () => {},
  toggle: () => {},
});

export function MotionProvider({ children }: { children: ReactNode }) {
  const [motionOn, setMotionOn] = useState(true);

  // Respect prefers-reduced-motion on first load
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setMotionOn(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("no-motion", !motionOn);
  }, [motionOn]);

  const value = useMemo(
    () => ({ motionOn, setMotionOn, toggle: () => setMotionOn(!motionOn) }),
    [motionOn],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useMotionPref = () => useContext(Ctx);
