import { Fragment, useRef } from "react";
import { locations, testimonials } from "../data/content";
import { useReveal } from "../hooks/useReveal";
import { useRiser } from "../hooks/useRiser";
import { vars } from "../lib/css";
import { useT } from "../lib/i18n";
import { properties } from "../data/properties";
import { Photo } from "./Photo";

function Words({ text }: { text: string }) {
  const words = text.split(/\s+/);
  return (
    <>
      {words.map((w, k) => (
        <Fragment key={k}>
          <span className="tw" style={vars({ "--n": k })}>{w}</span>
          {k < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export function Locations({ onPick }: { onPick: (location: string) => void }) {
  const t = useT();
  const sheet = useRef<HTMLDivElement>(null);
  const [locRef, locState] = useReveal<HTMLElement>({ threshold: 0, rootMargin: "0px 0px 6% 0px" });
  const [tesRef, tesState] = useReveal<HTMLDivElement>({ threshold: 0, rootMargin: "0px 0px 6% 0px" });
  useRiser(sheet, 0.94, 4);

  return (
    <div className="wrap propsheet lsheet" id="lsheet" ref={sheet}>
      <section className={`locs ${locState}`} id="locs" ref={locRef}>
        <div className="sec-h">
          <h2>
            {t("six")}
            <br />
            <b>{t("addresses")}</b>
          </h2>
        </div>
        <div className="lrow">
          {locations.map((l, n) => (
            <a
              key={l.name}
              href="#props"
              style={vars({ "--n": n })}
              onClick={(e) => {
                e.preventDefault();
                onPick(l.name);
              }}
            >
              <Photo tone="t2" src={l.image} position={l.position} label={t(l.alt)} />
              <strong>{t(l.name)}</strong>
              <span>
                {t(l.note)} · {properties.filter((p) => p.location.startsWith(l.name)).length} {t("homes")}
              </span>
            </a>
          ))}
        </div>

        <div className={`tes ${tesState}`} ref={tesRef}>
          <div className="sec-h">
            <h2>
              {t("what")}
              <br />
              <b>{t("clients say")}</b>
            </h2>
          </div>
          <div className="tgrid">
            {testimonials.map((q, b) => (
              <blockquote key={q.author} style={vars({ "--b": b, "--tr": `${q.tilt}deg` })}>
                <span className="num">{String(b + 1).padStart(2, "0")}</span>
                <p>
                  <Words text={t(q.quote)} />
                </p>
                <cite>
                  {q.author}
                  <small>{q.home}</small>
                </cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
