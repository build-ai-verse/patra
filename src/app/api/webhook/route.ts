import { NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/razorpay";
import { sendAdminAlert } from "@/lib/mailer";

/**
 * POST /api/webhook  (optional but recommended)
 * Razorpay Dashboard -> Settings -> Webhooks -> URL: https://<your-domain>/api/webhook
 * Events: payment.captured, payment.failed. Secret -> RAZORPAY_WEBHOOK_SECRET.
 *
 * Sends the admin an email for every captured/failed payment - a backup record in case
 * a customer closes the browser before their download completes.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhook(raw, sig)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  try {
    const evt = JSON.parse(raw) as {
      event: string;
      payload?: { payment?: { entity?: Record<string, unknown> } };
    };
    const p = evt.payload?.payment?.entity ?? {};
    const notes = (p.notes ?? {}) as Record<string, string>;
    if (evt.event === "payment.captured" || evt.event === "payment.failed") {
      await sendAdminAlert(evt.event === "payment.captured" ? "Payment captured (webhook)" : "Payment failed (webhook)", {
        "Payment ID": String(p.id ?? ""),
        "Order ID": String(p.order_id ?? ""),
        Amount: `INR ${Number(p.amount ?? 0) / 100}`,
        Method: String(p.method ?? ""),
        Status: String(p.status ?? ""),
        Email: String(p.email ?? notes.customerEmail ?? ""),
        Phone: String(p.contact ?? notes.customerPhone ?? ""),
        Template: String(notes.templateId ?? ""),
        Error: String(p.error_description ?? "-"),
      });
    }
  } catch (e) {
    console.error("[webhook]", e);
  }
  return NextResponse.json({ ok: true });
}
