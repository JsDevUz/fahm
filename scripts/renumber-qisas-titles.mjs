import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/qisas';
const indexPath = path.join(dir, 'index.json');

const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

const toArabicNumber = (number) =>
  String(number)
    .split('')
    .map((digit) => arabicDigits[Number(digit)])
    .join('');

const replaceTitleNumber = (title, number) => {
  const nextNumber = toArabicNumber(number);
  if (/^[٠-٩]+\s*[ـ-]\s*/.test(title)) {
    return title.replace(/^[٠-٩]+\s*[ـ-]\s*/, `${nextNumber} ـ `);
  }
  return `${nextNumber} ـ ${title}`;
};

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

for (let i = 0; i < index.length; i += 1) {
  const chapterPath = path.join(dir, `${i}.json`);
  const chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
  const nextTitle = replaceTitleNumber(chapter.title, i + 1);

  chapter.title = nextTitle;
  index[i].title = nextTitle;

  fs.writeFileSync(chapterPath, `${JSON.stringify(chapter, null, 2)}\n`);
}

fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

console.log(`Renumbered ${index.length} qisas titles`);
