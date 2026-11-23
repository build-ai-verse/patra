export type TemplateKind = "biodata" | "resume";

export type TemplateId = "biodata-royal" | "biodata-lotus" | "resume-classic" | "resume-modern";

export interface TemplateMeta {
  id: TemplateId;
  kind: TemplateKind;
  name: string;
  tagline: string;
  description: string;
  accents: string[];
  badge?: string;
  /** Download price in INR. The server charges this amount (never trusts the client). */
  priceInr: number;
}

export const templates: TemplateMeta[] = [
  {
    id: "biodata-royal",
    priceInr: 10,
    kind: "biodata",
    name: "Royal Heritage",
    tagline: "Traditional ornate border, gold accents",
    description:
      "A classic Indian marriage biodata with an ornate double border, gold detailing and an elegant serif title. Perfect for families who love tradition.",
    accents: ["#8B1E3F", "#1E3A8A", "#065F46", "#9A3412", "#6B21A8"],
    badge: "Most loved",
  },
  {
    id: "biodata-lotus",
    priceInr: 20,
    kind: "biodata",
    name: "Lotus Modern",
    tagline: "Clean, modern & soft pastel",
    description:
      "A contemporary marriage biodata with a soft colour band, round photo and tidy cards. Great for a fresh, modern look that still feels warm.",
    accents: ["#BE185D", "#0F766E", "#7C3AED", "#C2410C", "#1D4ED8"],
    badge: "New",
  },
  {
    id: "resume-classic",
    priceInr: 50,
    kind: "resume",
    name: "Classic Professional",
    tagline: "ATS-friendly single column",
    description:
      "A clean, single-column resume that recruiters and Applicant Tracking Systems (ATS) love. Ideal for freshers and experienced professionals.",
    accents: ["#1E3A8A", "#0F766E", "#1F2937", "#881337", "#4338CA"],
    badge: "ATS friendly",
  },
  {
    id: "resume-modern",
    priceInr: 100,
    kind: "resume",
    name: "Modern Sidebar",
    tagline: "Bold sidebar with photo",
    description:
      "A stylish two-column resume with a coloured sidebar for contact details, skills and education. Stands out while staying easy to read.",
    accents: ["#0F3D5E", "#134E4A", "#312E81", "#7F1D1D", "#1F2937"],
  },
];

export function getTemplate(id: string): TemplateMeta | undefined {
  return templates.find((t) => t.id === id);
}

const prices = (kind?: TemplateKind) => templates.filter((t) => !kind || t.kind === kind).map((t) => t.priceInr);
/** Lowest download price, optionally for one kind ("from ₹10"). */
export const minPrice = (kind?: TemplateKind) => Math.min(...prices(kind));
export const maxPrice = (kind?: TemplateKind) => Math.max(...prices(kind));

/* ------------------------------------------------------------------ */
/* Document data models                                               */
/* ------------------------------------------------------------------ */

export interface BioField {
  id: string;
  label: string;
  value: string;
}

export interface BioSection {
  id: string;
  title: string;
  fields: BioField[];
}

/* Divine symbols shown at the top of marriage biodata */
export type SymbolId = "none" | "ganesha" | "lakshmi-ganesha" | "radha-krishna" | "shiv-parvati" | "vishnu-lakshmi";

export const symbols: { id: SymbolId; label: string; blessing: string }[] = [
  { id: "ganesha", label: "Shree Ganesh", blessing: "|| Shree Ganeshaya Namah ||" },
  { id: "lakshmi-ganesha", label: "Lakshmi Ganesh", blessing: "|| Shree Lakshmi Ganeshaya Namah ||" },
  { id: "radha-krishna", label: "Radha Krishna", blessing: "|| Jai Shree Radhe Krishna ||" },
  { id: "shiv-parvati", label: "Shiv Parvati", blessing: "|| Om Namah Shivaya ||" },
  { id: "vishnu-lakshmi", label: "Vishnu Lakshmi", blessing: "|| Om Namo Narayanaya ||" },
  { id: "none", label: "No symbol", blessing: "" },
];

export const isSymbolId = (v: unknown): v is SymbolId => symbols.some((x) => x.id === v);

export type BioLang = "en" | "hi";

export interface BiodataData {
  /** Document language (labels, blessing). Defaults to English. */
  lang?: BioLang;
  /** Optional for drafts saved before symbols existed (treated as "none"). */
  symbol?: SymbolId;
  headerText: string;
  title: string;
  name: string;
  photo: string | null;
  sections: BioSection[];
}

export interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  points: string; // newline separated bullet points
}

export interface ResumeEducation {
  id: string;
  degree: string;
  institute: string;
  year: string;
  score: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  photo: string | null;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  skills: string; // comma separated
  languages: string; // comma separated
  certifications: string; // newline separated
}

export type DocumentPayload =
  | { templateId: "biodata-royal" | "biodata-lotus"; accent: string; data: BiodataData }
  | { templateId: "resume-classic" | "resume-modern"; accent: string; data: ResumeData };

export const splitList = (s: string, sep: "," | "\n") =>
  s
    .split(sep === "," ? /[,\n]/ : /\n/)
    .map((x) => x.trim())
    .filter(Boolean);
