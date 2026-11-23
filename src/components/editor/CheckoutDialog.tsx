"use client";

import { useEffect, useRef, useState } from "react";
import type { DocumentPayload } from "@/lib/templates";
import { getTemplate } from "@/lib/templates";
import { features, site } from "@/config/site";
import { DownloadError, addPurchase, fetchAndDownload, fetchFreeAndDownload, hashDoc, loadRazorpay, openRazorpay, store } from "./checkout";

type Customer = { name: string; email: string; phone: string };
type Step =
  | { s: "form" }
  | { s: "busy"; msg: string }
  | { s: "done"; emailed: boolean; email: string; repeat?: boolean }
  | { s: "error"; msg: string; retry?: () => void };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function CheckoutDialog({
  open,
  onClose,
  doc,
  onPaid,
}: {
  open: boolean;
  onClose: () => void;
  doc: DocumentPayload;
  onPaid: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [c, setC] = useState<Customer>({ name: "", email: "", phone: "" });
  const [step, setStep] = useState<Step>({ s: "form" });
  const [touched, setTouched] = useState(false);
  const t = getTemplate(doc.templateId)!;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      const saved = store.get<Customer>("patra:customer");
      setC((prev) => ({
        name: saved?.name || prev.name || doc.data.name || "",
        email: saved?.email || prev.email,
        phone: saved?.phone || prev.phone,
      }));
      setStep({ s: "form" });
      setTouched(false);
      d.showModal();
    } else if (!open && d.open) d.close();
  }, [open, doc.data.name]);

  const valid = c.name.trim().length > 1 && EMAIL.test(c.email.trim()) && (!c.phone || /^[+\d\s-]{10,15}$/.test(c.phone));

  async function pay() {
    setTouched(true);
    if (!valid) return;
    store.set("patra:customer", c);
    const snapshot: DocumentPayload = JSON.parse(JSON.stringify(doc));
    if (features.freeLaunch) {
      try {
        setStep({ s: "busy", msg: "Generating your PDF…" });
        const r = await fetchFreeAndDownload(snapshot, c);
        setStep({ s: "done", emailed: r.emailed, email: c.email, repeat: r.repeat });
      } catch (e) {
        // The daily limit won't change by retrying, so no "Try again" button for it.
        const limited = e instanceof DownloadError && e.code === "DAILY_LIMIT";
        setStep({ s: "error", msg: (e as Error).message, retry: limited ? undefined : pay });
      }
      return;
    }
    try {
      setStep({ s: "busy", msg: "Preparing secure checkout…" });
      const hash = await hashDoc(snapshot);
      const [orderRes] = await Promise.all([
        fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId: snapshot.templateId, docHash: hash, customer: c }),
        }),
        loadRazorpay(),
      ]);
      const order = (await orderRes.json()) as {
        error?: string;
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
        name: string;
        description: string;
      };
      if (!orderRes.ok) throw new Error(order.error ?? "Could not start payment.");

      setStep({ s: "busy", msg: "Complete the payment in the Razorpay window…" });
      const resp = await openRazorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: `${site.name}${site.trademark}`,
        description: order.description,
        order_id: order.orderId,
        prefill: { name: c.name, email: c.email, contact: c.phone },
        notes: { templateId: snapshot.templateId },
        theme: { color: "#7A1C3A" },
      });

      addPurchase({ hash, templateId: snapshot.templateId, ...resp, email: c.email, at: Date.now() });
      onPaid();

      const download = async () => {
        setStep({ s: "busy", msg: "Payment successful! Generating your PDF…" });
        const r = await fetchAndDownload(snapshot, resp, true);
        setStep({ s: "done", emailed: r.emailed, email: c.email });
      };
      try {
        await download();
      } catch (e) {
        setStep({
          s: "error",
          msg: `${(e as Error).message} Your payment (ID ${resp.razorpay_payment_id}) is safe.`,
          retry: () => download().catch((er) => setStep({ s: "error", msg: (er as Error).message })),
        });
      }
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === "DISMISSED") setStep({ s: "form" });
      else setStep({ s: "error", msg, retry: pay });
    }
  }

  const busy = step.s === "busy";

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        if (busy) e.preventDefault();
        else onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl bg-white p-0 text-ink shadow-2xl backdrop:bg-brand-900/50 backdrop:backdrop-blur-sm"
    >
      <div className="relative">
        <div className="bg-gradient-to-br from-brand-700 to-brand-900 px-6 pb-5 pt-6 text-white">
          {!busy ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              ✕
            </button>
          ) : null}
          <p className="text-xs font-medium uppercase tracking-wider text-marigold-300">Download PDF</p>
          <h2 className="mt-1 font-display text-2xl font-bold">{t.name}</h2>
          <p className="mt-1 text-sm text-white/75">Watermark-free · Print-ready A4 · Copy on email</p>
        </div>

        <div className="p-6">
          {step.s === "form" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                pay();
              }}
              className="space-y-3"
              noValidate
            >
              <div>
                <label className="label" htmlFor="co-name">Your name</label>
                <input id="co-name" className="field" value={c.name} autoComplete="name" onChange={(e) => setC({ ...c, name: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="co-email">Email (we&apos;ll send your PDF here)</label>
                <input
                  id="co-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className="field"
                  value={c.email}
                  onChange={(e) => setC({ ...c, email: e.target.value })}
                />
                {touched && !EMAIL.test(c.email.trim()) ? <p className="mt-1 text-xs text-red-600">Please enter a valid email.</p> : null}
              </div>
              <div>
                <label className="label" htmlFor="co-phone">Mobile (optional{features.freeLaunch ? "" : ", for UPI"})</label>
                <input
                  id="co-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className="field"
                  placeholder="+91"
                  value={c.phone}
                  onChange={(e) => setC({ ...c, phone: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
                <span className="text-sm text-ink-soft">Total</span>
                {features.freeLaunch ? (
                  <span className="flex items-baseline gap-2">
                    <span className="text-sm text-ink-soft line-through">₹{t.priceInr}</span>
                    <span className="font-display text-2xl font-bold text-green-700">Free</span>
                  </span>
                ) : (
                  <span className="font-display text-2xl font-bold text-brand-700">₹{t.priceInr}</span>
                )}
              </div>
              <button type="submit" className="btn-primary w-full py-3 text-base">
                {features.freeLaunch ? "Download free PDF" : <>Pay ₹{t.priceInr} & Download</>}
              </button>
              {features.freeLaunch ? (
                <p className="text-center text-[11px] text-ink-soft">🎉 Launch offer: 1 free PDF per day for a limited time.</p>
              ) : (
              <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-soft">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                Secured by Razorpay · UPI, Cards, Netbanking, Wallets
              </p>
              )}
            </form>
          ) : null}

          {step.s === "busy" ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />
              <p className="mt-4 text-sm font-medium">{step.msg}</p>
              <p className="mt-1 text-xs text-ink-soft">Please don&apos;t close this window.</p>
            </div>
          ) : null}

          {step.s === "done" ? (
            <div className="py-4 text-center">
              <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">🎉</span>
              <h3 className="mt-4 font-display text-2xl font-bold">Your PDF is ready!</h3>
              <p className="mt-2 text-sm text-ink-soft">
                The download has started.{" "}
                {step.repeat ? (
                  <>This is a re-download of the document you already got today, and it doesn&apos;t count towards your limit.</>
                ) : step.emailed ? (
                  <>
                    A copy has been sent to <b className="text-ink">{step.email}</b>.
                  </>
                ) : (
                  <>We couldn&apos;t email it right now, but you can re-download it anytime from this page.</>
                )}
              </p>
              <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
                Done
              </button>
            </div>
          ) : null}

          {step.s === "error" ? (
            <div className="py-4 text-center">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">⚠️</span>
              <p className="mt-4 text-sm">{step.msg}</p>
              <div className="mt-6 flex gap-2">
                <button type="button" onClick={onClose} className="btn-ghost flex-1">
                  Close
                </button>
                {step.retry ? (
                  <button type="button" onClick={step.retry} className="btn-primary flex-1">
                    Try again
                  </button>
                ) : null}
              </div>
              <p className="mt-4 text-[11px] text-ink-soft">
                Need help? Email{" "}
                <a className="underline" href={`mailto:${site.supportEmail}`}>
                  {site.supportEmail}
                </a>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
