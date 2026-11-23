import type { BioLang } from "./templates";

/**
 * Free, offline English <-> Hindi conversion for biodata details.
 * 1. Whole-phrase and word dictionary for common biodata words.
 * 2. Rule-based phonetic transliteration for everything else (names, places).
 * No network calls, no API cost. Results are good for names and common terms;
 * users should still review spellings.
 */

/* ---------- Dictionary: [English, Hindi]. Earlier entries win for Hindi -> English. ---------- */

const PHRASES: [string, string][] = [
  ["Not Manglik", "मांगलिक नहीं"],
  ["Non Manglik", "मांगलिक नहीं"],
  ["Non-Manglik", "मांगलिक नहीं"],
  ["Anshik Manglik", "आंशिक मांगलिक"],
  ["Partial Manglik", "आंशिक मांगलिक"],
  ["Post Graduate", "स्नातकोत्तर"],
  ["Never Married", "अविवाहित"],
  ["Nuclear Family", "एकल परिवार"],
  ["Joint Family", "संयुक्त परिवार"],
  ["Self Employed", "स्वरोजगार"],
  ["Self-Employed", "स्वरोजगार"],
  ["Government Job", "सरकारी नौकरी"],
  ["Private Job", "निजी नौकरी"],
  ["Own Business", "स्वयं का व्यवसाय"],
  ["Family Business", "पारिवारिक व्यवसाय"],
  ["Per Annum", "प्रति वर्ष"],
  ["Maternal Uncle", "मामा"],
  ["Paternal Uncle", "चाचा"],
];

