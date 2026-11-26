import { articles } from "../../data/journal";
import { useLang, useT } from "../../lib/i18n";
import { usePageMeta } from "../../lib/meta";
import { Link } from "../../lib/router";
import { Photo } from "../Photo";
import { PageShell } from "./PageShell";

export const formatDate = (iso: string, lang: "en" | "ua"): string =>
  new Date(iso + "T12:00:00").toLocaleDateString(lang === "ua" ? "uk-UA" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

export function JournalPage() {
  const t = useT();
  const lang = useLang();
  usePageMeta(`${t("Journal")} — Verra Estates`, t("Short guides to buying and living in Kyiv, Koncha-Zaspa, Kozyn and Odesa."));
  return (
    <PageShell>
      <div className="sec-h">
        <h2>
          {t("the")}
          <br />
          <b>{t("journal")}</b>
        </h2>
      </div>
      <div className="grid">
        {articles.map((a) => (
          <Link key={a.slug} to={`/journal/${a.slug}`} className="card acard">
            <Photo tone="t3" src={a.image} position={a.position} label={a.title[lang]} eager />
            <div className="meta">
              <div>
                <h3>{a.title[lang]}</h3>
                <span>
                  {formatDate(a.date, lang)} · {a.minutes} {t("min read")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
