import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/qisas';

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
const writeJson = (file, data) => {
  fs.writeFileSync(path.join(dir, file), `${JSON.stringify(data, null, 2)}\n`);
};

const s = (ar, tr) => ({ ar, tr, parts: [] });

const current = Array.from({ length: 54 }, (_, i) => readJson(`${i}.json`));
const currentWords = Array.from({ length: 54 }, (_, i) => readJson(`${i}_words.json`));

current[7].sentences.push(
  s('وَأَنَّ اللَّهَ رَبُّ الْعَالَمِينَ!.', 'Va Alloh olamlarning Robbisidir!'),
  s('وَهَدَى اللَّهُ إِبْرَاهِيمَ وَجَعَلَهُ نَبِيًّا وَخَلِيلًا.', 'Alloh Ibrohimni hidoyat qildi va uni payg‘ambar hamda xalil qildi.'),
  s('وَأَمَرَ اللَّهُ إِبْرَاهِيمَ أَنْ يَدْعُوَ قَوْمَهُ وَيَمْنَعَهُمْ مِنْ عِبَادَةِ الْأَصْنَامِ.', 'Alloh Ibrohimga qavmini da’vat qilishni va ularni butlarga ibodat qilishdan qaytarishni buyurdi.'),
);
currentWords[7]['رَبُّ الْعَالَمِينَ'] = 'olamlarning Robbisi';
currentWords[7]['وَهَدَى'] = 'hidoyat qildi';
currentWords[7]['نَبِيًّا'] = 'payg‘ambar';
currentWords[7]['خَلِيلًا'] = 'xalil, do‘st';
currentWords[7]['وَأَمَرَ'] = 'buyurdi';
currentWords[7]['يَدْعُوَ'] = 'da’vat qilishni';
currentWords[7]['قَوْمَهُ'] = 'qavmini';
currentWords[7]['وَيَمْنَعَهُمْ'] = 'ularni qaytarishni';
currentWords[7]['مِنْ عِبَادَةِ الْأَصْنَامِ'] = 'butlarga ibodat qilishdan';

const chapter9 = {
  title: '٩ ـ دَعْوَةُ إِبْرَاهِيمَ',
  tuz: 'Ibrohimning da’vati',
  sub: 'Ibrohim qavmini Allohga chaqiradi',
  page: 17,
  sentences: [
    s('وَدَعَا إِبْرَاهِيمُ قَوْمَهُ إِلَى اللَّهِ وَمَنَعَهُمْ مِنْ عِبَادَةِ الْأَصْنَامِ.', 'Ibrohim qavmini Allohga chaqirdi va ularni butlarga ibodat qilishdan qaytardi.'),
    s('قَالَ إِبْرَاهِيمُ لِقَوْمِهِ: مَا تَعْبُدُونَ؟', 'Ibrohim qavmiga dedi: Nimaga ibodat qilyapsizlar?'),
    s('قَالُوا: نَعْبُدُ أَصْنَامًا.', 'Ular dedilar: Butlarga ibodat qilamiz.'),
    s('قَالَ إِبْرَاهِيمُ: هَلْ يَسْمَعُونَكُمْ إِذْ تَدْعُونَ؟', 'Ibrohim dedi: Ular sizlarni chaqirganingizda eshitadilarmi?'),
    s('أَوْ يَنْفَعُونَكُمْ أَوْ يَضُرُّونَ؟', 'Yoki sizlarga foyda yoki zarar yetkazadilarmi?'),
    s('قَالُوا: بَلْ وَجَدْنَا آبَاءَنَا كَذَلِكَ يَفْعَلُونَ.', 'Ular dedilar: Yo‘q, biz otalarimizni shunday qilayotgan holda topdik.'),
    s('قَالَ إِبْرَاهِيمُ: فَأَنَا لَا أَعْبُدُ هَذِهِ الْأَصْنَامَ.', 'Ibrohim dedi: Men bu butlarga ibodat qilmayman.'),
    s('بَلْ أَنَا عَدُوٌّ لِهَذِهِ الْأَصْنَامِ.', 'Balki men bu butlarning dushmaniman.'),
    s('أَنَا أَعْبُدُ رَبَّ الْعَالَمِينَ.', 'Men olamlarning Robbisiga ibodat qilaman.'),
    s('الَّذِي خَلَقَنِي فَهُوَ يَهْدِينِ.', 'U meni yaratgan, bas U meni hidoyat qiladi.'),
    s('وَالَّذِي هُوَ يُطْعِمُنِي وَيَسْقِينِ.', 'U menga taom beradi va suv beradi.'),
    s('وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ.', 'Kasal bo‘lsam, U menga shifo beradi.'),
    s('وَالَّذِي يُمِيتُنِي ثُمَّ يُحْيِينِ.', 'U meni o‘ldiradi, so‘ng tiriltiradi.'),
    s('وَإِنَّ الْأَصْنَامَ لَا تَخْلُقُ وَلَا تَهْدِي.', 'Butlar yaratmaydi va hidoyat qilmaydi.'),
    s('وَإِنَّهَا لَا تُطْعِمُ أَحَدًا وَلَا تَسْقِي.', 'Ular hech kimni ovqatlantirmaydi va suv bermaydi.'),
    s('وَإِذَا مَرِضَ أَحَدٌ فَهِيَ لَا تَشْفِي.', 'Biror kishi kasal bo‘lsa, ular shifo bermaydi.'),
    s('وَإِنَّهَا لَا تُمِيتُ أَحَدًا وَلَا تُحْيِي.', 'Ular hech kimni o‘ldirmaydi va tiriltirmaydi.'),
  ],
  bookId: 'qisas',
};

