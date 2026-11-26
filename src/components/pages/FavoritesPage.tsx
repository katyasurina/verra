import { properties } from "../../data/properties";
import { formatPrice } from "../../lib/catalog";
import { useT } from "../../lib/i18n";
import { usePageMeta } from "../../lib/meta";
import { Link } from "../../lib/router";
import { favorites, openInquiry, useFavorites } from "../../lib/store";
import { PropertyCard } from "../PropertyCard";
import { PageShell } from "./PageShell";

export function FavoritesPage() {
  const t = useT();
  const ids = useFavorites();
  const list = ids.map((id) => properties.find((p) => p.id === id)).filter((p) => !!p);
  usePageMeta(`${t("Favorites")} — Verra Estates`, t("Your saved residences."));

  const sendShortlist = () =>
    openInquiry({
      title: "Send my shortlist",
      subtitle: t("An advisor will arrange viewings for the homes you saved."),
      note: list.map((p) => `• ${p.name} (${p.location}, ${formatPrice(p.price)})`).join("\n"),
    });

  return (
    <PageShell>
      <div className="sec-h">
        <h2>
          {t("your")}
          <br />
          <b>{t("favorites")}</b>
        </h2>
        {list.length > 0 && (
          <div className="pg-acts">
            <button type="button" className="btn" onClick={sendShortlist}>
              {t("Send my shortlist")} <i>↗</i>
            </button>
            <button type="button" className="ghost" onClick={() => favorites.clear()}>
              {t("Clear all")}
            </button>
          </div>
        )}
      </div>
      {list.length ? (
        <div className="grid" id="grid">
          {list.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty">
          {t("Nothing saved yet. Tap the heart on any residence to keep it here.")}{" "}
          <Link className="btn" to="/catalog">
            {t("Browse residences")} <i>→</i>
          </Link>
        </div>
      )}
    </PageShell>
  );
}
