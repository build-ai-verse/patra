"use client";

import type { ResumeData, ResumeEducation, ResumeExperience, ResumeProject } from "@/lib/templates";
import { uid } from "@/lib/defaults";
import { PhotoInput } from "./PhotoInput";
import { AiAutofill } from "./AiAutofill";
import { features } from "@/config/site";
import { AtsPanel } from "./AtsPanel";
import { AddBtn, Area, Card, DownIcon, Field, IconBtn, TrashIcon, UpIcon, move } from "./ui";

type ListKey = "experience" | "education" | "projects";

export function ResumeForm({
  data,
  onChange,
  showPhoto,
}: {
  data: ResumeData;
  onChange: (d: ResumeData) => void;
  showPhoto: boolean;
}) {
  const set = <K extends keyof ResumeData>(k: K, v: ResumeData[K]) => onChange({ ...data, [k]: v });

  const itemActions = (k: ListKey, i: number) => {
    const items = data[k] as { id: string }[];
    const put = (v: { id: string }[]) => set(k, v as never);
    return (
      <span className="flex gap-1">
        <IconBtn label="Move up" disabled={i === 0} onClick={() => put(move(items, i, -1))}>
          <UpIcon />
        </IconBtn>
        <IconBtn label="Move down" disabled={i === items.length - 1} onClick={() => put(move(items, i, 1))}>
          <DownIcon />
        </IconBtn>
        <IconBtn label="Remove" danger onClick={() => put(items.filter((_, j) => j !== i))}>
          <TrashIcon />
        </IconBtn>
      </span>
    );
  };

  const upd = <T extends { id: string }>(k: ListKey, i: number, patch: Partial<T>) =>
    set(k, (data[k] as unknown as T[]).map((x, j) => (j === i ? { ...x, ...patch } : x)) as never);

  return (
    <div className="space-y-4">
      {features.aiAutofill ? <AiAutofill data={data} onChange={onChange} /> : null}
      <AtsPanel data={data} layout={showPhoto ? "two-column" : "single-column"} />
      <Card title="Personal details">
        {showPhoto ? <PhotoInput value={data.photo} onChange={(v) => set("photo", v)} /> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name" value={data.name} onChange={(v) => set("name", v)} />
          <Field label="Job title" value={data.title} onChange={(v) => set("title", v)} placeholder="e.g. Data Analyst" />
          <Field label="Email" type="email" value={data.email} onChange={(v) => set("email", v)} />
          <Field label="Phone" type="tel" value={data.phone} onChange={(v) => set("phone", v)} />
          <Field label="City, State" value={data.location} onChange={(v) => set("location", v)} />
          <Field label="LinkedIn" value={data.linkedin} onChange={(v) => set("linkedin", v)} placeholder="linkedin.com/in/you" />
          <Field
            label="Website / GitHub / Portfolio"
            className="sm:col-span-2"
            value={data.website}
            onChange={(v) => set("website", v)}
          />
        </div>
      </Card>

      <Card title="Professional summary">
        <Area
          label="Summary"
          rows={4}
          value={data.summary}
          onChange={(v) => set("summary", v)}
          hint="2-3 lines about your experience, strengths and what you're looking for."
        />
      </Card>

      <Card title={`Work experience (${data.experience.length})`}>
        {data.experience.map((e, i) => (
          <div key={e.id} className="space-y-3 rounded-xl bg-cream/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold">{e.role || "New role"}</p>
              {itemActions("experience", i)}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Role / Designation" value={e.role} onChange={(v) => upd<ResumeExperience>("experience", i, { role: v })} />
              <Field label="Company" value={e.company} onChange={(v) => upd<ResumeExperience>("experience", i, { company: v })} />
              <Field label="Location" value={e.location} onChange={(v) => upd<ResumeExperience>("experience", i, { location: v })} />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Start" value={e.start} placeholder="Jun 2021" onChange={(v) => upd<ResumeExperience>("experience", i, { start: v })} />
                <Field label="End" value={e.end} placeholder="Present" onChange={(v) => upd<ResumeExperience>("experience", i, { end: v })} />
              </div>
            </div>
            <Area
              label="Key achievements (one per line)"
              rows={4}
              value={e.points}
              onChange={(v) => upd<ResumeExperience>("experience", i, { points: v })}
              hint="Start with action verbs and add numbers: “Increased sales by 25%”."
            />
          </div>
        ))}
        <AddBtn
          onClick={() =>
            set("experience", [
              ...data.experience,
              { id: uid("e"), role: "", company: "", location: "", start: "", end: "", points: "" },
            ])
          }
        >
          Add experience
        </AddBtn>
      </Card>

      <Card title={`Education (${data.education.length})`}>
        {data.education.map((e, i) => (
          <div key={e.id} className="space-y-3 rounded-xl bg-cream/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold">{e.degree || "New education"}</p>
              {itemActions("education", i)}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Degree / Class" value={e.degree} onChange={(v) => upd<ResumeEducation>("education", i, { degree: v })} />
              <Field label="College / School" value={e.institute} onChange={(v) => upd<ResumeEducation>("education", i, { institute: v })} />
              <Field label="Year" value={e.year} placeholder="2018 - 2022" onChange={(v) => upd<ResumeEducation>("education", i, { year: v })} />
              <Field label="Score" value={e.score} placeholder="CGPA 8.5 / 82%" onChange={(v) => upd<ResumeEducation>("education", i, { score: v })} />
            </div>
          </div>
        ))}
        <AddBtn onClick={() => set("education", [...data.education, { id: uid("ed"), degree: "", institute: "", year: "", score: "" }])}>
          Add education
        </AddBtn>
      </Card>

      <Card title="Skills & languages">
        <Area label="Skills (comma separated)" rows={2} value={data.skills} onChange={(v) => set("skills", v)} />
        <Field label="Languages (comma separated)" value={data.languages} onChange={(v) => set("languages", v)} />
      </Card>

      <Card title={`Projects (${data.projects.length})`} defaultOpen={false}>
        {data.projects.map((p, i) => (
          <div key={p.id} className="space-y-3 rounded-xl bg-cream/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold">{p.name || "New project"}</p>
              {itemActions("projects", i)}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Project name" value={p.name} onChange={(v) => upd<ResumeProject>("projects", i, { name: v })} />
              <Field label="Link" value={p.link} onChange={(v) => upd<ResumeProject>("projects", i, { link: v })} />
            </div>
            <Area label="Description" rows={2} value={p.description} onChange={(v) => upd<ResumeProject>("projects", i, { description: v })} />
          </div>
        ))}
        <AddBtn onClick={() => set("projects", [...data.projects, { id: uid("p"), name: "", link: "", description: "" }])}>
          Add project
        </AddBtn>
      </Card>

      <Card title="Certifications" defaultOpen={false}>
        <Area label="Certifications (one per line)" rows={3} value={data.certifications} onChange={(v) => set("certifications", v)} />
      </Card>
    </div>
  );
}
