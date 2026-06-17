import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/qisas';
const indexPath = path.join(dir, 'index.json');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

const index = readJson(indexPath);
const chapters = [];
const words = [];

for (let i = 0; i < index.length; i += 1) {
  chapters[i] = readJson(path.join(dir, `${i}.json`));
  words[i] = readJson(path.join(dir, `${i}_words.json`));
}

chapters[25].sentences = [
  ...chapters[25].sentences,
  ...chapters[26].sentences,
  ...chapters[27].sentences,
];
words[25] = { ...words[25], ...words[26], ...words[27] };

chapters.splice(26, 2);
words.splice(26, 2);

const nextIndex = chapters.map((chapter, i) => ({
  id: `qisas-${i}`,
  title: chapter.title,
  tuz: chapter.tuz,
  sub: chapter.sub,
  page: chapter.page,
  sentenceCount: chapter.sentences.length,
}));

for (let i = 0; i < chapters.length; i += 1) {
  writeJson(path.join(dir, `${i}.json`), chapters[i]);
  writeJson(path.join(dir, `${i}_words.json`), words[i]);
}

writeJson(indexPath, nextIndex);

console.log('Merged old chapters 32 and 33 into chapter 31, then shifted following qisas chapters down');
