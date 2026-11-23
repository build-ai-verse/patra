import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { RenderDocument } from "@/components/templates";
import { htmlPrims } from "@/components/templates/html";
import { sampleBiodata, sampleResume } from "@/lib/defaults";
import type { DocumentPayload } from "@/lib/templates";
import { site } from "@/config/site";
import { minPrice } from "@/lib/templates";

export const PROMO_FRAMES = 600; // 20s @ 30fps

const C = {
  maroon: "#7A1C3A",
  maroonDark: "#3F0E20",
  cream: "#FBF6EE",
  marigold: "#F9B949",
  marigoldSoft: "#FCD38A",
  ink: "#2A1A1F",
};

/* ------------------------------------------------------------------ */
/* Fonts (same files as the PDF renderer)                              */
/* ------------------------------------------------------------------ */
const FONTS: [string, string, string, string][] = [
  ["PoppinsV", "poppins-latin-400-normal", "400", "normal"],
  ["PoppinsV", "poppins-latin-500-normal", "500", "normal"],
  ["PoppinsV", "poppins-latin-600-normal", "600", "normal"],
  ["PoppinsV", "poppins-latin-700-normal", "700", "normal"],
  ["PlayfairV", "playfair-display-latin-400-normal", "400", "normal"],
  ["PlayfairV", "playfair-display-latin-700-normal", "700", "normal"],
  ["PlayfairV", "playfair-display-latin-400-italic", "400", "italic"],
  ["CormorantV", "cormorant-garamond-latin-500-normal", "500", "normal"],
  ["CormorantV", "cormorant-garamond-latin-700-normal", "700", "normal"],
  ["CormorantV", "cormorant-garamond-latin-500-italic", "500", "italic"],
];

function useFonts() {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all(
      FONTS.map(([family, file, weight, style]) => {
        const f = new FontFace(family, `url(${staticFile(`fonts/${file}.woff`)})`, { weight, style });
        return f.load().then((ff) => document.fonts.add(ff));
      }),
    ).then(() => continueRender(handle));
  }, [handle]);
}

const rootVars = {
  "--font-poppins": "PoppinsV",
  "--font-playfair": "PlayfairV",
  "--font-cormorant": "CormorantV",
  fontFamily: "PoppinsV, sans-serif",
} as CSSProperties;

const display: CSSProperties = { fontFamily: "PlayfairV, serif", fontWeight: 700 };

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function useSpring(delay = 0, damping = 14) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 120, mass: 0.8 } });
}

function Pop({ delay = 0, children, style }: { delay?: number; children: ReactNode; style?: CSSProperties }) {
  const s = useSpring(delay);
  return (
    <div style={{ transform: `translateY(${(1 - s) * 60}px) scale(${0.85 + 0.15 * s})`, opacity: s, ...style }}>
      {children}
    </div>
  );
}

function Doc({ doc, width }: { doc: DocumentPayload; width: number }) {
  const k = width / 595;
  return (
    <div style={{ width, height: 842 * k, overflow: "hidden", borderRadius: 10, background: "#fff" }}>
      <div style={{ width: 595, transform: `scale(${k})`, transformOrigin: "top left" }}>
        <RenderDocument doc={doc} P={htmlPrims} />
      </div>
    </div>
  );
}

