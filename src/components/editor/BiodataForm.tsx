"use client";

import type { BiodataData, BioField, BioSection, SymbolId } from "@/lib/templates";
import { symbols } from "@/lib/templates";
import { DivineSymbol } from "@/components/templates/DivineSymbol";
import { htmlPrims } from "@/components/templates/html";
import { sampleBiodata, uid } from "@/lib/defaults";
import { HI_LABELS, TITLES, convertBiodata, toLang } from "@/lib/hindi";
import { PhotoInput } from "./PhotoInput";
import { AddBtn, Card, DownIcon, Field, IconBtn, TrashIcon, UpIcon, move } from "./ui";

const LABELS = [
  "Full Name", "Date of Birth", "Time of Birth", "Place of Birth", "Age", "Height", "Weight", "Complexion",
  "Blood Group", "Religion", "Caste", "Sub-caste", "Gotra", "Rashi", "Nakshatra", "Manglik", "Mother Tongue",
  "Education", "Occupation", "Company", "Annual Income", "Diet", "Hobbies", "Marital Status",
  "Father's Name", "Father's Occupation", "Mother's Name", "Mother's Occupation", "Brother(s)", "Sister(s)",
  "Family Type", "Family Values", "Native Place", "Residence", "Contact Person", "Mobile", "Email", "Address",
  "Expectations",
];

const HEADERS = [
  ...symbols.map((s) => s.blessing).filter(Boolean),
  "|| Jai Shree Krishna ||",
  "|| Shree Ram ||",
  "|| Jai Mata Di ||",
  "|| Waheguru Ji ||",
  "|| Bismillah ||",
];
const HEADERS_HI = HEADERS.map((h) => toLang(h, "hi"));
const ALL_HEADERS = [...HEADERS, ...HEADERS_HI];

