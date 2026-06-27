import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("src/data/shifohiyya");

const stripPunctuation = (value) =>
  String(value || "")
    .replace(/[،؟?!*.،:؛﴿﴾۝\-\u0651\u064B\u064C\u064D\u0652\u0650\u064E\u064F,'"`[\]«»()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const stripOuterPunctuation = (value) =>
  String(value || "")
    .replace(/^[،؟?!*.،:؛﴿﴾۝\-'\"`[\]«»()]+|[،؟?!*.،:؛﴿﴾۝\-'\"`[\]«»()]+$/g, "")
    .trim();

const tokenizeArabic = (value) =>
  String(value || "")
    .split(/\s+/)
    .map(stripOuterPunctuation)
    .filter(Boolean);

const normalize = (value) =>
  stripPunctuation(value)
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .trim();

const titleCase = (value) => {
  const text = String(value || "").trim();
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
};

const manualUz = new Map(
  Object.entries({
    "هُوَ": "u",
    "هِيَ": "u (ayol)",
    "هُمْ": "ular",
    "هُنَّ": "ular (ayollar)",
    "هُنَّ": "ular (ayollar)",
    "أَنْتَ": "sen",
    "أَنْتِ": "sen (ayol)",
    "أَنْتُمْ": "sizlar",
    "أَنْتُنَّ": "sizlar (ayollar)",
    "أَنْتُنَّ": "sizlar (ayollar)",
    "أَنَا": "men",
    "نَحْنُ": "biz",
    "هَذَا": "bu",
    "هَذِهِ": "bu",
    "هَؤُلَاءِ": "bular",
    "ذَاكَ": "anavi",
    "تِلْكَ": "anavi",
    "أُولَئِكَ": "anavilar",
    "مَنْ": "kim",
    "مَا": "nima",
    "أَيْنَ": "qayerda",
    "مَتَى": "qachon",
    "إِلَى": "ga",
    "مِنْ": "dan",
    "فِي": "da",
    "مَعَ": "bilan",
    "عَلَى": "ustida",
    "عَنْ": "haqida",
    "لَدَى": "huzurida",
    "بَعْدَ": "keyin",
    "قَبْلَ": "oldin",
    "وَ": "va",
    "فَ": "bas",
    "لَا": "yo'q",
    "وَلَا": "va yo'q",
    "لَيْسَ": "emas",
    "لَيْسُوا": "emaslar",
    "لَيْسَتْ": "emas",
    "لَسْنَ": "emaslar",
    "لَسْتَ": "emassan",
    "لَسْتِ": "emassan",
    "لَسْتُمْ": "emassizlar",
    "لَسْتُنَّ": "emassizlar",
    "لَسْتُنَّ": "emassizlar",
    "لَسْتُ": "emasman",
    "لَسْنَا": "emasmiz",
    "أَصْلًا": "aslo",
    "الْبَتَّةَ": "mutlaqo",
    "ابْنُ": "o'g'li",
    "اِبْنُ": "o'g'li",
    "بْنُ": "o'g'li",
    "بْنِ": "o'g'li",
    "اِبْنَةُ": "qizi",
  })
);

const prepositions = new Set(["فِي", "مِنْ", "إِلَى", "عَلَى", "عَنْ", "مَعَ", "لَدَى", "بِ"]);
const demonstratives = new Set(["هَذَا", "هَذِهِ", "هَؤُلَاءِ", "ذَاكَ", "تِلْكَ", "أُولَئِكَ"]);
const pronouns = new Set(["هُوَ", "هِيَ", "هُمْ", "هُنَّ", "هُنَّ", "أَنْتَ", "أَنْتِ", "أَنْتُمْ", "أَنْتُنَّ", "أَنْتُنَّ", "أَنَا", "نَحْنُ"]);
const questionWords = new Set(["مَنْ", "مَا", "أَيْنَ", "مَتَى"]);
const negationWords = new Set(["لَا", "وَلَا", "لَيْسَ", "لَيْسُوا", "لَيْسَتْ", "لَسْنَ", "لَسْتَ", "لَسْتِ", "لَسْتُمْ", "لَسْتُنَّ", "لَسْتُنَّ", "لَسْتُ", "لَسْنَا"]);

const files = fs
  .readdirSync(dir)
  .filter((file) => /^\d+\.json$/.test(file))
  .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));

const globalLookup = new Map();
const globalNoArticle = new Map();

for (const file of files) {
  const n = Number.parseInt(file, 10);
  const words = JSON.parse(fs.readFileSync(path.join(dir, `${n}_words.json`), "utf8"));
  for (const [key, value] of Object.entries(words)) {
    const cleanKey = stripPunctuation(key);
    if (cleanKey.split(/\s+/).length !== 1) continue;
    const cleanValue = titleCase(value);
    globalLookup.set(normalize(cleanKey), cleanValue);
    const noArticle = normalize(cleanKey).replace(/^ال/, "");
    if (noArticle !== normalize(cleanKey)) globalNoArticle.set(noArticle, cleanValue);
  }
}

for (const [key, value] of manualUz) {
  globalLookup.set(normalize(key), value);
}

const lookupToken = (token, localWords, phraseWords, tokenIndex) => {
  const cleanToken = stripPunctuation(token);
  const normalized = normalize(cleanToken);

  if (manualUz.has(cleanToken)) return manualUz.get(cleanToken);
  if (localWords[cleanToken] && cleanToken.split(/\s+/).length === 1) return titleCase(localWords[cleanToken]);
  if (globalLookup.has(normalized)) return globalLookup.get(normalized);

  const noArticle = normalized.replace(/^ال/, "");
  if (globalLookup.has(noArticle)) return globalLookup.get(noArticle);
  if (globalNoArticle.has(noArticle)) return globalNoArticle.get(noArticle);

  const withB = normalized.replace(/^ب/, "");
  if (withB !== normalized && globalLookup.has(withB)) return `${globalLookup.get(withB)} bilan`;
  if (withB !== normalized && globalNoArticle.has(withB.replace(/^ال/, ""))) return `${globalNoArticle.get(withB.replace(/^ال/, ""))} bilan`;

  const suffixless = normalized
    .replace(/(كم|كن|هما|نا|ها|هم|هن|ك|ي|ه)$/, "")
    .replace(/^ال/, "");
  if (suffixless && globalNoArticle.has(suffixless)) return globalNoArticle.get(suffixless);
  if (suffixless && globalLookup.has(suffixless)) return globalLookup.get(suffixless);

  const phraseUz = phraseWords.join(" ").trim();
  if (phraseWords[tokenIndex]) return titleCase(phraseWords[tokenIndex]);
  if (phraseUz) return `${titleCase(phraseUz)} tarkibidagi so'z`;

  return cleanToken;
};

const grammarFor = (token, original, index, tokens) => {
  const cleanToken = stripPunctuation(token);
  const previous = index > 0 ? stripPunctuation(tokens[index - 1]) : "";
  const role = String(original.r || "").trim();
  const rc = original.rc || "tb";

  if (prepositions.has(cleanToken)) {
    return {
      r: "حرف جر",
      rc: "tmt",
      e: `${cleanToken} jar harfi; o'zidan keyingi ismni majrur qiladi va gapda bog'lanish ma'nosini beradi.`,
    };
  }
  if (questionWords.has(cleanToken)) {
    return {
      r: "اسم استفهام",
      rc: "tb",
      e: `${cleanToken} so'roq so'zi; savol ma'nosini ochadi va gap boshida kelgan.`,
    };
  }
  if (demonstratives.has(cleanToken)) {
    return {
      r: "اسم إشارة",
      rc: "tm",
      e: `${cleanToken} ko'rsatish ismi; undan keyingi ismni aniqlab, iborada ega vazifasiga kiradi.`,
    };
  }
  if (pronouns.has(cleanToken)) {
    return {
      r: "ضمير منفصل",
      rc: "tm",
      e: `${cleanToken} alohida olmosh; gapda odatda mubtado yoki fe'l egasini bildiradi.`,
    };
  }
  if (negationWords.has(cleanToken)) {
    return {
      r: "فعل ناقص / حرف نفي",
      rc: "tx",
      e: `${cleanToken} inkor ma'nosini beradi; keyingi so'z bilan birga xabarni inkor qiladi.`,
    };
  }
  if (previous && prepositions.has(previous)) {
    return {
      r: "اسم مجرور",
      rc: "tmt",
      e: `${cleanToken} oldidagi jar harfi sababli majrur bo'lgan ism; joy, yo'nalish yoki bog'lanish ma'nosini to'ldiradi.`,
    };
  }
  if (index > 0 && /mubtado|مبتدأ/i.test(role)) {
    return {
      r: "بدل أو عطف بيان",
      rc,
      e: `${cleanToken} oldingi ko'rsatish ismini izohlaydi; butun ibora mubtado vazifasida kelgan.`,
    };
  }
  if (index > 0 && /xabar|خبر/i.test(role)) {
    return {
      r: "نعت مرفوع",
      rc,
      e: `${cleanToken} xabar tarkibidagi sifatlovchi bo'lib, oldingi ismning ma'nosini aniqlaydi.`,
    };
  }
  if (index > 0 && /maf|مفعول/i.test(role)) {
    return {
      r: "نعت منصوب / مضاف إليه",
      rc,
      e: `${cleanToken} maf'ul bih tarkibida kelgan; oldingi so'zni aniqlaydi yoki unga izofa orqali bog'lanadi.`,
    };
  }
  if (index > 0 && /zarf|ظرف/i.test(role)) {
    return {
      r: "مضاف إليه مجرور",
      rc,
      e: `${cleanToken} zarf yoki izofa tarkibida kelib, oldingi so'zga bog'lanadi.`,
    };
  }

  return {
    r: original.r || "كلمة",
    rc,
    e: `${cleanToken} — ${original.e || "gap tarkibidagi bo'lak"}; bu token alohida mashq qilinishi uchun ajratildi.`,
  };
};

let changedParts = 0;

for (const file of files) {
  const n = Number.parseInt(file, 10);
  const chapterPath = path.join(dir, file);
  const wordsPath = path.join(dir, `${n}_words.json`);
  const chapter = JSON.parse(fs.readFileSync(chapterPath, "utf8"));
  const localWords = JSON.parse(fs.readFileSync(wordsPath, "utf8"));
  const newWords = { ...localWords };

  for (const sentence of chapter.sentences || []) {
    const nextParts = [];
    for (const part of sentence.parts || []) {
      const tokens = tokenizeArabic(part.w);
      const phraseUz = localWords[stripPunctuation(part.w)] || "";
      const phraseWords = String(phraseUz).split(/\s+/).filter(Boolean);

      for (const [index, token] of tokens.entries()) {
        const uz = lookupToken(token, localWords, phraseWords, index);
        const grammar = grammarFor(token, part, index, tokens);
        nextParts.push({
          w: token,
          r: grammar.r,
          rc: grammar.rc,
          e: grammar.e,
          uz,
        });
        if (!newWords[token]) newWords[token] = uz;
      }
      changedParts += Math.max(0, tokens.length - 1);
    }
    sentence.parts = nextParts;
  }

  chapter.bookId = "shifohiyya";
  fs.writeFileSync(chapterPath, `${JSON.stringify(chapter, null, 2)}\n`);
  fs.writeFileSync(wordsPath, `${JSON.stringify(newWords, null, 2)}\n`);
}

console.log(`normalized ${files.length} shifohiyya chapters; split ${changedParts} extra tokens`);
