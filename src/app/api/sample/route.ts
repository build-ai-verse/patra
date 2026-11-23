import { NextResponse } from "next/server";
import { defaultPayload } from "@/lib/defaults";
import { getTemplate, isSymbolId, type TemplateId } from "@/lib/templates";
import { renderPdf } from "@/lib/pdf/render";
import { sampleBiodataHi } from "@/lib/hindi";

/** DEV ONLY: GET /api/sample?t=biodata-royal&symbol=ganesha&lang=hi renders a template with sample data. */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams; // read the request first so this route is never prerendered
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_SAMPLE_ROUTE !== "1") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const id = q.get("t") ?? "biodata-royal";
  if (!getTemplate(id)) return NextResponse.json({ error: "Unknown template" }, { status: 400 });
  const doc = defaultPayload(id as TemplateId);
  if (doc.templateId.startsWith("biodata") && q.get("lang") === "hi") doc.data = structuredClone(sampleBiodataHi);
  const symbol = q.get("symbol");
  if (doc.templateId.startsWith("biodata") && isSymbolId(symbol)) (doc.data as { symbol?: string }).symbol = symbol;
  let pdf: Buffer;
  try {
    pdf = await renderPdf(doc);
  } catch (e) {
    return new NextResponse(String((e as Error).stack), { status: 500 });
  }
  return new NextResponse(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf" } });
}
