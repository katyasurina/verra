import { useState } from "react";
import { contact } from "../../data/content";
import { getProperty, properties } from "../../data/properties";
import { formatPrice, pricePerM2 } from "../../lib/catalog";
import { useT, useLang } from "../../lib/i18n";
import { usePageMeta } from "../../lib/meta";
import { Link } from "../../lib/router";
import { compare, favorites, openInquiry, toast, useCompare, useFavorites } from "../../lib/store";
import { Mortgage } from "../Mortgage";
import { Photo } from "../Photo";
import { PropertyCard } from "../PropertyCard";
import { PageShell } from "./PageShell";
import { NotFound } from "./NotFound";

export function PropertyPage({ id }: { id: number }) {
  const p = getProperty(id);
  return p ? <Detail key={p.id} id={p.id} /> : <NotFound />;
}

function Detail({ id }: { id: number }) {
  const t = useT();
  const lang = useLang();
  const p = getProperty(id)!;
  const [shot, setShot] = useState(0);
  const favs = useFavorites();
  const cmp = useCompare();
  const isFav = favs.includes(p.id);
  const isCmp = cmp.includes(p.id);

  const desc = lang === "ua" ? p.desc.ua : p.desc.en;
  usePageMeta(`${p.name} — ${t(p.type)}, ${p.location} | Verra Estates`, desc, p.image, {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.name,
    description: p.desc.en,
    image: p.gallery,
    url: window.location.href,
    offers: { "@type": "Offer", price: p.price, priceCurrency: "EUR" },
  });

  const similar = properties
    .filter((x) => x.id !== p.id)
    .map((x) => ({ x, score: (x.location.split(",")[0] === p.location.split(",")[0] ? 2 : 0) + (x.type === p.type ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.x);

  const bbox = `${p.lng - 0.02},${p.lat - 0.012},${p.lng + 0.02},${p.lat + 0.012}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${p.lat},${p.lng}`;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: p.name, url });
      else {
        await navigator.clipboard.writeText(url);
        toast(t("Link copied"));
      }
    } catch {
      /* cancelled */
    }
  };

  const specs: [string, string][] = [
    [t("Area"), `${p.area} m²`],
    [t("Bedrooms"), String(p.beds)],
    [t("Bathrooms"), String(p.baths)],
    [t("Type"), t(p.type)],
    [t("Year built"), String(p.year)],
    [t("Price per m²"), formatPrice(pricePerM2(p))],
  ];

  const request = () => openInquiry({ title: p.name, subtitle: `${t(p.type)} · ${p.location} · ${formatPrice(p.price)} · ${p.area} m²`, propertyId: p.id });

  return (
    <PageShell>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/catalog">← {t("All residences")}</Link>
        <span>
          {p.location} / {t(p.type)}
        </span>
      </nav>

      <div className="pd">
        <div className="pd-main">
          <div className="gal">
            <Photo className="gal-main" tone={p.tone} src={p.gallery[shot]} position={shot === 0 ? p.position : undefined} label={`${p.name} — ${shot + 1}`} eager />
            <span className="status glass">{t(p.status)}</span>
            <div className="thumbs">
              {p.gallery.map((src, i) => (
                <button key={src + i} type="button" className={i === shot ? "on" : ""} aria-label={`${t("Photo")} ${i + 1}`} onClick={() => setShot(i)}>
                  <Photo tone={p.tone} src={src} position={i === 0 ? p.position : undefined} label="" eager />
                </button>
              ))}
            </div>
          </div>

          <h1 className="pd-h">{p.name}</h1>
          <p className="pd-loc">
            {t(p.type)} · {p.location}
          </p>

          <dl className="specs">
            {specs.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <p className="pd-desc">{desc}</p>

          <ul className="chips">
            {p.features.map((f) => (
              <li key={f}>{t(f)}</li>
            ))}
          </ul>

          <section className="pd-map">
            <h3>{t("Location")}</h3>
            <iframe title={`${t("Map")}: ${p.location}`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer" />
            <p className="hint">{t("The map shows the approximate area. The exact address is given at the viewing.")}</p>
          </section>

          <Mortgage price={p.price} />
        </div>

        <aside className="pd-side">
          <div className="buy glass light">
            <small>{t("Price")}</small>
            <strong>{formatPrice(p.price)}</strong>
            <button type="button" className="btn" onClick={request}>
              {t("Request a viewing")} <i>↗</i>
            </button>
            <a className="tel" href={contact.phoneHref}>
              {contact.phone}
            </a>
            <div className="row3">
              <button type="button" className={isFav ? "on" : ""} aria-pressed={isFav} onClick={() => favorites.toggle(p.id)}>
                {isFav ? "♥" : "♡"} {isFav ? t("Saved") : t("Save")}
              </button>
              <button
                type="button"
                className={isCmp ? "on" : ""}
                aria-pressed={isCmp}
                onClick={() => {
                  if (!compare.toggle(p.id)) toast(t("You can compare up to 3 properties"));
                }}
              >
                ⇄ {isCmp ? t("Added") : t("Compare")}
              </button>
              <button type="button" onClick={share}>
                ↗ {t("Share")}
              </button>
            </div>
          </div>
        </aside>
      </div>

      <section className="similar">
        <div className="sec-h">
          <h2>
            {t("similar")}
            <br />
            <b>{t("residences")}</b>
          </h2>
        </div>
        <div className="grid">
          {similar.map((x, i) => (
            <PropertyCard key={x.id} property={x} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
