import Link from "next/link";
import { maxPrice, minPrice, templates } from "@/lib/templates";
import { samplePreview } from "@/lib/defaults";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { TemplateCard } from "@/components/site/TemplateCard";
import { CtaBand, Faq, Features, HowItWorks, Icon, icons, Pricing, SectionHeading } from "@/components/site/Sections";
import { JsonLd } from "@/components/site/JsonLd";
import { faqs } from "@/components/site/faq-data";
import { brandFull, site } from "@/config/site";
import { FREE } from "@/lib/pricing";

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${brandFull} Marriage Biodata & Resume PDF`,
            description: site.description,
            brand: { "@type": "Brand", name: site.name },
            offers: {
              "@type": "AggregateOffer",
              lowPrice: FREE ? 0 : minPrice(),
              highPrice: FREE ? 0 : maxPrice(),
              offerCount: templates.length,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url: site.url,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <Hero />
      <section id="templates" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Templates"
            title={<>Designed to impress <span className="text-gradient">families & recruiters</span></>}
            sub="Handcrafted templates for Indian marriage biodata and modern resumes. Pick one to start, you can switch colours anytime."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((t, i) => (
              <TemplateCard key={t.id} t={t} priority={i < 2} />
            ))}
          </div>
        </div>
      </section>
      <HowItWorks />
      <Features />
      <Pricing />
      <Faq />
      <CtaBand />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-mandala absolute inset-0" />
      <div className="absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-marigold-300/40 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-brand-200/50 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 md:pt-20 lg:grid-cols-2 lg:gap-8">
        <div className="animate-fade-up text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-marigold-400/50 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-marigold-500" />
            {FREE ? "Launch offer: free PDF downloads" : `PDFs from just ₹${minPrice()}`} · No signup needed
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
            Shaadi biodata & resumes that make a <span className="text-gradient italic">beautiful</span> first impression
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft lg:mx-0">
            Create a stunning marriage biodata or a job-winning resume in minutes. Live preview free, then download a print-ready PDF, delivered instantly to your email.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/create/biodata-royal" className="btn-primary px-7 py-3.5 text-base">
              Create Marriage Biodata
            </Link>
            <Link href="/create/resume-classic" className="btn-ghost px-7 py-3.5 text-base">
              Build My Resume
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-soft lg:justify-start">
            {["UPI, Cards & Netbanking", "Instant PDF on email", "Print-ready A4"].map((x) => (
              <li key={x} className="flex items-center gap-1.5">
                <Icon d={icons.check} className="h-4 w-4 text-green-600" />
                {x}
              </li>
            ))}
          </ul>
        </div>

        {/* Fanned document previews */}
        <div className="relative mx-auto h-[420px] w-full max-w-[520px] sm:h-[520px]" aria-hidden="true">
          <div
            className="animate-float absolute left-0 top-10 w-[46%] overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/5"
            style={{ ["--r" as string]: "-8deg", animationDelay: "0.5s" }}
          >
            <PreviewFrame doc={samplePreview("resume-modern")} fixedHeight />
          </div>
          <div
            className="animate-float absolute right-0 top-14 w-[46%] overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/5"
            style={{ ["--r" as string]: "8deg", animationDelay: "1s" }}
          >
            <PreviewFrame doc={samplePreview("biodata-lotus")} fixedHeight />
          </div>
          <div
            className="animate-float absolute left-[22%] top-0 z-10 w-[56%] overflow-hidden rounded-lg bg-white shadow-2xl shadow-brand-900/30 ring-1 ring-black/5"
          >
            <PreviewFrame doc={samplePreview("biodata-royal")} fixedHeight />
          </div>
          <div className="absolute bottom-6 left-2 z-20 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl sm:bottom-10">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Icon d={icons.mail} className="h-5 w-5" />
            </span>
            <div className="text-left">
              <p className="text-xs text-ink-soft">Delivered to</p>
              <p className="text-sm font-semibold">your inbox, instantly</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-2 z-20 rounded-2xl bg-brand-700 px-4 py-3 text-white shadow-xl sm:bottom-4">
            <p className="text-xs text-white/70">{FREE ? "Launch offer" : "From"}</p>
            <p className="font-display text-2xl font-bold">{FREE ? "Free" : `₹${minPrice()}`}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
