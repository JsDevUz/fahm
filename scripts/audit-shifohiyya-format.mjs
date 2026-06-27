import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("src/data/shifohiyya");

const strip = (value) =>
  String(value || "")
    .replace(/[،؟?!*.،:؛﴿﴾۝\-\u0651\u064B\u064C\u064D\u0652\u0650\u064E\u064F,'"`[\]«»()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const files = fs
  .readdirSync(dir)
  .filter((file) => /^\d+\.json$/.test(file))
  .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));

const problems = [];

for (const file of files) {
  const n = Number.parseInt(file, 10);
  const chapter = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  const words = JSON.parse(fs.readFileSync(path.join(dir, `${n}_words.json`), "utf8"));
  const wordKeys = Object.keys(words);

  for (const [sentenceIndex, sentence] of (chapter.sentences || []).entries()) {
    if (!Array.isArray(sentence.parts) || sentence.parts.length === 0) {
      problems.push(`${file} sentence ${sentenceIndex}: parts missing`);
      continue;
    }

    for (const [partIndex, part] of sentence.parts.entries()) {
      const where = `${file} sentence ${sentenceIndex} part ${partIndex}`;
      if (!part.w || String(part.w).trim().split(/\s+/).length !== 1) {
        problems.push(`${where}: part.w must be one Arabic token`);
      }
      if (!part.uz || /^(so'?z|ism|fe'l|harf|word)$/i.test(String(part.uz).trim())) {
        problems.push(`${where}: part.uz missing or generic`);
      }
      if (!part.r || !part.rc || !part.e) {
        problems.push(`${where}: r/rc/e missing`);
      }
      if (!wordKeys.some((key) => strip(key) === strip(part.w))) {
        problems.push(`${where}: ${part.w} missing from words`);
      }
    }
  }
}

if (problems.length > 0) {
  console.error(`shifohiyya format problems: ${problems.length}`);
  console.error(problems.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`shifohiyya format ok: ${files.length} chapters`);
