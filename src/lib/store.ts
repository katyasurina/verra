import { useSyncExternalStore } from "react";

/** A small persisted list of ids (favourites, compare list). */
function listStore(key: string, max = Infinity) {
  const listeners = new Set<() => void>();
  let ids: number[] = [];
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    if (Array.isArray(raw)) ids = raw.filter((n) => Number.isInteger(n));
  } catch {
    /* private mode: keep it in memory */
  }
  const save = () => {
    try {
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
  };
  return {
    get: () => ids,
    subscribe: (cb: () => void) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    /** returns false when the list is full */
    toggle(id: number): boolean {
      if (ids.includes(id)) ids = ids.filter((x) => x !== id);
      else if (ids.length >= max) return false;
      else ids = [...ids, id];
      save();
      return true;
    },
    remove(id: number) {
      ids = ids.filter((x) => x !== id);
      save();
    },
    clear() {
      ids = [];
      save();
    },
  };
}

export const favorites = listStore("verra:fav");
export const compare = listStore("verra:cmp", 3);

export const useFavorites = (): number[] => useSyncExternalStore(favorites.subscribe, favorites.get, () => []);
export const useCompare = (): number[] => useSyncExternalStore(compare.subscribe, compare.get, () => []);

/* ---- toast ---- */
let toastText = "";
const toastListeners = new Set<() => void>();
let toastTimer = 0;
export function toast(text: string): void {
  toastText = text;
  toastListeners.forEach((l) => l());
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastText = "";
    toastListeners.forEach((l) => l());
  }, 2600);
}
export const useToast = (): string =>
  useSyncExternalStore(
    (cb) => {
      toastListeners.add(cb);
      return () => toastListeners.delete(cb);
    },
    () => toastText,
    () => "",
  );

/* ---- inquiry dialog request ---- */
export interface InquiryRequest {
  title: string;
  subtitle: string;
  /** text put in the message field */
  note?: string;
  /** property the request is about */
  propertyId?: number;
  /** new object per opening so the same text can be requested twice */
  key: number;
}
export const DEFAULT_INQUIRY = {
  title: "Request a private viewing",
  subtitle: "Leave your details. An advisor replies within one working day.",
};
let inquiry: InquiryRequest | null = null;
const inquiryListeners = new Set<() => void>();
export function openInquiry(r: Partial<Omit<InquiryRequest, "key">> = {}): void {
  inquiry = { title: r.title ?? DEFAULT_INQUIRY.title, subtitle: r.subtitle ?? DEFAULT_INQUIRY.subtitle, note: r.note, propertyId: r.propertyId, key: Date.now() };
  inquiryListeners.forEach((l) => l());
}
export const useInquiryRequest = (): InquiryRequest | null =>
  useSyncExternalStore(
    (cb) => {
      inquiryListeners.add(cb);
      return () => inquiryListeners.delete(cb);
    },
    () => inquiry,
    () => null,
  );
