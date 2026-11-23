import type { Metadata } from "next";
import { AtsChecker } from "@/components/ats/AtsChecker";
import { JsonLd } from "@/components/site/JsonLd";
import { Faq } from "@/components/site/Sections";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker - Check Your Resume Score Instantly",
  description:
    "Check your resume's ATS score for free. Upload a PDF or DOCX resume, paste a job description and get an instant score with keyword match and fixes. Private: your resume never leaves your device.",
  alternates: { canonical: "/ats-checker" },
  keywords: ["ats resume checker", "ats score checker", "resume score", "ats friendly resume check", "resume keyword checker", "free ats checker india"],
};

const faqs = [
  {
    q: "What is an ATS score?",
    a: "Most companies and job portals use Applicant Tracking Systems (ATS) to scan resumes before a recruiter sees them. The ATS score estimates how easily software can read your resume and how well it matches the job.",
  },
  {
    q: "Is my resume uploaded anywhere?",
    a: "No. The checker reads your PDF, DOCX or text file inside your browser. Nothing is sent to our servers.",
  },
  {
    q: "How is the score calculated?",
    a: "We check readable text, contact details, standard section headings, length, bullet points, quantified results, action verbs, pronouns, dates and skills. If you paste a job description, keyword match counts for 30% of the final score.",
  },
  {
    q: "What is a good ATS score?",
    a: "80+ is excellent, 65-79 is good. Below that, follow the suggestions: they are usually quick wins like adding numbers to bullet points or using standard headings.",
  },
];

export default function AtsCheckerPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: `${site.name} ATS Resume Checker`,
            url: `${site.url}/ats-checker`,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: 0, priceCurrency: "INR" },
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
        <div className="relative mx-auto max-w-3xl px-4 pb-8 pt-12 text-center sm:px-6 md:pt-16">
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">100% free</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Free <span className="text-gradient">ATS Resume Checker</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
            Will your resume get past the bots? Get an instant score, keyword match against the job and clear fixes.
          </p>
        </div>
      </section>
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AtsChecker />
        </div>
      </section>
      <Faq items={faqs} />
    </>
  );
}
