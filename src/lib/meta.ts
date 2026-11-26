import { useEffect } from "react";

const setMeta = (sel: string, attr: string, value: string) => {
  const el = document.head.querySelector<HTMLMetaElement>(sel);
  if (el) el.setAttribute(attr, value);
};

/** Per-page title, description, link-preview image and optional JSON-LD (client side). */
export function usePageMeta(title: string, description: string, image?: string, jsonLd?: object): void {
  const ld = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", window.location.origin + window.location.pathname);
    if (image) setMeta('meta[property="og:image"]', "content", image);
    let node: HTMLScriptElement | null = null;
    if (ld) {
      node = document.createElement("script");
      node.type = "application/ld+json";
      node.textContent = ld;
      document.head.appendChild(node);
    }
    return () => {
      node?.remove();
    };
  }, [title, description, image, ld]);
}
