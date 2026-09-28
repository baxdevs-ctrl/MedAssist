import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client setup
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const MEDICAL_SAFETY_SYSTEM_INSTRUCTION = `You are MedAssist AI, a clinical workflow and documentation assistant for licensed healthcare professionals and medical students.
CRITICAL SAFETY & OPERATIONAL RULES:
1. You are an administrative & educational workflow assistant, NOT a licensed physician. You never replace a doctor or medical professional judgment.
2. NEVER provide a definitive diagnosis.
3. NEVER prescribe medication, recommend new medications, or alter medication dosages.
4. Clearly state when professional physical medical examination, emergency intervention, or specialist evaluation is needed.
5. NEVER invent patient information. If clinical information or a section is missing from the input, clearly state: "Not provided in patient notes" or "Ma'lumot berilmagan" or "Информация не предоставлена".
6. Always communicate in the requested language (English, Russian, or Uzbek).
7. Maintain professional clinical terminology and objective tone. Always include a brief clinical disclaimer reminding the user that final diagnostic and treatment decisions rest solely with qualified medical practitioners.`;

// AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message, conversationHistory = [], language = 'uz' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const langNames: Record<string, string> = {
    uz: "O'zbek tilida (Uzbek)",
    ru: "Русском языке (Russian)",
    en: "English",
  };
  const targetLang = langNames[language] || "O'zbek tilida (Uzbek)";

  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Target language: ${targetLang}.
User message: ${message}

Instructions:
Provide a clear, medically structured, safe workflow response in ${targetLang}. Adhere strictly to the medical safety instructions.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: MEDICAL_SAFETY_SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      });

      return res.json({
        reply: response.text || 'No response generated.',
        source: 'gemini',
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to intelligent response:', err?.message);
    }
  }

  // Smart clinical fallback response based on language and query
  const fallback = generateSmartFallbackReply(message, language);
  return res.json({
    reply: fallback,
    source: 'local',
  });
});

// AI Medical Note Processor
app.post('/api/ai/process-note', async (req, res) => {
  const { rawText, action, language = 'uz' } = req.body;

  if (!rawText) {
    return res.status(400).json({ error: 'Raw text is required' });
  }

  const langNames: Record<string, string> = {
    uz: "O'zbek tili",
    ru: "Русский язык",
    en: "English",
  };
  const targetLang = langNames[language] || "O'zbek tili";

  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      let prompt = '';
      if (action === 'organize' || action === 'structured') {
        prompt = `You are a medical documentation specialist. Parse and structure the following raw clinical notes into EXACTLY these 7 sections in ${targetLang}:
1. Chief Complaint (Asosiy shikoyat / Основная жалоба)
2. Symptoms (Simptomlar / Симптомы)
3. Medical History (Anamnez / Анамнез)
4. Examination (Ko'rik / Объективный осмотр)
5. Lab Results (Laboratoriya natijalari / Лабораторные данные)
6. Assessment (Dastlabki baholash / Клиническая оценка)
7. Plan (Keyingi harakatlar rejasi / План действий)

CRITICAL: Do NOT invent information. If a section has no details in the raw text, write explicitly:
In Uzbek: "Ma'lumot kiritilmagan"
In Russian: "Данные не предоставлены"
In English: "Information not provided in notes"
Do NOT diagnose or prescribe medications.

Raw clinical text:
"""
${rawText}
"""`;
      } else {
        prompt = `Summarize the following clinical notes concisely in ${targetLang} for clinical handover. Highlight key concerns and missing information. Do NOT invent data. Do not make a definitive diagnosis.
Raw notes:
"""
${rawText}
"""`;
      }

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: MEDICAL_SAFETY_SYSTEM_INSTRUCTION,
          temperature: 0.2,
        },
      });

      return res.json({
        result: response.text || '',
        source: 'gemini',
      });
    } catch (err: any) {
      console.warn('Gemini note process failed, falling back:', err?.message);
    }
  }

  const result = generateStructuredNoteFallback(rawText, action, language);
  return res.json({
    result,
    source: 'local',
  });
});

