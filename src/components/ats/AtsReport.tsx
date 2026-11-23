import type { AtsResult, AtsStatus } from "@/lib/ats";

const COLOR: Record<AtsResult["grade"], string> = {
  Excellent: "#16A34A",
  Good: "#65A30D",
  "Needs work": "#D97706",
  Poor: "#DC2626",
};

const ICON: Record<AtsStatus, { sym: string; cls: string }> = {
  pass: { sym: "✓", cls: "bg-green-100 text-green-700" },
  warn: { sym: "!", cls: "bg-amber-100 text-amber-700" },
  fail: { sym: "✕", cls: "bg-red-100 text-red-600" },
  info: { sym: "i", cls: "bg-sky-100 text-sky-700" },
};

export function ScoreRing({ score, grade, size = 120 }: { score: number; grade: AtsResult["grade"]; size?: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" width={size} height={size} className="-rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#F4EAD9" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={COLOR[grade]}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold leading-none text-ink" style={{ fontSize: size / 4 }}>
          {score}
        </span>
        <span className="mt-1 text-[10px] font-medium text-ink-soft">/ 100</span>
      </div>
    </div>
  );
}

export function AtsReport({ result, compact = false }: { result: AtsResult; compact?: boolean }) {
  const failing = result.checks.filter((c) => c.status === "fail" || c.status === "warn");
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <ScoreRing score={result.score} grade={result.grade} size={compact ? 92 : 120} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">ATS score</p>
          <p className="font-display text-2xl font-bold" style={{ color: COLOR[result.grade] }}>
            {result.grade}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {failing.length === 0
              ? "Great job, your resume is well optimised."
              : `${failing.length} thing${failing.length === 1 ? "" : "s"} to improve`}
            {result.keywords ? ` · ${result.keywords.score}% keyword match` : ""}
          </p>
        </div>
      </div>

      {result.keywords ? (
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-sm font-semibold">Job description keywords</p>
          <p className="mt-0.5 text-xs text-ink-soft">
            Base score {result.baseScore} blended with {result.keywords.score}% keyword match.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {result.keywords.matched.map((k) => (
              <span key={k} className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
                ✓ {k}
              </span>
            ))}
            {result.keywords.missing.map((k) => (
              <span key={k} className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 ring-1 ring-red-200">
                + {k}
              </span>
            ))}
          </div>
          {result.keywords.missing.length ? (
            <p className="mt-3 text-xs text-ink-soft">
              Add the red keywords where they honestly apply (skills, summary, bullet points).
            </p>
          ) : null}
        </div>
      ) : null}

      <ul className="divide-y divide-cream-200 overflow-hidden rounded-2xl border border-cream-200 bg-white">
        {result.checks.map((c) => (
          <li key={c.id} className="flex gap-3 px-4 py-3">
            <span className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${ICON[c.status].cls}`}>
              {ICON[c.status].sym}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-ink">{c.label}</p>
                {c.max ? (
                  <span className="shrink-0 text-xs tabular-nums text-ink-soft">
                    {c.points}/{c.max}
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-ink-soft">{c.detail}</p>
              {c.tip ? <p className="mt-1 text-xs font-medium text-brand-700">→ {c.tip}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
