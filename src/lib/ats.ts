import type { ResumeData } from "./templates";

/**
 * Heuristic ATS (Applicant Tracking System) resume checker.
 * Pure + synchronous so it runs instantly in the browser (resume text never leaves the device).
 *
 * Base score (100 pts) checks what ATS parsers and recruiters look for; when a job
 * description is supplied, the final score blends in keyword match (70% base / 30% keywords).
 */

export type AtsStatus = "pass" | "warn" | "fail" | "info";

export interface AtsCheck {
  id: string;
  label: string;
  status: AtsStatus;
  points: number;
  max: number;
  detail: string;
  tip?: string;
}

export interface AtsResult {
  score: number;
  baseScore: number;
  grade: "Excellent" | "Good" | "Needs work" | "Poor";
  checks: AtsCheck[];
  wordCount: number;
  keywords: { matched: string[]; missing: string[]; score: number } | null;
}

export interface AtsOptions {
  jobDescription?: string;
  /** Layout of the resume, when known (resume builder). */
  layout?: "single-column" | "two-column";
}

const ACTION_VERBS = new Set(
  `achieved accelerated administered analysed analyzed architected automated boosted built championed coached collaborated completed conceptualized conducted consolidated coordinated created cut decreased defined delivered deployed designed developed devised directed doubled drove eliminated enabled engineered enhanced established evaluated executed expanded facilitated founded generated grew guided handled headed identified implemented improved increased initiated innovated installed integrated introduced launched led maintained managed mentored migrated modernized monitored negotiated optimized orchestrated organized oversaw owned partnered performed pioneered planned prepared presented prioritized produced programmed promoted proposed published reduced redesigned refactored resolved restructured revamped saved scaled secured shipped simplified solved spearheaded standardized streamlined strengthened supervised supported tested trained transformed tripled troubleshot upgraded won wrote`.split(
    /\s+/,
  ),
);

const STOPWORDS = new Set(
  `a about above across after again against all also am an and any are as at be because been before being below between both but by can could did do does doing down during each etc few for from further had has have having he her here hers him his how i if in into is it its itself just me more most my no nor not now of off on once only or other our out over own per same she should so some such than that the their them then there these they this those through to too under until up very was we were what when where which while who whom why will with within without would you your
   ability able across apply candidate candidates company excellent experience experienced good great help ideal including job join knowledge looking must new plus preferred required requirements responsibilities role skills strong team teams work working year years using use well based within like make etc day days opportunity position related relevant understanding prior desired familiarity hands hiring hire build improve seeking want wants need needs ensure`.split(
    /\s+/,
  ),
);

const SECTION_PATTERNS: Record<string, RegExp> = {
  summary: /^(professional\s+)?(summary|profile|objective|about( me)?|career objective|overview)\b/i,
  experience: /^(work\s+|professional\s+)?(experience|employment( history)?|work history|internships?|career history)\b/i,
  education: /^(education|academic( background| qualifications?)?|qualifications?)\b/i,
  skills: /^(technical\s+|key\s+|core\s+)?(skills|competencies|technologies|tech stack|expertise)\b/i,
};

/** Other common headings: they end the previous section. */
const OTHER_HEADINGS =
  /^(projects?|certifications?|licen[cs]es|languages?|achievements?|awards?|honou?rs|hobbies|interests|publications|volunteer(ing)?|references|declaration|personal (details|information)|extra[- ]curricular|activities|training|courses)\b/i;

const isHeading = (l: string) =>
  l.length < 45 && (Object.values(SECTION_PATTERNS).some((re) => re.test(l)) || OTHER_HEADINGS.test(l));

const BULLET = /^\s*([•●▪◦‣∙·\-–*✓➤►]|\d+\.)\s+/;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function sectionBody(lines: string[], key: string) {
  const start = lines.findIndex((l) => l.length < 45 && SECTION_PATTERNS[key]!.test(l.trim()));
  if (start < 0) return [];
  const out: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i]!.trim();
    if (isHeading(l)) break;
    out.push(l);
  }
  return out;
}

