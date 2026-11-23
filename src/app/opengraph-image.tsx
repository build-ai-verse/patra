import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { minPrice } from "@/lib/templates";
import { FREE } from "@/lib/pricing";

export const alt = `${site.name} - Marriage Biodata & Resume Maker`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #7A1C3A 0%, #3F0E20 100%)",
          color: "white",
          padding: 70,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -120, top: -120, width: 420, height: 420, borderRadius: 999, background: "rgba(249,185,73,0.35)", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "center", color: "#7A1C3A", fontSize: 44, fontWeight: 700 }}>
              P
            </div>
            <div style={{ fontSize: 52, fontWeight: 700, display: "flex" }}>
              {site.name}
              <span style={{ fontSize: 22, marginTop: 6 }}>{site.trademark}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>Shaadi Biodata & Resumes that impress</div>
            <div style={{ fontSize: 30, marginTop: 20, color: "#FCD38A", display: "flex" }}>{FREE ? "Create online - Free PDF download (launch offer)" : `Create online - Download PDF from just Rs. ${minPrice()}`}</div>
          </div>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.7)", display: "flex" }}>{`Powered by ${site.poweredBy}`}</div>
        </div>
        <div style={{ display: "flex", position: "absolute", right: 90, top: 110, width: 300, height: 420, background: "#FFFBF3", borderRadius: 10, border: "8px solid #C8963E", flexDirection: "column", alignItems: "center", padding: 30, transform: "rotate(6deg)" }}>
          <div style={{ color: "#7A1C3A", fontSize: 16, fontStyle: "italic", display: "flex" }}>|| Shubh Vivah ||</div>
          <div style={{ color: "#7A1C3A", fontSize: 36, fontWeight: 700, letterSpacing: 6, marginTop: 8, display: "flex" }}>BIODATA</div>
          <div style={{ width: 120, height: 2, background: "#C8963E", marginTop: 10, display: "flex" }} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ display: "flex", width: "100%", marginTop: 18, gap: 12 }}>
              <div style={{ width: 80, height: 8, borderRadius: 4, background: "#E7D3B5", display: "flex" }} />
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#D9C6A8", display: "flex" }} />
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
