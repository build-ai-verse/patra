import type { ReactNode } from "react";
// Note: no letterSpacing in resumes - PDF text extraction (and ATS parsers) read spaced
// letters as separate words ("S K I L L S"), which hides section headings.
import type { Prims, ResumeDoc } from "./prims";
import { lines, list } from "./prims";

const INK = "#111827";
const BODY = "#374151";
const MUTED = "#6B7280";

function Section({ P, title, accent, children }: { P: Prims; title: string; accent: string; children: ReactNode }) {
  return (
    <P.V style={{ marginTop: 13 }}>
      <P.T
        style={{
          fontWeight: 600,
          fontSize: 10.5,
          color: accent,
          textTransform: "uppercase",
          letterSpacing: 0,
          paddingBottom: 3,
          marginBottom: 6,
          borderBottomWidth: 0.6,
          borderBottomColor: "#D1D5DB",
          borderBottomStyle: "solid",
        }}
      >
        {title}
      </P.T>
      {children}
    </P.V>
  );
}

function Bullets({ P, text }: { P: Prims; text: string }) {
  return (
    <P.V style={{ marginTop: 3 }}>
      {lines(text).map((l, i) => (
        <P.V key={i} style={{ flexDirection: "row", marginTop: 1.5 }}>
          <P.T style={{ width: 10, color: MUTED }}>•</P.T>
          <P.T style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, lineHeight: 1.45, color: BODY }}>{l}</P.T>
        </P.V>
      ))}
    </P.V>
  );
}

export function ResumeClassic({ doc, P }: { doc: ResumeDoc; P: Prims }) {
  const { data: d, accent } = doc;
  const contact = [d.email, d.phone, d.location, d.linkedin, d.website].filter((x) => x.trim());
  const skills = list(d.skills);
  const langs = list(d.languages);
  const certs = lines(d.certifications);
  return (
    <P.Page
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: 38,
        paddingBottom: 38,
        paddingLeft: 44,
        paddingRight: 44,
        fontFamily: "Poppins",
        fontSize: 9,
        lineHeight: 1.35,
        color: BODY,
      }}
    >
      <P.V
        style={{
          paddingBottom: 10,
          borderBottomWidth: 1.6,
          borderBottomColor: accent,
          borderBottomStyle: "solid",
        }}
      >
        <P.T style={{ fontWeight: 600, fontSize: 24, color: INK, letterSpacing: 0 }}>{d.name}</P.T>
        {d.title.trim() ? (
          <P.T style={{ fontWeight: 500, fontSize: 11, color: accent, marginTop: 1 }}>{d.title}</P.T>
        ) : null}
        <P.T style={{ fontSize: 8.5, color: MUTED, marginTop: 5 }}>{contact.join("   |   ")}</P.T>
      </P.V>

      {d.summary.trim() ? (
        <Section P={P} title="Professional Summary" accent={accent}>
          <P.T style={{ lineHeight: 1.5 }}>{d.summary}</P.T>
        </Section>
      ) : null}

      {d.experience.length ? (
        <Section P={P} title="Work Experience" accent={accent}>
          {d.experience.map((e, i) => (
            <P.V key={e.id} wrap={false} style={{ marginTop: i ? 8 : 0 }}>
              <P.V style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <P.T style={{ fontWeight: 600, fontSize: 10, color: INK, flexShrink: 1 }}>
                  {e.role}
                  {e.company ? <P.TS style={{ fontWeight: 400, color: BODY }}>{`  ·  ${e.company}`}</P.TS> : null}
                </P.T>
                <P.T style={{ fontSize: 8.5, color: MUTED, marginLeft: 8 }}>
                  {[e.start, e.end].filter(Boolean).join(" - ")}
                </P.T>
              </P.V>
              {e.location ? <P.T style={{ fontSize: 8.5, color: MUTED }}>{e.location}</P.T> : null}
              <Bullets P={P} text={e.points} />
            </P.V>
          ))}
        </Section>
      ) : null}

      {d.projects.length ? (
        <Section P={P} title="Projects" accent={accent}>
          {d.projects.map((p, i) => (
            <P.V key={p.id} wrap={false} style={{ marginTop: i ? 6 : 0 }}>
              <P.T style={{ fontWeight: 600, fontSize: 9.5, color: INK }}>
                {p.name}
                {p.link ? <P.TS style={{ fontWeight: 400, fontSize: 8.5, color: accent }}>{`   ${p.link}`}</P.TS> : null}
              </P.T>
              {p.description ? <P.T style={{ lineHeight: 1.45, marginTop: 1 }}>{p.description}</P.T> : null}
            </P.V>
          ))}
        </Section>
      ) : null}

      {d.education.length ? (
        <Section P={P} title="Education" accent={accent}>
          {d.education.map((e, i) => (
            <P.V key={e.id} wrap={false} style={{ marginTop: i ? 6 : 0 }}>
              <P.V style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <P.T style={{ fontWeight: 600, fontSize: 9.5, color: INK, flexShrink: 1 }}>{e.degree}</P.T>
                <P.T style={{ fontSize: 8.5, color: MUTED, marginLeft: 8 }}>{e.year}</P.T>
              </P.V>
              <P.T>{[e.institute, e.score].filter(Boolean).join("  ·  ")}</P.T>
            </P.V>
          ))}
        </Section>
      ) : null}

      {skills.length ? (
        <Section P={P} title="Skills" accent={accent}>
          <P.T style={{ lineHeight: 1.5 }}>{skills.join("  ·  ")}</P.T>
        </Section>
      ) : null}

      {certs.length ? (
        <Section P={P} title="Certifications" accent={accent}>
          <Bullets P={P} text={d.certifications} />
        </Section>
      ) : null}

      {langs.length ? (
        <Section P={P} title="Languages" accent={accent}>
          <P.T>{langs.join("  ·  ")}</P.T>
        </Section>
      ) : null}
    </P.Page>
  );
}
