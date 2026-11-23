import { NextResponse, after } from "next/server";
import { site } from "@/config/site";
import { getTemplate } from "@/lib/templates";
import { normalizePayload } from "@/lib/normalize";
import {
  capturePayment,
  fetchOrder,
  fetchPayment,
  razorpayConfigured,
  sha256,
  verifySignature,
} from "@/lib/razorpay";
import { renderPdf, pdfFilename } from "@/lib/pdf/render";
import { sendDocumentEmails } from "@/lib/mailer";
import { backupPdfToDrive, driveConfigured } from "@/lib/drive";

export const maxDuration = 60;

/**
 * POST /api/verify
 * 1. Verifies the Razorpay checkout signature.
 * 2. Confirms the payment belongs to the order, is for the right amount, and is captured.
 * 3. Confirms the document content matches the hash stored on the order.
 * 4. Renders the clean PDF, emails it to the customer (+ copy to admin with
 *    transaction details) and streams it back for download.
 * 5. After responding, backs the PDF up to the business Google Drive (if configured).
 *
 * Calling again with the same payment (e.g. "download again") is allowed for the
 * same document; pass sendEmail=false to skip re-sending emails.
 */
export async function POST(req: Request) {
  if (!razorpayConfigured()) {
    return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  }
  const body = (await req.json().catch(() => null)) as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    document?: unknown;
    sendEmail?: boolean;
  } | null;

  const orderId = String(body?.razorpay_order_id ?? "");
  const paymentId = String(body?.razorpay_payment_id ?? "");
  const signature = String(body?.razorpay_signature ?? "");
  if (!orderId || !paymentId || !signature || !body?.document) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  }
  if (!verifySignature(orderId, paymentId, signature)) {
    return NextResponse.json({ error: "Payment signature mismatch." }, { status: 400 });
  }

  try {
    const [order, initialPayment] = await Promise.all([fetchOrder(orderId), fetchPayment(paymentId)]);
    let payment = initialPayment;
    // Price comes from the template recorded on the order (set server-side in /api/order).
    const orderTemplate = getTemplate(order.notes?.templateId ?? "");
    if (!orderTemplate) {
      return NextResponse.json({ error: "Unknown template on order." }, { status: 400 });
    }
    const expectedAmount = orderTemplate.priceInr * 100;

    if (payment.order_id !== orderId || payment.amount !== expectedAmount || order.amount !== expectedAmount) {
      return NextResponse.json({ error: "Payment does not match this order." }, { status: 400 });
    }
    if (payment.status === "authorized") {
      payment = await capturePayment(paymentId, expectedAmount, site.currency);
    }
    if (payment.status !== "captured") {
      return NextResponse.json({ error: `Payment is ${payment.status}.` }, { status: 402 });
    }

    // Bind payment to this exact document.
    if (order.notes?.docHash !== sha256(JSON.stringify(body.document))) {
      return NextResponse.json(
        { error: "This payment was made for a different version of the document." },
        { status: 409 },
      );
    }

    const doc = normalizePayload(body.document);
    if (!doc || doc.templateId !== order.notes?.templateId) {
      return NextResponse.json({ error: "Invalid document." }, { status: 400 });
    }

    const pdf = await renderPdf(doc);
    const filename = pdfFilename(doc);
    const t = getTemplate(doc.templateId)!;

    let emailed = { customer: false, admin: false };
    if (body.sendEmail !== false) {
      const method =
        payment.method === "upi" && payment.vpa
          ? `UPI (${payment.vpa})`
          : payment.method === "card" && payment.card?.last4
            ? `Card (${payment.card.network ?? ""} **** ${payment.card.last4})`
            : payment.method === "netbanking"
              ? `Netbanking (${payment.bank ?? ""})`
              : payment.method === "wallet"
                ? `Wallet (${payment.wallet ?? ""})`
                : payment.method;
      emailed = await sendDocumentEmails(
        {
          orderId,
          paymentId,
          amountInr: payment.amount / 100,
          method,
          status: payment.status,
          paidAt: new Date(payment.created_at * 1000),
          templateName: t.name,
          documentName: doc.data.name || "Document",
          customer: {
            name: order.notes?.customerName ?? "",
            email: order.notes?.customerEmail || payment.email || "",
            phone: order.notes?.customerPhone || payment.contact || "",
          },
        },
        pdf,
        filename,
      );
    }

    // Backup to Google Drive after the response is sent; never blocks or fails the sale.
    if (driveConfigured()) {
      const customerEmail = order.notes?.customerEmail || payment.email || "";
      const paidAt = new Date(payment.created_at * 1000);
      after(async () => {
        try {
          await backupPdfToDrive(pdf, { orderId, paymentId, paidAt, filename, customerEmail, templateName: t.name });
        } catch (e) {
          console.error("[verify] Google Drive backup failed", orderId, e);
        }
      });
    }

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Filename": filename,
        "X-Email-Sent": emailed.customer ? "1" : "0",
      },
    });
  } catch (e) {
    console.error("[verify]", e);
    return NextResponse.json(
      { error: "We could not prepare your document. Your payment is safe - please retry or contact support." },
      { status: 500 },
    );
  }
}
