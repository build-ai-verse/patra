import Link from "next/link";
import { brandFull, site } from "@/config/site";
import { Logo } from "./Logo";
import { Year } from "./Year";

const cols = [
  {
    title: "Create",
    links: [
      { href: "/create/biodata-royal", label: "Royal Heritage Biodata" },
      { href: "/create/biodata-lotus", label: "Lotus Modern Biodata" },
      { href: "/create/resume-classic", label: "Classic Resume" },
      { href: "/create/resume-modern", label: "Modern Sidebar Resume" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/marriage-biodata", label: "Marriage Biodata Format" },
      { href: "/marriage-biodata-hindi", label: "हिंदी बायोडाटा फॉर्मेट" },
      { href: "/resume-maker", label: "Resume Maker for India" },
      { href: "/ats-checker", label: "Free ATS Resume Checker" },
      { href: "/#faq", label: "FAQs" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/refund-policy", label: "Refund & Cancellation" },
      { href: "/shipping-policy", label: "Delivery Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-brand-900 text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            {site.description}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-marigold-400" /> Secure payments by Razorpay · UPI, Cards, Netbanking
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-semibold text-white">{c.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-marigold-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/60 sm:flex-row sm:px-6">
          <p>
            © <Year /> {brandFull}. All rights reserved.
          </p>
          <p>
            Powered by <span className="font-semibold text-marigold-300">{site.poweredBy}</span> · Made with ❤ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