const chapter9Words = {
  'وَدَعَا': 'da’vat qildi',
  'قَوْمَهُ': 'qavmini',
  'إِلَى اللَّهِ': 'Allohga',
  'وَمَنَعَهُمْ': 'ularni qaytardi',
  'مِنْ عِبَادَةِ الْأَصْنَامِ': 'butlarga ibodat qilishdan',
  'مَا تَعْبُدُونَ': 'nimaga ibodat qilyapsizlar',
  'نَعْبُدُ': 'ibodat qilamiz',
  'أَصْنَامًا': 'butlarga',
  'هَلْ يَسْمَعُونَكُمْ': 'sizlarni eshitadilarmi',
  'إِذْ تَدْعُونَ': 'chaqirganingizda',
  'يَنْفَعُونَكُمْ': 'sizlarga foyda beradilar',
  'يَضُرُّونَ': 'zarar beradilar',
  'وَجَدْنَا': 'topdik',
  'آبَاءَنَا': 'otalarimizni',
  'كَذَلِكَ يَفْعَلُونَ': 'shunday qilayotgan',
  'لَا أَعْبُدُ': 'ibodat qilmayman',
  'عَدُوٌّ': 'dushman',
  'رَبَّ الْعَالَمِينَ': 'olamlarning Robbisi',
  'خَلَقَنِي': 'meni yaratdi',
  'يَهْدِينِ': 'meni hidoyat qiladi',
  'يُطْعِمُنِي': 'menga taom beradi',
  'يَسْقِينِ': 'menga suv beradi',
  'مَرِضْتُ': 'kasal bo‘ldim',
  'يَشْفِينِ': 'menga shifo beradi',
  'يُمِيتُنِي': 'meni o‘ldiradi',
  'يُحْيِينِ': 'meni tiriltiradi',
  'لَا تَخْلُقُ': 'yaratmaydi',
  'لَا تَهْدِي': 'hidoyat qilmaydi',
  'لَا تُطْعِمُ': 'ovqatlantirmaydi',
  'لَا تَسْقِي': 'suv bermaydi',
  'لَا تَشْفِي': 'shifo bermaydi',
  'لَا تُحْيِي': 'tiriltirmaydi',
};

