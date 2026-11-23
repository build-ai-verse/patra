"use client";

import { useEffect, useMemo, useState } from "react";
import type { ResumeData } from "@/lib/templates";
import { analyzeResume, resumeToText } from "@/lib/ats";
import { AtsReport } from "@/components/ats/AtsReport";
import { store } from "./checkout";
import { Card } from "./ui";

const JD_KEY = "patra:jd";

/** Live ATS score for the resume being built. */
export function AtsPanel({ data, layout }: { data: ResumeData; layout: "single-column" | "two-column" }) {
  const [jd, setJd] = useState("");
  useEffect(() => {
    const saved = store.get<string>(JD_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore from localStorage after hydration
    if (saved) setJd(saved);
  }, []);
  useEffect(() => {
    const id = setTimeout(() => store.set(JD_KEY, jd), 400);
    return () => clearTimeout(id);
  }, [jd]);

  const result = useMemo(() => analyzeResume(resumeToText(data), { jobDescription: jd, layout }), [data, jd, layout]);
  const color = result.score >= 80 ? "bg-green-600" : result.score >= 65 ? "bg-lime-600" : result.score >= 45 ? "bg-amber-600" : "bg-red-600";

  return (
    <Card
      defaultOpen={false}
      title={
        <span className="flex items-center gap-2">
          🎯 ATS score
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold text-white ${color}`}>{result.score}/100</span>
        </span>
      }
    >
      <label className="label" htmlFor="ats-jd-editor">
        Paste the job description to check keyword match (optional)
      </label>
      <textarea
        id="ats-jd-editor"
        className="field min-h-24 resize-y text-xs leading-relaxed"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="Paste the job description you're applying for…"
      />
      <AtsReport result={result} compact />
    </Card>
  );
}
