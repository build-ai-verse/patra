"use client";

import { useId, type ReactNode } from "react";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  list,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  list?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="field"
        value={value}
        placeholder={placeholder}
        list={list}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function Area({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className="field resize-y leading-relaxed"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <p className="mt-1 text-[11px] text-ink-soft/80">{hint}</p> : null}
    </div>
  );
}

export function Card({
  title,
  children,
  actions,
  defaultOpen = true,
}: {
  title: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group rounded-2xl border border-cream-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 flex-1 items-center gap-2 font-semibold text-ink">
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-brand-500 transition group-open:rotate-90" fill="currentColor" aria-hidden="true">
            <path d="M7 5l6 5-6 5z" />
          </svg>
          {title}
        </span>
        {actions}
      </summary>
      <div className="space-y-3 border-t border-cream-200 px-4 pb-4 pt-3">{children}</div>
    </details>
  );
}

export function IconBtn({
  onClick,
  label,
  children,
  danger = false,
  disabled = false,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm transition disabled:opacity-30 ${
        danger
          ? "border-red-100 text-red-500 hover:bg-red-50"
          : "border-cream-200 text-ink-soft hover:bg-cream"
      }`}
    >
      {children}
    </button>
  );
}

export const TrashIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
);
export const UpIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
export const DownIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

export function AddBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-200 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-400 hover:bg-brand-50"
    >
      <span className="text-lg leading-none">+</span> {children}
    </button>
  );
}

export const move = <T,>(arr: T[], i: number, dir: -1 | 1): T[] => {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const copy = arr.slice();
  [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  return copy;
};
