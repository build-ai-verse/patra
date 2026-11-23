import type { DocumentPayload } from "@/lib/templates";
import type { Prims } from "./prims";
import { BiodataLotus } from "./BiodataLotus";
import { BiodataRoyal } from "./BiodataRoyal";
import { ResumeClassic } from "./ResumeClassic";
import { ResumeModern } from "./ResumeModern";

/** Renders any document with the given primitives (HTML or PDF). */
export function RenderDocument({ doc, P }: { doc: DocumentPayload; P: Prims }) {
  switch (doc.templateId) {
    case "biodata-royal":
      return <BiodataRoyal doc={doc} P={P} />;
    case "biodata-lotus":
      return <BiodataLotus doc={doc} P={P} />;
    case "resume-classic":
      return <ResumeClassic doc={doc} P={P} />;
    case "resume-modern":
      return <ResumeModern doc={doc} P={P} />;
  }
}
