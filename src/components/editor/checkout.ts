"use client";

import type { DocumentPayload } from "@/lib/templates";

/* ---------------- Safe localStorage helpers ---------------- */
export const store = {
  get<T>(key: string): T | null {
    try {
      const v = localStorage.getItem(key);
      return v ? (JSON.parse(v) as T) : null;
    } catch {
      return null;
    }
  },
  set(key: string, v: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* quota / private mode - ignore */
    }
  },
  del(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

/** SHA-256 of the exact JSON we send to the server (the server recomputes it). */
export async function hashDoc(doc: DocumentPayload): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(doc)));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ---------------- Purchases (for free re-download of the same document) ---------------- */
export interface Purchase {
  hash: string;
  templateId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  email: string;
  at: number;
}
const PKEY = "patra:purchases";
export const getPurchases = () => store.get<Purchase[]>(PKEY) ?? [];
export const addPurchase = (p: Purchase) => store.set(PKEY, [p, ...getPurchases().filter((x) => x.hash !== p.hash)].slice(0, 30));
export const findPurchase = (hash: string) => getPurchases().find((p) => p.hash === hash);

/* ---------------- Razorpay checkout script ---------------- */
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open(): void;
  on(evt: string, cb: (r: { error?: { description?: string } }) => void): void;
}
declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => RazorpayInstance;
  }
}

let loading: Promise<void> | null = null;
export function loadRazorpay(): Promise<void> {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error("Could not load Razorpay. Check your internet connection."));
    };
    document.body.appendChild(s);
  });
  return loading;
}

export function openRazorpay(opts: Record<string, unknown>): Promise<RazorpayResponse> {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      ...opts,
      handler: (r: RazorpayResponse) => resolve(r),
      modal: { ondismiss: () => reject(new Error("DISMISSED")), confirm_close: true },
    });
    rzp.on("payment.failed", (r) => reject(new Error(r.error?.description ?? "Payment failed")));
    rzp.open();
  });
}

/** Calls /api/verify and triggers a browser download of the returned PDF. */
export async function fetchAndDownload(
  doc: DocumentPayload,
  p: Pick<Purchase, "razorpay_order_id" | "razorpay_payment_id" | "razorpay_signature">,
  sendEmail: boolean,
) {
  const res = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...p, document: doc, sendEmail }),
  });
  return saveResponse(res);
}

/** Free launch offer: calls /api/free (no payment) and triggers the download. */
export async function fetchFreeAndDownload(
  doc: DocumentPayload,
  customer: { name: string; email: string; phone: string },
) {
  const res = await fetch("/api/free", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document: doc, customer }),
  });
  return saveResponse(res);
}

/** Error from the download APIs; `code` is e.g. "DAILY_LIMIT" for the free-offer limit. */
export class DownloadError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

async function saveResponse(res: Response) {
  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
    throw new DownloadError(j.error ?? "Download failed. Please try again.", j.code);
  }
  const blob = await res.blob();
  const filename = res.headers.get("X-Filename") ?? "document.pdf";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return {
    emailed: res.headers.get("X-Email-Sent") === "1",
    repeat: res.headers.get("X-Repeat-Download") === "1",
    url,
    filename,
  };
}
