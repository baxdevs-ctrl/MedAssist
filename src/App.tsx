import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SafetyBanner } from './components/SafetyBanner';
import { LandingPage } from './components/LandingPage';
import { NotificationToast } from './components/NotificationToast';

import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { PatientProfilePage } from './pages/PatientProfilePage';
import { MedicalNotesPage } from './pages/MedicalNotesPage';
import { LabResultsPage } from './pages/LabResultsPage';
import { ChecklistsPage } from './pages/ChecklistsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { user, activeTab } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user is not logged in, show the comprehensive pre-login Landing Page
  if (!user) {
    return (
      <>
        <LandingPage />
        <NotificationToast />
      </>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'patients':
        return <PatientsPage />;
      case 'patient-profile':
        return <PatientProfilePage />;
      case 'notes':
        return <MedicalNotesPage />;
      case 'labs':
        return <LabResultsPage />;
      case 'checklists':
        return <ChecklistsPage />;
      case 'ai':
        return <AIAssistantPage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'stats':
        return <StatisticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-sky-500 selection:text-white">
      {/* Top Clinical Safety Protocol Banner */}
      <SafetyBanner />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop & Mobile Responsive Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderActiveTab()}
          </main>
        </div>
      </div>

      {/* Global Toast Alerts */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
