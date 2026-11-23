import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { brandFull, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${site.name} for help with your marriage biodata or resume download.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact Us">
      <p>
        We&apos;re happy to help with anything related to your {brandFull} documents, payments or downloads. We usually reply
        within 24 hours (Monday to Saturday).
      </p>
      <h2>Support</h2>
      <ul>
        <li>
          Email: <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
        </li>
        {site.supportPhone ? <li>Phone: {site.supportPhone}</li> : null}
        <li>Website: {site.url}</li>
      </ul>
      <h2>Business details</h2>
      <p>
        {brandFull} is a product of <strong>{site.legalName}</strong>.
        <br />
        {site.businessAddress}
      </p>
      <h2>Payment issues</h2>
      <p>
        If money was debited but you didn&apos;t receive your PDF, email us your <strong>Razorpay Payment ID</strong> (starts with
        &quot;pay_&quot;) and the email address used at checkout. We&apos;ll resend your document or process a refund.
      </p>
    </LegalPage>
  );
}
