import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Refund & Cancellation Policy", alternates: { canonical: "/refund-policy" } };

export default function RefundPage() {
  return (
    <LegalPage title="Refund & Cancellation Policy">
      <p>
        Because our documents are digital products delivered instantly, and you can preview the full document for free before paying,
        purchases are generally non-refundable once the PDF has been delivered.
      </p>
      <h2>When we will refund</h2>
      <ul>
        <li>You were charged but did not receive your document and we are unable to deliver it.</li>
        <li>You were charged more than once for the same document.</li>
        <li>The downloaded PDF is corrupted or materially different from the preview and we cannot fix it.</li>
      </ul>
      <h2>How to request</h2>
      <p>
        Email <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> within 7 days of purchase with your Razorpay Payment ID.
        Approved refunds are processed to the original payment method within 5-7 working days.
      </p>
      <h2>Failed payments</h2>
      <p>
        If your payment failed but money was debited, it is automatically reversed by your bank / Razorpay, usually within 5-7 working
        days.
      </p>
      <h2>Cancellation</h2>
      <p>As delivery is instant, orders cannot be cancelled after successful payment.</p>
    </LegalPage>
  );
}
