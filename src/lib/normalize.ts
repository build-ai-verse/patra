import type {
  BiodataData,
  DocumentPayload,
  ResumeData,
} from "./templates";
import { getTemplate, isSymbolId } from "./templates";

/** Server-side sanitising of untrusted document payloads before rendering. */

const str = (v: unknown, max = 300): string =>
  typeof v === "string" ? v.slice(0, max) : typeof v === "number" ? String(v).slice(0, max) : "";

const arr = <T>(v: unknown, max: number, map: (x: Record<string, unknown>) => T): T[] =>
  Array.isArray(v)
    ? v
        .slice(0, max)
        .filter((x) => x && typeof x === "object")
        .map((x) => map(x as Record<string, unknown>))
    : [];

const HEX = /^#[0-9a-fA-F]{6}$/;
const PHOTO = /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/;
const MAX_PHOTO = 1_500_000; // ~1.1 MB binary

const photo = (v: unknown): string | null =>
  typeof v === "string" && v.length < MAX_PHOTO && PHOTO.test(v) ? v : null;

function biodata(d: Record<string, unknown>): BiodataData {
  return {
    lang: d.lang === "hi" ? "hi" : "en",
    symbol: isSymbolId(d.symbol) ? d.symbol : "none",
    headerText: str(d.headerText, 80),
    title: str(d.title, 40),
    name: str(d.name, 80),
    photo: photo(d.photo),
    sections: arr(d.sections, 8, (s) => ({
      id: str(s.id, 40),
      title: str(s.title, 60),
      fields: arr(s.fields, 30, (fl) => ({
        id: str(fl.id, 40),
        label: str(fl.label, 60),
        value: str(fl.value, 400),
      })),
    })),
  };
}

function resume(d: Record<string, unknown>): ResumeData {
  return {
    name: str(d.name, 80),
    title: str(d.title, 100),
    email: str(d.email, 120),
    phone: str(d.phone, 40),
    location: str(d.location, 100),
    linkedin: str(d.linkedin, 150),
    website: str(d.website, 150),
    photo: photo(d.photo),
    summary: str(d.summary, 1500),
    experience: arr(d.experience, 12, (e) => ({
      id: str(e.id, 40),
      role: str(e.role, 100),
      company: str(e.company, 100),
      location: str(e.location, 80),
      start: str(e.start, 30),
      end: str(e.end, 30),
      points: str(e.points, 2500),
    })),
    education: arr(d.education, 8, (e) => ({
      id: str(e.id, 40),
      degree: str(e.degree, 120),
      institute: str(e.institute, 150),
      year: str(e.year, 40),
      score: str(e.score, 40),
    })),
    projects: arr(d.projects, 8, (p) => ({
      id: str(p.id, 40),
      name: str(p.name, 100),
      link: str(p.link, 150),
      description: str(p.description, 800),
    })),
    skills: str(d.skills, 800),
    languages: str(d.languages, 300),
    certifications: str(d.certifications, 1200),
  };
}

export function normalizePayload(input: unknown): DocumentPayload | null {
  if (!input || typeof input !== "object") return null;
  const p = input as Record<string, unknown>;
  const t = getTemplate(str(p.templateId, 40));
  if (!t || !p.data || typeof p.data !== "object") return null;
  const accent = typeof p.accent === "string" && HEX.test(p.accent) ? p.accent : t.accents[0];
  const data = p.data as Record<string, unknown>;
  if (t.kind === "biodata") {
    return { templateId: t.id as "biodata-royal", accent, data: biodata(data) };
  }
  return { templateId: t.id as "resume-classic", accent, data: resume(data) };
}
