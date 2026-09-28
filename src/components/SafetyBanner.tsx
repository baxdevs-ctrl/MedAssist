import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Info, X } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  const { t } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-sky-50 dark:bg-sky-950/40 border-b border-sky-100 dark:border-sky-900/60 text-sky-900 dark:text-sky-200 px-4 py-2 text-xs md:text-sm flex items-center justify-between transition-colors">
      <div className="flex items-center space-x-2.5 max-w-5xl mx-auto flex-1">
        <ShieldAlert className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
        <span className="font-medium">
          <strong className="font-semibold text-sky-800 dark:text-sky-300">{t('safetyDisclaimerTitle')}:</strong>{' '}
          {t('safetyDisclaimerText')}
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-sky-500 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-200 p-1 rounded-md transition-colors ml-2"
        title="Dismiss"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
