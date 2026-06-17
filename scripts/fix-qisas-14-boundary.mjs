import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/qisas';
const read = (file) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
const write = (file, data) => fs.writeFileSync(path.join(dir, file), `${JSON.stringify(data, null, 2)}\n`);

const max = read('index.json').length - 1;
const chapters = Array.from({ length: max + 1 }, (_, i) => read(`${i}.json`));
const words = Array.from({ length: max + 1 }, (_, i) => read(`${i}_words.json`));

chapters[13].sentences = [...chapters[13].sentences, ...chapters[14].sentences];
words[13] = { ...words[13], ...words[14] };

chapters[14] = {
  ...chapters[15],
  title: '١٥ ـ الْكَعْبَةُ',
  tuz: 'Ka’ba',
  sub: 'Ibrohim va Ismoil Ka’bani qurishadi',
  page: 24,
};
words[14] = words[15];

chapters[15] = {
  ...chapters[16],
  title: '١٦ ـ بَيْتُ الْمَقْدِسِ',
  page: 25,
};
words[15] = words[16];

for (let i = 17; i <= max; i += 1) {
  chapters[i - 1] = chapters[i];
  words[i - 1] = words[i];
}

const nextLength = max;
for (let i = 0; i < nextLength; i += 1) {
  write(`${i}.json`, chapters[i]);
  write(`${i}_words.json`, words[i]);
}

const index = Array.from({ length: nextLength }, (_, i) => ({
  id: `qisas-${i}`,
  title: chapters[i].title,
  tuz: chapters[i].tuz,
  sub: chapters[i].sub,
  page: chapters[i].page,
  sentenceCount: chapters[i].sentences.length,
}));
write('index.json', index);

console.log('Merged old chapter 15 into chapter 14 and shifted following qisas chapters down by one');
