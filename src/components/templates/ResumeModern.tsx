import type { ReactNode } from "react";
import type { Prims, ResumeDoc } from "./prims";
import { initials, lines, list, tint } from "./prims";

const INK = "#111827";
const BODY = "#374151";
const MUTED = "#6B7280";
const SIDEBAR = 190;

function SideHeading({ P, children, accent }: { P: Prims; children: string; accent: string }) {
  return (
    <P.T
      style={{
        fontWeight: 600,
        fontSize: 9,
        color: "#FFFFFF",
        textTransform: "uppercase",
        letterSpacing: 0,
        marginTop: 16,
        marginBottom: 6,
        paddingBottom: 4,
        borderBottomWidth: 0.6,
        borderBottomColor: tint(accent, 0.45),
        borderBottomStyle: "solid",
      }}
    >
      {children}
    </P.T>
  );
}

function MainSection({ P, title, accent, children }: { P: Prims; title: string; accent: string; children: ReactNode }) {
  return (
    <P.V style={{ marginTop: 15 }}>
      <P.V style={{ width: 22, height: 3, borderRadius: 2, backgroundColor: accent, marginBottom: 4 }} />
      <P.T
        style={{
          fontWeight: 600,
          fontSize: 11,
          color: INK,
          textTransform: "uppercase",
          letterSpacing: 0,
          marginBottom: 6,
        }}
      >
        {title}
      </P.T>
      {children}
    </P.V>
  );
}

