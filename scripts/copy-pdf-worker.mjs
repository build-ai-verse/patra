// Copies the PDF.js worker into /public so the browser can load it (keeps versions in sync).
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
const src = "node_modules/pdfjs-dist/build/pdf.worker.min.mjs";
if (existsSync(src)) {
  mkdirSync("public", { recursive: true });
  copyFileSync(src, "public/pdf.worker.min.mjs");
  console.log("Copied PDF.js worker to public/");
}
