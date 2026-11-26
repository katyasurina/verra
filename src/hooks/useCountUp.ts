import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";

/** Counts from 0 to `to` with an exponential ease-out once `active` becomes true. */
export function useCountUp(to: number, active: boolean, delay: number, duration = 2200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion()) {
      setValue(to);
      return;
    }
    let raf = 0;
    const timer = window.setTimeout(() => {
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / duration);
        setValue(Math.round(to * (k === 1 ? 1 : 1 - Math.pow(2, -10 * k))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, active, delay, duration]);

  return value;
}
