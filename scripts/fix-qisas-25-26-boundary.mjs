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

chapters[22].sentences = [...chapters[22].sentences, ...chapters[23].sentences];
words[22] = { ...words[22], ...words[23] };

for (let i = 24; i < oldLength; i += 1) {
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

console.log('Merged old chapter 26 into chapter 25 and shifted following qisas chapters down by one');
