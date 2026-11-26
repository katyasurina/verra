import type { Property } from "../data/properties";
import type { DeckPhase } from "../hooks/useDeck";
import { formatPrice } from "../lib/catalog";
import { useT } from "../lib/i18n";
import { Link } from "../lib/router";
import { compare, favorites, toast, useCompare, useFavorites } from "../lib/store";
import { Photo } from "./Photo";

interface Props {
  property: Property;
  /** position in the visible list; rows of three get left / right / centre slots */
  index?: number;
  fullRows?: number;
  deck?: DeckPhase;
}

const SLOT = ["pl", "pr", "pc"] as const;

export function PropertyCard({ property: p, index = 0, fullRows = 0, deck = "off" }: Props) {
  const t = useT();
  const favs = useFavorites();
  const cmp = useCompare();
  const isFav = favs.includes(p.id);
  const isCmp = cmp.includes(p.id);

  // the deck only covers the six initial cards
  const dealing = deck !== "off" && deck !== "done" && index < 6;
  const spread = deck === "quick" || (index < 3 && (deck === "w1" || deck === "w2")) || (index >= 3 && deck === "w2");
  const cls = ["card", index < fullRows ? SLOT[index % 3] : "", dealing ? "dk" : "", dealing && deck !== "stacked" ? "pile" : "", dealing && spread ? "spread" : ""].filter(Boolean).join(" ");

  return (
    <div className={cls}>
      <Link className="cl" to={`/property/${p.id}`} aria-label={`${p.name}, ${t(p.type)}, ${p.location}`}>
        <Photo tone={p.tone} src={p.image} position={p.position} label={`${p.name}, ${p.type} in ${p.location}`} eager={index < 9} />
        <span className="status glass">{t(p.status)}</span>
        <div className="glass spec">
          <span>{p.area} m²</span>
          <span>
            {p.beds} {t("bed")}
          </span>
          <span>
            {p.baths} {t("bath")}
          </span>
        </div>
        <div className="meta">
          <div>
            <h3>{p.name}</h3>
            <span>
              {t(p.type)} · {p.location}
            </span>
          </div>
          <div className="price">{formatPrice(p.price)}</div>
        </div>
      </Link>
      <div className="acts2">
        <button type="button" className={`rb${isFav ? " on" : ""}`} aria-pressed={isFav} aria-label={isFav ? t("Remove from favorites") : t("Add to favorites")} onClick={() => favorites.toggle(p.id)}>
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.7a4.3 4.3 0 0 1 7.5 2.6c0 5.6-7.5 10.2-7.5 10.2z" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className={`rb${isCmp ? " on" : ""}`}
          aria-pressed={isCmp}
          aria-label={isCmp ? t("Remove from comparison") : t("Add to comparison")}
          onClick={() => {
            if (!compare.toggle(p.id)) toast(t("You can compare up to 3 properties"));
          }}
        >
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <path d={isCmp ? "M5 12.5l4.5 4.5L19 7.5" : "M7 4v16M17 4v16M3.5 8L7 4l3.5 4M13.5 16L17 20l3.5-4"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
