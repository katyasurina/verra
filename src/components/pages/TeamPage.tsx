import { team } from "../../data/team";
import { useLang, useT } from "../../lib/i18n";
import { usePageMeta } from "../../lib/meta";
import { openInquiry } from "../../lib/store";
import { PageShell } from "./PageShell";

export function TeamPage() {
  const t = useT();
  const lang = useLang();
  usePageMeta(`${t("Our team")} — Verra Estates`, t("Meet the advisors of Verra Estates."));
  return (
    <PageShell>
      <div className="sec-h">
        <h2>
          {t("our")}
          <br />
          <b>{t("advisors")}</b>
        </h2>
      </div>
      <p className="pg-lead">{t("One advisor from the first viewing to the keys. Choose who you would like to work with.")}</p>
      <div className="team">
        {team.map((a) => (
          <article key={a.id} className="advisor">
            <div className="avatar" aria-hidden="true">
              {a.name
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </div>
            <h3>{a.name}</h3>
            <p className="role">{a.role[lang]}</p>
            <p className="area">{a.area[lang]}</p>
            <p>{a.bio[lang]}</p>
            <small>{a.languages}</small>
            <button type="button" className="btn" onClick={() => openInquiry({ title: `${t("Write to")} ${a.name}`, subtitle: a.role[lang], note: `${t("Advisor")}: ${a.name}` })}>
              {t("Write to this advisor")} <i>↗</i>
            </button>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
