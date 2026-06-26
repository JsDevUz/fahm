import fs from 'node:fs';
import { tokenize } from './tokenize-38.mjs';

const orig = JSON.parse(fs.readFileSync('/tmp/38_orig.json', 'utf8'));
const pool = JSON.parse(fs.readFileSync('scripts/38-pool-grammar.json', 'utf8'));
const s0parts = JSON.parse(fs.readFileSync('scripts/38-s0-parts.json', 'utf8'));
for (const p of s0parts) pool[p.w] = { r: p.r, rc: p.rc, e: p.e, uz: p.uz };

const UZ = {
  لا: "yo'q", ذَكَرَ: 'esladi', تَجَدَّدَ: 'yangilandi', حُزْنُ: "qayg'u", أَسَفَى: 'hasrat',
  لَامَ: 'malomat qildi', أَبْنَاؤُ: "o'g'illari", قَالُوا: 'dedilar', إِنَّكَ: 'sen', تَزَالُ: 'doimo',
  تَذْكُرُ: 'eslaysan', حَتَّى: 'gacha', تَهْلِكَ: "halok bo'lasan", إِنَّمَا: 'faqat', أَشْكُو: 'arz qilaman',
  بَثِّي: "g'amim", حُزْ: "qayg'u", أَعْلَمُ: 'bilaman', مِنَ: 'dan', تَعْلَمُونَ: 'bilmaysizlar',
  يَعْلَمُ: 'biladi', اليَأْسَ: 'noumidlik', كُفْرٌ: 'kufr', رَجَاءٌ: 'umid', أَرْسَلَ: 'yubordi',
  أَبْنَاءَ: "o'g'illarini", يَبْحَثُوا: 'qidirishlari', يَجْتَهِدُوا: 'tirishishlari', مَنَعَ: 'qaytardi',
  يَقْنَطُوا: "noumid bo'lishdan", رَحْمَةِ: 'rahmatidan', ذَهَبَ: 'ketdilar', مَرَّةً: 'marta',
  ثَالِثَةً: 'uchinchi', دَخَلُوا: 'kirdilar', شَكَوْا: 'arz qildilar', إِلَيْ: 'unga',
  فَقْرَ: 'faqirlik', مُصِيبَتَ: 'musibat', سَأَلُو: "so'radilar", الْفَضْلَ: 'fazl',
  هَاجَ: "qo'zg'aldi", الحُزْنُ: "qayg'u", الحُبُّ: 'muhabbat', يَمْلِكْ: 'tutib turolmadi',
  نَفْسَ: "o'zini", أَبْنَاءُ: "o'g'illari", الأَنْبِيَاءِ: 'payg\'ambarlar', يَشْكُونَ: 'arz qilmoqdalar',
  فَقَرَ: 'faqirlik', مَلِكٍ: 'podshohga', المُلُوكِ: 'podshohlardan', إلى: 'gacha',
  مَتَى: 'qachon', أُخْفِي: 'yashiraman', الأَمْرَ: 'ishni', أَرَى: "ko'raman", حَالَ: 'holatini',
  يَمْلِكُ: 'tutib turolmadi', يُوسُفُ: 'Yusuf', لَهُمْ: 'ularga', هَلْ: 'mi',
  عَلِمْتُم: 'bildingizmi', مَّا: 'nima', فَعَلْتُم: 'qildingiz', أَنتُمْ: 'siz',
  جَاهِلُونَ: 'johil', يَعْلَمُونَ: 'bilardilar', السِّرَّ: 'sirni', نَحْنُ: 'biz',
  فَعَلِمُوا: 'bildilar', سُبْحَانَ: 'Subhan', حَيٌّ: 'tirik', مَاتَ: "o'ldi", يا: 'ey',
  سَلامُ: 'ajab', عَزِيزُ: 'Aziz', الَّذِي: 'kim', يَأْمُرُ: 'buyurgan', لَنَا: 'bizga',
  الطَّعَامِ: 'taom', شَكٌّ: 'shubha', يُكَلِّمُ: 'gaplashadi', بْنُ: "o'g'li",
  إِنَّ: 'albatta', أَنتَ: 'sen', أَنَا: 'men', مَنَّ: 'marhamat qildi', إِنَّ: 'albatta',
  مَن: 'kim', يَتَّقِ: 'taqvo qilsa', يَصْبِرْ: 'sabr qilsa', فَإِنَّ: 'albatta',
  يُضِيعُ: 'zoye qilmaydi', أَجْرَ: 'ajrini', الْمُحْسِنِينَ: 'yaxshilik qiluvchilar', تَاللَّهِ: 'Allohga qasam',
  لَقَدْ: 'albatta', آثَرَ: 'ustun qildi', إِن: 'haqiqatan', لَخَاطِئِينَ: 'xato qilgan edik',
  فَعْلَتِ: 'qilgan ishlari', تَثْرِيبَ: 'malomat', كُمُ: 'sizlarga', الْيَوْمَ: 'bugun',
  يَغْفِرُ: 'kechirsin', لَكُمْ: 'sizlarni', أَرْحَمُ: 'eng rahmli', الرَّاحِمِينَ: 'rahmlilar',
  فَ: 'so‘ng', عَلَى: 'ga', بَلْ: 'balki', 'سَأَلُوهُ': "so'radilar",
};

