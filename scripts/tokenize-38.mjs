import fs from 'node:fs';

const orig = JSON.parse(fs.readFileSync('/tmp/38_orig.json', 'utf8'));
const strip = (w) => w.replace(/[.:،؟!؟﴿﴾]/g, '');
const isAllahWord = (w) => {
  const bare = w.replace(/[\u064B-\u065F\u0670\u0651]/g, '');
  return /^الله/.test(bare) || /^تالله/.test(bare);
};

function splitPair(w, re) {
  const m = w.match(re);
  return m ? [m[1], m[2]] : null;
}

function splitAttachedPronoun(w) {
  if (isAllahWord(w)) return null;
  for (const suf of ['هُمْ', 'هِمْ', 'كُمُ', 'كُم', 'نَا', 'نِي', 'هُ', 'هِ']) {
    if (w.endsWith(suf) && w.length > suf.length + 2) return [w.slice(0, -suf.length), suf];
  }
  return null;
}

function expand(w) {
  if (isAllahWord(w)) return [w];
  if (/^أَنَّهُ$/.test(w)) return ['أَنَّ', 'هُ'];
  if (/^أَإِن/.test(w) && w.endsWith('كَ')) return ['أَ', 'إِنَّ', 'كَ'];
  if (/^أَمَا$/.test(w)) return ['أَ', 'مَا'];
  if (/^لَأَ/.test(w)) return ['لَ', 'أَنتَ'];
  if (w === 'إِنَّمَا') return ['إِنَّمَا'];
  if (/^فَإِنَّ/.test(w)) return ['فَ', 'إِنَّ', w.slice(4)];
  if (/^إِنَّكَ$/.test(w)) return ['إِنَّ', 'كَ'];
  if (/^إِنَّهُ$/.test(w)) return ['إِنَّ', 'هُ'];

  let parts = [w];
  if (w.startsWith('وَ') && w.length > 2) parts = ['وَ', w.slice(2)];
  else if (/^فَذ/.test(w)) parts = ['فَ', w.slice(2)];
  else if (w.startsWith('لِ') && w.length > 2) parts = ['لِ', w.slice(2)];
  else if (w.startsWith('بِ') && w.length > 2) parts = ['بِ', w.slice(2)];
  else if (w.startsWith('وَإِ')) parts = ['وَ', w.slice(2)];

  const pairRes = [
    /^(لَامَ)(هُ)$/,
    /^(أَبْنَاؤُ)(هُ)$/,
    /^(حُزْنُ)(هُ)$/,
    /^(حُزْ)(نِي)$/,
    /^(إِنَّ)(كَ)$/,
    /^(عَنْ)(هُمْ)$/,
    /^(حَالَ)(هُمْ)$/,
    /^(فَقْرَ)(هُمْ)$/,
    /^(مُصِيبَتَ)(هُمْ)$/,
    /^(فَعْلَتِ)(هِمْ)$/,
    /^(عِنْدَ)(هُمْ)$/,
    /^(عَلَيْ)(نَا)$/,
    /^(عَلَيْ)(كُمُ)$/,
    /^(عَلَيْ)(هِ)$/,
    /^(بِ)(يُوسُفَ)$/,
    /^(بِ)(أَخِيهِ)$/,
    /^(لِ)(هُمْ)$/,
    /^(لَ)(هُ)$/,
    /^(آثَرَ)(كَ)$/,
    /^(يُكَلِّمُ)(هُمْ)$/,
    /^(يَعْلَمُ)(هُ)$/,
    /^(مَنَعَ)(هُمْ)$/,
    /^(أَبْنَاءَ)(هُ)$/,
    /^(نَفْسَ)(هُ)$/,
    /^(صَدْرِ)(هِ)$/,
    /^(لَامَ)(هُمْ)$/,
    /^(سَأَلُو)(هُ)$/,
    /^(إِلَيْ)(هِ)$/,
  ];

  return parts.flatMap((p) => {
    for (const re of pairRes) {
      const s = splitPair(p, re);
      if (s) return s;
    }
    const pron = splitAttachedPronoun(p);
    if (pron) return pron;
    return [p];
  });
}

export function tokenize(ar) {
  return ar
    .replace(/[﴿﴾]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((t) => expand(strip(t)))
    .filter(Boolean);
}

if (process.argv[1]?.endsWith('tokenize-38.mjs')) {
  orig.sentences.forEach((s, i) => {
    console.log(i, JSON.stringify(tokenize(s.ar)));
  });
}
