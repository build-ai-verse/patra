import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/LegalPage";
import { brandFull, site } from "@/config/site";
import { templates } from "@/lib/templates";
import { FREE } from "@/lib/pricing";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>
        These terms govern your use of {brandFull} ({site.url}), operated by {site.legalName} (&quot;we&quot;, &quot;us&quot;).
        By using the website you agree to these terms.
      </p>
      <h2>1. Service</h2>
      <p>
        {brandFull} lets you create marriage biodata and resume documents online using our templates. Creating and previewing is
        free.{" "}
        {FREE ? (
          <>
            During our launch offer, document downloads are also free. When the offer ends, a fee will be charged per document
            download, inclusive of applicable taxes ({templates.map((t) => `${t.name} ₹${t.priceInr}`).join(", ")}), and the price
            will always be shown before you pay.
          </>
        ) : (
          <>
            A fee is charged per document download, inclusive of applicable taxes:{" "}
            {templates.map((t) => `${t.name} ₹${t.priceInr}`).join(", ")}. The price is shown before you pay.
          </>
        )}
      </p>
      <h2>2. Your content</h2>
      <p>
        You are responsible for the accuracy and legality of the information you enter. Do not upload content you don&apos;t have
        the right to use, or content that is unlawful, misleading or offensive. You retain all rights to your content.
      </p>
      <h2>3. Payments</h2>
      <p>
        Payments are processed securely by Razorpay. We do not store your card, UPI or bank details. A payment unlocks the download
        of the specific document version you paid for; editing the document creates a new version that requires a new payment.
      </p>
      <h2>4. Delivery</h2>
      <p>
        Documents are delivered digitally: an instant download and a copy to the email you provide. See our{" "}
        <Link href="/shipping-policy">Delivery Policy</Link>.
      </p>
      <h2>5. Refunds</h2>
      <p>
        Please see our <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>.
      </p>
      <h2>6. Intellectual property</h2>
      <p>
        The templates, designs, brand name {site.name}, logo and website content are owned by {site.legalName}. You may use your
        downloaded documents for personal purposes. You may not resell or redistribute our templates.
      </p>
      <h2>7. Limitation of liability</h2>
      <p>
        The service is provided &quot;as is&quot;. To the maximum extent permitted by law, our total liability for any claim is
        limited to the amount you paid for the document concerned.
      </p>
      <h2>8. Governing law</h2>
      <p>These terms are governed by the laws of India. Courts at our registered place of business shall have jurisdiction.</p>
      <h2>9. Contact</h2>
      <p>
        Questions? Write to <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