const chapter10 = {
  title: '١٠ ـ أَمَامَ الْمَلِكِ',
  tuz: 'Podshoh oldida',
  sub: 'Ibrohim zolim podshoh bilan bahslashadi',
  page: 18,
  sentences: [
    s('كَانَ فِي الْمَدِينَةِ مَلِكٌ كَبِيرٌ جِدًّا، وَظَالِمٌ جِدًّا.', 'Shaharda juda katta va juda zolim bir podshoh bor edi.'),
    s('وَكَانَ النَّاسُ يَسْجُدُونَ لِلْمَلِكِ.', 'Odamlar podshohga sajda qilar edilar.'),
    s('وَسَمِعَ الْمَلِكُ أَنَّ إِبْرَاهِيمَ يَسْجُدُ لِلَّهِ وَلَا يَسْجُدُ لِأَحَدٍ.', 'Podshoh Ibrohim Allohga sajda qilib, hech kimga sajda qilmasligini eshitdi.'),
    s('فَغَضِبَ الْمَلِكُ وَطَلَبَ إِبْرَاهِيمَ.', 'Podshoh g‘azablandi va Ibrohimni chaqirtirdi.'),
    s('وَجَاءَ إِبْرَاهِيمُ، وَكَانَ إِبْرَاهِيمُ لَا يَخَافُ أَحَدًا، إِلَّا اللَّهَ.', 'Ibrohim keldi; Ibrohim Allohdan boshqa hech kimdan qo‘rqmas edi.'),
    s('قَالَ الْمَلِكُ: مَنْ رَبُّكَ يَا إِبْرَاهِيمُ؟', 'Podshoh dedi: Ey Ibrohim, Robbing kim?'),
    s('قَالَ إِبْرَاهِيمُ: رَبِّيَ اللَّهُ!', 'Ibrohim dedi: Robbim Alloh!'),
    s('قَالَ الْمَلِكُ: مَنِ اللَّهُ يَا إِبْرَاهِيمُ؟', 'Podshoh dedi: Ey Ibrohim, Alloh kim?'),
    s('قَالَ إِبْرَاهِيمُ: الَّذِي يُحْيِي وَيُمِيتُ.', 'Ibrohim dedi: Tiriltiradigan va o‘ldiradigan Zot.'),
    s('قَالَ الْمَلِكُ: أَنَا أُحْيِي وَأُمِيتُ.', 'Podshoh dedi: Men tiriltiraman va o‘ldiraman.'),
    s('وَدَعَا الْمَلِكُ رَجُلًا وَقَتَلَهُ.', 'Podshoh bir kishini chaqirdi va uni o‘ldirdi.'),
    s('وَدَعَا رَجُلًا آخَرَ وَتَرَكَهُ.', 'Yana boshqa bir kishini chaqirdi va uni qo‘yib yubordi.'),
    s('وَقَالَ: أَنَا أُحْيِي وَأُمِيتُ، قَتَلْتُ رَجُلًا وَتَرَكْتُ رَجُلًا.', 'U dedi: Men tiriltiraman va o‘ldiraman: bir kishini o‘ldirdim, bir kishini qo‘yib yubordim.'),
    s('وَكَانَ الْمَلِكُ بَلِيدًا جِدًّا، وَكَذَلِكَ كُلُّ مُشْرِكٍ.', 'Podshoh juda nodon edi; har bir mushrik shundaydir.'),
    s('وَأَرَادَ إِبْرَاهِيمُ أَنْ يُفْهِمَ الْمَلِكَ، وَيُفْهِمَ قَوْمَهُ.', 'Ibrohim podshohni va qavmini tushuntirmoqchi bo‘ldi.'),
    s('فَقَالَ إِبْرَاهِيمُ لِلْمَلِكِ: فَإِنَّ اللَّهَ يَأْتِي بِالشَّمْسِ مِنَ الْمَشْرِقِ فَأْتِ بِهَا مِنَ الْمَغْرِبِ.', 'Ibrohim podshohga dedi: Alloh quyoshni sharqdan chiqaradi, sen uni g‘arbdan chiqarib ko‘r.'),
    s('فَتَحَيَّرَ الْمَلِكُ وَسَكَتَ.', 'Podshoh hayron qoldi va jim bo‘ldi.'),
    s('وَخَجِلَ الْمَلِكُ، وَمَا وَجَدَ جَوَابًا.', 'Podshoh uyaldi va javob topa olmadi.'),
  ],
  bookId: 'qisas',
};

