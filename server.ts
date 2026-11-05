import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // 1. Status / Connection Check
  app.get('/api/status', (req, res) => {
    const ai = getGeminiClient();
    res.json({
      status: 'ok',
      hasGeminiKey: !!ai,
      model: 'gemini-3.8-flash',
      serverTime: new Date().toISOString(),
    });
  });

  // 2. Calligraphy Image Analysis
  app.post('/api/analyze-calligraphy', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg' } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'No image data provided.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY_MISSING',
          message: 'Gemini API key is not configured in the server environment. Please set GEMINI_API_KEY in the Secrets panel.',
        });
      }

      // Clean base64 string
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

      const prompt = `You are a world-renowned Master Calligrapher (أستاذ الخط العربي) and Islamic Art Scholar with deep expertise in Arabic paleography and classical scripts (Aqlam al-Sittah and historic traditions).

Carefully examine this Arabic calligraphy artwork. Perform an exhaustive paleographic analysis and return ONLY a valid JSON object (no markdown code blocks, raw JSON only) matching this exact schema:

{
  "style": "Thuluth" | "Naskh" | "Diwani" | "Ruq'ah" | "Kufic" | "Nastaliq" | "Diwani Jali" | "Maghrebi" | "Muhaqqaq" | "Other",
  "arabicStyle": "ثلث" | "نسخ" | "ديواني" | "رقعة" | "كوفي" | "نستعليق" | "ديواني جلي" | "مغربي" | "محقق" | "آخر",
  "confidence": number, // e.g. 96
  "extractedArabic": "Accurate Arabic text transcription with full Tashkeel/harakat diacritics",
  "translation": "High quality English translation of the phrase/verse",
  "significance": "Spiritual, poetic, Quranic, or cultural context of the written text",
  "calligraphicIndicators": [
    "Key identifying characteristic 1 (e.g., prominent tarwees hooks on ascenders)",
    "Key identifying characteristic 2 (e.g., steep downward line slope or rigid baseline)",
    "Key identifying characteristic 3 (e.g., dense overlapping composition or compact spacing)"
  ],
  "dotsAndStrokes": {
    "qalamAngle": "Estimated pen nib cut angle in degrees (e.g. ~65° for Thuluth, ~30° for Ruq'ah, ~45° for Naskh)",
    "dotsShape": "Description of the Nuqāt (e.g. Diamond rhombus with sharp corners, conjoined slashes, or round points)",
    "strokeModulation": "Contrast between thickest wetted reed stroke and thin hair-line taper (Tash'ir)",
    "tarwees": "Presence or absence of the serif/barb on ascenders (Alif, Lam, Kaf)"
  },
  "letterAnatomy": [
    {
      "letter": "e.g. Alif (ا)",
      "measurements": "e.g. ~7 dots (Nuqāt) following Ibn Muqla's proportion system (Mizan al-Huruf)",
      "strokeDetails": "Description of the stroke beginning (ra's), stem (qadd), and base/foot curvature"
    },
    {
      "letter": "e.g. Waw (و)",
      "measurements": "e.g. Head measures 2 dots wide, tail swings 4-5 dots",
      "strokeDetails": "Description of head loop closure and sweeping descending terminal"
    },
    {
      "letter": "e.g. Nun / Ba (ن / ب)",
      "measurements": "e.g. Deep elliptical bowl of 5 dots width",
      "strokeDetails": "Descent below baseline and graceful upward return"
    }
  ],
  "compositionType": "e.g. Jali / Overlapping Composite (تراكيب) / Horizontal Classic / Circular Tughra / Arch Mihrab",
  "compositionAnalysis": "Insight on how the calligrapher balanced empty space (khalā'), rhythm, letter interlocking, and decorative filling marks",
  "historicalMasters": ["Master Calligrapher 1", "Master Calligrapher 2"],
  "historicalEra": "e.g. Ottoman Imperial (18th c.) or Classical Abbasid (10th c.)",
  "beginnerTips": "Practical advice for students on how to recognize this script versus similar styles"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '';
      let parsedData;
      try {
        // Strip any possible markdown formatting if present
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON:', responseText);
        return res.status(500).json({
          error: 'PARSE_ERROR',
          message: 'Received non-JSON response from AI analysis.',
          raw: responseText,
        });
      }

      return res.json(parsedData);
    } catch (err: any) {
      console.error('Analysis error:', err);
      return res.status(500).json({
        error: 'ANALYSIS_FAILED',
        message: err.message || 'An error occurred while analyzing the calligraphy image.',
      });
    }
  });

  // 3. Arabic Vocalization (Tashkeel) and Script Guidance
  app.post('/api/tashkeel-and-rules', async (req, res) => {
    try {
      const { text, style = 'Thuluth' } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text is required.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY_MISSING',
          message: 'Gemini API key is not configured in the server environment.',
        });
      }

      const prompt = `You are a Master Arabic Calligrapher and Arabic grammarian.
