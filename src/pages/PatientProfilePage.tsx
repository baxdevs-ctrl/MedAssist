import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  User,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  Pill,
  HeartPulse,
  FileText,
  FlaskConical,
  Clock,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Activity,
  UserCheck,
} from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const {
    selectedPatientId,
    patients,
    notes,
    labs,
    appointments,
    backToPatientsList,
    setActiveTab,
    t,
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'info' | 'history' | 'allergies' | 'meds' | 'labs' | 'notes' | 'apts'>('info');

  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Bemor topilmadi</p>
        <button
          onClick={backToPatientsList}
          className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold text-xs"
        >
          {t('backToPatients')}
        </button>
      </div>
    );
  }

  const patientNotes = notes.filter(n => n.patientId === patient.id || n.patientName === patient.fullName);
  const patientLabs = labs.filter(l => l.patientId === patient.id || l.patientName === patient.fullName);
  const patientAppointments = appointments.filter(a => a.patientId === patient.id || a.patientName === patient.fullName);

  const hasAllergy =
    patient.allergies &&
    !patient.allergies.toLowerCase().includes('yo\'q') &&
    !patient.allergies.toLowerCase().includes('nkda') &&
    !patient.allergies.toLowerCase().includes('aniqlanmagan');

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={backToPatientsList}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToPatients')}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('notes')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>{t('addNoteForPatient')}</span>
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('scheduleForPatient')}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Card Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-400 text-white flex items-center justify-center font-extrabold text-xl sm:text-2xl shadow-lg shadow-sky-500/20 shrink-0">
            {patient.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {patient.fullName}
              </h1>
              {hasAllergy && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                  <span>Allergiya Bor</span>
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {patient.dob}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {patient.gender === 'male' ? t('filterMale') : t('filterFemale')}
              </span>
              <span className="flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                {patient.bloodType || 'A(II) Rh+'}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {patient.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Quick vitals / stats summary box */}
        <div className="flex items-center gap-3 self-stretch md:self-auto border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex-1 md:flex-initial">
            <div className="text-xs text-slate-400">Qaydlar</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{patientNotes.length}</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex-1 md:flex-initial">
            <div className="text-xs text-slate-400">Tahlillar</div>
            <div className="text-lg font-bold text-sky-600 dark:text-sky-400 mt-0.5">{patientLabs.length}</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex-1 md:flex-initial">
            <div className="text-xs text-slate-400">Qabullar</div>
            <div className="text-lg font-bold text-teal-600 dark:text-teal-400 mt-0.5">{patientAppointments.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
        {[
          { id: 'info', label: t('tabInfo'), count: null },
          { id: 'history', label: t('tabHistory'), count: null },
          { id: 'allergies', label: t('tabAllergies'), count: hasAllergy ? '!' : null },
          { id: 'meds', label: t('tabMeds'), count: null },
          { id: 'labs', label: t('tabLabs'), count: patientLabs.length },
          { id: 'notes', label: t('tabNotes'), count: patientNotes.length },
          { id: 'apts', label: t('tabAppointments'), count: patientAppointments.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTabLocal(tab.id as any)}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                tab.count === '!' ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        {activeTab === 'info' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-sky-600" />
              <span>{t('patientOverview')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">{t('fullName')}</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-1">{patient.fullName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">{t('dob')}</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-1">{patient.dob}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">{t('gender')}</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-1">
                  {patient.gender === 'male' ? t('filterMale') : t('filterFemale')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">{t('bloodGroup')}</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-1">{patient.bloodType || 'A(II) Rh+'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">{t('phone')}</span>
                <p className="font-mono font-semibold text-slate-900 dark:text-white mt-1">{patient.phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">{t('email')}</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-1">{patient.email || '—'}</p>
              </div>
            </div>

            {patient.emergencyContact && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                  {t('emergencyContact')}
                </span>
                <p className="font-semibold text-amber-900 dark:text-amber-100 mt-1">
                  {patient.emergencyContact}
                </p>
              </div>
            )}

            {patient.notes && (
              <div>
                <span className="text-xs text-slate-400 font-semibold">{t('notes')}</span>
                <div className="mt-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {patient.notes}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-600" />
              <span>{t('medicalHistory')}</span>
            </h3>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {patient.medicalHistory || 'Surunkali kasalliklar yoki o\'tkazilgan operatsiyalar qayd etilmagan.'}
            </div>
          </div>
        )}

        {activeTab === 'allergies' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <span>{t('allergies')}</span>
            </h3>

            {hasAllergy ? (
              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Yuqori sezuvchanlik / Dori allergiyasi:</span>
                </div>
                <p className="text-sm font-semibold">{patient.allergies}</p>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-2">
                  Dori tayinlashda va invaziv aralashuvlarda ushbu moddalarni inobatga olish shart.
                </p>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold">{t('noAllergiesKnown')}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'meds' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              <span>{t('currentMeds')}</span>
            </h3>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
              {patient.currentMedications || t('noMedications')}
            </div>
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-sky-600" />
                <span>{t('tabLabs')} ({patientLabs.length})</span>
              </h3>
              <button
                onClick={() => setActiveTab('labs')}
                className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline"
              >
                + {t('addLabResult')}
              </button>
            </div>

            {patientLabs.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">{t('noLabsYet')}</p>
            ) : (
              <div className="space-y-3">
                {patientLabs.map(lab => (
                  <div
                    key={lab.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {lab.testName}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {lab.date} • Referens: {lab.referenceRange}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-base text-slate-900 dark:text-white">
                        {lab.result} {lab.unit}
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          lab.status === 'normal'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {lab.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
                <span>{t('tabNotes')} ({patientNotes.length})</span>
              </h3>
              <button
                onClick={() => setActiveTab('notes')}
                className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline"
              >
                + {t('newMedicalNote')}
              </button>
            </div>

            {patientNotes.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Bemorga tegishli qaydlar yo'q</p>
            ) : (
              <div className="space-y-3">
                {patientNotes.map(n => (
                  <div
                    key={n.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</span>
                      <span className="text-xs text-slate-400">{n.createdAt.split('T')[0]}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {n.summary || n.chiefComplaint || n.rawText.slice(0, 160)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'apts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-600" />
                <span>{t('tabAppointments')} ({patientAppointments.length})</span>
              </h3>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline"
              >
                + {t('scheduleAppointment')}
              </button>
            </div>

            {patientAppointments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Rejalashtirilgan qabullar yo'q</p>
            ) : (
              <div className="space-y-3">
                {patientAppointments.map(a => (
                  <div
                    key={a.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">
                        {a.date} — {a.time} ({a.type})
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{a.notes}</div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-semibold">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
