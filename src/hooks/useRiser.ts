import { useEffect, type RefObject } from "react";
import { clamp, prefersReducedMotion, smoothstep } from "../lib/motion";

/**
 * Makes a section "rise" over the previous one: a smoothed, scroll-linked translate + scale.
 * The value eases toward the scroll position every frame, so wheel steps never look jerky.
 */
export function useRiser(ref: RefObject<HTMLElement | null>, startScale: number, lift: number): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || matchMedia("(max-width:860px),(pointer:coarse)").matches) return;

    let cur = -1;
    let raf = 0;
    const target = () => clamp((window.innerHeight - el.getBoundingClientRect().top) / (window.innerHeight * 1.05), 0, 1);
    const paint = () => {
      const e = smoothstep(cur);
      el.style.transform = `translate3d(0,${((1 - e) * lift).toFixed(3)}vh,0) scale(${(startScale + (1 - startScale) * e).toFixed(4)})`;
    };
    const loop = () => {
      const tgt = target();
      if (cur < 0) cur = tgt;
      cur += (tgt - cur) * 0.085;
      if (Math.abs(tgt - cur) < 0.0008) cur = tgt;
      paint();
      raf = cur === tgt ? 0 : requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    loop();
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [ref, startScale, lift]);
}
