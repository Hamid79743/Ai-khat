import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Copy, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  Lightbulb, 
  BookOpen, 
  Feather,
  AlertCircle
} from 'lucide-react';
import { CalligraphyStyleId } from '../types/calligraphy';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface CalligraphyChatbotProps {
  isArabicUI: boolean;
  activeStyle: CalligraphyStyleId;
  activeText: string;
  onSendTextToStudio: (text: string) => void;
}

export const CalligraphyChatbot: React.FC<CalligraphyChatbotProps> = ({
  isArabicUI,
  activeStyle,
  activeText,
  onSendTextToStudio,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: isArabicUI
        ? `أهلاً بك في مجلس «خطاط الذكاء الاصطناعي» (Khatat AI). أنا مستشارك في فنون الخط العربي والتراكيب الإسلامية والأوزان الشعرية. كيف يمكنني مساعدتك اليوم في ابتكار فكرتك الخطية؟`
        : `Welcome to the Khatat AI Calligraphy Atelier. I am your Master Calligrapher and Islamic art consultant. How may I assist you with brainstorming verses, exploring classical scripts, or refining your composition today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setHasGeminiKey(Boolean(data.hasGeminiKey)))
      .catch(() => setHasGeminiKey(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const samplePromptIdeas = [
    {
      en: 'Suggest a Quranic verse for a home entrance with full Tashkeel',
      ar: 'اقترح آية قرآنية كريمة لمدخل المنزل مع التشكيل الكامل',
    },
    {
      en: 'What script best fits a poetic phrase about patience and courage?',
      ar: 'ما هو الخط الأنسب لبيت شعر عن الصبر والشجاعة؟',
    },
    {
      en: 'How should I structure Ayat al-Kursi in a circular Thuluth composition?',
      ar: 'كيف أوزع آية الكرسي في تركيب دائري بخط الثلث؟',
    },
    {
      en: 'Explain how Ibn Muqla measured letter heights using reed pen dots (Nuqāt)',
      ar: 'اشرح كيف قاس الوزير ابن مقلة ارتفاع الحروف بنقاط القصبة',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);
    setErrorMsg(null);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat-calligrapher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          activeStyle,
          activeText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'GEMINI_API_KEY_MISSING') {
          setErrorMsg(
            isArabicUI
              ? 'مفتاح Gemini API غير مهيأ. يرجى إضافة GEMINI_API_KEY في لوحة الإعدادات لتفعيل المحادثة الحية.'
              : 'Gemini API key is not configured. Please add GEMINI_API_KEY in the Secrets panel to enable real-time consultation.'
          );
        } else {
          setErrorMsg(data.message || 'Failed to generate response.');
        }
        return;
      }

      const botReply: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(
        isArabicUI
          ? 'تعذر الاتصال بخادم الاستشارات الخطية. تفقد اتصال الإنترنت.'
          : 'Could not connect to the consultation service. Please check your connection.'
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Extract possible quoted Arabic phrases from bot text so user can send them to Studio
  const extractArabicQuotes = (text: string) => {
    const matches = text.match(/["«“]([\u0600-\u06FF\s]+)["»”]/g);
    if (!matches) return [];
    return matches.map(m => m.replace(/["«»“”]/g, '').trim()).filter(s => s.length > 4);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#031d13] via-[#083525] to-[#02180f] p-6 border border-[#d4af37]/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isArabicUI ? 'المستشار الخطي بالذكاء الاصطناعي' : 'Gemini Calligraphy Consultant'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-cinzel text-gold-bright tracking-wide">
            {isArabicUI ? 'مجلس أستاذ الخط والبحث الفني' : 'Calligraphy Research & Idea Chat'}
          </h1>
          <p className="text-xs sm:text-sm text-[#a3c2b4]">
            {isArabicUI
              ? 'ناقش أفكارك الإبداعية، وابحث عن آيات وأشعار تناسب مناسبتك، واحصل على نصائح لتركيب اللوحات والخطوط.'
              : 'Brainstorm creative compositions, research classical poetry or verses, and consult on aesthetic proportions.'}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#02120b] border border-[#d4af37]/20 text-xs">
          <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-[#a5ccb9]">
            {hasGeminiKey ? 'Gemini 3.8 Flash Active' : 'Key Needed in Secrets'}
          </span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-[#07251a]/90 backdrop-blur-md rounded-2xl border border-[#d4af37]/30 shadow-2xl flex flex-col h-[650px] overflow-hidden">
        
        {/* Messages List Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const arabicQuotes = !isUser ? extractArabicQuotes(msg.text) : [];

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    isUser
                      ? 'bg-gradient-to-br from-[#d4af37] to-[#8d6910] text-[#051c14]'
                      : 'bg-[#03170e] border border-[#d4af37]/40 text-[#f7e089]'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-[#d4af37]" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg whitespace-pre-wrap ${
                      isUser
                        ? 'bg-gradient-to-r from-[#0d4631] to-[#072d1f] text-[#f7ecd0] border border-[#d4af37]/30 rounded-tr-none'
                        : 'bg-[#03150e]/95 text-[#e5f0ea] border border-[#d4af37]/25 rounded-tl-none font-sans'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* If message has extracted Arabic phrases, show "Use in Studio" chips */}
                  {arabicQuotes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {arabicQuotes.slice(0, 3).map((phrase, qIdx) => (
                        <button
                          key={qIdx}
                          type="button"
                          onClick={() => onSendTextToStudio(phrase)}
                          className="px-2.5 py-1 rounded-lg bg-[#082a1d] hover:bg-[#d4af37] text-[#f7e089] hover:text-[#051c14] border border-[#d4af37]/30 text-xs font-amiri font-bold flex items-center gap-1.5 transition shadow"
                          title="Open and customize this text in Calligraphy Studio"
                        >
                          <Feather className="w-3 h-3" />
                          <span>{isArabicUI ? 'تطبيق في الاستوديو:' : 'Design in Studio:'} "{phrase.slice(0, 24)}..."</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Actions under bubble */}
                  <div className={`flex items-center gap-2 text-[10px] text-[#719886] ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="hover:text-[#f7e089] transition flex items-center gap-1"
                      title="Copy text"
                    >
                      {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-9 h-9 rounded-xl bg-[#03170e] border border-[#d4af37]/40 text-[#f7e089] flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-[#d4af37] animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#03150e] border border-[#d4af37]/25 rounded-tl-none flex items-center gap-2 text-xs text-[#d4af37]">
                <Sparkles className="w-4 h-4 animate-spin text-[#d4af37]" />
                <span>{isArabicUI ? 'أستاذ الخط يبحث ويفكر...' : 'Ustadh Khatat is consulting the classical archives...'}</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Bar */}
        <div className="p-3 bg-[#03150e]/90 border-t border-[#d4af37]/15">
          <div className="text-[11px] text-[#789d8c] mb-1.5 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isArabicUI ? 'أفكار ومواضيع جاهزة للبحث:' : 'Suggested Discussion Topics:'}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {samplePromptIdeas.map((idea, idx) => {
              const text = isArabicUI ? idea.ar : idea.en;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(text)}
                  className="px-3 py-1 rounded-lg bg-[#07281c] hover:bg-[#0c402d] text-[#c9e0d4] hover:text-[#f7e089] border border-[#d4af37]/20 text-xs whitespace-nowrap transition cursor-pointer"
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#02100a] border-t border-[#d4af37]/25 flex items-center gap-3">
          <input
            type="text"
            dir={isArabicUI ? 'rtl' : 'ltr'}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              isArabicUI
                ? 'اسأل أستاذ الخط عن أفكار، أو آيات، أو تراكيب خطية...'
                : 'Ask the Master Calligrapher about verses, layout composition, or scripts...'
            }
            className="flex-1 px-4 py-3 rounded-xl bg-[#041a12] text-[#f7ecd0] placeholder-[#648777] border border-[#d4af37]/30 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none text-sm transition"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isTyping}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38914] text-[#051c14] font-bold text-sm flex items-center gap-2 hover:brightness-110 active:scale-95 transition shadow-lg disabled:opacity-40 cursor-pointer"
          >
            <span>{isArabicUI ? 'إرسال' : 'Send'}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
