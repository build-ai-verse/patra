import type { Metadata } from "next";
import Link from "next/link";
import { templates } from "@/lib/templates";
import { getTemplate, minPrice } from "@/lib/templates";
import { TemplateCard } from "@/components/site/TemplateCard";
import { JsonLd } from "@/components/site/JsonLd";
import { Icon, icons } from "@/components/site/Sections";
import { brandFull } from "@/config/site";
import { FREE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: `हिंदी बायोडाटा फॉर्मेट - शादी के लिए बायोडाटा बनाएं (${FREE ? "PDF बिल्कुल मुफ्त" : `PDF सिर्फ ₹${minPrice("biodata")} से`})`,
  description: `शादी के लिए सुंदर हिंदी बायोडाटा ऑनलाइन बनाएं। श्री गणेश, राधा कृष्ण, शिव पार्वती चिन्ह, फोटो और रंग चुनें। फ्री प्रीव्यू, प्रिंट-रेडी PDF ${FREE ? "लॉन्च ऑफर में मुफ्त" : `सिर्फ ₹${minPrice("biodata")} से शुरू`}।`,
  alternates: { canonical: "/marriage-biodata-hindi", languages: { "en-IN": "/marriage-biodata", "hi-IN": "/marriage-biodata-hindi" } },
  keywords: [
    "hindi biodata",
    "marriage biodata in hindi",
    "biodata format in hindi",
    "हिंदी बायोडाटा",
    "शादी के लिए बायोडाटा",
    "विवाह बायोडाटा",
    "बायोडाटा फॉर्मेट",
  ],
  openGraph: { locale: "hi_IN", title: "हिंदी में शादी का बायोडाटा बनाएं", url: "/marriage-biodata-hindi" },
};

const faqs = [
  {
    q: "क्या मैं पूरा बायोडाटा हिंदी में बना सकता/सकती हूं?",
    a: "हां। संपादक में “हिन्दी” चुनें, सभी लेबल, शीर्षक और मंगल पंक्ति हिंदी में हो जाएंगे। विवरण हिंदी या अंग्रेज़ी, किसी में भी लिखें। PDF में हिंदी अक्षर बिल्कुल सही छपते हैं।",
  },
  {
    q: "बायोडाटा की कीमत कितनी है?",
    a: FREE
      ? "हाँ। लॉन्च ऑफर में बायोडाटा बनाना, प्रीव्यू देखना और वॉटरमार्क-रहित PDF डाउनलोड करना, सब मुफ्त है।"
      : `बायोडाटा बनाना और प्रीव्यू देखना बिल्कुल मुफ्त है। वॉटरमार्क-रहित PDF डाउनलोड करने के लिए रॉयल हेरिटेज ₹${getTemplate("biodata-royal")!.priceInr} और लोटस मॉडर्न ₹${getTemplate("biodata-lotus")!.priceInr} लगते हैं।`,
  },
  {
    q: "PDF मुझे कैसे मिलेगी?",
    a: "पेमेंट होते ही PDF तुरंत डाउनलोड हो जाती है और उसकी एक कॉपी आपके ईमेल पर भी भेज दी जाती है।",
  },
  {
    q: "पेमेंट कैसे कर सकते हैं?",
    a: "Razorpay द्वारा सुरक्षित पेमेंट: UPI (Google Pay, PhonePe, Paytm), डेबिट/क्रेडिट कार्ड, नेटबैंकिंग और वॉलेट।",
  },
  {
    q: "क्या भगवान का चिन्ह जोड़ सकते हैं?",
    a: "हां। श्री गणेश, लक्ष्मी गणेश, राधा कृष्ण, शिव पार्वती या विष्णु लक्ष्मी का चिन्ह चुनें, मंगल पंक्ति अपने-आप जुड़ जाएगी।",
  },
];

const steps = [
  { icon: icons.edit, title: "डिज़ाइन चुनें और भरें", text: "टेम्पलेट चुनें, अपनी जानकारी भरें, फोटो और रंग चुनें।" },
  { icon: icons.eye, title: "मुफ्त प्रीव्यू", text: "टाइप करते ही बायोडाटा का लाइव प्रीव्यू देखें।" },
  FREE
    ? { icon: icons.download, title: "मुफ्त डाउनलोड", text: "लॉन्च ऑफर: PDF तुरंत और ईमेल पर, बिल्कुल मुफ्त।" }
    : { icon: icons.download, title: `₹${minPrice("biodata")} से डाउनलोड`, text: "UPI से पेमेंट करें, PDF तुरंत और ईमेल पर पाएं।" },
];

