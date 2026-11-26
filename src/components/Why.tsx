import { useEffect } from "react";
import { reasons } from "../data/content";
import { photo } from "../data/media";
import { useReveal } from "../hooks/useReveal";
import { useRiser } from "../hooks/useRiser";
import { vars } from "../lib/css";
import { useT } from "../lib/i18n";
import { clamp, prefersReducedMotion } from "../lib/motion";
import { navigate } from "../lib/router";
import { Photo } from "./Photo";

export function Why() {
  const t = useT();
  const [ref, reveal] = useReveal<HTMLElement>({ threshold: 0.08, rootMargin: "0px 0px 6% 0px" });
  useRiser(ref, 0.92, 5);

  // gentle parallax on the photo
  useEffect(() => {
    const sec = ref.current;
    const img = sec?.querySelector<HTMLElement>(".ph");
    if (!sec || !img || prefersReducedMotion() || matchMedia("(max-width:860px),(pointer:coarse)").matches) return;
    let tick = 0;
    const update = () => {
      tick = 0;
      const r = sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const p = clamp((r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight, -1, 1);
      img.style.transform = `translate3d(0,${(p * -40).toFixed(1)}px,0)`;
    };
    const onScroll = () => {
      if (!tick) tick = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(tick);
    };
  }, [ref]);

  return (
    <section className={`phil ${reveal}`} id="why" ref={ref}>
      <Photo tone="t4" src={photo.why} position="70% center" label={t("Sculptural plaster house at dusk")} />
      <h2>
        <span className="ln" style={vars({ "--i": 0 })}><i>why</i></span>
        <span className="ln" style={vars({ "--i": 1 })}><i>verra</i></span>
        <span className="ln b" style={vars({ "--i": 2 })}><i>estates</i></span>
      </h2>
      <a className="badge" href="/catalog" onClick={(e) => { e.preventDefault(); navigate("/catalog"); }} aria-label={t("View residences")}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <path id="bc" d="M60 60m-47 0a47 47 0 1 1 94 0a47 47 0 1 1 -94 0" />
          </defs>
          <text>
            <textPath href="#bc" textLength="292" lengthAdjust="spacing">
              quiet by design · verra estates ·{" "}
            </textPath>
          </text>
        </svg>
        <i>↓</i>
      </a>
      <ul className="why">
        {reasons.map((r, i) => (
          <li key={r.title} style={vars({ "--i": i })}>
            <strong>{t(r.title)}</strong>
            {t(r.text)}
          </li>
        ))}
      </ul>
    </section>
  );
}
