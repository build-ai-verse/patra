import type { ReactNode } from "react";
import type { BiodataData, ResumeData } from "@/lib/templates";

/**
 * Rendering primitives shared by the HTML preview and the PDF renderer.
 * Templates are written ONCE against this interface; units are A4 points
 * (page = 595 x 842) and the HTML preview renders them 1:1 as CSS px, then scales.
 *
 * Rules for template authors (so both renderers agree):
 *  - Only put strings inside <T>/<TS>; never raw strings inside <V>.
 *  - Avoid padding/marginHorizontal/Vertical shorthands; use explicit sides.
 *  - Borders: use borderXWidth / borderXColor / borderXStyle (not the shorthand string).
 *  - fontFamily must be one of: "Poppins" | "Playfair" | "Cormorant".
 */
export type Style = Record<string, string | number | undefined>;

export interface Prims {
  Page: (p: { style?: Style; children?: ReactNode }) => ReactNode;
  V: (p: { style?: Style; fixed?: boolean; wrap?: boolean; children?: ReactNode }) => ReactNode;
  /** Block-level text */
  T: (p: { style?: Style; children?: ReactNode }) => ReactNode;
  /** Inline text nested inside T */
  TS: (p: { style?: Style; children?: ReactNode }) => ReactNode;
  Img: (p: { src: string; style?: Style }) => ReactNode;
  Svg: (p: { width: number; height: number; viewBox: string; style?: Style; children?: ReactNode }) => ReactNode;
  Path: (p: { d: string; fill?: string; stroke?: string; strokeWidth?: number }) => ReactNode;
}

export interface BiodataDoc {
  accent: string;
  data: BiodataData;
}
export interface ResumeDoc {
  accent: string;
  data: ResumeData;
}

/** Mix a hex colour with white (amount 0 = original, 1 = white). */
export function tint(hex: string, amount: number, target = "#ffffff") {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(hex);
  const [r2, g2, b2] = p(target);
  const m = (a: number, b: number) => Math.round(a + (b - a) * amount).toString(16).padStart(2, "0");
  return `#${m(r1, r2)}${m(g1, g2)}${m(b1, b2)}`;
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || "?";

export const lines = (s: string) =>
  s
    .split("\n")
    .map((x) => x.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

export const list = (s: string) =>
  s
    .split(/[,\n]/)
    .map((x) => x.trim())
    .filter(Boolean);
