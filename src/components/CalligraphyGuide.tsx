import React, { useState } from 'react';
import { 
  BookOpen, 
  Compass, 
  Sparkles, 
  Feather, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';
import { CALLIGRAPHY_STYLES } from '../utils/calligraphyPresets';
import { CalligraphyStyleId } from '../types/calligraphy';

interface CalligraphyGuideProps {
  onSelectStyleForStudio: (styleId: CalligraphyStyleId) => void;
  isArabicUI: boolean;
}

export const CalligraphyGuide: React.FC<CalligraphyGuideProps> = ({ 
  onSelectStyleForStudio,
  isArabicUI 
}) => {
  const [activeScript, setActiveScript] = useState<CalligraphyStyleId>('thuluth');
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const currentInfo = CALLIGRAPHY_STYLES[activeScript];

  const quizQuestions = [
    {
      question: isArabicUI 
        ? 'أي خط يُعرف باسم "ملك الخطوط العربية" ويتميز بترويس واضح على الألف واللام وبارتفاع 7 إلى 9 نقاط؟'
        : 'Which script is known as the "King of Arabic Scripts", characterized by prominent tarwees hooks and 7-9 dot Alifs?',
      options: ['Naskh (النسخ)', 'Thuluth (الثلث)', "Ruq'ah (الرقعة)", 'Kufic (الكوفي)'],
      correctIndex: 1,
      explanation: isArabicUI 
        ? 'خط الثلث هو أم الخطوط وأجملها، وسمي ثلثاً لأن سُمك قلمه يمثل ثلث قطر قلم الطومار الأصلي.'
        : 'Thuluth is celebrated as the King of Scripts, named because its nib is one-third the width of the ancient Toumar pen.'
    },
    {
      question: isArabicUI
        ? 'أي خط يتميز بدمج النقاط (النقطتان شرطة، والثلاث نقاط زاوية ^) ورؤوس حروف مطموسة؟'
        : 'Which script connects dots into slashes and carets (^) and features filled-in/solid letter heads?',
      options: ['Nastaliq (النستعليق)', 'Diwani (الديواني)', "Ruq'ah (الرقعة)", 'Thuluth (الثلث)'],
      correctIndex: 2,
      explanation: isArabicUI
        ? 'خط الرقعة يتميز بالسرعة والعملية، حيث تتصل النقاط وتُطمس رؤوس الواو والميم والفاء.'
        : "Ruq'ah was designed for swift daily administrative writing, connecting dots and filling letter heads."
    },
    {
      question: isArabicUI
        ? 'من هو الوزير العباسي العبقري الذي أسس ميزان الحروف والنسبة الفاضلة بالدائرة والنقطة؟'
        : 'Who is the celebrated Abbasid vizier who established the geometric Proportion System (Mizan al-Huruf) using dots and circles?',
      options: ['Mustafa Raqim', 'Ibn Muqla (ابن مقلة)', 'Mir Ali Tabrizi', 'Sheikh Hamdullah'],
      correctIndex: 1,
      explanation: isArabicUI
        ? 'الوزير أبو علي محمد بن مقلة (ت 328 هـ) هو الذي وضع الأسس الرياضية والهندسية للخط العربي.'
        : "Vizier Ibn Muqla (10th Century) codified Arabic typography geometrically around the rhomboid dot and circumscribed circle."
    }
  ];

  const handleQuizAnswer = (optionIdx: number) => {
    setSelectedQuizOption(optionIdx);
    const isCorrect = optionIdx === quizQuestions[quizQuestionIndex].correctIndex;
    if (isCorrect) setQuizScore(prev => prev + 1);
    setShowQuizResult(true);
  };

  const handleNextQuiz = () => {
    setSelectedQuizOption(null);
    setShowQuizResult(false);
    if (quizQuestionIndex < quizQuestions.length - 1) {
      setQuizQuestionIndex(prev => prev + 1);
    } else {
      setQuizQuestionIndex(0);
      setQuizScore(0);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-10">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#031d13] via-[#083525] to-[#02180f] p-6 sm:p-8 border border-[#d4af37]/30 shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-medium">
            <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isArabicUI ? 'دليل الأقلام الستة وهندسة الخط' : 'The Six Pens & Classical Paleography Guide'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-cinzel text-gold-bright tracking-wide">
            {isArabicUI ? 'موسوعة الخط العربي وميزان الحروف' : 'Master Calligrapher Encyclopedia'}
          </h1>
          <p className="text-sm sm:text-base text-[#a3c2b4] leading-relaxed">
            {isArabicUI
              ? 'استكشف الفلسفة الجمالية للخط العربي، وقواعد قطة القصبة، ونظام ميزان الحروف للوزير ابن مقلة، وكيفية التمييز بين الأنماط الستة للمبتدئين.'
              : "Explore the philosophy of Islamic calligraphy, the geometry of Ibn Muqla's proportion system, and master the nuances of the six classical scripts."}
          </p>
        </div>
      </div>

      {/* The Ibn Muqla Proportion System (Mizan al-Huruf) Card */}
      <div className="rounded-2xl bg-[#07251a]/85 backdrop-blur-md p-6 sm:p-8 border border-[#d4af37]/35 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
          <div className="space-y-1">
            <div className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
              {isArabicUI ? 'الأساس الهندسي المقدس' : 'The Sacred Geometric Foundation'}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f7e089] font-cinzel">
              {isArabicUI ? 'ميزان الحروف والنسبة الفاضلة (ابن مقلة)' : "Ibn Muqla's Proportion System (Mizan al-Huruf)"}
            </h2>
          </div>
          <span className="px-3 py-1 rounded-lg bg-[#041a12] border border-[#d4af37]/30 text-xs text-[#e8f3ed]">
            Established 10th Century CE (328 AH)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Nuqta (The Dot) */}
          <div className="p-5 rounded-xl bg-[#03150e] border border-[#d4af37]/25 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-xl text-[#f3e5ab] font-bold">
              ❖
            </div>
            <h3 className="text-base font-bold text-[#fce588]">
              {isArabicUI ? '١. النقطة (The Rhomboid Dot)' : '1. The Nuqta (Rhomboid Dot)'}
            </h3>
            <p className="text-xs text-[#90b5a3] leading-relaxed">
              {isArabicUI
                ? 'وحدة القياس الذرية في الخط العربي. تُصنع بوضع رأس قلم القصبة المائل كاملاً على الورق مرة واحدة بزاوية القطة المحددة، لتنتج معين هندسي متطابق الأضلاع.'
                : 'The fundamental atomic unit. Created by pressing the reed pen nib flat against paper at its natural cut angle, forming an exact equilateral rhombus.'}
            </p>
          </div>

          {/* Pillar 2: The Alif Standard */}
          <div className="p-5 rounded-xl bg-[#03150e] border border-[#d4af37]/25 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-xl text-[#f3e5ab] font-bold font-amiri">
              ا
            </div>
            <h3 className="text-base font-bold text-[#fce588]">
              {isArabicUI ? '٢. حرف الألف المعياري' : '2. The Standard Alif'}
            </h3>
            <p className="text-xs text-[#90b5a3] leading-relaxed">
              {isArabicUI
                ? 'يُقاس طول الألف بعدد ثابت من النقاط لكل نمط خطي (٧ نقاط في الثلث، ٥ في النسخ، ٣ في الرقعة). الألف هو عمود القياس لجميع الحروف الأخرى.'
                : 'The height of the Alif is strictly fixed in Nuqāt (7-9 in Thuluth, 5 in Naskh, 3 in Ruq\'ah). Every letter\'s length, curvature, and bowl derives from the Alif.'}
            </p>
          </div>

          {/* Pillar 3: The Circumscribed Circle */}
          <div className="p-5 rounded-xl bg-[#03150e] border border-[#d4af37]/25 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-xl text-[#f3e5ab] font-bold">
              ◯
            </div>
            <h3 className="text-base font-bold text-[#fce588]">
              {isArabicUI ? '٣. الدائرة الضابطة للتقويس' : '3. The Harmonious Circle'}
            </h3>
            <p className="text-xs text-[#90b5a3] leading-relaxed">
              {isArabicUI
                ? 'دائرة قطرها يساوي ارتفاع الألف المعياري. تُبنى عليها جميع الحروف المقوسة والمجوفة مثل الراء، والنون، والواو، والياء لضمان الانسجام البصري.'
                : 'A circle whose diameter equals the height of the Alif. All curved descending letters (Ra, Waw, Nun, Ya) are circumscribed within its arcs.'}
            </p>
          </div>

        </div>
      </div>

      {/* Interactive Script Explorer for all 6 Styles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Style Selection Nav (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider mb-2">
            {isArabicUI ? 'اختر نمطاً لدراسته بالتفصيل:' : 'Explore Classical Scripts:'}
          </div>

          {Object.values(CALLIGRAPHY_STYLES).map((style) => {
            const isSelected = activeScript === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setActiveScript(style.id)}
                className={`w-full p-4 rounded-xl text-right transition border flex items-center justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-l from-[#0e432f] to-[#072a1d] border-[#d4af37] text-white shadow-lg ring-1 ring-[#d4af37]'
                    : 'bg-[#03150e] border-[#d4af37]/20 text-[#a5cbb9] hover:bg-[#072619] hover:border-[#d4af37]/50'
                }`}
              >
                <div className="text-left">
                  <div className="text-xs font-semibold text-[#d4af37]">{style.name}</div>
                  <div className="text-[10px] text-[#719685]">{style.period.split('/')[0]}</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold font-amiri text-[#fce588]">{style.arabicName}</div>
                  <div className="text-[10px] text-[#86ab99]">{style.alifHeightDots}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Script Detail Showcase (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-[#07251a]/90 backdrop-blur-md rounded-2xl p-6 border border-[#d4af37]/35 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
            <div>
              <div className="text-xs text-[#8ab09e]">{currentInfo.period}</div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-bold font-amiri text-[#f7e089]">{currentInfo.arabicName}</span>
                <span className="text-xl font-bold font-cinzel text-white">({currentInfo.name})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectStyleForStudio(currentInfo.id)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38914] text-[#051c14] font-bold text-xs flex items-center gap-2 hover:brightness-110 transition shadow-md"
            >
              <span>{isArabicUI ? 'تصميم بهذا الخط في الاستوديو' : 'Design in Studio'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sample Typography Preview Banner */}
          <div className="p-8 rounded-xl bg-[#020e09] border border-[#d4af37]/30 text-center space-y-2">
            <div className={`text-4xl sm:text-5xl font-bold text-[#fce588] tracking-wide leading-relaxed ${currentInfo.fontClass}`}>
              {currentInfo.sampleText}
            </div>
            <div className="text-xs text-[#719886]">
              Sample Phrase rendered in {currentInfo.name} script
            </div>
          </div>

          <p className="text-sm text-[#bedcd0] leading-relaxed">
            {currentInfo.description}
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#03150e] border border-[#d4af37]/20">
              <div className="text-[11px] text-[#86ab99]">{isArabicUI ? 'زاوية قطة القلم' : 'Qalam Angle'}</div>
              <div className="text-sm font-bold text-[#f7e089] mt-0.5">{currentInfo.qalamAngle}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#03150e] border border-[#d4af37]/20">
              <div className="text-[11px] text-[#86ab99]">{isArabicUI ? 'ارتفاع الألف المعياري' : 'Alif Height (Nuqāt)'}</div>
              <div className="text-sm font-bold text-[#f7e089] mt-0.5">{currentInfo.alifHeightDots}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#03150e] border border-[#d4af37]/20">
              <div className="text-[11px] text-[#86ab99]">{isArabicUI ? 'مستوى الصعوبة' : 'Mastery Level'}</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{currentInfo.difficulty}</div>
            </div>
          </div>

          {/* Script Characteristics */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#f1df96]">
              {isArabicUI ? 'الخصائص والمميزات الفنية الفارقة:' : 'Definitive Artistic Characteristics:'}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {currentInfo.characteristics.map((c, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#03150e] border border-[#d4af37]/15 text-xs text-[#a5cbb9] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Calligraphy Knowledge Quiz */}
      <div className="rounded-2xl bg-[#07251a]/85 backdrop-blur-md p-6 sm:p-8 border border-[#d4af37]/35 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-lg font-bold text-[#f7e089] font-cinzel">
              {isArabicUI ? 'اختبر معلوماتك في فنون الخط العربي' : 'Calligraphy Master Quiz'}
            </h2>
          </div>
          <span className="text-xs text-[#8ab09e]">
            Question {quizQuestionIndex + 1} of {quizQuestions.length}
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-medium text-[#eef7f2] leading-relaxed">
            {quizQuestions[quizQuestionIndex].question}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizQuestions[quizQuestionIndex].options.map((opt, idx) => {
              const isSelected = selectedQuizOption === idx;
              const isCorrect = idx === quizQuestions[quizQuestionIndex].correctIndex;
              let btnStyle = 'bg-[#03150e] border-[#d4af37]/20 text-[#bed7cc] hover:bg-[#072619]';
              
              if (showQuizResult) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={showQuizResult}
                  onClick={() => handleQuizAnswer(idx)}
                  className={`p-4 rounded-xl border text-sm font-medium transition text-start flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {showQuizResult && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {showQuizResult && (
            <div className="p-4 rounded-xl bg-[#02130c] border border-[#d4af37]/25 space-y-3">
              <p className="text-xs text-[#9ebfb1] leading-relaxed">
                {quizQuestions[quizQuestionIndex].explanation}
              </p>
              <button
                type="button"
                onClick={handleNextQuiz}
                className="px-4 py-2 rounded-lg bg-[#d4af37] text-[#051c14] text-xs font-bold hover:brightness-110 transition"
              >
                {quizQuestionIndex < quizQuestions.length - 1 ? (isArabicUI ? 'السؤال التالي' : 'Next Question') : (isArabicUI ? 'إعادة الاختبار' : 'Restart Quiz')}
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
