import React from 'react';
import { 
  Sparkles, 
  Feather, 
  Compass, 
  BookOpen, 
  Languages, 
  Layers,
  Search
} from 'lucide-react';

export type ActiveTab = 'studio' | 'analyzer' | 'guide' | 'chat';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isArabicUI: boolean;
  setIsArabicUI: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isArabicUI,
  setIsArabicUI
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#03150e]/95 backdrop-blur-md border-b border-[#d4af37]/25 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab('studio')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          {/* Islamic Emblem Icon */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#f7e089] to-[#aa8210] p-0.5 shadow-lg group-hover:scale-105 transition">
            <div className="w-full h-full bg-[#041d14] rounded-[10px] flex items-center justify-center">
              <span className="font-amiri text-2xl font-bold text-[#f7e089] select-none">
                خط
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold font-cinzel text-gold-bright tracking-wider">
                KHATAT AI
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#d4af37]/20 text-[#f7e089] border border-[#d4af37]/30">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-[#7ea694] font-medium tracking-wide">
              {isArabicUI ? 'منصة خطاط الذكاء الاصطناعي الأصيل' : 'Arabic Calligraphy AI Platform'}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#020e09]/70 p-1.5 rounded-xl border border-[#d4af37]/20">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#ba8f19] text-[#051c14] shadow-md font-bold'
                : 'text-[#9ebfb1] hover:text-[#f7e089] hover:bg-[#062418]'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>{isArabicUI ? 'استوديو الخط والتخصيص' : 'Calligraphy Studio'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analyzer')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'analyzer'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#ba8f19] text-[#051c14] shadow-md font-bold'
                : 'text-[#9ebfb1] hover:text-[#f7e089] hover:bg-[#062418]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isArabicUI ? 'فحص وتحليل المخطوطات' : 'Image Analyzer'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#ba8f19] text-[#051c14] shadow-md font-bold'
                : 'text-[#9ebfb1] hover:text-[#f7e089] hover:bg-[#062418]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isArabicUI ? 'موسوعة الأقلام الستة' : 'Script Encyclopedia'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#ba8f19] text-[#051c14] shadow-md font-bold'
                : 'text-[#9ebfb1] hover:text-[#f7e089] hover:bg-[#062418]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isArabicUI ? 'مستشار الذكاء (شات)' : 'AI Consultant Chat'}</span>
          </button>
        </nav>

        {/* Right Action: Language Switcher */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsArabicUI(!isArabicUI)}
            className="px-3 py-1.5 rounded-xl bg-[#041c13] hover:bg-[#082f21] border border-[#d4af37]/30 text-xs font-semibold text-[#f7e089] flex items-center gap-2 transition shadow"
            title="Toggle Language / تغيير اللغة"
          >
            <Languages className="w-4 h-4 text-[#d4af37]" />
            <span>{isArabicUI ? 'English' : 'العربية'}</span>
          </button>
        </div>

      </div>

      {/* Mobile Navigation Tabs (bottom scrollbar) */}
      <div className="md:hidden flex items-center justify-around bg-[#020e09] border-t border-[#d4af37]/20 py-2 px-2">
        <button
          type="button"
          onClick={() => setActiveTab('studio')}
          className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg flex flex-col items-center gap-1 ${
            activeTab === 'studio' ? 'text-[#f7e089] bg-[#07291c]' : 'text-[#7ea694]'
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>{isArabicUI ? 'الاستوديو' : 'Studio'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analyzer')}
          className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg flex flex-col items-center gap-1 ${
            activeTab === 'analyzer' ? 'text-[#f7e089] bg-[#07291c]' : 'text-[#7ea694]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>{isArabicUI ? 'المحلل' : 'Analyzer'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg flex flex-col items-center gap-1 ${
            activeTab === 'guide' ? 'text-[#f7e089] bg-[#07291c]' : 'text-[#7ea694]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isArabicUI ? 'الموسوعة' : 'Guide'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg flex flex-col items-center gap-1 ${
            activeTab === 'chat' ? 'text-[#f7e089] bg-[#07291c]' : 'text-[#7ea694]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isArabicUI ? 'المستشار' : 'Chat'}</span>
        </button>
      </div>
    </header>
  );
};
