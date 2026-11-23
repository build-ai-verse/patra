# Patra™: Marriage Biodata & Resume Maker

> Beautiful Shaadi biodata & ATS-friendly resumes. Preview free, download a print-ready PDF from **₹10** (Royal ₹10 · Lotus ₹20 · Classic resume ₹50 · Modern resume ₹100).
> Powered by **Thakur Ventures** · `patra.build-ai-version.com`

> **License: proprietary, all rights reserved.** This code is public for viewing only. You may not copy, modify,
> run, deploy or redistribute it, or reuse any part of it, without written permission. See [LICENSE](LICENSE).

Built with **Next.js 16 (App Router, Cache Components)**, **Tailwind CSS v4**, **@react-pdf/renderer**, **Razorpay** and **Nodemailer**.

---

## Features

- **Per-template pricing** (set in `src/lib/templates.ts`, charged server-side): Royal Heritage ₹10 · Lotus Modern ₹20 · Classic Professional resume ₹50 · Modern Sidebar resume ₹100
- **Free ATS resume checker** (`/ats-checker`): upload PDF/DOCX/TXT or paste text, optional job description → score /100, keyword match, fix-it tips. Runs fully in the browser (PDF.js + mammoth); also shown live inside the resume editor
- **AI auto-fill** in the resume maker: paste an old resume / LinkedIn profile / notes or upload a file → Claude (Opus 5.5, structured outputs) fills every field; optional "polish wording"; one-click undo. ATS checker → "Import with AI" hands the text over
- **Hindi (हिन्दी) biodata**: one-click English ↔ Hindi switch (labels, headings, blessing line), Hindi sample, Devanagari fonts in PDF & preview (Hind + Martel), Hindi landing page `/marriage-biodata-hindi`, `?lang=hi` deep links
- Divine symbols for biodata: Shree Ganesh, Lakshmi Ganesh, Radha Krishna, Shiv Parvati, Vishnu Lakshmi (vector art, auto-matching blessing line)
- 4 templates: **Royal Heritage** & **Lotus Modern** (biodata), **Classic Professional** & **Modern Sidebar** (resume), each with 5 colour themes
- Live, watermarked preview that matches the PDF exactly: every template is written **once** against shared primitives and rendered to both HTML (preview) and PDF (download)
- Real-text vector PDFs (ATS-friendly), A4, embedded fonts
- Photo upload (auto-resized in the browser), add/remove/reorder fields & sections
- Drafts auto-saved in the browser; **free re-download** of a document that has already been paid for
- Razorpay checkout (UPI, cards, netbanking, wallets); server-side signature + amount + capture verification
- **Payment ↔ document binding**: a SHA-256 hash of the document is stored on the Razorpay order, so one payment unlocks exactly one document version (no database needed)
- PDF emailed to the **customer**, plus a **copy to you** with full transaction details (payment ID, order ID, method, amount, IST time, customer name/email/phone)
- Optional Razorpay webhook → admin email for every captured / failed payment (backup record)
- SEO: per-page metadata, OpenGraph image, sitemap, robots, web manifest, JSON-LD (Organization, Product/Offer, FAQPage, Breadcrumb), keyword-rich landing pages `/marriage-biodata` and `/resume-maker`
- Mobile-first: edit/preview tabs and a sticky download bar on phones
- Razorpay-required pages: Contact, Terms, Privacy, Refund & Cancellation, Shipping/Delivery

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in values (see below)
npm run dev                  # http://localhost:3000
```

Dev-only helper: `GET /api/sample?t=biodata-royal&lang=hi&symbol=ganesha` renders a template with sample data as a PDF (disabled in production).

## Details needed for the Razorpay integration

Please provide / configure the following:

| # | What | Where to get it | Env var |
|---|------|-----------------|---------|
| 1 | **Key ID** (test first, then live) | Razorpay Dashboard → Account & Settings → API Keys | `RAZORPAY_KEY_ID` |
| 2 | **Key Secret** | Same screen (shown once; regenerate if lost) | `RAZORPAY_KEY_SECRET` |
| 3 | **Webhook secret** (optional, recommended) | Dashboard → Webhooks → Add: URL `https://patra.build-ai-version.com/api/webhook`, events `payment.captured`, `payment.failed` | `RAZORPAY_WEBHOOK_SECRET` |
| 4 | **Website URL for activation** | Add `https://patra.build-ai-version.com` in Dashboard → Account & Settings → Website/App details | n/a |
| 5 | **Business details for policy pages** | Registered business name & address, support phone | `NEXT_PUBLIC_BUSINESS_ADDRESS`, `NEXT_PUBLIC_SUPPORT_PHONE` |
| 6 | **Support email** | Your support inbox | `NEXT_PUBLIC_SUPPORT_EMAIL` |

**AI auto-fill (resume maker):** create an API key at console.anthropic.com → `ANTHROPIC_API_KEY`. Without it the rest of the site works and the AI button shows "not configured".
| 7 | **Auto-capture** | Dashboard → Account & Settings → Payment Capture → *Automatic* (the app also captures `authorized` payments itself) | n/a |

**Email (SMTP)** for sending the PDF:

