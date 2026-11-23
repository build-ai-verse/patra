import type { BiodataDoc, Prims } from "./prims";
import { initials, tint } from "./prims";
import { DivineSymbol, symbolHeight } from "./DivineSymbol";

const INK = "#1F1A1C";

export function BiodataLotus({ doc, P }: { doc: BiodataDoc; P: Prims }) {
  const { data, accent } = doc;
  const hi = data.lang === "hi"; // no letter-spacing for Devanagari
  const soft = tint(accent, 0.88);
  const softer = tint(accent, 0.95);
  const line = tint(accent, 0.72);
  return (
    <P.Page
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: 24,
        paddingBottom: 34,
        paddingLeft: 40,
        paddingRight: 40,
        fontFamily: "Poppins",
        fontSize: 9.3,
        lineHeight: 1.3,
        color: INK,
      }}
    >
      {/* Soft header band with decorative circles */}
      <P.V style={{ position: "absolute", top: 0, left: 0, right: 0, height: 150, backgroundColor: soft }} />
      <P.V
        style={{
          position: "absolute",
          top: -70,
          left: -60,
          width: 190,
          height: 190,
          borderRadius: 95,
          backgroundColor: tint(accent, 0.8),
        }}
      />
      <P.V
        style={{
          position: "absolute",
          top: -40,
          right: -30,
          width: 130,
          height: 130,
          borderRadius: 65,
          backgroundColor: tint(accent, 0.8),
        }}
      />
      <P.V
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: accent,
        }}
      />

      <DivineSymbol P={P} id={data.symbol} size={40} main={accent} detail="#B8862F" bg={soft} />
      {data.headerText.trim() ? (
        <P.T
          style={{
            textAlign: "center",
            fontWeight: 500,
            fontSize: 8.5,
            color: accent,
            letterSpacing: hi ? 0 : 1.5,
          }}
        >
          {data.headerText}
        </P.T>
      ) : null}

      {/* Photo / initials */}
      <P.V style={{ alignItems: "center", marginTop: Math.max(6, (data.headerText.trim() ? 50 : 62) - symbolHeight(data.symbol, 40)) }}>
        <P.V
          style={{
            width: 114,
            height: 114,
            borderRadius: 57,
            backgroundColor: "#FFFFFF",
            padding: 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data.photo ? (
            <P.Img src={data.photo} style={{ width: 106, height: 106, borderRadius: 53, objectFit: "cover" }} />
          ) : (
            <P.V
              style={{
                width: 106,
                height: 106,
                borderRadius: 53,
                backgroundColor: accent,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <P.T style={{ fontFamily: "Playfair", fontWeight: 700, fontSize: 34, color: "#FFFFFF" }}>
                {initials(data.name)}
              </P.T>
            </P.V>
          )}
        </P.V>
        <P.T
          style={{
            fontFamily: "Playfair",
            fontWeight: 700,
            fontSize: 24,
            textAlign: "center",
            marginTop: 8,
            color: INK,
          }}
        >
          {data.name}
        </P.T>
        <P.T
          style={{
            fontWeight: 600,
            fontSize: 8.5,
            color: accent,
            letterSpacing: hi ? 0 : 3,
            textTransform: "uppercase",
            textAlign: "center",
            marginTop: 2,
          }}
        >
          {data.title || "Biodata"}
        </P.T>
        <P.V style={{ width: 40, height: 2, borderRadius: 1, backgroundColor: accent, marginTop: 7 }} />
      </P.V>

      {data.sections.map((s) => (
        <P.V
          key={s.id}
          wrap={false}
          style={{
            marginTop: 12,
            backgroundColor: softer,
            borderRadius: 10,
            paddingTop: 10,
            paddingBottom: 9,
            paddingLeft: 14,
            paddingRight: 14,
          }}
        >
          <P.V
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 5,
              marginBottom: 3,
              borderBottomWidth: 0.6,
              borderBottomColor: line,
              borderBottomStyle: "solid",
            }}
          >
            <P.V style={{ width: 4, height: 11, borderRadius: 2, backgroundColor: accent, marginRight: 6 }} />
            <P.T
              style={{
                fontWeight: 600,
                fontSize: 10,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: hi ? 0 : 1.2,
              }}
            >
              {s.title}
            </P.T>
          </P.V>
          <P.V style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {s.fields
              .filter((f) => f.value.trim() || f.label.trim())
              .map((f) => (
                <P.V
                  key={f.id}
                  style={{
                    width: f.value.length > 42 ? "100%" : "50%",
                    paddingTop: 3.5,
                    paddingBottom: 3.5,
                    paddingRight: 8,
                  }}
                >
                  <P.T
                    style={{
                      fontSize: hi ? 8 : 7.2,
                      color: "#8A7A80",
                      textTransform: "uppercase",
                      letterSpacing: hi ? 0 : 0.6,
                    }}
                  >
                    {f.label}
                  </P.T>
                  <P.T style={{ fontWeight: 500, marginTop: 1, lineHeight: 1.3 }}>{f.value}</P.T>
                </P.V>
              ))}
          </P.V>
        </P.V>
      ))}
    </P.Page>
  );
}
