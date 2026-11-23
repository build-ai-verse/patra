import { NextResponse } from "next/server";
import { features, site } from "@/config/site";
import { getTemplate } from "@/lib/templates";
import { createOrder, razorpayConfigured } from "@/lib/razorpay";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HASH = /^[a-f0-9]{64}$/;

/**
 * POST /api/order
 * Creates a Razorpay order for one document download. The SHA-256 hash of the
 * document content is stored in the order notes so the payment can only unlock
 * that exact document (verified again in /api/verify).
 */
export async function POST(req: Request) {
  if (features.freeLaunch) {
    return NextResponse.json({ error: "Downloads are free right now - no payment needed." }, { status: 409 });
  }
  if (!razorpayConfigured()) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }
  const body = (await req.json().catch(() => null)) as {
    templateId?: string;
    docHash?: string;
    customer?: { name?: string; email?: string; phone?: string };
  } | null;

  const t = getTemplate(body?.templateId ?? "");
  const name = (body?.customer?.name ?? "").trim().slice(0, 80);
  const email = (body?.customer?.email ?? "").trim().toLowerCase().slice(0, 120);
  const phone = (body?.customer?.phone ?? "").replace(/[^\d+]/g, "").slice(0, 15);

  if (!t || !HASH.test(body?.docHash ?? "")) {
    return NextResponse.json({ error: "Invalid document." }, { status: 400 });
  }
  if (!name || !EMAIL.test(email)) {
    return NextResponse.json({ error: "Please enter your name and a valid email." }, { status: 400 });
  }

  try {
    const order = await createOrder({
      amount: t.priceInr * 100,
      currency: site.currency,
      receipt: `${t.id}-${Date.now()}`.slice(0, 40),
      notes: {
        product: `${site.name} - ${t.name}`,
        templateId: t.id,
        docHash: body!.docHash!,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
      },
    });
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      name: site.name,
      description: `${t.name} - PDF download`,
    });
  } catch (e) {
    console.error("[order]", e);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