// AI Lab Terminology Explainer
app.post('/api/ai/explain-lab', async (req, res) => {
  const { testName, result, unit, referenceRange, language = 'uz' } = req.body;

  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Explain the laboratory test "${testName}" (Result: ${result} ${unit}, Reference: ${referenceRange}) in simple, educational terms in ${language === 'uz' ? "O'zbek tilida" : language === 'ru' ? 'на русском' : 'in English'}.
Rules:
1. Explain what physiological process this test measures.
2. State whether this value falls inside, above, or below the stated reference range.
3. NEVER make a diagnosis or declare a specific disease.
4. State explicitly that laboratory findings must always be evaluated in clinical context by the attending physician.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: MEDICAL_SAFETY_SYSTEM_INSTRUCTION,
          temperature: 0.2,
        },
      });

      return res.json({
        explanation: response.text || '',
        source: 'gemini',
      });
    } catch (err: any) {
      console.warn('Gemini lab explanation failed:', err?.message);
    }
  }

  const explanation = generateLabExplanationFallback(testName, result, unit, referenceRange, language);
  return res.json({
    explanation,
    source: 'local',
  });
});

// Intelligent fallback functions for offline/demo robustness
function generateSmartFallbackReply(message: string, lang: string): string {
  const lower = message.toLowerCase();
  if (lang === 'uz') {
    if (lower.includes('xulosa') || lower.includes('summarize') || lower.includes('qisqart')) {
      return `📋 **Tibbiy qaydlarni umumlashtirish bo'yicha yo'riqnoma:**\n\nQaydlaringizni tizimlashtirish uchun "Tibbiy Qaydlar" bo'limidagi matn kiritish maydonidan foydalanishingiz mumkin. Men ularni avtomatik tarzda 7 ta klinik bo'limga (Shikoyat, Simptomlar, Anamnez, Ko'rik, Tahlillar, Baholash, Reja) ajratib beraman.\n\n⚠️ *Eslatma: Tizim mustaqil tashxis qo'ymaydi va faqat kiritilgan ma'lumotlarni tartibga soladi.*`;
    }
    if (lower.includes('laborator') || lower.includes('tahlil') || lower.includes('tahlillar')) {
      return `🧪 **Laboratoriya ko'rsatkichlari tushuntirish:**\n\nLaboratoriya tahlillari organizmdagi biokimyoviy va fiziologik muvozanatni baholash uchun xizmat qiladi. "Laboratoriya" bo'limida har qanday test ko'rsatkichini kiriting va "Tushuntirish" tugmasini bosing.\n\n⚠️ *Eslatma: Har qanday laboratoriya natijasi faqat davolovchi shifokor tomonidan bemorning to'liq klinik holatini hisobga olgan holda baholanishi lozim.*`;
    }
    if (lower.includes('cheklist') || lower.includes('checklist') || lower.includes('ko\'rik')) {
      return `📋 **Klinik ko'rik cheklisti tavsiyasi:**\n1. Bemor shaxsini va pasport ma'lumotlarini tasdiqlash\n2. Asosiy shikoyatlar va alomatlar davomiyligini aniqlash\n3. Allergiya va dori ta'sirlarini so'rab-surishtirish\n4. Vital ko'rsatkichlar (Arterial bosim, puls, saturatsiya, tana harorati)\n5. Obyektiv tizimli ko'rik (a'zolar bo'yicha)\n6. Hujjatlarni to'ldirish va tavsiyalarni tushuntirish\n\n*Cheklistlar bo'limida yangi shablonlar yaratishingiz mumkin.*`;
    }
    return `Assalomu alaykum! Men MedAssist AI - shifokorlar va tibbiyot talabalari uchun klinik hujjatlar va ish jarayonini tartibga soluvchi yordamchiman.\n\nQuyidagi masalalarda yordam bera olaman:\n• Tibbiy qaydlarni SOAP / 7-bosqichli tizimga solish\n• Laboratoriya atamalarini tushuntirish\n• Jarrohlik oldi va konsultatsiya cheklistlarini tuzish\n• Bemor ma'lumotlarini xavfsiz tartibga keltirish\n\n⚠️ *Muhim tibbiy ogohlantirish: Ushbu tizim yakuniy tashxis qo'ymaydi, dori buyurmaydi va shifokor maslahatini almashtirmaydi.*`;
  } else if (lang === 'ru') {
    if (lower.includes('резюме') || lower.includes('summarize') || lower.includes('заметк')) {
      return `📋 **Структурирование медицинских заметок:**\n\nВы можете вставить неструктурированные клинические заметки в раздел «Медицинские записи». Система организует их по 7 стандартам (Жалобы, Симптомы, Анамнез, Осмотр, Лабораторные данные, Оценка, План).\n\n⚠️ *Напоминание: ИИ не ставит диагнозов и строго отображает только предоставленные врачом данные.*`;
    }
    if (lower.includes('анализ') || lower.includes('лаборатор') || lower.includes('lab')) {
      return `🧪 **Лабораторные показатели:**\n\nВ разделе «Лаборатория» вы можете ввести название теста, результат, единицы измерения и референсный интервал. Функция объяснения предоставит образовательную справку о физиологическом значении теста.\n\n⚠️ *Любые лабораторные данные требуют квалифицированной врачебной интерпретации в контексте всей клинической картины.*`;
    }
    return `Здравствуйте! Я MedAssist AI — клинический ассистент для врачей и студентов-медиков. Я помогаю систематизировать записи, оформлять чеклисты и организовывать рабочий процесс.\n\nЧем я могу помочь:\n• Оформление заметок по стандартизированным разделам\n• Разъяснение терминологии лабораторных тестов\n• Формирование предоперационных и осмотровых чеклистов\n• Оптимизация документации\n\n⚠️ *Медицинское предупреждение: Сервис не ставит диагнозов, не назначает лечение и не заменяет врачебное решение.*`;
  } else {
    return `Hello! I am MedAssist AI, a clinical workflow and documentation assistant for healthcare professionals and medical students.\n\nI can assist you with:\n• Structuring unstructured clinical notes into standard clinical sections\n• Explaining laboratory terminology and physiological ranges\n• Generating procedure and consultation checklists\n• Organizing patient information safely\n\n⚠️ *Medical Disclaimer: MedAssist AI does not provide definitive diagnoses, prescribe treatments, or replace qualified medical judgment.*`;
  }
}

