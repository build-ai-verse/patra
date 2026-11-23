import type { BiodataData, DocumentPayload, ResumeData, TemplateId } from "./templates";
import { getTemplate } from "./templates";
import { sampleBiodataHi } from "./hindi";

let counter = 0;
export const uid = (p = "f") => `${p}${Date.now().toString(36)}${(counter++).toString(36)}`;

const f = (id: string, label: string, value: string) => ({ id, label, value });

export const sampleBiodata: BiodataData = {
  symbol: "ganesha",
  headerText: "|| Shree Ganeshaya Namah ||",
  title: "Biodata",
  name: "Priya Sharma",
  photo: null,
  sections: [
    {
      id: "personal",
      title: "Personal Details",
      fields: [
        f("p1", "Date of Birth", "14 March 1997"),
        f("p2", "Time of Birth", "06:45 AM"),
        f("p3", "Place of Birth", "Jaipur, Rajasthan"),
        f("p4", "Height", "5' 4\""),
        f("p5", "Religion / Caste", "Hindu, Brahmin"),
        f("p6", "Gotra", "Bharadwaj"),
        f("p7", "Rashi / Nakshatra", "Vrishabh / Rohini"),
        f("p8", "Manglik", "No"),
        f("p9", "Education", "MBA (Finance), NMIMS Mumbai"),
        f("p10", "Occupation", "Senior Analyst, Infosys"),
        f("p11", "Annual Income", "Rs. 12 Lakh"),
        f("p12", "Hobbies", "Classical dance, travelling, reading"),
      ],
    },
    {
      id: "family",
      title: "Family Details",
      fields: [
        f("f1", "Father's Name", "Mr. Rajesh Sharma (Retd. Bank Manager)"),
        f("f2", "Mother's Name", "Mrs. Sunita Sharma (Homemaker)"),
        f("f3", "Siblings", "1 Elder Brother (Married)"),
        f("f4", "Family Type", "Nuclear, Values: Traditional"),
        f("f5", "Native Place", "Ajmer, Rajasthan"),
      ],
    },
    {
      id: "contact",
      title: "Contact Details",
      fields: [
        f("c1", "Contact Person", "Mr. Rajesh Sharma"),
        f("c2", "Mobile", "+91 98765 43210"),
        f("c3", "Address", "C-24, Vaishali Nagar, Jaipur - 302021"),
      ],
    },
  ],
};

export const sampleResume: ResumeData = {
  name: "Rahul Verma",
  title: "Software Engineer",
  email: "rahul.verma@email.com",
  phone: "+91 98765 43210",
  location: "Bengaluru, Karnataka",
  linkedin: "linkedin.com/in/rahulverma",
  website: "github.com/rahulverma",
  photo: null,
  summary:
    "Software engineer with 4+ years of experience building fast, reliable web applications with React, Node.js and cloud services. Passionate about clean code, great user experience and mentoring junior developers.",
  experience: [
    {
      id: "e1",
      role: "Software Engineer II",
      company: "Flipkart",
      location: "Bengaluru",
      start: "Jul 2022",
      end: "Present",
      points:
        "Led migration of checkout pages to Next.js, improving load time by 38%\nBuilt a reusable design system used by 12 product teams\nMentored 4 junior engineers through code reviews and pairing",
    },
    {
      id: "e2",
      role: "Associate Developer",
      company: "TCS",
      location: "Pune",
      start: "Jun 2020",
      end: "Jun 2022",
      points:
        "Developed REST APIs in Node.js serving 2M+ requests/day\nAutomated deployment pipelines, cutting release time from 2 days to 2 hours",
    },
  ],
  education: [
    {
      id: "ed1",
      degree: "B.Tech, Computer Science",
      institute: "VIT Vellore",
      year: "2016 - 2020",
      score: "CGPA 8.7",
    },
  ],
  projects: [
    {
      id: "pr1",
      name: "KisanMitra",
      link: "github.com/rahulverma/kisanmitra",
      description: "Crop price alert app for farmers with SMS support in 6 Indian languages.",
    },
  ],
  skills: "React, Next.js, TypeScript, Node.js, PostgreSQL, AWS, Docker, System Design",
  languages: "English, Hindi, Kannada",
  certifications: "AWS Certified Developer - Associate (2023)",
};

export function defaultPayload(templateId: TemplateId): DocumentPayload {
  const t = getTemplate(templateId)!;
  const accent = t.accents[0];
  if (t.kind === "biodata") {
    return {
      templateId: templateId as "biodata-royal" | "biodata-lotus",
      accent,
      data: structuredClone(sampleBiodata),
    };
  }
  return {
    templateId: templateId as "resume-classic" | "resume-modern",
    accent,
    data: structuredClone(sampleResume),
  };
}

/** Sample document with an illustrated photo, used for gallery thumbnails only. */
export function samplePreview(templateId: TemplateId, lang: "en" | "hi" = "en"): DocumentPayload {
  const p = defaultPayload(templateId);
  if (lang === "hi" && p.templateId.startsWith("biodata")) p.data = structuredClone(sampleBiodataHi);
  if (p.templateId.startsWith("biodata")) p.data.photo = "/samples/avatar-female.svg";
  else if (p.templateId === "resume-modern") p.data.photo = "/samples/avatar-male.svg";
  return p;
}
