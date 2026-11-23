import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { templates } from "@/lib/templates";

const lastModified = "2026-11-23";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  return [
    { url: u("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: u("/marriage-biodata"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: u("/marriage-biodata-hindi"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: u("/ats-checker"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: u("/resume-maker"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...templates.map((t) => ({ url: u(`/create/${t.id}`), lastModified, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...["/contact", "/terms", "/privacy-policy", "/refund-policy", "/shipping-policy"].map((p) => ({
      url: u(p),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
