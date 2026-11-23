import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Editor } from "@/components/editor/Editor";
import { getTemplate, templates, type TemplateId } from "@/lib/templates";
import { FREE } from "@/lib/pricing";

export function generateStaticParams() {
  return templates.map((t) => ({ templateId: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/create/[templateId]">): Promise<Metadata> {
  const { templateId } = await params;
  const t = getTemplate(templateId);
  if (!t) return {};
  const what = t.kind === "biodata" ? "Marriage Biodata" : "Resume";
  return {
    title: `${t.name} ${what} Maker - Create Online, Download PDF ${FREE ? "Free" : `for ₹${t.priceInr}`}`,
    description: `${t.description} Fill your details, preview free and download a print-ready PDF ${FREE ? "free" : `for just ₹${t.priceInr}`}.`,
    alternates: { canonical: `/create/${t.id}` },
    openGraph: { title: `${t.name} ${what} Template`, description: t.description, url: `/create/${t.id}` },
  };
}

export default async function CreatePage({ params }: PageProps<"/create/[templateId]">) {
  const { templateId } = await params;
  if (!getTemplate(templateId)) notFound();
  return <Editor templateId={templateId as TemplateId} />;
}
