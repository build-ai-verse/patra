"use client";

import { useEffect, useRef, useState } from "react";
import type { DocumentPayload } from "@/lib/templates";
import { RenderDocument } from "@/components/templates";
import { htmlPrims } from "@/components/templates/html";
import { site } from "@/config/site";

const PAGE_W = 595;
const PAGE_H = 842;

/**
 * Renders a document at A4 size (595x842) and scales it to the container width.
 * `watermark` overlays a repeated diagonal "PREVIEW" pattern (paid PDF has none).
 */
export function PreviewFrame({
  doc,
  watermark = false,
  className = "",
  fixedHeight = false,
}: {
  doc: DocumentPayload;
  watermark?: boolean;
  className?: string;
  /** Crop to exactly one A4 page (used for gallery thumbnails). */
  fixedHeight?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [h, setH] = useState(PAGE_H);

  useEffect(() => {
    const el = wrap.current;
    const page = inner.current;
    if (!el || !page) return;
    const ro = new ResizeObserver(() => {
      setScale(el.clientWidth / PAGE_W);
      setH(fixedHeight ? PAGE_H : Math.max(PAGE_H, page.scrollHeight));
    });
    ro.observe(el);
    ro.observe(page);
    return () => ro.disconnect();
  }, [fixedHeight]);

  return (
    <div
      ref={wrap}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: h * scale }}
      onContextMenu={watermark ? (e) => e.preventDefault() : undefined}
    >
      <div
        ref={inner}
        className="absolute left-0 top-0 origin-top-left select-none"
        style={{ width: PAGE_W, transform: `scale(${scale})` }}
        aria-label="Document preview"
      >
        <RenderDocument doc={doc} P={htmlPrims} />
        {watermark ? <Watermark /> : null}
      </div>
    </div>
  );
}

function Watermark() {
  const rows = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -inset-40 flex -rotate-[30deg] flex-col justify-around">
        {rows.map((_, i) => (
          <div
            key={i}
            className="whitespace-nowrap text-center font-display text-[22px] font-bold tracking-[0.3em] text-black/[0.07]"
            style={{ marginLeft: i % 2 ? 60 : 0 }}
          >
            {`PREVIEW · ${site.name.toUpperCase()} · PREVIEW · ${site.name.toUpperCase()} · PREVIEW`}
          </div>
        ))}
      </div>
    </div>
  );
}
