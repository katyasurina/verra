import { useEffect, type RefObject } from "react";
import { clamp, easeOutCubic, prefersReducedMotion } from "../lib/motion";

export interface LensRefs {
  hero: RefObject<HTMLElement | null>;
  video: RefObject<HTMLVideoElement | null>;
  lens: RefObject<HTMLDivElement | null>;
  ring: RefObject<HTMLDivElement | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
  echo: RefObject<HTMLDivElement | null>;
}

const OVERSCAN = 24;

/**
 * Hover "lens" over the hero video: a clipped circle that redraws the video region under the pointer
 * on a canvas, plus an outlined echo of the wordmark. Also plays a short demo on load, supports touch,
 * pauses when off-screen and restarts its demo after the intro finishes ("verra:intro-done").
 */
export function useHeroLens({ hero, video, lens, ring, canvas, echo }: LensRefs): void {
  useEffect(() => {
    const h = hero.current, v = video.current, ln = lens.current, rg = ring.current, cv = canvas.current, ec = echo.current;
    const ctx = cv?.getContext("2d");
    if (!h || !v || !ln || !rg || !cv || !ec || !ctx) return;

    const rm = prefersReducedMotion();
    let W = 0, H = 0, D = 0, R = 0, dpr = 1, cx = 0, cy = 0, px = 0, py = 0, e = 0;
    let want = false, touch = false, hold = 0, demo = !rm, used = false, last = 0, raf = 0, live = true;
    let t0 = performance.now();

    const size = () => {
      const r = h.getBoundingClientRect();
      const mobile = r.width < 860;
      W = r.width;
      H = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      D = Math.round(mobile ? 188 : Math.max(240, Math.min(W * 0.156, 325)));
      R = D / 2;
      for (const el of [ln, rg]) {
        el.style.width = D + "px";
        el.style.height = D + "px";
      }
      cv.width = Math.round(D * dpr);
      cv.height = Math.round(D * dpr);
      ec.style.width = W + "px";
      ec.style.height = H + "px";
      if (!px) {
        px = cx = W * 0.62;
        py = cy = H * 0.5;
      }
    };

    const draw = () => {
      const k = easeOutCubic(e);
      const X = Math.round((cx - R) * dpr) / dpr;
      const Y = Math.round((cy - R) * dpr) / dpr;
      ln.style.transform = `translate3d(${X}px,${Y}px,0)`;
      ln.style.clipPath = `circle(${(R * k).toFixed(1)}px at 50% 50%)`;
      rg.style.transform = `translate3d(${X}px,${Y}px,0) scale(${k.toFixed(3)})`;
      ec.style.transform = `translate3d(${-X}px,${-Y}px,0)`;
      if (k > 0 && v.readyState >= 2 && v.videoWidth) {
        const vw = v.videoWidth, vh = v.videoHeight;
        const RW = W + 2 * OVERSCAN, RH = H + 2 * OVERSCAN;
        const s = Math.max(RW / vw, RH / vh);
        const ox = (RW - vw * s) / 2, oy = (RH - vh * s) / 2;
        ctx.drawImage(v, (X + OVERSCAN - ox) / s, (Y + OVERSCAN - oy) / s, D / s, D / s, 0, 0, cv.width, cv.height);
      }
    };

    const tick = (now: number) => {
      raf = 0;
      if (!live) return;
      const dt = Math.min(50, now - (last || now));
      last = now;
      if (demo && !used) {
        want = now - t0 > 700 && now - t0 < 2900;
        px = W * 0.62;
        py = H * 0.52;
      } else if (touch && hold && now > hold) {
        want = false;
        hold = 0;
      }
      e = clamp(e + (want ? dt : -dt) / 320, 0, 1);
      const k = 1 - Math.exp(-dt / 38);
      cx += (px - cx) * k;
      cy += (py - cy) * k;
      draw();
      if (e > 0 || want || (demo && !used && now - t0 < 3200)) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const run = () => {
      if (!raf && live) raf = requestAnimationFrame(tick);
    };

    const move = (ev: PointerEvent) => {
      const r = h.getBoundingClientRect();
      const over = (ev.target as Element | null)?.closest?.(".nav,.search,.mmenu");
      touch = ev.pointerType === "touch";
      used = true;
      px = ev.clientX - r.left;
      py = ev.clientY - r.top - (touch ? R * 1.15 : 0);
      want = !over;
      if (touch) hold = performance.now() + 1100;
      if (!raf && !want && e === 0) return;
      run();
    };
    const leave = () => {
      want = false;
      run();
    };
    const up = (ev: PointerEvent) => {
      if (ev.pointerType === "touch") {
        hold = performance.now() + 900;
        run();
      }
    };
    const onResize = () => {
      size();
      draw();
    };
    const onVisibility = () => {
      live = !document.hidden;
      if (live) run();
    };
    const restartDemo = () => {
      t0 = performance.now();
      used = false;
      run();
    };

    size();
    draw();
    window.addEventListener("resize", onResize);
    h.addEventListener("pointermove", move);
    h.addEventListener("pointerdown", move);
    h.addEventListener("pointerleave", leave);
    h.addEventListener("pointerup", up);
    v.addEventListener("loadeddata", draw);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("verra:intro-done", restartDemo);

    const io = new IntersectionObserver(
      ([en]) => {
        live = en.isIntersecting && !document.hidden;
        if (live) {
          v.play().catch(() => {});
          run();
        } else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(h);
    v.play().catch(() => {});
    run();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      h.removeEventListener("pointermove", move);
      h.removeEventListener("pointerdown", move);
      h.removeEventListener("pointerleave", leave);
      h.removeEventListener("pointerup", up);
      v.removeEventListener("loadeddata", draw);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("verra:intro-done", restartDemo);
    };
  }, [hero, video, lens, ring, canvas, echo]);
}
