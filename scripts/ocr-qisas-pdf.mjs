import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const run = promisify(execFile);

const pdfPath = process.argv[2];
const outPath = process.argv[3] || 'src/data/qisas_pdf_ocr.txt';
const fromPage = Number(process.argv[4] || 9);
const toPage = Number(process.argv[5] || 52);

if (!pdfPath) {
  console.error('Usage: node scripts/ocr-qisas-pdf.mjs <pdf-path> [out-txt] [from-page] [to-page]');
  process.exit(1);
}

const tessdataDir = path.resolve('tmp/tessdata');
const imageDir = path.resolve('tmp/qisas-ocr-images');
const textDir = path.resolve('tmp/qisas-ocr-pages');

await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.mkdir(imageDir, { recursive: true });
await fs.mkdir(textDir, { recursive: true });

const data = new Uint8Array(await fs.readFile(pdfPath));
const wasmUrl = `${path.resolve('node_modules/pdfjs-dist/wasm')}/`;
const pdf = await getDocument({ data, disableWorker: true, wasmUrl }).promise;
const pageTexts = [];

for (let pageNumber = fromPage; pageNumber <= Math.min(toPage, pdf.numPages); pageNumber += 1) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 3 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext('2d');

  await page.render({ canvasContext: context, viewport }).promise;

  const imagePath = path.join(imageDir, `page-${String(pageNumber).padStart(3, '0')}.png`);
  const textBase = path.join(textDir, `page-${String(pageNumber).padStart(3, '0')}`);
  await fs.writeFile(imagePath, canvas.toBuffer('image/png'));

  await run(
    'tesseract',
    [imagePath, textBase, '-l', 'ara', '--psm', '6'],
    { env: { ...process.env, TESSDATA_PREFIX: tessdataDir } },
  );

  const text = await fs.readFile(`${textBase}.txt`, 'utf8');
  pageTexts.push(`\n===== PDF page ${pageNumber} =====\n${text.trim()}\n`);
  console.log(`OCR page ${pageNumber}`);
}

await fs.writeFile(outPath, `${pageTexts.join('\n').trim()}\n`);
console.log(`Wrote OCR text to ${outPath}`);
