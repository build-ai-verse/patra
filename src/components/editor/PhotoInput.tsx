"use client";

import { useRef, useState } from "react";

/** Reads an image, downsizes it (max 640px) and returns a compact JPEG data URL. */
async function toDataUrl(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const max = 640;
    const k = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * k);
    c.height = Math.round(img.height * k);
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.86);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function PhotoInput({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState("");
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="relative flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-brand-200 bg-brand-50 text-brand-400 transition hover:border-brand-400"
        aria-label="Upload photo"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Your photo" className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <div className="text-sm">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => ref.current?.click()} className="btn-ghost px-3.5 py-1.5 text-xs">
            {value ? "Change photo" : "Upload photo"}
          </button>
          {value ? (
            <button type="button" onClick={() => onChange(null)} className="btn px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
              Remove
            </button>
          ) : null}
        </div>
        <p className="mt-1.5 text-[11px] text-ink-soft">JPG or PNG. A clear, front-facing photo works best.</p>
        {err ? <p className="mt-1 text-[11px] text-red-600">{err}</p> : null}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          if (f.size > 15 * 1024 * 1024) return setErr("Please choose an image under 15 MB.");
          try {
            setErr("");
            onChange(await toDataUrl(f));
          } catch {
            setErr("Couldn't read that image. Try a JPG or PNG.");
          }
        }}
      />
    </div>
  );
}
