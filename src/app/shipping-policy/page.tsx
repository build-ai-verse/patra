import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Delivery Policy", alternates: { canonical: "/shipping-policy" } };

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping & Delivery Policy">
      <p>{site.name} sells digital documents only. No physical products are shipped.</p>
      <h2>Delivery</h2>
      <ul>
        <li>Your PDF downloads instantly in your browser after successful payment.</li>
        <li>A copy is emailed to the address entered at checkout, usually within a few minutes.</li>
        <li>Delivery is available across India and worldwide.</li>
      </ul>
      <h2>Didn&apos;t receive it?</h2>
      <p>
        Check your spam / promotions folder. If you still can&apos;t find it, email{" "}
        <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> with your Payment ID and we&apos;ll resend it within 24 hours.
      </p>
    </LegalPage>
  );
}
