import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language, ThemeMode } from '../types';
import {
  Settings,
  Sun,
  Moon,
  Globe,
  Bell,
  User,
  Shield,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Building,
  Key,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    t,
    theme,
    setTheme,
    language,
    setLanguage,
    user,
    updateProfile,
    resetDemoData,
    showToast,
  } = useApp();

  // Profile fields
  const [name, setName] = useState(user?.name || 'Dr. Alisher Azimov');
  const [email, setEmail] = useState(user?.email || 'dr.azimov@medassist.uz');
  const [specialty, setSpecialty] = useState(user?.specialty || 'Umumiy amaliyot shifokori');
  const [clinic, setClinic] = useState(user?.clinic || 'Respublika Shoshilinch Tibbiy Yordam Ilmiy Markazi');
  const [licenseNumber, setLicenseNumber] = useState(user?.licenseNumber || 'MD-UZ-849204');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);
  const [soundEnabled, setSoundEnabled] = useState(user?.soundEnabled ?? true);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      specialty,
      clinic,
      licenseNumber,
      notificationsEnabled,
      soundEnabled,
    });
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O‘zbekcha", flag: "🇺🇿" },
    { code: 'ru', label: "Русский", flag: "🇷🇺" },
    { code: 'en', label: "English", flag: "🇬🇧" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          <span>{t('settingsTitle')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('settingsSubtitle')}
        </p>
      </div>

      {/* Appearance Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          <span>{t('appearance')}</span>
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-amber-500 shadow-xs">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm">{t('themeLight')}</div>
              <div className="text-[10px] text-slate-400">Yorug' medical UI</div>
            </div>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400 shadow-xs">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm">{t('themeDark')}</div>
              <div className="text-[10px] text-slate-400">Ko'z uchun qulay</div>
            </div>
          </button>
        </div>
      </div>

      {/* Language Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-sky-600" />
          <span>{t('language')}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tanlangan til zudlik bilan barcha bo'limlar, bildirishnomalar va AI javoblarida aks etadi.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                language === l.code
                  ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl leading-none">{l.flag}</span>
                <span className="text-xs sm:text-sm">{l.label}</span>
              </div>
              {language === l.code && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-teal-600" />
          <span>{t('profile')}</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('fullName')} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('email')} *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('specialty')}
              </label>
              <input
                type="text"
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('clinicName')}
              </label>
              <input
                type="text"
                value={clinic}
                onChange={e => setClinic(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('licenseId')}
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={e => setLicenseNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Notifications toggles */}
          <div className="pt-2 space-y-2.5">
            <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={e => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span>{t('enablePush')}</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={e => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span>{t('enableSounds')}</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-sky-600/20"
            >
              <Save className="w-4 h-4" />
              <span>{t('saveSettings')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Demo Data Management */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Demo Ma'lumotlarni Qayta Tiklash
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Barcha bemorlar, qaydlar va qabullarni dastlabki toza namunaviy holatga qaytarish.
          </p>
        </div>

        <button
          onClick={() => setConfirmResetOpen(true)}
          className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('resetDemoData')}</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Demo ma'lumotlarni tiklashni tasdiqlaysizmi?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('demoResetConfirm')}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setConfirmResetOpen(false);
                }}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Tiklash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
