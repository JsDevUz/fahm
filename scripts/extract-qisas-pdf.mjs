import fs from 'node:fs/promises';
import path from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdfPath = process.argv[2];
const outPath = process.argv[3] || 'tmp/qisas-pdf-pages.json';

if (!pdfPath) {
  console.error('Usage: node scripts/extract-qisas-pdf.mjs <pdf-path> [out-json]');
  process.exit(1);
}

await fs.mkdir(path.dirname(outPath), { recursive: true });

const data = new Uint8Array(await fs.readFile(pdfPath));
const pdf = await getDocument({ data, disableWorker: true }).promise;
const pages = [];

for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
  const page = await pdf.getPage(pageNumber);
  const content = await page.getTextContent();
  const lines = new Map();

  for (const item of content.items) {
    const y = Math.round(item.transform[5]);
    const x = item.transform[4];
    const line = lines.get(y) || [];
    line.push({ x, text: item.str });
    lines.set(y, line);
  }

  const text = [...lines.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, line]) =>
      line
        .sort((a, b) => b.x - a.x)
        .map((item) => item.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean)
    .join('\n');

  pages.push({ pageNumber, text });
}

await fs.writeFile(outPath, `${JSON.stringify(pages, null, 2)}\n`);
console.log(`Wrote ${pages.length} pages to ${outPath}`);
