import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  ThemeMode,
  UserProfile,
  Patient,
  Appointment,
  MedicalNote,
  LabResult,
  Checklist,
  AppNotification,
} from '../types';
import { translations, TranslationKey } from '../i18n/translations';
import {
  initialProfile,
  initialPatients,
  initialAppointments,
  initialMedicalNotes,
  initialLabResults,
  initialChecklists,
  initialNotifications,
} from '../data/initialData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  user: UserProfile | null;
  login: (email?: string, password?: string) => void;
  demoLogin: () => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPatientId: string | null;
  viewPatientProfile: (patientId: string) => void;
  backToPatientsList: () => void;

  // Search & Filters
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Data & CRUD
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  deleteAppointment: (id: string) => void;

  notes: MedicalNote[];
  addNote: (note: Omit<MedicalNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<MedicalNote>) => void;
  deleteNote: (id: string) => void;

  labs: LabResult[];
  addLab: (lab: Omit<LabResult, 'id'>) => void;
  updateLab: (id: string, updates: Partial<LabResult>) => void;
  deleteLab: (id: string) => void;

  checklists: Checklist[];
  toggleChecklistTask: (checklistId: string, taskId: string) => void;
  addChecklistTask: (checklistId: string, text: string) => void;
  deleteChecklistTask: (checklistId: string, taskId: string) => void;
  resetChecklist: (checklistId: string) => void;
  createChecklist: (title: string, category: Checklist['category'], description: string, tasks: string[]) => void;
  deleteChecklist: (checklistId: string) => void;

  notifications: AppNotification[];
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;

  // Modals & UI
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'medassist_lang_v1',
  THEME: 'medassist_theme_v1',
  USER: 'medassist_user_v1',
  PATIENTS: 'medassist_patients_v1',
  APPOINTMENTS: 'medassist_apts_v1',
  NOTES: 'medassist_notes_v1',
  LABS: 'medassist_labs_v1',
  CHECKLISTS: 'medassist_checklists_v1',
  NOTIFS: 'medassist_notifs_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Language - Default: O'zbekcha
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved === 'uz' || saved === 'ru' || saved === 'en') ? saved : 'uz';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[language] || translations.uz;
    return dict[key] || translations.en[key] || (key as string);
  };

  // 2. Theme - Light or Dark
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  // 3. User & Auth - simulated auth with state persistence
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null; // Start on landing page by default, or demo login
  });

  const login = (email?: string) => {
    const newUser: UserProfile = {
      ...initialProfile,
      email: email || initialProfile.email,
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    showToast(language === 'uz' ? 'Tizimga muvaffaqiyatli kirildi' : language === 'ru' ? 'Вход выполнен успешно' : 'Signed in successfully', 'success');
  };

  const demoLogin = () => {
    setUser(initialProfile);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(initialProfile));
    setActiveTab('dashboard');
    showToast(language === 'uz' ? 'Demo shifokor hisobiga kirildi' : language === 'ru' ? 'Вход в демо-аккаунт врача' : 'Logged into demo physician account', 'success');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setActiveTab('dashboard');
    showToast(language === 'uz' ? 'Tizimdan chiqildi' : language === 'ru' ? 'Вы вышли из системы' : 'Signed out', 'info');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    showToast(t('settingsSavedSuccess'), 'success');
  };

  // 4. Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const viewPatientProfile = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patient-profile');
  };

  const backToPatientsList = () => {
    setSelectedPatientId(null);
    setActiveTab('patients');
  };

  // 5. Global Search
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // 6. Data Collections with persistence
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialPatients;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialAppointments;
  });

  const [notes, setNotes] = useState<MedicalNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialMedicalNotes;
  });

  const [labs, setLabs] = useState<LabResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LABS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialLabResults;
  });

  const [checklists, setChecklists] = useState<Checklist[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHECKLISTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialChecklists;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialNotifications;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(labs));
  }, [labs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS, JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  // Toast System
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Patients CRUD
  const addPatient = (data: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...data,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPatients(prev => [newPatient, ...prev]);
    showToast(t('patientAddedSuccess'), 'success');
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast(t('patientUpdatedSuccess'), 'success');
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    // Also clean up appointments and notes referencing this patient
    setAppointments(prev => prev.filter(a => a.patientId !== id));
    if (selectedPatientId === id) {
      setSelectedPatientId(null);
      setActiveTab('patients');
    }
    showToast(t('patientDeletedSuccess'), 'info');
  };

  // Appointments CRUD
  const addAppointment = (data: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
    };
    setAppointments(prev => [newApt, ...prev]);
    showToast(language === 'uz' ? 'Qabul jadvalga kiritildi' : language === 'ru' ? 'Приём добавлен' : 'Appointment scheduled', 'success');
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
    showToast(language === 'uz' ? 'Qabul yangilandi' : language === 'ru' ? 'Приём обновлен' : 'Appointment updated', 'success');
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status: 'cancelled' } : a)));
    showToast(language === 'uz' ? 'Qabul bekor qilindi' : language === 'ru' ? 'Приём отменен' : 'Appointment cancelled', 'info');
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    showToast(language === 'uz' ? 'Qabul o\'chirildi' : language === 'ru' ? 'Приём удален' : 'Appointment deleted', 'info');
  };

  // Notes CRUD
  const addNote = (data: Omit<MedicalNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: MedicalNote = {
      ...data,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
    showToast(t('noteSavedSuccess'), 'success');
  };

  const updateNote = (id: string, updates: Partial<MedicalNote>) => {
    const now = new Date().toISOString();
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...updates, updatedAt: now } : n)));
    showToast(t('noteSavedSuccess'), 'success');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    showToast(language === 'uz' ? 'Qayd o\'chirildi' : language === 'ru' ? 'Запись удалена' : 'Note deleted', 'info');
  };

  // Labs CRUD
  const addLab = (data: Omit<LabResult, 'id'>) => {
    const newLab: LabResult = {
      ...data,
      id: `lab-${Date.now()}`,
    };
    setLabs(prev => [newLab, ...prev]);
    showToast(language === 'uz' ? 'Tahlil natijasi qo\'shildi' : language === 'ru' ? 'Результат анализа добавлен' : 'Lab result added', 'success');
  };

  const updateLab = (id: string, updates: Partial<LabResult>) => {
    setLabs(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l)));
    showToast(language === 'uz' ? 'Tahlil yangilandi' : language === 'ru' ? 'Анализ обновлен' : 'Lab updated', 'success');
  };

  const deleteLab = (id: string) => {
    setLabs(prev => prev.filter(l => l.id !== id));
    showToast(language === 'uz' ? 'Tahlil o\'chirildi' : language === 'ru' ? 'Анализ удален' : 'Lab deleted', 'info');
  };

  // Checklists
  const toggleChecklistTask = (checklistId: string, taskId: string) => {
    setChecklists(prev =>
      prev.map(c => {
        if (c.id !== checklistId) return c;
        return {
          ...c,
          tasks: c.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
        };
      })
    );
  };

  const addChecklistTask = (checklistId: string, text: string) => {
    if (!text.trim()) return;
    setChecklists(prev =>
      prev.map(c => {
        if (c.id !== checklistId) return c;
        return {
          ...c,
          tasks: [...c.tasks, { id: `task-${Date.now()}`, text, completed: false }],
        };
      })
    );
  };

  const deleteChecklistTask = (checklistId: string, taskId: string) => {
    setChecklists(prev =>
      prev.map(c => {
        if (c.id !== checklistId) return c;
        return {
          ...c,
          tasks: c.tasks.filter(t => t.id !== taskId),
        };
      })
    );
  };

  const resetChecklist = (checklistId: string) => {
    setChecklists(prev =>
      prev.map(c => {
        if (c.id !== checklistId) return c;
        return {
          ...c,
          tasks: c.tasks.map(t => ({ ...t, completed: false })),
        };
      })
    );
    showToast(t('checklistResetDone'), 'info');
  };

  const createChecklist = (title: string, category: Checklist['category'], description: string, taskTexts: string[]) => {
    const newChecklist: Checklist = {
      id: `chk-${Date.now()}`,
      title,
      category,
      description,
      tasks: taskTexts.filter(t => t.trim().length > 0).map((t, idx) => ({
        id: `t-cust-${Date.now()}-${idx}`,
        text: t,
        completed: false,
      })),
    };
    setChecklists(prev => [newChecklist, ...prev]);
    showToast(language === 'uz' ? 'Yangi cheklist yaratildi' : language === 'ru' ? 'Новый чеклист создан' : 'Checklist created', 'success');
  };

  const deleteChecklist = (checklistId: string) => {
    setChecklists(prev => prev.filter(c => c.id !== checklistId));
    showToast(language === 'uz' ? 'Cheklist o\'chirildi' : language === 'ru' ? 'Чеклист удален' : 'Checklist deleted', 'info');
  };

  // Notifications
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Reset to default demo data
  const resetDemoData = () => {
    setPatients(initialPatients);
    setAppointments(initialAppointments);
    setNotes(initialMedicalNotes);
    setLabs(initialLabResults);
    setChecklists(initialChecklists);
    setNotifications(initialNotifications);
    setUser(initialProfile);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(initialPatients));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(initialAppointments));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(initialMedicalNotes));
    localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(initialLabResults));
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS, JSON.stringify(initialChecklists));
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(initialNotifications));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(initialProfile));
    showToast(t('demoDataResetDone'), 'success');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        setTheme,
        user,
        login,
        demoLogin,
        logout,
        updateProfile,
        activeTab,
        setActiveTab,
        selectedPatientId,
        viewPatientProfile,
        backToPatientsList,
        globalSearch,
        setGlobalSearch,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        appointments,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        deleteAppointment,
        notes,
        addNote,
        updateNote,
        deleteNote,
        labs,
        addLab,
        updateLab,
        deleteLab,
        checklists,
        toggleChecklistTask,
        addChecklistTask,
        deleteChecklistTask,
        resetChecklist,
        createChecklist,
        deleteChecklist,
        notifications,
        markAllNotificationsRead,
        dismissNotification,
        toasts,
        showToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
