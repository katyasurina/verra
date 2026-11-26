import assert from "node:assert/strict";
import { test } from "node:test";
import { emptyFilters, filterProperties, filtersToQuery, queryToFilters } from "../src/lib/catalog";
import { monthlyPayment } from "../src/lib/mortgage";
import { properties } from "../src/data/properties";

test("mortgage: zero interest is a straight division", () => {
  const r = monthlyPayment(120000, 0, 10, 0);
  assert.equal(Math.round(r.monthly), 1000);
});

test("mortgage: payment grows with the rate", () => {
  assert.ok(monthlyPayment(500000, 30, 20, 9).monthly > monthlyPayment(500000, 30, 20, 5).monthly);
});

test("catalog has 15 unique properties", () => {
  assert.equal(properties.length, 15);
  assert.equal(new Set(properties.map((p) => p.id)).size, 15);
});

test("filter by location and type", () => {
  const podil = filterProperties(properties, { ...emptyFilters, location: "Podil" });
  assert.ok(podil.length >= 2 && podil.every((p) => p.location.startsWith("Podil")));
  const villas = filterProperties(properties, { ...emptyFilters, type: "Villa" });
  assert.ok(villas.every((p) => p.type === "Villa"));
});

test("text search matches the name", () => {
  const r = filterProperties(properties, { ...emptyFilters, q: "forest" });
  assert.equal(r.length, 1);
});

test("sorting by price", () => {
  const r = filterProperties(properties, { ...emptyFilters, sort: "pa" });
  assert.ok(r.every((p, i) => i === 0 || r[i - 1].price <= p.price));
});

test("filters survive a round trip through the URL", () => {
  const f = { ...emptyFilters, location: "Kozyn", type: "House" as const, beds: "3" };
  const back = queryToFilters(new URLSearchParams(filtersToQuery(f).slice(1)));
  assert.deepEqual(back, f);
});
