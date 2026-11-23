"use client";

import { useEffect, useRef, useState } from "react";
import type { ResumeData } from "@/lib/templates";
import { uid } from "@/lib/defaults";
import { ACCEPTED_RESUME_TYPES, extractResumeText } from "@/lib/extract-text";
import { IMPORT_KEY } from "@/components/ats/AtsChecker";
import { Card } from "./ui";

interface AiResume {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  experience: { role: string; company: string; location: string; start: string; end: string; points: string[] }[];
  education: { degree: string; institute: string; year: string; score: string }[];
  projects: { name: string; link: string; description: string }[];
  skills: string[];
  languages: string[];
  certifications: string[];
}

const toResumeData = (r: AiResume, photo: string | null): ResumeData => ({
  name: r.name,
  title: r.title,
  email: r.email,
  phone: r.phone,
  location: r.location,
  linkedin: r.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
  website: r.website.replace(/^https?:\/\/(www\.)?/, ""),
  photo,
  summary: r.summary,
  experience: r.experience.map((e) => ({ id: uid("e"), ...e, points: e.points.join("\n") })),
  education: r.education.map((e) => ({ id: uid("ed"), ...e })),
  projects: r.projects.map((p) => ({ id: uid("p"), ...p })),
  skills: r.skills.join(", "),
  languages: r.languages.join(", "),
  certifications: r.certifications.join("\n"),
});

export function AiAutofill({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [polish, setPolish] = useState(true);
  const [busy, setBusy] = useState<"" | "reading" | "ai">("");
  const [err, setErr] = useState("");
  const [undo, setUndo] = useState<ResumeData | null>(null);
  const [open, setOpen] = useState(false);

  // Text handed over from the ATS checker ("Import with AI").
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("import")) return;
    try {
      const t = sessionStorage.getItem(IMPORT_KEY);
      if (t) {
        sessionStorage.removeItem(IMPORT_KEY);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time handoff from sessionStorage
        setText(t);
        setOpen(true);
        setTimeout(() => boxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      }
    } catch {
      /* ignore */
    }
  }, []);

  async function onFile(f: File) {
    setErr("");
    setBusy("reading");
    try {
      setText(await extractResumeText(f));
    } catch (e) {
      setErr((e as Error).message || "Could not read that file.");
    } finally {
      setBusy("");
    }
  }

  async function run() {
    setErr("");
    if (text.trim().length < 40) return setErr("Paste your resume, LinkedIn profile or notes first (or upload a file).");
    setBusy("ai");
    try {
      const res = await fetch("/api/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, polish }),
      });
      const j = (await res.json().catch(() => ({}))) as { resume?: AiResume; error?: string };
      if (!res.ok || !j.resume) throw new Error(j.error ?? "AI auto-fill failed. Please try again.");
      setUndo(data);
      onChange(toResumeData(j.resume, data.photo));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy("");
    }
  }

  return (
    <div ref={boxRef}>
      <Card
        key={open ? "open" : "closed"}
        defaultOpen={open}
        title={
          <span className="flex items-center gap-2">
            ✨ AI auto-fill
            <span className="rounded-full bg-marigold-300/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-800">Free</span>
          </span>
        }
      >
        <p className="text-xs text-ink-soft">
          Paste your old resume, LinkedIn profile or rough notes, or upload a PDF/DOCX. AI fills every field below in seconds.
        </p>
        <textarea
          className="field min-h-36 resize-y text-xs leading-relaxed"
          placeholder={"e.g. Rahul Verma, software engineer at Flipkart since 2022. Before that TCS Pune 2020-22, built Node APIs…\nB.Tech CSE VIT 2020, 8.7 CGPA. Skills: React, Node, AWS…"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Text for AI auto-fill"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost px-3.5 py-1.5 text-xs" disabled={!!busy}>
            {busy === "reading" ? "Reading file…" : "📄 Upload existing resume"}
          </button>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
            <input type="checkbox" checked={polish} onChange={(e) => setPolish(e.target.checked)} className="h-4 w-4 accent-brand-700" />
            Polish wording with action verbs
          </label>
        </div>
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
        {err ? <p className="text-xs text-red-600">{err}</p> : null}
        <div className="flex gap-2">
          <button type="button" onClick={run} disabled={!!busy} className="btn-primary flex-1">
            {busy === "ai" ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Filling your resume…
              </>
            ) : (
              "✨ Auto-fill with AI"
            )}
          </button>
          {undo ? (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                onChange(undo);
                setUndo(null);
              }}
            >
              Undo
            </button>
          ) : null}
        </div>
        <p className="text-[10px] leading-snug text-ink-soft/80">
          Your text is sent to our AI provider only to fill this form. AI never invents facts, but always review the result before downloading.
        </p>
      </Card>
    </div>
  );
}
