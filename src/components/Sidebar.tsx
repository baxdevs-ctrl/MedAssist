import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  FlaskConical,
  ClipboardCheck,
  Bot,
  CalendarDays,
  BarChart3,
  Settings,
  ShieldCheck,
  HeartPulse,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    t,
    appointments,
    patients,
    notes,
    labs,
    theme,
  } = useApp();

  const todayStr = '2026-09-28'; // Matches demo date or current date
  const todayAptCount = appointments.filter(a => a.date === todayStr && a.status !== 'cancelled').length;
  const pendingNotesCount = notes.filter(n => !n.isStructured).length;

  const navItems = [
    {
      id: 'dashboard',
      label: t('navDashboard'),
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'patients',
      label: t('navPatients'),
      icon: Users,
      badge: patients.length,
    },
    {
      id: 'notes',
      label: t('navNotes'),
      icon: FileText,
      badge: pendingNotesCount > 0 ? pendingNotesCount : null,
    },
    {
      id: 'labs',
      label: t('navLabs'),
      icon: FlaskConical,
      badge: labs.length,
    },
    {
      id: 'checklists',
      label: t('navChecklists'),
      icon: ClipboardCheck,
      badge: null,
    },
    {
      id: 'ai',
      label: t('navAI'),
      icon: Bot,
      badge: 'AI',
      highlight: true,
    },
    {
      id: 'appointments',
      label: t('navAppointments'),
      icon: CalendarDays,
      badge: todayAptCount > 0 ? todayAptCount : null,
    },
    {
      id: 'stats',
      label: t('navStats'),
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings',
      label: t('navSettings'),
      icon: Settings,
      badge: null,
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>MedAssist</span>
              <span className="text-sky-600 dark:text-sky-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800">
                AI
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              Clinical Workflow
            </div>
          </div>
        </button>

        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workflow
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'patients' && activeTab === 'patient-profile');

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-sky-500 text-white font-semibold shadow-md shadow-sky-500/20 dark:bg-sky-600'
                  : item.highlight
                  ? 'text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 bg-teal-50/50 dark:bg-teal-950/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive
                      ? 'text-white'
                      : item.highlight
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== null && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.highlight
                      ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Safety Notice Mini-Card in sidebar */}
      <div className="p-3 m-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-[11px]">
        <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-300 font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>MedAssist Guard</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 leading-snug">
          Non-diagnostic workflow assistant. For licensed clinician support only.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-screen sticky top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-xs h-full bg-white dark:bg-slate-900 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
