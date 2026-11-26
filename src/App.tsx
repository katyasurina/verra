import { useCallback, useEffect, useRef, useState } from "react";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Dock } from "./components/Dock";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { InquiryDialog } from "./components/InquiryDialog";
import { Intro } from "./components/Intro";
import { Locations } from "./components/Locations";
import { CatalogPage } from "./components/pages/CatalogPage";
import { ComparePage } from "./components/pages/ComparePage";
import { FavoritesPage } from "./components/pages/FavoritesPage";
import { NotFound } from "./components/pages/NotFound";
import { PropertyPage } from "./components/pages/PropertyPage";
import { Residences } from "./components/Residences";
import { Why } from "./components/Why";
import { pageview } from "./lib/analytics";
import { emptyFilters, scrollToId, type Filters } from "./lib/catalog";
import { useT } from "./lib/i18n";
import { usePageMeta } from "./lib/meta";
import { startScrollVelocity } from "./lib/motion";
import { useLocation } from "./lib/router";
import { openInquiry } from "./lib/store";

const HOME_DESC = "Verra Estates is a boutique real-estate agency in Kyiv. Premium apartments, penthouses and houses in Pechersk, Lypky, Podil, Koncha-Zaspa, Kozyn and Odesa, chosen for how they are built.";

function Home() {
  const t = useT();
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  usePageMeta("Verra Estates — Spaces that shape the way we live", t(HOME_DESC));

  /** apply filters, then scroll to the showcase */
  const search = useCallback((f: Filters) => {
    setFilters(f);
    scrollToId("props");
  }, []);

  return (
    <>
      <Intro />
      {/* SVG filter used by the hero lens to draw clean outlined letters */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="ol" x="-1%" y="-1%" width="102%" height="102%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="erode" radius="1.6" result="e" />
          <feComposite in="SourceGraphic" in2="e" operator="out" />
        </filter>
      </svg>
      <main>
        <div className="stage">
          <Hero onSearch={search} />
          <About />
        </div>
        <Why />
        <Residences filters={filters} onFilters={setFilters} onPickType={(type) => search({ ...emptyFilters, type })} />
        <Locations onPick={(location) => search({ ...emptyFilters, location })} />
        <Contact onRequest={() => openInquiry()} />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const { path, hash } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    startScrollVelocity();
  }, []);

  // new page → top; "/#section" → smooth scroll to the section once it exists
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    const id = window.setInterval(() => {
      const el = document.getElementById(hash);
      if (el || ++tries > 20) {
        window.clearInterval(id);
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }, 60);
    return () => window.clearInterval(id);
  }, [path, hash]);

  useEffect(() => {
    pageview(path, document.title);
  }, [path]);

  const m = path.match(/^\/property\/(\d+)$/);
  let page;
  if (path === "/") page = <Home />;
  else if (path === "/catalog") page = <CatalogPage />;
  else if (path === "/favorites") page = <FavoritesPage />;
  else if (path === "/compare") page = <ComparePage />;
  else if (m) page = <PropertyPage id={Number(m[1])} />;
  else page = <NotFound />;

  return (
    <>
      {page}
      <Dock />
      <InquiryDialog />
    </>
  );
}
