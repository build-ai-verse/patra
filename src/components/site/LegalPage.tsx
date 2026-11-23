import type { ReactNode } from "react";
import { site } from "@/config/site";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated: {site.policyUpdated}</p>
      <article className="prose-patra mt-6 rounded-3xl border border-cream-200 bg-white p-6 sm:p-10">{children}</article>
    </div>
  );
}
