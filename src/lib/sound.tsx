import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { bindUISFX, type CueName, type UISFXBinding } from "uisfx";

interface SoundState {
  enabled: boolean;
  setEnabled: (enabled: boolean) => Promise<void>;
  play: (cue: CueName) => void;
}

const SoundContext = createContext<SoundState | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const binding = useRef<UISFXBinding | null>(null);
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    const next = bindUISFX(document, {
      pack: "organic",
      volume: 0.42,
      enabled: false,
      preferences: { key: "fleetops:sound" },
    });
    binding.current = next;
    setEnabledState(next.player.isEnabled());
    return () => {
      next.unbind();
      void next.player.destroy();
      binding.current = null;
    };
  }, []);

  const setEnabled = async (value: boolean) => {
    const player = binding.current?.player;
    if (!player) return;
    player.setEnabled(value);
    setEnabledState(value);
    if (value && (await player.unlock())) player.play("toggle-on");
  };

  const play = useCallback((cue: CueName) => {
    binding.current?.player.play(cue);
  }, []);

  return <SoundContext.Provider value={{ enabled, setEnabled, play }}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const value = useContext(SoundContext);
  if (!value) throw new Error("useSound must be used inside SoundProvider");
  return value;
}
