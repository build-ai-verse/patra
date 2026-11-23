import type { BiodataData, BioLang } from "./templates";
import { autoTranslate } from "./translit";

/** Hindi (Devanagari) support for marriage biodata. */

const f = (id: string, label: string, value: string) => ({ id, label, value });

export const sampleBiodataHi: BiodataData = {
  lang: "hi",
  symbol: "ganesha",
  headerText: "॥ श्री गणेशाय नमः ॥",
  title: "जीवन परिचय",
  name: "प्रिया शर्मा",
  photo: null,
  sections: [
    {
      id: "personal",
      title: "व्यक्तिगत विवरण",
      fields: [
        f("p1", "जन्म तिथि", "14 मार्च 1997"),
        f("p2", "जन्म समय", "सुबह 06:45 बजे"),
        f("p3", "जन्म स्थान", "जयपुर, राजस्थान"),
        f("p4", "ऊंचाई", "5' 4\""),
        f("p5", "धर्म / जाति", "हिंदू, ब्राह्मण"),
        f("p6", "गोत्र", "भारद्वाज"),
        f("p7", "राशि / नक्षत्र", "वृषभ / रोहिणी"),
        f("p8", "मांगलिक", "नहीं"),
        f("p9", "शिक्षा", "एमबीए (फाइनेंस), एनएमआईएमएस मुंबई"),
        f("p10", "व्यवसाय", "सीनियर एनालिस्ट, इंफोसिस"),
        f("p11", "वार्षिक आय", "₹ 12 लाख"),
        f("p12", "शौक", "शास्त्रीय नृत्य, यात्रा, पढ़ना"),
      ],
    },
    {
      id: "family",
      title: "पारिवारिक विवरण",
      fields: [
        f("f1", "पिता का नाम", "श्री राजेश शर्मा (सेवानिवृत्त बैंक प्रबंधक)"),
        f("f2", "माता का नाम", "श्रीमती सुनीता शर्मा (गृहिणी)"),
        f("f3", "भाई-बहन", "1 बड़े भाई (विवाहित)"),
        f("f4", "परिवार", "एकल परिवार, पारंपरिक मूल्य"),
        f("f5", "मूल निवास", "अजमेर, राजस्थान"),
      ],
    },
    {
      id: "contact",
      title: "संपर्क विवरण",
      fields: [
        f("c1", "संपर्क व्यक्ति", "श्री राजेश शर्मा"),
        f("c2", "मोबाइल", "+91 98765 43210"),
        f("c3", "पता", "सी-24, वैशाली नगर, जयपुर - 302021"),
      ],
    },
  ],
};