Given the Arabic text: "${text}"
And the requested calligraphy style: "${style}"

Provide:
1. The text with pristine, grammatically accurate Tashkeel (harakat: fatha, damma, kasra, sukun, shaddah, tanween).
2. Word-for-word or clean English translation.
3. Transliteration in Latin alphabet.
4. Calligraphic composition guidance for writing this specific phrase in the "${style}" style, including:
   - Baseline behavior
   - Ascender and descender rhythm
   - Kashida (elongation) placement recommendations
   - Tashkeel placement advice (decorative vs functional harakat)
5. Suggested decorative filler ornaments (such as tarwees, fleurons, or ornamental dots) appropriate for this style.

Return ONLY a valid JSON object matching:
{
  "vocalizedText": "Arabic text with full tashkeel",
  "translation": "English translation",
  "transliteration": "Latin transliteration",
  "kashidaSuggestions": ["where to stretch letters for balance"],
  "compositionGuidelines": "Detailed guidance for writing in this script",
  "ornamentRecommendations": ["ornamental accents recommendation"],
  "recommendedLayout": "Classical Horizontal" | "Circular Tughra" | "Stacked Pyramid" | "Mihrab Arch"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      res.json(parsed);
    } catch (err: any) {
      console.error('Tashkeel error:', err);
      res.status(500).json({
        error: 'TASHKEEL_FAILED',
        message: err.message || 'Failed to process tashkeel and guidance.',
      });
    }
  });

  // 4. Gemini Calligraphy Consultant & Research Chatbot
  app.post('/api/chat-calligrapher', async (req, res) => {
    try {
      const { messages, activeStyle = 'Thuluth', activeText = '' } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY_MISSING',
          message: 'Gemini API key is not configured in the server environment. Please set GEMINI_API_KEY in the Secrets panel to chat with the AI Master Calligrapher.',
        });
      }

      const systemInstruction = `You are "Ustadh Khatat AI" (أستاذ خطاط الذكاء الاصطناعي), an esteemed Master Arabic Calligrapher, paleographer, and Islamic art design consultant.
Your purpose is to help the user brainstorm, research, compose, and refine Arabic calligraphy concepts, verses, and artwork.

Current studio context:
- Currently selected script style: ${activeStyle}
- Current studio text: "${activeText}"

Capabilities:
1. Brainstorm sacred verses (Quran), prophetic sayings (Hadith), classical poetry (al-Mutanabbi, Rumi, Ibn al-Farid, al-Shafi'i), philosophical proverbs, or personalized name calligraphies.
2. Recommend the best script style (Thuluth, Naskh, Diwani, Ruq'ah, Kufic, Nastaliq) for their intended purpose, architecture, or occasion (e.g., weddings, home mihrab, gifts, logos).
3. Provide impeccably vocalized Arabic text (with full Tashkeel/harakat) and poetic English translations.
4. Advise on layout composition: circular Tughra medallions, interlocking composites (Tarkib), horizontal classic bands, or architectural arches.
5. Provide technical calligraphy guidance: reed pen (Qalam) angle, Ibn Muqla dot proportions (Nuqāt), and Tezhib (gold illumination) styles.

Guidelines:
- Match the user's language (Arabic or English).
- Tone: Cultured, poetic, encouraging, reverent to classical art, and practically actionable.
- Format responses cleanly with readable paragraphs and bullet points where helpful.
- When suggesting an Arabic phrase, highlight it clearly in quotes with full Tashkeel so the user can easily copy and paste it into the Khatat AI Studio.`;

      const contents = messages.map((m: any) => ({
        role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || '';
      res.json({
        reply: replyText,
      });
    } catch (err: any) {
      console.error('Chat error:', err);
      res.status(500).json({
        error: 'CHAT_FAILED',
        message: err.message || 'Failed to generate response from Master Calligrapher AI.',
      });
    }
  });

  // Vite Integration
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Khatat AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
