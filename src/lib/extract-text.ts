"use client";

/**
 * Extracts plain text from a resume file in the browser (PDF, DOCX, TXT).
 * Nothing is uploaded; heavy libraries are loaded on demand.
 */

export const ACCEPTED_RESUME_TYPES =
  ".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

const MAX_BYTES = 10 * 1024 * 1024;

async function pdfToText(buf: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const task = pdfjs.getDocument({ data: new Uint8Array(buf) });
  const doc = await task.promise;
  const pages: string[] = [];
  for (let i = 1; i <= Math.min(doc.numPages, 10); i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let out = "";
    for (const item of content.items) {
      if (!("str" in item)) continue;
      out += item.str;
      out += item.hasEOL ? "\n" : item.str && !item.str.endsWith(" ") ? " " : "";
    }
    pages.push(out);
  }
  await task.destroy();
  return pages.join("\n");
}

async function docxToText(buf: ArrayBuffer): Promise<string> {
  const mammoth = await import("mammoth");
  const { value } = await mammoth.extractRawText({ arrayBuffer: buf });
  return value;
}

export async function extractResumeText(file: File): Promise<string> {
  if (file.size > MAX_BYTES) throw new Error("Please choose a file under 10 MB.");
  const name = file.name.toLowerCase();
  const buf = await file.arrayBuffer();
  let text: string;
  if (file.type === "application/pdf" || name.endsWith(".pdf")) text = await pdfToText(buf);
  else if (name.endsWith(".docx")) text = await docxToText(buf);
  else if (file.type.startsWith("text/") || name.endsWith(".txt")) text = new TextDecoder().decode(buf);
  else throw new Error("Unsupported file. Upload a PDF, DOCX or TXT resume.");
  // Normalise whitespace but keep line breaks (they carry section structure).
  return text
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