const chapter10Words = {
  'الْمَدِينَةِ': 'shahar',
  'مَلِكٌ': 'podshoh',
  'ظَالِمٌ': 'zolim',
  'لِلْمَلِكِ': 'podshohga',
  'وَسَمِعَ': 'eshitdi',
  'يَسْجُدُ لِلَّهِ': 'Allohga sajda qiladi',
  'لَا يَسْجُدُ لِأَحَدٍ': 'hech kimga sajda qilmaydi',
  'فَغَضِبَ': 'g‘azablandi',
  'وَطَلَبَ': 'chaqirtirdi',
  'لَا يَخَافُ': 'qo‘rqmaydi',
  'إِلَّا اللَّهَ': 'Allohdan boshqa',
  'مَنْ رَبُّكَ': 'Robbing kim',
  'رَبِّيَ اللَّهُ': 'Robbim Alloh',
  'مَنِ اللَّهُ': 'Alloh kim',
  'يُحْيِي': 'tiriltiradi',
  'يُمِيتُ': 'o‘ldiradi',
  'أُحْيِي': 'tiriltiraman',
  'أُمِيتُ': 'o‘ldiraman',
  'رَجُلًا': 'bir kishi',
  'وَقَتَلَهُ': 'uni o‘ldirdi',
  'آخَرَ': 'boshqa',
  'وَتَرَكَهُ': 'uni qo‘yib yubordi',
  'قَتَلْتُ': 'o‘ldirdim',
  'تَرَكْتُ': 'qo‘yib yubordim',
  'بَلِيدًا': 'nodon',
  'مُشْرِكٍ': 'mushrik',
  'يُفْهِمَ': 'tushuntirishni',
  'يَأْتِي': 'olib keladi, chiqaradi',
  'بِالشَّمْسِ': 'quyoshni',
  'مِنَ الْمَشْرِقِ': 'sharqdan',
  'مِنَ الْمَغْرِبِ': 'g‘arbdan',
  'فَتَحَيَّرَ': 'hayron qoldi',
  'وَسَكَتَ': 'jim bo‘ldi',
  'وَخَجِلَ': 'uyaldi',
  'جَوَابًا': 'javob',
};

