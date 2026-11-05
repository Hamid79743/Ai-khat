import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Sparkles, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  FileText, 
  Layers, 
  Compass, 
  AlertCircle, 
  History, 
  BookOpen, 
  Maximize2,
  ChevronRight,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { CalligraphyAnalysisResult, SampleMasterpiece } from '../types/calligraphy';
import { SAMPLE_MASTERPIECES } from '../utils/calligraphyPresets';

interface CalligraphyAnalyzerProps {
  isArabicUI: boolean;
  selectedMasterpieceId?: string;
}

export const CalligraphyAnalyzer: React.FC<CalligraphyAnalyzerProps> = ({ 
  isArabicUI,
  selectedMasterpieceId
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CalligraphyAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'anatomy' | 'strokes' | 'history'>('overview');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check server status & Gemini API key on mount
  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setHasGeminiKey(Boolean(data.hasGeminiKey));
      })
      .catch(() => {
        setHasGeminiKey(false);
      });
  }, []);

  // Pre-load a sample if provided or default to Thuluth masterpiece
  useEffect(() => {
    const sample = SAMPLE_MASTERPIECES.find(m => m.id === selectedMasterpieceId) || SAMPLE_MASTERPIECES[0];
    if (sample && !selectedImage) {
      setSelectedImage(sample.imageThumbnail);
      setAnalysisResult(sample.analysis);
    }
  }, [selectedMasterpieceId]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(isArabicUI ? 'يرجى تحميل ملف صورة صالح (PNG, JPEG, WebP)' : 'Please upload a valid image file (PNG, JPEG, WebP).');
      return;
    }

    setImageMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      setSelectedImage(base64Data);
      setAnalysisResult(null);
      setErrorMsg(null);
      runRealAIAnalysis(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  };

  // Run Real AI Multimodal Analysis via /api/analyze-calligraphy
  const runRealAIAnalysis = async (base64Img: string, mime: string) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/analyze-calligraphy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img,
          mimeType: mime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'GEMINI_API_KEY_MISSING') {
          setErrorMsg(
            isArabicUI 
              ? 'مفتاح Gemini API غير مهيأ في بيئة الخادم. يمكنك استعراض روائع النماذج الكلاسيكية الجاهزة أدناه أو ضبط GEMINI_API_KEY في لوحة الإعدادات.'
              : 'Gemini API key is not configured in the server environment. You can explore the pre-analyzed classical masterpieces below or add GEMINI_API_KEY in the Secrets panel.'
          );
        } else {
          setErrorMsg(data.message || 'Failed to analyze the calligraphy image.');
        }
        return;
      }

      setAnalysisResult(data);
    } catch (err: any) {
      console.error('Calligraphy analysis failed:', err);
      setErrorMsg(
        isArabicUI
          ? 'تعذر الاتصال بخدمة التحليل الذكي. تأكد من اتصال الإنترنت وإعدادات الخادم.'
          : 'Could not connect to the analysis service. Please check your network or server configuration.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Select a preset sample masterpiece
  const handleSelectSample = (sample: SampleMasterpiece) => {
    setSelectedImage(sample.imageThumbnail);
    setImageMimeType('image/svg+xml');
    setAnalysisResult(sample.analysis);
    setErrorMsg(null);
  };

  // Copy extracted Arabic text
  const handleCopyExtracted = () => {
    if (!analysisResult?.extractedArabic) return;
    navigator.clipboard.writeText(analysisResult.extractedArabic);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#031d13] via-[#083525] to-[#02180f] p-6 sm:p-8 border border-[#d4af37]/30 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isArabicUI ? 'المحلل والمفتش الذكي للخط العربي' : 'AI Calligraphy Paleographer & Inspector'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-cinzel text-gold-bright tracking-wide">
              {isArabicUI ? 'فحص وتحليل الخطوط واستخراج النصوص' : 'Calligraphy Image Analyzer'}
            </h1>
            <p className="text-sm sm:text-base text-[#a3c2b4] leading-relaxed">
              {isArabicUI
                ? 'ارفع أي لوحة خطية للتعرف على نمطها (ثلث، نسخ، ديواني، رقعة، كوفي، نستعليق)، واستخراج النص العربي بالتشكيل، وتحليل قطة القصبة، وتفصيل الحروف والنقاط بنظام ابن مقلة.'
                : 'Upload or inspect any Arabic calligraphy piece to identify its script, extract vocalized Arabic text, dissect reed pen angles, and examine letter anatomy and dot proportions.'}
            </p>
          </div>

          {/* Real AI API Status Indicator */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#02120b] border border-[#d4af37]/25 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${hasGeminiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-[#d8ebd2]">
              {hasGeminiKey 
                ? (isArabicUI ? 'محرك Gemini 3.8 Flash متصل' : 'Gemini 3.8 Flash Vision Connected')
                : (isArabicUI ? 'النماذج الكلاسيكية جاهزة للاستعراض' : 'Sample Analysis Ready')}
            </span>
          </div>
        </div>
      </div>

      {/* Upload Zone & Sample Masterpieces Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Upload & Previews (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload Card */}
          <div className="bg-[#07251a]/85 backdrop-blur-md rounded-2xl p-5 border border-[#d4af37]/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#f1df96] flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#d4af37]" />
                <span>{isArabicUI ? 'رفع صورة اللوحة الخطية' : 'Upload Calligraphy Artwork'}</span>
              </h3>
              <span className="text-[11px] text-[#86ab99]">PNG, JPG, WebP</span>
            </div>

            {/* Drop / Click Target */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-[#d4af37]/40 hover:border-[#d4af37] bg-[#03150e]/90 hover:bg-[#062419] rounded-xl p-6 text-center cursor-pointer transition group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#eef7f2]">
                    {isArabicUI ? 'اضغط لرفع صورة أو اسحبها هنا' : 'Click to upload or drag & drop'}
                  </div>
                  <div className="text-xs text-[#789d8c] mt-0.5">
                    {isArabicUI ? 'ندعم المخطوطات واللوحات التاريخية' : 'Ancient manuscripts, inscriptions, or digital art'}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Image Preview */}
            {selectedImage && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8cb19f]">
                  <span>{isArabicUI ? 'اللوحة قيد الفحص:' : 'Inspecting Artwork:'}</span>
                  {isAnalyzing && (
                    <span className="text-[#d4af37] flex items-center gap-1.5 animate-pulse font-medium">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      {isArabicUI ? 'جاري الفحص الذكي بالذكاء الاصطناعي...' : 'AI Paleographic Inspection...'}
                    </span>
                  )}
                </div>
                <div className="relative rounded-xl overflow-hidden border border-[#d4af37]/35 aspect-video bg-[#020e09] flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Calligraphy Inspect"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Error Message if any */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMsg}</div>
              </div>
            )}
          </div>

          {/* Sample Masterpieces for Instant 1-Click Testing */}
          <div className="bg-[#07251a]/85 backdrop-blur-md rounded-2xl p-5 border border-[#d4af37]/25 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#f1df96] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#d4af37]" />
                <span>{isArabicUI ? 'روائع الخطوط الكلاسيكية الجاهزة' : 'Classic Masterpieces Gallery'}</span>
              </h3>
              <span className="text-[11px] text-[#d4af37]">{isArabicUI ? 'تجربة فورية بضغطة واحدة' : 'Instant 1-Click Test'}</span>
            </div>

            <p className="text-xs text-[#8ab09e] leading-relaxed">
              {isArabicUI 
                ? 'اختر أي من الروائع الخالدة لفحص تحليلها الخطي، وتوزيع النقاط، وتشريح حروفها بنظام الوزير ابن مقلة:'
                : 'Select any authentic masterpiece below to inspect its detailed paleographic breakdown, Ibn Muqla dot proportions, and letter anatomy:'}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {SAMPLE_MASTERPIECES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSample(item)}
                  className="p-3 rounded-xl bg-[#03150e] hover:bg-[#082a1d] border border-[#d4af37]/20 hover:border-[#d4af37] transition text-right flex flex-col justify-between gap-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-[#f7e089] font-amiri text-lg">
                      {item.analysis.arabicStyle}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#062418] text-[#86ab99] border border-[#d4af37]/15">
                      {item.analysis.style}
                    </span>
                  </div>

                  <div className="text-xs text-[#dbece3] truncate font-medium">
                    {item.arabicTitle}
                  </div>

                  <div className="text-[10px] text-[#719685] line-clamp-1">
                    {item.calligrapher}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Paleographic Analysis, Text Extraction & Letter Anatomy (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {analysisResult ? (
            <div className="bg-[#07251a]/90 backdrop-blur-md rounded-2xl p-6 border border-[#d4af37]/35 shadow-2xl space-y-6">
              
              {/* Header: Identified Script Style & Confidence */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-5">
                <div>
                  <div className="text-xs text-[#86ab99] uppercase tracking-wider font-semibold">
                    {isArabicUI ? 'النمط الخطي المُكتشف' : 'Identified Calligraphy Style'}
                  </div>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-3xl font-bold font-amiri text-[#fce588]">
                      {analysisResult.arabicStyle}
                    </span>
                    <span className="text-xl font-bold font-cinzel text-[#d4af37]">
                      ({analysisResult.style})
                    </span>
                  </div>
                </div>

                {/* Confidence Badge */}
                <div className="flex items-center gap-2 bg-[#03180f] px-3.5 py-2 rounded-xl border border-[#d4af37]/30">
                  <div className="text-right">
                    <div className="text-[10px] text-[#789d8c]">{isArabicUI ? 'نسبة التطابق والدقة' : 'Style Confidence'}</div>
                    <div className="text-base font-bold text-emerald-400">{analysisResult.confidence}%</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Feature 6 & 9: Extracted Arabic Text with Copy Button */}
              <div className="bg-[#03150e] rounded-xl p-5 border border-[#d4af37]/25 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#f1df96] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#d4af37]" />
                    {isArabicUI ? 'النص العربي المُستخرج (مع التشكيل الكامل):' : 'Extracted Arabic Text (With Full Tashkeel):'}
                  </span>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={handleCopyExtracted}
                    className="px-3 py-1.5 rounded-lg bg-[#082a1c] hover:bg-[#d4af37] text-[#f7e089] hover:text-[#051c14] border border-[#d4af37]/30 transition text-xs font-semibold flex items-center gap-1.5 shadow"
                    title="Copy Extracted Arabic Text"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? (isArabicUI ? 'تم نسخ النص!' : 'Copied!') : (isArabicUI ? 'نسخ النص العربي' : 'Copy Text')}</span>
                  </button>
                </div>

                {/* Display Extracted Text */}
                <div 
                  dir="rtl"
                  className="p-4 rounded-xl bg-[#010c07] border border-[#d4af37]/20 text-[#fcf0d3] text-2xl sm:text-3xl font-amiri text-center leading-relaxed select-all"
                >
                  {analysisResult.extractedArabic}
                </div>

                {/* English Translation */}
                {analysisResult.translation && (
                  <div className="text-xs text-[#8ab09e] italic border-t border-[#d4af37]/15 pt-2 text-center">
                    "{analysisResult.translation}"
                  </div>
                )}
              </div>

              {/* Tabs for Detailed Inspection: Overview | Letter Anatomy | Dots & Strokes | Historical Era */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 border-b border-[#d4af37]/20 pb-2">
                  {[
                    { id: 'overview', label: isArabicUI ? 'السمات والمؤشرات' : 'Stylistic Indicators' },
                    { id: 'anatomy', label: isArabicUI ? 'تشريح الحروف (ابن مقلة)' : 'Letter Anatomy' },
                    { id: 'strokes', label: isArabicUI ? 'قطة القصبة والنقاط' : 'Qalam & Nuqāt' },
                    { id: 'history', label: isArabicUI ? 'تاريخ الخط والأساتذة' : 'Historical Masters' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        activeTab === tab.id
                          ? 'bg-[#d4af37] text-[#051c14] shadow'
                          : 'bg-[#03150e] text-[#8ab09e] hover:text-white border border-[#d4af37]/15'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab 1: Stylistic Indicators */}
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-[#bedcd0]">
                      {isArabicUI ? 'أهم الدلائل والخصائص المميزة لهذا النمط في الصورة:' : 'Key Calligraphic Identifiers in this Artwork:'}
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {analysisResult.calligraphicIndicators.map((indicator, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#03150e] border border-[#d4af37]/15 text-xs text-[#dbece3] flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 text-[#f7e089] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{indicator}</span>
                        </div>
                      ))}
                    </div>

                    {/* Composition Analysis */}
                    {analysisResult.compositionAnalysis && (
                      <div className="p-3.5 rounded-xl bg-[#02130c] border border-[#d4af37]/20 text-xs space-y-1.5">
                        <div className="text-[#f7e089] font-semibold flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>{isArabicUI ? 'تحليل التوازن والتراكيب (التأليف الخطي):' : 'Composition & Spatial Balance (Tarkib):'}</span>
                        </div>
                        <p className="text-[#96beab] leading-relaxed">
                          {analysisResult.compositionAnalysis}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Feature 7 - Explain Letter Shapes & Anatomy */}
                {activeTab === 'anatomy' && (
                  <div className="space-y-3">
                    <div className="text-xs text-[#8ab09e]">
                      {isArabicUI 
                        ? 'ميزان الحروف وفق النسب الهندسية الدقيقة لمؤسس الخط الوزير ابن مقلة:'
                        : `Letter anatomy analyzed according to Ibn Muqla's sacred geometric canon (Mizan al-Huruf):`}
                    </div>

                    <div className="space-y-2.5">
                      {analysisResult.letterAnatomy.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#03150e] border border-[#d4af37]/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-[#f7e089] font-amiri">
                              {item.letter}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-[#072a1d] text-[#bed7cc] border border-[#d4af37]/15">
                              {item.measurements}
                            </span>
                          </div>
                          <p className="text-xs text-[#8cb19f] leading-relaxed">
                            {item.strokeDetails}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Feature 7 - Explain Dots & Strokes */}
                {activeTab === 'strokes' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    <div className="p-3.5 rounded-xl bg-[#03150e] border border-[#d4af37]/20 space-y-1.5">
                      <div className="text-xs font-semibold text-[#f7e089] flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{isArabicUI ? 'زاوية قطة القصبة (Qalam Angle):' : 'Pen Nib Cut Angle (Qalam):'}</span>
                      </div>
                      <p className="text-xs text-[#a1c4b4] leading-relaxed">
                        {analysisResult.dotsAndStrokes.qalamAngle}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#03150e] border border-[#d4af37]/20 space-y-1.5">
                      <div className="text-xs font-semibold text-[#f7e089] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{isArabicUI ? 'هندسة النقطة (Nuqāt Proportion):' : 'Dot Form & Orientation (Nuqāt):'}</span>
                      </div>
                      <p className="text-xs text-[#a1c4b4] leading-relaxed">
                        {analysisResult.dotsAndStrokes.dotsShape}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#03150e] border border-[#d4af37]/20 space-y-1.5">
                      <div className="text-xs font-semibold text-[#f7e089] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{isArabicUI ? 'التباين وسماكة المداد:' : 'Stroke Thickness & Modulation:'}</span>
                      </div>
                      <p className="text-xs text-[#a1c4b4] leading-relaxed">
                        {analysisResult.dotsAndStrokes.strokeModulation}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#03150e] border border-[#d4af37]/20 space-y-1.5">
                      <div className="text-xs font-semibold text-[#f7e089] flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{isArabicUI ? 'الترويس والحلية (Tarwees):' : 'Tarwees (Serif Hook on Ascenders):'}</span>
                      </div>
                      <p className="text-xs text-[#a1c4b4] leading-relaxed">
                        {analysisResult.dotsAndStrokes.tarwees}
                      </p>
                    </div>

                  </div>
                )}

                {/* Tab 4: Historical Context & Beginner Tips */}
                {activeTab === 'history' && (
                  <div className="space-y-4">
                    
                    {analysisResult.historicalMasters && analysisResult.historicalMasters.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-[#03150e] border border-[#d4af37]/20 space-y-2">
                        <div className="text-xs font-semibold text-[#f7e089] flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>{isArabicUI ? 'أشهر أساتذة هذا النمط عبر التاريخ:' : 'Celebrated Historical Masters:'}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.historicalMasters.map((master, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-[#072b1d] border border-[#d4af37]/20 text-xs text-[#e8f3ee]">
                              {master}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Beginner Recognition Tip */}
                    {analysisResult.beginnerTips && (
                      <div className="p-3.5 rounded-xl bg-[#02140d] border border-amber-500/25 space-y-1.5 text-xs">
                        <div className="text-amber-300 font-semibold flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                          <span>{isArabicUI ? 'نصيحة للمبتدئين للتمييز السريع:' : 'Beginner Recognition Rule of Thumb:'}</span>
                        </div>
                        <p className="text-[#a4ccbb] leading-relaxed">
                          {analysisResult.beginnerTips}
                        </p>
                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#07251a]/40 border border-[#d4af37]/20 text-[#82a897] space-y-3">
              <Compass className="w-12 h-12 text-[#d4af37]/40 animate-pulse" />
              <div className="text-base font-semibold text-[#d4af37]">
                {isArabicUI ? 'في انتظار رفع صورة أو اختيار نموذج' : 'Awaiting Artwork for Paleographic Inspection'}
              </div>
              <p className="text-xs max-w-sm text-[#719886]">
                {isArabicUI 
                  ? 'ارفع صورة أو اضغط على أي من روائع الخطوط الكلاسيكية على اليسار لبدء التحليل الفوري'
                  : 'Upload any Arabic calligraphy piece or select a sample masterpiece to reveal style classification and stroke anatomy.'}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
