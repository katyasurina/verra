import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from "react";

/** Tiny History-API router (no dependency). Routes are matched in App.tsx. */
const listeners = new Set<() => void>();
const read = () => window.location.pathname + window.location.search + window.location.hash;
let snapshot = read();

const emit = () => {
  snapshot = read();
  listeners.forEach((l) => l());
};

window.addEventListener("popstate", emit);

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function navigate(to: string, opts: { replace?: boolean } = {}): void {
  const url = new URL(to, window.location.href);
  const next = url.pathname + url.search + url.hash;
  if (next === read()) return;
  window.history[opts.replace ? "replaceState" : "pushState"](null, "", next);
  emit();
}

export interface Loc {
  path: string;
  search: URLSearchParams;
  hash: string;
}

export function useLocation(): Loc {
  const s = useSyncExternalStore(subscribe, () => snapshot, () => "/");
  const url = new URL(s, "http://x");
  return { path: url.pathname.replace(/\/+$/, "") || "/", search: url.searchParams, hash: url.hash.slice(1) };
}

export function Link({ to, onClick, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === "_blank") return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={handle} {...rest} />;
}
