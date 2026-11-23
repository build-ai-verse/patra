import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { brandFull, site } from "@/config/site";

/**
 * SMTP mailer. Works with any SMTP provider: Gmail (App Password), Zoho Mail,
 * Amazon SES, Brevo, Hostinger, etc. Configure via SMTP_* env vars.
 */

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter: Transporter | null = null;
function getTransport() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export interface Txn {
  orderId: string;
  paymentId: string;
  amountInr: number;
  method: string;
  status: string;
  paidAt: Date;
  templateName: string;
  documentName: string;
  customer: { name: string; email: string; phone: string };
  /** Free launch download (no payment). */
  free?: boolean;
}

const fmtIST = (d: Date) =>
  d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " IST";

function shell(inner: string) {
  return `<!doctype html><html><body style="margin:0;background:#FBF6EE;font-family:Segoe UI,Arial,sans-serif;color:#2A1A1F">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #EFE3D3">
    <tr><td style="background:#7A1C3A;padding:22px 28px;color:#fff">
      <div style="font-family:Georgia,serif;font-size:26px;font-weight:bold">${esc(site.name)}<sup style="font-size:12px">${esc(site.trademark)}</sup></div>
      <div style="font-size:12px;opacity:.85;margin-top:2px">${esc(site.tagline)}</div>
    </td></tr>
    <tr><td style="padding:28px">${inner}</td></tr>
    <tr><td style="padding:16px 28px;background:#FBF6EE;font-size:12px;color:#7A6A6F;text-align:center">
      ${esc(brandFull)} &middot; Powered by <b>${esc(site.poweredBy)}</b><br/>
      <a href="${site.url}" style="color:#7A1C3A">${site.url.replace(/^https?:\/\//, "")}</a> &middot; ${esc(site.supportEmail)}
    </td></tr>
  </table></td></tr></table></body></html>`;
}

function row(k: string, v: string) {
  return `<tr><td style="padding:8px 0;color:#7A6A6F;font-size:13px;width:42%;border-bottom:1px solid #F3EADF">${esc(k)}</td>
  <td style="padding:8px 0;font-size:13px;font-weight:600;border-bottom:1px solid #F3EADF">${esc(v)}</td></tr>`;
}

function txnTable(t: Txn, admin: boolean) {
  if (t.free) {
    return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0">
    ${row("Document", `${t.templateName} - ${t.documentName}`)}
    ${row("Price", "Free (launch offer)")}
    ${row("Reference", t.orderId)}
    ${row("Date", fmtIST(t.paidAt))}
    ${admin ? row("Customer name", t.customer.name) + row("Customer email", t.customer.email) + row("Customer phone", t.customer.phone || "-") : ""}
  </table>`;
  }
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0">
    ${row("Document", `${t.templateName} - ${t.documentName}`)}
    ${row("Amount paid", `INR ${t.amountInr.toFixed(2)}`)}
    ${row("Payment ID", t.paymentId)}
    ${row("Order ID", t.orderId)}
    ${row("Payment method", t.method)}
    ${row("Status", t.status)}
    ${row("Date", fmtIST(t.paidAt))}
    ${admin ? row("Customer name", t.customer.name) + row("Customer email", t.customer.email) + row("Customer phone", t.customer.phone || "-") : ""}
  </table>`;
}

export async function sendDocumentEmails(t: Txn, pdf: Buffer, filename: string) {
  if (!mailConfigured()) {
    console.warn("[mailer] SMTP not configured - skipping emails");
    return { customer: false, admin: false };
  }
  const from = process.env.MAIL_FROM ?? `${site.name} <${process.env.SMTP_USER}>`;
  const adminTo = process.env.ADMIN_EMAIL ?? process.env.SMTP_USER!;
  const attachments = [{ filename, content: pdf, contentType: "application/pdf" }];
  const tx = getTransport();

  const customerHtml = shell(`
    <h2 style="margin:0 0 8px;font-family:Georgia,serif;color:#7A1C3A">Your document is ready 🎉</h2>
    <p style="font-size:14px;line-height:1.6;margin:0">Namaste ${esc(t.customer.name || "there")},<br/>
    Thank you for using ${esc(brandFull)}. Your <b>${esc(t.templateName)}</b> PDF is attached to this email. Keep it safe and share it with confidence!</p>
    ${txnTable(t, false)}
    <p style="font-size:13px;color:#7A6A6F;margin:0">Need help? Just reply to this email or write to ${esc(site.supportEmail)}.</p>`);

  const adminHtml = shell(`
    <h2 style="margin:0 0 8px;font-family:Georgia,serif;color:#7A1C3A">${t.free ? "New free download 🎁" : "New paid download ✅"}</h2>
    <p style="font-size:14px;margin:0">${t.free ? "Someone just downloaded a document (free launch offer)." : "A customer just purchased a document."} Copy attached.</p>
    ${txnTable(t, true)}`);

  const [customer, admin] = await Promise.allSettled([
    tx.sendMail({
      from,
      to: t.customer.email,
      replyTo: site.supportEmail,
      subject: `Your ${t.templateName} PDF from ${site.name} is ready`,
      html: customerHtml,
      attachments,
    }),
    tx.sendMail({
      from,
      to: adminTo,
      replyTo: t.customer.email,
      subject: t.free
        ? `[${site.name}] FREE - ${t.templateName} - ${t.customer.name} (${t.orderId})`
        : `[${site.name}] INR ${t.amountInr} - ${t.templateName} - ${t.customer.name} (${t.paymentId})`,
      html: adminHtml,
      attachments,
    }),
  ]);
  if (customer.status === "rejected") console.error("[mailer] customer email failed", customer.reason);
  if (admin.status === "rejected") console.error("[mailer] admin email failed", admin.reason);
  return { customer: customer.status === "fulfilled", admin: admin.status === "fulfilled" };
}

/** Admin-only alert, used by the Razorpay webhook as a backup record of every captured payment. */
export async function sendAdminAlert(subject: string, lines: Record<string, string>) {
  if (!mailConfigured()) return false;
  const from = process.env.MAIL_FROM ?? `${site.name} <${process.env.SMTP_USER}>`;
  const html = shell(`<h2 style="margin:0 0 8px;font-family:Georgia,serif;color:#7A1C3A">${esc(subject)}</h2>
    <table width="100%" cellpadding="0" cellspacing="0">${Object.entries(lines).map(([k, v]) => row(k, v)).join("")}</table>`);
  await getTransport().sendMail({ from, to: process.env.ADMIN_EMAIL ?? process.env.SMTP_USER!, subject: `[${site.name}] ${subject}`, html });
  return true;
}
