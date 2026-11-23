import type { CSSProperties } from "react";
import type { Prims, Style } from "./prims";

/** DOM implementation of the template primitives (1 pt == 1 CSS px, scaled by the frame). */

const FONT: Record<string, string> = {
  Poppins: "var(--font-poppins), var(--font-hind), system-ui, sans-serif",
  Playfair: "var(--font-playfair), var(--font-martel), Georgia, serif",
  Cormorant: "var(--font-cormorant), var(--font-martel), Georgia, serif",
};

const css = (s: Style | undefined, base?: CSSProperties): CSSProperties => {
  const out: Record<string, unknown> = { ...base, ...s };
  if (s?.fontFamily) out.fontFamily = FONT[String(s.fontFamily)] ?? s.fontFamily;
  return out as CSSProperties;
};

export const htmlPrims: Prims = {
  Page: ({ style, children }) => (
    <div
      style={css(style, {
        position: "relative",
        width: 595,
        minHeight: 842,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        lineHeight: 1.25,
      })}
    >
      {children}
    </div>
  ),
  V: ({ style, children }) => (
    <div style={css(style, { position: "relative", display: "flex", flexDirection: "column", boxSizing: "border-box", minWidth: 0 })}>
      {children}
    </div>
  ),
  T: ({ style, children }) => (
    <div style={css(style, { position: "relative", whiteSpace: "pre-wrap", overflowWrap: "anywhere" })}>{children}</div>
  ),
  TS: ({ style, children }) => <span style={css(style)}>{children}</span>,
  // eslint-disable-next-line @next/next/no-img-element
  Img: ({ src, style }) => <img src={src} alt="" style={css(style, { position: "relative", display: "block" })} />,
  Svg: ({ width, height, viewBox, style, children }) => (
    <svg width={width} height={height} viewBox={viewBox} style={css(style, { display: "block", flexShrink: 0 })}>
      {children}
    </svg>
  ),
  Path: ({ d, fill, stroke, strokeWidth }) => (
    <path d={d} fill={fill ?? "none"} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  ),
};
