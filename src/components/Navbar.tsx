import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import {
  Search,
  Sun,
  Moon,
  Bell,
  CheckCheck,
  User,
  LogOut,
  Settings,
  Menu,
  ChevronDown,
  Shield,
  Activity,
  Calendar,
  FileText,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const {
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
    user,
    logout,
    demoLogin,
    setActiveTab,
    notifications,
    markAllNotificationsRead,
    dismissNotification,
    globalSearch,
    setGlobalSearch,
    patients,
    notes,
    appointments,
    viewPatientProfile,
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O‘zbekcha", flag: "🇺🇿" },
    { code: 'ru', label: "Русский", flag: "🇷🇺" },
    { code: 'en', label: "English", flag: "🇬🇧" },
  ];

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  // Quick search results
  const searchMatches = globalSearch.trim().length > 1 ? {
    patients: patients.filter(p =>
      p.fullName.toLowerCase().includes(globalSearch.toLowerCase()) ||
      p.phone.includes(globalSearch)
    ).slice(0, 3),
    notes: notes.filter(n =>
      n.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
      n.chiefComplaint.toLowerCase().includes(globalSearch.toLowerCase())
    ).slice(0, 2),
    appointments: appointments.filter(a =>
      a.patientName.toLowerCase().includes(globalSearch.toLowerCase())
    ).slice(0, 2),
  } : null;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search */}
          <div ref={searchRef} className="relative w-full">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all outline-none"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Search Popup */}
            {searchFocused && searchMatches && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-2 space-y-2 max-h-80 overflow-y-auto">
                  {searchMatches.patients.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {t('navPatients')}
                      </div>
                      {searchMatches.patients.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            viewPatientProfile(p.id);
                            setSearchFocused(false);
                            setGlobalSearch('');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center justify-between text-sm group"
                        >
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-sky-600">
                              {p.fullName}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">{p.phone}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchMatches.notes.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {t('navNotes')}
                      </div>
                      {searchMatches.notes.map(n => (
                        <button
                          key={n.id}
                          onClick={() => {
                            setActiveTab('notes');
                            setSearchFocused(false);
                            setGlobalSearch('');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center justify-between text-sm group"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-sky-600">
                              {n.title}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">{n.patientName}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchMatches.appointments.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {t('navAppointments')}
                      </div>
                      {searchMatches.appointments.map(a => (
                        <button
                          key={a.id}
                          onClick={() => {
                            setActiveTab('appointments');
                            setSearchFocused(false);
                            setGlobalSearch('');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center justify-between text-sm group"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-sky-600">
                              {a.patientName}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">{a.date} {a.time}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchMatches.patients.length === 0 &&
                    searchMatches.notes.length === 0 &&
                    searchMatches.appointments.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-400">
                        {t('noAppointmentsMatch')}
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector Dropdown */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangMenuOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium transition-all shadow-xs"
              aria-label="Select Language"
            >
              <span className="text-base leading-none">{currentLangObj.flag}</span>
              <span className="hidden sm:inline">{currentLangObj.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                      language === l.code
                        ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-lg leading-none">{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all shadow-xs"
            title={theme === 'light' ? t('themeDark') : t('themeLight')}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen(prev => !prev)}
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all shadow-xs"
              aria-label={t('notifications')}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {t('notifications')}
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      {t('markAllRead')}
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      {t('noNotifications')}
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-3 text-xs transition-colors relative flex items-start gap-2.5 ${
                          !notif.read
                            ? 'bg-sky-50/50 dark:bg-sky-950/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 mt-1 rounded-full shrink-0 ${
                            notif.type === 'warning'
                              ? 'bg-amber-500'
                              : notif.type === 'success'
                              ? 'bg-emerald-500'
                              : 'bg-sky-500'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {notif.title}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {notif.time}
                          </span>
                        </div>
                        <button
                          onClick={() => dismissNotification(notif.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                          title="Dismiss"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Button */}
          {user ? (
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {t('doctorRole')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-1.5 z-50">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                      <Shield className="w-3 h-3" />
                      <span>{user.licenseNumber}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>{t('profileSettings')}</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('signOut')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={demoLogin}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white shadow-sm transition-all"
            >
              {t('signIn')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