export function extractKeywords(jd: string, limit = 30): string[] {
  const freq = new Map<string, number>();
  const tokens = jd.toLowerCase().match(/[a-z][a-z0-9+#./-]*[a-z0-9+#]|[a-z]/g) ?? [];
  for (const raw of tokens) {
    const t = raw.replace(/[./-]+$/, "");
    if (t.length < 2 || STOPWORDS.has(t) || /^\d+$/.test(t)) continue;
    freq.set(t, (freq.get(t) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, limit)
    .map(([w]) => w);
}

/** Light stemming so "mentored" matches "mentor" and "systems" matches "system". */
const stem = (w: string) => {
  const t = w.toLowerCase();
  if (t.length <= 4 || /[^a-z]/.test(t)) return t;
  return t.replace(/(ing|ed|es|s)$/, "");
};
const resumeStems = (text: string) =>
  new Set(
    (text.toLowerCase().match(/[a-z][a-z0-9+#./-]*[a-z0-9+#]|[a-z]/g) ?? []).flatMap((w) => {
      const t = w.replace(/[./-]+$/, "");
      return [t, stem(t)];
    }),
  );

export function analyzeResume(text: string, opts: AtsOptions = {}): AtsResult {
  const clean = text.replace(/\r/g, "").replace(/ /g, " ");
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);
  const words = clean.match(/[A-Za-zऀ-ॿ0-9][\wऀ-ॿ'+#.-]*/g) ?? [];
  const wordCount = words.length;
  const checks: AtsCheck[] = [];
  const add = (c: Omit<AtsCheck, "status"> & { status?: AtsStatus }) =>
    checks.push({ ...c, status: c.status ?? (c.points >= c.max ? "pass" : c.points > 0 ? "warn" : "fail") });

  // 1. Machine-readable text
  const readable = clean.replace(/\s/g, "").length;
  add({
    id: "readable",
    label: "Text is machine-readable",
    points: readable >= 400 ? 6 : readable >= 150 ? 3 : 0,
    max: 6,
    detail: readable >= 400 ? "ATS can read your resume's text." : "Very little text could be read.",
    tip: readable >= 400 ? undefined : "Scanned or image-only PDFs can't be read by ATS. Export a text-based PDF instead.",
  });

  // 2. Contact details
  const email = /[\w.+-]+@[\w-]+\.[\w.]{2,}/.test(clean);
  const phone = /(\+?\d[\d\s-]{8,}\d)/.test(clean);
  const linkedin = /linkedin\.com\/in\//i.test(clean);
  const contactPts = (email ? 6 : 0) + (phone ? 5 : 0) + (linkedin ? 4 : 0);
  add({
    id: "contact",
    label: "Contact details",
    points: contactPts,
    max: 15,
    detail: [email ? "Email ✓" : "Email missing", phone ? "Phone ✓" : "Phone missing", linkedin ? "LinkedIn ✓" : "LinkedIn missing"].join(" · "),
    tip: contactPts < 15 ? "Add a professional email, mobile number and LinkedIn URL at the top." : undefined,
  });

  // 3. Standard sections
  const sectionWeights: [string, string, number][] = [
    ["summary", "Summary", 6],
    ["experience", "Experience", 10],
    ["education", "Education", 8],
    ["skills", "Skills", 8],
  ];
  const found = sectionWeights.filter(([k]) => lines.some((l) => l.length < 45 && SECTION_PATTERNS[k]!.test(l)));
  const missing = sectionWeights.filter((s) => !found.includes(s));
  add({
    id: "sections",
    label: "Standard section headings",
    points: found.reduce((n, [, , w]) => n + w, 0),
    max: 32,
    detail: missing.length ? `Missing: ${missing.map(([, n]) => n).join(", ")}` : "Summary, Experience, Education and Skills found.",
    tip: missing.length ? "Use standard headings like “Work Experience”, “Education” and “Skills” so ATS can map your content." : undefined,
  });

  // 4. Length
  const lenPts = wordCount >= 300 && wordCount <= 1000 ? 8 : wordCount >= 180 && wordCount <= 1400 ? 4 : 0;
  add({
    id: "length",
    label: "Resume length",
    points: lenPts,
    max: 8,
    detail: `${wordCount} words`,
    tip: lenPts < 8 ? (wordCount < 300 ? "Add more detail: aim for 300-1000 words (1-2 pages)." : "Trim to the most relevant points: aim for 300-1000 words.") : undefined,
  });

  // 5. Bullet points
  // Bullet glyphs are often lost in PDF text (icon fonts, drawn dots), so lines in the
  // experience section that start with an action verb also count as bullet points.
  const expLines = new Set(sectionBody(lines, "experience"));
  const startsWithVerb = (l: string) => {
    const w = (l.split(/\s+/)[0] ?? "").toLowerCase().replace(/[^a-z]/g, "");
    return ACTION_VERBS.has(w) || (w.length > 4 && w.endsWith("ed"));
  };
  const bullets = lines
    .filter((l) => BULLET.test(l) || (expLines.has(l) && l.length >= 25 && startsWithVerb(l)))
    .map((l) => l.replace(BULLET, ""));
  add({
    id: "bullets",
    label: "Achievements as bullet points",
    points: bullets.length >= 6 ? 6 : bullets.length >= 3 ? 3 : 0,
    max: 6,
    detail: `${bullets.length} bullet point${bullets.length === 1 ? "" : "s"} found`,
    tip: bullets.length < 6 ? "Describe each role with 3-5 short bullet points instead of paragraphs." : undefined,
  });

  // 6. Quantified achievements
  const quantified = bullets.filter((b) => /\d/.test(b.replace(/\b(19|20)\d{2}\b/g, ""))).length;
  add({
    id: "metrics",
    label: "Quantified results",
    points: quantified >= 4 ? 10 : quantified >= 2 ? 6 : quantified >= 1 ? 3 : 0,
    max: 10,
    detail: `${quantified} bullet${quantified === 1 ? "" : "s"} with numbers`,
    tip: quantified < 4 ? "Add numbers: “Cut costs by 20%”, “Served 2M+ users”, “Managed a team of 6”." : undefined,
  });

  // 7. Action verbs
  const verbStarts = bullets.filter(startsWithVerb).length;
  const verbRatio = bullets.length ? verbStarts / bullets.length : 0;
  add({
    id: "verbs",
    label: "Strong action verbs",
    points: verbRatio >= 0.6 ? 8 : verbRatio >= 0.3 ? 4 : 0,
    max: 8,
    detail: bullets.length ? `${Math.round(verbRatio * 100)}% of bullets start with an action verb` : "No bullets to check",
    tip: verbRatio < 0.6 ? "Start bullets with verbs like Led, Built, Improved, Delivered, Reduced." : undefined,
  });

  // 8. First-person pronouns
  const pronouns = (clean.match(/\b(I|me|my|myself)\b/g) ?? []).length;
  add({
    id: "pronouns",
    label: "No first-person pronouns",
    points: pronouns === 0 ? 4 : pronouns <= 3 ? 2 : 0,
    max: 4,
    detail: pronouns ? `Found ${pronouns} use${pronouns === 1 ? "" : "s"} of I / me / my` : "None found",
    tip: pronouns ? "Write “Led a team of 5”, not “I led a team of 5”." : undefined,
  });

  // 9. Dates
  const years = (clean.match(/\b(19|20)\d{2}\b/g) ?? []).length;
  add({
    id: "dates",
    label: "Dates for roles & education",
    points: years >= 3 ? 5 : years >= 1 ? 2 : 0,
    max: 5,
    detail: `${years} year reference${years === 1 ? "" : "s"} found`,
    tip: years < 3 ? "Add start/end dates (e.g. “Jun 2021 - Present”) for each role and degree." : undefined,
  });

  // 10. Skills count
  const skillLines = sectionBody(lines, "skills");
  // Skills may be comma/bullet separated, or laid out as chips (separated by 2+ spaces).
  // Lines with no separators at all (chip layouts extracted as "React Next.js AWS") are split on spaces.
  const skillCount = skillLines
    .flatMap((l) => (/[,|•·;]/.test(l) ? l.split(/[,|•·;]+|\s{2,}/) : l.split(/\s+/)))
    .map((s) => s.trim())
    .filter((s) => s.length > 1).length;
  add({
    id: "skills",
    label: "Enough relevant skills",
    points: skillCount >= 8 ? 6 : skillCount >= 4 ? 3 : 0,
    max: 6,
    detail: `${skillCount} skill${skillCount === 1 ? "" : "s"} listed`,
    tip: skillCount < 8 ? "List 8-15 hard skills (tools, technologies, methods) that match the jobs you want." : undefined,
  });

  // Layout (informational)
  if (opts.layout) {
    add({
      id: "layout",
      label: "ATS-friendly layout",
      status: opts.layout === "single-column" ? "pass" : "info",
      points: 0,
      max: 0,
      detail: opts.layout === "single-column" ? "Single-column layout parses cleanly." : "Two-column layouts look great but some older ATS read them out of order.",
      tip: opts.layout === "two-column" ? "Applying through strict ATS portals? Switch to the Classic Professional template." : undefined,
    });
  }

  const baseScore = clamp(Math.round(checks.reduce((n, c) => n + c.points, 0)), 0, 100);

  // Job-description keyword match
  let keywords: AtsResult["keywords"] = null;
  let score = baseScore;
  const jd = opts.jobDescription?.trim();
  if (jd && jd.length > 30) {
    const kws = extractKeywords(jd);
    const stems = resumeStems(clean);
    const matched = kws.filter((k) => stems.has(k) || stems.has(stem(k)));
    const kwScore = kws.length ? Math.round((matched.length / kws.length) * 100) : 0;
    keywords = { matched, missing: kws.filter((k) => !matched.includes(k)), score: kwScore };
    score = Math.round(baseScore * 0.7 + kwScore * 0.3);
  }

  const grade = score >= 80 ? "Excellent" : score >= 65 ? "Good" : score >= 45 ? "Needs work" : "Poor";
  return { score, baseScore, grade, checks, wordCount, keywords };
}

/** Plain-text rendering of builder data, in the same order an ATS would read the PDF. */
export function resumeToText(d: ResumeData): string {
  const out: string[] = [d.name, d.title, [d.email, d.phone, d.location, d.linkedin, d.website].filter(Boolean).join(" | ")];
  if (d.summary.trim()) out.push("", "PROFESSIONAL SUMMARY", d.summary);
  if (d.experience.length) {
    out.push("", "WORK EXPERIENCE");
    for (const e of d.experience) {
      out.push(`${e.role} - ${e.company}, ${e.location} (${e.start} - ${e.end})`);
      for (const p of e.points.split("\n").map((x) => x.replace(/^[-•*]\s*/, "").trim()).filter(Boolean)) out.push(`• ${p}`);
    }
  }
  if (d.projects.length) {
    out.push("", "PROJECTS");
    for (const p of d.projects) out.push(`${p.name} ${p.link}`, p.description);
  }
  if (d.education.length) {
    out.push("", "EDUCATION");
    for (const e of d.education) out.push(`${e.degree} - ${e.institute} (${e.year}) ${e.score}`);
  }
  if (d.skills.trim()) out.push("", "SKILLS", d.skills);
  if (d.certifications.trim()) out.push("", "CERTIFICATIONS", d.certifications);
  if (d.languages.trim()) out.push("", "LANGUAGES", d.languages);
  return out.join("\n");
}
