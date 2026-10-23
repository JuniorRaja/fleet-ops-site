import {useEffect, useState} from 'react';

/**
 * True when the visitor asked for less motion — either in their OS settings
 * or with the "Motion: off" switch in the footer (kept in localStorage).
 * When true, pinned scenes stop pinning and show their final state.
 */

const QUERY = '(prefers-reduced-motion: reduce)';
const KEY = 'fleetops-motion';
const EVENT = 'fleetops-motion-change';

function stored(): boolean {
  try {
    return localStorage.getItem(KEY) === 'off';
  } catch {
    return false;
  }
}

function read(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(QUERY).matches || stored();
}

export function setMotionOff(off: boolean) {
  try {
    if (off) localStorage.setItem(KEY, 'off');
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked: the switch still works for this visit */
  }
  window.dispatchEvent(new CustomEvent(EVENT, {detail: off}));
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(read);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e?: Event) => {
      const forced = e instanceof CustomEvent ? Boolean(e.detail) : stored();
      setReduced(mq.matches || forced);
    };
    mq.addEventListener('change', onChange);
    window.addEventListener(EVENT, onChange);
    return () => {
      mq.removeEventListener('change', onChange);
      window.removeEventListener(EVENT, onChange);
    };
  }, []);

  return reduced;
}
