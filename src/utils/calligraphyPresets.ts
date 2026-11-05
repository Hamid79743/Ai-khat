import { CalligraphyStyleInfo, SampleMasterpiece } from '../types/calligraphy';

export const CALLIGRAPHY_STYLES: Record<string, CalligraphyStyleInfo> = {
  thuluth: {
    id: 'thuluth',
    name: 'Thuluth',
    arabicName: 'الثلث',
    fontClass: 'font-thuluth',
    fontFamily: "'Amiri', 'Scheherazade New', serif",
    period: 'Abbasid (10th C.) / Ottoman Golden Age',
    description: 'The "King of Scripts". Majestic, monumental proportions, dramatic tall ascenders with distinctive leftward hooks (tarwees), and deep curving descenders.',
    qalamAngle: '60° – 70°',
    alifHeightDots: '7 – 9 Nuqāt (dots)',
    difficulty: 'Master',
    characteristics: [
      'Ascenders feature distinctive Tarwees (leftward barbed hooks)',
      '1/3 thickness ratio (giving it the name Thuluth / Third)',
      'Intertwining letter compositions (Tarkib) with abundant decorative harakat',
      'Sweeping tail descenders (Waw, Ra, Nun)'
    ],
    sampleText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
  },
  naskh: {
    id: 'naskh',
    name: 'Naskh',
    arabicName: 'النسخ',
    fontClass: 'font-naskh',
    fontFamily: "'Amiri', serif",
    period: 'Abbasid (10th C.) to Present',
    description: 'The supreme script of the Holy Quran. Celebrated for rhythmic balance, crystalline legibility, and geometric purity established by Ibn Muqla.',
    qalamAngle: '45° – 50°',
    alifHeightDots: '5 Nuqāt (dots)',
    difficulty: 'Intermediate',
    characteristics: [
      'Perfect horizontal baseline rhythm',
      'Alif stands straight at 5 dots high without heavy curve',
      'Small, round open letter heads (Fa, Qaf, Ayn)',
      'Primary script for books, scriptures, and holy texts'
    ],
    sampleText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ'
  },
  diwani: {
    id: 'diwani',
    name: 'Diwani',
    arabicName: 'الديواني',
    fontClass: 'font-diwani',
    fontFamily: "'Marhey', 'Amiri', cursive",
    period: 'Ottoman Imperial Chancellery (16th C.)',
    description: 'Cursive imperial script developed for secret royal decrees (Firmans). Known for soaring, flamboyant ascenders, playful curves, and overlapping lines.',
    qalamAngle: '35° – 45°',
    alifHeightDots: '6 – 8 Nuqāt (dots)',
    difficulty: 'Intermediate',
    characteristics: [
      'Dramatic upward and downward swooping ascenders',
      'Extreme cursive connectedness and steep baseline slant',
      'Absence of vowel marks in basic Diwani; dense gold dots in Diwani Jali',
      'Conceals secrets through intertwined, encrypted flourishes'
    ],
    sampleText: 'وَقُل رَّبِّ زِدْنِي عِلْمًا'
  },
  ruqaa: {
    id: 'ruqaa',
    name: "Ruq'ah",
    arabicName: 'الرقعة',
    fontClass: 'font-ruqaa',
    fontFamily: "'Aref Ruqaa', serif",
    period: 'Ottoman Administrative (19th C.)',
    description: 'The most swift, practical, and geometric classical script. Characterized by straight horizontal strokes, short stems, and conjoined dots.',
    qalamAngle: '30° – 35°',
    alifHeightDots: '3 Nuqāt (dots)',
    difficulty: 'Beginner',
    characteristics: [
      'Alif is short (3 dots) and perfectly straight',
      'Dots are joined together as slashes (two dots = line; three dots = caret ^)',
      'Letter heads are filled in / solid (Mīm, Waw, Fā)',
      'Sharp corners and clean diagonal descents'
    ],
    sampleText: 'مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ'
  },
  kufic: {
    id: 'kufic',
    name: 'Kufic',
    arabicName: 'الكوفي',
    fontClass: 'font-kufic',
    fontFamily: "'Reem Kufi', sans-serif",
    period: 'Umayyad & Early Islamic (7th C.)',
    description: 'The earliest historic Arabic script, born in Kufa. Distinctly architectural, angular, and rectilinear, celebrated in stone carvings, coins, and early Quran folios.',
    qalamAngle: '90° / Architectural Compass',
    alifHeightDots: 'Geometric proportions',
    difficulty: 'Intermediate',
    characteristics: [
      'Rigid horizontal baselines and upright vertical stems',
      'Squared, rectilinear geometry without diagonal slants',
      'Can be Floriated (with leaf flourishes) or Plaited / Knotted (interlaced)',
      'Ancient monumental and architectural gravitas'
    ],
    sampleText: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالأَرْضِ'
  },
  nastaliq: {
    id: 'nastaliq',
    name: 'Nastaliq',
    arabicName: 'النستعليق',
    fontClass: 'font-nastaliq',
    fontFamily: "'Noto Nastaliq Urdu', 'Gulzar', serif",
    period: 'Persian / Timurid (14th C.)',
    description: 'The "Bride of Calligraphy Scripts". Created by Mir Ali Tabrizi by combining Naskh and Ta\'liq. Famous for hanging diagonal baselines and teardrop curves.',
    qalamAngle: '55° – 60°',
    alifHeightDots: '3 Nuqāt (dots)',
    difficulty: 'Master',
    characteristics: [
      'Cascading diagonal baseline sloping downward from top-right to bottom-left',
      'Fluid teardrop strokes and sweeping deep bowls for letters like Sin and Ya',
      'Subtle transitions from razor-sharp hair strokes to heavy swells',
      'The definitive script for classical poetry and divans'
    ],
    sampleText: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ'
  }
};

