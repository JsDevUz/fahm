import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/qisas';
const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));

const uiWords = {
  'أبي': 'otam',
  'أعبد': 'ibodat qilaman',
  'أن': '-ki, -ishni',
  'إبراهيم': 'Ibrohim',
  'الأصنام': 'butlar',
  'الأكبر': 'eng katta',
  'الصنم': 'but',
  'الله': 'Alloh',
  'الليل': 'tun',
  'تحيي': 'tiriltiradi',
  'تسقي': 'sug‘oradi',
  'تسمع': 'eshitadi',
  'تقل': 'aytma',
  'تنطق': 'gapiradi',
  'تهدي': 'hidoyat qiladi',
  'شيء': 'narsa',
  'شيئا': 'biror narsa',
  'في': 'ichida',
  'قال': 'dedi',
  'لأحد': 'biror kishiga',
  'لا': 'yo‘q',
  'وأن': 'va albatta',
  'ولا': 'va yo‘q',
  'يبصر': 'ko‘radi',
  'يسجد': 'sajda qiladi',
  'يضر': 'zarar beradi',
  'يعلوه': 'uning ustiga chiqadi',
  'يوسف': 'Yusuf',
};

const norm = (word) =>
  word
    .replace(/[،؟!.،:؛﴿﴾۝\-\u0651\u064B\u064C\u064D\u0652\u0650\u064E\u064F,'"\[\]«»()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const lookupWord = (words, raw) => {
  const normalized = norm(raw);
  if (!normalized) return null;
  if (words[normalized]) return words[normalized];
  for (const key of Object.keys(words)) {
    if (norm(key) === normalized) return words[key];
  }
  return null;
};

const uiMisses = (sentence, words) => {
  const tokens = sentence.split(/(\s+)/);
  const missing = [];
  let i = 0;

  while (i < tokens.length) {
    if (!tokens[i].trim()) {
      i += 1;
      continue;
    }

    let matched = false;
    for (let wordCount = 5; wordCount >= 1; wordCount -= 1) {
      const currentTokens = [];
      let peek = i;
      let wordsFound = 0;

      while (peek < tokens.length && wordsFound < wordCount) {
        currentTokens.push(tokens[peek]);
        if (tokens[peek].trim()) wordsFound += 1;
        peek += 1;
      }

      if (wordsFound === wordCount && lookupWord(words, currentTokens.join(''))) {
        i = peek;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const raw = tokens[i];
      if (!lookupWord(words, raw)) missing.push(norm(raw));
      i += 1;
    }
  }

  return missing;
};

let added = 0;
for (let i = 0; i < index.length; i += 1) {
  const chapter = JSON.parse(fs.readFileSync(path.join(dir, `${i}.json`), 'utf8'));
  const wordsPath = path.join(dir, `${i}_words.json`);
  const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
  let changed = false;

  for (const sentence of chapter.sentences) {
    for (const missing of uiMisses(sentence.ar, words)) {
      const translation = uiWords[missing];
      if (!translation) throw new Error(`Missing UI translation for ${missing}`);
      if (!lookupWord(words, missing)) {
        words[missing] = translation;
        changed = true;
        added += 1;
      }
    }
  }

  if (changed) fs.writeFileSync(wordsPath, `${JSON.stringify(words, null, 2)}\n`);
}

const chapter7Path = path.join(dir, '7.json');
const chapter7 = JSON.parse(fs.readFileSync(chapter7Path, 'utf8'));

const partsBySentence = {
  1: [
    ['لِأَنَّ', 'harf', 'tb', 'chunki'],
    ['اللَّهَ', 'ism inna', 'tm', 'Alloh'],
    ['حَيٌّ', 'xabar inna', 'tx', 'tirik'],
    ['لَا يَمُوتُ', 'jumla fiʼliyya', 'tf', 'o‘lmaydi'],
  ],
  2: [
    ['وَأَنَّ', 'harf mushabbaha', 'tb', 'va albatta'],
    ['اللَّهَ', 'ism inna', 'tm', 'Alloh'],
    ['بَاقٍ', 'xabar inna', 'tx', 'boqiy'],
    ['لَا يَغِيبُ', 'jumla fiʼliyya', 'tf', 'g‘oyib bo‘lmaydi'],
  ],
  3: [
    ['وَأَنَّ', 'harf mushabbaha', 'tb', 'va albatta'],
    ['اللَّهَ', 'ism inna', 'tm', 'Alloh'],
    ['قَوِيٌّ', 'xabar inna', 'tx', 'kuchli'],
    ['لَا يَعْلِيهُ شَيْءٌ', 'jumla fiʼliyya', 'tf', 'hech narsa undan ustun bo‘lmaydi'],
  ],
  4: [
    ['وَعَرَفَ', 'feʼl', 'tf', 'bildi'],
    ['إِبْرَاهِيمُ', 'foʼil', 'tm', 'Ibrohim'],
    ['أَنَّ اللَّهَ', 'mafʼul jumlasi', 'tb', 'Alloh ekanini'],
    ['رَبُّ الْكَوْكَبِ', 'xabar', 'tx', 'yulduzning Robbisi'],
  ],
  5: [
    ['وَأَنَّ اللَّهَ', 'mafʼul jumlasi', 'tb', 'va Alloh ekanini'],
    ['رَبُّ الْقَمَرِ', 'xabar', 'tx', 'oyning Robbisi'],
  ],
  6: [
    ['وَأَنَّ اللَّهَ', 'mafʼul jumlasi', 'tb', 'va Alloh ekanini'],
    ['رَبُّ الشَّمْسِ', 'xabar', 'tx', 'quyoshning Robbisi'],
  ],
  7: [
    ['وَأَنَّ اللَّهَ', 'harf mushabbaha', 'tb', 'va albatta Alloh'],
    ['رَبُّ الْعَالَمِينَ', 'xabar', 'tx', 'olamlarning Robbisi'],
  ],
  8: [
    ['وَهَدَى', 'feʼl', 'tf', 'hidoyat qildi'],
    ['اللَّهُ', 'foʼil', 'tm', 'Alloh'],
    ['إِبْرَاهِيمَ', 'mafʼul bih', 'tb', 'Ibrohimni'],
    ['وَجَعَلَهُ', 'maʼtuf feʼl', 'tf', 'va uni qildi'],
    ['نَبِيًّا', 'mafʼul bih ikkinchi', 'tb', 'payg‘ambar'],
    ['وَخَلِيلًا', 'maʼtuf', 'tb', 'va do‘st'],
  ],
  9: [
    ['وَأَمَرَ', 'feʼl', 'tf', 'buyurdi'],
    ['اللَّهُ', 'foʼil', 'tm', 'Alloh'],
    ['إِبْرَاهِيمَ', 'mafʼul bih', 'tb', 'Ibrohimga'],
    ['أَنْ يَدْعُوَ', 'masdar muʼawwal', 'tb', 'daʼvat qilishni'],
    ['قَوْمَهُ', 'mafʼul bih', 'tb', 'qavmini'],
    ['وَيَمْنَعَهُمْ', 'maʼtuf feʼl', 'tf', 'va ularni qaytarishni'],
    ['مِنْ عِبَادَةِ الْأَصْنَامِ', 'jar-majrur', 'tmt', 'butlarga ibodat qilishdan'],
  ],
};

for (const [indexString, parts] of Object.entries(partsBySentence)) {
  const sentenceIndex = Number(indexString);
  chapter7.sentences[sentenceIndex].parts = parts.map(([w, r, rc, e]) => ({ w, r, rc, e }));
}

fs.writeFileSync(chapter7Path, `${JSON.stringify(chapter7, null, 2)}\n`);

console.log(`Added ${added} UI word entries and filled qisas/7 grammar parts`);
