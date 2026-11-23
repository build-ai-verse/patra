import "server-only";
import crypto from "node:crypto";

/** Minimal Razorpay REST client (no SDK needed). Server-only. */

const API = "https://api.razorpay.com/v1";

export function razorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

function authHeader() {
  const id = process.env.RAZORPAY_KEY_ID ?? "";
  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

async function rzp<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: init?.method ?? "GET",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as T & { error?: { description?: string } };
  if (!res.ok) {
    throw new Error(`Razorpay ${path} failed: ${json?.error?.description ?? res.status}`);
  }
  return json;
}

export interface RzpOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
  receipt: string;
  notes: Record<string, string>;
}

export interface RzpPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  method: string;
  email?: string;
  contact?: string;
  created_at: number;
  vpa?: string;
  bank?: string;
  wallet?: string;
  card?: { network?: string; last4?: string };
}

export const createOrder = (body: {
  amount: number;
  currency: string;
  receipt: string;
  notes: Record<string, string>;
}) => rzp<RzpOrder>("/orders", { method: "POST", body });

export const fetchOrder = (id: string) => rzp<RzpOrder>(`/orders/${encodeURIComponent(id)}`);

export const fetchPayment = (id: string) => rzp<RzpPayment>(`/payments/${encodeURIComponent(id)}`);

export const capturePayment = (id: string, amount: number, currency: string) =>
  rzp<RzpPayment>(`/payments/${encodeURIComponent(id)}/capture`, {
    method: "POST",
    body: { amount, currency },
  });

/** Verifies the checkout signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret). */
export function verifySignature(orderId: string, paymentId: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Verifies webhook payloads: HMAC_SHA256(raw_body, webhook_secret). */
export function verifyWebhook(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
