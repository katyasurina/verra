import { useEffect, useState } from "react";
import { useT } from "../lib/i18n";
import { Link } from "../lib/router";
import { openInquiry, useFavorites } from "../lib/store";
import { LangSwitch } from "./LangSwitch";

/** Glass navigation pill + mobile burger menu. Used in the hero and on inner pages. */
export function SiteNav() {
  const t = useT();
  const [menu, setMenu] = useState(false);
  const favs = useFavorites();

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest(".mmenu,.burger")) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [menu]);

  const items: [string, string][] = [
    ["/catalog", "Properties"],
    ["/#locs", "Locations"],
    ["/#about", "About"],
    ["/journal", "Journal"],
    ["/#contact", "Contact"],
  ];

  return (
    <>
      <div className="nav glass">
        <Link className="logo" to="/">
          VERRA
        </Link>
        <nav className="links">
          <Link to="/catalog">{t("Properties")}</Link>
          <Link to="/#locs">{t("Locations")}</Link>
          <Link to="/#about">{t("About")}</Link>
          <Link to="/journal">{t("Journal")}</Link>
          <Link to="/#contact">{t("Contact")}</Link>
        </nav>
        <div className="navr">
          <Link to="/favorites" className="favlink" aria-label={t("Favorites")}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.7a4.3 4.3 0 0 1 7.5 2.6c0 5.6-7.5 10.2-7.5 10.2z" fill={favs.length ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            {favs.length > 0 && <b>{favs.length}</b>}
          </Link>
          <LangSwitch />
          <button type="button" className="navcta" onClick={() => openInquiry()}>
            {t("Request a viewing")}
          </button>
        </div>
        <button type="button" className="burger" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} aria-controls="mmenu" onClick={() => setMenu((m) => !m)}>
          <i />
          <i />
        </button>
      </div>
      <div className={`mmenu${menu ? " open" : ""}`} id="mmenu">
        {items.map(([to, label]) => (
          <Link key={to} to={to} onClick={() => setMenu(false)}>
            {t(label)}
          </Link>
        ))}
        <Link to="/favorites" onClick={() => setMenu(false)}>
          {t("Favorites")}
          {favs.length > 0 ? ` (${favs.length})` : ""}
        </Link>
        <button
          type="button"
          className="mcta"
          onClick={() => {
            setMenu(false);
            openInquiry();
          }}
        >
          {t("Request a viewing")}
        </button>
        <LangSwitch />
      </div>
    </>
  );
}
