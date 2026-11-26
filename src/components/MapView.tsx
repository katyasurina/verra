import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import type { Property } from "../data/properties";
import { formatPrice } from "../lib/catalog";
import { useT } from "../lib/i18n";
import { Link } from "../lib/router";

const TILE = 256;
const project = (lat: number, lng: number, z: number): { x: number; y: number } => {
  const s = TILE * 2 ** z;
  const sin = Math.sin((lat * Math.PI) / 180);
  return { x: ((lng + 180) / 360) * s, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * s };
};
const unproject = (x: number, y: number, z: number): { lat: number; lng: number } => {
  const s = TILE * 2 ** z;
  const n = Math.PI - (2 * Math.PI * y) / s;
  return { lat: (180 / Math.PI) * Math.atan(Math.sinh(n)), lng: (x / s) * 360 - 180 };
};

/** zoom + centre that fit every point inside a w×h box */
function fit(points: { lat: number; lng: number }[], w: number, h: number) {
  const lat = points.reduce((a, p) => a + p.lat, 0) / (points.length || 1) || 50.4;
  const lng = points.reduce((a, p) => a + p.lng, 0) / (points.length || 1) || 30.5;
  for (let z = 14; z >= 4; z--) {
    const px = points.map((p) => project(p.lat, p.lng, z));
    const xs = px.map((p) => p.x), ys = px.map((p) => p.y);
    if (Math.max(...xs) - Math.min(...xs) < w * 0.78 && Math.max(...ys) - Math.min(...ys) < h * 0.7) {
      const c = unproject((Math.max(...xs) + Math.min(...xs)) / 2, (Math.max(...ys) + Math.min(...ys)) / 2, z);
      return { lat: c.lat, lng: c.lng, z };
    }
  }
  return { lat, lng, z: 4 };
}

const REGIONS = [
  { label: "Kyiv centre", lat: 50.44, lng: 30.54, z: 12 },
  { label: "Kyiv region", lat: 50.35, lng: 30.6, z: 10 },
  { label: "Odesa", lat: 46.44, lng: 30.76, z: 11 },
];

/** Small slippy map on OpenStreetMap tiles (no map library). Drag to pan, buttons to zoom. */
export function MapView({ list }: { list: Property[] }) {
  const t = useT();
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const [size, setSize] = useState({ w: 800, h: 560 });
  const [view, setView] = useState({ lat: 50.4, lng: 30.55, z: 9 });
  const [active, setActive] = useState<number | null>(null);
  const key = list.map((p) => p.id).join(",");

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // re-fit when the list of properties changes
  useEffect(() => {
    if (list.length) {
      // Kyiv and Odesa are 450 km apart: fit the Kyiv area when it is present, Odesa has its own button
      const kyiv = list.filter((p) => p.lat > 49);
      setView(fit(kyiv.length ? kyiv : list, size.w, size.h));
    }
    setActive(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, size.w > 0]);

  const c = project(view.lat, view.lng, view.z);
  const left = c.x - size.w / 2;
  const top = c.y - size.h / 2;
  const n = 2 ** view.z;

  const tiles = useMemo(() => {
    const out: { key: string; src: string; x: number; y: number }[] = [];
    for (let ty = Math.floor(top / TILE); ty <= Math.floor((top + size.h) / TILE); ty++) {
      if (ty < 0 || ty >= n) continue;
      for (let tx = Math.floor(left / TILE); tx <= Math.floor((left + size.w) / TILE); tx++) {
        const wx = ((tx % n) + n) % n;
        out.push({ key: `${view.z}/${tx}/${ty}`, src: `https://tile.openstreetmap.org/${view.z}/${wx}/${ty}.png`, x: tx * TILE - left, y: ty * TILE - top });
      }
    }
    return out;
  }, [left, top, size.w, size.h, view.z, n]);

  const zoom = (d: number) => setView((v) => ({ ...v, z: Math.max(4, Math.min(16, v.z + d)) }));
  const goto = (lat: number, lng: number, z: number) => setView({ lat, lng, z });

  const onDown = (e: RPointerEvent) => {
    if ((e.target as Element).closest(".mk,.mpop,.mctl")) return;
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: RPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    d.x = e.clientX;
    d.y = e.clientY;
    setView((v) => {
      const p = project(v.lat, v.lng, v.z);
      const next = unproject(p.x - dx, p.y - dy, v.z);
      return { ...v, lat: Math.max(-80, Math.min(80, next.lat)), lng: next.lng };
    });
  };
  const onUp = () => {
    if (drag.current && !drag.current.moved) setActive(null);
    drag.current = null;
  };

  const sel = list.find((p) => p.id === active);

  return (
    <div className="map" ref={box} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onDoubleClick={() => zoom(1)} role="application" aria-label={t("Map of residences")}>
      <div className="tiles" aria-hidden="true">
        {tiles.map((tl) => (
          <img key={tl.key} src={tl.src} alt="" width={TILE} height={TILE} draggable={false} style={{ transform: `translate(${tl.x}px,${tl.y}px)` }} />
        ))}
      </div>
      {list.map((p) => {
        const q = project(p.lat, p.lng, view.z);
        const x = q.x - left, y = q.y - top;
        if (x < -80 || y < -40 || x > size.w + 80 || y > size.h + 40) return null;
        return (
          <button key={p.id} type="button" className={`mk${active === p.id ? " on" : ""}`} style={{ left: x, top: y }} onClick={() => setActive(p.id)} aria-label={`${p.name}, ${formatPrice(p.price)}`}>
            {p.price >= 1e6 ? `€${(p.price / 1e6).toFixed(p.price % 1e6 ? 2 : 0)}M` : `€${Math.round(p.price / 1000)}k`}
          </button>
        );
      })}
      {sel && (
        <Link className="mpop glass light" to={`/property/${sel.id}`}>
          <span className="mimg" style={{ backgroundImage: `url(${sel.image})`, backgroundPosition: sel.position }} />
          <span>
            <strong>{sel.name}</strong>
            <small>
              {t(sel.type)} · {sel.location}
            </small>
            <b>{formatPrice(sel.price)}</b>
          </span>
        </Link>
      )}
      <div className="mctl">
        {REGIONS.map((r) => (
          <button key={r.label} type="button" onClick={() => goto(r.lat, r.lng, r.z)}>
            {t(r.label)}
          </button>
        ))}
        <span>
          <button type="button" aria-label={t("Zoom in")} onClick={() => zoom(1)}>
            +
          </button>
          <button type="button" aria-label={t("Zoom out")} onClick={() => zoom(-1)}>
            −
          </button>
        </span>
      </div>
      <a className="attr" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
        © OpenStreetMap
      </a>
    </div>
  );
}
