import { Fragment } from "react";
import { stats } from "../data/content";
import { photo } from "../data/media";
import { useCountUp } from "../hooks/useCountUp";
import { useReveal } from "../hooks/useReveal";
import { vars } from "../lib/css";
import { useLang, useT } from "../lib/i18n";
import { Photo } from "./Photo";

type Word = { text: string; em?: boolean } | { pill: "a" | "b" };

const HEADLINE: Word[] = [
  { text: "We", em: true },
  { text: "represent", em: true },
  { pill: "a" },
  { text: "homes" },
  { text: "where" },
  { text: "architecture," },
  { pill: "b" },
  { text: "light" },
  { text: "and" },
  { text: "landscape" },
  { text: "meet" },
  { text: "in" },
  { text: "balance." },
];

function Stat({ to, pre = "", suf = "", label, active, delay, index }: { to: number; pre?: string; suf?: string; label: string; active: boolean; delay: number; index: number }) {
  const value = useCountUp(to, active, delay);
  return (
    <div style={vars({ "--k": index })}>
      <strong>
        {pre}
        {value}
        {suf}
      </strong>
      <small>{label}</small>
    </div>
  );
}

const HEADLINE_UA: Word[] = [
  { text: "Ми", em: true },
  { text: "представляємо", em: true },
  { pill: "a" },
  { text: "домівки," },
  { text: "де" },
  { text: "архітектура," },
  { pill: "b" },
  { text: "світло" },
  { text: "і" },
  { text: "ландшафт" },
  { text: "у" },
  { text: "гармонії." },
];

export function About() {
  const t = useT();
  const lang = useLang();
  const HEAD = lang === "ua" ? HEADLINE_UA : HEADLINE;
  const [ref, reveal] = useReveal<HTMLElement>({ threshold: 0.04, rootMargin: "0px 0px 8% 0px" });
  const delay = reveal === "in fast" ? 500 : 2200;

  return (
    <section className={`sheet ${reveal}`} id="about" ref={ref} aria-label={t("About Verra")}>
      <div className="sh-in">
        <div className="sh-top">
          <span className="ln" />
          <span>(01) {t("About Verra")}</span>
          <span>{t("Est. 2012 — Kyiv")}</span>
        </div>
        <h2 className="sh-h">
          {HEAD.map((w, n) => (
            <Fragment key={n}>
              {"pill" in w ? (
                <span className={`pill${w.pill === "b" ? " p2" : ""}`} style={vars({ "--n": n })} />
              ) : (
                <span className={`w${w.em ? " em" : ""}`}>
                  <i style={vars({ "--n": n })}>{w.text}</i>
                </span>
              )}
              {n < HEAD.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h2>
        <div className="sh-grid">
          <Photo as="figure" className="sh-a" tone="t3" src={photo.about1} position="50% 60%" label={t("Contemporary house at dusk")}>
            <figcaption className="glass">Aurel House · Kyiv</figcaption>
          </Photo>
          <Photo as="figure" className="sh-b" tone="t4" src={photo.about2} position="50% 55%" label={t("Living room opening onto a terrace")} />
          <svg className="sh-badge" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="bp2" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
            </defs>
            <text>
              <textPath href="#bp2" startOffset="0">
                Verra Estates · Since 2012 · Kyiv ·
              </textPath>
            </text>
            <circle cx="60" cy="60" r="4" />
          </svg>
          <p className="sh-p">{t("A boutique agency founded in Kyiv in 2012. We choose homes for how they are built, not only where they stand.")}</p>
        </div>
        <div className="sh-nums" aria-label={t("Agency in numbers")}>
          {stats.map((s, i) => (
            <Stat key={s.label} {...s} label={t(s.label)} index={i} active={reveal !== ""} delay={delay} />
          ))}
        </div>
        <div className="sh-ghost" aria-hidden="true">
          {"verra".split("").map((l, i) => (
            <span key={i} style={vars({ "--k": i })}>
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