const chapter11 = {
  title: '١١ ـ دَعْوَةُ الْوَالِدِ',
  tuz: 'Otani da’vat qilish',
  sub: 'Ibrohim otasini Allohga ibodat qilishga chaqiradi',
  page: 20,
  sentences: [
    s('وَأَرَادَ إِبْرَاهِيمُ أَنْ يَدْعُوَ وَالِدَهُ أَيْضًا، فَقَالَ لَهُ: يَا أَبَتِ لِمَ تَعْبُدُ مَا لَا يَسْمَعُ وَلَا يُبْصِرُ؟', 'Ibrohim otasini ham da’vat qilmoqchi bo‘ldi va unga dedi: Ey otajon, nega eshitmaydigan va ko‘rmaydigan narsaga ibodat qilasan?'),
    s('وَلِمَ تَعْبُدُ مَا لَا يَنْفَعُ وَلَا يَضُرُّ؟!', 'Nega foyda ham, zarar ham bermaydigan narsaga ibodat qilasan?!'),
    s('يَا أَبَتِ لَا تَعْبُدِ الشَّيْطَانَ!', 'Ey otajon, shaytonga ibodat qilma!'),
    s('يَا أَبَتِ اعْبُدِ الرَّحْمَنَ!', 'Ey otajon, Rahmonga ibodat qil!'),
    s('وَغَضِبَ وَالِدُ إِبْرَاهِيمَ، وَقَالَ: أَنَا أَضْرِبُكَ، فَاتْرُكْنِي وَلَا تَقُلْ شَيْئًا.', 'Ibrohimning otasi g‘azablandi va dedi: Men seni uraman, meni tinch qo‘y va hech narsa dema.'),
    s('وَكَانَ إِبْرَاهِيمُ حَلِيمًا، فَقَالَ لِوَالِدِهِ: سَلَامٌ عَلَيْكَ.', 'Ibrohim halim edi, otasiga dedi: Senga salom.'),
    s('وَقَالَ لَهُ: أَنَا أَذْهَبُ مِنْ هُنَا وَأَدْعُو رَبِّي.', 'Unga dedi: Men bu yerdan ketaman va Robbimga duo qilaman.'),
    s('وَتَأَسَّفَ إِبْرَاهِيمُ جِدًّا، وَأَرَادَ أَنْ يَذْهَبَ إِلَى بَلَدٍ آخَرَ، وَيَعْبُدَ رَبَّهُ، وَيَدْعُو النَّاسَ إِلَى اللَّهِ.', 'Ibrohim juda afsuslandi va boshqa yurtga ketib, Robbisiga ibodat qilishni hamda odamlarni Allohga chaqirishni xohladi.'),
  ],
  bookId: 'qisas',
};

const chapter11Words = {
  'يَدْعُوَ': 'da’vat qilishni',
  'وَالِدَهُ': 'otasini',
  'أَيْضًا': 'ham',
  'يَا أَبَتِ': 'ey otajon',
  'لِمَ': 'nega',
  'تَعْبُدُ': 'ibodat qilasan',
  'لَا يَسْمَعُ': 'eshitmaydi',
  'لَا يُبْصِرُ': 'ko‘rmaydi',
  'لَا يَنْفَعُ': 'foyda bermaydi',
  'لَا يَضُرُّ': 'zarar bermaydi',
  'لَا تَعْبُدِ': 'ibodat qilma',
  'الشَّيْطَانَ': 'shayton',
  'اعْبُدِ': 'ibodat qil',
  'الرَّحْمَنَ': 'Rahmon',
  'وَغَضِبَ': 'g‘azablandi',
  'وَالِدُ إِبْرَاهِيمَ': 'Ibrohimning otasi',
  'أَضْرِبُكَ': 'seni uraman',
  'فَاتْرُكْنِي': 'meni tinch qo‘y',
  'لَا تَقُلْ شَيْئًا': 'hech narsa dema',
  'حَلِيمًا': 'halim, yumshoq',
  'سَلَامٌ عَلَيْكَ': 'senga salom',
  'أَذْهَبُ': 'ketaman',
  'مِنْ هُنَا': 'bu yerdan',
  'وَأَدْعُو رَبِّي': 'Robbimga duo qilaman',
  'وَتَأَسَّفَ': 'afsuslandi',
  'بَلَدٍ آخَرَ': 'boshqa yurt',
  'وَيَعْبُدَ رَبَّهُ': 'Robbisiga ibodat qilishni',
};

