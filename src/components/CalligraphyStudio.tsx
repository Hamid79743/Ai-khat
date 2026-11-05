import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Sparkles, 
  Sliders, 
  Copy, 
  Check, 
  Eye, 
  Layers, 
  Palette, 
  Compass, 
  Type, 
  Maximize2,
  RefreshCw,
  BookOpen,
  Info,
  FileCode,
  Share2
} from 'lucide-react';
import { 
  CalligraphyCustomization, 
  CalligraphyStyleId, 
  CompositionLayout, 
  BorderStyle, 
  BackgroundTheme, 
  InkColorTheme 
} from '../types/calligraphy';
import { CALLIGRAPHY_STYLES, QUICK_PHRASES } from '../utils/calligraphyPresets';
import { generateCalligraphySVG } from '../utils/svgExport';

interface CalligraphyStudioProps {
  onAnalyzeExample?: (styleId: CalligraphyStyleId) => void;
  isArabicUI: boolean;
  initialText?: string;
  initialStyle?: CalligraphyStyleId;
}

export const CalligraphyStudio: React.FC<CalligraphyStudioProps> = ({ 
  onAnalyzeExample,
  isArabicUI,
  initialText,
  initialStyle
}) => {
  const [config, setConfig] = useState<CalligraphyCustomization>({
    text: initialText || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    style: initialStyle || 'thuluth',
    fontSize: 54,
    strokeThickness: 3,
    letterSpacing: 2,
    lineHeight: 1.8,
    slantAngle: 0,
    layout: 'horizontal',
    border: 'arabesque',
    background: 'emerald',
    inkColor: 'gold',
    showTashkeel: true,
    showProportionGrid: false,
    showDecorativeMarks: true,
    addKashida: false,
  });

  useEffect(() => {
    if (initialText) {
      setConfig(prev => ({ ...prev, text: initialText }));
    }
    if (initialStyle) {
      setConfig(prev => ({ ...prev, style: initialStyle }));
    }
  }, [initialText, initialStyle]);

  const [isExporting, setIsExporting] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiGuidance, setAiGuidance] = useState<{
    vocalizedText?: string;
    translation?: string;
    transliteration?: string;
    compositionGuidelines?: string;
  } | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [svgDownloaded, setSvgDownloaded] = useState(false);
  const [svgCopied, setSvgCopied] = useState(false);
  const [exportResolution, setExportResolution] = useState<'standard' | 'hd' | 'ultra'>('hd');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Tashkeel characters toolbar
  const tashkeelChars = [
    { char: 'َ', label: 'Fatḥah' },
    { char: 'ُ', label: 'Ḍammah' },
    { char: 'ِ', label: 'Kasrah' },
    { char: 'ْ', label: 'Sukūn' },
    { char: 'ّ', label: 'Shaddah' },
    { char: 'ً', label: 'Tanwīn Fatḥ' },
    { char: 'ٌ', label: 'Tanwīn Ḍamm' },
    { char: 'ٍ', label: 'Tanwīn Kasr' },
    { char: 'ـ', label: 'Tatwīl (Kashīda)' },
    { char: 'ٰ', label: 'Dagger Alif' },
    { char: 'ۡ', label: 'Quranic Sukūn' },
  ];

  const currentStyleInfo = CALLIGRAPHY_STYLES[config.style];

  // Insert Tashkeel character into text
  const insertChar = (char: string) => {
    setConfig(prev => ({
      ...prev,
      text: prev.text + char
    }));
  };

  // AI Tashkeel and Master Composition Guidance
  const handleAITashkeel = async () => {
    if (!config.text.trim()) return;
    setIsAIProcessing(true);
    try {
      const response = await fetch('/api/tashkeel-and-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: config.text,
          style: currentStyleInfo.name,
        }),
      });

      if (!response.ok) {
        throw new Error('AI Service unavailable or key not configured');
      }

      const data = await response.json();
      if (data.vocalizedText) {
        setConfig(prev => ({
          ...prev,
          text: data.vocalizedText,
        }));
      }
      setAiGuidance({
        vocalizedText: data.vocalizedText,
        translation: data.translation,
        transliteration: data.transliteration,
        compositionGuidelines: data.compositionGuidelines,
      });
    } catch (err) {
      console.warn('Could not complete AI Tashkeel automatically:', err);
      // Friendly fallback notice
      setAiGuidance({
        translation: 'AI service ready when GEMINI_API_KEY is configured in Secrets.',
        compositionGuidelines: `For ${currentStyleInfo.name}, ensure ascenders maintain ~${currentStyleInfo.alifHeightDots} proportion with a ${currentStyleInfo.qalamAngle} pen angle.`,
      });
    } finally {
      setIsAIProcessing(false);
    }
  };

  // Render high quality Calligraphy onto Canvas for both display and crisp PNG export
  const renderCalligraphyToCanvas = (targetCanvas: HTMLCanvasElement, scaleFactor: number = 2) => {
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;

    const width = targetCanvas.width;
    const height = targetCanvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // 1. Background
    if (config.background === 'emerald') {
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50 * scaleFactor, width / 2, height / 2, width * 0.7);
      grad.addColorStop(0, '#093625');
      grad.addColorStop(0.6, '#041c13');
      grad.addColorStop(1, '#020e09');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle gold micro-dust
      ctx.fillStyle = 'rgba(212, 175, 55, 0.04)';
      for (let i = 0; i < 60; i++) {
        const x = (i * 73) % width;
        const y = (i * 97) % height;
        ctx.beginPath();
        ctx.arc(x, y, 1.2 * scaleFactor, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (config.background === 'parchment') {
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50 * scaleFactor, width / 2, height / 2, width * 0.7);
      grad.addColorStop(0, '#f9f3e3');
      grad.addColorStop(0.7, '#e9dcbe');
      grad.addColorStop(1, '#d5c49f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (config.background === 'obsidian') {
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50 * scaleFactor, width / 2, height / 2, width * 0.7);
      grad.addColorStop(0, '#151518');
      grad.addColorStop(1, '#060608');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (config.background === 'lapis') {
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50 * scaleFactor, width / 2, height / 2, width * 0.7);
      grad.addColorStop(0, '#0a2540');
      grad.addColorStop(0.7, '#051627');
      grad.addColorStop(1, '#020b14');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Transparent
      ctx.clearRect(0, 0, width, height);
    }

    // 2. Borders & Tezhib Illumination
    const pad = 36 * scaleFactor;
    const innerPad = pad + 12 * scaleFactor;

    if (config.border !== 'none') {
      ctx.save();
      const goldColor = config.background === 'parchment' && config.inkColor === 'lampblack' 
        ? '#8f6e1b' 
        : '#d4af37';
      ctx.strokeStyle = goldColor;

      if (config.border === 'arabesque' || config.border === 'double-gold') {
        // Outer thin line
        ctx.lineWidth = 1.5 * scaleFactor;
        ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

        // Inner decorative frame
        ctx.lineWidth = 3 * scaleFactor;
        ctx.strokeRect(innerPad, innerPad, width - innerPad * 2, height - innerPad * 2);

        // 4 Corner Medallions
        const corners = [
          [innerPad, innerPad],
          [width - innerPad, innerPad],
          [innerPad, height - innerPad],
          [width - innerPad, height - innerPad],
        ];

        corners.forEach(([cx, cy]) => {
          ctx.beginPath();
          ctx.arc(cx, cy, 14 * scaleFactor, 0, Math.PI * 2);
          ctx.fillStyle = config.background === 'transparent' ? 'rgba(212,175,55,0.2)' : 'rgba(7, 34, 24, 0.8)';
          ctx.fill();
          ctx.stroke();

          // Inner star petal
          ctx.fillStyle = goldColor;
          ctx.beginPath();
          ctx.arc(cx, cy, 3 * scaleFactor, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (config.border === 'arch') {
        // Islamic Mihrab Arch
        ctx.lineWidth = 2.5 * scaleFactor;
        ctx.beginPath();
        const archTopY = pad + 40 * scaleFactor;
        ctx.moveTo(pad, height - pad);
        ctx.lineTo(pad, archTopY);
        // Arch peak curve
        ctx.bezierCurveTo(
          pad, pad,
          width / 2 - 40 * scaleFactor, pad - 10 * scaleFactor,
          width / 2, pad
        );
        ctx.bezierCurveTo(
          width / 2 + 40 * scaleFactor, pad - 10 * scaleFactor,
          width - pad, pad,
          width - pad, archTopY
        );
        ctx.lineTo(width - pad, height - pad);
        ctx.closePath();
        ctx.stroke();
      } else if (config.border === 'girih') {
        // Geometric Girih 8-point star pattern line
        ctx.lineWidth = 2 * scaleFactor;
        ctx.setLineDash([8 * scaleFactor, 6 * scaleFactor]);
        ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
        ctx.setLineDash([]);
        ctx.lineWidth = 1 * scaleFactor;
        ctx.strokeRect(innerPad, innerPad, width - innerPad * 2, height - innerPad * 2);
      } else if (config.border === 'subtle') {
        ctx.lineWidth = 1 * scaleFactor;
        ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
      }
      ctx.restore();
    }

    // 3. Proportion Grid (Ibn Muqla Nuqāt Guide) if enabled
    if (config.showProportionGrid) {
      ctx.save();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
      ctx.lineWidth = 0.8 * scaleFactor;

      const dotSize = 12 * scaleFactor;
      const centerY = height / 2;

      // Draw horizontal baseline
      ctx.beginPath();
      ctx.moveTo(innerPad + 20 * scaleFactor, centerY);
      ctx.lineTo(width - innerPad - 20 * scaleFactor, centerY);
      ctx.stroke();

      // Draw vertical dot scale representing Alif height
      const alifDots = config.style === 'thuluth' ? 7 : config.style === 'naskh' ? 5 : 4;
      const startX = width - innerPad - 40 * scaleFactor;
      for (let i = 0; i < alifDots; i++) {
        const dotY = centerY - (i * dotSize * 1.4);
        // Draw diamond dot (rhombus)
        ctx.beginPath();
        ctx.moveTo(startX, dotY - dotSize / 2);
        ctx.lineTo(startX + dotSize / 2, dotY);
        ctx.lineTo(startX, dotY + dotSize / 2);
        ctx.lineTo(startX - dotSize / 2, dotY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    // 4. Ink Color Selection
    let inkStyle: string | CanvasGradient = '#f7e59b';
    if (config.inkColor === 'gold') {
      const goldGrad = ctx.createLinearGradient(0, height * 0.3, width, height * 0.7);
      goldGrad.addColorStop(0, '#ffffff');
      goldGrad.addColorStop(0.2, '#fde68a');
      goldGrad.addColorStop(0.5, '#d4af37');
      goldGrad.addColorStop(0.8, '#f59e0b');
      goldGrad.addColorStop(1, '#fbbf24');
      inkStyle = goldGrad;
    } else if (config.inkColor === 'white') {
      inkStyle = '#ffffff';
    } else if (config.inkColor === 'lampblack') {
      inkStyle = '#111827';
    } else if (config.inkColor === 'rosegold') {
      const roseGrad = ctx.createLinearGradient(0, height * 0.3, width, height * 0.7);
      roseGrad.addColorStop(0, '#ffe4e6');
      roseGrad.addColorStop(0.5, '#f43f5e');
      roseGrad.addColorStop(1, '#be123c');
      inkStyle = roseGrad;
    } else if (config.inkColor === 'emerald') {
      const emGrad = ctx.createLinearGradient(0, height * 0.3, width, height * 0.7);
      emGrad.addColorStop(0, '#a7f3d0');
      emGrad.addColorStop(0.5, '#10b981');
      emGrad.addColorStop(1, '#047857');
      inkStyle = emGrad;
    }

    // 5. Render Arabic Calligraphy Text
    ctx.save();
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Map font family
    let fontFamily = "'Amiri', serif";
    if (config.style === 'thuluth') fontFamily = "'Amiri', serif";
    else if (config.style === 'naskh') fontFamily = "'Amiri', 'Noto Naskh Arabic', serif";
    else if (config.style === 'diwani') fontFamily = "'Marhey', 'Amiri', cursive";
    else if (config.style === 'ruqaa') fontFamily = "'Aref Ruqaa', serif";
    else if (config.style === 'kufic') fontFamily = "'Reem Kufi', sans-serif";
    else if (config.style === 'nastaliq') fontFamily = "'Noto Nastaliq Urdu', 'Gulzar', serif";

    const calcFontSize = Math.round(config.fontSize * scaleFactor);
    ctx.font = `bold ${calcFontSize}px ${fontFamily}`;

    // Apply baseline slant angle if set
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.translate(centerX, centerY);
    if (config.slantAngle !== 0) {
      ctx.rotate((config.slantAngle * Math.PI) / 180);
    }

    // Shadow for 3D depth & illumination glow
    if (config.background !== 'parchment' && config.background !== 'transparent') {
      ctx.shadowColor = 'rgba(212, 175, 55, 0.45)';
      ctx.shadowBlur = 12 * scaleFactor;
    }

    // Apply stroke thickness
    const strokeWidth = (config.strokeThickness * scaleFactor) / 2;
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = inkStyle;
    ctx.fillStyle = inkStyle;

    // Split text by lines or process for layout
    let displayText = config.text;
    if (!config.showTashkeel) {
      // Strip tashkeel if user explicitly disabled
      displayText = displayText.replace(/[\u064B-\u065F\u0670]/g, '');
    }

    const lines = displayText.split('\n');
    const lineSpacing = calcFontSize * (config.lineHeight || 1.6);
    const startY = -((lines.length - 1) * lineSpacing) / 2;

    lines.forEach((line, index) => {
      const yPos = startY + index * lineSpacing;
      
      // If stroke thickness > 1, draw stroke first for broad qalam edge
      if (config.strokeThickness > 1.5) {
        ctx.strokeText(line, 0, yPos);
      }
      ctx.fillText(line, 0, yPos);
    });

    ctx.restore();

    // 6. Ornamental Medallion / Tughra Seal if layout requested
    if (config.layout === 'tughra') {
      ctx.save();
      ctx.strokeStyle = config.inkColor === 'lampblack' ? '#8f6e1b' : 'rgba(212, 175, 55, 0.6)';
      ctx.lineWidth = 1.5 * scaleFactor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.38, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.36, 0, Math.PI * 2);
      ctx.setLineDash([4 * scaleFactor, 4 * scaleFactor]);
      ctx.stroke();
      ctx.restore();
    }

    // 7. Watermark / Signature
    ctx.save();
    ctx.font = `${10 * scaleFactor}px 'Cinzel', serif`;
    ctx.fillStyle = config.background === 'parchment' ? 'rgba(0,0,0,0.35)' : 'rgba(212, 175, 55, 0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('KHATAT AI  •  خطاط الذكاء الاصطناعي', width / 2, height - (pad - 12 * scaleFactor));
    ctx.restore();
  };

  // Keep preview canvas updated whenever customization changes
  useEffect(() => {
    if (canvasRef.current) {
      renderCalligraphyToCanvas(canvasRef.current, 1.5);
    }
  }, [config]);

  // Handle Export to PNG
  const handleDownloadPNG = () => {
    setIsExporting(true);
    try {
      const exportCanvas = document.createElement('canvas');
      let dim = 1200;
      if (exportResolution === 'hd') dim = 1920;
      if (exportResolution === 'ultra') dim = 2400;

      exportCanvas.width = dim;
      exportCanvas.height = dim;

      const scale = dim / 600;
      renderCalligraphyToCanvas(exportCanvas, scale);

      const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `khatat-ai-${config.style}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(config.text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Handle Export to Scalable Vector SVG
  const handleDownloadSVG = () => {
    try {
      const svgString = generateCalligraphySVG(config);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `khatat-ai-${config.style}-${Date.now()}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      setSvgDownloaded(true);
      setTimeout(() => setSvgDownloaded(false), 3000);
    } catch (err) {
      console.error('Failed to export vector SVG:', err);
    }
  };

  const handleCopySVG = () => {
    try {
      const svgString = generateCalligraphySVG(config);
      navigator.clipboard.writeText(svgString);
      setSvgCopied(true);
      setTimeout(() => setSvgCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy SVG code:', err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Top Banner / Studio Introduction */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#031d13] via-[#083525] to-[#02180f] p-6 sm:p-8 border border-[#d4af37]/30 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isArabicUI ? 'محترف الخط العربي الملكي' : 'Royal Arabic Calligraphy Studio'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-cinzel text-gold-bright tracking-wide">
              {isArabicUI ? 'صانع وتصميم الخطوط العربية' : 'Arabic Calligraphy Studio'}
            </h1>
            <p className="text-sm sm:text-base text-[#a3c2b4] leading-relaxed">
              {isArabicUI 
                ? 'حوّل النصوص العربية إلى تحف خطية أصيلة بالأنماط الستة الكلاسيكية مع تحكم دقيق بسُمك القلم، والمسافات، وحجم الحرف، والتذهيب.'
                : 'Craft masterwork Arabic calligraphy in the 6 classical scripts. Customize reed pen thickness, letter spacing, font size, and royal Tezhib illumination.'}
            </p>
          </div>

          {/* Quick Stats / Style Indicator */}
          <div className="flex items-center gap-3 bg-[#02130c]/70 backdrop-blur-md px-4 py-3 rounded-xl border border-[#d4af37]/25">
            <div className="text-right">
              <div className="text-xs text-[#82a897]">{isArabicUI ? 'النمط الحالي' : 'Active Script'}</div>
              <div className="text-lg font-bold text-[#f7e089] font-amiri">{currentStyleInfo.arabicName} ({currentStyleInfo.name})</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-xl text-[#f3e5ab] font-bold">
              {currentStyleInfo.arabicName.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Controls | Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input & Customization Controls (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card 1: Arabic Text Input */}
          <div className="bg-[#07251a]/80 backdrop-blur-sm rounded-2xl p-5 border border-[#d4af37]/25 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#f1df96] flex items-center gap-2">
                <Type className="w-4 h-4 text-[#d4af37]" />
                {isArabicUI ? 'النص العربي للخطاط' : 'Arabic Text Input'}
              </label>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyText}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#041a12] border border-[#d4af37]/30 text-[#e0cf8b] hover:text-[#fff] hover:border-[#d4af37] transition flex items-center gap-1.5"
                  title="Copy Text"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? (isArabicUI ? 'تم النسخ' : 'Copied') : (isArabicUI ? 'نسخ' : 'Copy')}</span>
                </button>

                <button
                  onClick={handleAITashkeel}
                  disabled={isAIProcessing}
                  className="px-3 py-1 text-xs rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8210] text-[#051c14] font-semibold hover:brightness-110 transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
                  title="Auto-vocalize with Tashkeel using Gemini AI"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAIProcessing ? 'animate-spin' : ''}`} />
                  <span>{isAIProcessing ? (isArabicUI ? 'جاري التشكيل...' : 'Adding Tashkeel...') : (isArabicUI ? 'تشكيل ذكي بالذكاء' : 'AI Tashkeel')}</span>
                </button>
              </div>
            </div>

            {/* Arabic Textarea */}
            <div className="relative">
              <textarea
                dir="rtl"
                rows={3}
                value={config.text}
                onChange={(e) => setConfig({ ...config, text: e.target.value })}
                placeholder="اكتب هنا النص العربي الشريف..."
                className={`w-full p-4 rounded-xl bg-[#03150e] text-[#f7ecd0] border border-[#d4af37]/30 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none text-2xl leading-relaxed resize-none shadow-inner ${currentStyleInfo.fontClass}`}
              />
            </div>

            {/* Tashkeel Quick Insert Toolbar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#82a897]">
                <span>{isArabicUI ? 'لوحة التشكيل والحركات' : 'Tashkeel & Diacritics Toolbar:'}</span>
                <span className="text-[11px] text-[#638776]">{isArabicUI ? 'اضغط لإضافة الحركة' : 'Click to append harakah'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 bg-[#03150e]/60 p-2 rounded-xl border border-[#d4af37]/15">
                {tashkeelChars.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertChar(item.char)}
                    className="w-8 h-8 rounded-lg bg-[#072a1d] hover:bg-[#d4af37]/25 text-[#f5df88] hover:text-white border border-[#d4af37]/20 flex items-center justify-center font-amiri text-lg font-bold transition active:scale-95"
                    title={item.label}
                  >
                    {item.char}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Islamic Phrases */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs text-[#82a897]">{isArabicUI ? 'عبارات كلاسيكية جاهزة:' : 'Classic Sacred Phrases:'}</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PHRASES.map((phrase, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setConfig({ ...config, text: phrase.arabic })}
                    className="px-2.5 py-1 text-xs rounded-lg bg-[#031b12] hover:bg-[#093524] text-[#cfdfd6] hover:text-[#f7e089] border border-[#d4af37]/20 transition flex items-center gap-1"
                  >
                    <span>{phrase.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Select Calligraphy Styles (All 6 Styles) */}
          <div className="bg-[#07251a]/80 backdrop-blur-sm rounded-2xl p-5 border border-[#d4af37]/25 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#f1df96] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#d4af37]" />
                {isArabicUI ? 'اختر نمط الخط العربي' : 'Select Calligraphy Style'}
              </label>
              <span className="text-xs text-[#d4af37] font-medium">{Object.keys(CALLIGRAPHY_STYLES).length} Classical Scripts</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.values(CALLIGRAPHY_STYLES).map((s) => {
                const isSelected = config.style === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setConfig({ ...config, style: s.id })}
                    className={`relative p-3.5 rounded-xl text-right transition border flex flex-col justify-between gap-2 text-start ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#0c402d] to-[#06291c] border-[#d4af37] shadow-md shadow-[#d4af37]/15 ring-1 ring-[#d4af37]'
                        : 'bg-[#03180f] border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:bg-[#07291b]'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#d4af37] ring-4 ring-[#d4af37]/20" />
                    )}
                    <div className="flex items-baseline justify-between w-full">
                      <span className={`text-xl font-bold font-amiri ${isSelected ? 'text-[#fce588]' : 'text-[#e5f0ea]'}`}>
                        {s.arabicName}
                      </span>
                      <span className="text-[11px] text-[#86ab99]">{s.difficulty}</span>
                    </div>

                    <div className="text-xs font-semibold text-[#d4af37]">{s.name}</div>
                    
                    <div className="text-[10px] text-[#749b88] line-clamp-1">
                      {s.qalamAngle} • {s.alifHeightDots}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Style Description Card */}
            <div className="p-3.5 rounded-xl bg-[#02130c] border border-[#d4af37]/15 text-xs text-[#9ebfb1] space-y-2">
              <div className="flex items-center justify-between text-[#e4ce7f] font-semibold">
                <span>{currentStyleInfo.name} ({currentStyleInfo.arabicName})</span>
                <span className="text-[11px] text-[#83a796]">{currentStyleInfo.period}</span>
              </div>
              <p className="leading-relaxed">{currentStyleInfo.description}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {currentStyleInfo.characteristics.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-[#07291c] border border-[#d4af37]/15 text-[11px] text-[#bed7cc]">
                    • {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Customization Parameters (Stroke thickness, Font size, Letter spacing) */}
          <div className="bg-[#07251a]/80 backdrop-blur-sm rounded-2xl p-5 border border-[#d4af37]/25 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#d4af37]" />
                <h3 className="text-sm font-semibold text-[#f1df96]">
                  {isArabicUI ? 'تخصيص أبعاد الخط والقلم' : 'Calligraphy Parameters & Customization'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConfig(prev => ({
                  ...prev,
                  fontSize: 54,
                  strokeThickness: 3,
                  letterSpacing: 2,
                  slantAngle: 0,
                  lineHeight: 1.8
                }))}
                className="text-xs text-[#8ab09e] hover:text-[#d4af37] flex items-center gap-1 transition"
                title="Reset to defaults"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{isArabicUI ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Parameter 1: Stroke Thickness (Qalam Nib Weight) */}
              <div className="space-y-1.5 bg-[#03150e] p-3 rounded-xl border border-[#d4af37]/15">
                <div className="flex justify-between text-xs">
                  <span className="text-[#bedcd0] font-medium">
                    {isArabicUI ? 'سُمك القلم (Stroke Thickness)' : 'Stroke Thickness / Qalam'}
                  </span>
                  <span className="text-[#f7e089] font-bold">{config.strokeThickness} px</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={0.5}
                  value={config.strokeThickness}
                  onChange={(e) => setConfig({ ...config, strokeThickness: parseFloat(e.target.value) })}
                  className="w-full accent-[#d4af37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#638776]">
                  <span>Thin Hairline (تشعير)</span>
                  <span>Broad Reed (قلم عريض)</span>
                </div>
              </div>

              {/* Parameter 2: Font Size */}
              <div className="space-y-1.5 bg-[#03150e] p-3 rounded-xl border border-[#d4af37]/15">
                <div className="flex justify-between text-xs">
                  <span className="text-[#bedcd0] font-medium">
                    {isArabicUI ? 'حجم الخط (Font Size)' : 'Font Size'}
                  </span>
                  <span className="text-[#f7e089] font-bold">{config.fontSize} pt</span>
                </div>
                <input
                  type="range"
                  min={28}
                  max={96}
                  step={2}
                  value={config.fontSize}
                  onChange={(e) => setConfig({ ...config, fontSize: parseInt(e.target.value) })}
                  className="w-full accent-[#d4af37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#638776]">
                  <span>Compact</span>
                  <span>Monumental Jali</span>
                </div>
              </div>

              {/* Parameter 3: Letter Spacing & Tracking */}
              <div className="space-y-1.5 bg-[#03150e] p-3 rounded-xl border border-[#d4af37]/15">
                <div className="flex justify-between text-xs">
                  <span className="text-[#bedcd0] font-medium">
                    {isArabicUI ? 'تباعد الحروف (Letter Spacing)' : 'Letter Spacing / Tracking'}
                  </span>
                  <span className="text-[#f7e089] font-bold">{config.letterSpacing} px</span>
                </div>
                <input
                  type="range"
                  min={-2}
                  max={12}
                  step={1}
                  value={config.letterSpacing}
                  onChange={(e) => setConfig({ ...config, letterSpacing: parseInt(e.target.value) })}
                  className="w-full accent-[#d4af37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#638776]">
                  <span>Dense Interlock</span>
                  <span>Open Space</span>
                </div>
              </div>

              {/* Parameter 4: Baseline Slant / Angle */}
              <div className="space-y-1.5 bg-[#03150e] p-3 rounded-xl border border-[#d4af37]/15">
                <div className="flex justify-between text-xs">
                  <span className="text-[#bedcd0] font-medium">
                    {isArabicUI ? 'زاوية الميلان (Slant Angle)' : 'Baseline Slant Angle'}
                  </span>
                  <span className="text-[#f7e089] font-bold">{config.slantAngle}°</span>
                </div>
                <input
                  type="range"
                  min={-15}
                  max={15}
                  step={1}
                  value={config.slantAngle}
                  onChange={(e) => setConfig({ ...config, slantAngle: parseInt(e.target.value) })}
                  className="w-full accent-[#d4af37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#638776]">
                  <span>-15°</span>
                  <span>Level (0°)</span>
                  <span>+15°</span>
                </div>
              </div>

            </div>

            {/* Visual Options: Layout, Border, Background, Ink */}
            <div className="space-y-4 pt-2">
              
              {/* Border Styles */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#a2c8b8] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                  {isArabicUI ? 'إطار التذهيب والزخرفة الإسلامية:' : 'Tezhib & Ornamental Border:'}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'arabesque', label: 'Arabesque' },
                    { id: 'girih', label: 'Girih Star' },
                    { id: 'arch', label: 'Mihrab' },
                    { id: 'double-gold', label: 'Double Gold' },
                    { id: 'subtle', label: 'Minimal' },
                    { id: 'none', label: 'None' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setConfig({ ...config, border: b.id as BorderStyle })}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition border text-center ${
                        config.border === b.id
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f7e59b]'
                          : 'bg-[#03150e] border-[#d4af37]/15 text-[#88a899] hover:border-[#d4af37]/40'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Theme */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#a2c8b8] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
                  {isArabicUI ? 'خامة وأرضية اللوحة:' : 'Canvas Surface & Texture:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'emerald', label: 'Emerald Velvet', color: '#093625' },
                    { id: 'parchment', label: 'Aged Parchment', color: '#e8dcba' },
                    { id: 'obsidian', label: 'Black Obsidian', color: '#111115' },
                    { id: 'lapis', label: 'Lapis Lazuli', color: '#092540' },
                    { id: 'transparent', label: 'Transparent PNG', color: 'transparent' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setConfig({ ...config, background: bg.id as BackgroundTheme })}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border flex items-center gap-2 ${
                        config.background === bg.id
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f7e59b]'
                          : 'bg-[#03150e] border-[#d4af37]/15 text-[#88a899] hover:border-[#d4af37]/40'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: bg.color }} />
                      <span className="truncate">{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ink Color */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#a2c8b8] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  {isArabicUI ? 'لون الحبر والتذهيب:' : 'Ink & Gilding Color:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'gold', label: '24K Liquid Gold', color: '#d4af37' },
                    { id: 'white', label: 'Pure Ivory Pearl', color: '#ffffff' },
                    { id: 'lampblack', label: 'Lampblack Carbon', color: '#111827' },
                    { id: 'rosegold', label: 'Rose Gold', color: '#f43f5e' },
                    { id: 'emerald', label: 'Emerald Lustre', color: '#10b981' },
                  ].map((ink) => (
                    <button
                      key={ink.id}
                      type="button"
                      onClick={() => setConfig({ ...config, inkColor: ink.id as InkColorTheme })}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border flex items-center gap-2 ${
                        config.inkColor === ink.id
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f7e59b]'
                          : 'bg-[#03150e] border-[#d4af37]/15 text-[#88a899] hover:border-[#d4af37]/40'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: ink.color }} />
                      <span className="truncate">{ink.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Switches: Tashkeel & Proportion Guide */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#d4af37]/15">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#bedcd0]">
                  <input
                    type="checkbox"
                    checked={config.showTashkeel}
                    onChange={(e) => setConfig({ ...config, showTashkeel: e.target.checked })}
                    className="rounded accent-[#d4af37] w-4 h-4"
                  />
                  <span>{isArabicUI ? 'إظهار التشكيل والحركات' : 'Show Tashkeel Diacritics'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#bedcd0]">
                  <input
                    type="checkbox"
                    checked={config.showProportionGrid}
                    onChange={(e) => setConfig({ ...config, showProportionGrid: e.target.checked })}
                    className="rounded accent-[#d4af37] w-4 h-4"
                  />
                  <span>{isArabicUI ? 'شبكة ميزان النقاط (ابن مقلة)' : 'Ibn Muqla Nuqāt Dot Grid'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#bedcd0]">
                  <input
                    type="checkbox"
                    checked={config.layout === 'tughra'}
                    onChange={(e) => setConfig({ ...config, layout: e.target.checked ? 'tughra' : 'horizontal' })}
                    className="rounded accent-[#d4af37] w-4 h-4"
                  />
                  <span>{isArabicUI ? 'ختم الطغراء الملكي' : 'Tughra Royal Medallion'}</span>
                </label>
              </div>

            </div>

          </div>

        </div>

        {/* Right Column: Live Calligraphy Masterpiece Preview & Download PNG (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-6">
          
          <div className="bg-[#07251a]/90 backdrop-blur-md rounded-2xl p-5 border border-[#d4af37]/35 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#d4af37]" />
                <h3 className="text-sm font-semibold text-[#f1df96]">
                  {isArabicUI ? 'معاينة التحفة الخطية المباشرة' : 'Live Calligraphy Canvas'}
                </h3>
              </div>

              {/* Script & Dimensions Indicator */}
              <div className="flex items-center gap-2 text-xs text-[#8ab09e]">
                <span className="px-2 py-0.5 rounded bg-[#03180f] border border-[#d4af37]/20 text-[#f7e089]">
                  {currentStyleInfo.name}
                </span>
              </div>
            </div>

            {/* Canvas Container with luxury Islamic borders */}
            <div 
              ref={previewContainerRef}
              className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl border border-[#d4af37]/40 flex items-center justify-center bg-[#020e09]"
            >
              <canvas
                ref={canvasRef}
                width={800}
                height={800}
                className="w-full h-full object-contain"
              />

              {/* Hover Badge */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#02110b]/80 backdrop-blur-md border border-[#d4af37]/30 text-[11px] text-[#f7e089] flex items-center gap-1.5 pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Vector / Qalam Render</span>
              </div>
            </div>

            {/* Resolution Selector & High Res Download PNG */}
            <div className="bg-[#03150e] p-4 rounded-xl border border-[#d4af37]/20 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#9ebfb1]">
                <span>{isArabicUI ? 'دقة تحميل ملف PNG:' : 'Export Resolution:'}</span>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'standard', label: '1200x1200' },
                    { id: 'hd', label: '1920x1920 (HD)' },
                    { id: 'ultra', label: '2400x2400 (Print)' },
                  ].map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => setExportResolution(res.id as any)}
                      className={`px-2 py-1 rounded text-xs transition ${
                        exportResolution === res.id
                          ? 'bg-[#d4af37] text-[#051c14] font-bold'
                          : 'bg-[#072418] text-[#86ab99] hover:text-white'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 1. Download PNG */}
                <button
                  type="button"
                  onClick={handleDownloadPNG}
                  disabled={isExporting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f7e089] to-[#c59b27] text-[#051c14] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-[0.99] transition duration-200 cursor-pointer disabled:opacity-50"
                  title="Export raster PNG image at selected resolution"
                >
                  <Download className="w-4 h-4 text-[#051c14]" />
                  <span>
                    {isExporting 
                      ? (isArabicUI ? 'جاري التجهيز...' : 'Rendering...')
                      : (isArabicUI ? 'تحميل كصورة PNG' : 'Download PNG')}
                  </span>
                </button>

                {/* 2. Download Scalable Vector SVG */}
                <button
                  type="button"
                  onClick={handleDownloadSVG}
                  className="w-full py-3 px-4 rounded-xl bg-[#072d1f] hover:bg-[#0b3c29] text-[#f7e089] hover:text-white border border-[#d4af37]/40 hover:border-[#d4af37] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition duration-200 cursor-pointer"
                  title="Export scalable vector SVG for print, Illustrator, or web"
                >
                  <FileCode className="w-4 h-4 text-[#d4af37]" />
                  <span>{isArabicUI ? 'تحميل كناقل SVG حر' : 'Download Scalable SVG'}</span>
                </button>
              </div>

              {/* Extra Vector Tools: Copy SVG Code */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[#8ab09e] text-[11px]">
                  {isArabicUI ? 'ملفات فيكتور غير محدودة الدقة للتصميم والطباعة' : 'Infinitely scalable vector assets for Illustrator & Figma'}
                </span>
                <button
                  type="button"
                  onClick={handleCopySVG}
                  className="px-2.5 py-1 rounded-lg bg-[#041a12] hover:bg-[#082a1d] border border-[#d4af37]/25 text-[#bedcd0] hover:text-[#f7e089] flex items-center gap-1.5 transition text-[11px]"
                >
                  {svgCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{svgCopied ? (isArabicUI ? 'تم نسخ كود SVG' : 'SVG Code Copied!') : (isArabicUI ? 'نسخ كود SVG' : 'Copy SVG Code')}</span>
                </button>
              </div>

              {downloadSuccess && (
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 py-2 rounded-lg">
                  <Check className="w-4 h-4" />
                  <span>{isArabicUI ? 'تم تصدير اللوحة وتحميل صورة PNG بنجاح!' : 'Calligraphy PNG saved successfully!'}</span>
                </div>
              )}

              {svgDownloaded && (
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 py-2 rounded-lg">
                  <Check className="w-4 h-4" />
                  <span>{isArabicUI ? 'تم تنزيل ملف SVG المتجه بنجاح!' : 'Scalable Vector SVG downloaded successfully!'}</span>
                </div>
              )}
            </div>

            {/* AI Calligrapher Advice Panel (if available or generated) */}
            {aiGuidance && (
              <div className="p-4 rounded-xl bg-[#02130c] border border-[#d4af37]/25 space-y-2 text-xs text-[#a3c5b5]">
                <div className="flex items-center gap-1.5 text-[#f3e5ab] font-semibold">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>{isArabicUI ? 'توجيهات أستاذ الخط العربي' : 'Master Calligrapher Guidelines'}</span>
                </div>
                {aiGuidance.translation && (
                  <p className="italic text-[#d9ece2]">"{aiGuidance.translation}"</p>
                )}
                {aiGuidance.compositionGuidelines && (
                  <p className="leading-relaxed text-[#8cb19f]">{aiGuidance.compositionGuidelines}</p>
                )}
              </div>
            )}

            {/* Ibn Muqla Proportion Explainer Note */}
            <div className="p-3 rounded-lg bg-[#041a12]/70 border border-[#d4af37]/15 flex items-start gap-2.5 text-xs text-[#82a897]">
              <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <p>
                {isArabicUI
                  ? 'يتبع النظام معايير الوزير ابن مقلة (الأقلام الستة) حيث يُقاس ارتفاع حرف الألف بعدد النقاط الناتجة عن قطة القصبة، مما يضمن التوازن والانسجام الهندسي المطلق.'
                  : `Proportions follow Ibn Muqla's historic canon: letter heights and bowls are measured in rhomboid dots (Nuqāt) cut by the reed pen at a specific angle.`}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
