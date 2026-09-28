import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  FlaskConical,
  TrendingUp,
  PieChart,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

export const StatisticsPage: React.FC = () => {
  const { t, patients, appointments, notes, labs } = useApp();

  const totalPatients = patients.length;
  const completedApts = appointments.filter(a => a.status === 'completed').length;
  const pendingApts = appointments.filter(a => a.status === 'pending').length;
  const confirmedApts = appointments.filter(a => a.status === 'confirmed').length;
  const cancelledApts = appointments.filter(a => a.status === 'cancelled').length;
  const totalNotes = notes.length;
  const totalLabs = labs.length;

  // Mock days of the week data based on appointments
  const daysData = [
    { day: 'Dush', count: 4, height: 60 },
    { day: 'Sesh', count: 6, height: 85 },
    { day: 'Chor', count: 3, height: 45 },
    { day: 'Pay', count: 7, height: 100 },
    { day: 'Jum', count: 5, height: 75 },
    { day: 'Shan', count: 2, height: 30 },
  ];

  const maleCount = patients.filter(p => p.gender === 'male').length;
  const femaleCount = patients.filter(p => p.gender === 'female').length;
  const malePercent = totalPatients > 0 ? Math.round((maleCount / totalPatients) * 100) : 50;
  const femalePercent = 100 - malePercent;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          <span>{t('statsTitle')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('statsSubtitle')}
        </p>
      </div>

      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{t('metricTotalPatients')}</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalPatients}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Faol ro'yxatda</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Kunlik o'rtacha</span>
            <Calendar className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            4.5
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">qabul / kun</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{t('statusDone')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {completedApts}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">bajarilgan</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{t('statusPending')}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {pendingApts}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">kutilmoqda</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{t('metricNotesCount')}</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalNotes}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">SOAP formatida</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{t('metricLabsCount')}</span>
            <FlaskConical className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalLabs}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">tahlil kiritildi</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Visits Volume Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t('chartVisitsByDay')}
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Ushbu hafta</span>
          </div>

          <div className="mt-8 flex items-end justify-between h-48 px-4">
            {daysData.map((d, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.count} ta
                </span>
                <div className="w-8 sm:w-10 rounded-t-xl bg-slate-100 dark:bg-slate-800 h-36 flex items-end overflow-hidden">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-sky-600 to-teal-400 group-hover:from-sky-500 group-hover:to-teal-300 transition-all duration-300"
                    style={{ height: `${d.height}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Status Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t('chartAppointmentsStatus')}
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Jami: {appointments.length}
            </span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-sky-600"
                  strokeDasharray="40, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray="30, 100"
                  strokeDashoffset="-40"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-500"
                  strokeDasharray="20, 100"
                  strokeDashoffset="-70"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {appointments.length}
                </span>
                <span className="text-[10px] text-slate-400">Qabullar</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 text-xs w-full max-w-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-sky-600" />
                  <span className="text-slate-600 dark:text-slate-300">Tasdiqlangan</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{confirmedApts}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">Yakunlangan</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{completedApts}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-slate-600 dark:text-slate-300">Kutilmoqda</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{pendingApts}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-slate-600 dark:text-slate-300">Bekor qilingan</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{cancelledApts}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            Yakunlanganlik ko'rsatkichi: <strong>{appointments.length > 0 ? Math.round((completedApts / appointments.length) * 100) : 0}%</strong>
          </div>
        </div>
      </div>

      {/* Patient Demographics & Common Labs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Demographics */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Bemorlar Jinsi Taqsimoti
            </h3>
            <span className="text-xs text-slate-400">Jami: {totalPatients}</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Erkaklar ({maleCount})</span>
                <span>{malePercent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-sky-500" style={{ width: `${malePercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Ayollar ({femaleCount})</span>
                <span>{femalePercent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-teal-500" style={{ width: `${femalePercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Common Lab Tests */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t('chartCommonLabs')}
            </h3>
            <span className="text-xs text-slate-400">Top tahlillar</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Zardob Kreatinini</span>
              <span className="font-bold text-sky-600">2 ta tahlil</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Glikatsiyalangan Gemoglobin (HbA1c)</span>
              <span className="font-bold text-sky-600">1 ta tahlil</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Tireotrop Gormon (TSH)</span>
              <span className="font-bold text-sky-600">1 ta tahlil</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Kaliy / Elektrolitlar</span>
              <span className="font-bold text-sky-600">1 ta tahlil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