const WORDS: [string, string][] = [
  // Answers & status
  ["Yes", "हाँ"], ["No", "नहीं"], ["None", "कोई नहीं"], ["Retired", "सेवानिवृत्त"], ["Housewife", "गृहिणी"],
  ["Homemaker", "गृहिणी"], ["Married", "विवाहित"], ["Unmarried", "अविवाहित"], ["Single", "अविवाहित"],
  ["Divorced", "तलाकशुदा"], ["Widow", "विधवा"], ["Widower", "विधुर"], ["Late", "स्वर्गीय"],
  // Family
  ["Father", "पिता"], ["Mother", "माता"], ["Brother", "भाई"], ["Brothers", "भाई"], ["Sister", "बहन"],
  ["Sisters", "बहनें"], ["Elder", "बड़े"], ["Younger", "छोटे"], ["Son", "पुत्र"], ["Daughter", "पुत्री"],
  ["Grandfather", "दादा"], ["Grandmother", "दादी"], ["Uncle", "चाचा"], ["Aunt", "चाची"], ["Family", "परिवार"],
  ["Nuclear", "एकल"], ["Joint", "संयुक्त"], ["Traditional", "पारंपरिक"], ["Moderate", "मध्यम"],
  ["Liberal", "उदार"], ["Orthodox", "रूढ़िवादी"], ["Values", "मूल्य"], ["And", "और"], ["With", "के साथ"],
  // Titles
  ["Shri", "श्री"], ["Shree", "श्री"], ["Sh", "श्री"], ["Mr", "श्री"], ["Smt", "श्रीमती"], ["Mrs", "श्रीमती"],
  ["Ms", "सुश्री"], ["Dr", "डॉ"], ["Er", "इं"],
  // Religion, caste, diet, looks
  ["Hindu", "हिंदू"], ["Muslim", "मुस्लिम"], ["Sikh", "सिख"], ["Jain", "जैन"], ["Christian", "ईसाई"],
  ["Buddhist", "बौद्ध"], ["Brahmin", "ब्राह्मण"], ["Rajput", "राजपूत"], ["Kshatriya", "क्षत्रिय"],
  ["Vaishya", "वैश्य"], ["Baniya", "बनिया"], ["Kayastha", "कायस्थ"], ["Jat", "जाट"],
  ["Vegetarian", "शाकाहारी"], ["Non-Vegetarian", "मांसाहारी"], ["Eggetarian", "अंडाहारी"], ["Vegan", "वीगन"],
  ["Fair", "गोरा"], ["Wheatish", "गेहुँआ"], ["Dusky", "सांवला"], ["Dark", "सांवला"], ["Hindi", "हिंदी"],
  ["English", "अंग्रेज़ी"], ["Manglik", "मांगलिक"], ["Anshik", "आंशिक"], ["Bismillah", "बिस्मिल्लाह"],
  ["Waheguru", "वाहेगुरु"], ["Ji", "जी"],
  // Money, time, units
  ["Lakh", "लाख"], ["Lakhs", "लाख"], ["LPA", "लाख प्रति वर्ष"], ["Crore", "करोड़"], ["Per", "प्रति"],
  ["Annum", "वर्ष"], ["Year", "वर्ष"], ["Years", "वर्ष"], ["Month", "माह"], ["Monthly", "मासिक"],
  ["AM", "पूर्वाह्न"], ["PM", "अपराह्न"], ["Morning", "सुबह"], ["Evening", "शाम"], ["Night", "रात"],
  ["Afternoon", "दोपहर"], ["Cm", "सेमी"], ["Kg", "किलो"], ["Feet", "फ़ीट"], ["Ft", "फ़ीट"], ["Inches", "इंच"],
  ["Inch", "इंच"],
  ["January", "जनवरी"], ["February", "फ़रवरी"], ["March", "मार्च"], ["April", "अप्रैल"], ["May", "मई"],
  ["June", "जून"], ["July", "जुलाई"], ["August", "अगस्त"], ["September", "सितंबर"], ["October", "अक्टूबर"],
  ["November", "नवंबर"], ["December", "दिसंबर"], ["Jan", "जनवरी"], ["Feb", "फ़रवरी"], ["Mar", "मार्च"],
  ["Apr", "अप्रैल"], ["Jun", "जून"], ["Jul", "जुलाई"], ["Aug", "अगस्त"], ["Sep", "सितंबर"], ["Sept", "सितंबर"],
  ["Oct", "अक्टूबर"], ["Nov", "नवंबर"], ["Dec", "दिसंबर"],
  // Work
  ["Business", "व्यवसाय"], ["Businessman", "व्यवसायी"], ["Service", "नौकरी"], ["Job", "नौकरी"],
  ["Government", "सरकारी"], ["Govt", "सरकारी"], ["Private", "निजी"], ["Engineer", "इंजीनियर"],
  ["Software", "सॉफ्टवेयर"], ["Senior", "सीनियर"], ["Junior", "जूनियर"], ["Manager", "मैनेजर"], ["Manager", "प्रबंधक"],
  ["Bank", "बैंक"], ["Teacher", "शिक्षक"], ["Doctor", "डॉक्टर"], ["Lawyer", "वकील"], ["Advocate", "अधिवक्ता"],
  ["Professor", "प्रोफेसर"], ["Analyst", "एनालिस्ट"], ["Developer", "डेवलपर"], ["Officer", "अधिकारी"],
  ["Clerk", "क्लर्क"], ["Accountant", "अकाउंटेंट"], ["Consultant", "कंसल्टेंट"], ["Executive", "एग्ज़ीक्यूटिव"],
  ["Director", "डायरेक्टर"], ["Farmer", "किसान"], ["Agriculture", "कृषि"], ["Company", "कंपनी"],
  ["Limited", "लिमिटेड"], ["Ltd", "लिमिटेड"], ["Pvt", "प्राइवेट"], ["Technologies", "टेक्नोलॉजीज़"],
  ["Infosys", "इंफोसिस"], ["Wipro", "विप्रो"], ["Accenture", "एक्सेंचर"], ["Google", "गूगल"],
  ["Microsoft", "माइक्रोसॉफ्ट"], ["Amazon", "अमेज़न"], ["Railway", "रेलवे"], ["Railways", "रेलवे"],
  ["Army", "सेना"], ["Police", "पुलिस"],
  // Education
  ["Graduate", "स्नातक"], ["Graduation", "स्नातक"], ["B.Tech", "बी.टेक"], ["M.Tech", "एम.टेक"],
  ["B.E", "बी.ई"], ["B.Com", "बी.कॉम"], ["M.Com", "एम.कॉम"], ["B.Sc", "बी.एससी"], ["M.Sc", "एम.एससी"],
  ["B.A", "बी.ए"], ["M.A", "एम.ए"], ["B.Ed", "बी.एड"], ["Ph.D", "पीएच.डी"], ["PhD", "पीएचडी"],
  ["Finance", "फाइनेंस"], ["Marketing", "मार्केटिंग"], ["Science", "विज्ञान"], ["Commerce", "वाणिज्य"],
  ["Arts", "कला"], ["Computer", "कंप्यूटर"], ["University", "विश्वविद्यालय"], ["College", "कॉलेज"],
  ["School", "स्कूल"], ["Institute", "संस्थान"],
  // Hobbies
  ["Reading", "पढ़ना"], ["Travelling", "यात्रा"], ["Traveling", "यात्रा"], ["Travel", "यात्रा"],
  ["Music", "संगीत"], ["Dance", "नृत्य"], ["Dancing", "नृत्य"], ["Classical", "शास्त्रीय"],
  ["Cooking", "खाना बनाना"], ["Singing", "गायन"], ["Painting", "चित्रकारी"], ["Drawing", "चित्रकला"],
  ["Sports", "खेल"], ["Cricket", "क्रिकेट"], ["Yoga", "योग"], ["Movies", "फ़िल्में"], ["Writing", "लेखन"],
  ["Gardening", "बागवानी"], ["Photography", "फ़ोटोग्राफ़ी"],
  // Places
  ["India", "भारत"], ["Delhi", "दिल्ली"], ["New", "नई"], ["Mumbai", "मुंबई"], ["Jaipur", "जयपुर"],
  ["Pune", "पुणे"], ["Bangalore", "बेंगलुरु"], ["Bengaluru", "बेंगलुरु"], ["Kolkata", "कोलकाता"],
  ["Chennai", "चेन्नई"], ["Hyderabad", "हैदराबाद"], ["Lucknow", "लखनऊ"], ["Kanpur", "कानपुर"],
  ["Indore", "इंदौर"], ["Bhopal", "भोपाल"], ["Patna", "पटना"], ["Ahmedabad", "अहमदाबाद"], ["Surat", "सूरत"],
  ["Nagpur", "नागपुर"], ["Noida", "नोएडा"], ["Gurgaon", "गुड़गांव"], ["Gurugram", "गुरुग्राम"],
  ["Chandigarh", "चंडीगढ़"], ["Varanasi", "वाराणसी"], ["Agra", "आगरा"], ["Ajmer", "अजमेर"],
  ["Udaipur", "उदयपुर"], ["Jodhpur", "जोधपुर"], ["Kota", "कोटा"], ["Bikaner", "बीकानेर"],
  ["Rajasthan", "राजस्थान"], ["Uttar", "उत्तर"], ["Pradesh", "प्रदेश"], ["Madhya", "मध्य"],
  ["Bihar", "बिहार"], ["Maharashtra", "महाराष्ट्र"], ["Gujarat", "गुजरात"], ["Haryana", "हरियाणा"],
  ["Punjab", "पंजाब"], ["Karnataka", "कर्नाटक"], ["Uttarakhand", "उत्तराखंड"], ["Jharkhand", "झारखंड"],
  ["Road", "रोड"], ["Nagar", "नगर"], ["Colony", "कॉलोनी"], ["Sector", "सेक्टर"], ["Near", "के पास"],
  ["Vaishali", "वैशाली"],
  // Common names and surnames
  ["Sharma", "शर्मा"], ["Verma", "वर्मा"], ["Gupta", "गुप्ता"], ["Singh", "सिंह"], ["Kumar", "कुमार"],
  ["Kumari", "कुमारी"], ["Agarwal", "अग्रवाल"], ["Aggarwal", "अग्रवाल"], ["Mishra", "मिश्रा"],
  ["Tiwari", "तिवारी"], ["Pandey", "पांडे"], ["Yadav", "यादव"], ["Chauhan", "चौहान"], ["Thakur", "ठाकुर"],
  ["Patel", "पटेल"], ["Shah", "शाह"], ["Mehta", "मेहता"], ["Joshi", "जोशी"], ["Srivastava", "श्रीवास्तव"],
  ["Saxena", "सक्सेना"], ["Chaudhary", "चौधरी"], ["Choudhary", "चौधरी"], ["Reddy", "रेड्डी"], ["Rao", "राव"],
  ["Nair", "नायर"], ["Iyer", "अय्यर"], ["Kapoor", "कपूर"], ["Khanna", "खन्ना"], ["Malhotra", "मल्होत्रा"],
  ["Arora", "अरोड़ा"], ["Bansal", "बंसल"], ["Goyal", "गोयल"], ["Mittal", "मित्तल"], ["Garg", "गर्ग"],
  ["Sinha", "सिन्हा"], ["Dubey", "दुबे"], ["Shukla", "शुक्ला"], ["Tripathi", "त्रिपाठी"],
  ["Dwivedi", "द्विवेदी"], ["Chaturvedi", "चतुर्वेदी"], ["Bhardwaj", "भारद्वाज"], ["Bharadwaj", "भारद्वाज"],
  ["Kashyap", "कश्यप"], ["Vashishtha", "वशिष्ठ"], ["Gautam", "गौतम"], ["Rathore", "राठौड़"],
  ["Shekhawat", "शेखावत"], ["Rahul", "राहुल"], ["Priya", "प्रिया"], ["Amit", "अमित"], ["Rajesh", "राजेश"],
  ["Sunita", "सुनीता"], ["Anita", "अनीता"], ["Pooja", "पूजा"], ["Puja", "पूजा"], ["Neha", "नेहा"],
  ["Rohit", "रोहित"], ["Ankit", "अंकित"], ["Vikas", "विकास"], ["Deepak", "दीपक"], ["Sanjay", "संजय"],
  ["Vijay", "विजय"], ["Ajay", "अजय"], ["Ramesh", "रमेश"], ["Suresh", "सुरेश"], ["Mahesh", "महेश"],
  ["Dinesh", "दिनेश"], ["Mukesh", "मुकेश"], ["Anil", "अनिल"], ["Sunil", "सुनील"], ["Manoj", "मनोज"],
  ["Ravi", "रवि"], ["Krishna", "कृष्ण"], ["Ram", "राम"], ["Shyam", "श्याम"], ["Mohan", "मोहन"],
  ["Sita", "सीता"], ["Geeta", "गीता"], ["Gita", "गीता"], ["Rekha", "रेखा"], ["Kavita", "कविता"],
  ["Savita", "सविता"], ["Meena", "मीना"], ["Seema", "सीमा"], ["Neelam", "नीलम"], ["Aarti", "आरती"],
  ["Divya", "दिव्या"], ["Sneha", "स्नेहा"], ["Shreya", "श्रेया"], ["Ananya", "अनन्या"], ["Aditya", "आदित्य"],
  ["Arjun", "अर्जुन"], ["Karan", "करण"], ["Varun", "वरुण"], ["Nikhil", "निखिल"], ["Gaurav", "गौरव"],
  ["Saurabh", "सौरभ"], ["Abhishek", "अभिषेक"], ["Akash", "आकाश"], ["Prakash", "प्रकाश"], ["Ashok", "अशोक"],
  ["Vinod", "विनोद"], ["Pradeep", "प्रदीप"], ["Sandeep", "संदीप"], ["Kuldeep", "कुलदीप"], ["Manish", "मनीष"],
  ["Nitin", "नितिन"], ["Sachin", "सचिन"], ["Rakesh", "राकेश"], ["Naresh", "नरेश"], ["Kamal", "कमल"],
  ["Kamla", "कमला"], ["Lakshmi", "लक्ष्मी"], ["Laxmi", "लक्ष्मी"], ["Radha", "राधा"], ["Shiv", "शिव"],
  ["Ganesh", "गणेश"], ["Hari", "हरि"], ["Om", "ओम"], ["Dev", "देव"], ["Devi", "देवी"], ["Prasad", "प्रसाद"],
  ["Lal", "लाल"], ["Chand", "चंद"], ["Nath", "नाथ"], ["Narayan", "नारायण"], ["Rani", "रानी"],
  ["Harish", "हरीश"], ["Girish", "गिरीश"], ["Satish", "सतीश"], ["Rajendra", "राजेंद्र"],
  ["Surendra", "सुरेंद्र"], ["Mahendra", "महेंद्र"], ["Narendra", "नरेंद्र"], ["Usha", "उषा"], ["Asha", "आशा"],
  // Rashi & nakshatra
  ["Mesh", "मेष"], ["Vrishabh", "वृषभ"], ["Mithun", "मिथुन"], ["Kark", "कर्क"], ["Kanya", "कन्या"],
  ["Tula", "तुला"], ["Vrishchik", "वृश्चिक"], ["Dhanu", "धनु"], ["Makar", "मकर"], ["Kumbh", "कुंभ"],
  ["Meen", "मीन"], ["Aries", "मेष"], ["Taurus", "वृषभ"], ["Gemini", "मिथुन"], ["Cancer", "कर्क"],
  ["Leo", "सिंह"], ["Virgo", "कन्या"], ["Libra", "तुला"], ["Scorpio", "वृश्चिक"], ["Sagittarius", "धनु"],
  ["Capricorn", "मकर"], ["Aquarius", "कुंभ"], ["Pisces", "मीन"], ["Rohini", "रोहिणी"], ["Ashwini", "अश्विनी"],
  ["Bharani", "भरणी"], ["Krittika", "कृत्तिका"], ["Mrigashira", "मृगशिरा"], ["Ardra", "आर्द्रा"],
  ["Punarvasu", "पुनर्वसु"], ["Pushya", "पुष्य"], ["Ashlesha", "आश्लेषा"], ["Magha", "मघा"],
  ["Hasta", "हस्त"], ["Chitra", "चित्रा"], ["Swati", "स्वाति"], ["Vishakha", "विशाखा"],
  ["Anuradha", "अनुराधा"], ["Jyeshtha", "ज्येष्ठा"], ["Mula", "मूल"], ["Shravan", "श्रवण"],
  ["Dhanishta", "धनिष्ठा"], ["Revati", "रेवती"], ["Sandilya", "शांडिल्य"], ["Vats", "वत्स"],
];

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

