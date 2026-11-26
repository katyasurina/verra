import { useMemo, useRef } from "react";
import { properties, PROPERTY_TYPES } from "../data/properties";
import { useDeck } from "../hooks/useDeck";
import { useRiser } from "../hooks/useRiser";
import { filterProperties, filtersToQuery, type Filters } from "../lib/catalog";
import { useT } from "../lib/i18n";
import { getVelocity } from "../lib/motion";
import { Link, navigate } from "../lib/router";
import { FilterBar } from "./FilterBar";
import { PropertyCard } from "./PropertyCard";

interface Props {
  filters: Filters;
  onFilters: (f: Filters) => void;
  onPickType: (type: Filters["type"]) => void;
}

/** Home page showcase: the first six matches. The full list lives on /catalog. */
export function Residences({ filters, onFilters, onPickType }: Props) {
  const t = useT();
  const sheet = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  useRiser(sheet, 0.94, 4);

  const all = useMemo(() => filterProperties(properties, filters), [filters]);
  const list = all.slice(0, 6);
  const fullRows = list.length - (list.length % 3);
  const deck = useDeck(grid, list.length, getVelocity);
  const catalogUrl = "/catalog" + filtersToQuery(filters);

  return (
    <div className="wrap propsheet" id="psheet" ref={sheet}>
      <section id="props">
        <div className="sec-h">
          <h2>
            {t("selected")}
            <br />
            <b>{t("residences")}</b>
          </h2>
          <Link className="btn" to={catalogUrl}>
            {t("Show all properties")} <i>→</i>
          </Link>
        </div>

        <FilterBar filters={filters} onFilters={onFilters} count={all.length} />

        <div className={`grid${deck === "quick" ? " qk" : ""}`} id="grid" ref={grid}>
          {list.length ? (
            list.map((p, i) => <PropertyCard key={p.id} property={p} index={i} fullRows={fullRows} deck={deck} />)
          ) : (
            <div className="empty">{t("No properties match these filters.")}</div>
          )}
        </div>

        {all.length > list.length && (
          <div className="more">
            <Link className="btn" to={catalogUrl}>
              {t("View all")} {all.length} {t("residences")} <i>→</i>
            </Link>
          </div>
        )}

        <div className="cats">
          {PROPERTY_TYPES.map((ty) => (
            <button key={ty} type="button" onClick={() => onPickType(ty)}>
              {t(ty + "s")}
            </button>
          ))}
          <button type="button" onClick={() => navigate("/catalog")}>
            {t("Everything")} →
          </button>
        </div>
      </section>
    </div>
  );
}
