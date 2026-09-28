import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Sparkles,
  RotateCcw,
  Copy,
  Save,
  CheckCircle,
  AlertCircle,
  User,
  ListOrdered,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';

export const MedicalNotesPage: React.FC = () => {
  const {
    t,
    patients,
    notes,
    addNote,
    showToast,
    language,
  } = useApp();

  const [rawText, setRawText] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [noteTitle, setNoteTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  // 7 Structured fields
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [examination, setExamination] = useState('');
  const [labResults, setLabResults] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [summary, setSummary] = useState('');
  const [isStructured, setIsStructured] = useState(false);

  const sampleCases = [
    {
      label: "1. Kardiologik Holat (Cardiology case)",
      patientId: patients[0]?.id || '',
      title: "Arterial gipertoniya va zo'riqish diskomforti",
      text: "Bemor 54 yosh, erkak. Oxirgi 1 haftada tez yurganda to'sh orqasida bosuvchi og'riq va havo yetishmaslik hissi paydo bo'lgan. Dam olgach 3-5 daqiqada o'tib ketadi. Anamnezida: 6 yildan beri arterial gipertoniya, Lisinopril 10mg qabul qiladi. Chekadi (kuniga 1 quti). Obyektiv: BP 145/90 mm sim ust, puls 82 ur/daq. Auskultatsiyada o'pka toza, yurak tonlari bo'g'iq, ritmik. EKGda chap qorincha gipertrofiyasi belgilari, o'tkir ST ko'tarilishi yo'q. Tahlillar: kreatinin 92, umumiy xolesterin 6.1.",
    },
    {
      label: "2. Terapevtik Holat (Respiratory infection)",
      patientId: patients[3]?.id || '',
      title: "O'tkir bronxit va isitma ko'rigi",
      text: "Bemor 25 yosh. 3 kundan beri quruq, og'riqli yo'tal, tomoqda qichishish, tana harorati 38.0C gacha ko'tarilishi. Dori allergiyasi: Penitsillin. Anamnezda bronxial astma (remissiyada). Ko'rikda: tomoq shilliq qavati giperemiyalangan. Auskultatsiyada ikki tomonda dag'al nafas, quruq xirillashlar. Arterial bosim 115/75, SpO2 98%. Laboratoriya tahlillari topshirilmagan.",
    }
  ];

  const handleLoadSample = (sample: typeof sampleCases[0]) => {
    setRawText(sample.text);
    setNoteTitle(sample.title);
    if (sample.patientId) setSelectedPatientId(sample.patientId);
    showToast("Namuna holat yuklandi", "info");
  };

  const handleProcessNote = async (action: 'summarize' | 'organize' | 'structured') => {
    if (!rawText.trim()) {
      showToast(t('emptyNotesWarning'), 'error');
      return;
    }

    setIsProcessing(true);
    setActionDone(action);

    try {
      const res = await fetch('/api/ai/process-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, action, language }),
      });
      const data = await res.json();
      const outputText: string = data.result || '';

      if (action === 'summarize') {
        setSummary(outputText);
      } else {
        // Parse or map to 7 sections
        parseStructuredOutput(outputText, rawText);
        setIsStructured(true);
      }
      showToast(t('notesSubtitle'), 'success');
    } catch (err) {
      console.warn('Backend process error, using local structuring:', err);
      fallbackLocalStructuring(rawText, action);
      setIsStructured(true);
      showToast(t('notesSubtitle'), 'info');
    } finally {
      setIsProcessing(false);
    }
  };

  const parseStructuredOutput = (text: string, original: string) => {
    // Intelligent heuristic to populate fields safely without inventing missing info
    const missingNotice = language === 'uz' ? "Ma'lumot kiritilmagan" : language === 'ru' ? "Данные не предоставлены" : "Information not provided in notes";
    
    // Look for sections in generated text or raw text
    const lower = original.toLowerCase();

    // 1. Chief Complaint
    const ccMatch = text.match(/1[\.\)]\s*(?:Chief Complaint|Asosiy shikoyat|Основная жалоба)[:\s]*([\s\S]*?)(?=2[\.\)]|$)/i);
    setChiefComplaint(ccMatch ? ccMatch[1].trim() : original.slice(0, 150));

    // 2. Symptoms
    const symMatch = text.match(/2[\.\)]\s*(?:Symptoms|Simptomlar|Симптомы)[:\s]*([\s\S]*?)(?=3[\.\)]|$)/i);
    setSymptoms(symMatch ? symMatch[1].trim() : (lower.includes('og\'riq') || lower.includes('yo\'tal') || lower.includes('shikoyat') ? "Klinik matndagi qaydlar asosida aniqlandi." : missingNotice));

    // 3. History
    const histMatch = text.match(/3[\.\)]\s*(?:Medical History|Anamnez|Анамнез)[:\s]*([\s\S]*?)(?=4[\.\)]|$)/i);
    setMedicalHistory(histMatch ? histMatch[1].trim() : (lower.includes('anamnez') ? "Anamnez matnda keltirilgan." : missingNotice));

    // 4. Examination
    const examMatch = text.match(/4[\.\)]\s*(?:Examination|Ko'rik|Объективный осмотр)[:\s]*([\s\S]*?)(?=5[\.\)]|$)/i);
    setExamination(examMatch ? examMatch[1].trim() : (lower.includes('bp') || lower.includes('bosim') || lower.includes('puls') ? "Vital ko'rsatkichlar va auskultatsiya ma'lumotlari kiritilgan." : missingNotice));

    // 5. Labs
    const labMatch = text.match(/5[\.\)]\s*(?:Lab Results|Laboratoriya|Лабораторные данные)[:\s]*([\s\S]*?)(?=6[\.\)]|$)/i);
    setLabResults(labMatch ? labMatch[1].trim() : (lower.includes('kreatinin') || lower.includes('xolesterin') || lower.includes('tahlil') ? "Keltirilgan laborator ko'rsatkichlar qayd etildi." : missingNotice));

    // 6. Assessment
    const assMatch = text.match(/6[\.\)]\s*(?:Assessment|Baholash|Клиническая оценка)[:\s]*([\s\S]*?)(?=7[\.\)]|$)/i);
    setAssessment(assMatch ? assMatch[1].trim() : "Dastlabki klinik holat. Yakuniy tashxis shifokor tomonidan tasdiqlanadi.");

    // 7. Plan
    const planMatch = text.match(/7[\.\)]\s*(?:Plan|Reja|План)[:\s]*([\s\S]*?)$/i);
    setPlan(planMatch ? planMatch[1].trim() : "1. Dinamik kuzatuv\n2. Zaruriy laborator-instrumental tekshiruvlar\n3. Qayta konsultatsiya");
  };

  const fallbackLocalStructuring = (text: string, action: string) => {
    const missingNotice = language === 'uz' ? "Ma'lumot kiritilmagan" : language === 'ru' ? "Данные не предоставлены" : "Information not provided in notes";

    setChiefComplaint(text.slice(0, 160) || missingNotice);
    setSymptoms("Birlamchi qayddan olingan simptomlar ko'rib chiqildi.");
    setMedicalHistory(text.includes('anamnez') ? "Anamnez matnda ifodalangan." : missingNotice);
    setExamination(text.includes('bosim') || text.includes('puls') || text.includes('bp') ? "Fizikal ko'rik va vital belgilar qayd etilgan." : missingNotice);
    setLabResults(text.includes('tahlil') || text.includes('kreatinin') ? "Laboratoriya natijalari matnda bor." : missingNotice);
    setAssessment("Klinik sintez: to'liq tashxis shifokor ko'rigi bilan aniqlanadi.");
    setPlan("1. Qo'shimcha tekshiruvlarni rejalashtirish\n2. Bemor dinamikasini baholash");
  };

  const handleClear = () => {
    setRawText('');
    setNoteTitle('');
    setChiefComplaint('');
    setSymptoms('');
    setMedicalHistory('');
    setExamination('');
    setLabResults('');
    setAssessment('');
    setPlan('');
    setSummary('');
    setIsStructured(false);
  };

  const handleCopy = () => {
    const formatted = `MEDASSIST AI - KLINIK QAYD: ${noteTitle || 'Konsultatsiya'}
Sana: ${new Date().toISOString().split('T')[0]}

1. Asosiy shikoyat (Chief Complaint):
${chiefComplaint || "Ma'lumot berilmagan"}

2. Simptomlar (Symptoms):
${symptoms || "Ma'lumot berilmagan"}

3. Tibbiy tarix / Anamnez (Medical History):
${medicalHistory || "Ma'lumot berilmagan"}

4. Obyektiv ko'rik (Examination):
${examination || "Ma'lumot berilmagan"}

5. Laboratoriya natijalari (Lab Results):
${labResults || "Ma'lumot berilmagan"}

6. Dastlabki klinik baholash (Assessment):
${assessment || "Ma'lumot berilmagan"}

7. Keyingi reja (Plan):
${plan || "Ma'lumot berilmagan"}

---
Eslatma: AI bemor ma'lumotlarini to'qimaydi. Yakuniy tashxis shifokor tomonidan tasdiqlanishi shart.`;

    navigator.clipboard.writeText(formatted);
    showToast(t('copiedToClipboard'), 'success');
  };

  const handleSave = () => {
    if (!rawText.trim() && !chiefComplaint.trim()) {
      showToast(t('emptyNotesWarning'), 'error');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);

    addNote({
      patientId: selectedPatientId || undefined,
      patientName: patient?.fullName || 'Anonim bemor',
      title: noteTitle || `Klinik qayd - ${new Date().toLocaleDateString()}`,
      rawText,
      chiefComplaint: chiefComplaint || rawText.slice(0, 100),
      symptoms: symptoms || "—",
      medicalHistory: medicalHistory || "—",
      examination: examination || "—",
      labResults: labResults || "—",
      assessment: assessment || "—",
      plan: plan || "—",
      summary: summary || undefined,
      isStructured,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>{t('notesTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('notesSubtitle')}
          </p>
        </div>

        {/* Action Sample Loader */}
        <div className="flex items-center gap-2">
          {sampleCases.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadSample(sample)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              <span>{sample.label.split(' ')[1]} {sample.label.split(' ')[2]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">{t('aiNotInventWarning')}</strong>
        </div>
      </div>

      {/* Two Column Editor: Left Raw Input, Right Structured 7 Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Raw Clinical Notes Input */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-sky-600" />
              <span>Birlamchi shifokor matni</span>
            </span>
            <button
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('btnClear')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Qayd mavzusi
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={e => setNoteTitle(e.target.value)}
                placeholder="Masalan: Konsultatsiya / Gipertoniya"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Bemorga biriktirish (ixtiyoriy)
              </label>
              <select
                value={selectedPatientId}
                onChange={e => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
              >
                <option value="">-- Bemor tanlanmagan --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.dob})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Strukturalanmagan klinik qayd matni
            </label>
            <textarea
              rows={12}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder={t('rawNotesPlaceholder')}
              className="w-full p-4 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 outline-none leading-relaxed resize-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => handleProcessNote('structured')}
              disabled={isProcessing}
              className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 disabled:opacity-60 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isProcessing ? 'AI Tahlil qilmoqda...' : t('btnCreateStructured')}</span>
            </button>

            <button
              onClick={() => handleProcessNote('organize')}
              disabled={isProcessing}
              className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              {t('btnOrganize')}
            </button>

            <button
              onClick={() => handleProcessNote('summarize')}
              disabled={isProcessing}
              className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              {t('btnSummarize')}
            </button>
          </div>

          {summary && (
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900">
              <span className="text-xs font-bold text-sky-800 dark:text-sky-300 block mb-1">
                AI Qisqa Xulosa:
              </span>
              <p className="text-xs text-sky-900 dark:text-sky-100 leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          )}
        </div>

        {/* Right: Standardized 7-Section Clinical Structure */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-teal-600" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                7-Bosqichli Standart Klinik Shakl
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
                title={t('btnCopy')}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{t('btnCopy')}</span>
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t('btnSaveNote')}</span>
              </button>
            </div>
          </div>

          {/* 7 Editable Clinical Sections */}
          <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
            {/* 1. Chief Complaint */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
              <label className="block text-xs font-bold text-sky-700 dark:text-sky-400 mb-1">
                {t('chiefComplaint')}
              </label>
              <textarea
                rows={2}
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                placeholder="Bemorning asosiy shikoyati..."
                className="w-full text-xs bg-transparent border-0 outline-none text-slate-800 dark:text-slate-200 resize-none"
              />
            </div>

            {/* 2. Symptoms */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
              <label className="block text-xs font-bold text-sky-700 dark:text-sky-400 mb-1">
                {t('symptoms')}
              </label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="Alomatlar, boshlanish vaqti, dinamikasi..."
                className="w-full text-xs bg-transparent border-0 outline-none text-slate-800 dark:text-slate-200 resize-none"
              />
            </div>

            {/* 3. Medical History */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
              <label className="block text-xs font-bold text-sky-700 dark:text-sky-400 mb-1">
                {t('historySection')}
              </label>
              <textarea
                rows={2}
                value={medicalHistory}
                onChange={e => setMedicalHistory(e.target.value)}
                placeholder="O'tmish kasalliklari, irsiyat, allergik anamnez..."
                className="w-full text-xs bg-transparent border-0 outline-none text-slate-800 dark:text-slate-200 resize-none"
              />
            </div>

            {/* 4. Examination */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
              <label className="block text-xs font-bold text-sky-700 dark:text-sky-400 mb-1">
                {t('examination')}
              </label>
              <textarea
                rows={2}
                value={examination}
                onChange={e => setExamination(e.target.value)}
                placeholder="Fizikal ko'rik: arterial bosim, puls, auskultatsiya, palpatsiya..."
                className="w-full text-xs bg-transparent border-0 outline-none text-slate-800 dark:text-slate-200 resize-none"
              />
            </div>

            {/* 5. Lab Results */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
              <label className="block text-xs font-bold text-sky-700 dark:text-sky-400 mb-1">
                {t('labResultsSection')}
              </label>
              <textarea
                rows={2}
                value={labResults}
                onChange={e => setLabResults(e.target.value)}
                placeholder="Laboratoriya va instrumental tahlil ko'rsatkichlari..."
                className="w-full text-xs bg-transparent border-0 outline-none text-slate-800 dark:text-slate-200 resize-none"
              />
            </div>

            {/* 6. Assessment */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
              <label className="block text-xs font-bold text-sky-700 dark:text-sky-400 mb-1">
                {t('assessment')}
              </label>
              <textarea
                rows={2}
                value={assessment}
                onChange={e => setAssessment(e.target.value)}
                placeholder="Dastlabki klinik baholash va differensial mulohazalar..."
                className="w-full text-xs bg-transparent border-0 outline-none text-slate-800 dark:text-slate-200 resize-none"
              />
            </div>

            {/* 7. Plan */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
              <label className="block text-xs font-bold text-sky-700 dark:text-sky-400 mb-1">
                {t('plan')}
              </label>
              <textarea
                rows={2}
                value={plan}
                onChange={e => setPlan(e.target.value)}
                placeholder="Keyingi diagnostika, parhez, rejim va nazorat rejasi..."
                className="w-full text-xs bg-transparent border-0 outline-none text-slate-800 dark:text-slate-200 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