| What | Env var |
|------|---------|
| SMTP host / port | `SMTP_HOST`, `SMTP_PORT` (465 = SSL) |
| SMTP username / password (Gmail: App Password) | `SMTP_USER`, `SMTP_PASS` |
| "From" name & address | `MAIL_FROM` |
| **Your email** that receives a copy of every sale | `ADMIN_EMAIL` |

> Tip: for deliverability, send from an address on your own domain (e.g. `hello@build-ai-version.com`) and add the SPF/DKIM records your mail provider gives you.

### Test the payment flow

1. Use `rzp_test_…` keys. Open a template → **Download PDF · ₹10** (Royal Heritage).
2. In Razorpay test mode pay with UPI ID `success@razorpay`, or test card `4111 1111 1111 1111` (any future expiry, any CVV).
3. The PDF downloads, the customer email + admin copy arrive, and the payment appears in the dashboard with notes (template, customer, document hash).

## Payment flow

```
Browser                         Next.js API                       Razorpay
  │ fill form, preview (free)       │                                 │
  │ hash = sha256(document JSON)    │                                 │
  │── POST /api/order {hash,…} ────▶│── create order (template price, notes) ───▶│
  │◀──────────── orderId, keyId ────│                                 │
  │── Razorpay Checkout (UPI/card) ─────────────────────────────────▶│
  │◀──── payment_id, order_id, signature ────────────────────────────│
  │── POST /api/verify {ids, signature, document} ─▶│                 │
  │                                 │ verify HMAC signature           │
  │                                 │── fetch order + payment ───────▶│
  │                                 │ check amount, captured, hash    │
  │                                 │ render PDF (react-pdf)          │
  │                                 │ email customer + admin copy     │
  │◀────────────── PDF (download) ──│                                 │
```

## Deploying on the sub-domain

**Vercel (simplest):** import the repo → add env vars → Settings → Domains → add `patra.build-ai-version.com`; at your DNS provider create `CNAME patra → cname.vercel-dns.com`.

**VPS / Docker:** `npm run build && npm start` (Node 20.9+) behind Nginx with a `patra` A/CNAME record and HTTPS (certbot). `crypto.subtle` requires HTTPS in production.

## Branding

Brand name, trademark symbol (`™` → change to `®` once registered), price, domain and "Powered by" text all live in [`src/config/site.ts`](src/config/site.ts). Logo: [`src/components/site/Logo.tsx`](src/components/site/Logo.tsx) and [`src/app/icon.svg`](src/app/icon.svg).

## Project structure

```
src/
  app/                    pages, API routes, SEO files (sitemap, robots, OG image, manifest)
    api/order|verify|webhook|sample
    create/[templateId]   editor
  components/
    templates/            ⭐ document designs, written once → HTML preview + PDF
    editor/               forms, photo input, checkout dialog, Razorpay client
    preview/              scaled live preview with watermark
    site/                 header, footer, logo, landing sections
  lib/
    pdf/render.tsx        react-pdf renderer (fonts, line-height fix, tree expansion)
    razorpay.ts mailer.ts normalize.ts templates.ts defaults.ts
  config/site.ts          brand / price / contact config
assets/fonts/             PDF fonts (Poppins, Playfair Display, Cormorant Garamond, Hind, Martel - OFL)
promo-video/              Instagram Reel (Remotion) - see promo-video/README.md
```

## Adding a new template

1. Add an entry to `templates` in `src/lib/templates.ts`.
2. Create `src/components/templates/MyTemplate.tsx` using the `P.*` primitives (see rules at the top of `prims.ts`; units are A4 points, 595×842).
3. Register it in `src/components/templates/index.tsx`. It is now available in the gallery, editor, preview and PDF.

## AI auto-fill: cost & safety

- Model `claude-opus-5-5` with structured outputs (`/api/autofill`), server-side refusal fallback enabled (`fallbacks: "default"`).
- Typical call: about 3-8K input + 2-4K output tokens, roughly **US$0.05-0.12 (₹4-10) per auto-fill**. The feature is free for users, so watch usage in the Anthropic Console.
- Guards: 40-20,000 characters per request (longer text is rejected, not truncated), best-effort limit of 8 requests / 10 min per IP (per server instance; use a shared store such as Upstash/Redis if you run several instances).
- The prompt forbids inventing facts; source text is treated as data, not instructions.

## Notes & limitations

- Resume PDFs avoid letter-spacing and hyphenate only words longer than 16 characters (never URLs/emails), so ATS parsers read headings and keywords cleanly. Both resume templates score 92/100 on our checker with the sample data (only "length" flagged).
- The ATS score is a heuristic estimate, not a guarantee from any specific ATS vendor.
- PDFs support English and Devanagari (Hindi/Marathi) text; Latin fonts automatically fall back to Hind / Martel for Devanagari characters. Other Indian scripts (Tamil, Bengali, Gujarati…) would need their own fonts.
- No database: drafts live in the browser, sales records live in Razorpay + your admin inbox.

## License

Copyright © 2026 Thakur Ventures. All rights reserved.

This repository is **source-available, not open source**. It is visible for reference only; no permission is
granted to copy, modify, run, deploy, distribute or reuse the code, templates or designs, in whole or in part.
"Patra", the logo and template designs are brand assets and are not licensed. See [LICENSE](LICENSE) for the
full terms. For permission requests, contact support@build-ai-version.com.