const EN_TO_HI_PHRASE = new Map(PHRASES.map(([e, h]) => [norm(e), h]));
const EN_TO_HI_WORD = new Map(WORDS.map(([e, h]) => [e.toLowerCase(), h]));
const HI_TO_EN_PHRASE = new Map<string, string>();
const HI_TO_EN_WORD = new Map<string, string>();
for (const [e, h] of PHRASES) if (!HI_TO_EN_PHRASE.has(h)) HI_TO_EN_PHRASE.set(h, e);
for (const [e, h] of WORDS) {
  if (h.includes(" ")) { if (!HI_TO_EN_PHRASE.has(h)) HI_TO_EN_PHRASE.set(h, e); }
  else if (!HI_TO_EN_WORD.has(h)) HI_TO_EN_WORD.set(h, e);
}

/* ---------- English (Latin letters) -> Devanagari ---------- */

const LETTERS: Record<string, string> = {
  A: "ए", B: "बी", C: "सी", D: "डी", E: "ई", F: "एफ", G: "जी", H: "एच", I: "आई", J: "जे", K: "के", L: "एल", M: "एम",
  N: "एन", O: "ओ", P: "पी", Q: "क्यू", R: "आर", S: "एस", T: "टी", U: "यू", V: "वी", W: "डब्ल्यू", X: "एक्स", Y: "वाई", Z: "ज़ेड",
};

