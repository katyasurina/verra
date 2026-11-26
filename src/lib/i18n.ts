import { useSyncExternalStore } from "react";
import { ua } from "../data/ua";

export type Lang = "en" | "ua";

const KEY = "verra:lang";
const listeners = new Set<() => void>();

function initial(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "ua") return saved;
  } catch {
    /* ignore */
  }
  return /^uk|^ru/i.test(navigator.language) ? "ua" : "en";
}

let current: Lang = typeof window === "undefined" ? "en" : initial();
if (typeof document !== "undefined") document.documentElement.lang = current === "ua" ? "uk" : "en";

export function setLang(l: Lang): void {
  if (l === current) return;
  current = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = l === "ua" ? "uk" : "en";
  listeners.forEach((cb) => cb());
}

/** Translate an English UI string. Unknown strings fall back to English. */
export const translate = (s: string, lang: Lang = current): string => (lang === "ua" ? ua[s] ?? s : s);

export function useLang(): Lang {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
    () => "en" as Lang,
  );
}

/** Hook returning t(); components using it re-render when the language changes. */
export function useT(): (s: string) => string {
  const lang = useLang();
  return (s: string) => translate(s, lang);
}
