import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/qisas';
const indexPath = path.join(dir, 'index.json');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

const index = readJson(indexPath);
const oldLength = index.length;
const chapters = [];
const words = [];

for (let i = 0; i < oldLength; i += 1) {
  chapters[i] = readJson(path.join(dir, `${i}.json`));
  words[i] = readJson(path.join(dir, `${i}_words.json`));
}

chapters[20].sentences = [...chapters[20].sentences, ...chapters[21].sentences];
words[20] = { ...words[20], ...words[21] };

for (let i = 22; i < oldLength; i += 1) {
  chapters[i - 1] = chapters[i];
  words[i - 1] = words[i];
}

const newLength = oldLength - 1;
const nextIndex = chapters.slice(0, newLength).map((chapter, i) => ({
  id: `qisas-${i}`,
  title: chapter.title,
  tuz: chapter.tuz,
  sub: chapter.sub,
  page: chapter.page,
  sentenceCount: chapter.sentences.length,
}));

for (let i = 0; i < newLength; i += 1) {
  writeJson(path.join(dir, `${i}.json`), chapters[i]);
  writeJson(path.join(dir, `${i}_words.json`), words[i]);
}

writeJson(indexPath, nextIndex);

console.log('Merged old chapter 22 into chapter 21 and shifted following qisas chapters down by one');
