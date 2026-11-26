import { contact } from "../data/content";
import { useReveal } from "../hooks/useReveal";
import { useRiser } from "../hooks/useRiser";
import { useT } from "../lib/i18n";

const MARQUEE = "Pechersk — Lypky — Podil — Koncha-Zaspa — Kozyn — Odesa — ";

export function Contact({ onRequest }: { onRequest: () => void }) {
  const t = useT();
  const [ref, reveal] = useReveal<HTMLElement>({ threshold: 0, rootMargin: "0px 0px 6% 0px" });
  useRiser(ref, 0.95, 3);

  return (
    <section className={`cta ${reveal}`} id="contact" ref={ref}>
      <h2>
        {t("find your")}<b>{t("address")}</b>
      </h2>
      <div className="row">
        <p>{t("Tell us what you are looking for. An advisor replies within one working day with a shortlist.")}</p>
        <div className="acts">
          <a
            className="btn"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onRequest();
            }}
          >
            {t("Request a private viewing")} <i>↗</i>
          </a>
          <a className="tel" href={contact.phoneHref}>
            {contact.phone}
          </a>
        </div>
      </div>
      <div className="marq" aria-hidden="true">
        <div>{MARQUEE + MARQUEE}</div>
      </div>
    </section>
  );
}
