import { useT } from "../../lib/i18n";
import { usePageMeta } from "../../lib/meta";
import { Link } from "../../lib/router";
import { PageShell } from "./PageShell";

export function NotFound() {
  const t = useT();
  usePageMeta("404 — Verra Estates", t("This page does not exist."));
  return (
    <PageShell>
      <div className="sec-h">
        <h2>
          404
          <br />
          <b>{t("not found")}</b>
        </h2>
      </div>
      <p className="hint">{t("This page does not exist.")}</p>
      <Link className="btn" to="/">
        {t("Back to the homepage")} <i>→</i>
      </Link>
    </PageShell>
  );
}
