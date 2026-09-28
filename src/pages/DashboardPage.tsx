import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Calendar,
  FileText,
  FlaskConical,
  Bot,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  CalendarCheck,
  Stethoscope,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    t,
    patients,
    appointments,
    notes,
    labs,
    setActiveTab,
    viewPatientProfile,
    user,
  } = useApp();

  const todayStr = '2026-09-28';
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingNotes = notes.filter(n => !n.isStructured);
  const recentPatients = patients.slice(0, 5);

  const stats = [
    {
      title: t('totalPatients'),
      value: patients.length,
      change: '+3 yangi',
      icon: Users,
      color: 'from-sky-500 to-blue-600',
      tab: 'patients',
    },
    {
      title: t('todayAppointments'),
      value: todayAppointments.length,
      change: todayAppointments.filter(a => a.status === 'confirmed').length + ' tasdiqlangan',
      icon: Calendar,
      color: 'from-teal-500 to-emerald-600',
      tab: 'appointments',
    },
    {
      title: t('pendingNotes'),
      value: pendingNotes.length,
      change: notes.length + ' jami qaydlar',
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
      tab: 'notes',
    },
    {
      title: t('recentLabResults'),
      value: labs.length,
      change: labs.filter(l => l.status === 'high' || l.status === 'critical').length + ' diqqat talab',
      icon: FlaskConical,
      color: 'from-purple-500 to-indigo-600',
      tab: 'labs',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-600/10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-medium text-sky-100">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Klinik Boshqaruv Markazi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('welcomeBack')}, {user?.name || 'Doktor'}!
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
            Bugun {todayAppointments.length} ta bemor qabuli rejalashtirilgan. MedAssist AI barcha qaydlarni xavfsiz tartibda saqlashga tayyor.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('patients')}
            className="px-4 py-2.5 rounded-xl bg-white text-sky-700 hover:bg-sky-50 font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addNewPatient')}</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 backdrop-blur-xs transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>{t('newMedicalNote')}</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveTab(stat.tab)}
              className="text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-sky-600 transition-colors">
                  {stat.change}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Schedule & AI Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('todaysSchedule')}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold">
                  {todayAppointments.length} ta
                </span>
              </div>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>{t('viewAll')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {todayAppointments.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  {t('noAppointmentsToday')}
                </div>
              ) : (
                todayAppointments.map(apt => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-sky-50/50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex flex-col items-center justify-center shrink-0 font-bold text-xs">
                        <Clock className="w-3.5 h-3.5 mb-0.5 text-sky-600" />
                        <span>{apt.time}</span>
                      </div>
                      <div>
                        <button
                          onClick={() => viewPatientProfile(apt.patientId)}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-sky-600 text-left"
                        >
                          {apt.patientName}
                        </button>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {apt.notes}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                          apt.type === 'urgent'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : apt.type === 'followup'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {apt.type}
                      </span>
                      <button
                        onClick={() => viewPatientProfile(apt.patientId)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 text-slate-700 dark:text-slate-200"
                      >
                        {t('viewProfile')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Sana: 28 Sentabr, 2026</span>
            <button
              onClick={() => setActiveTab('appointments')}
              className="text-sky-600 dark:text-sky-400 hover:underline"
            >
              + {t('scheduleAppointment')}
            </button>
          </div>
        </div>

        {/* AI Assistant Card (1 Col) */}
        <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between border border-sky-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-teal-300 text-slate-900 flex items-center justify-center font-bold mb-4 shadow-lg shadow-sky-500/30">
              <Bot className="w-5 h-5 text-slate-900" />
            </div>

            <h3 className="text-lg font-bold tracking-tight">
              {t('aiAssistantCardTitle')}
            </h3>

            <p className="mt-2 text-xs text-slate-300 leading-relaxed font-normal">
              {t('aiAssistantCardDesc')}
            </p>

            <div className="mt-5 space-y-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">"Ushbu tibbiy qaydlarni umumlashtirib ber"</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">"Tahlil atamasini tushuntir"</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveTab('ai')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
            >
              <span>{t('openAIAssistant')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Yakuniy tashxis qo'ymaydi. Shifokor malakasini almashtirmaydi.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Patients Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('recentPatients')}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('patients')}
            className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>{t('viewAll')} ({patients.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[11px] font-semibold">
                <th className="pb-3 font-semibold">{t('fullName')}</th>
                <th className="pb-3 font-semibold">{t('phone')}</th>
                <th className="pb-3 font-semibold">{t('allergies')}</th>
                <th className="pb-3 font-semibold">{t('medicalHistory')}</th>
                <th className="pb-3 text-right font-semibold">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentPatients.map(p => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {p.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <button
                          onClick={() => viewPatientProfile(p.id)}
                          className="font-semibold text-slate-900 dark:text-white hover:text-sky-600 text-left block"
                        >
                          {p.fullName}
                        </button>
                        <span className="text-[11px] text-slate-400">
                          {p.gender === 'male' ? t('filterMale') : t('filterFemale')}, {p.dob}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300 font-mono text-xs">
                    {p.phone}
                  </td>

                  <td className="py-3.5 pr-4">
                    {p.allergies && !p.allergies.toLowerCase().includes('yo\'q') && !p.allergies.toLowerCase().includes('nkda') ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                        {p.allergies}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">
                        {t('noAllergiesKnown')}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300 max-w-xs truncate text-xs">
                    {p.medicalHistory}
                  </td>

                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => viewPatientProfile(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 text-xs font-semibold transition-colors"
                    >
                      {t('viewProfile')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
