import { properties, type Property } from "../../data/properties";
import { formatPrice, pricePerM2 } from "../../lib/catalog";
import { useT } from "../../lib/i18n";
import { usePageMeta } from "../../lib/meta";
import { Link } from "../../lib/router";
import { compare, openInquiry, useCompare } from "../../lib/store";
import { Photo } from "../Photo";
import { PageShell } from "./PageShell";

export function ComparePage() {
  const t = useT();
  const ids = useCompare();
  const list = ids.map((id) => properties.find((p) => p.id === id)).filter((p): p is Property => !!p);
  usePageMeta(`${t("Compare")} — Verra Estates`, t("Compare residences side by side."));

  const rows: [string, (p: Property) => string][] = [
    ["Price", (p) => formatPrice(p.price)],
    ["Price per m²", (p) => formatPrice(pricePerM2(p))],
    ["Type", (p) => t(p.type)],
    ["Location", (p) => p.location],
    ["Area", (p) => `${p.area} m²`],
    ["Bedrooms", (p) => String(p.beds)],
    ["Bathrooms", (p) => String(p.baths)],
    ["Year built", (p) => String(p.year)],
    ["Status", (p) => t(p.status)],
    ["Features", (p) => p.features.map(t).join(", ")],
  ];
  const best = (label: string, p: Property): boolean => {
    if (list.length < 2) return false;
    const val = (x: Property) => (label === "Price" ? x.price : label === "Price per m²" ? pricePerM2(x) : label === "Area" ? x.area : label === "Bedrooms" ? x.beds : -1);
    if (val(p) < 0) return false;
    const vals = list.map(val);
    const target = label === "Price" || label === "Price per m²" ? Math.min(...vals) : Math.max(...vals);
    return val(p) === target && new Set(vals).size > 1;
  };

  return (
    <PageShell>
      <div className="sec-h">
        <h2>
          {t("compare")}
          <br />
          <b>{t("residences")}</b>
        </h2>
        {list.length > 0 && (
          <button type="button" className="ghost" onClick={() => compare.clear()}>
            {t("Clear all")}
          </button>
        )}
      </div>
      {list.length ? (
      <>
        <div className="cmpwrap">
          <table className="cmp">
            <thead>
              <tr>
                <th className="lead">
                  <p>{t("Side by side")}</p>
                  <small>{t("Up to three residences")}</small>
                </th>
                {list.map((p) => (
                  <th key={p.id}>
                    <Link to={`/property/${p.id}`}>
                      <Photo tone={p.tone} src={p.image} position={p.position} label={p.name} eager />
                      <strong>{p.name}</strong>
                    </Link>
                    <button type="button" className="x" onClick={() => compare.remove(p.id)}>
                      {t("Remove")}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, get]) => (
                <tr key={label}>
                  <th scope="row">{t(label)}</th>
                  {list.map((p) => (
                    <td key={p.id} className={best(label, p) ? "best" : ""}>
                      {get(p)}
                      {best(label, p) && <i aria-label={t("Best in the row")}>✓</i>}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th />
                {list.map((p) => (
                  <td key={p.id}>
                    <button type="button" className="btn" onClick={() => openInquiry({ title: p.name, subtitle: `${t(p.type)} · ${p.location} · ${formatPrice(p.price)}`, propertyId: p.id })}>
                      {t("Request a viewing")} <i>↗</i>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="legend">
          <i>✓</i> {t("Best in the row: lowest price, largest area, most bedrooms.")}
        </p>
        {list.length < 2 && <p className="hint">{t("Add at least one more residence to compare.")}</p>}
      </>
      ) : (
        <div className="empty">
          {t("Pick up to three residences with the compare icon on their cards.")}{" "}
          <Link className="btn" to="/catalog">
            {t("Browse residences")} <i>→</i>
          </Link>
        </div>
      )}
    </PageShell>
  );
}
