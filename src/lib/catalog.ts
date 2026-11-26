import type { Property, PropertyType } from "../data/properties";

export interface Filters {
  location: string;
  type: "" | PropertyType;
  /** "min-max" or "" */
  price: string;
  beds: string;
  sort: "" | "pa" | "pd" | "ad";
}

export const emptyFilters: Filters = { location: "", type: "", price: "", beds: "", sort: "" };

export const formatPrice = (n: number): string => "€" + n.toLocaleString("en-US");

export function filterProperties(list: Property[], f: Filters): Property[] {
  const loc = f.location.trim().toLowerCase();
  const [min, max] = f.price ? f.price.split("-").map(Number) : [0, 0];
  const beds = Number(f.beds) || 0;
  const out = list.filter(
    (p) =>
      (!loc || p.location.toLowerCase().includes(loc)) &&
      (!f.type || p.type === f.type) &&
      (!max || (p.price >= min && p.price <= max)) &&
      p.beds >= beds,
  );
  if (f.sort === "pa") out.sort((a, b) => a.price - b.price);
  if (f.sort === "pd") out.sort((a, b) => b.price - a.price);
  if (f.sort === "ad") out.sort((a, b) => b.area - a.area);
  return out;
}

export const scrollToId = (id: string): void => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export const filtersToQuery = (f: Filters): string => {
  const q = new URLSearchParams();
  (Object.keys(f) as (keyof Filters)[]).forEach((k) => f[k] && q.set(k, f[k]));
  const s = q.toString();
  return s ? `?${s}` : "";
};

export const queryToFilters = (q: URLSearchParams): Filters => {
  const sort = q.get("sort") ?? "";
  const type = q.get("type") ?? "";
  return {
    location: q.get("location") ?? "",
    type: (["Apartment", "Penthouse", "House", "Villa", "Townhouse"].includes(type) ? type : "") as Filters["type"],
    price: /^\d+-\d+$/.test(q.get("price") ?? "") ? (q.get("price") as string) : "",
    beds: /^\d$/.test(q.get("beds") ?? "") ? (q.get("beds") as string) : "",
    sort: (["pa", "pd", "ad"].includes(sort) ? sort : "") as Filters["sort"],
  };
};

export const pricePerM2 = (p: { price: number; area: number }): number => Math.round(p.price / p.area);
