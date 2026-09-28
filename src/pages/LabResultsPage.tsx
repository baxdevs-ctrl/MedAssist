import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LabResult } from '../types';
import {
  FlaskConical,
  Plus,
  Sparkles,
  Search,
  AlertCircle,
  CheckCircle2,
  X,
  ShieldCheck,
  Calendar,
  User,
  Info,
  HelpCircle,
} from 'lucide-react';

export const LabResultsPage: React.FC = () => {
  const {
    t,
    labs,
    patients,
    addLab,
    deleteLab,
    language,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [explainingLab, setExplainingLab] = useState<LabResult | null>(null);
  const [explanationText, setExplanationText] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  // Form state
  const [testName, setTestName] = useState('');
  const [result, setResult] = useState('');
  const [unit, setUnit] = useState('');
  const [referenceRange, setReferenceRange] = useState('');
  const [date, setDate] = useState('2026-09-28');
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<LabResult['status']>('normal');

  const commonTests = [
    { name: 'Glikatsiyalangan Gemoglobin (HbA1c)', unit: '%', ref: '< 5.7 %' },
    { name: 'Kreatinin (Serum Creatinine)', unit: 'µmol/L', ref: '62 - 106 µmol/L' },
    { name: 'Kaliy (Serum Potassium)', unit: 'mmol/L', ref: '3.5 - 5.1 mmol/L' },
    { name: 'Tireotrop gormon (TSH)', unit: 'mIU/L', ref: '0.4 - 4.0 mIU/L' },
    { name: 'Umumiy xolesterin', unit: 'mmol/L', ref: '3.0 - 5.2 mmol/L' },
    { name: 'Leykotsitlar (WBC)', unit: '10^9/L', ref: '4.0 - 9.0 10^9/L' },
    { name: 'ALT (Alanin aminotransferaza)', unit: 'U/L', ref: '< 41 U/L' },
    { name: 'Troponin I (hs-cTnI)', unit: 'ng/mL', ref: '< 0.034 ng/mL' },
  ];

  const handleSelectCommonTest = (ct: typeof commonTests[0]) => {
    setTestName(ct.name);
    setUnit(ct.unit);
    setReferenceRange(ct.ref);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || !result.trim()) return;

    const patient = patients.find(p => p.id === patientId);

    addLab({
      patientId: patientId || 'p-gen',
      patientName: patient?.fullName || 'Bemor',
      testName,
      result,
      unit,
      referenceRange,
      date,
      status,
      notes,
    });

    setModalOpen(false);
    setTestName('');
    setResult('');
    setUnit('');
    setReferenceRange('');
    setNotes('');
  };

  const handleExplain = async (lab: LabResult) => {
    setExplainingLab(lab);
    setExplanationText('');
    setIsLoadingExplanation(true);

    try {
      const res = await fetch('/api/ai/explain-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testName: lab.testName,
          result: lab.result,
          unit: lab.unit,
          referenceRange: lab.referenceRange,
          language,
        }),
      });
      const data = await res.json();
      setExplanationText(data.explanation || lab.aiExplanation || 'Tushuntirish shakllantirilmadi.');
    } catch (err) {
      setExplanationText(
        lab.aiExplanation ||
          `🔬 ${lab.testName} (${lab.result} ${lab.unit}): Ushbu test a'zolar funktsional holatini baholash uchun tekshiriladi. Natijani bemorning klinik alomatlari bilan birgalikda shifokor baholashi lozim.`
      );
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const filteredLabs = labs.filter(l =>
    l.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FlaskConical className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>{t('labsTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('labsSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-sky-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addLabResult')}</span>
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-200 text-xs flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
        <span className="leading-relaxed">
          {t('labSafetyRule')}
        </span>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tahlil nomi yoki bemor bo'yicha qidiruv..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
          />
        </div>
      </div>

      {/* Labs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                <th className="py-3.5 px-4">{t('patient')}</th>
                <th className="py-3.5 px-4">{t('testName')}</th>
                <th className="py-3.5 px-4">{t('resultValue')}</th>
                <th className="py-3.5 px-4">{t('referenceRange')}</th>
                <th className="py-3.5 px-4">{t('date')}</th>
                <th className="py-3.5 px-4">Holat</th>
                <th className="py-3.5 px-4 text-right">AI Tushuntirish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLabs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    {t('noLabsYet')}
                  </td>
                </tr>
              ) : (
                filteredLabs.map(lab => (
                  <tr
                    key={lab.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {lab.patientName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                      <span className="font-medium">{lab.testName}</span>
                      {lab.notes && (
                        <span className="block text-[11px] text-slate-400 mt-0.5">{lab.notes}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white font-mono">
                      {lab.result} <span className="text-xs font-normal text-slate-400">{lab.unit}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {lab.referenceRange}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {lab.date}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          lab.status === 'normal'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : lab.status === 'high'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : lab.status === 'low'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {lab.status === 'normal'
                          ? t('statusNormal')
                          : lab.status === 'high'
                          ? t('statusHigh')
                          : lab.status === 'low'
                          ? t('statusLow')
                          : t('statusCritical')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleExplain(lab)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 border border-sky-200 dark:border-slate-700 text-sky-700 dark:text-sky-300 hover:border-sky-400 text-xs font-semibold shadow-xs transition-all hover:scale-105"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                        <span>{t('aiExplainBtn')}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lab Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('addLabResult')}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              {/* Quick Select Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Ko'p uchraydigan tahlillar (1-bosqichda to'ldirish):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {commonTests.map((ct, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectCommonTest(ct)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors"
                    >
                      {ct.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('patient')} *
                </label>
                <select
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.dob})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('testName')} *
                </label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={e => setTestName(e.target.value)}
                  placeholder="Masalan: Glikatsiyalangan gemoglobin (HbA1c)"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('resultValue')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={result}
                    onChange={e => setResult(e.target.value)}
                    placeholder="Masalan: 6.8"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('unit')}
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="%, µmol/L, mmol/L..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('referenceRange')}
                  </label>
                  <input
                    type="text"
                    value={referenceRange}
                    onChange={e => setReferenceRange(e.target.value)}
                    placeholder="Masalan: 4.0 - 5.6 %"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Holat (Status)
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                  >
                    <option value="normal">{t('statusNormal')}</option>
                    <option value="high">{t('statusHigh')}</option>
                    <option value="low">{t('statusLow')}</option>
                    <option value="critical">{t('statusCritical')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('date')}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Izoh
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Qo'shimcha klinik mulohaza"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Explanation Modal */}
      {explainingLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t('labExplanationTitle')}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {explainingLab.testName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setExplainingLab(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Test Details Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Qiymat:</span>{' '}
                <strong className="text-slate-900 dark:text-white font-mono text-sm">
                  {explainingLab.result} {explainingLab.unit}
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Referens:</span>{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {explainingLab.referenceRange}
                </span>
              </div>
            </div>

            {/* AI Explanation Content */}
            <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed min-h-[120px] whitespace-pre-wrap">
              {isLoadingExplanation ? (
                <div className="flex items-center justify-center h-28 text-sky-600 dark:text-sky-400 gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{t('labExplaining')}</span>
                </div>
              ) : (
                explanationText
              )}
            </div>

            {/* Strict Safety Notice */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t('labSafetyRule')}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setExplainingLab(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