/** English -> Hindi for labels, section titles, titles and blessing lines. */
export const EN_HI: Record<string, string> = {
  // Titles
  Biodata: "जीवन परिचय",
  "Marriage Biodata": "विवाह परिचय पत्र",
  // Sections
  "Personal Details": "व्यक्तिगत विवरण",
  "Family Details": "पारिवारिक विवरण",
  "Contact Details": "संपर्क विवरण",
  "Other Details": "अन्य विवरण",
  "Horoscope Details": "कुंडली विवरण",
  "Education & Career": "शिक्षा एवं करियर",
  // Labels
  "Full Name": "पूरा नाम",
  "Date of Birth": "जन्म तिथि",
  "Time of Birth": "जन्म समय",
  "Place of Birth": "जन्म स्थान",
  Age: "आयु",
  Height: "ऊंचाई",
  Weight: "वजन",
  Complexion: "रंग",
  "Blood Group": "रक्त समूह",
  Religion: "धर्म",
  Caste: "जाति",
  "Sub-caste": "उपजाति",
  "Religion / Caste": "धर्म / जाति",
  Gotra: "गोत्र",
  Rashi: "राशि",
  Nakshatra: "नक्षत्र",
  "Rashi / Nakshatra": "राशि / नक्षत्र",
  Manglik: "मांगलिक",
  "Mother Tongue": "मातृभाषा",
  Education: "शिक्षा",
  Occupation: "व्यवसाय",
  Company: "कंपनी",
  "Annual Income": "वार्षिक आय",
  Diet: "आहार",
  Hobbies: "शौक",
  "Marital Status": "वैवाहिक स्थिति",
  "Father's Name": "पिता का नाम",
  "Father's Occupation": "पिता का व्यवसाय",
  "Mother's Name": "माता का नाम",
  "Mother's Occupation": "माता का व्यवसाय",
  "Brother(s)": "भाई",
  "Sister(s)": "बहन",
  Siblings: "भाई-बहन",
  "Family Type": "परिवार",
  "Family Values": "पारिवारिक मूल्य",
  "Native Place": "मूल निवास",
  Residence: "निवास",
  "Contact Person": "संपर्क व्यक्ति",
  Mobile: "मोबाइल",
  Email: "ईमेल",
  Address: "पता",
  Expectations: "अपेक्षाएं",
  // Blessings
  "|| Shree Ganeshaya Namah ||": "॥ श्री गणेशाय नमः ॥",
  "|| Shree Lakshmi Ganeshaya Namah ||": "॥ श्री लक्ष्मी गणेशाय नमः ॥",
  "|| Jai Shree Radhe Krishna ||": "॥ जय श्री राधे कृष्ण ॥",
  "|| Om Namah Shivaya ||": "॥ ॐ नमः शिवाय ॥",
  "|| Om Namo Narayanaya ||": "॥ ॐ नमो नारायणाय ॥",
  "|| Jai Shree Krishna ||": "॥ जय श्री कृष्ण ॥",
  "|| Shree Ram ||": "॥ श्री राम ॥",
  "|| Jai Mata Di ||": "॥ जय माता दी ॥",
  "|| Waheguru Ji ||": "॥ वाहेगुरु जी ॥",
};

const HI_EN: Record<string, string> = {
  ...Object.fromEntries(Object.entries(EN_HI).map(([e, h]) => [h, e])),
  // Other common Hindi titles all map back to "Biodata".
  बायोडाटा: "Biodata",
  "परिचय पत्र": "Biodata",
  "विवाह बायोडाटा": "Marriage Biodata",
};

/** Title suggestions for the editor. */
export const TITLES = {
  en: ["Biodata", "Marriage Biodata", "Bio-Data"],
  hi: ["जीवन परिचय", "परिचय पत्र", "विवाह परिचय पत्र", "बायोडाटा"],
};

/** Hindi label suggestions for the editor's datalist. */
export const HI_LABELS = Array.from(
  new Set(Object.entries(EN_HI).filter(([e]) => !e.startsWith("||") && !/Details|Biodata|Career/.test(e)).map(([, h]) => h)),
);

export const toLang = (text: string, lang: BioLang) =>
  (lang === "hi" ? EN_HI[text.trim()] : HI_EN[text.trim()]) ?? text;

/**
 * Converts a biodata between English and Hindi: translates known labels, section titles,
 * the title and the blessing line from the dictionary; values still equal to the other
 * language's sample are swapped for the target-language sample; everything else the user
 * typed is auto-translated/transliterated offline (see translit.ts).
 */
export function convertBiodata(data: BiodataData, lang: BioLang, sampleEn: BiodataData): BiodataData {
  const from = lang === "hi" ? sampleEn : sampleBiodataHi;
  const to = lang === "hi" ? sampleBiodataHi : sampleEn;
  const sampleValue = (sid: string, fid: string, v: string) => {
    const a = from.sections.find((s) => s.id === sid)?.fields.find((x) => x.id === fid);
    const b = to.sections.find((s) => s.id === sid)?.fields.find((x) => x.id === fid);
    return a && b && a.value === v ? b.value : v;
  };
  const t = (text: string) => autoTranslate(toLang(text, lang), lang);
  return {
    ...data,
    lang,
    title: t(data.title),
    headerText: t(data.headerText),
    name: data.name === from.name ? to.name : t(data.name),
    sections: data.sections.map((s) => ({
      ...s,
      title: t(s.title),
      fields: s.fields.map((x) => ({ ...x, label: t(x.label), value: autoTranslate(sampleValue(s.id, x.id, x.value), lang) })),
    })),
  };
}