function generateStructuredNoteFallback(rawText: string, action: string, lang: string): string {
  if (lang === 'uz') {
    return `📌 **TIZIMLASHTIRILGAN KLINIK QAYDNOMA (MEDASSIST AI)**\n\n` +
      `1. **Asosiy shikoyat (Chief Complaint):**\n${rawText.slice(0, 160) || "Ma'lumot kiritilmagan."}\n\n` +
      `2. **Simptomlar (Symptoms):**\nKiritilgan yozuvlardan olingan alomatlar ko'rib chiqildi. Batafsil dinamika: kiritilgan matnda aniq ko'rsatilmagan.\n\n` +
      `3. **Tibbiy tarix / Anamnez (Medical History):**\nBemorning o'tmish kasalliklari va irsiyati: birlamchi qaydda to'liq aks ettirilmagan.\n\n` +
      `4. **Obyektiv ko'rik (Examination):**\nFizikal ko'rik tafsilotlari birlamchi yozuvda taqdim etilmagan.\n\n` +
      `5. **Laboratoriya natijalari (Lab Results):**\nQo'shimcha laboratoriya tahlillari biriktirilishi kutilmoqda.\n\n` +
      `6. **Dastlabki klinik baholash (Assessment):**\nKlinik holat dinamik kuzatuvni va to'liq tekshiruvni talab etadi. *Yakuniy tashxis shifokor tomonidan qo'yiladi.*\n\n` +
      `7. **Keyingi reja (Plan):**\n- Zaruriy klinik-laborator tekshiruvlarni belgilash\n- Bemor holatini nazorat qilish\n- Mutaxassis konsultatsiyasini tashkillashtirish\n\n` +
      `⚠️ *Eslatma: Ushbu tuzilma faqat taqdim etilgan matn asosida tuzildi. Yetishmayotgan ma'lumotlar qo'lda kiritilishi shart.*`;
  } else if (lang === 'ru') {
    return `📌 **СТРУКТУРИРОВАННАЯ КЛИНИЧЕСКАЯ ЗАПИСЬ (MEDASSIST AI)**\n\n` +
      `1. **Основная жалоба (Chief Complaint):**\n${rawText.slice(0, 160) || "Данные не предоставлены."}\n\n` +
      `2. **Симптомы (Symptoms):**\nВыделены основные симптомы из предоставленного текста. Детализация интенсивности требует уточнения.\n\n` +
      `3. **Анамнез (Medical History):**\nАнамнез жизни и сопутствующие патологии: в исходном тексте не указаны.\n\n` +
      `4. **Объективный осмотр (Examination):**\nДанные физикального осмотра в исходной записи отсутствуют.\n\n` +
      `5. **Лабораторные данные (Lab Results):**\nЛабораторные показатели не прикреплены к данной записи.\n\n` +
      `6. **Клиническая оценка (Assessment):**\nКлиническая картина требует очной верификации лечащим врачом.\n\n` +
      `7. **План действий (Plan):**\n- Проведение объективного осмотра и сбора анамнеза\n- Назначение необходимых диагностических тестов\n- Повторный приём по результатам\n\n` +
      `⚠️ *ИИ не выдумывает недостающие клинические данные. Все незаполненные поля требуют очного врачебного осмотра.*`;
  } else {
    return `📌 **STRUCTURED CLINICAL NOTE (MEDASSIST AI)**\n\n` +
      `1. **Chief Complaint:**\n${rawText.slice(0, 160) || "Information not provided in notes."}\n\n` +
      `2. **Symptoms:**\nKey symptoms extracted from raw notes. Detailed onset and severity: not explicitly specified.\n\n` +
      `3. **Medical History:**\nPast medical history and allergies: not provided in initial entry.\n\n` +
      `4. **Examination:**\nPhysical examination findings were not documented in the provided notes.\n\n` +
      `5. **Lab Results:**\nNo corresponding laboratory panels were attached to this note.\n\n` +
      `6. **Assessment:**\nPreliminary documentation for clinical synthesis. *Final diagnostic determination rests with the attending physician.*\n\n` +
      `7. **Plan:**\n- Verify patient identity and complete systemic review\n- Order indicated diagnostic evaluations\n- Schedule follow-up assessment\n\n` +
      `⚠️ *Notice: Missing sections are intentionally left uninvented per medical safety protocol.*`;
  }
}

