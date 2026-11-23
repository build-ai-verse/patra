import { site } from "@/config/site";

/** Brand mark: a folded "patra" (document) with a marigold seal. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9A2349" />
          <stop offset="1" stopColor="#5E1530" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#lm-bg)" />
      <path d="M19 13h19l9 9v29a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V16a3 3 0 0 1 3-3z" fill="#FBF6EE" />
      <path d="M38 13v7a2 2 0 0 0 2 2h7z" fill="#E7D3B5" />
      <rect x="21" y="27" width="16" height="2.6" rx="1.3" fill="#C8963E" />
      <rect x="21" y="33" width="21" height="2.2" rx="1.1" fill="#D9C6A8" />
      <rect x="21" y="38.5" width="18" height="2.2" rx="1.1" fill="#D9C6A8" />
      <circle cx="41" cy="46" r="7" fill="#F9B949" />
      <path d="M41 41.5l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" fill="#7A1C3A" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-none">
        <span className={`font-display text-2xl font-bold tracking-tight ${light ? "text-white" : "text-brand-700"}`}>
          {site.name}
          <sup className="ml-0.5 align-super text-[10px] font-semibold">{site.trademark}</sup>
        </span>
        <span className={`block text-[10px] font-medium tracking-wide ${light ? "text-white/70" : "text-ink-soft"}`}>
          by {site.poweredBy}
        </span>
      </span>
    </span>
  );
}
