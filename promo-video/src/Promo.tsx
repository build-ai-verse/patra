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
import { sampleBiodataHi } from "@/lib/hindi";
import type { DocumentPayload } from "@/lib/templates";
import { site } from "@/config/site";
import { minPrice } from "@/lib/templates";

/**
 * Launch promo. One source, two formats (see Root.tsx):
 *  - 1080x1920 vertical: Instagram Reels + YouTube Shorts
 *  - 1920x1080 landscape: YouTube
 * Every scene reads `useLandscape()` and lays itself out for the current format.
 */

/** Launch offer: downloads are free. Set false to show the normal price scene instead. */
export const LAUNCH_OFFER = true;

const C = {
  maroon: "#7A1C3A",
  maroonDark: "#3F0E20",
  cream: "#FBF6EE",
  marigold: "#F9B949",
  marigoldSoft: "#FCD38A",
  ink: "#2A1A1F",
  green: "#16A34A",
};

/* ------------------------------------------------------------------ */
/* Fonts (same files as the PDF renderer, incl. Devanagari)            */
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
  ["HindV", "hind-devanagari-400-normal", "400", "normal"],
  ["HindV", "hind-devanagari-500-normal", "500", "normal"],
  ["HindV", "hind-devanagari-600-normal", "600", "normal"],
  ["HindV", "hind-devanagari-700-normal", "700", "normal"],
  ["MartelV", "martel-devanagari-400-normal", "400", "normal"],
  ["MartelV", "martel-devanagari-600-normal", "600", "normal"],
  ["MartelV", "martel-devanagari-700-normal", "700", "normal"],
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
  "--font-hind": "HindV",
  "--font-martel": "MartelV",
  fontFamily: "PoppinsV, HindV, sans-serif",
} as CSSProperties;

const display: CSSProperties = { fontFamily: "PlayfairV, MartelV, serif", fontWeight: 700 };

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function useLandscape() {
  const { width, height } = useVideoConfig();
  return width > height;
}

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

/** A document on a cream "card", like a phone/printout. */
function DocCard({ doc, width, style }: { doc: DocumentPayload; width: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        padding: Math.round(width * 0.027),
        borderRadius: 40,
        background: C.cream,
        boxShadow: "0 60px 120px rgba(0,0,0,0.45)",
        ...style,
      }}
    >
      <Doc doc={doc} width={width} />
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

