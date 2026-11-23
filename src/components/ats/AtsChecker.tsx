"use client";

import Link from "next/link";
import { features } from "@/config/site";
import { useRef, useState } from "react";
import { analyzeResume, type AtsResult } from "@/lib/ats";
import { ACCEPTED_RESUME_TYPES, extractResumeText } from "@/lib/extract-text";
import { AtsReport } from "./AtsReport";

export const IMPORT_KEY = "patra:import-text";

export function AtsChecker() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [jd, setJd] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState<AtsResult | null>(null);

  async function onFile(f: File) {
    setErr("");
    setBusy(true);
    try {
      const t = await extractResumeText(f);
      setText(t);
      setFileName(f.name);
      setResult(analyzeResume(t, { jobDescription: jd }));
    } catch (e) {
      setErr((e as Error).message || "Could not read that file.");
    } finally {
      setBusy(false);
    }
  }

  function run() {
    setErr("");
    if (text.trim().length < 50) return setErr("Upload a resume or paste at least a few lines of text.");
    setResult(analyzeResume(text, { jobDescription: jd }));
  }

  function importToBuilder() {
    try {
      sessionStorage.setItem(IMPORT_KEY, text);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="rounded-3xl border border-cream-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-2 rounded-full border border-cream-200 bg-cream p-1 text-sm font-semibold">
            {(["upload", "paste"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-full py-2 transition ${mode === m ? "bg-brand-700 text-white" : "text-ink-soft"}`}
              >
                {m === "upload" ? "📄 Upload resume" : "📋 Paste text"}
              </button>
            ))}
          </div>

          {mode === "upload" ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) onFile(f);
              }}
              className="mt-4 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 px-4 py-10 text-center transition hover:border-brand-400"
            >
              <span className="text-3xl">⬆️</span>
              <span className="mt-2 font-semibold text-ink">{busy ? "Reading your resume…" : fileName || "Drop your resume here or tap to upload"}</span>
              <span className="mt-1 text-xs text-ink-soft">PDF, DOCX or TXT · read privately in your browser</span>
            </button>
          ) : (
            <textarea
              className="field mt-4 min-h-56 resize-y font-mono text-xs leading-relaxed"
              placeholder="Paste the full text of your resume here…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_RESUME_TYPES}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) onFile(f);
            }}
          />

          <label className="label mt-4" htmlFor="ats-jd">
            Job description (optional, for keyword match)
          </label>
          <textarea
            id="ats-jd"
            className="field min-h-28 resize-y text-xs leading-relaxed"
            placeholder="Paste the job description you're applying for…"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
          {err ? <p className="mt-2 text-sm text-red-600">{err}</p> : null}
          <button type="button" onClick={run} disabled={busy} className="btn-primary mt-4 w-full py-3 text-base">
            Check my ATS score
          </button>
          <p className="mt-2 text-center text-[11px] text-ink-soft">Free · No signup · Your resume never leaves your device</p>
        </div>
      </div>

      <div>
        {result ? (
          <div className="space-y-5">
            <AtsReport result={result} />
            <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white">
              <p className="font-display text-xl font-bold">Fix it in minutes</p>
              <p className="mt-1 text-sm text-white/75">
                {features.aiAutofill
                  ? "Import this resume into our ATS-friendly builder. AI fills every field for you, then polish and download."
                  : "Rebuild it in our ATS-friendly resume builder using the tips above, then download a clean PDF."}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {features.aiAutofill ? (
                  <Link href="/create/resume-classic?import=1" onClick={importToBuilder} className="btn-gold flex-1">
                    ✨ Import with AI
                  </Link>
                ) : null}
                <Link
                  href="/create/resume-classic"
                  className={features.aiAutofill ? "btn flex-1 border border-white/30 bg-white/10 text-white hover:bg-white/20" : "btn-gold flex-1"}
                >
                  {features.aiAutofill ? "Start fresh" : "Open the resume builder"}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-cream-200 p-8 text-center text-ink-soft">
            <span className="text-5xl">🎯</span>
            <p className="mt-3 font-semibold text-ink">Your ATS report appears here</p>
            <p className="mt-1 max-w-sm text-sm">
              We check readability, contact details, section headings, bullet points, numbers, action verbs and keyword match.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
