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

const mergeAt = (i) => {
  chapters[i].sentences = [...chapters[i].sentences, ...chapters[i + 1].sentences];
  words[i] = { ...words[i], ...words[i + 1] };
  chapters.splice(i + 1, 1);
  words.splice(i + 1, 1);
};

mergeAt(23);
mergeAt(24);

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

console.log('Merged old chapters 28 into 27 and 30 into 29, then shifted following qisas chapters down');
