import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Hind, Martel, Playfair_Display, Poppins } from "next/font/google";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { brandFull, site } from "@/config/site";
import { minPrice } from "@/lib/templates";
import "./globals.css";
import { FREE, fromPrice } from "@/lib/pricing";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Devanagari fonts for Hindi biodata (match the PDF renderer's fallbacks).
const hind = Hind({
  variable: "--font-hind",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});
const martel = Martel({
  variable: "--font-martel",
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} - Marriage Biodata & Resume Maker | PDF ${fromPrice()}`,
    template: `%s | ${brandFull}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  authors: [{ name: site.poweredBy }],
  creator: site.poweredBy,
  publisher: site.poweredBy,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: brandFull,
    title: `${site.name} - Beautiful Marriage Biodata & Resumes${FREE ? ", Free" : ` from ₹${minPrice()}`}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} - Marriage Biodata & Resume Maker`,
    description: site.description,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
  category: "productivity",
};

export const viewport: Viewport = {
  themeColor: "#7A1C3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${poppins.variable} ${playfair.variable} ${cormorant.variable} ${hind.variable} ${martel.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: brandFull,
              url: site.url,
              logo: `${site.url}/icon.svg`,
              email: site.supportEmail,
              parentOrganization: { "@type": "Organization", name: site.poweredBy },
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: site.name,
              url: site.url,
              inLanguage: "en-IN",
            },
          ]}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
