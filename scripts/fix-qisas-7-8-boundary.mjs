import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/qisas';
const read = (file) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
const write = (file, data) => fs.writeFileSync(path.join(dir, file), `${JSON.stringify(data, null, 2)}\n`);

const ch7 = read('6.json');
const ch8 = read('7.json');
const words7 = read('6_words.json');
const words8 = read('7_words.json');

const continuationCount = 8;
const continuation = ch8.sentences.slice(0, continuationCount);
ch7.sentences = [...ch7.sentences, ...continuation];
ch8.sentences = ch8.sentences.slice(continuationCount);

const moveWordKeys = [
  'وَالشَّمْسُ',
  'يَعْلِيهَا',
  'اللَّيْلُ',
  'الْغَيْمُ',
  'يَنْصُرُنِي',
  'وَبَاقٍ',
  'وَقَوِيٌّ',
  'لَا يَعْلِيهُ شَيْءٌ',
];

for (const key of moveWordKeys) {
  if (Object.hasOwn(words8, key)) {
    words7[key] = words8[key];
    delete words8[key];
  }
}

write('6.json', ch7);
write('7.json', ch8);
write('6_words.json', words7);
write('7_words.json', words8);

const index = read('index.json');
index[6].sentenceCount = ch7.sentences.length;
index[7].sentenceCount = ch8.sentences.length;
write('index.json', index);

console.log(`Moved ${continuation.length} sentences from chapter 8 to chapter 7`);