const chapter50Page = {
  title: '٥٠ ـ يُوسُفُ يَطْلُبُ بِنْيَامِينَ',
  tuz: 'Yusuf Binyominni so‘raydi',
  sub: 'Yusuf aka-ukalaridan Binyominni olib kelishni talab qiladi',
  page: 50,
  sentences: [
    s('وَأَرَادَ اللَّهُ أَنْ يَمْتَحِنَ يَعْقُوبَ مَرَّةً ثَانِيَةً.', 'Alloh Ya’qubni yana bir bor sinamoqchi bo‘ldi.'),
    s('وَقَالَ لَهُمْ: ائْتُونِي بِأَخٍ لَكُمْ مِنْ أَبِيكُمْ.', 'Yusuf ularga dedi: Otangiz tomondan bo‘lgan ukangizni menga olib keling.'),
    s('وَلَا تَجِدُونَ طَعَامًا إِذَا لَمْ تَأْتُوا بِهِ.', 'Agar uni olib kelmasangiz, oziq-ovqat topmaysizlar.'),
    s('وَأَمَرَ يُوسُفُ بِمَالِهِمْ فَوُضِعَ فِي مَتَاعِهِمْ.', 'Yusuf ularning pullarini yuklariga qaytarib solishni buyurdi.'),
    s('وَرَجَعُوا إِلَى أَبِيهِمْ وَأَخْبَرُوهُ بِالْخَبَرِ.', 'Ular otalarining oldiga qaytib, xabarni aytdilar.'),
    s('وَطَلَبُوا مِنْ يَعْقُوبَ بِنْيَامِينَ وَقَالُوا: وَإِنَّا لَهُ لَحَافِظُونَ.', 'Ular Ya’qubdan Binyominni so‘radilar va dedilar: Biz uni albatta asraymiz.'),
    s('قَالَ يَعْقُوبُ: هَلْ آمَنُكُمْ عَلَيْهِ إِلَّا كَمَا أَمِنْتُكُمْ عَلَى أَخِيهِ مِنْ قَبْلُ؟', 'Ya’qub dedi: Men uni sizlarga avval uning akasini ishonganimdek ishonaymi?'),
    s('هَلْ نَسِيتُمْ قِصَّةَ يُوسُفَ؟', 'Yusuf qissasini unutdingizmi?'),
    s('أَتَحْفَظُونَ بِنْيَامِينَ كَمَا حَفِظْتُمْ يُوسُفَ؟', 'Binyominni Yusufni asraganingizdek asraysizlarmi?'),
  ],
  bookId: 'qisas',
};

const chapter50Words = {
  'يَمْتَحِنَ': 'sinashni',
  'مَرَّةً ثَانِيَةً': 'ikkinchi marta',
  'ائْتُونِي': 'menga olib kelinglar',
  'بِأَخٍ لَكُمْ': 'sizlarning ukangizni',
  'مِنْ أَبِيكُمْ': 'otangiz tomondan',
  'لَا تَجِدُونَ': 'topmaysizlar',
  'طَعَامًا': 'oziq-ovqat',
  'لَمْ تَأْتُوا بِهِ': 'uni olib kelmasangiz',
  'وَأَمَرَ': 'buyurdi',
  'بِمَالِهِمْ': 'ularning pullarini',
  'فَوُضِعَ': 'solindi',
  'فِي مَتَاعِهِمْ': 'yuklariga',
  'وَرَجَعُوا': 'qaytdilar',
  'إِلَى أَبِيهِمْ': 'otalari oldiga',
  'وَأَخْبَرُوهُ': 'unga xabar berdilar',
  'بِالْخَبَرِ': 'xabarni',
  'وَطَلَبُوا': 'so‘radilar',
  'مِنْ يَعْقُوبَ': 'Ya’qubdan',
  'بِنْيَامِينَ': 'Binyominni',
  'لَحَافِظُونَ': 'albatta asrovchilarmiz',
  'آمَنُكُمْ': 'sizlarga ishonaman',
  'عَلَيْهِ': 'u haqida',
  'كَمَا': 'xuddi',
  'أَخِيهِ': 'uning akasi',
  'مِنْ قَبْلُ': 'avval',
  'نَسِيتُمْ': 'unutdingiz',
  'قِصَّةَ يُوسُفَ': 'Yusuf qissasini',
  'أَتَحْفَظُونَ': 'asraysizlarmi',
};

