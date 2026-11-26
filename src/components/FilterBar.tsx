import { locations } from "../data/content";
import { PROPERTY_TYPES } from "../data/properties";
import { emptyFilters, type Filters } from "../lib/catalog";
import { useT } from "../lib/i18n";

interface Props {
  filters: Filters;
  onFilters: (f: Filters) => void;
  count: number;
}

export function FilterBar({ filters, onFilters, count }: Props) {
  const t = useT();
  const set = <K extends keyof Filters>(key: K) => (e: { target: { value: string } }) => onFilters({ ...filters, [key]: e.target.value as Filters[K] });
  return (
    <div className="bar" id="bar">
      <input className="qs" type="search" value={filters.q} onChange={set("q")} placeholder={t("Search by name or district")} aria-label={t("Search by name or district")} />
      <select value={filters.location} onChange={set("location")} aria-label={t("Location")}>
        <option value="">{t("All locations")}</option>
        {locations.map((l) => (
          <option key={l.name} value={l.name}>
            {t(l.name)}
          </option>
        ))}
      </select>
      <select value={filters.type} onChange={set("type")} aria-label={t("Type")}>
        <option value="">{t("All types")}</option>
        {PROPERTY_TYPES.map((ty) => (
          <option key={ty} value={ty}>
            {t(ty)}
          </option>
        ))}
      </select>
      <select value={filters.price} onChange={set("price")} aria-label={t("Price")}>
        <option value="">{t("Any price")}</option>
        <option value="0-600000">{t("Up to €600k")}</option>
        <option value="600000-1500000">€600k–1.5M</option>
        <option value="1500000-99999999">€1.5M+</option>
      </select>
      <select value={filters.beds} onChange={set("beds")} aria-label={t("Bedrooms")}>
        <option value="">{t("Any bedrooms")}</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>
      <span className="sp" />
      <span className="count">
        {count} {count === 1 ? t("property") : t("properties")}
      </span>
      <select value={filters.sort} onChange={set("sort")} aria-label={t("Sort")}>
        <option value="">{t("Sort: featured")}</option>
        <option value="pa">{t("Price, low to high")}</option>
        <option value="pd">{t("Price, high to low")}</option>
        <option value="ad">{t("Area, largest")}</option>
      </select>
      <button type="button" onClick={() => onFilters(emptyFilters)}>
        {t("Reset")}
      </button>
    </div>
  );
}
