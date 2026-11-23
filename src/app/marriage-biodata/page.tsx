import type { Metadata } from "next";
import Link from "next/link";
import { KindLanding } from "@/components/site/KindLanding";
import { getTemplate, minPrice } from "@/lib/templates";
import { FREE, fromPrice } from "@/lib/pricing";

export const metadata: Metadata = {
  title: `Marriage Biodata Maker - Beautiful Biodata Format for Marriage (PDF ${fromPrice("biodata")})`,
  description: `Create a beautiful marriage biodata online in minutes. Traditional & modern biodata formats for Hindu, Sikh, Jain, Muslim & Christian families. Add photo, preview free, download PDF ${fromPrice("biodata")}.`,
  alternates: {
    canonical: "/marriage-biodata",
    languages: { "en-IN": "/marriage-biodata", "hi-IN": "/marriage-biodata-hindi" },
  },
  keywords: [
    "marriage biodata",
    "biodata for marriage",
    "marriage biodata format",
    "biodata format for marriage pdf",
    "shaadi biodata",
    "biodata maker",
    "hindu marriage biodata",
    "biodata for girl",
    "biodata for boy",
  ],
};

const faqs = [
  {
    q: "What should a marriage biodata include?",
    a: "A good marriage biodata includes personal details (name, date, time & place of birth, height, education, occupation, income), horoscope details if relevant (rashi, nakshatra, gotra, manglik), family details (parents, siblings, native place), expectations and contact details, along with a recent photo.",
  },
  {
    q: "Can I create a biodata for a girl or a boy?",
    a: "Yes. Both templates work beautifully for brides and grooms. Edit any label, add or remove fields and sections to match your family's preference.",
  },
  {
    q: "Can I remove the 'Shree Ganeshaya Namah' line?",
    a: "Yes. The blessing line is optional. Choose from suggestions like Om Namah Shivaya, Jai Shree Krishna, Waheguru Ji, Bismillah, or simply leave it empty to hide it.",
  },
  {
    q: "How do I share my biodata on WhatsApp?",
    a: `${FREE ? "During our launch offer downloads are free:" : `After paying (Royal Heritage ₹${getTemplate("biodata-royal")!.priceInr}, Lotus Modern ₹${getTemplate("biodata-lotus")!.priceInr}),`} your PDF downloads instantly and is also emailed to you. Simply attach the PDF on WhatsApp or email. It opens perfectly on every phone.`,
  },
  {
    q: "Is the biodata printable?",
    a: "Yes. The PDF is A4 size and print-ready with crisp text and borders, perfect for printing at home or at a print shop.",
  },
];

export default function MarriageBiodataPage() {
  return (
    <KindLanding
      kind="biodata"
      path="/marriage-biodata"
      eyebrow="Marriage Biodata Maker"
      title={
        <>
          Create a <span className="text-gradient italic">beautiful</span> marriage biodata in 5 minutes
        </>
      }
      intro={`Traditional and modern biodata formats loved by Indian families. Add your photo, choose colours, preview free and download a print-ready PDF ${FREE ? "free during our launch offer" : `starting at just ₹${minPrice("biodata")}`}.`}
      cta={{ href: "/create/biodata-royal", label: "Create My Biodata" }}
      faqs={faqs}
      article={
        <>
          <h2>The perfect biodata format for marriage</h2>
          <p>
            In Indian matchmaking, the <strong>marriage biodata</strong> is the very first introduction between two families. A clean,
            well-organised biodata makes it easy for families to know you, and leaves a warm, lasting first impression. Our templates
            follow the format families expect, while looking far more elegant than a typed Word document.
          </p>
          <h3>1. Personal details</h3>
          <ul>
            <li>Full name, date of birth, time and place of birth</li>
            <li>Height, complexion, blood group (optional)</li>
            <li>Religion, caste, sub-caste, gotra, mother tongue</li>
            <li>Rashi, nakshatra and manglik status (if your family follows kundli matching)</li>
            <li>Education, occupation, company and annual income</li>
            <li>Hobbies, diet and interests</li>
          </ul>
          <h3>2. Family details</h3>
          <ul>
            <li>Father&apos;s and mother&apos;s name and occupation</li>
            <li>Brothers and sisters (married / unmarried)</li>
            <li>Family type (joint / nuclear), family values and native place</li>
          </ul>
          <h3>3. Contact details</h3>
          <p>Add the contact person, mobile number and residential address. Keep it short and accurate.</p>
          <h2>Tips for a great biodata</h2>
          <ol>
            <li><strong>Use a recent, clear photo</strong>: front-facing, good light, simple background.</li>
            <li><strong>Be honest and concise</strong>: families appreciate clarity over long paragraphs.</li>
            <li><strong>Keep it to one page</strong>: both our designs are made to fit neatly on a single A4 page.</li>
            <li><strong>Double-check spellings</strong> of names, dates and phone numbers before downloading.</li>
          </ol>
          <p>
            Prefer Hindi? Create a <Link href="/marriage-biodata-hindi">हिंदी बायोडाटा</Link> with Hindi labels and blessings.
          </p>
          <p>
            Looking for a job instead? Try our <Link href="/resume-maker">resume maker</Link> with ATS-friendly templates.
          </p>
        </>
      }
    />
  );
}