export default function HindiBiodataPage() {
  const list = templates.filter((t) => t.kind === "biodata");
  return (
    <div lang="hi">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "hi-IN",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <section className="relative overflow-hidden">
        <div className="bg-mandala absolute inset-0" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-marigold-300/40 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-14 text-center sm:px-6 md:pt-20">
          <p className="text-sm font-semibold text-marigold-600">॥ शुभ विवाह ॥</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-snug sm:text-5xl">
            शादी के लिए <span className="text-gradient">सुंदर जीवन परिचय</span> (हिंदी बायोडाटा), सिर्फ 5 मिनट में
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            पारंपरिक और आधुनिक डिज़ाइन, भगवान के शुभ चिन्ह, फोटो और मनपसंद रंग। मुफ्त प्रीव्यू देखें और प्रिंट-रेडी PDF{" "}
            {FREE ? "लॉन्च ऑफर में बिल्कुल मुफ्त" : `सिर्फ ₹${minPrice("biodata")} से`} पाएं।
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/create/biodata-royal?lang=hi" className="btn-primary px-7 py-3.5 text-base">
              हिंदी बायोडाटा बनाएं
            </Link>
            <Link href="/marriage-biodata" className="btn-ghost px-7 py-3.5 text-base" lang="en">
              English Biodata
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-2 sm:px-6">
          {list.map((t) => (
            <TemplateCard key={t.id} t={t} lang="hi" />
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold">3 आसान चरण</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="relative rounded-3xl border border-cream-200 bg-white p-7 shadow-sm">
                <span className="absolute right-6 top-5 font-display text-5xl font-bold text-brand-50">{i + 1}</span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white">
                  <Icon d={s.icon} />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-8">
        <article className="prose-patra mx-auto max-w-3xl px-4 sm:px-6">
          <h2>शादी के जीवन परिचय (बायोडाटा) में क्या लिखें?</h2>
          <p>
            विवाह बायोडाटा दो परिवारों के बीच पहला परिचय होता है। साफ-सुथरा और सुंदर बायोडाटा अच्छा प्रभाव छोड़ता है। {brandFull} के
            डिज़ाइन उसी फॉर्मेट में हैं जिसकी परिवार उम्मीद करते हैं।
          </p>
          <h3>1. व्यक्तिगत विवरण</h3>
          <ul>
            <li>नाम, जन्म तिथि, जन्म समय और जन्म स्थान</li>
            <li>ऊंचाई, रंग, रक्त समूह (वैकल्पिक)</li>
            <li>धर्म, जाति, गोत्र, मातृभाषा</li>
            <li>राशि, नक्षत्र और मांगलिक स्थिति (यदि कुंडली मिलान करते हैं)</li>
            <li>शिक्षा, व्यवसाय और वार्षिक आय</li>
          </ul>
          <h3>2. पारिवारिक विवरण</h3>
          <ul>
            <li>पिता और माता का नाम व व्यवसाय</li>
            <li>भाई-बहन (विवाहित / अविवाहित)</li>
            <li>परिवार का प्रकार, पारिवारिक मूल्य और मूल निवास</li>
          </ul>
          <h3>3. संपर्क विवरण</h3>
          <p>संपर्क व्यक्ति का नाम, मोबाइल नंबर और पता लिखें।</p>
          <h2>अच्छे बायोडाटा के लिए सुझाव</h2>
          <ol>
            <li><strong>हाल की साफ फोटो</strong> लगाएं: सामने से, अच्छी रोशनी में।</li>
            <li><strong>सच्ची और संक्षिप्त जानकारी</strong> दें।</li>
            <li><strong>एक पेज</strong> में रखें: हमारे दोनों डिज़ाइन एक A4 पेज में आते हैं।</li>
            <li>नाम, तारीख और फोन नंबर की <strong>वर्तनी दोबारा जांचें</strong>।</li>
          </ol>
        </article>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold">अक्सर पूछे जाने वाले प्रश्न</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-cream-200 bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-14 text-center text-white">
          <div className="bg-mandala absolute inset-0 opacity-25" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">आज ही अपना हिंदी बायोडाटा बनाएं</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/75">सुंदर डिज़ाइन, शुभ चिन्ह, और PDF {FREE ? "बिल्कुल मुफ्त" : `सिर्फ ₹${minPrice("biodata")} से`}।</p>
            <Link href="/create/biodata-royal?lang=hi" className="btn-gold mt-8 px-7 py-3 text-base">
              अभी शुरू करें
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
