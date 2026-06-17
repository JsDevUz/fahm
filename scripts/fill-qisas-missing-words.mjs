import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/qisas';
const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));

const translations = {
  'وَكَانَ': 'va edi',
  'وَيَرَى': "va ko'rardi",
  'وَيَا': 'va ey',
  'تَضُرُّ': 'zarar beradi',
  'تَنْفَعُ': 'foyda beradi',
  'قَالُوا': 'dedilar',
  'قَالَ': 'dedi',
  'وَكَانُوا': 'va edilar',
  'وَأَنَّ': 'va albatta',
  'فَكَيْفَ': 'qanday qilib',
  'تَعْبُدُونَ': 'ibodat qilasizlar',
  'وَإِنَّهَا': 'va albatta u',
  'وَكَيْفَ': 'va qanday qilib',
  'تَسْأَلُونَ': "so'raysizlar",
  'أَلَا': 'nahotki',
  'تَفْهَمُونَ': 'tushunasizlar',
  'شَيْئًا': 'biror narsa',
  'أَفَلَا': 'nahotki',
  'تَعْقِلُونَ': 'aql yurgizasizlar',
  'وَسَكَتَ': "va jim bo'ldi",
  'وَتَحَيَّرُوا': 'va hayron qoldilar',
  'أُوقِدُوا': 'yoqdilar',
  'نَارًا': 'olov',
  'وَأَلْقَوْا': 'va tashladilar',
  'ضَعِيفَةٌ': 'zaif',
  'يَعْلِيهَا': 'uning ustiga chiqadi',
  'وَيَعْلِيهَا': 'va uning ustiga chiqadi',
  'الْغَيْمُ': 'bulut',
  'وَلَا': 'va yo‘q',
  'يَنْصُرُنِي': 'menga yordam beradi',
  'لِأَنَّهُ': 'chunki u',
  'تَنْصُرُنِي': 'menga yordam beradi',
  'لِأَنَّهَا': 'chunki u',
  'وَيَنْصُرُنِي': 'va menga yordam beradi',
  'لِأَنَّ': 'chunki',
  'بَاقٍ': 'qoluvchi, boqiy',
  'قَوِيٌّ': 'kuchli',
  'يَعْلِيهُ': 'uning ustiga chiqadi',
  'شَيْءٌ': 'narsa',
  'وَجَعَلَهُ': 'va uni qildi',
  'وَخَلِيلًا': "va do'st",
  'إِبْرَاهِيمُ': 'Ibrohim',
  'لِقَوْمِهِ': 'qavmiga',
  'أَوْ': 'yoki',
  'بَلْ': 'balki',
  'فَأَنَا': 'men esa',
  'هَذِهِ': 'bu',
  'أَنَا': 'men',
  'لِهَذِهِ': 'bunga',
  'الَّذِي': 'u zotki',
  'فَهُوَ': 'bas u',
  'وَالَّذِي': 'va u zotki',
  'هُوَ': 'u',
  'وَيَسْقِينِ': 'va meni sug‘oradi',
  'وَإِذَا': 'va qachon',
  'ثُمَّ': "so'ng",
  'وَإِنَّ': 'va albatta',
  'أَحَدًا': 'biror kishini',
  'مَرِضَ': 'kasal bo‘ldi',
  'أَحَدٌ': 'biror kishi',
  'فَهِيَ': 'bas u',
  'تُمِيتُ': "o'ldiradi",
  'كَانَ': 'edi',
  'فِي': 'ichida',
  'كَبِيرٌ': 'katta',
  'جِدًّا': 'juda',
  'وَظَالِمٌ': 'va zolim',
  'النَّاسُ': 'odamlar',
  'يَسْجُدُونَ': 'sajda qiladilar',
  'الْمَلِكُ': 'podshoh',
  'أَنَّ': 'albatta',
  'إِبْرَاهِيمَ': 'Ibrohimni',
  'وَجَاءَ': 'va keldi',
  'يَا': 'ey',
  'وَيُمِيتُ': "va o'ldiradi",
  'وَأُمِيتُ': "va o'ldiraman",
  'وَدَعَا': 'va chaqirdi',
  'وَقَالَ': 'va dedi',
  'وَتَرَكْتُ': 'va tark qildim',
  'وَكَذَلِكَ': 'va shuningdek',
  'كُلُّ': 'har bir',
  'وَأَرَادَ': 'va xohladi',
  'وَيُفْهِمَ': 'va tushuntirishni',
  'قَوْمَهُ': 'qavmiga',
  'فَقَالَ': 'bas dedi',
  'فَإِنَّ': 'bas albatta',
  'فَأْتِ': 'keltir',
  'بِهَا': 'uni',
  'وَمَا': 'va nima',
  'وَجَدَ': 'va topdi',
  'أَنْ': '-ni, -ishni',
  'لَهُ': 'unga',
  'مَا': 'nima',
  'وَلِمَ': 'va nima uchun',
  'لِوَالِدِهِ': 'otasiga',
  'يَذْهَبَ': 'boradi',
  'إِلَى': '-ga',
  'وَيَدْعُو': 'va chaqiradi',
  'النَّاسَ': 'odamlarni',
  'اللَّهِ': 'Allohning',
  'إِلَيْهِ': 'unga',
  'زَمَانِهِ': 'uning zamonida',
  'وَقَالُوا': 'va dedilar',
  'وَسَمِعَ': 'va eshitdi',
  'وَلَكِنَّ': 'lekin',
  'يَأْتِيَكُمَا': 'ikkalangizga keladi',
  'مِمَّا': 'narsalardan',
  'وَهُنَا': 'va shu yerda',
  'فَبَدَأَ': 'bas boshladi',
};

const normalize = (value) =>
  value
    .normalize('NFC')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/ـ/g, '')
    .replace(/[إأآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');

const tokens = (value) =>
  value
    .normalize('NFC')
    .replace(/[﴿﴾،؛:؟.!()[\]"'“”]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .filter((word) => !/^[٠-٩0-9]+$/.test(word));

const normalizedTranslations = new Map(
  Object.entries(translations).map(([word, translation]) => [normalize(word), [word, translation]]),
);

const missingTranslations = new Map();
let added = 0;

for (let i = 0; i < index.length; i += 1) {
  const chapterPath = path.join(dir, `${i}.json`);
  const wordsPath = path.join(dir, `${i}_words.json`);
  const chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
  const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
  const known = new Set(Object.keys(words).flatMap((key) => tokens(key).map(normalize)));
  let changed = false;

  for (const sentence of chapter.sentences) {
    for (const token of tokens(sentence.ar)) {
      const normalized = normalize(token);
      if (known.has(normalized)) continue;

      const translated = normalizedTranslations.get(normalized);
      if (!translated) {
        missingTranslations.set(normalized, token);
        continue;
      }

      const [canonicalToken, translation] = translated;
      words[canonicalToken] = translation;
      known.add(normalized);
      changed = true;
      added += 1;
    }
  }

  if (changed) {
    fs.writeFileSync(wordsPath, `${JSON.stringify(words, null, 2)}\n`);
  }
}

if (missingTranslations.size > 0) {
  console.error('Missing translations:');
  for (const token of missingTranslations.values()) console.error(token);
  process.exit(1);
}

console.log(`Added ${added} missing qisas word entries`);
