import "server-only";
import path from "node:path";
import { Fragment, createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Document, Font, Image, Page, Path, Svg, Text, View, renderToBuffer } from "@react-pdf/renderer";
import type { Prims, Style } from "@/components/templates/prims";
import { RenderDocument } from "@/components/templates";
import type { DocumentPayload } from "@/lib/templates";
import { getTemplate } from "@/lib/templates";
import { brandFull, site } from "@/config/site";

/* ---------- Fonts (static WOFF files in /assets/fonts) ---------- */
// The flag lives on globalThis because @react-pdf's font store survives dev hot-reloads;
// registering the same families twice corrupts font resolution.
const g = globalThis as { __patraFontsReady?: boolean };
function registerFonts() {
  if (g.__patraFontsReady) return;
  const f = (name: string) => path.join(process.cwd(), "assets", "fonts", `${name}.woff`);
  Font.register({
    family: "Poppins",
    fonts: [
      { src: f("poppins-latin-400-normal"), fontWeight: 400 },
      { src: f("poppins-latin-500-normal"), fontWeight: 500 },
      { src: f("poppins-latin-600-normal"), fontWeight: 600 },
      { src: f("poppins-latin-700-normal"), fontWeight: 700 },
    ],
  });
  Font.register({
    family: "Playfair",
    fonts: [
      { src: f("playfair-display-latin-400-normal"), fontWeight: 400 },
      { src: f("playfair-display-latin-700-normal"), fontWeight: 700 },
      { src: f("playfair-display-latin-400-italic"), fontWeight: 400, fontStyle: "italic" },
    ],
  });
  Font.register({
    family: "Cormorant",
    fonts: [
      { src: f("cormorant-garamond-latin-500-normal"), fontWeight: 500 },
      { src: f("cormorant-garamond-latin-700-normal"), fontWeight: 700 },
      { src: f("cormorant-garamond-latin-500-italic"), fontWeight: 500, fontStyle: "italic" },
    ],
  });

  // Devanagari (Hindi/Marathi) fallbacks. Italic entries reuse the upright files because
  // these families have no italics and react-pdf needs every requested style registered.
  const both = (src: string, fontWeight: number) => [
    { src: f(src), fontWeight },
    { src: f(src), fontWeight, fontStyle: "italic" as const },
  ];
  Font.register({
    family: "HindDeva",
    fonts: [
      ...both("hind-devanagari-400-normal", 400),
      ...both("hind-devanagari-500-normal", 500),
      ...both("hind-devanagari-600-normal", 600),
      ...both("hind-devanagari-700-normal", 700),
    ],
  });
  Font.register({
    family: "SerifDeva",
    fonts: [
      ...both("martel-devanagari-400-normal", 400),
      ...both("martel-devanagari-600-normal", 500),
      ...both("martel-devanagari-700-normal", 700),
    ],
  });
  // Hyphenation splits words for text extraction/ATS ("appli-" + "cations", "github.com/rahul-" + "verma"),
  // so only very long words may break, and URLs/emails/numbers never do.
  // textkit passes its built-in hyphenator as a 2nd argument (not in the public type).
  Font.registerHyphenationCallback((word: string, hyphenate?: (w: string) => string[]) =>
    word.length <= 16 || /[@/]|\.[a-z]|\d/i.test(word) || !hyphenate ? [word] : hyphenate(word),
  );
  g.__patraFontsReady = true;
}

/* ---------- Text cleanup: normalise typographic punctuation ---------- */
const clean = (s: string) =>
  s
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-");

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Templates are written against marker primitives below. Before rendering, we expand the
 * template tree ourselves (all template components are pure functions) and convert markers
 * into react-pdf elements, passing inherited text settings down explicitly.
 *
 * Why: react-pdf resolves a unitless lineHeight against the element's OWN fontSize
 * (default 18) and children inherit the absolute value, whereas CSS inherits the multiplier.
 * We give every Text an absolute lineHeight so the PDF matches the HTML preview.
 */