export function ResumeModern({ doc, P }: { doc: ResumeDoc; P: Prims }) {
  const { data: d, accent } = doc;
  const light = tint(accent, 0.7);
  const chip = tint(accent, 0.18);
  const contact: [string, string][] = (
    [
      ["Phone", d.phone],
      ["Email", d.email],
      ["Location", d.location],
      ["LinkedIn", d.linkedin],
      ["Website", d.website],
    ] as [string, string][]
  ).filter(([, v]) => v.trim());
  const skills = list(d.skills);
  const langs = list(d.languages);
  const certs = lines(d.certifications);

  return (
    <P.Page style={{ backgroundColor: "#FFFFFF", fontFamily: "Poppins", fontSize: 9, lineHeight: 1.35, color: BODY }}>
      <P.V fixed style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: SIDEBAR, backgroundColor: accent }} />
      <P.V style={{ flexDirection: "row", flexGrow: 1 }}>
        {/* Sidebar */}
        <P.V
          style={{
            width: SIDEBAR,
            paddingTop: 30,
            paddingBottom: 30,
            paddingLeft: 18,
            paddingRight: 18,
            color: "#FFFFFF",
          }}
        >
          <P.V style={{ alignItems: "center" }}>
            <P.V
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: light,
                padding: 3,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {d.photo ? (
                <P.Img src={d.photo} style={{ width: 94, height: 94, borderRadius: 47, objectFit: "cover" }} />
              ) : (
                <P.T style={{ fontFamily: "Playfair", fontWeight: 700, fontSize: 32, color: accent }}>
                  {initials(d.name)}
                </P.T>
              )}
            </P.V>
          </P.V>

          {contact.length ? (
            <P.V>
              <SideHeading P={P} accent={accent}>
                Contact
              </SideHeading>
              {contact.map(([k, v]) => (
                <P.V key={k} style={{ marginBottom: 6 }}>
                  <P.T style={{ fontSize: 6.8, color: light, textTransform: "uppercase", letterSpacing: 0 }}>{k}</P.T>
                  <P.T style={{ fontSize: 8.3, color: "#FFFFFF", lineHeight: 1.35 }}>{v}</P.T>
                </P.V>
              ))}
            </P.V>
          ) : null}

          {skills.length ? (
            <P.V>
              <SideHeading P={P} accent={accent}>
                Skills
              </SideHeading>
              <P.V style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {skills.map((s) => (
                  <P.V
                    key={s}
                    style={{
                      backgroundColor: chip,
                      borderRadius: 3,
                      paddingTop: 2.5,
                      paddingBottom: 2.5,
                      paddingLeft: 6,
                      paddingRight: 6,
                      marginRight: 4,
                      marginBottom: 4,
                    }}
                  >
                    <P.T style={{ fontSize: 7.8, color: "#FFFFFF" }}>{s}</P.T>
                  </P.V>
                ))}
              </P.V>
            </P.V>
          ) : null}

          {d.education.length ? (
            <P.V>
              <SideHeading P={P} accent={accent}>
                Education
              </SideHeading>
              {d.education.map((e) => (
                <P.V key={e.id} style={{ marginBottom: 7 }}>
                  <P.T style={{ fontWeight: 600, fontSize: 8.5, color: "#FFFFFF", lineHeight: 1.3 }}>{e.degree}</P.T>
                  <P.T style={{ fontSize: 8, color: light, lineHeight: 1.3 }}>{e.institute}</P.T>
                  <P.T style={{ fontSize: 7.6, color: light }}>{[e.year, e.score].filter(Boolean).join("  ·  ")}</P.T>
                </P.V>
              ))}
            </P.V>
          ) : null}

          {langs.length ? (
            <P.V>
              <SideHeading P={P} accent={accent}>
                Languages
              </SideHeading>
              <P.T style={{ fontSize: 8.3, color: "#FFFFFF", lineHeight: 1.5 }}>{langs.join("  ·  ")}</P.T>
            </P.V>
          ) : null}
        </P.V>

        {/* Main */}
        <P.V
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
            paddingTop: 34,
            paddingBottom: 30,
            paddingLeft: 26,
            paddingRight: 30,
          }}
        >
          <P.T style={{ fontFamily: "Playfair", fontWeight: 700, fontSize: 26, color: INK, lineHeight: 1.15 }}>
            {d.name}
          </P.T>
          {d.title.trim() ? (
            <P.T
              style={{
                fontWeight: 500,
                fontSize: 10,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: 0,
                marginTop: 3,
              }}
            >
              {d.title}
            </P.T>
          ) : null}

          {d.summary.trim() ? (
            <MainSection P={P} title="Profile" accent={accent}>
              <P.T style={{ lineHeight: 1.55 }}>{d.summary}</P.T>
            </MainSection>
          ) : null}

          {d.experience.length ? (
            <MainSection P={P} title="Experience" accent={accent}>
              {d.experience.map((e, i) => (
                <P.V key={e.id} wrap={false} style={{ marginTop: i ? 9 : 0 }}>
                  <P.T style={{ fontWeight: 600, fontSize: 10, color: INK }}>{e.role}</P.T>
                  <P.V style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 1 }}>
                    <P.T style={{ fontSize: 8.6, color: accent, fontWeight: 500, flexShrink: 1 }}>
                      {[e.company, e.location].filter(Boolean).join(", ")}
                    </P.T>
                    <P.T style={{ fontSize: 8, color: MUTED, marginLeft: 8 }}>
                      {[e.start, e.end].filter(Boolean).join(" - ")}
                    </P.T>
                  </P.V>
                  <P.V style={{ marginTop: 3 }}>
                    {lines(e.points).map((l, j) => (
                      <P.V key={j} style={{ flexDirection: "row", marginTop: 1.5 }}>
                        {/* A real "•" character (not a drawn dot) so ATS parsers see bullet points. */}
                        <P.T style={{ width: 9, color: accent, fontWeight: 700 }}>•</P.T>
                        <P.T style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, lineHeight: 1.45 }}>{l}</P.T>
                      </P.V>
                    ))}
                  </P.V>
                </P.V>
              ))}
            </MainSection>
          ) : null}

          {d.projects.length ? (
            <MainSection P={P} title="Projects" accent={accent}>
              {d.projects.map((p, i) => (
                <P.V key={p.id} wrap={false} style={{ marginTop: i ? 7 : 0 }}>
                  <P.T style={{ fontWeight: 600, fontSize: 9.5, color: INK }}>{p.name}</P.T>
                  {p.link ? <P.T style={{ fontSize: 8, color: accent }}>{p.link}</P.T> : null}
                  {p.description ? <P.T style={{ lineHeight: 1.45, marginTop: 1 }}>{p.description}</P.T> : null}
                </P.V>
              ))}
            </MainSection>
          ) : null}

          {certs.length ? (
            <MainSection P={P} title="Certifications" accent={accent}>
              {certs.map((c, i) => (
                <P.T key={i} style={{ lineHeight: 1.5 }}>{`•  ${c}`}</P.T>
              ))}
            </MainSection>
          ) : null}
        </P.V>
      </P.V>
    </P.Page>
  );
}