function Background() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${C.maroon} 0%, ${C.maroonDark} 100%)` }}>
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 2px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: 999,
          right: -380,
          top: -300 + Math.sin(frame / 40) * 30,
          background: "radial-gradient(circle, rgba(249,185,73,0.45), rgba(249,185,73,0) 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: 999,
          left: -380,
          bottom: -250 + Math.cos(frame / 45) * 30,
          background: "radial-gradient(circle, rgba(236,147,174,0.35), rgba(236,147,174,0) 65%)",
        }}
      />
    </AbsoluteFill>
  );
}

function Caption({ children, top = 170 }: { children: ReactNode; top?: number }) {
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center", color: C.cream }}>{children}</div>
  );
}

/** Fade the whole scene out during its last frames for smooth cuts. */
function SceneFade({ duration, children }: { duration: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, duration - 10, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */
function Hook() {
  const frame = useCurrentFrame();
  const stamp = useSpring(52, 9);
  const shake = frame > 40 && frame < 52 ? Math.sin(frame * 2.2) * 10 : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Caption top={260}>
        <Pop>
          <div style={{ ...display, fontSize: 112, lineHeight: 1.05 }}>Shaadi ka biodata</div>
        </Pop>
        <Pop delay={8}>
          <div style={{ ...display, fontStyle: "italic", fontWeight: 400, fontSize: 104, color: C.marigold, marginTop: 10 }}>
            abhi bhi Word mein?
          </div>
        </Pop>
        <Pop delay={16}>
          <div style={{ fontSize: 120, marginTop: 10 }}>😅</div>
        </Pop>
      </Caption>
      {/* Boring plain doc */}
      <Pop delay={22} style={{ position: "absolute", top: 940 }}>
        <div
          style={{
            width: 520,
            height: 680,
            background: "#fff",
            borderRadius: 12,
            padding: 50,
            transform: `rotate(-4deg) translateX(${shake}px)`,
            boxShadow: "0 40px 80px rgba(0,0,0,0.35)",
            position: "relative",
            fontFamily: "Times New Roman, serif",
            color: "#333",
          }}
        >
          <div style={{ fontSize: 40, textAlign: "center", textDecoration: "underline" }}>BIODATA</div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 20, marginTop: 26 }}>
              <div style={{ width: 150, height: 14, background: "#ddd" }} />
              <div style={{ flex: 1, height: 14, background: "#e8e8e8" }} />
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: stamp,
              transform: `scale(${2 - stamp})`,
            }}
          >
            <div
              style={{
                border: "10px solid #DC2626",
                color: "#DC2626",
                fontSize: 84,
                fontWeight: 700,
                padding: "6px 34px",
                borderRadius: 18,
                transform: "rotate(-14deg)",
                background: "rgba(255,255,255,0.85)",
                fontFamily: "PoppinsV",
              }}
            >
              BORING
            </div>
          </div>
        </div>
      </Pop>
    </AbsoluteFill>
  );
}

function BuildBiodata() {
  const frame = useCurrentFrame();
  const name = "Priya Sharma";
  const typed = name.slice(0, Math.max(0, Math.floor((frame - 18) / 2.2)));
  const total = sampleBiodata.sections.reduce((n, s) => n + s.fields.length, 0);
  const shown = Math.floor(interpolate(frame, [40, 115], [0, total], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  let left = shown;
  const sections = sampleBiodata.sections.map((s) => {
    const take = Math.max(0, Math.min(s.fields.length, left));
    left -= take;
    return { ...s, fields: s.fields.slice(0, take) };
  });
  const doc: DocumentPayload = {
    templateId: "biodata-royal",
    accent: "#8B1E3F",
    data: { ...sampleBiodata, name: typed, photo: frame > 60 ? staticFile("avatar-female.svg") : null, sections },
  };
  const phone = useSpring(4);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Caption top={150}>
        <Pop>
          <div style={{ fontSize: 50, fontWeight: 500, color: C.marigoldSoft }}>Banaiye</div>
        </Pop>
        <Pop delay={5}>
          <div style={{ ...display, fontSize: 100, lineHeight: 1.05 }}>Beautiful Biodata</div>
        </Pop>
        <Pop delay={10}>
          <div style={{ fontSize: 50, fontWeight: 500, marginTop: 8 }}>sirf 5 minute mein ✨</div>
        </Pop>
      </Caption>
      <div
        style={{
          position: "absolute",
          top: 600,
          transform: `translateY(${(1 - phone) * 500}px)`,
          padding: 22,
          borderRadius: 40,
          background: C.cream,
          boxShadow: "0 60px 120px rgba(0,0,0,0.45)",
        }}
      >
        <Doc doc={doc} width={820} />
      </div>
      {/* Typing cursor chip */}
      <div
        style={{
          position: "absolute",
          top: 520,
          background: "#fff",
          color: C.ink,
          borderRadius: 999,
          padding: "16px 34px",
          fontSize: 38,
          fontWeight: 600,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          opacity: interpolate(frame, [14, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        ✏️ {typed}
        <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0, color: C.maroon }}>|</span>
      </div>
    </AbsoluteFill>
  );
}

const ACCENTS = ["#8B1E3F", "#1E3A8A", "#065F46", "#9A3412", "#6B21A8"];
const LOTUS = ["#BE185D", "#0F766E", "#7C3AED", "#C2410C", "#1D4ED8"];

function Colours() {
  const frame = useCurrentFrame();
  const lotus = frame >= 55;
  const list = lotus ? LOTUS : ACCENTS;
  const idx = Math.floor((lotus ? frame - 55 : frame) / 11) % list.length;
  const doc: DocumentPayload = {
    templateId: lotus ? "biodata-lotus" : "biodata-royal",
    accent: list[idx]!,
    data: { ...sampleBiodata, photo: staticFile("avatar-female.svg") },
  };
  const flip = interpolate(frame, [48, 55, 62], [1, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Caption top={170}>
        <Pop>
          <div style={{ ...display, fontSize: 96, lineHeight: 1.05 }}>Apna style chuniye</div>
        </Pop>
        <Pop delay={6}>
          <div style={{ fontSize: 48, fontWeight: 500, color: C.marigoldSoft, marginTop: 14 }}>
            Royal ya Modern · 5 colours each
          </div>
        </Pop>
      </Caption>
      <div
        style={{
          position: "absolute",
          top: 470,
          padding: 22,
          borderRadius: 40,
          background: C.cream,
          boxShadow: "0 60px 120px rgba(0,0,0,0.45)",
          transform: `scaleX(${flip})`,
        }}
      >
        <Doc doc={doc} width={800} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1650,
          display: "flex",
          gap: 30,
          background: "rgba(255,255,255,0.12)",
          padding: "24px 36px",
          borderRadius: 999,
        }}
      >
        {list.map((c, i) => (
          <div
            key={c}
            style={{
              width: 76,
              height: 76,
              borderRadius: 999,
              background: c,
              border: "5px solid #fff",
              transform: `scale(${i === idx ? 1.25 : 1})`,
              boxShadow: i === idx ? "0 0 0 8px rgba(249,185,73,0.8)" : "none",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
}

function Resumes() {
  const a = useSpring(6);
  const b = useSpring(14);
  const frame = useCurrentFrame();
  const classic: DocumentPayload = { templateId: "resume-classic", accent: "#1E3A8A", data: sampleResume };
  const modern: DocumentPayload = {
    templateId: "resume-modern",
    accent: "#0F3D5E",
    data: { ...sampleResume, photo: staticFile("avatar-male.svg") },
  };
  const tick = useSpring(40);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Caption top={170}>
        <Pop>
          <div style={{ fontSize: 50, fontWeight: 500, color: C.marigoldSoft }}>Naukri chahiye?</div>
        </Pop>
        <Pop delay={5}>
          <div style={{ ...display, fontSize: 104, lineHeight: 1.05 }}>Job-winning Resume</div>
        </Pop>
      </Caption>
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 40,
          transform: `translateX(${(1 - a) * -700}px) rotate(${-7 + Math.sin(frame / 20) * 1}deg)`,
          boxShadow: "0 50px 100px rgba(0,0,0,0.45)",
          borderRadius: 10,
        }}
      >
        <Doc doc={classic} width={560} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 700,
          right: 40,
          transform: `translateX(${(1 - b) * 700}px) rotate(${6 - Math.sin(frame / 20) * 1}deg)`,
          boxShadow: "0 50px 100px rgba(0,0,0,0.45)",
          borderRadius: 10,
        }}
      >
        <Doc doc={modern} width={560} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1560,
          background: "#fff",
          color: C.ink,
          borderRadius: 999,
          padding: "22px 44px",
          fontSize: 46,
          fontWeight: 600,
          transform: `scale(${tick})`,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }}
      >
        <span style={{ color: "#16A34A" }}>✓</span> ATS-friendly · Recruiter-ready
      </div>
    </AbsoluteFill>
  );
}

function Price() {
  const frame = useCurrentFrame();
  const big = useSpring(8, 8);
  const glow = 0.5 + 0.5 * Math.sin(frame / 6);
  const chips = ["📱 UPI / Card", "⚡ Instant PDF", "📧 Email pe copy"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Pop style={{ textAlign: "center", color: C.cream }}>
        <div style={{ fontSize: 64, fontWeight: 500 }}>Download sirf</div>
      </Pop>
      <div
        style={{
          ...display,
          fontFamily: "PlayfairV, 'Nirmala UI', serif",
          fontSize: 380,
          lineHeight: 1,
          color: C.marigold,
          transform: `scale(${big})`,
          textShadow: `0 0 ${40 + glow * 60}px rgba(249,185,73,0.6)`,
          margin: "20px 0 30px",
        }}
      >
        ₹{minPrice()}
      </div>
      <Pop delay={14} style={{ color: C.cream, fontSize: 46, marginBottom: 60 }}>
        se shuru · Chai se bhi sasta ☕
      </Pop>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center" }}>
        {chips.map((c, i) => (
          <Pop key={c} delay={24 + i * 8}>
            <div
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "2px solid rgba(255,255,255,0.25)",
                color: "#fff",
                fontSize: 50,
                fontWeight: 600,
                padding: "22px 56px",
                borderRadius: 999,
              }}
            >
              {c}
            </div>
          </Pop>
        ))}
      </div>
    </AbsoluteFill>
  );
}

function Logo({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <rect width="64" height="64" rx="16" fill={C.cream} />
      <path d="M19 13h19l9 9v29a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V16a3 3 0 0 1 3-3z" fill="#fff" stroke="#E7D3B5" strokeWidth="1.5" />
      <path d="M38 13v7a2 2 0 0 0 2 2h7z" fill="#E7D3B5" />
      <rect x="21" y="27" width="16" height="2.6" rx="1.3" fill="#C8963E" />
      <rect x="21" y="33" width="21" height="2.2" rx="1.1" fill="#D9C6A8" />
      <rect x="21" y="38.5" width="18" height="2.2" rx="1.1" fill="#D9C6A8" />
      <circle cx="41" cy="46" r="7" fill="#F9B949" />
      <path d="M41 41.5l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" fill="#7A1C3A" />
    </svg>
  );
}

function Cta() {
  const frame = useCurrentFrame();
  const logo = useSpring(0, 10);
  const pulse = 1 + 0.04 * Math.sin(frame / 5);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: C.cream, textAlign: "center" }}>
      <div style={{ transform: `scale(${logo}) rotate(${(1 - logo) * -20}deg)` }}>
        <Logo size={260} />
      </div>
      <Pop delay={8}>
        <div style={{ ...display, fontSize: 170, marginTop: 30, lineHeight: 1 }}>
          {site.name}
          <sup style={{ fontSize: 60, verticalAlign: "top", marginLeft: 6 }}>{site.trademark}</sup>
        </div>
      </Pop>
      <Pop delay={14}>
        <div style={{ fontSize: 46, marginTop: 24, maxWidth: 900, lineHeight: 1.35 }}>
          Shaadi Biodata & Resume
          <br />
          ready in minutes
        </div>
      </Pop>
      <Pop delay={22}>
        <div
          style={{
            marginTop: 60,
            background: C.marigold,
            color: C.ink,
            fontSize: 44,
            fontWeight: 700,
            padding: "28px 50px",
            borderRadius: 999,
            transform: `scale(${pulse})`,
            boxShadow: "0 25px 60px rgba(249,185,73,0.45)",
          }}
        >
          {site.url.replace(/^https?:\/\//, "")}
        </div>
      </Pop>
      <Pop delay={30}>
        <div style={{ fontSize: 40, marginTop: 40, color: C.marigoldSoft }}>👆 Link in bio</div>
      </Pop>
      <div style={{ position: "absolute", bottom: 120, fontSize: 34, opacity: 0.8 }}>
        Powered by <b style={{ color: C.marigoldSoft }}>{site.poweredBy}</b>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */
const SCENES: [number, number, () => ReactNode][] = [
  [0, 90, Hook],
  [90, 135, BuildBiodata],
  [225, 115, Colours],
  [340, 95, Resumes],
  [435, 85, Price],
  [520, 80, Cta],
];

export function Promo() {
  useFonts();
  const frame = useCurrentFrame();
  // Thin progress bar at the top (story-style)
  const progress = interpolate(frame, [0, PROMO_FRAMES], [0, 100], { easing: Easing.linear });
  return (
    <AbsoluteFill style={rootVars}>
      <Background />
      {SCENES.map(([from, dur, Scene]) => (
        <Sequence key={from} from={from} durationInFrames={dur}>
          <SceneFade duration={dur}>
            <Scene />
          </SceneFade>
        </Sequence>
      ))}
      <div style={{ position: "absolute", top: 40, left: 60, right: 60, height: 8, borderRadius: 8, background: "rgba(255,255,255,0.2)" }}>
        <div style={{ width: `${progress}%`, height: "100%", borderRadius: 8, background: C.marigold }} />
      </div>
      <Img src={staticFile("avatar-female.svg")} style={{ display: "none" }} />
      <Img src={staticFile("avatar-male.svg")} style={{ display: "none" }} />
    </AbsoluteFill>
  );
}
