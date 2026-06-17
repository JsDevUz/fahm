import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/qisas';
const read = (n) => JSON.parse(fs.readFileSync(path.join(dir, `${n}.json`), 'utf8'));
const write = (n, data) => fs.writeFileSync(path.join(dir, `${n}.json`), `${JSON.stringify(data, null, 2)}\n`);
const readWords = (n) => JSON.parse(fs.readFileSync(path.join(dir, `${n}_words.json`), 'utf8'));
const writeWords = (n, data) => fs.writeFileSync(path.join(dir, `${n}_words.json`), `${JSON.stringify(data, null, 2)}\n`);
const sent = (ar, tr) => ({ ar, tr, parts: [] });

const ch0 = read(0);
ch0.sentences[5].ar = 'وَكَانَ فِي هَذَا الْبَيْتِ أَصْنَامٌ، أَصْنَامٌ كَثِيرَةٌ جِدًّا.';
ch0.sentences[5].tr = 'Bu uyda butlar, juda ko‘p butlar bor edi.';
write(0, ch0);

const ch2 = read(2);
if (!ch2.sentences.some((s) => s.ar.includes('لَا تَضُرُّ وَلَا تَنْفَعُ'))) {
  ch2.sentences.splice(
    4,
    0,
    sent('وَإِنَّ هَذِهِ الْأَصْنَامَ لَا تَضُرُّ وَلَا تَنْفَعُ!', 'Va bu butlar zarar ham, foyda ham bermaydi!'),
  );
}
write(2, ch2);

const ch4 = read(4);
const missingAfterReturn = [
  sent('قَالَ إِبْرَاهِيمُ: فَكَيْفَ تَعْبُدُونَ الْأَصْنَامَ وَإِنَّهَا لَا تَضُرُّ وَلَا تَنْفَعُ؟!!', 'Ibrohim dedi: Unda qanday qilib butlarga ibodat qilasizlar, ular zarar ham, foyda ham bermasa?!'),
  sent('وَكَيْفَ تَسْأَلُونَ الْأَصْنَامَ وَإِنَّهَا لَا تَنْطِقُ وَلَا تَسْمَعُ؟', 'Qanday qilib butlardan so‘raysizlar, ular gapirmasa va eshitmasa?'),
  sent('أَلَا تَفْهَمُونَ شَيْئًا، أَفَلَا تَعْقِلُونَ؟', 'Hech narsani tushunmaysizlarmi, aql yurgizmaysizlarmi?'),
  sent('وَسَكَتَ النَّاسُ وَتَحَيَّرُوا!!', 'Odamlar jim bo‘lib, hayron qoldilar!'),
];
for (const item of missingAfterReturn) {
  if (!ch4.sentences.some((s) => s.ar === item.ar)) ch4.sentences.push(item);
}
write(4, ch4);

const ch5 = read(5);
ch5.sentences[3].ar = 'وَهَكَذَا كَانَ: أُوقِدُوا نَارًا وَأَلْقَوْا فِيهَا إِبْرَاهِيمَ.';
ch5.sentences[3].tr = 'Shunday bo‘ldi: ular olov yoqdilar va unga Ibrohimni tashladilar.';
write(5, ch5);

const replaceInChapter = (chapter, replacements) => {
  for (const sentence of chapter.sentences) {
    for (const [from, to] of replacements) {
      if (sentence.ar.includes(from)) sentence.ar = sentence.ar.replaceAll(from, to);
      for (const part of sentence.parts || []) {
        if (typeof part.w === 'string' && part.w.includes(from)) part.w = part.w.replaceAll(from, to);
      }
    }
  }
};

const ch6 = read(6);
replaceInChapter(ch6, [
  ['لَا يَزُولُ', 'لَا يَغِيبُ'],
]);
write(6, ch6);

const ch7 = read(7);
replaceInChapter(ch7, [
  ['لَا يَزُولُ', 'لَا يَغِيبُ'],
  ['لَا يَعْلُوهُ شَيْءٌ', 'لَا يَعْلِيهُ شَيْءٌ'],
]);
write(7, ch7);

for (const n of [6, 7]) {
  const words = readWords(n);
  if (words['لَا يَزُولُ']) {
    words['لَا يَغِيبُ'] = 'yo‘qolmaydi, g‘oyib bo‘lmaydi';
    delete words['لَا يَزُولُ'];
  }
  if (words['لَا يَعْلُوهُ شَيْءٌ']) {
    words['لَا يَعْلِيهُ شَيْءٌ'] = words['لَا يَعْلُوهُ شَيْءٌ'];
    delete words['لَا يَعْلُوهُ شَيْءٌ'];
  }
  writeWords(n, words);
}

const ch15 = read(15);
replaceInChapter(ch15, [['وَتَنَقَّلَ', 'وَنَقَلَ']]);
ch15.sentences[3].tr = 'Ibrohim va Ismoil tog‘lardan toshlarni tashidilar.';
write(15, ch15);
const words15 = readWords(15);
if (words15['تَنَقَّلَ']) delete words15['تَنَقَّلَ'];
words15['وَنَقَلَ'] = 'tashidi';
writeWords(15, words15);

const ch16 = read(16);
if (!ch16.sentences.some((s) => s.ar === 'وَإِلَيْكَ هَذِهِ الْقِصَّةَ!')) {
  ch16.sentences.push(sent('وَإِلَيْكَ هَذِهِ الْقِصَّةَ!', 'Mana senga bu qissa!'));
}
write(16, ch16);
const words16 = readWords(16);
words16['وَإِلَيْكَ'] = 'mana senga';
words16['هَذِهِ الْقِصَّةَ'] = 'bu qissa';
writeWords(16, words16);

const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
for (let i = 0; i <= 16; i += 1) {
  const chapter = read(i);
  index[i].title = chapter.title;
  index[i].page = chapter.page;
  index[i].sentenceCount = chapter.sentences.length;
}
fs.writeFileSync(path.join(dir, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);

console.log('Synced qisas chapters 1-16 with pasted source differences');
