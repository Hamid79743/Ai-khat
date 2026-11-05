export type CalligraphyStyleId = 
  | 'thuluth' 
  | 'naskh' 
  | 'diwani' 
  | 'ruqaa' 
  | 'kufic' 
  | 'nastaliq';

export interface CalligraphyStyleInfo {
  id: CalligraphyStyleId;
  name: string;
  arabicName: string;
  fontClass: string;
  fontFamily: string;
  period: string;
  description: string;
  qalamAngle: string;
  alifHeightDots: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Master';
  characteristics: string[];
  sampleText: string;
}

export type CompositionLayout = 
  | 'horizontal' 
  | 'arch' 
  | 'tughra' 
  | 'stacked' 
  | 'minimal';

export type BorderStyle = 
  | 'arabesque' 
  | 'girih' 
  | 'arch' 
  | 'double-gold' 
  | 'subtle' 
  | 'none';

export type BackgroundTheme = 
  | 'emerald' 
  | 'parchment' 
  | 'obsidian' 
  | 'lapis' 
  | 'transparent';

export type InkColorTheme = 
  | 'gold' 
  | 'white' 
  | 'lampblack' 
  | 'rosegold' 
  | 'emerald';

export interface CalligraphyCustomization {
  text: string;
  style: CalligraphyStyleId;
  fontSize: number; // 24 to 120
  strokeThickness: number; // 1 to 10
  letterSpacing: number; // -2 to 10
  lineHeight: number; // 1.0 to 2.8
  slantAngle: number; // -20 to 20
  layout: CompositionLayout;
  border: BorderStyle;
  background: BackgroundTheme;
  inkColor: InkColorTheme;
  showTashkeel: boolean;
  showProportionGrid: boolean;
  showDecorativeMarks: boolean;
  addKashida: boolean;
}

export interface LetterAnatomyItem {
  letter: string;
  measurements: string;
  strokeDetails: string;
}

export interface CalligraphyAnalysisResult {
  style: string;
  arabicStyle: string;
  confidence: number;
  extractedArabic: string;
  translation: string;
  significance?: string;
  calligraphicIndicators: string[];
  dotsAndStrokes: {
    qalamAngle: string;
    dotsShape: string;
    strokeModulation: string;
    tarwees: string;
  };
  letterAnatomy: LetterAnatomyItem[];
  compositionType?: string;
  compositionAnalysis: string;
  historicalMasters: string[];
  historicalEra?: string;
  beginnerTips: string;
}

export interface SampleMasterpiece {
  id: string;
  title: string;
  arabicTitle: string;
  style: CalligraphyStyleId;
  era: string;
  calligrapher: string;
  imageThumbnail: string; // SVG or data URL
  arabicText: string;
  translation: string;
  analysis: CalligraphyAnalysisResult;
}
