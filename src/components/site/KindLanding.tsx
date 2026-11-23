import Link from "next/link";
import type { ReactNode } from "react";
import { templates, type TemplateKind } from "@/lib/templates";
import { TemplateCard } from "./TemplateCard";
import { CtaBand, Faq, HowItWorks } from "./Sections";
import { JsonLd } from "./JsonLd";
import { site } from "@/config/site";

export function KindLanding({
  kind,
  eyebrow,
  title,
  intro,
  cta,
  article,
  faqs,
  path,
}: {
  kind: TemplateKind;
  eyebrow: string;
  title: ReactNode;
  intro: string;
  cta: { href: string; label: string };
  article: ReactNode;
  faqs: { q: string; a: string }[];
  path: string;
}) {
  const list = templates.filter((t) => t.kind === kind);
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: site.url },
              { "@type": "ListItem", position: 2, name: eyebrow, item: `${site.url}${path}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />
      <section className="relative overflow-hidden">
        <div className="bg-mandala absolute inset-0" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-marigold-300/40 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-14 text-center sm:px-6 md:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-marigold-600">{eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{intro}</p>
          <div className="mt-8 flex justify-center">
            <Link href={cta.href} className="btn-primary px-7 py-3.5 text-base">
              {cta.label}
            </Link>
          </div>
        </div>
      </section>
      <section className="pb-8">
        <div className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-2 sm:px-6">
          {list.map((t) => (
            <TemplateCard key={t.id} t={t} />
          ))}
        </div>
      </section>
      <HowItWorks />
      <section className="py-12">
        <article className="prose-patra mx-auto max-w-3xl px-4 sm:px-6">{article}</article>
      </section>
      <Faq items={faqs} />
      <CtaBand />
    </>
  );
}
