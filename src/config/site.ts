/**
 * Central brand + business configuration.
 * Change the brand name / trademark symbol / price here and it updates everywhere
 * (UI, SEO metadata, PDFs, emails, Razorpay orders).
 */
export const site = {
  name: "Patra",
  /** Trademark symbol shown next to the brand. Use "™" until registered, then "®". */
  trademark: "™",
  tagline: "Beautiful Shaadi Biodata & Resumes in minutes",
  description:
    "Create a beautiful marriage biodata or a professional, ATS-friendly resume online in minutes. Pick a template, fill your details, preview free and download a print-ready PDF.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://patra.build-ai-version.com",
  parentDomain: "build-ai-version.com",
  poweredBy: "Thakur Ventures",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@build-ai-version.com",
  /** Legal / contact details shown on Contact & policy pages (required by Razorpay). TODO: fill in. */
  legalName: "Thakur Ventures",
  businessAddress: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? "Registered address - to be updated, India",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "",
  policyUpdated: "23 November 2026",
  /* Prices are per template - see `priceInr` in src/lib/templates.ts. */
  currency: "INR",
  locale: "en_IN",
  keywords: [
    "marriage biodata",
    "biodata for marriage",
    "shaadi biodata format",
    "marriage biodata format pdf",
    "biodata maker online",
    "resume maker india",
    "free resume builder",
    "ats resume template",
    "cv maker online",
    "biodata format for marriage",
  ],
} as const;

/**
 * Feature switches. AI auto-fill (resume builder) calls a paid AI API, so it is off
 * until NEXT_PUBLIC_AI_AUTOFILL=true is set (and ANTHROPIC_API_KEY is configured).
 */
export const features = {
  aiAutofill: process.env.NEXT_PUBLIC_AI_AUTOFILL === "true",
  /**
   * Launch offer: NEXT_PUBLIC_FREE_LAUNCH=true skips Razorpay and makes every PDF download free
   * (still emailed + backed up). Prices across the site show as "Free". Set to false to start charging.
   */
  freeLaunch: process.env.NEXT_PUBLIC_FREE_LAUNCH === "true",
} as const;

export const brandFull = `${site.name}${site.trademark}`;