const CONS: [string, string][] = [
  ["chh", "छ"], ["ksh", "क्ष"], ["sh", "श"], ["ch", "च"], ["kh", "ख"], ["gh", "घ"], ["th", "थ"], ["dh", "ध"],
  ["ph", "फ"], ["bh", "भ"], ["jh", "झ"], ["k", "क"], ["g", "ग"], ["c", "क"], ["j", "ज"], ["t", "त"], ["d", "द"],
  ["n", "न"], ["p", "प"], ["b", "ब"], ["m", "म"], ["y", "य"], ["r", "र"], ["l", "ल"], ["v", "व"], ["w", "व"],
  ["s", "स"], ["h", "ह"], ["f", "फ़"], ["z", "ज़"], ["q", "क"], ["x", "क्स"],
];
// [latin, independent form, matra]
const VOWELS: [string, string, string][] = [
  ["aa", "आ", "ा"], ["ee", "ई", "ी"], ["ii", "ई", "ी"], ["oo", "ऊ", "ू"], ["ai", "ऐ", "ै"], ["au", "औ", "ौ"],
  ["ou", "औ", "ौ"], ["a", "अ", ""], ["i", "इ", "ि"], ["u", "उ", "ु"], ["e", "ए", "े"], ["o", "ओ", "ो"],
];

