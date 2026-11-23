import Link from "next/link";
import type { TemplateMeta } from "@/lib/templates";
import { samplePreview } from "@/lib/defaults";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { price } from "@/lib/pricing";

export function TemplateCard({
  t,
  priority = false,
  lang = "en",
}: {
  t: TemplateMeta;
  priority?: boolean;
  /** "hi" shows a Hindi sample and opens the editor in Hindi. */
  lang?: "en" | "hi";
}) {
  const hi = lang === "hi";
  return (
    <Link
      href={hi ? `/create/${t.id}?lang=hi` : `/create/${t.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-cream-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-900/10"
      data-priority={priority || undefined}
    >
      <div className="relative overflow-hidden rounded-2xl bg-cream-200/60 p-4 sm:p-5">
        <div className="overflow-hidden rounded-md shadow-lg ring-1 ring-black/5 transition duration-500 group-hover:scale-[1.02]">
          <PreviewFrame doc={samplePreview(t.id, lang)} fixedHeight />
        </div>
        {t.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-marigold-400 px-2.5 py-1 text-[11px] font-semibold text-ink shadow">
            {t.badge}
          </span>
        ) : null}
        <span className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center pb-4 transition duration-300 group-hover:translate-y-0">
          <span className="btn-primary">{hi ? "यह डिज़ाइन चुनें →" : "Use this template →"}</span>
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 px-2 pb-1 pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">
            {t.kind === "biodata" ? (hi ? "विवाह बायोडाटा" : "Marriage Biodata") : "Resume / CV"}
          </p>
          <h3 className="mt-0.5 font-display text-lg font-bold text-ink">{t.name}</h3>
          <p className="mt-0.5 text-sm text-ink-soft">{t.tagline}</p>
        </div>
        <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
          {price(t.priceInr)}
        </span>
      </div>
      <div className="flex gap-1.5 px-2 pb-2 pt-3" aria-label="Available colours">
        {t.accents.map((c) => (
          <span key={c} className="h-4 w-4 rounded-full ring-2 ring-white" style={{ background: c }} />
        ))}
      </div>
    </Link>
  );
}
