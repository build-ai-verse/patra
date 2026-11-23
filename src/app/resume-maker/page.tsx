import type { Metadata } from "next";
import Link from "next/link";
import { KindLanding } from "@/components/site/KindLanding";
import { getTemplate } from "@/lib/templates";
import { FREE, fromPrice } from "@/lib/pricing";

export const metadata: Metadata = {
  title: `Resume Maker India - ATS-Friendly Resume Templates (PDF ${fromPrice("resume")})`,
  description: `Build a professional, ATS-friendly resume online in minutes. Modern templates for freshers and experienced professionals in India. Preview free, download PDF ${fromPrice("resume")}.`,
  alternates: { canonical: "/resume-maker" },
  keywords: [
    "resume maker",
    "resume builder india",
    "cv maker online",
    "ats friendly resume",
    "resume format for freshers",
    "resume template pdf",
    "professional resume",
  ],
};

const faqs = [
  {
    q: "Are these resumes ATS-friendly?",
    a: "Yes. The PDF contains real, selectable text with clear headings, so Applicant Tracking Systems used by companies and job portals like Naukri, LinkedIn and Indeed can read it correctly.",
  },
  {
    q: "Which template is best for freshers?",
    a: "The Classic Professional template is ideal for freshers. Lead with education, projects, internships and skills, and keep it to one page.",
  },
  {
    q: "Should I add a photo to my resume?",
    a: "For most Indian private-sector jobs a photo is optional. The Modern Sidebar template supports a photo; Classic Professional is photo-free and best for ATS.",
  },
  {
    q: "Can I edit my resume later?",
    a: `Yes. Your details are saved in your browser. Come back anytime, update and download a new version${FREE ? ", free during our launch offer" : ` (Classic ₹${getTemplate("resume-classic")!.priceInr}, Modern ₹${getTemplate("resume-modern")!.priceInr}). Re-downloading the exact same version is free`}.`,
  },
];

export default function ResumeMakerPage() {
  return (
    <KindLanding
      kind="resume"
      path="/resume-maker"
      eyebrow="Resume Maker"
      title={
        <>
          A job-winning resume, <span className="text-gradient italic">ready in minutes</span>
        </>
      }
      intro={`Professional, ATS-friendly resume templates built for Indian job seekers, from freshers to senior professionals. Preview free and download a polished PDF ${fromPrice("resume")}.`}
      cta={{ href: "/create/resume-classic", label: "Build My Resume" }}
      faqs={faqs}
      article={
        <>
          <h2>How to write a resume that gets shortlisted</h2>
          <p>
            Recruiters spend only a few seconds on each resume, and many companies use <strong>ATS software</strong> to filter
            applications first. A clear structure, the right keywords and measurable achievements make all the difference.
          </p>
          <h3>Recommended resume structure</h3>
          <ol>
            <li><strong>Header</strong>: name, job title, phone, email, city and LinkedIn.</li>
            <li><strong>Professional summary</strong>: 2-3 lines on your experience and strengths.</li>
            <li><strong>Work experience</strong>: latest first, with 3-5 achievement bullets each.</li>
            <li><strong>Education</strong>: degree, college, year and CGPA / percentage.</li>
            <li><strong>Skills, projects & certifications</strong>: match keywords from the job description.</li>
          </ol>
          <h3>Resume tips for freshers</h3>
          <ul>
            <li>Put education and academic projects near the top.</li>
            <li>Add internships, hackathons, NSS/NCC and leadership roles.</li>
            <li>Mention tools and technologies you&apos;ve actually used.</li>
            <li>Keep it to a single page.</li>
          </ul>
          <h3>Use numbers to show impact</h3>
          <p>
            Instead of &quot;worked on sales reports&quot;, write &quot;automated weekly sales reports, saving 6 hours per week&quot;.
            Numbers make your impact instantly clear.
          </p>
          <p>
            Already have a resume? Check it with our <Link href="/ats-checker">free ATS resume checker</Link> to see what
            to fix before you rebuild it.
          </p>
          <p>
            Planning a wedding too? Create a beautiful <Link href="/marriage-biodata">marriage biodata</Link> in minutes.
          </p>
        </>
      }
    />
  );
}