function latinWordToDeva(word: string): string {
  const s = word.toLowerCase();
  let out = "";
  let afterCons = false; // last emitted unit is a consonant still carrying its inherent vowel
  let i = 0;
  while (i < s.length) {
    const v = VOWELS.find(([l]) => s.startsWith(l, i));
    if (v) {
      const [l, ind, matra] = v;
      const end = i + l.length >= s.length;
      if (afterCons) {
        out += l === "a" && end ? "ा" : l === "i" && end ? "ी" : matra;
      } else if (l === "a" && /[िी]$/.test(out)) {
        out += end ? "या" : "य"; // "Sania" -> सानिया
      } else {
        out += ind;
      }
      afterCons = false;
      i += l.length;
      continue;
    }
    const c = CONS.find(([l]) => s.startsWith(l, i));
    if (c) {
      const [l, deva] = c;
      const next = s[i + l.length];
      // Final "y" after a consonant sounds like ee: "Sunny" -> सनी
      if (l === "y" && !next && afterCons) {
        out += "ी";
        afterCons = false;
        i += 1;
        continue;
      }
      // Nasal before a consonant after a vowel -> anusvara: "Ankit" -> अंकित, "Kumbh" -> कुंभ
      if (out && !afterCons && ((l === "n" && next && "kgcjtdps".includes(next)) || (l === "m" && next && "pb".includes(next)))) {
        out += "ं";
        i += 1;
        continue;
      }
      if (afterCons) out += "्";
      out += deva;
      afterCons = true;
      i += l.length;
      continue;
    }
    out += s[i];
    afterCons = false;
    i += 1;
  }
  return out;
}

