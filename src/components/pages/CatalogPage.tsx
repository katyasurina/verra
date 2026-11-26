import { useMemo } from "react";
import { properties } from "../../data/properties";
import { filterProperties, filtersToQuery, queryToFilters, type Filters } from "../../lib/catalog";
import { useT } from "../../lib/i18n";
import { usePageMeta } from "../../lib/meta";
import { navigate, useLocation } from "../../lib/router";
import { FilterBar } from "../FilterBar";
import { MapView } from "../MapView";
import { PropertyCard } from "../PropertyCard";
import { PageShell } from "./PageShell";

export function CatalogPage() {
  const t = useT();
  const { search } = useLocation();
  const key = search.toString();
  const filters = useMemo(() => queryToFilters(new URLSearchParams(key)), [key]);
  const list = useMemo(() => filterProperties(properties, filters), [filters]);

  usePageMeta(`${t("All residences")} — Verra Estates`, t("Browse all premium apartments, penthouses, houses and villas in Kyiv, Koncha-Zaspa, Kozyn and Odesa."));

  const view = search.get("view") === "map" ? "map" : "list";
  const go = (f: Filters, v: string) => {
    const q = filtersToQuery(f);
    navigate("/catalog" + q + (v === "map" ? (q ? "&" : "?") + "view=map" : ""), { replace: true });
  };
  const setFilters = (f: Filters) => go(f, view);

  return (
    <PageShell>
      <div className="sec-h">
        <h2>
          {t("all")}
          <br />
          <b>{t("residences")}</b>
        </h2>
      </div>
      <FilterBar filters={filters} onFilters={setFilters} count={list.length} />
      <div className="viewtoggle" role="group" aria-label={t("View")}>
        <button type="button" aria-pressed={view === "list"} onClick={() => go(filters, "list")}>
          {t("List")}
        </button>
        <button type="button" aria-pressed={view === "map"} onClick={() => go(filters, "map")}>
          {t("Map")}
        </button>
      </div>
      {view === "map" ? (
        list.length ? (
          <MapView list={list} />
        ) : (
          <div className="empty">{t("No properties match these filters.")}</div>
        )
      ) : (
        <div className="grid" id="grid">
          {list.length ? list.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />) : <div className="empty">{t("No properties match these filters.")}</div>}
        </div>
      )}
    </PageShell>
  );
}
