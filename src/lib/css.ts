import type { CSSProperties } from "react";

/** Typed helper for inline CSS custom properties: style={vars({ "--n": 3 })} */
export const vars = (v: Record<`--${string}`, string | number>): CSSProperties => v as CSSProperties;
