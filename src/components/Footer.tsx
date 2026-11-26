import { Fragment } from "react";
import { contact } from "../data/content";
import { useReveal } from "../hooks/useReveal";
import { useRiser } from "../hooks/useRiser";
import { vars } from "../lib/css";
import { useT } from "../lib/i18n";
import { Link } from "../lib/router";

const Letters = ({ text, from }: { text: string; from: number }) => (
  <>
    {text.split("").map((ch, i) => (
      <i key={i} style={vars({ "--k": from + i })}>
        {ch}
      </i>
    ))}
  </>
);

export function Footer() {
  const t = useT();
  const [ref, reveal] = useReveal<HTMLElement>({ threshold: 0.05, rootMargin: "0px 0px 6% 0px" });
  useRiser(ref, 0.95, 3);

  const columns = [
    <Fragment key="o">
      <small>{t("Office")}</small>
      {contact.address[0]}
      <br />
      {contact.address[1]}
    </Fragment>,
    <Fragment key="c">
      <small>{t("Call")}</small>
      <a href={contact.phoneHref}>{contact.phone}</a>
      <br />
      {t(contact.hours)}
    </Fragment>,
    <Fragment key="w">
      <small>{t("Write")}</small>
      <a href={`mailto:${contact.email}`}>{contact.email}</a>
    </Fragment>,
    <Fragment key="f">
      <small>{t("Follow")}</small>
      {contact.socials.map((s, i) => (
        <Fragment key={s.label}>
          <a href={s.href} target="_blank" rel="noopener noreferrer">
            {s.label}
          </a>
          {i < contact.socials.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </Fragment>,
  ];

  return (
    <footer className={`foot ${reveal}`} ref={ref}>
      <div className="cols">
        {columns.map((c, i) => (
          <div key={i} style={vars({ "--k": i })}>
            {c}
          </div>
        ))}
      </div>
      <div className="legal">
        <span>© {new Date().getFullYear()} Verra Estates</span>
        <span className="flinks">
          <Link to="/catalog">{t("Properties")}</Link>
          <Link to="/journal">{t("Journal")}</Link>
          <Link to="/team">{t("Our team")}</Link>
          <Link to="/favorites">{t("Favorites")}</Link>
          <Link to="/compare">{t("Compare")}</Link>
          <Link to="/privacy">{t("Privacy policy")}</Link>
          <Link to="/terms">{t("Terms of use")}</Link>
        </span>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{t("Back to top")} ↑</a>
      </div>
      <div className="word" aria-hidden="true">
        <Letters text="verra" from={0} /> <span><Letters text="estates" from={5} /></span>
      </div>
    </footer>
  );
}
