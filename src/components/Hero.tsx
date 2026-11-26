import { useEffect, useRef, useState, type FormEvent } from "react";
import { locations } from "../data/content";
import { HERO_POSTER, HERO_VIDEO } from "../data/media";
import { PROPERTY_TYPES } from "../data/properties";
import { emptyFilters, type Filters } from "../lib/catalog";
import { clamp } from "../lib/motion";
import { SiteNav } from "./SiteNav";
import { useT } from "../lib/i18n";
import { useHeroLens } from "../hooks/useHeroLens";

interface HeroProps {
  onSearch: (filters: Filters) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const t = useT();
  const hero = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const echo = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ location: "", type: "", price: "", beds: "" });

  useHeroLens({ hero, video, lens, ring, canvas, echo });

  // darken the hero while the next sheet slides over it
  useEffect(() => {
    const el = hero.current;
    if (!el) return;
    const update = () => el.style.setProperty("--cv", (clamp(window.scrollY / (window.innerHeight * 0.9), 0, 1) * 0.72).toFixed(3));
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch({ ...emptyFilters, location: form.location, type: form.type as Filters["type"], price: form.price, beds: form.beds });
  };

  return (
    <header className="hero2" id="hero" ref={hero}>
      <video className="hv" id="hv" ref={video} autoPlay muted loop playsInline preload="metadata" poster={HERO_POSTER} disablePictureInPicture aria-hidden="true">
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="shade" />
      <SiteNav />
      <div className="wm">
        <h1 className="t">
          <span>verra</span>
          <span>estates</span>
        </h1>
      </div>
      <div className="lens" id="lens" ref={lens} aria-hidden="true">
        <canvas id="cv" ref={canvas} />
        <div className="ecw" id="ecw" ref={echo}>
          <div className="t">
            <span>verra</span>
            <span>estates</span>
          </div>
        </div>
      </div>
      <div className="ring" id="ring" ref={ring} aria-hidden="true" />
      <div className="edition">{t("Est. 2012 · Kyiv")}</div>
      <div className="intro">
        <p>{t("Spaces that shape the way we live.")}</p>
        <small>{t("Premium residences in Kyiv and the surrounding area.")}</small>
      </div>
      <form className="search glass light" id="hf" onSubmit={submit} aria-label={t("Search properties")}>
        <label>
          {t("Location")}
          <select value={form.location} onChange={set("location")} aria-label={t("Location")}>
            <option value="">{t("Any")}</option>
            {locations.map((l) => (
              <option key={l.name} value={l.name}>{t(l.name)}</option>
            ))}
          </select>
        </label>
        <label>
          {t("Type")}
          <select value={form.type} onChange={set("type")} aria-label={t("Type")}>
            <option value="">{t("Any")}</option>
            {PROPERTY_TYPES.map((ty) => (
              <option key={ty} value={ty}>{t(ty)}</option>
            ))}
          </select>
        </label>
        <label>
          {t("Price")}
          <select value={form.price} onChange={set("price")} aria-label={t("Price")}>
            <option value="">{t("Any")}</option>
            <option value="0-600000">{t("Up to €600k")}</option>
            <option value="600000-1500000">€600k–1.5M</option>
            <option value="1500000-99999999">€1.5M+</option>
          </select>
        </label>
        <label>
          {t("Bedrooms")}
          <select value={form.beds} onChange={set("beds")} aria-label={t("Bedrooms")}>
            <option value="">{t("Any")}</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </label>
        <button className="btn">
          {t("Search")} <i>↗</i>
        </button>
      </form>
    </header>
  );
}
