import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { brandFull, features, site } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        {brandFull}, operated by {site.legalName}, respects your privacy. This policy explains what we collect and how we use it.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Document details</strong> you type into a template (and an optional photo). While editing, these are stored only in
          your own browser (local storage).
        </li>
        <li>
          <strong>Checkout details</strong>: your name, email address and (optionally) mobile number.
        </li>
        <li>
          <strong>Payment information</strong> is collected and processed directly by Razorpay. We receive only the transaction
          reference, amount, status and payment method, never your full card or bank details.
        </li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To generate your PDF and email it to you.</li>
        <li>To keep a record of the transaction (we receive a copy of the delivery email for support and accounting).</li>
        <li>To respond to support requests.</li>
      </ul>
      <p>We do not sell, rent or share your personal information with third parties for marketing.</p>
      {features.aiAutofill ? (
        <>
          <h2>AI auto-fill and ATS checker</h2>
          <p>
            The ATS resume checker runs entirely in your browser; your resume is not uploaded. If you choose{" "}
            <strong>AI auto-fill</strong> in the resume builder, the text you provide is sent to our AI provider, Anthropic, solely
            to fill in your resume fields. It is not used to train AI models and we do not store it.
          </p>
        </>
      ) : (
        <>
          <h2>ATS checker and language conversion</h2>
          <p>
            The ATS resume checker and the English/Hindi biodata conversion run entirely in your browser; this content is not
            uploaded to our servers.
          </p>
        </>
      )}
      <h2>Service providers</h2>
      <p>
        We use Razorpay (payments){features.aiAutofill ? ", Anthropic (AI auto-fill, only when you use it)" : ""}, an email
        delivery provider (sending your PDF), Google Drive (secure storage of order copies), Vercel (hosting) and Vercel Web
        Analytics, which counts page visits anonymously without cookies or personal identifiers.
      </p>
      <h2>Retention</h2>
      <p>
        Document details are processed in memory to create the PDF and are not stored in a database. A copy of each purchased PDF
        and the transaction emails are kept in our private business storage (email and Google Drive) for customer support,
        re-delivery, accounting and legal compliance.
      </p>
      <h2>Your choices</h2>
      <p>
        You can clear your saved draft anytime by clearing your browser&apos;s site data. To request deletion of transaction emails
        that contain your information, write to <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
