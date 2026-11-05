/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { CalligraphyStudio } from './components/CalligraphyStudio';
import { CalligraphyAnalyzer } from './components/CalligraphyAnalyzer';
import { CalligraphyGuide } from './components/CalligraphyGuide';
import { CalligraphyChatbot } from './components/CalligraphyChatbot';
import { CalligraphyStyleId } from './types/calligraphy';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [isArabicUI, setIsArabicUI] = useState<boolean>(false);
  const [selectedMasterpieceId, setSelectedMasterpieceId] = useState<string>('masterpiece-thuluth');
  const [studioText, setStudioText] = useState<string>('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
  const [studioStyle, setStudioStyle] = useState<CalligraphyStyleId>('thuluth');

  const handleSelectStyleForStudio = (styleId: CalligraphyStyleId) => {
    setStudioStyle(styleId);
    setActiveTab('studio');
  };

  const handleAnalyzeExample = (styleId: CalligraphyStyleId) => {
    setSelectedMasterpieceId(`masterpiece-${styleId}`);
    setActiveTab('analyzer');
  };

  const handleSendTextToStudio = (text: string) => {
    setStudioText(text);
    setActiveTab('studio');
  };

  return (
    <div 
      dir={isArabicUI ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-islamic-pattern text-[#e8f1ec] flex flex-col justify-between selection:bg-[#d4af37]/30 selection:text-[#f7e7a8]"
    >
      <div>
        {/* Navigation Bar */}
        <Navbar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isArabicUI={isArabicUI}
          setIsArabicUI={setIsArabicUI}
        />

        {/* Main Content Area */}
        <main className="pb-16 pt-2">
          {activeTab === 'studio' && (
            <CalligraphyStudio 
              isArabicUI={isArabicUI}
              onAnalyzeExample={handleAnalyzeExample}
              initialText={studioText}
              initialStyle={studioStyle}
            />
          )}

          {activeTab === 'analyzer' && (
            <CalligraphyAnalyzer 
              isArabicUI={isArabicUI}
              selectedMasterpieceId={selectedMasterpieceId}
            />
          )}

          {activeTab === 'guide' && (
            <CalligraphyGuide 
              isArabicUI={isArabicUI}
              onSelectStyleForStudio={handleSelectStyleForStudio}
            />
          )}

          {activeTab === 'chat' && (
            <CalligraphyChatbot 
              isArabicUI={isArabicUI}
              activeStyle={studioStyle}
              activeText={studioText}
              onSendTextToStudio={handleSendTextToStudio}
            />
          )}
        </main>
      </div>

      {/* Luxury Footer with Islamic Artistic Philosophy */}
      <footer className="border-t border-[#d4af37]/20 bg-[#020d08]/90 py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="font-amiri text-lg sm:text-xl text-[#f7e089]">
            «الْخَطُّ هَنْدَسَةٌ رُوحَانِيَّةٌ ظَهَرَتْ بِآلَةٍ جُسْمَانِيَّةٍ»
          </div>
          <div className="text-xs text-[#82a897] italic font-serif">
            "Calligraphy is spiritual geometry manifested through a physical instrument." — Classical Arabic Saying
          </div>
          <div className="text-[11px] text-[#5e8071] pt-2">
            © {new Date().getFullYear()} Khatat AI — Preserving & Revolutionizing Sacred Arabic Calligraphy with Modern Intelligence.
          </div>
        </div>
      </footer>
    </div>
  );
}
