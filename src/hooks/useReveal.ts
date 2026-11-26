import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, shouldSkipStagger } from "../lib/motion";

interface Options {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Fires once when the element approaches the viewport.
 * Returns a ref and the class string ("in" / "in fast") that the CSS entrances key off.
 * "fast" is added after a quick scroll/jump so the staggered entrance is skipped instead of leaving blank space.
 */
export function useReveal<T extends HTMLElement>({ threshold = 0.05, rootMargin = "0px 0px 6% 0px" }: Options = {}) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<"" | "in" | "in fast">("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setState("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setState(shouldSkipStagger(el) ? "in fast" : "in");
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return [ref, state] as const;
}
