export const prefersReducedMotion = (): boolean =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion:reduce)").matches;

/* ---- scroll velocity (px per ms), used to skip slow entrances after a fast jump ---- */
let vel = 0;
let lastY = 0;
let lastT = 0;
let started = false;

export function startScrollVelocity(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  lastY = window.scrollY;
  lastT = performance.now();
  window.addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      vel = Math.max(Math.abs(window.scrollY - lastY) / dt, vel * 0.9);
      lastY = window.scrollY;
      lastT = now;
    },
    { passive: true },
  );
  window.setInterval(() => {
    vel *= 0.8;
  }, 120);
}

export const getVelocity = (): number => vel;

/** True when the user is scrolling very fast or the element is already well inside the viewport. */
export function shouldSkipStagger(el: Element): boolean {
  return vel > 2.6 || el.getBoundingClientRect().top < window.innerHeight * 0.28;
}

export const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
export const smoothstep = (p: number): number => p * p * (3 - 2 * p);
