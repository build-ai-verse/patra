import type { ReactNode } from "react";
import type { SymbolId } from "@/lib/templates";
import type { Prims } from "./prims";

/**
 * Auspicious symbols for marriage biodata, drawn as vector paths so they render
 * identically in the HTML preview and the PDF. Each glyph uses a 100x100 viewBox.
 *
 *  main   - primary colour (usually gold)
 *  detail - secondary colour (usually the template accent)
 *  bg     - page background, used for cut-out details
 */
type Colors = { main: string; detail: string; bg: string };
type Glyph = (P: Prims, c: Colors) => ReactNode;

const circle = (cx: number, cy: number, r: number) =>
  `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (cx: number, cy: number, r: number, deg: number) =>
  `${(cx + r * Math.cos(rad(deg))).toFixed(2)} ${(cy + r * Math.sin(rad(deg))).toFixed(2)}`;

/* ---------------- Shree Ganesh ---------------- */
const ganesha: Glyph = (P, { main, detail, bg }) => (
  <>
    {/* Ears */}
    <P.Path d="M38 30 C22 14 4 28 9 46 C13 60 29 61 39 49 Z" fill={main} />
    <P.Path d="M62 30 C78 14 96 28 91 46 C87 60 71 61 61 49 Z" fill={main} />
    <P.Path d="M35 34 C24 25 13 33 15 45 C17 53 27 54 34 46 Z" fill={detail} />
    <P.Path d="M65 34 C76 25 87 33 85 45 C83 53 73 54 66 46 Z" fill={detail} />
    {/* Head */}
    <P.Path d={ellipse(50, 39, 15.5, 16)} fill={main} />
    {/* Crown (mukut) */}
    <P.Path d="M35 28 C36 16 42 9 50 6 C58 9 64 16 65 28 Z" fill={detail} />
    <P.Path d="M35 28 L65 28 L64 24 L36 24 Z" fill={main} />
    <P.Path d={circle(50, 4.5, 2.6)} fill={main} />
    <P.Path d={circle(50, 16, 2.2)} fill={main} />
    {/* Tilak & eyes */}
    <P.Path d="M48.5 30 L50 37 L51.5 30 Z" fill={detail} />
    <P.Path d={ellipse(43.5, 39.5, 2, 1.6)} fill={bg} />
    <P.Path d={ellipse(56.5, 39.5, 2, 1.6)} fill={bg} />
    <P.Path d={circle(43.5, 39.5, 0.9)} fill={detail} />
    <P.Path d={circle(56.5, 39.5, 0.9)} fill={detail} />
    {/* Trunk (curling to Ganesha's left) */}
    <P.Path d="M50 47 C50 60 53 66 59 72 C65 78 62 87 54 84" stroke={main} strokeWidth={8} />
    <P.Path d="M50 52 L49 53 M51.5 60 L50 61 M55 67 L53.5 68" stroke={bg} strokeWidth={1.2} />
    {/* Tusk */}
    <P.Path d="M43 50 C39 55 39 60 42.5 63" stroke={main} strokeWidth={3.2} />
    <P.Path d="M43 50.5 C40 55 40 59.5 42.5 62" stroke={bg} strokeWidth={1.4} />
  </>
);

/* ---------------- Lotus (Lakshmi) ---------------- */
const lotus: Glyph = (P, { main, detail, bg }) => (
  <>
    <P.Path d="M50 76 C32 77 14 69 5 55 C24 52 40 60 50 76 Z" fill={detail} />
    <P.Path d="M50 76 C68 77 86 69 95 55 C76 52 60 60 50 76 Z" fill={detail} />
    <P.Path d="M50 75 C35 69 24 54 22 34 C38 41 48 56 50 75 Z" fill={main} />
    <P.Path d="M50 75 C65 69 76 54 78 34 C62 41 52 56 50 75 Z" fill={main} />
    <P.Path d="M50 16 C62 34 62 58 50 75 C38 58 38 34 50 16 Z" fill={main} />
    <P.Path d="M50 26 C55 40 55 56 50 68" stroke={bg} strokeWidth={1.2} />
    <P.Path d="M30 44 C37 50 44 60 47 70 M70 44 C63 50 56 60 53 70" stroke={bg} strokeWidth={1} />
    <P.Path d="M24 84 Q37 79 50 84 Q63 89 76 84" stroke={detail} strokeWidth={2.2} />
    <P.Path d="M32 91 Q41 87 50 91 Q59 95 68 91" stroke={main} strokeWidth={1.6} />
  </>
);

/* ---------------- Flute & peacock feather (Krishna) ---------------- */
const krishna: Glyph = (P, { main, detail, bg }) => (
  <>
    {/* Peacock feather */}
    <P.Path d="M50 92 C54 70 60 50 66 30" stroke={main} strokeWidth={1.6} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const y = 82 - i * 8;
      const x = 52 + i * 2;
      return (
        <P.Path key={i} d={`M${x} ${y} C${x - 10} ${y - 4} ${x - 14} ${y - 10} ${x - 16} ${y - 16} M${x} ${y} C${x + 9} ${y - 5} ${x + 12} ${y - 11} ${x + 13} ${y - 17}`} stroke={main} strokeWidth={0.9} />
      );
    })}
    <P.Path d="M68 4 C84 10 88 32 72 42 C56 36 54 12 68 4 Z" fill={main} />
    <P.Path d="M69 12 C80 17 81 31 71 36 C61 31 60 17 69 12 Z" fill={detail} />
    <P.Path d="M70 19 C76 22 76 29 71 31 C66 29 65 22 70 19 Z" fill={bg} />
    <P.Path d={ellipse(70.5, 26, 2.6, 3.4)} fill={main} />
    {/* Flute */}
    <P.Path d="M10 80 L90 46" stroke={main} strokeWidth={7.5} />
    <P.Path d="M22 75 L25 73.7 M78 51 L81 49.8" stroke={detail} strokeWidth={7.6} />
    {[38, 46, 54, 62, 70].map((x) => {
      const y = 80 - ((x - 10) * 34) / 80;
      return <P.Path key={x} d={circle(x, y, 1.5)} fill={bg} />;
    })}
    {/* Tassel */}
    <P.Path d="M24 74 C22 82 26 86 22 92 M24 74 C28 81 30 85 29 92" stroke={detail} strokeWidth={1.4} />
  </>
);

/* ---------------- Trishul, damru & crescent (Shiv Parvati) ---------------- */
const shiva: Glyph = (P, { main, detail, bg }) => (
  <>
    {/* Crescent moon */}
    <P.Path d="M18 14 A13 13 0 1 0 31 33 A10 10 0 1 1 18 14 Z" fill={main} />
    {/* Trishul */}
    <P.Path d="M50 30 L50 96" stroke={main} strokeWidth={4.2} />
    <P.Path d="M50 3 L56 18 L50 30 L44 18 Z" fill={main} />
    <P.Path d="M31 14 C31 31 39 38 50 38 C61 38 69 31 69 14" stroke={main} strokeWidth={4} />
    <P.Path d="M27 17 L31 4 L35 17 Z M65 17 L69 4 L73 17 Z" fill={main} />
    <P.Path d="M44 40 L56 40 L56 44 L44 44 Z" fill={detail} />
    {/* Damru */}
    <P.Path d="M37 52 L63 52 L50 63 Z" fill={detail} />
    <P.Path d="M37 74 L63 74 L50 63 Z" fill={detail} />
    <P.Path d="M37 52 L63 52 M37 74 L63 74" stroke={main} strokeWidth={2} />
    <P.Path d="M44 63 L56 63" stroke={main} strokeWidth={2.4} />
    <P.Path d="M56 63 C64 64 66 70 70 72 M44 63 C36 62 34 56 30 55" stroke={main} strokeWidth={1.2} />
    <P.Path d={circle(71, 73, 2.2)} fill={main} />
    <P.Path d={circle(29, 54, 2.2)} fill={main} />
    <P.Path d="M41 55.5 L59 55.5 M41 70.5 L59 70.5" stroke={bg} strokeWidth={0.9} />
  </>
);

/* ---------------- Shankh (Vishnu) ---------------- */
const shankh: Glyph = (P, { main, detail, bg }) => (
  <>
    {/* Body with spire on top */}
    <P.Path d="M50 3 C55 10 58 16 61 21 C76 25 85 39 81 56 C77 72 65 84 55 94 C51 97 46 95 44 91 C34 80 21 68 21 52 C21 38 31 26 41 21 C44 15 46 9 50 3 Z" fill={main} />
    {/* Spire rings */}
    <P.Path d="M44.5 15 C48 17 53 17 57 15 M41 22 C47 25 56 25 62 22" stroke={bg} strokeWidth={1.6} />
    {/* Opening (aperture) */}
    <P.Path d="M60 36 C73 42 76 60 67 74 C63 80 57 83 54 79 C60 66 62 50 60 36 Z" fill={detail} />
    {/* Columella spiral */}
    <P.Path d="M36 38 C42 50 45 64 49 84 M30 50 C35 58 38 68 42 80" stroke={bg} strokeWidth={1.3} />
    <P.Path d="M28 46 L24 42 M27 58 L22 57 M31 70 L27 72" stroke={main} strokeWidth={3} />
  </>
);

/* ---------------- Sudarshan chakra (Vishnu) ---------------- */
const chakra: Glyph = (P, { main, detail, bg }) => {
  const teeth = Array.from({ length: 16 }, (_, i) => i * 22.5)
    .map((a) => `M ${pt(50, 50, 33, a - 8)} L ${pt(50, 50, 46, a + 4)} L ${pt(50, 50, 33, a + 10)} Z`)
    .join(" ");
  const spokes = Array.from({ length: 8 }, (_, i) => i * 45)
    .map((a) => `M ${pt(50, 50, 10, a)} L ${pt(50, 50, 27, a)}`)
    .join(" ");
  return (
    <>
      <P.Path d={teeth} fill={main} />
      <P.Path d={circle(50, 50, 33)} fill={main} />
      <P.Path d={circle(50, 50, 27)} fill={bg} />
      <P.Path d={spokes} stroke={detail} strokeWidth={3} />
      <P.Path d={circle(50, 50, 10)} fill={main} />
      <P.Path d={circle(50, 50, 4.5)} fill={detail} />
    </>
  );
};

function G({ P, glyph, size, c }: { P: Prims; glyph: Glyph; size: number; c: Colors }) {
  return (
    <P.Svg width={size} height={size} viewBox="0 0 100 100">
      {glyph(P, c)}
    </P.Svg>
  );
}

/** Height of the rendered symbol row (for layout calculations). */
export const symbolHeight = (id: SymbolId | undefined, size: number) => (!id || id === "none" ? 0 : size);

export function DivineSymbol({
  P,
  id,
  size,
  main,
  detail,
  bg,
}: {
  P: Prims;
  id: SymbolId | undefined;
  size: number;
} & Colors) {
  if (!id || id === "none") return null;
  const c = { main, detail, bg };
  const small = Math.round(size * 0.68);
  const row = (children: ReactNode) => (
    <P.V style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "center" }}>{children}</P.V>
  );
  const gap = { width: Math.round(size * 0.12) };
  switch (id) {
    case "ganesha":
      return row(<G P={P} glyph={ganesha} size={size} c={c} />);
    case "lakshmi-ganesha":
      return row(
        <>
          <G P={P} glyph={lotus} size={small} c={c} />
          <P.V style={gap} />
          <G P={P} glyph={ganesha} size={size} c={c} />
          <P.V style={gap} />
          <G P={P} glyph={lotus} size={small} c={c} />
        </>,
      );
    case "radha-krishna":
      return row(<G P={P} glyph={krishna} size={size} c={c} />);
    case "shiv-parvati":
      return row(<G P={P} glyph={shiva} size={size} c={c} />);
    case "vishnu-lakshmi":
      return row(
        <>
          <G P={P} glyph={shankh} size={small} c={c} />
          <P.V style={gap} />
          <G P={P} glyph={lotus} size={size} c={c} />
          <P.V style={gap} />
          <G P={P} glyph={chakra} size={small} c={c} />
        </>,
      );
  }
}