const M = {
  Page: (() => null) as Prims["Page"],
  V: (() => null) as Prims["V"],
  T: (() => null) as Prims["T"],
  TS: (() => null) as Prims["TS"],
  Img: (() => null) as Prims["Img"],
  Svg: (() => null) as Prims["Svg"],
  Path: (() => null) as Prims["Path"],
};
const markerPrims: Prims = M;

type Inh = { fs: number; lh: number };

/** Each Latin family falls back to a matching Devanagari family, per character. */
const FONT_STACK: Record<string, string[]> = {
  Poppins: ["Poppins", "HindDeva"],
  Playfair: ["Playfair", "SerifDeva"],
  Cormorant: ["Cormorant", "SerifDeva"],
};

const strip = (st?: Style) => {
  if (!st) return {} as any;
  const { lineHeight: _lh, ...rest } = st;
  void _lh;
  if (typeof rest.fontFamily === "string" && FONT_STACK[rest.fontFamily]) {
    (rest as any).fontFamily = FONT_STACK[rest.fontFamily];
  }
  return rest as any;
};

function expand(node: ReactNode, inh: Inh): ReactNode {
  if (node == null || typeof node === "boolean") return null;
  if (typeof node === "string") return clean(node);
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map((n) => expand(n, inh));
  if (!isValidElement(node)) return null;

  const el = node as ReactElement<any>;
  const { type, props, key } = el;
  if (type === Fragment) return createElement(Fragment, { key }, expand(props.children, inh));

  const style: Style | undefined = props.style;
  const next: Inh = {
    fs: typeof style?.fontSize === "number" ? style.fontSize : inh.fs,
    lh: typeof style?.lineHeight === "number" ? style.lineHeight : inh.lh,
  };
  const textStyle = { ...strip(style), lineHeight: `${(next.fs * next.lh).toFixed(2)}pt` };
  const kids = () => expand(props.children, next);

  switch (type) {
    case M.Page:
      return createElement(Page, { key, size: "A4", style: strip(style), wrap: true }, kids());
    case M.V:
      return createElement(View, { key, style: strip(style), fixed: props.fixed, wrap: props.wrap }, kids());
    case M.T:
    case M.TS:
      return createElement(Text, { key, style: textStyle }, kids());
    case M.Img:
      return createElement(Image, { key, src: props.src, style: strip(style) });
    case M.Svg:
      return createElement(
        Svg,
        { key, width: props.width, height: props.height, viewBox: props.viewBox, style: strip(style) },
        expand(props.children, next),
      );
    case M.Path:
      return createElement(Path, {
        key,
        d: props.d,
        fill: props.fill ?? "none",
        stroke: props.stroke,
        strokeWidth: props.strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      });
  }
  if (typeof type === "function") {
    const out = (type as (p: any) => ReactNode)(props);
    const expanded = expand(out, inh);
    return key != null ? createElement(Fragment, { key }, expanded) : expanded;
  }
  return null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function renderPdf(doc: DocumentPayload): Promise<Buffer> {
  registerFonts();
  const t = getTemplate(doc.templateId)!;
  const name = doc.data.name || t.name;
  return renderToBuffer(
    <Document
      title={`${name} - ${t.kind === "biodata" ? "Marriage Biodata" : "Resume"}`}
      author={name}
      creator={`${brandFull} (${site.url})`}
      producer={`${brandFull} - Powered by ${site.poweredBy}`}
    >
      {expand(<RenderDocument doc={doc} P={markerPrims} />, { fs: 12, lh: 1.2 })}
    </Document>,
  );
}

export function pdfFilename(doc: DocumentPayload) {
  const t = getTemplate(doc.templateId)!;
  const base = (doc.data.name || "document").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return `${base}-${t.kind === "biodata" ? "Biodata" : "Resume"}.pdf`;
}
