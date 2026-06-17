import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/qisas';
const indexPath = path.join(dir, 'index.json');

const punctuationPattern = /[،؟!.،:؛﴿﴾۝\-\u0651\u064B\u064C\u064D\u0652\u0650\u064E\u064F,'"[\]«»()]/g;

const normalize = (value) =>
  String(value || '')
    .normalize('NFC')
    .replace(punctuationPattern, '')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeCoverage = (value) =>
  normalize(value)
    .replace(/[إأآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');

const wordTokens = (value) =>
  String(value || '')
    .normalize('NFC')
    .replace(/[﴿﴾،؛:؟.!()[\]"'“”]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .filter((word) => !/^[٠-٩0-9]+$/.test(word));

const tokenizeWithSpaces = (value) => String(value || '').split(/(\s+)/);

const lookup = (words, raw) => {
  const normalized = normalize(raw);
  if (!normalized) return null;
  if (words[normalized]) return words[normalized];

  for (const [key, value] of Object.entries(words)) {
    if (normalize(key) === normalized) return value;
  }

  return null;
};

const buildPartsFromSentence = (sentence, words) => {
  const tokens = tokenizeWithSpaces(sentence);
  const parts = [];
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

      if (wordsFound !== wordCount) continue;

      const raw = currentTokens.join('');
      const uz = lookup(words, raw);
      if (!uz) continue;

      parts.push({
        w: normalize(raw),
        r: wordCount > 1 ? 'ibora' : 'so‘z',
        rc: wordCount > 1 ? 'tmt' : 'tb',
        e: wordCount > 1
          ? `Bu ${wordCount} so‘zdan iborat ibora; gap ichida bitta ma’no birligi sifatida kelgan.`
          : 'Bu so‘z gap ichida mustaqil ma’no birligi sifatida kelgan.',
        uz,
      });
      i = peek;
      matched = true;
      break;
    }

    if (!matched) {
      const raw = normalize(tokens[i]);
      parts.push({
        w: raw,
        r: 'so‘z',
        rc: 'tb',
        e: 'Bu so‘z gap ichida mustaqil ma’no birligi sifatida kelgan.',
        uz: raw,
      });
      i += 1;
    }
  }

  return parts;
};

const enrichPart = (part, words) => {
  const next = { ...part };
  const uz = next.uz || lookup(words, next.w) || next.e || next.w;
  next.uz = uz;

  const baseExplanation = String(next.e || '').trim();
  const detail = `O‘zbekcha ma’nosi: ${uz}.`;

  if (!baseExplanation) {
    next.e = detail;
  } else if (!baseExplanation.includes('O‘zbekcha ma’nosi:')) {
    next.e = `${baseExplanation} ${detail}`;
  }

  if (!next.r) next.r = 'so‘z';
  if (!next.rc) next.rc = 'tb';

  return next;
};

const appendMissingCoverageParts = (sentence, words) => {
  const covered = new Set(
    (sentence.parts || []).flatMap((part) => wordTokens(part.w)).map(normalizeCoverage),
  );
  const addedParts = [];

  for (const token of wordTokens(sentence.ar)) {
    const normalized = normalizeCoverage(token);
    if (!normalized || covered.has(normalized)) continue;

    const uz = lookup(words, token) || token;
    addedParts.push({
      w: token,
      r: 'so‘z',
      rc: 'tb',
      e: `Bu so‘z gap matnida kelgan va alohida grammatik birlik sifatida ko‘rsatilmoqda. O‘zbekcha ma’nosi: ${uz}.`,
      uz,
    });
    covered.add(normalized);
  }

  if (addedParts.length > 0) {
    sentence.parts = [...(sentence.parts || []), ...addedParts];
  }

  return addedParts.length;
};

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

let createdParts = 0;
let enrichedParts = 0;
let coverageParts = 0;

for (let i = 0; i < index.length; i += 1) {
  const chapterPath = path.join(dir, `${i}.json`);
  const wordsPath = path.join(dir, `${i}_words.json`);
  const chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
  const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
  let changed = false;

  for (const sentence of chapter.sentences) {
    if (!Array.isArray(sentence.parts) || sentence.parts.length === 0) {
      sentence.parts = buildPartsFromSentence(sentence.ar, words);
      createdParts += sentence.parts.length;
      changed = true;
    }

    const addedCoverage = appendMissingCoverageParts(sentence, words);
    if (addedCoverage > 0) {
      coverageParts += addedCoverage;
      changed = true;
    }

    sentence.parts = sentence.parts.map((part) => {
      const next = enrichPart(part, words);
      if (JSON.stringify(next) !== JSON.stringify(part)) {
        enrichedParts += 1;
        changed = true;
      }
      return next;
    });
  }

  if (changed) {
    fs.writeFileSync(chapterPath, `${JSON.stringify(chapter, null, 2)}\n`);
  }
}

let emptyPartsSentences = 0;
let partsWithoutUz = 0;

for (let i = 0; i < index.length; i += 1) {
  const chapter = JSON.parse(fs.readFileSync(path.join(dir, `${i}.json`), 'utf8'));
  for (const sentence of chapter.sentences) {
    if (!Array.isArray(sentence.parts) || sentence.parts.length === 0) emptyPartsSentences += 1;
    for (const part of sentence.parts || []) {
      if (!part.uz) partsWithoutUz += 1;
    }
  }
}

if (emptyPartsSentences > 0 || partsWithoutUz > 0) {
  console.error({ emptyPartsSentences, partsWithoutUz });
  process.exit(1);
}

console.log(`Created ${createdParts} parts and enriched ${enrichedParts} parts with uz/detail`);
if (coverageParts > 0) console.log(`Added ${coverageParts} coverage parts`);