function enTokenToHi(token: string, shouting: boolean): string {
  const hit = EN_TO_HI_WORD.get(token.toLowerCase());
  if (hit) return hit;
  if (token.includes("-")) return token.split("-").map((t) => enTokenToHi(t, shouting)).join("-");
  if (token.includes(".")) return token.split(".").map((t) => enTokenToHi(t, shouting)).join(".");
  if (token.includes("'")) return enTokenToHi(token.replace(/'s$/i, "").replace(/'/g, ""), shouting);
  // Abbreviations (MBA, NMIMS, IT, B+) are read letter by letter, unless the whole text is in capitals.
  if (/^[A-Z]{1,6}$/.test(token) && (!shouting || token.length === 1)) {
    return [...token].map((ch) => LETTERS[ch] ?? ch).join("");
  }
  return latinWordToDeva(token);
}

function toHindi(text: string): string {
  const phrase = EN_TO_HI_PHRASE.get(norm(text));
  if (phrase) return phrase;
  const letters = text.replace(/[^A-Za-z]/g, "");
  const shouting = letters.length > 6 && letters === letters.toUpperCase();
  return text
    // "07:30 AM" -> "सुबह 07:30 बजे", "8 PM" -> "शाम 8 बजे"
    .replace(/(\d{1,2}(?:[:.]\d{2})?)\s*(AM|PM)\b/gi, (_, time: string, ap: string) => `${ap.toUpperCase() === "AM" ? "सुबह" : "शाम"} ${time} बजे`)
    .replace(/\|\|/g, "॥")
    .replace(/[A-Za-z]+(?:[.'-][A-Za-z]+)*/g, (tok) => enTokenToHi(tok, shouting));
}

/* ---------- Devanagari -> English (Latin letters) ---------- */

const D_CONS: Record<string, string> = {
  क: "k", ख: "kh", ग: "g", घ: "gh", ङ: "n", च: "ch", छ: "chh", ज: "j", झ: "jh", ञ: "n", ट: "t", ठ: "th", ड: "d",
  ढ: "dh", ण: "n", त: "t", थ: "th", द: "d", ध: "dh", न: "n", प: "p", फ: "ph", ब: "b", भ: "bh", म: "m", य: "y",
  र: "r", ल: "l", ळ: "l", व: "v", श: "sh", ष: "sh", स: "s", ह: "h",
  "क़": "q", "ख़": "kh", "ग़": "g", "ज़": "z", "ड़": "r", "ढ़": "rh", "फ़": "f", "य़": "y",
};
const NUKTA: Record<string, string> = { क: "q", ज: "z", फ: "f", ड: "r", ढ: "rh", ग: "g", ख: "kh" };
const D_MATRA: Record<string, string> = {
  "ा": "a", "ि": "i", "ी": "i", "ु": "u", "ू": "u", "ृ": "ri", "े": "e", "ै": "ai", "ो": "o", "ौ": "au", "ॉ": "o", "ॅ": "e",
};
const D_VOWEL: Record<string, string> = {
  अ: "a", आ: "a", इ: "i", ई: "i", उ: "u", ऊ: "u", ऋ: "ri", ए: "e", ऐ: "ai", ओ: "o", औ: "au", ऑ: "o",
};

type Unit = { kind: "c"; lat: string; v: string | null } | { kind: "v" | "n" | "x"; lat: string };

function devaWordToLatin(word: string): string {
  const chars = [...word];
  const units: Unit[] = [];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]!;
    if (D_CONS[ch] !== undefined) {
      let lat = D_CONS[ch]!;
      if (chars[i + 1] === "़") { lat = NUKTA[ch] ?? lat; i++; }
      const next = chars[i + 1];
      let v: string | null = null;
      if (next === "्") { v = ""; i++; }
      else if (next && D_MATRA[next] !== undefined) { v = D_MATRA[next]!; i++; }
      units.push({ kind: "c", lat, v });
    } else if (D_VOWEL[ch] !== undefined) units.push({ kind: "v", lat: D_VOWEL[ch]! });
    else if (ch === "ं" || ch === "ँ") {
      const nx = chars[i + 1];
      units.push({ kind: "n", lat: nx && "पफबभम".includes(nx) ? "m" : "n" });
    } else if (ch === "ः") units.push({ kind: "x", lat: "h" });
    else if (ch >= "०" && ch <= "९") units.push({ kind: "x", lat: String(ch.charCodeAt(0) - 0x0966) });
    else if (ch !== "़") units.push({ kind: "x", lat: ch });
  }
  // Schwa deletion: drop a consonant's inherent "a" at the word end, and between a vowel and a consonant+vowel.
  const sounds: boolean[] = []; // whether unit i ends in a vowel sound
  let out = "";
  units.forEach((u, i) => {
    if (u.kind !== "c") {
      out += u.lat;
      sounds[i] = u.kind === "v";
      return;
    }
    if (u.v !== null) {
      out += u.lat + u.v;
      sounds[i] = u.v !== "";
      return;
    }
    const isLast = i === units.length - 1;
    const prev = units[i - 1];
    const next = units[i + 1];
    const nextHasVowel = next?.kind === "c" && (next.v ? true : next.v === null && i + 1 < units.length - 1);
    const drop = (isLast && units.length > 1) || (i > 0 && prev?.kind !== "n" && sounds[i - 1] && nextHasVowel);
    out += u.lat + (drop ? "" : "a");
    sounds[i] = !drop;
  });
  return out.charAt(0).toUpperCase() + out.slice(1);
}

function toEnglish(text: string): string {
  const phrase = HI_TO_EN_PHRASE.get(text.trim().replace(/\s+/g, " "));
  if (phrase) return phrase;
  return text
    // "सुबह 06:45 बजे" -> "06:45 AM"
    .replace(/(सुबह|प्रातः|दोपहर|शाम|रात)\s*([\d०-९]{1,2}(?:[:.][\d०-९]{2})?)\s*बजे/g, (_, part: string, time: string) =>
      `${time} ${part === "सुबह" || part === "प्रातः" ? "AM" : "PM"}`)
    .replace(/॥/g, "||")
    .replace(/।/g, ".")
    .replace(/[ऀ-ॣ०-ॿ]+/g, (tok) => HI_TO_EN_WORD.get(tok) ?? devaWordToLatin(tok));
}

/* ---------- Public API ---------- */

const LATIN = /[A-Za-z]/;
const DEVANAGARI = /[ऀ-ॿ]/;

/** True when the text still has words in the other language's script. */
export function needsTranslation(text: string, lang: BioLang): boolean {
  const t = text.trim();
  if (!t || /^\S+@\S+\.\S+$/.test(t) || /^(https?:\/\/|www\.)/i.test(t)) return false;
  return lang === "hi" ? LATIN.test(t) : DEVANAGARI.test(t);
}

/** Translates/transliterates one biodata string into `lang`. Emails and URLs are left alone. */
export function autoTranslate(text: string, lang: BioLang): string {
  if (!needsTranslation(text, lang)) return text;
  return lang === "hi" ? toHindi(text) : toEnglish(text);
}
