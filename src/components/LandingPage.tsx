import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import {
  HeartPulse,
  Sparkles,
  FileText,
  Users,
  FlaskConical,
  Calendar,
  ClipboardCheck,
  Languages,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Stethoscope,
  Activity,
  Layers,
  ChevronDown
} from 'lucide-react';
import { AuthModal } from './AuthModal';

export const LandingPage: React.FC = () => {
  const { t, demoLogin, language, setLanguage, theme, toggleTheme } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O‘zbekcha", flag: "🇺🇿" },
    { code: 'ru', label: "Русский", flag: "🇷🇺" },
    { code: 'en', label: "English", flag: "🇬🇧" },
  ];

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  const features = [
    {
      icon: FileText,
      title: t('landingFeature1Title'),
      desc: t('landingFeature1Desc'),
      color: 'from-sky-500 to-blue-600',
    },
    {
      icon: Users,
      title: t('landingFeature2Title'),
      desc: t('landingFeature2Desc'),
      color: 'from-teal-500 to-emerald-600',
    },
    {
      icon: FlaskConical,
      title: t('landingFeature3Title'),
      desc: t('landingFeature3Desc'),
      color: 'from-cyan-500 to-sky-600',
    },
    {
      icon: Calendar,
      title: t('landingFeature4Title'),
      desc: t('landingFeature4Desc'),
      color: 'from-indigo-500 to-purple-600',
    },
    {
      icon: ClipboardCheck,
      title: t('landingFeature5Title'),
      desc: t('landingFeature5Desc'),
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Languages,
      title: t('landingFeature6Title'),
      desc: t('landingFeature6Desc'),
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                MedAssist <span className="text-sky-600 dark:text-sky-400">AI</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-xs sm:text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs">
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden py-1 hidden group-hover:block z-50">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-left hover:bg-sky-50 dark:hover:bg-slate-800"
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => openAuth('login')}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400"
            >
              {t('signIn')}
            </button>

            <button
              onClick={demoLogin}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-sm transition-all shadow-teal-500/20"
            >
              {t('tryDemo')}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Abstract medical gradient mesh background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-sky-400/15 via-teal-300/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{t('landingHeroBadge')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuth('register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 transition-all hover:scale-[1.02]"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={demoLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all hover:border-slate-300"
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span>{t('tryDemo')}</span>
            </button>
          </div>

          {/* Safety rule pill */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-left shadow-xs">
            <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>{t('safetyDisclaimerText')}</span>
          </div>

          {/* Realistic SaaS Dashboard Mockup Preview */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl p-2 sm:p-4 bg-gradient-to-b from-slate-200/50 to-slate-200/20 dark:from-slate-800/50 dark:to-slate-900/20 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 text-left">
              {/* Fake top bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-mono text-slate-400">medassist.ai/dashboard</span>
                </div>
                <div className="text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full">
                  Clinical Workspace Live
                </div>
              </div>

              {/* Sample preview grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Jami Bemorlar</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">128</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">↑ +12 bu oy</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Bugungi Qabullar</div>
                  <div className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">5 ta rejalashtirilgan</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Soat 09:30 da boshlanadi</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                  <div className="text-xs text-slate-500 dark:text-slate-400">AI Note Generator</div>
                  <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1">7-Section SOAP Ready</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Shikoyat • Ko'rik • Reja</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Functional Modules */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Shifokorlar uchun professional imkoniyatlar
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Har bir modul kundalik tibbiy hujjatlar va klinik tartibni yengillashtirish uchun mo'ljallangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all hover:shadow-md group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Section Banner */}
      <section className="py-12 bg-sky-50 dark:bg-sky-950/30 border-y border-sky-100 dark:border-sky-900/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck className="w-10 h-10 text-sky-600 dark:text-sky-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Qat'iy Klinik Xavfsizlik Tamoyillari
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            MedAssist AI mustaqil tibbiy tashxis qo'ymaydi, dori buyurmaydi va mavjud bo'lmagan bemor ma'lumotlarini o'ylab topmaydi. Tizim malakali shifokor nazoratida klinik yozuvlarni tartibga solish va ma'lumotlarni qidirish uchun xizmat qiladi.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              MedAssist AI
            </span>
            <span className="text-xs text-slate-400 ml-2">
              © 2026 {t('allRightsReserved')}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={() => alert("MedAssist AI Privacy Policy: All medical data is kept strictly client-side and simulated in this prototype.")}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t('footerPrivacy')}
            </button>
            <button
              onClick={() => alert("MedAssist AI Terms: Intended for clinical documentation support and medical training purposes.")}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t('footerTerms')}
            </button>
            <button
              onClick={() => alert("Contact: support@medassist.uz | +998 71 200-00-00")}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t('footerContact')}
            </button>

            {/* Language dropdown in footer */}
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    language === l.code
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};
