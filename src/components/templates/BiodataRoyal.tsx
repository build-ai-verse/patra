import type { BioSection } from "@/lib/templates";
import type { BiodataDoc, Prims } from "./prims";
import { DivineSymbol } from "./DivineSymbol";

const GOLD = "#B8862F";
const INK = "#2A1A1F";
const MUTED = "#6B5A5F";

/** Mirror a top-left ornament path into any corner of a 44x44 box. */
function cornerPath(d: string, flipX: boolean, flipY: boolean) {
  let i = 0;
  return d.replace(/-?\d+(\.\d+)?/g, (n) => {
    const v = Number(n);
    const isX = i++ % 2 === 0;
    return String(isX ? (flipX ? 44 - v : v) : flipY ? 44 - v : v);
  });
}

const ORN_OUTER = "M 2 44 L 2 13 Q 2 2 13 2 L 44 2";
const ORN_INNER = "M 7 44 L 7 16 Q 7 7 16 7 L 44 7";
const ORN_DIAMOND = "M 15 10 L 20 15 L 15 20 L 10 15 Z";

function Corner({ P, pos }: { P: Prims; pos: "tl" | "tr" | "bl" | "br" }) {
  const fx = pos === "tr" || pos === "br";
  const fy = pos === "bl" || pos === "br";
  const style = {
    position: "absolute",
    width: 44,
    height: 44,
    ...(fy ? { bottom: 24 } : { top: 24 }),
    ...(fx ? { right: 24 } : { left: 24 }),
  };
  return (
    <P.V fixed style={style}>
      <P.Svg width={44} height={44} viewBox="0 0 44 44">
        <P.Path d={cornerPath(ORN_OUTER, fx, fy)} stroke={GOLD} strokeWidth={1.4} fill="none" />
        <P.Path d={cornerPath(ORN_INNER, fx, fy)} stroke={GOLD} strokeWidth={0.6} fill="none" />
        <P.Path d={cornerPath(ORN_DIAMOND, fx, fy)} fill={GOLD} />
      </P.Svg>
    </P.V>
  );
}

function Diamond({ P, size, color }: { P: Prims; size: number; color: string }) {
  return (
    <P.Svg width={size} height={size} viewBox="0 0 10 10">
      <P.Path d="M 5 0 L 10 5 L 5 10 L 0 5 Z" fill={color} />
    </P.Svg>
  );
}

function Heading({ P, title, accent, hi }: { P: Prims; title: string; accent: string; hi: boolean }) {
  return (
    <P.V style={{ flexDirection: "row", alignItems: "center", marginTop: 14, marginBottom: 6 }}>
      <Diamond P={P} size={7} color={GOLD} />
      <P.T
        style={{
          fontFamily: "Playfair",
          fontWeight: 700,
          fontSize: 12.5,
          color: accent,
          textTransform: "uppercase",
          letterSpacing: hi ? 0 : 1.5,
          marginLeft: 6,
        }}
      >
        {title}
      </P.T>
      <P.V
        style={{
          flexGrow: 1,
          marginLeft: 8,
          borderBottomWidth: 0.7,
          borderBottomColor: GOLD,
          borderBottomStyle: "solid",
        }}
      />
    </P.V>
  );
}

function Fields({ P, section }: { P: Prims; section: BioSection }) {
  return (
    <P.V>
      {section.fields
        .filter((f) => f.value.trim() || f.label.trim())
        .map((f) => (
          <P.V key={f.id} style={{ flexDirection: "row", paddingTop: 2.6, paddingBottom: 2.6 }}>
            <P.T style={{ width: "38%", color: MUTED }}>{f.label}</P.T>
            <P.T style={{ width: 10, color: MUTED }}>:</P.T>
            <P.T style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, fontWeight: 500, lineHeight: 1.35 }}>
              {f.value}
            </P.T>
          </P.V>
        ))}
    </P.V>
  );
}

export function BiodataRoyal({ doc, P }: { doc: BiodataDoc; P: Prims }) {
  const { data, accent } = doc;
  // Devanagari letters join along a top line, so letter-spacing must be off for Hindi.
  const hi = data.lang === "hi";
  const [first, ...rest] = data.sections;
  return (
    <P.Page
      style={{
        backgroundColor: "#FFFBF3",
        paddingTop: 46,
        paddingBottom: 46,
        paddingLeft: 52,
        paddingRight: 52,
        fontFamily: "Poppins",
        fontSize: 9.4,
        lineHeight: 1.3,
        color: INK,
      }}
    >
      {/* Frame */}
      <P.V
        fixed
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          right: 14,
          bottom: 14,
          borderWidth: 2.5,
          borderColor: accent,
          borderStyle: "solid",
        }}
      />
      <P.V
        fixed
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
          borderWidth: 0.8,
          borderColor: GOLD,
          borderStyle: "solid",
        }}
      />
      <Corner P={P} pos="tl" />
      <Corner P={P} pos="tr" />
      <Corner P={P} pos="bl" />
      <Corner P={P} pos="br" />

      {/* Title block */}
      <P.V style={{ alignItems: "center" }}>
        <P.V style={{ marginTop: -8, marginBottom: 2 }}>
          <DivineSymbol P={P} id={data.symbol} size={54} main={GOLD} detail={accent} bg="#FFFBF3" />
        </P.V>
        {data.headerText.trim() ? (
          <P.T
            style={{
              fontFamily: "Cormorant",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 12.5,
              color: accent,
              letterSpacing: hi ? 0 : 1,
              textAlign: "center",
            }}
          >
            {data.headerText}
          </P.T>
        ) : null}
        <P.T
          style={{
            fontFamily: "Playfair",
            fontWeight: 700,
            fontSize: 28,
            color: accent,
            letterSpacing: hi ? 0 : 5,
            textTransform: "uppercase",
            textAlign: "center",
            marginTop: 4,
          }}
        >
          {data.title || "Biodata"}
        </P.T>
        <P.V style={{ flexDirection: "row", alignItems: "center", width: 170, marginTop: 6 }}>
          <P.V style={{ flexGrow: 1, borderBottomWidth: 0.8, borderBottomColor: GOLD, borderBottomStyle: "solid" }} />
          <P.V style={{ marginLeft: 6, marginRight: 6 }}>
            <Diamond P={P} size={8} color={GOLD} />
          </P.V>
          <P.V style={{ flexGrow: 1, borderBottomWidth: 0.8, borderBottomColor: GOLD, borderBottomStyle: "solid" }} />
        </P.V>
        {data.name.trim() ? (
          <P.T
            style={{
              fontFamily: "Cormorant",
              fontWeight: 700,
              fontSize: 22,
              color: INK,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            {data.name}
          </P.T>
        ) : null}
      </P.V>

      {/* First section with photo */}
      {first ? (
        <P.V style={{ flexDirection: "row" }}>
          <P.V style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
            <Heading P={P} title={first.title} accent={accent} hi={hi} />
            <Fields P={P} section={first} />
          </P.V>
          {data.photo ? (
            <P.V style={{ width: 118, marginLeft: 16, marginTop: 30 }}>
              <P.V
                style={{
                  borderWidth: 1.5,
                  borderColor: GOLD,
                  borderStyle: "solid",
                  padding: 3,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <P.Img src={data.photo} style={{ width: 109, height: 140, objectFit: "cover" }} />
              </P.V>
            </P.V>
          ) : null}
        </P.V>
      ) : null}

      {rest.map((s) => (
        <P.V key={s.id} wrap={false}>
          <Heading P={P} title={s.title} accent={accent} hi={hi} />
          <Fields P={P} section={s} />
        </P.V>
      ))}
    </P.Page>
  );
}
