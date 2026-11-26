import { useMemo } from "react";
import { properties } from "../../data/properties";
import { filterProperties, filtersToQuery, queryToFilters, type Filters } from "../../lib/catalog";
import { useT } from "../../lib/i18n";
import { usePageMeta } from "../../lib/meta";
import { navigate, useLocation } from "../../lib/router";
import { FilterBar } from "../FilterBar";
import { PropertyCard } from "../PropertyCard";
import { PageShell } from "./PageShell";

export function CatalogPage() {
  const t = useT();
  const { search } = useLocation();
  const key = search.toString();
  const filters = useMemo(() => queryToFilters(new URLSearchParams(key)), [key]);
  const list = useMemo(() => filterProperties(properties, filters), [filters]);

  usePageMeta(`${t("All residences")} — Verra Estates`, t("Browse all premium apartments, penthouses, houses and villas in Kyiv, Koncha-Zaspa, Kozyn and Odesa."));

  const setFilters = (f: Filters) => navigate("/catalog" + filtersToQuery(f), { replace: true });

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
      <div className="grid" id="grid">
        {list.length ? list.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />) : <div className="empty">{t("No properties match these filters.")}</div>}
      </div>
    </PageShell>
  );
}
