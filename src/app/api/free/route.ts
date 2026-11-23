import { NextResponse, type NextRequest } from "next/server";
import { features } from "@/config/site";
import { getTemplate } from "@/lib/templates";
import { normalizePayload } from "@/lib/normalize";
import { renderPdf, pdfFilename } from "@/lib/pdf/render";
import { sendDocumentEmails } from "@/lib/mailer";
import { backupPdfToDrive, driveConfigured } from "@/lib/drive";
import { checkFreeQuota, freeKeys, rememberFreeDownload } from "@/lib/free-limit";

export const maxDuration = 60;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DEVICE_COOKIE = "patra_did";
const DEVICE_ID = /^[a-f0-9-]{36}$/;

/* ---------- Best-effort per-IP limit (per server instance) to stop bulk abuse ---------- */
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 15;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

/**
 * POST /api/free  { document, customer: { name, email, phone? }, sendEmail? }
 * Launch offer (NEXT_PUBLIC_FREE_LAUNCH=true): renders the clean PDF without payment,
 * emails it (+ admin copy), backs it up to Google Drive and streams it back.
 * Limit: 1 download per day (IST) per email and per device (cookie); downloading the
 * same document again that day is allowed and sends no new email. See lib/free-limit.ts.
 */
export async function POST(req: NextRequest) {
  if (!features.freeLaunch) {
    return NextResponse.json({ error: "Free downloads are not available." }, { status: 404 });
  }
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many downloads. Please try again in an hour." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as {
    document?: unknown;
    customer?: { name?: string; email?: string; phone?: string };
    sendEmail?: boolean;
  } | null;
  const name = (body?.customer?.name ?? "").trim().slice(0, 80);
  const email = (body?.customer?.email ?? "").trim().toLowerCase().slice(0, 120);
  const phone = (body?.customer?.phone ?? "").replace(/[^\d+]/g, "").slice(0, 15);
  if (!name || !EMAIL.test(email)) {
    return NextResponse.json({ error: "Please enter your name and a valid email." }, { status: 400 });
  }
  const doc = normalizePayload(body?.document);
  const t = doc ? getTemplate(doc.templateId) : null;
  if (!doc || !t) {
    return NextResponse.json({ error: "Invalid document." }, { status: 400 });
  }

  // Device id: long-lived httpOnly cookie, created on first free download.
  const cookieId = req.cookies.get(DEVICE_COOKIE)?.value ?? "";
  const deviceId = DEVICE_ID.test(cookieId) ? cookieId : crypto.randomUUID();
  const keys = freeKeys(email, deviceId, JSON.stringify(doc));
  const quota = await checkFreeQuota(keys);
  if (!quota.ok) {
    const res = NextResponse.json(
      {
        error:
          quota.reason === "email"
            ? "This email has already used today's free download. The launch offer allows 1 free PDF per day, so please come back tomorrow. You can still re-download the same document."
            : "This device has already used today's free download. The launch offer allows 1 free PDF per day, so please come back tomorrow. You can still re-download the same document.",
        code: "DAILY_LIMIT",
      },
      { status: 429 },
    );
    return withDeviceCookie(res, deviceId);
  }

  try {
    const pdf = await renderPdf(doc);
    const filename = pdfFilename(doc);
    const ref = `FREE-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const at = new Date();

    let emailed = { customer: false, admin: false };
    // A same-day re-download of the same document is not counted and sends no new email.
    if (!quota.repeat) {
      // Record first (the Drive backup is the daily-limit record), awaited before responding.
      rememberFreeDownload(keys);
      if (driveConfigured()) {
        try {
          await backupPdfToDrive(pdf, {
            orderId: ref,
            paymentId: ref,
            paidAt: at,
            filename,
            customerEmail: email,
            templateName: t.name,
            tags: { kind: "free", ...keys },
          });
        } catch (e) {
          console.error("[free] Google Drive backup failed", ref, e);
        }
      }
      if (body?.sendEmail !== false) {
        emailed = await sendDocumentEmails(
          {
            orderId: ref,
            paymentId: ref,
            amountInr: 0,
            method: "Free launch offer",
            status: "free",
            paidAt: at,
            templateName: t.name,
            documentName: doc.data.name || "Document",
            customer: { name, email, phone },
            free: true,
          },
          pdf,
          filename,
        );
      }
    }

    const res = new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Filename": filename,
        "X-Email-Sent": emailed.customer ? "1" : "0",
        "X-Repeat-Download": quota.repeat ? "1" : "0",
      },
    });
    return withDeviceCookie(res, deviceId);
  } catch (e) {
    console.error("[free]", e);
    return NextResponse.json({ error: "We could not prepare your document. Please try again." }, { status: 500 });
  }
}

function withDeviceCookie<T extends NextResponse>(res: T, deviceId: string): T {
  res.cookies.set(DEVICE_COOKIE, deviceId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });
  return res;
}