const ROLES = JSON.parse(fs.readFileSync('scripts/38-role-map.json', 'utf8'));

function isAbbrev(s) {
  return !s || /^t[a-z]{1,3}$/i.test(s) || s === 'كلمة';
}

function makeE(w, r, parent) {
  const lead = `${w} — ${r} sifatida kelgan.`;
  const ctx = parent?.e
    ? ` Ushbu so‘z avvalgi iborada quyidagicha tushuntirilgan edi: ${parent.e}`
    : ' Yusuf qissasi matnida o‘z o‘rnida va to‘liq ma’no bilan ishlatilgan.';
  const text = lead + ctx;
  return text.length > 420 ? text.slice(0, 417) + '…' : text;
}

function findParent(word, groupedParts) {
  for (const p of groupedParts) {
    if (p.w === word || p.w.includes(word)) return p;
  }
  return groupedParts[0];
}

function grammarFor(word, groupedParts) {
  const parent = findParent(word, groupedParts);
  const fromPool = pool[word];
  const r = ROLES[word] ?? (fromPool && !isAbbrev(fromPool.rc) ? fromPool.r : 'اسم / فعل');
  const rc = ROLES[word] ?? (fromPool && !isAbbrev(fromPool.rc) ? fromPool.rc : r);
  const e =
    fromPool && !isAbbrev(fromPool.rc) && fromPool.e?.length > 40 && !fromPool.e.includes('iboraning ajratilgan')
      ? fromPool.e
      : makeE(word, r, parent);
  const uz = UZ[word] ?? fromPool?.uz ?? word;
  return { r, rc, e, uz };
}

const out = {
  title: orig.title,
  tuz: orig.tuz,
  sub: orig.sub,
  page: orig.page,
  sentences: orig.sentences.map((s) => {
    const tokens = tokenize(s.ar);
    const parts = tokens.map((w) => ({ w, ...grammarFor(w, s.parts) }));
    return { ar: s.ar, tr: s.tr, parts };
  }),
};

fs.writeFileSync('src/data/qisas/38.json', JSON.stringify(out, null, 2) + '\n');

const words = {};
for (const s of out.sentences) for (const p of s.parts) {
  if (!words[p.w]) words[p.w] = p.uz;
}
fs.writeFileSync('src/data/qisas/38_words.json', JSON.stringify(words, null, 2) + '\n');

const totalParts = out.sentences.reduce((n, s) => n + s.parts.length, 0);
const badRc = out.sentences.flatMap((s) => s.parts.filter((p) => isAbbrev(p.rc)).map((p) => p.w));
console.log('parts', totalParts, 'words', Object.keys(words).length, 'bad rc', badRc.length);