export const QUICK_PHRASES = [
  {
    label: 'Basmala',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the name of God, the Most Gracious, the Most Merciful',
    category: 'Sacred'
  },
  {
    label: 'Hamdala',
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    translation: 'All praise is due to God alone, the Lord of all realms',
    category: 'Sacred'
  },
  {
    label: 'Ayat al-Kursi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    translation: 'God! There is no deity except Him, the Ever-Living, the Sustainer of all',
    category: 'Quranic'
  },
  {
    label: 'Mashallah',
    arabic: 'مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ',
    translation: 'As God has willed; there is no power except through God',
    category: 'Dua'
  },
  {
    label: 'Increase Knowledge',
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    translation: 'And say: "My Lord, increase me in knowledge"',
    category: 'Wisdom'
  },
  {
    label: 'Subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    translation: 'Glory be to God and all praise, Glory be to God the Tremendous',
    category: 'Dua'
  },
  {
    label: 'Patience & Victory',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with hardship comes ease',
    category: 'Quranic'
  },
  {
    label: 'Peace Greeting',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
    translation: 'May the peace, mercy, and blessings of God be upon you',
    category: 'Greeting'
  }
];

export const SAMPLE_MASTERPIECES: SampleMasterpiece[] = [
  {
    id: 'masterpiece-thuluth',
    title: 'Imperial Ottoman Basmala in Jali Thuluth',
    arabicTitle: 'بسملة بالثلث الجلي العثماني',
    style: 'thuluth',
    era: 'Ottoman Empire (19th Century)',
    calligrapher: 'Mustafa Raqim Efendi (مصطفى راقم أفندي)',
    imageThumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23062319"/><rect x="20" y="20" width="560" height="360" fill="none" stroke="%23d4af37" stroke-width="3"/><rect x="28" y="28" width="544" height="344" fill="none" stroke="%23d4af37" stroke-width="1" stroke-dasharray="4,4"/><text x="50%" y="42%" font-family="Amiri, serif" font-size="44" fill="%23f7e089" font-weight="bold" text-anchor="middle">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</text><text x="50%" y="60%" font-family="Cinzel, serif" font-size="14" fill="%23d4af37" text-anchor="middle" letter-spacing="4">THULUTH JALI COMPOSITION</text><circle cx="300" cy="280" r="16" fill="none" stroke="%23d4af37" stroke-width="1.5"/><polygon points="300,270 304,278 312,280 304,282 300,290 296,282 288,280 296,278" fill="%23d4af37"/></svg>',
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the name of God, the Most Gracious, the Most Merciful',
    analysis: {
      style: 'Thuluth',
      arabicStyle: 'ثلث',
      confidence: 98,
      extractedArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'In the name of God, the Most Gracious, the Most Merciful',
      significance: 'The sacred Basmala rendered in monumental Jali Thuluth, designed for architectural panels and royal mosque medallions.',
      calligraphicIndicators: [
        'Prominent Tarwees (leftward barbed serifs) on the Alif and Lam stems',
        'One-third proportion rule (Aqlam al-Sittah canon) with pronounced vertical momentum',
        'Interlocking letters (Tarkib) forming a harmonious pyramid composition',
        'Abundant decorative diacritics and calligraphic filler marks (Muhmalat & Tarwees)'
      ],
      dotsAndStrokes: {
        qalamAngle: 'Approximately 65° slant angle producing sharp hair-strokes and bold stems',
        dotsShape: 'Perfect rhombus (نقطة) oriented at the precise angle of the cut reed pen',
        strokeModulation: 'Dramatic contrast: stems are 6–8mm broad, hair-lines (tash\'ir) taper to 0.5mm',
        tarwees: 'Clearly present on all independent and initial vertical ascenders'
      },
      letterAnatomy: [
        {
          letter: 'Alif (ا)',
          measurements: '7 to 9 dots (Nuqāt) in height',
          strokeDetails: 'Commences with a barbed Tarwees (serif hook) pointing left, bows subtly backward in the midriff, and lands squarely on the baseline.'
        },
        {
          letter: 'Lam-Alif (لا)',
          measurements: 'Graceful embrace spanning 6 dots',
          strokeDetails: 'Intertwined arch with symmetric curvature and diamond-sharp terminals.'
        },
        {
          letter: 'Ra & Mim (ر / م)',
          measurements: 'Head 2 dots, tail sweeps 4 dots downwards',
          strokeDetails: 'The Ra swoops in a grand boat-like curve dipping below the baseline before rising in a needle-point taper.'
        }
      ],
      compositionType: 'Jali / Composite Interlocking (تراكيب جلي)',
      compositionAnalysis: 'Master Mustafa Raqim revolutionised this phrase by balancing the heavy vertical lines of Allah and ar-Rahman with the horizontal sweep of ar-Rahim, eliminating visual void (Khala).',
      historicalMasters: ['Mustafa Raqim', 'Ibn al-Bawwab', 'Sami Efendi'],
      historicalEra: 'Ottoman Empire (Golden Age of Calligraphy)',
      beginnerTips: 'Look for tall ascenders with barbed hooks (Tarwees) and rich, overlapping layers of vowels and dots.'
    }
  },
  {
    id: 'masterpiece-diwani',
    title: 'Ottoman Imperial Decree in Diwani Jali',
    arabicTitle: 'مرسوم سلطاني بالديواني الجلي',
    style: 'diwani',
    era: 'Ottoman Empire (17th Century)',
    calligrapher: 'Ibrahim Munif (مبتكر الديواني)',
    imageThumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23041913"/><rect x="20" y="20" width="560" height="360" fill="none" stroke="%23e5c158" stroke-width="2"/><path d="M 60 200 Q 200 80 350 200 T 540 200" fill="none" stroke="%23e5c158" stroke-width="0.8" opacity="0.4"/><text x="50%" y="45%" font-family="Marhey, cursive" font-size="40" fill="%23f7e59b" font-weight="bold" text-anchor="middle">وَقُل رَّبِّ زِدْنِي عِلْمًا</text><text x="50%" y="62%" font-family="Cinzel, serif" font-size="13" fill="%23d4af37" text-anchor="middle" letter-spacing="4">DIWANI JALI CURSIVE</text></svg>',
    arabicText: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    translation: 'And say: "My Lord, increase me in knowledge"',
    analysis: {
      style: 'Diwani',
      arabicStyle: 'ديواني',
      confidence: 96,
      extractedArabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
      translation: 'And say: "My Lord, increase me in knowledge"',
      significance: 'Royal prayer for wisdom executed in the courtly Diwani style reserved for imperial sultans.',
      calligraphicIndicators: [
        'Extreme curvature and cascading baseline that curves upward toward line ends',
        'Ascenders loop and curl playfully with calligraphic flourishes',
        'Close, interlocking spacing leaving zero empty room between characters',
        'Letters typically not joined in ordinary Arabic are deliberately linked'
      ],
      dotsAndStrokes: {
        qalamAngle: 'Approx 40° slant angle favoring rapid swoops and loops',
        dotsShape: 'Small, rounded diamonds nestled intimately into the curves of letters',
        strokeModulation: 'Fluid, ribbon-like rhythm resembling fluttering silk ribbons',
        tarwees: 'Replaced by circular loops and flamboyant finials instead of angular hooks'
      },
      letterAnatomy: [
        {
          letter: 'Waw (و)',
          measurements: 'Tight loop of 1.5 dots with extended circular sweep',
          strokeDetails: 'Closed head with circular fullness, continuing into a crescent sweep.'
        },
        {
          letter: 'Ra (ر)',
          measurements: 'Hanging drop of 3 dots',
          strokeDetails: 'Flows seamlessly from the preceding Ba in a continuous harmonic gesture.'
        },
        {
          letter: 'Alif / Lam (ا / ل)',
          measurements: '8 dots curved backwards',
          strokeDetails: 'Ascenders loop back in a swan-neck curve with high decorative flair.'
        }
      ],
      compositionType: 'Cascading Cursive Ribbon (انسكاب ديواني)',
      compositionAnalysis: 'Designed originally to make alteration or forgery of royal decrees impossible due to the interlocking, continuous script pattern.',
      historicalMasters: ['Ibrahim Munif', 'Shafiq Bey', 'Hashim Muhammad al-Baghdadi'],
      historicalEra: 'Ottoman Sublime Porte Chancellery',
      beginnerTips: 'Diwani is immediately recognizable by its dramatic wave-like movement and letters that loop into one another.'
    }
  },
  {
    id: 'masterpiece-kufic',
    title: 'Archaic Early Quran Folio in Classical Kufic',
    arabicTitle: 'مخطوطة قرآنية بالكوفي الأثري القديم',
    style: 'kufic',
    era: 'Early Islamic / Umayyad (8th–9th Century)',
    calligrapher: 'Ancient Scribes of Kufa (خطاطو الكوفة القدامى)',
    imageThumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%230b1b14"/><rect x="25" y="25" width="550" height="350" fill="none" stroke="%23c59b27" stroke-width="3"/><line x1="25" y1="230" x2="575" y2="230" stroke="%23c59b27" stroke-width="0.7" opacity="0.3"/><text x="50%" y="45%" font-family="Reem Kufi, sans-serif" font-size="38" fill="%23f5df88" font-weight="bold" text-anchor="middle">اللَّهُ نُورُ السَّمَاوَاتِ وَالأَرْضِ</text><text x="50%" y="62%" font-family="Cinzel, serif" font-size="13" fill="%23c59b27" text-anchor="middle" letter-spacing="4">ARCHITECTURAL KUFIC</text></svg>',
    arabicText: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالأَرْضِ',
    translation: 'God is the Light of the heavens and the earth',
    analysis: {
      style: 'Kufic',
      arabicStyle: 'كوفي',
      confidence: 99,
      extractedArabic: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالأَرْضِ',
      translation: 'God is the Light of the heavens and the earth',
      significance: 'The Verse of Light (Ayat an-Nur) written in historic rectilinear Kufic, embodying divine order and permanence.',
      calligraphicIndicators: [
        'Strict horizontal baseline with monumental vertical axes',
        'Right angles and geometric discipline without cursive slant',
        'Extended horizontal baseline strokes (Mashq / elongated stretch)',
        'Archaic lack of modern vocalization marks, emphasizing monumental letter forms'
      ],
      dotsAndStrokes: {
        qalamAngle: 'Perpendicular 90° or square cut nib used for architectural precision',
        dotsShape: 'Originally represented as red or gold circular points (Nuqat ad-Duwali)',
        strokeModulation: 'Uniform, solid strokes with minimal modulation, conveying permanence',
        tarwees: 'Squared terminals or triangular palmette flourishes (Floriated Kufic)'
      },
      letterAnatomy: [
        {
          letter: 'Alif (ا)',
          measurements: 'Strict upright vertical pillar',
          strokeDetails: 'Rises at exact 90-degree right angle from the horizontal baseline without bow or curve.'
        },
        {
          letter: 'Dal / Dhal (د / ذ)',
          measurements: 'Broad horizontal foot stretching 4x its vertical height',
          strokeDetails: 'Famous Kufic horizontal extension (Mashq) anchoring the line.'
        },
        {
          letter: 'Lam-Alif (لا)',
          measurements: 'Symmetrical geometric crossing',
          strokeDetails: 'Forms an architectural arch or triangular gate.'
        }
      ],
      compositionType: 'Horizontal Monumental Frieze (إفريز خطي أفقي)',
      compositionAnalysis: 'The horizontal extensions (Mashq) create a hypnotic spatial cadence that guided early reciters of the Quran.',
      historicalMasters: ['Master scribes of Kufa', 'Ibn Muqla (codifier)'],
      historicalEra: 'Early Islamic Umayyad & Abbasid Eras',
      beginnerTips: 'Notice the bold, straight rectangular structure. If it looks like architectural carving, it is Kufic!'
    }
  },
  {
    id: 'masterpiece-nastaliq',
    title: 'Classical Persian Couplet in Jali Nastaliq',
    arabicTitle: 'بيت شعر بالنستعليق الجلي',
    style: 'nastaliq',
    era: 'Safavid / Timurid (16th Century)',
    calligrapher: 'Mir Ali Tabrizi & Mir Emad (مير عماد الحسني)',
    imageThumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23031911"/><rect x="25" y="25" width="550" height="350" fill="none" stroke="%23d4af37" stroke-width="2"/><text x="50%" y="45%" font-family="Noto Nastaliq Urdu, Gulzar, serif" font-size="34" fill="%23f6e297" font-weight="bold" text-anchor="middle">فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ</text><text x="50%" y="65%" font-family="Cinzel, serif" font-size="13" fill="%23d4af37" text-anchor="middle" letter-spacing="4">POETIC NASTALIQ SCRIPT</text></svg>',
    arabicText: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
    translation: 'So which of the favors of your Lord will you deny?',
    analysis: {
      style: 'Nastaliq',
      arabicStyle: 'نستعليق',
      confidence: 97,
      extractedArabic: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
      translation: 'So which of the favors of your Lord will you deny?',
      significance: 'Celebrated Quranic refrain from Surah ar-Rahman rendered in the poetic cascade of Nastaliq.',
      calligraphicIndicators: [
        'Steep diagonal baseline that drifts downward from top-right to bottom-left',
        'Large, sweeping teardrop bowls for letters like Sin, Ya, and Qaf',
        'Delicate, needle-thin connections between words contrasting with lush curves',
        'Words stacked diagonally above one another in lyrical tiers'
      ],
      dotsAndStrokes: {
        qalamAngle: '55° to 60° angle creating intense contrast between lush swells and razor points',
        dotsShape: 'Diamonds angled gently along the diagonal flow of the word',
        strokeModulation: 'Extremely high: smooth glides resembling musical glissando',
        tarwees: 'Absent; ascenders begin with a soft, rounded feather touch'
      },
      letterAnatomy: [
        {
          letter: 'Alif (ا)',
          measurements: '3 dots in height with slight rightward lean',
          strokeDetails: 'Shorter than Thuluth, tilting like a cypress tree in a gentle breeze.'
        },
        {
          letter: 'Ba / Ta / Tha (ب / ت / ث)',
          measurements: 'Boat measuring 5 to 7 dots with a sweeping downward slope',
          strokeDetails: 'Begins high and ends low, embracing the word beneath it.'
        },
        {
          letter: 'Sin / Shin (س / ش)',
          measurements: 'Long Kashida wave extending 9 to 11 dots',
          strokeDetails: 'Drawn in one continuous, breathless stroke like a rolling ocean wave.'
        }
      ],
      compositionType: 'Diagonal Cascade (شلال مائل)',
      compositionAnalysis: 'Nastaliq mimics the natural curve of the human hand and the wing of a bird in flight, creating an organic rhythm unmatched in typography.',
      historicalMasters: ['Mir Emad Hassani', 'Mir Ali Tabrizi', 'Sultan Ali Mashhadi'],
      historicalEra: 'Timurid & Safavid Golden Renaissance',
      beginnerTips: 'If the text slopes down like steps or waterfalls and has enormous smooth bowls, it is Nastaliq!'
    }
  },
  {
    id: 'masterpiece-ruqaa',
    title: "Classical Wisdom Maxim in Ruq'ah Script",
    arabicTitle: 'حكمة مأثورة بخط الرقعة',
    style: 'ruqaa',
    era: 'Ottoman Administrative (Late 19th Century)',
    calligrapher: 'Mumtaz Bik (مبتكر قواعد الرقعة الحديثة)',
    imageThumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23062319"/><rect x="25" y="25" width="550" height="350" fill="none" stroke="%23d4af37" stroke-width="1.5"/><text x="50%" y="45%" font-family="Aref Ruqaa, serif" font-size="40" fill="%23f7e59b" font-weight="bold" text-anchor="middle">مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ</text><text x="50%" y="62%" font-family="Cinzel, serif" font-size="13" fill="%23d4af37" text-anchor="middle" letter-spacing="4">RUQAA MINIMALIST MASTERY</text></svg>',
    arabicText: 'مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ',
    translation: 'As God has willed; there is no power except through God',
    analysis: {
      style: "Ruq'ah",
      arabicStyle: 'رقعة',
      confidence: 97,
      extractedArabic: 'مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ',
      translation: 'As God has willed; there is no power except through God',
      significance: 'Traditional declaration of humility and faith written in crisp, accessible Ruqah.',
      calligraphicIndicators: [
        'Short, straight stems and tight, compact letterforms',
        'Joined dots: two dots become a solid dash (-), three dots become an inverted chevron (^)',
        'Letter heads are filled in/solid (Mim, Waw, Fa, Qaf) with no internal open loop',
        'Strict diagonal slant of approximately 45 degrees for descending strokes'
      ],
      dotsAndStrokes: {
        qalamAngle: '30° to 35° producing rapid, punchy strokes without lingering flourishes',
        dotsShape: 'Conjoined slashes and carets rather than individual separated diamonds',
        strokeModulation: 'Moderate, compact and sturdy with crisp terminations',
        tarwees: 'Completely absent; stems are unadorned and direct'
      },
      letterAnatomy: [
        {
          letter: 'Alif (ا)',
          measurements: 'Strictly 3 dots in height',
          strokeDetails: 'Drawn downwards with clean square head and uncurved vertical stance.'
        },
        {
          letter: 'Mim (م)',
          measurements: 'Solid teardrop dot of 1 pen-width',
          strokeDetails: 'Never left hollow; filled with ink and followed by a crisp downward tail.'
        },
        {
          letter: 'Sin (س)',
          measurements: 'Straight toothless line of 3 dots width',
          strokeDetails: 'Teeth of Sin are often smoothed into a flat straight stroke.'
        }
      ],
      compositionType: 'Compact Horizontal Cadence (تتابع أفقي مقتضب)',
      compositionAnalysis: 'Engineered by the Ottoman chancellery to maximize writing speed while retaining unmistakable elegance.',
      historicalMasters: ['Mumtaz Bik', 'Mustafa Izzat Efendi', 'Hashim Muhammad al-Baghdadi'],
      historicalEra: '19th Century Ottoman Educational Reform',
      beginnerTips: "Notice the solid filled-in circles (like in Waw and Mim) and connected dots (lines and carets). That is Ruq'ah!"
    }
  },
  {
    id: 'masterpiece-naskh',
    title: 'Quranic Ayah in Master Naskh Script',
    arabicTitle: 'آية قرآنية بخط النسخ الكلاسيكي',
    style: 'naskh',
    era: 'Classical Islamic (15th Century)',
    calligrapher: 'Sheikh Hamdullah (شيخ الخطاطين حمد الله الأماسي)',
    imageThumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23041c14"/><rect x="25" y="25" width="550" height="350" fill="none" stroke="%23d4af37" stroke-width="2"/><text x="50%" y="45%" font-family="Amiri, serif" font-size="42" fill="%23f7e089" font-weight="bold" text-anchor="middle">الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</text><text x="50%" y="62%" font-family="Cinzel, serif" font-size="13" fill="%23d4af37" text-anchor="middle" letter-spacing="4">NASKH CLARITY & BALANCE</text></svg>',
    arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    translation: 'All praise is due to God alone, the Lord of all realms',
    analysis: {
      style: 'Naskh',
      arabicStyle: 'نسخ',
      confidence: 99,
      extractedArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      translation: 'All praise is due to God alone, the Lord of all realms',
      significance: 'The opening Ayah of Surah al-Fatihah, the mother of the Quran, rendered in the golden standard of Quranic calligraphy.',
      calligraphicIndicators: [
        'Unrivaled clarity and legibility suited for continuous sacred reading',
        'Clear open eye-loops for Fa, Qaf, Ayn, and Waw',
        'Alif is exactly 5 dots high, strictly upright with minuscule leftward lean at base',
        'Separated, impeccably aligned vowel harakat placed directly above and below their letters'
      ],
      dotsAndStrokes: {
        qalamAngle: 'Exact 45° cut angle, providing harmonious balance between horizontal and vertical',
        dotsShape: 'Three dots form a distinct triangle; two dots sit parallel side-by-side',
        strokeModulation: 'Smooth, measured thickness providing optimal readability for sustained reading',
        tarwees: 'Tiny, subtle spur on top of vertical ascenders (Alif, Lam)'
      },
      letterAnatomy: [
        {
          letter: 'Alif (ا)',
          measurements: '5 dots (Nuqāt) in height',
          strokeDetails: 'Drawn with a steady, tranquil downward stroke, gently tapering at the foot.'
        },
        {
          letter: 'Ha / Jim (ح / ج)',
          measurements: 'Head 2 dots, crescent belly sweeps 5 dots',
          strokeDetails: 'Arching eyebrow head returning smoothly into a deep hemispherical bowl.'
        },
        {
          letter: 'Nun (ن)',
          measurements: 'Symmetrical circular bowl of 3.5 dots diameter',
          strokeDetails: 'The single dot rests precisely in the center of the open bowl.'
        }
      ],
      compositionType: 'Linear Sacred Cadence (سطر مصحفي شريف)',
      compositionAnalysis: 'Sheikh Hamdullah perfected the breathing room between words so that no letter overwhelms another.',
      historicalMasters: ['Sheikh Hamdullah', 'Hafiz Osman', 'Ibn Muqla'],
      historicalEra: 'Classical Ottoman Golden Age',
      beginnerTips: 'Naskh is the clean, highly legible font seen in the Quran and modern books.'
    }
  }
];
