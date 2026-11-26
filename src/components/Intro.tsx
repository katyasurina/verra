import { useEffect, useRef, useState } from "react";

const LETTERS = ["v", "e", "r", "r", "a"];
const SCAN_START = 0.45; // s
const SCAN_DURATION = 1.15; // s
const MIN_MS = 2700;
const MAX_MS = 7000;
const RISE_MS = 1500;

/**
 * Black-screen intro: a light scan reveals the "verra" wordmark, then the hero rises from the bottom.
 * Driven by classes on <html> (i0 → i1 → i2) that the CSS in 07-intro.css reacts to.
 * Click or Esc skips ahead. Not rendered at all when the user prefers reduced motion.
 */
export function Intro() {
  const root = document.documentElement;
  const [active, setActive] = useState(() => root.classList.contains("i0"));
  const pre = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const scan = useRef<HTMLSpanElement>(null);
  const skip = useRef(false);

  useEffect(() => {
    if (!root.classList.contains("i0")) return;
    const preEl = pre.current, wordEl = word.current, scanEl = scan.current;
    const video = document.getElementById("hv") as HTMLVideoElement | null;
    if (!preEl || !wordEl || !scanEl) return;
    const letters = Array.from(wordEl.querySelectorAll<HTMLElement>(".l"));
    const timers: number[] = [];
    let raf = 0;
    let t0 = 0;
    let risen = false;
    let stopped = false;

    const ready = () => !video || video.readyState >= 3;

    const rise = () => {
      if (risen) return;
      risen = true;
      letters.forEach((l) => {
        l.style.animation = "none";
        l.style.opacity = "1";
        l.style.filter = "none";
        l.style.transform = "none";
      });
      scanEl.style.display = "none";
      preEl.classList.add("leave");
      const b = skip.current ? 0 : 350;
      timers.push(window.setTimeout(() => root.classList.add("i1"), b));
      timers.push(window.setTimeout(() => root.classList.add("i2"), b + 1050));
      timers.push(window.setTimeout(() => preEl.classList.add("out"), b + RISE_MS * 0.62));
      timers.push(window.setTimeout(() => setActive(false), b + RISE_MS + 700));
      timers.push(
        window.setTimeout(() => {
          root.classList.remove("i0", "i1", "i2");
          window.scrollTo(0, 0);
          window.dispatchEvent(new Event("verra:intro-done"));
        }, b + 1050 + 3000),
      );
    };

    const tick = (now: number) => {
      if (stopped) return;
      const t = now - t0;
      if (!risen && (skip.current || (t >= MIN_MS && (ready() || t >= MAX_MS)))) {
        rise();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const plan = () => {
      const w = wordEl.getBoundingClientRect();
      wordEl.style.setProperty("--w", w.width + "px");
      wordEl.style.setProperty("--ss", SCAN_START + "s");
      wordEl.style.setProperty("--sd", SCAN_DURATION + "s");
      letters.forEach((l) => {
        const r = l.getBoundingClientRect();
        const f = Math.max(0, Math.min(1, (r.left + r.width * 0.35 - w.left) / w.width));
        l.style.setProperty("--dl", (SCAN_START + f * SCAN_DURATION - 0.05).toFixed(3) + "s");
      });
      preEl.classList.add("go");
      t0 = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip.current = true;
    };
    window.addEventListener("keydown", onKey);

    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fonts, new Promise((r) => window.setTimeout(r, 2500))]).then(() => {
      if (!stopped) requestAnimationFrame(plan);
    });

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!active) return null;
  return (
    <div className="pre" ref={pre} aria-hidden="true" onClick={() => (skip.current = true)}>
      <div className="word" ref={word}>
        <span className="scan" ref={scan} />
        {LETTERS.map((l, i) => (
          <span className="l" key={i}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