current[9] = {
  ...current[9],
  title: '١٢ ـ إِلَى مَكَّةَ',
  tuz: 'Makkaga',
  sub: 'Ibrohim Makkaga yo‘l oladi',
  page: 21,
};

current[10] = {
  ...current[10],
  title: '١٣ ـ بِئْرُ زَمْزَمَ',
  tuz: 'Zamzam qudug‘i',
  page: 22,
};
current[11] = { ...current[11], title: '١٤ ـ رُؤْيَا إِبْرَاهِيمَ' };
current[12] = { ...current[12], title: '١٥ ـ ذَبْحُ إِسْمَاعِيلَ' };
current[13] = { ...current[13], title: '١٦ ـ بِنَاءُ الْكَعْبَةِ' };
current[14] = { ...current[14], title: '١٧ ـ بَيْتُ الْمَقْدِسِ' };

const next = [];
const nextWords = [];
for (let i = 0; i <= 7; i += 1) {
  next[i] = current[i];
  nextWords[i] = currentWords[i];
}
next[8] = chapter9;
nextWords[8] = chapter9Words;
next[9] = chapter10;
nextWords[9] = chapter10Words;
next[10] = chapter11;
nextWords[10] = chapter11Words;
for (let i = 9; i <= 44; i += 1) {
  next[i + 2] = current[i];
  nextWords[i + 2] = currentWords[i];
}
for (let i = 46; i <= 49; i += 1) {
  next[i + 1] = current[i];
  nextWords[i + 1] = currentWords[i];
}
next[51] = chapter50Page;
nextWords[51] = chapter50Words;
for (let i = 51; i <= 53; i += 1) {
  next[i + 1] = current[i];
  nextWords[i + 1] = currentWords[i];
}

for (let i = 0; i < next.length; i += 1) {
  const chapter = next[i];
  chapter.bookId = 'qisas';
  const words = nextWords[i] || {};
  if (words['آزَرُ'] === 'Ega') words['آزَرُ'] = 'Ozar';
  if (words['لِلْمَلِكِ'] === 'podshohning') words['لِلْمَلِكِ'] = 'podshohga';

  for (const sentence of chapter.sentences || []) {
    if (sentence.ar?.includes('فِي التَّدْوِينِ')) {
      sentence.ar = sentence.ar.replace('فِي التَّدْوِينِ', 'فِي السَّمَاوَاتِ');
    }
    if (sentence.ar?.includes('وَتَخَرَّجَ الرَّجُلَانِ')) {
      sentence.ar = sentence.ar.replace('وَتَخَرَّجَ الرَّجُلَانِ', 'وَخَرَجَ الرَّجُلَانِ');
    }
    for (const part of sentence.parts || []) {
      if (part.w === 'فِي التَّدْوِينِ') {
        part.w = 'فِي السَّمَاوَاتِ';
        part.e = 'Osmonlarda';
      }
      if (part.w === 'وَتَخَرَّجَ') {
        part.w = 'وَخَرَجَ';
        part.e = 'Chiqdi';
      }
    }
  }
  if (words['فِي التَّدْوِينِ']) {
    delete words['فِي التَّدْوِينِ'];
    words['فِي السَّمَاوَاتِ'] = 'osmonlarda';
  }
  if (words['وَتَخَرَّجَ']) {
    delete words['وَتَخَرَّجَ'];
    words['وَخَرَجَ'] = 'chiqdi';
  }

  writeJson(`${i}.json`, chapter);
  writeJson(`${i}_words.json`, words);
}

const index = next.map((chapter, i) => ({
  id: `qisas-${i}`,
  title: chapter.title,
  tuz: chapter.tuz,
  sub: chapter.sub,
  page: chapter.page,
  sentenceCount: chapter.sentences.length,
}));
writeJson('index.json', index);

console.log(`Repaired ${next.length} qisas chapters`);
