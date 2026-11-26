import { privacy, terms } from "../../data/legal";
import { useLang, useT } from "../../lib/i18n";
import { usePageMeta } from "../../lib/meta";
import { PageShell } from "./PageShell";

export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const t = useT();
  const lang = useLang();
  const sections = kind === "privacy" ? privacy : terms;
  const title = kind === "privacy" ? t("Privacy policy") : t("Terms of use");
  usePageMeta(`${title} — Verra Estates`, title);
  return (
    <PageShell>
      <div className="legal-page">
        <h1 className="pd-h">{title}</h1>
        <p className="hint">{t("Last updated")}: 26.11.2026</p>
        {sections.map((s) => (
          <section key={s.h.en}>
            <h3>{s.h[lang]}</h3>
            <p>{s.p[lang]}</p>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
