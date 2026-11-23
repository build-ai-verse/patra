import { site } from "@/config/site";
import { templates } from "@/lib/templates";
import { FREE } from "@/lib/pricing";

export const faqs = [
  {
    q: `How much does it cost?`,
    a: FREE
      ? "Yes! To celebrate our launch, creating, previewing and downloading the watermark-free PDF are all free for a limited time (1 free PDF download per day). No subscription, no card needed."
      : `Creating and previewing is completely free. You pay only when you download the final, watermark-free PDF: ${templates.map((t) => `${t.name} ₹${t.priceInr}`).join(", ")}. No subscription, no hidden charges.`,
  },
  {
    q: "How will I receive my document?",
    a: "Right after a successful payment your PDF downloads instantly and a copy is also sent to the email address you enter at checkout, so you never lose it.",
  },
  {
    q: "Which payment methods are accepted?",
    a: "All payments are processed securely by Razorpay. You can pay using UPI (Google Pay, PhonePe, Paytm, BHIM), debit/credit cards, netbanking and popular wallets.",
  },
  {
    q: "Can I edit the biodata after downloading?",
    a: FREE
      ? "Yes. Your details are saved in your browser, so you can come back, make changes and download a new version anytime."
      : "Yes. Your details are saved in your browser, so you can come back, make changes and download a new version. Each new version of a document is a new paid download; re-downloading the exact same document is free.",
  },
  {
    q: "Is my personal information safe?",
    a: "Your form details stay in your own browser while you edit. We only process them to generate your PDF and email it to you. We do not sell or share your data. Payment details are handled entirely by Razorpay.",
  },
  {
    q: "Are the resumes ATS-friendly?",
    a: "Yes. Our PDFs contain real, selectable text (not images), so Applicant Tracking Systems used by recruiters can read them. The Classic Professional template is optimised for ATS.",
  },
  {
    q: "Can I add my photo and change colours?",
    a: "Absolutely. Upload a photo for your biodata or resume and choose from multiple colour themes for every template. The preview updates live as you type.",
  },
  {
    q: "What if my payment fails or money is deducted but I didn't get the PDF?",
    a: `Failed payments are automatically refunded by your bank/Razorpay within 5-7 working days. If money was deducted but you didn't receive your document, email ${site.supportEmail} with your payment ID and we'll send it to you.`,
  },
];