/** Headline block: centred at the top in vertical, left column (vertically centred) in landscape. */
function Caption({ children, top = 170 }: { children: ReactNode; top?: number }) {
  const L = useLandscape();
  if (L) {
    return (
      <div
        style={{
          position: "absolute",
          left: 130,
          width: 880,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: C.cream,
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center", color: C.cream }}>{children}</div>
  );
}

function Chip({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: "#fff",
        color: C.ink,
        borderRadius: 999,
        padding: "18px 40px",
        fontSize: 42,
        fontWeight: 600,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Fade the whole scene in/out for smooth cuts. */
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
  const L = useLandscape();
  const frame = useCurrentFrame();
  const stamp = useSpring(52, 9);
  const shake = frame > 40 && frame < 52 ? Math.sin(frame * 2.2) * 10 : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Caption top={260}>
        <Pop>
          <div style={{ ...display, fontSize: L ? 104 : 112, lineHeight: 1.05 }}>Shaadi ka biodata</div>
        </Pop>
        <Pop delay={8}>
          <div style={{ ...display, fontStyle: "italic", fontWeight: 400, fontSize: L ? 96 : 104, color: C.marigold, marginTop: 10 }}>
            abhi bhi Word mein?
          </div>
        </Pop>
        <Pop delay={16}>
          <div style={{ fontSize: L ? 110 : 120, marginTop: 10 }}>😅</div>
        </Pop>
      </Caption>
      {/* Boring plain doc */}
      <Pop delay={22} style={L ? { position: "absolute", top: 170, left: 1180 } : { position: "absolute", top: 940 }}>
        <div
          style={{
            width: L ? 560 : 520,
            height: L ? 720 : 680,
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
  const L = useLandscape();
  const frame = useCurrentFrame();
  const name = "Priya Sharma";
  const typed = name.slice(0, Math.max(0, Math.floor((frame - 18) / 2.2)));
  const total = sampleBiodata.sections.reduce((n, s) => n + s.fields.length, 0);
  const shown = Math.floor(interpolate(frame, [40, 105], [0, total], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
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
  const rise = useSpring(4);
  const chipOpacity = interpolate(frame, [14, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chip = (
    <Chip style={{ fontSize: 38, padding: "16px 34px" }}>
      ✏️ {typed}
      <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0, color: C.maroon }}>|</span>
    </Chip>
  );
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
        {L ? <div style={{ marginTop: 50, opacity: chipOpacity }}>{chip}</div> : null}
      </Caption>
      <DocCard
        doc={doc}
        width={L ? 560 : 820}
        style={L ? { top: 90, left: 1180, transform: `translateY(${(1 - rise) * 500}px)` } : { top: 600, transform: `translateY(${(1 - rise) * 500}px)` }}
      />
      {L ? null : <div style={{ position: "absolute", top: 520, opacity: chipOpacity }}>{chip}</div>}
    </AbsoluteFill>
  );
}

function Hindi() {
  const L = useLandscape();
  const frame = useCurrentFrame();
  const hi = frame >= 40;
  const flip = interpolate(frame, [33, 40, 47], [1, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const doc: DocumentPayload = {
    templateId: "biodata-royal",
    accent: "#9A3412",
    data: hi ? { ...sampleBiodataHi, photo: staticFile("avatar-female.svg") } : { ...sampleBiodata, photo: staticFile("avatar-female.svg") },
  };
  const toggle = (
    <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.14)", borderRadius: 999, padding: 8, gap: 6 }}>
      {(["English", "हिन्दी"] as const).map((l, i) => {
        const on = (i === 1) === hi;
        return (
          <div
            key={l}
            style={{
              padding: "14px 40px",
              borderRadius: 999,
              fontSize: 42,
              fontWeight: 600,
              background: on ? C.marigold : "transparent",
              color: on ? C.ink : C.cream,
            }}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Caption top={150}>
        <Pop>
          <div style={{ ...display, fontSize: L ? 96 : 92, lineHeight: 1.1 }}>Hindi mein bhi!</div>
        </Pop>
        <Pop delay={6}>
          <div style={{ ...display, fontSize: L ? 80 : 76, color: C.marigold, marginTop: 6 }}>हिन्दी में भी</div>
        </Pop>
        <Pop delay={12} style={{ marginTop: 34 }}>
          {toggle}
        </Pop>
        {L ? (
          <Pop delay={18} style={{ marginTop: 30, fontSize: 40, color: C.marigoldSoft }}>
            Ek click mein English ↔ हिन्दी
          </Pop>
        ) : null}
      </Caption>
      <DocCard
        doc={doc}
        width={L ? 560 : 760}
        style={L ? { top: 90, left: 1180, transform: `scaleX(${flip})` } : { top: 640, transform: `scaleX(${flip})` }}
      />
    </AbsoluteFill>
  );
}

const ACCENTS = ["#8B1E3F", "#1E3A8A", "#065F46", "#9A3412", "#6B21A8"];
const LOTUS = ["#BE185D", "#0F766E", "#7C3AED", "#C2410C", "#1D4ED8"];

function Colours() {
  const L = useLandscape();
  const frame = useCurrentFrame();
  const lotus = frame >= 50;
  const list = lotus ? LOTUS : ACCENTS;
  const idx = Math.floor((lotus ? frame - 50 : frame) / 10) % list.length;
  const doc: DocumentPayload = {
    templateId: lotus ? "biodata-lotus" : "biodata-royal",
    accent: list[idx]!,
    data: { ...sampleBiodata, photo: staticFile("avatar-female.svg") },
  };
  const flip = interpolate(frame, [43, 50, 57], [1, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const swatches = (
    <div
      style={{
        display: "inline-flex",
        gap: L ? 24 : 30,
        background: "rgba(255,255,255,0.12)",
        padding: "24px 36px",
        borderRadius: 999,
      }}
    >
      {list.map((c, i) => (
        <div
          key={c}
          style={{
            width: L ? 66 : 76,
            height: L ? 66 : 76,
            borderRadius: 999,
            background: c,
            border: "5px solid #fff",
            transform: `scale(${i === idx ? 1.25 : 1})`,
            boxShadow: i === idx ? "0 0 0 8px rgba(249,185,73,0.8)" : "none",
          }}
        />
      ))}
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Caption top={170}>
        <Pop>
          <div style={{ ...display, fontSize: 96, lineHeight: 1.05 }}>Apna style chuniye</div>
        </Pop>
        <Pop delay={6}>
          <div style={{ fontSize: 48, fontWeight: 500, color: C.marigoldSoft, marginTop: 14 }}>Royal ya Modern · 5 colours each</div>
        </Pop>
        {L ? <div style={{ marginTop: 56 }}>{swatches}</div> : null}
      </Caption>
      <DocCard doc={doc} width={L ? 560 : 800} style={L ? { top: 90, left: 1180, transform: `scaleX(${flip})` } : { top: 470, transform: `scaleX(${flip})` }} />
      {L ? null : <div style={{ position: "absolute", top: 1650 }}>{swatches}</div>}
    </AbsoluteFill>
  );
}

function Resumes() {
  const L = useLandscape();
  const a = useSpring(6);
  const b = useSpring(14);
  const tick = useSpring(36);
  const ats = useSpring(48);
  const frame = useCurrentFrame();
  const classic: DocumentPayload = { templateId: "resume-classic", accent: "#1E3A8A", data: sampleResume };
  const modern: DocumentPayload = {
    templateId: "resume-modern",
    accent: "#0F3D5E",
    data: { ...sampleResume, photo: staticFile("avatar-male.svg") },
  };
  const wobble = Math.sin(frame / 20);
  const shadow = { boxShadow: "0 50px 100px rgba(0,0,0,0.45)", borderRadius: 10, position: "absolute" } as const;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Caption top={170}>
        <Pop>
          <div style={{ fontSize: 50, fontWeight: 500, color: C.marigoldSoft }}>Naukri chahiye?</div>
        </Pop>
        <Pop delay={5}>
          <div style={{ ...display, fontSize: L ? 96 : 104, lineHeight: 1.05 }}>Job-winning Resume</div>
        </Pop>
        {L ? (
          <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
            <Chip style={{ transform: `scale(${tick})`, transformOrigin: "left center" }}>
              <span style={{ color: C.green }}>✓</span> ATS-friendly · Recruiter-ready
            </Chip>
            <Chip style={{ transform: `scale(${ats})`, transformOrigin: "left center" }}>🎯 FREE ATS score checker</Chip>
          </div>
        ) : null}
      </Caption>
      <div
        style={{
          ...shadow,
          ...(L ? { top: 150, left: 1010 } : { top: 500, left: 40 }),
          transform: `translateX(${(1 - a) * -700}px) rotate(${-7 + wobble}deg)`,
        }}
      >
        <Doc doc={classic} width={L ? 440 : 560} />
      </div>
      <div
        style={{
          ...shadow,
          ...(L ? { top: 230, left: 1400 } : { top: 560, right: 40 }),
          transform: `translateX(${(1 - b) * 700}px) rotate(${6 - wobble}deg)`,
        }}
      >
        <Doc doc={modern} width={L ? 440 : 560} />
      </div>
      {L ? null : (
        <div style={{ position: "absolute", top: 1330, display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
          <Chip style={{ transform: `scale(${tick})`, fontSize: 44 }}>
            <span style={{ color: C.green }}>✓</span> ATS-friendly · Recruiter-ready
          </Chip>
          <Chip style={{ transform: `scale(${ats})`, fontSize: 44 }}>🎯 FREE ATS score checker</Chip>
        </div>
      )}
    </AbsoluteFill>
  );
}

/** Launch offer (free) or the normal "from ₹X" price scene. */
function Offer() {
  const L = useLandscape();
  const frame = useCurrentFrame();
  const big = useSpring(8, 8);
  const glow = 0.5 + 0.5 * Math.sin(frame / 6);
  const strike = interpolate(frame, [20, 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chips = LAUNCH_OFFER
    ? ["⚡ Instant PDF", "📧 Email pe copy", "🚫 No signup"]
    : ["📱 UPI / Card", "⚡ Instant PDF", "📧 Email pe copy"];
  return (
    // Vertical: sit a little high so Instagram's caption overlay never covers the chips.
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", paddingBottom: L ? 0 : 240 }}>
      <Pop style={{ color: C.cream }}>
        <div
          style={{
            display: "inline-block",
            background: C.marigold,
            color: C.ink,
            fontSize: L ? 44 : 50,
            fontWeight: 700,
            padding: "14px 40px",
            borderRadius: 999,
            marginBottom: 20,
          }}
        >
          {LAUNCH_OFFER ? "🎉 LAUNCH OFFER" : "Download sirf"}
        </div>
      </Pop>
      {LAUNCH_OFFER ? (
        <Pop delay={4} style={{ color: C.cream, fontSize: L ? 56 : 62, fontWeight: 500 }}>
          PDF download{" "}
          <span style={{ position: "relative", display: "inline-block", opacity: 0.75 }}>
            ₹{minPrice()}
            <span
              style={{
                position: "absolute",
                left: -6,
                top: "52%",
                height: 7,
                width: `calc(${strike}% + 12px)`,
                background: "#F87171",
                borderRadius: 4,
                transform: "rotate(-8deg)",
              }}
            />
          </span>
        </Pop>
      ) : null}
      <div
        style={{
          ...display,
          fontSize: L ? 300 : 340,
          lineHeight: 1,
          color: C.marigold,
          transform: `scale(${big})`,
          textShadow: `0 0 ${40 + glow * 60}px rgba(249,185,73,0.6)`,
          margin: L ? "10px 0 20px" : "20px 0 30px",
        }}
      >
        {LAUNCH_OFFER ? "FREE" : `₹${minPrice()}`}
      </div>
      <Pop delay={14} style={{ color: C.cream, fontSize: L ? 42 : 46, marginBottom: L ? 50 : 60 }}>
        {LAUNCH_OFFER ? "Bilkul muft · Limited time only ⏳" : "se shuru · Chai se bhi sasta ☕"}
      </Pop>
      <div style={{ display: "flex", flexDirection: L ? "row" : "column", gap: 26, alignItems: "center", justifyContent: "center" }}>
        {chips.map((c, i) => (
          <Pop key={c} delay={24 + i * 8}>
            <div
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "2px solid rgba(255,255,255,0.25)",
                color: "#fff",
                fontSize: L ? 42 : 50,
                fontWeight: 600,
                padding: L ? "18px 44px" : "22px 56px",
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

export function Logo({ size }: { size: number }) {
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

const siteHost = site.url.replace(/^https?:\/\//, "");

function Cta() {
  const L = useLandscape();
  const frame = useCurrentFrame();
  const logo = useSpring(0, 10);
  const pulse = 1 + 0.04 * Math.sin(frame / 5);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: C.cream, textAlign: "center" }}>
      <div style={{ transform: `scale(${logo}) rotate(${(1 - logo) * -20}deg)` }}>
        <Logo size={L ? 190 : 260} />
      </div>
      <Pop delay={8}>
        <div style={{ ...display, fontSize: L ? 140 : 170, marginTop: L ? 20 : 30, lineHeight: 1 }}>
          {site.name}
          <sup style={{ fontSize: L ? 50 : 60, verticalAlign: "top", marginLeft: 6 }}>{site.trademark}</sup>
        </div>
      </Pop>
      <Pop delay={14}>
        <div style={{ fontSize: L ? 44 : 46, marginTop: L ? 16 : 24, maxWidth: L ? 1400 : 900, lineHeight: 1.35 }}>
          Shaadi Biodata & Resume{L ? " " : <br />}ready in minutes
        </div>
      </Pop>
      <Pop delay={22}>
        <div
          style={{
            marginTop: L ? 40 : 60,
            background: C.marigold,
            color: C.ink,
            fontSize: L ? 46 : 44,
            fontWeight: 700,
            padding: "28px 50px",
            borderRadius: 999,
            transform: `scale(${pulse})`,
            boxShadow: "0 25px 60px rgba(249,185,73,0.45)",
          }}
        >
          {siteHost}
        </div>
      </Pop>
      <Pop delay={30}>
        <div style={{ fontSize: 40, marginTop: L ? 30 : 40, color: C.marigoldSoft }}>
          {L ? "👇 Link in description" : "👆 Link in bio"}
        </div>
      </Pop>
      <div style={{ position: "absolute", bottom: L ? 50 : 120, fontSize: L ? 30 : 34, opacity: 0.8 }}>
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
  [90, 120, BuildBiodata],
  [210, 90, Hindi],
  [300, 100, Colours],
  [400, 95, Resumes],
  [495, 90, Offer],
  [585, 90, Cta],
];

export const PROMO_FRAMES = 675; // 22.5s @ 30fps

export function Promo() {
  useFonts();
  const L = useLandscape();
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
      <div
        style={{
          position: "absolute",
          top: L ? 30 : 40,
          left: 60,
          right: 60,
          height: L ? 6 : 8,
          borderRadius: 8,
          background: "rgba(255,255,255,0.2)",
        }}
      >
        <div style={{ width: `${progress}%`, height: "100%", borderRadius: 8, background: C.marigold }} />
      </div>
      <Img src={staticFile("avatar-female.svg")} style={{ display: "none" }} />
      <Img src={staticFile("avatar-male.svg")} style={{ display: "none" }} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* YouTube thumbnail (1280x720)                                        */
/* ------------------------------------------------------------------ */
export function Thumbnail() {
  useFonts();
  const doc: DocumentPayload = {
    templateId: "biodata-royal",
    accent: "#8B1E3F",
    data: { ...sampleBiodata, photo: staticFile("avatar-female.svg") },
  };
  const docHi: DocumentPayload = {
    templateId: "biodata-lotus",
    accent: "#BE185D",
    data: { ...sampleBiodataHi, photo: staticFile("avatar-female.svg") },
  };
  return (
    <AbsoluteFill style={rootVars}>
      <Background />
      <div style={{ position: "absolute", left: 60, top: 0, bottom: 0, width: 700, display: "flex", flexDirection: "column", justifyContent: "center", color: C.cream }}>
        <div style={{ display: "inline-block", alignSelf: "flex-start", background: C.marigold, color: C.ink, fontWeight: 700, fontSize: 34, padding: "8px 26px", borderRadius: 999 }}>
          {LAUNCH_OFFER ? "🎉 FREE · Launch offer" : `PDF from ₹${minPrice()}`}
        </div>
        <div style={{ ...display, fontSize: 92, lineHeight: 1.02, marginTop: 22 }}>
          Shaadi Biodata
          <br />
          <span style={{ color: C.marigold, fontStyle: "italic", fontWeight: 400 }}>in 5 minutes</span>
        </div>
        <div style={{ fontSize: 34, marginTop: 22, fontWeight: 500 }}>English + हिन्दी · Resume bhi ✨</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 30 }}>
          <Logo size={64} />
          <div style={{ ...display, fontSize: 48 }}>
            {site.name}
            <sup style={{ fontSize: 20, verticalAlign: "top" }}>{site.trademark}</sup>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 790, top: 90, transform: "rotate(-6deg)", boxShadow: "0 30px 60px rgba(0,0,0,0.45)", borderRadius: 10 }}>
        <Doc doc={doc} width={300} />
      </div>
      <div style={{ position: "absolute", left: 950, top: 150, transform: "rotate(5deg)", boxShadow: "0 30px 60px rgba(0,0,0,0.45)", borderRadius: 10 }}>
        <Doc doc={docHi} width={300} />
      </div>
      <Img src={staticFile("avatar-female.svg")} style={{ display: "none" }} />
    </AbsoluteFill>
  );
}