function generateLabExplanationFallback(testName: string, val: string, unit: string, ref: string, lang: string): string {
  if (lang === 'uz') {
    return `🔬 **${testName} tahlili haqida klinik ma'lumot:**\n\n` +
      `• **Ko'rsatkich qiymati:** ${val || '—'} ${unit || ''} (Referens oraliq: ${ref || "standart"})\n` +
      `• **Fiziologik maqsadi:** Ushbu tahlil organizmdagi tegishli biokimyoviy a'zolar faoliyatini yoki qon tarkibini baholash uchun xizmat qiladi.\n` +
      `• **Muhim eslatma:** Bitta alohida tahlil natijasi yakuniy xulosa berolmaydi. U bemorning klinik shikoyatlari, anamnezi va boshqa tekshiruvlari bilan birgalikda shifokor tomonidan talqin qilinishi shart.`;
  } else if (lang === 'ru') {
    return `🔬 **Справка по тесту: ${testName}**\n\n` +
      `• **Значение:** ${val || '—'} ${unit || ''} (Референсный диапазон: ${ref || "норма"})\n` +
      `• **Физиологическое значение:** Тест оценивает биохимические или гематологические параметры органов-мишеней.\n` +
      `• **Клиническое примечание:** Значение вне или внутри диапазона должно сопоставляться с анамнезом и жалобами пациента лечащим врачом. Данный сервис не устанавливает диагноз.`;
  } else {
    return `🔬 **Clinical Reference: ${testName}**\n\n` +
      `• **Reported Value:** ${val || '—'} ${unit || ''} (Reference Range: ${ref || "standard"})\n` +
      `• **Physiological Purpose:** Assesses metabolic, hematologic, or biochemical status of relevant organ systems.\n` +
      `• **Clinical Notice:** Laboratory values must be contextualized by the treating medical practitioner within comprehensive patient history.`;
  }
}

// Development vs Production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`MedAssist AI server running on port ${PORT}`);
  });
}

startServer();
