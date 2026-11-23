"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BiodataData, DocumentPayload, ResumeData, TemplateId } from "@/lib/templates";
import { getTemplate, templates } from "@/lib/templates";
import { defaultPayload, sampleBiodata } from "@/lib/defaults";
import { convertBiodata } from "@/lib/hindi";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { BiodataForm } from "./BiodataForm";
import { ResumeForm } from "./ResumeForm";
import { CheckoutDialog } from "./CheckoutDialog";
import { features } from "@/config/site";
import { fetchAndDownload, findPurchase, hashDoc, store, type Purchase } from "./checkout";

export function Editor({ templateId }: { templateId: TemplateId }) {
  const t = getTemplate(templateId)!;
  const draftKey = `patra:draft:${t.kind}`;
  const accentKey = `patra:accent:${t.id}`;

  const [doc, setDoc] = useState<DocumentPayload>(() => defaultPayload(templateId));
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [checkout, setCheckout] = useState(false);
  const [paid, setPaid] = useState<Purchase | null>(null);
  const [redownloading, setRedownloading] = useState(false);
  const [paidTick, setPaidTick] = useState(0);

  // Load saved draft (shared across templates of the same kind) after mount.
  useEffect(() => {
    const base = defaultPayload(templateId);
    let data = store.get<BiodataData | ResumeData>(draftKey) ?? base.data;
    const accent = store.get<string>(accentKey);
    // Links like /create/biodata-royal?lang=hi open the biodata in Hindi.
    const wantLang = new URLSearchParams(window.location.search).get("lang");
    if (t.kind === "biodata" && (wantLang === "hi" || wantLang === "en")) {
      const bd = data as BiodataData;
      if ((bd.lang ?? "en") !== wantLang) data = convertBiodata(bd, wantLang, sampleBiodata);
    }
    // localStorage is only available after hydration, so the draft must be applied in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDoc({
      ...base,
      accent: accent && t.accents.includes(accent) ? accent : base.accent,
      data: data as never,
    } as DocumentPayload);
    setLoaded(true);
  }, [templateId, draftKey, accentKey, t.accents, t.kind]);

  // Autosave.
  useEffect(() => {
    if (!loaded) return;
    const id = setTimeout(() => {
      store.set(draftKey, doc.data);
      store.set(accentKey, doc.accent);
    }, 400);
    return () => clearTimeout(id);
  }, [doc, loaded, draftKey, accentKey]);

  // Has this exact document already been paid for? (free re-download)
  useEffect(() => {
    if (!loaded) return;
    let alive = true;
    const id = setTimeout(async () => {
      try {
        const h = await hashDoc(doc);
        if (alive) setPaid(findPurchase(h) ?? null);
      } catch {
        /* crypto.subtle unavailable on insecure origins */
      }
    }, 500);
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, [doc, loaded, paidTick]);

  const setData = (data: BiodataData | ResumeData) => setDoc((d) => ({ ...d, data }) as DocumentPayload);
  const siblings = templates.filter((x) => x.kind === t.kind);

  async function redownload() {
    if (!paid) return;
    setRedownloading(true);
    try {
      await fetchAndDownload(doc, paid, false);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setRedownloading(false);
    }
  }

  const downloadButton = (full = false) =>
    paid ? (
      <button type="button" onClick={redownload} disabled={redownloading} className={`btn-gold ${full ? "w-full" : ""}`}>
        {redownloading ? "Preparing…" : "Download again (paid)"}
      </button>
    ) : (
      <button type="button" onClick={() => setCheckout(true)} className={`btn-primary ${full ? "w-full" : ""}`}>
        {features.freeLaunch ? "Download PDF · Free" : <>Download PDF · ₹{t.priceInr}</>}
      </button>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
      {/* Top bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <nav className="text-xs text-ink-soft" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-700">Home</Link> /{" "}
            <Link href={t.kind === "biodata" ? "/marriage-biodata" : "/resume-maker"} className="hover:text-brand-700">
              {t.kind === "biodata" ? "Marriage Biodata" : "Resume Maker"}
            </Link>{" "}
            / <span className="text-ink">{t.name}</span>
          </nav>
          <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
            {t.kind === "biodata"
              ? (doc.data as BiodataData).lang === "hi"
                ? "अपना विवाह बायोडाटा बनाएं"
                : "Create your Marriage Biodata"
              : "Build your Resume"}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full border border-cream-200 bg-white p-1" role="tablist" aria-label="Template">
            {siblings.map((s) => (
              <Link
                key={s.id}
                href={`/create/${s.id}`}
                role="tab"
                aria-selected={s.id === t.id}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  s.id === t.id ? "bg-brand-700 text-white shadow" : "text-ink-soft hover:text-brand-700"
                }`}
              >
                {s.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-cream-200 bg-white px-2.5 py-1.5" aria-label="Colour theme">
            {t.accents.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Colour ${c}`}
                aria-pressed={doc.accent === c}
                onClick={() => setDoc((d) => ({ ...d, accent: c }))}
                className={`h-6 w-6 rounded-full transition ${doc.accent === c ? "ring-2 ring-offset-2" : "hover:scale-110"}`}
                style={{ background: c, ["--tw-ring-color" as string]: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="sticky top-16 z-30 -mx-4 mt-4 bg-cream/90 px-4 py-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-2 rounded-full border border-cream-200 bg-white p-1 text-sm font-semibold">
          {(["edit", "preview"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`rounded-full py-2 transition ${tab === k ? "bg-brand-700 text-white" : "text-ink-soft"}`}
            >
              {k === "edit" ? "✏️ Edit details" : "👁️ Preview"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-8 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Form */}
        <div className={`${tab === "edit" ? "block" : "hidden"} lg:block`}>
          {doc.templateId.startsWith("biodata") ? (
            <BiodataForm data={doc.data as BiodataData} onChange={setData} accent={doc.accent} />
          ) : (
            <ResumeForm data={doc.data as ResumeData} onChange={setData} showPhoto={doc.templateId === "resume-modern"} />
          )}
          <div className="mt-4 flex justify-between text-xs text-ink-soft">
            <span>✓ Auto-saved in your browser</span>
            <button
              type="button"
              className="underline hover:text-brand-700"
              onClick={() => {
                if (confirm("Reset all fields to the sample content?")) setDoc(defaultPayload(templateId));
              }}
            >
              Reset to sample
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className={`${tab === "preview" ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-cream-200 bg-cream-200/50 p-3 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-ink-soft">
                  Live preview <span className="hidden sm:inline">· watermark removed in PDF</span>
                </p>
                <div className="hidden lg:block">
                  {downloadButton()}
                </div>
              </div>
              <div className="max-h-[calc(100vh-13rem)] overflow-auto rounded-lg shadow-xl ring-1 ring-black/5 max-lg:max-h-none">
                <PreviewFrame doc={doc} watermark />
              </div>
            </div>
            {t.kind === "biodata" ? (
              <p className="mt-3 text-center text-[11px] text-ink-soft">
                Tip: biodata can be written in English or हिन्दी, and the PDF supports both.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile sticky download bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="shrink-0">
            <p className="text-[11px] text-ink-soft">{paid ? "Already paid" : features.freeLaunch ? "Launch offer" : "One-time"}</p>
            <p className="font-display text-xl font-bold text-brand-700">{paid ? "✓" : features.freeLaunch ? "Free" : `₹${t.priceInr}`}</p>
          </div>
          <div className="flex-1">
            {downloadButton(true)}
          </div>
        </div>
      </div>

      <CheckoutDialog
        open={checkout}
        onClose={() => setCheckout(false)}
        doc={doc}
        onPaid={() => setPaidTick((n) => n + 1)}
      />
    </div>
  );
}
