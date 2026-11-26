import { createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

interface PhotoProps {
  src: string;
  /** gradient placeholder tone (t2…t5) shown until the photo has loaded */
  tone: string;
  label: string;
  /** CSS background-position */
  position?: string;
  className?: string;
  as?: "div" | "figure";
  /** load immediately instead of lazily */
  eager?: boolean;
  children?: ReactNode;
}

/**
 * Background photo with a gradient placeholder and lazy loading.
 * Loads ~1800px before it enters the viewport and always within 6 s, so fast scrolling never shows blanks for long.
 */
export function Photo({ src, tone, label, position, className = "", as = "div", eager = false, children }: PhotoProps) {
  const ref = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      const im = new Image();
      im.onload = () => !cancelled && setLoaded(true);
      im.src = src;
    };
    if (eager || !ref.current || !("IntersectionObserver" in window)) {
      load();
      return () => {
        cancelled = true;
      };
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "1800px 0px" },
    );
    io.observe(ref.current);
    const fallback = window.setTimeout(() => {
      io.disconnect();
      load();
    }, 6000);
    return () => {
      cancelled = true;
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [src, eager]);

  const style = { ...(position ? { "--bp": position } : {}), ...(loaded ? { "--img": `url(${src})` } : {}) } as CSSProperties;

  return createElement(
    as,
    { ref, className: `ph ${tone} ${className} ${loaded ? "img" : ""}`.replace(/\s+/g, " ").trim(), style, ...(children ? {} : { role: "img", "aria-label": label }) },
    children,
  );
}
