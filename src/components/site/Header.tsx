import Link from "next/link";
import { Logo } from "./Logo";
import { minPrice } from "@/lib/templates";
import { FREE } from "@/lib/pricing";

const nav = [
  { href: "/marriage-biodata", label: "Marriage Biodata" },
  { href: "/resume-maker", label: "Resume Maker" },
  { href: "/ats-checker", label: "ATS Checker" },
  { href: "/#pricing", label: "Pricing" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200/80 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft lg:flex" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="transition hover:text-brand-700">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/#templates" className="btn-primary hidden sm:inline-flex">
            {FREE ? "Create free now" : `Create now · from ₹${minPrice()}`}
          </Link>
          {/* Mobile menu (no JS needed) */}
          <details className="group relative lg:hidden">
            <summary
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 [&::-webkit-details-marker]:hidden"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 group-open:hidden" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
              <svg viewBox="0 0 24 24" className="hidden h-5 w-5 group-open:block" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-cream-200 bg-white p-2 shadow-xl">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-brand-50">
                  {n.label}
                </Link>
              ))}
              <Link href="/#templates" className="btn-primary mt-1 w-full">
                {FREE ? "Create free now" : `Create now · from ₹${minPrice()}`}
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
