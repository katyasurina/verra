/** Optional Google Analytics 4. Set VITE_GA_ID (for example G-XXXXXXXXXX) in Vercel → Environment Variables. */
type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const id = import.meta.env.VITE_GA_ID as string | undefined;

export function initAnalytics(): void {
  if (!id || window.gtag) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });
}

export const pageview = (path: string, title: string): void => window.gtag?.("event", "page_view", { page_path: path, page_title: title });
export const track = (name: string, params: Record<string, unknown> = {}): void => window.gtag?.("event", name, params);
