import Link from "next/link";
import { minPrice, templates } from "@/lib/templates";
import { faqs } from "./faq-data";
import { FREE } from "@/lib/pricing";

const Icon = ({ d, className = "h-6 w-6" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export const icons = {
  edit: "M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  download: "M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  palette: "M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5 0-1-.8-1.3-.8-2.2 0-.8.7-1.3 1.5-1.3H17a4 4 0 0 0 4-4c0-5-4-9-9-9zM7.5 11h.01M10 7.5h.01M15 7.5h.01",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zm-3 9l2 2 4-4",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
  print: "M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M7 14h10v7H7z",
  check: "M5 12l5 5L20 7",
};
export { Icon };

export function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-marigold-600">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{title}</h2>
      {sub ? <p className="mt-4 text-base leading-relaxed text-ink-soft">{sub}</p> : null}
    </div>
  );
}

export function HowItWorks() {
  const steps = [
    { icon: icons.edit, title: "Pick & fill", text: "Choose a template and fill in your details. Add a photo, pick a colour." },
    { icon: icons.eye, title: "Preview free", text: "See a live, pixel-perfect preview as you type. Tweak until it's just right." },
    FREE
      ? { icon: icons.download, title: "Download free", text: "Launch offer: get your PDF free, instantly and on email." }
      : { icon: icons.download, title: `Pay from ₹${minPrice()} & download`, text: "Pay securely via UPI or card. Get your PDF instantly and on email." },
  ];
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="How it works" title="Ready in 3 simple steps" sub="No signup, no design skills, no waiting. Most people finish in under 5 minutes." />
        <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-3xl border border-cream-200 bg-white p-7 shadow-sm">
              <span className="absolute right-6 top-5 font-display text-5xl font-bold text-brand-50">{i + 1}</span>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-700/30">
                <Icon d={s.icon} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Features() {
  const items = [
    { icon: icons.print, title: "Print-ready A4 PDF", text: "Crisp vector PDF that looks perfect on screen, WhatsApp and paper." },
    { icon: icons.mail, title: "Copy on your email", text: "Your PDF is emailed to you instantly, so it's always safe." },
    { icon: icons.palette, title: "Your colours", text: "5 handpicked colour themes per template to match your style." },
    { icon: icons.bolt, title: "Live preview", text: "Every keystroke updates the preview. What you see is what you get." },
    { icon: icons.check, title: "ATS-friendly resumes", text: "Real text PDFs that recruiter software can read and rank." },
    { icon: icons.shield, title: "Private & secure", text: "No account needed. Payments secured by Razorpay." },
  ];
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Why families & job seekers love us" title={<>Everything you need, <span className="text-gradient">nothing you don&apos;t</span></>} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div key={f.title} className="group rounded-3xl border border-cream-200 bg-white/70 p-6 transition hover:bg-white hover:shadow-xl hover:shadow-brand-900/5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-marigold-300/40 text-brand-700 transition group-hover:bg-marigold-400">
                <Icon d={f.icon} />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const perks = [
    "Watermark-free, print-ready PDF",
    "Instant download + copy on email",
    "All colour themes included",
    "Free re-download of the same document",
    FREE ? "Free during our launch offer" : "Pay via UPI, cards, netbanking",
  ];
  return (
    <section id="pricing" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={FREE ? "Launch offer" : "Simple pricing"}
          title={FREE ? "Free for a limited time" : "Pay once per document"}
          sub={
            FREE
              ? "To celebrate our launch, every template and every PDF download is free. No signup, no card needed."
              : "Design freely and preview for free. Pay only when you download, with no subscription."
          }
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((t) => {
            const featured = t.id === "biodata-royal";
            return (
              <Link
                key={t.id}
                href={`/create/${t.id}`}
                className={`group relative flex flex-col overflow-hidden rounded-3xl p-6 transition hover:-translate-y-1 ${
                  featured
                    ? "bg-brand-800 text-white shadow-2xl shadow-brand-900/30"
                    : "border border-cream-200 bg-white shadow-sm hover:shadow-xl hover:shadow-brand-900/10"
                }`}
              >
                {featured ? <div className="bg-mandala absolute inset-0 opacity-30" /> : null}
                <div className="relative flex flex-1 flex-col">
                  <p className={`text-[11px] font-semibold uppercase tracking-wider ${featured ? "text-marigold-300" : "text-brand-500"}`}>
                    {t.kind === "biodata" ? "Marriage Biodata" : "Resume / CV"}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold">{t.name}</h3>
                  <p className="mt-4 flex items-end gap-1.5">
                    {FREE ? (
                      <>
                        <span className="font-display text-5xl font-bold">Free</span>
                        <span className={`mb-1.5 text-sm line-through ${featured ? "text-white/60" : "text-ink-soft"}`}>₹{t.priceInr}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-display text-5xl font-bold">₹{t.priceInr}</span>
                        <span className={`mb-1.5 text-sm ${featured ? "text-white/60" : "text-ink-soft"}`}>/ PDF</span>
                      </>
                    )}
                  </p>
                  <p className={`mt-2 text-sm ${featured ? "text-white/75" : "text-ink-soft"}`}>{t.tagline}</p>
                  <span className={`mt-6 ${featured ? "btn-gold" : "btn-ghost"} w-full`}>Start free →</span>
                </div>
              </Link>
            );
          })}
        </div>
        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-ink-soft">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-marigold-400 text-brand-900">
                <Icon d={icons.check} className="h-3.5 w-3.5" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq({ items = faqs }: { items?: { q: string; a: string }[] }) {
  return (
    <section id="faq" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Questions? We've got answers" />
        <div className="mt-10 space-y-3">
          {items.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-cream-200 bg-white p-5 open:shadow-lg open:shadow-brand-900/5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-14 text-center text-white sm:px-12">
        <div className="bg-mandala absolute inset-0 opacity-25" />
        <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-marigold-400/30 blur-3xl" />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Your perfect first impression is 5 minutes away</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">Create a stunning marriage biodata or job-winning resume today, {FREE ? "free during our launch offer" : `starting at just ₹${minPrice()}`}.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/create/biodata-royal" className="btn-gold px-7 py-3 text-base">Create Biodata</Link>
            <Link href="/create/resume-classic" className="btn border border-white/30 bg-white/10 px-7 py-3 text-base text-white hover:bg-white/20">Build Resume</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