export function BiodataForm({
  data,
  onChange,
  accent,
}: {
  data: BiodataData;
  onChange: (d: BiodataData) => void;
  accent: string;
}) {
  const set = <K extends keyof BiodataData>(k: K, v: BiodataData[K]) => onChange({ ...data, [k]: v });
  const current = data.symbol ?? "none";
  const lang = data.lang ?? "en";
  const hi = lang === "hi";
  const tr = (en: string, hiText: string) => (hi ? hiText : en);

  /** Pick a symbol; also switch the blessing line unless the user wrote a custom one. */
  const pickSymbol = (id: SymbolId) => {
    const next = symbols.find((x) => x.id === id)!;
    const h = data.headerText.trim();
    const replace = id !== "none" && (!h || ALL_HEADERS.includes(h));
    onChange({ ...data, symbol: id, headerText: replace ? toLang(next.blessing, lang) : data.headerText });
  };
  const setSection = (i: number, s: BioSection) => set("sections", data.sections.map((x, j) => (j === i ? s : x)));
  const setField = (si: number, fi: number, f: BioField) =>
    setSection(si, { ...data.sections[si]!, fields: data.sections[si]!.fields.map((x, j) => (j === fi ? f : x)) });

  return (
    <div className="space-y-4">
      <datalist id="bio-labels">
        {(hi ? HI_LABELS : LABELS).map((l) => (
          <option key={l} value={l} />
        ))}
      </datalist>
      <datalist id="bio-titles">
        {TITLES[lang].map((l) => (
          <option key={l} value={l} />
        ))}
      </datalist>
      <datalist id="bio-headers">
        {(hi ? HEADERS_HI : HEADERS).map((l) => (
          <option key={l} value={l} />
        ))}
      </datalist>

      <Card title="Language / भाषा">
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Biodata language">
          {(
            [
              ["en", "English", "Labels in English"],
              ["hi", "हिन्दी", "हिन्दी में जीवन परिचय"],
            ] as const
          ).map(([code, name, sub]) => (
            <button
              key={code}
              type="button"
              role="radio"
              aria-checked={lang === code}
              onClick={() => lang !== code && onChange(convertBiodata(data, code, sampleBiodata))}
              className={`rounded-xl border-2 px-3 py-2.5 text-left transition ${
                lang === code ? "border-brand-500 bg-brand-50" : "border-cream-200 bg-white hover:border-brand-200"
              }`}
            >
              <span className="block text-base font-semibold text-ink">{name}</span>
              <span className="block text-[11px] text-ink-soft">{sub}</span>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-ink-soft">
          {tr(
            "Switching translates labels, headings and your details automatically. Please check names and spellings after switching.",
            "भाषा बदलने पर लेबल, शीर्षक और आपके विवरण अपने-आप बदल जाएंगे। बदलने के बाद नाम और वर्तनी एक बार जांच लें।",
          )}
        </p>
      </Card>

      <Card title={tr("Divine symbol", "शुभ चिन्ह")}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Divine symbol">
          {symbols.map((sy) => (
            <button
              key={sy.id}
              type="button"
              role="radio"
              aria-checked={current === sy.id}
              onClick={() => pickSymbol(sy.id)}
              className={`flex flex-col items-center justify-between gap-1.5 rounded-xl border-2 px-1 py-2.5 text-center text-[11px] font-medium leading-tight transition ${
                current === sy.id
                  ? "border-brand-500 bg-brand-50 text-brand-800 shadow-sm"
                  : "border-cream-200 bg-white text-ink-soft hover:border-brand-200"
              }`}
            >
              <span className="flex h-9 items-center justify-center">
                {sy.id === "none" ? (
                  <span className="text-xl text-ink-soft/50">⊘</span>
                ) : (
                  <DivineSymbol P={htmlPrims} id={sy.id} size={34} main="#B8862F" detail={accent} bg="#FFFFFF" />
                )}
              </span>
              {sy.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-ink-soft">{tr("Shown at the top of your biodata. The blessing line updates automatically.", "बायोडाटा के ऊपर दिखेगा। मंगल पंक्ति अपने-आप बदल जाएगी।")}</p>
      </Card>

      <Card title={tr("Basic details", "मूल विवरण")}>
        <PhotoInput value={data.photo} onChange={(v) => set("photo", v)} />
        <Field label={tr("Full name", "पूरा नाम")} value={data.name} onChange={(v) => set("name", v)} placeholder={tr("e.g. Priya Sharma", "जैसे: प्रिया शर्मा")} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label={tr("Top blessing line (optional)", "मंगल पंक्ति (वैकल्पिक)")}
            value={data.headerText}
            onChange={(v) => set("headerText", v)}
            list="bio-headers"
            placeholder={tr("Leave empty to hide", "छिपाने के लिए खाली छोड़ें")}
          />
          <Field label={tr("Document title", "शीर्षक")} value={data.title} onChange={(v) => set("title", v)} list="bio-titles" placeholder={tr("Biodata", "जीवन परिचय")} />
        </div>
      </Card>

      {data.sections.map((s, si) => (
        <Card
          key={s.id}
          title={s.title || tr("Untitled section", "बिना शीर्षक भाग")}
          actions={
            <span className="flex gap-1">
              <IconBtn label="Move section up" disabled={si === 0} onClick={() => set("sections", move(data.sections, si, -1))}>
                <UpIcon />
              </IconBtn>
              <IconBtn
                label="Move section down"
                disabled={si === data.sections.length - 1}
                onClick={() => set("sections", move(data.sections, si, 1))}
              >
                <DownIcon />
              </IconBtn>
              <IconBtn
                label="Delete section"
                danger
                onClick={() => {
                  if (confirm(`Delete the "${s.title}" section?`)) set("sections", data.sections.filter((_, j) => j !== si));
                }}
              >
                <TrashIcon />
              </IconBtn>
            </span>
          }
        >
          <Field label={tr("Section title", "भाग का शीर्षक")} value={s.title} onChange={(v) => setSection(si, { ...s, title: v })} />
          <div className="space-y-2">
            {s.fields.map((f, fi) => (
              <div key={f.id} className="grid grid-cols-[1fr_auto] gap-2 rounded-xl bg-cream/70 p-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto]">
                <input
                  aria-label="Label"
                  className="field col-span-1 bg-white text-xs font-medium text-ink-soft"
                  value={f.label}
                  list="bio-labels"
                  placeholder={tr("Label", "लेबल")}
                  onChange={(e) => setField(si, fi, { ...f, label: e.target.value })}
                />
                <span className="flex gap-1 sm:order-last">
                  <IconBtn
                    label="Move up"
                    disabled={fi === 0}
                    onClick={() => setSection(si, { ...s, fields: move(s.fields, fi, -1) })}
                  >
                    <UpIcon />
                  </IconBtn>
                  <IconBtn
                    label="Remove field"
                    danger
                    onClick={() => setSection(si, { ...s, fields: s.fields.filter((_, j) => j !== fi) })}
                  >
                    <TrashIcon />
                  </IconBtn>
                </span>
                <input
                  aria-label={`${f.label || "Field"} value`}
                  className="field col-span-2 sm:col-span-1"
                  value={f.value}
                  placeholder={tr("Value", "विवरण")}
                  onChange={(e) => setField(si, fi, { ...f, value: e.target.value })}
                />
              </div>
            ))}
          </div>
          <AddBtn onClick={() => setSection(si, { ...s, fields: [...s.fields, { id: uid(), label: "", value: "" }] })}>
            {tr("Add field", "पंक्ति जोड़ें")}
          </AddBtn>
        </Card>
      ))}

      <AddBtn
        onClick={() =>
          set("sections", [
            ...data.sections,
            { id: uid("s"), title: tr("Other Details", "अन्य विवरण"), fields: [{ id: uid(), label: tr("Expectations", "अपेक्षाएं"), value: "" }] },
          ])
        }
      >
        {tr("Add new section", "नया भाग जोड़ें")}
      </AddBtn>
    </div>
  );
}
