import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  X,
  Stethoscope,
  Calendar,
  AlertCircle,
  Check,
} from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const {
    t,
    appointments,
    patients,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    user,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState<string>('all'); // 'all', 'today', 'tomorrow', 'upcoming', 'completed'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);

  // Form Fields
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [patientName, setPatientName] = useState(patients[0]?.fullName || '');
  const [doctorName, setDoctorName] = useState(user?.name || 'Dr. Alisher Azimov');
  const [date, setDate] = useState('2026-09-28');
  const [time, setTime] = useState('10:00');
  const [type, setType] = useState<Appointment['type']>('consultation');
  const [status, setStatus] = useState<Appointment['status']>('confirmed');
  const [notes, setNotes] = useState('');

  const todayStr = '2026-09-28';
  const tomorrowStr = '2026-09-29';

  const openAddModal = () => {
    setEditingApt(null);
    setPatientId(patients[0]?.id || '');
    setPatientName(patients[0]?.fullName || '');
    setDoctorName(user?.name || 'Dr. Alisher Azimov');
    setDate('2026-09-28');
    setTime('10:00');
    setType('consultation');
    setStatus('confirmed');
    setNotes('');
    setModalOpen(true);
  };

  const openEditModal = (apt: Appointment) => {
    setEditingApt(apt);
    setPatientId(apt.patientId);
    setPatientName(apt.patientName);
    setDoctorName(apt.doctorName);
    setDate(apt.date);
    setTime(apt.time);
    setType(apt.type);
    setStatus(apt.status);
    setNotes(apt.notes);
    setModalOpen(true);
  };

  const handlePatientSelect = (pId: string) => {
    setPatientId(pId);
    const p = patients.find(item => item.id === pId);
    if (p) setPatientName(p.fullName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    if (editingApt) {
      updateAppointment(editingApt.id, {
        patientId,
        patientName,
        doctorName,
        date,
        time,
        type,
        status,
        notes,
      });
    } else {
      addAppointment({
        patientId,
        patientName,
        doctorName,
        date,
        time,
        type,
        status,
        notes,
      });
    }
    setModalOpen(false);
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.notes.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filterDate === 'today') matchesFilter = a.date === todayStr;
    else if (filterDate === 'tomorrow') matchesFilter = a.date === tomorrowStr;
    else if (filterDate === 'upcoming') matchesFilter = a.date >= todayStr && a.status !== 'completed' && a.status !== 'cancelled';
    else if (filterDate === 'completed') matchesFilter = a.status === 'completed';

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>{t('appointmentsTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('appointmentsSubtitle')}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-sky-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addAppointment')}</span>
        </button>
      </div>

      {/* Date Filters & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Bemor yoki shifokor bo'yicha qidiruv..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto text-xs">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'today', label: t('filterToday') },
            { id: 'tomorrow', label: t('filterTomorrow') },
            { id: 'upcoming', label: t('filterUpcoming') },
            { id: 'completed', label: t('filterCompleted') },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterDate(f.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterDate === f.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredAppointments.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs sm:text-sm">
              {t('noAppointmentsMatch')}
            </div>
          ) : (
            filteredAppointments.map(apt => {
              const isToday = apt.date === todayStr;

              return (
                <div
                  key={apt.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Left: Date, Time & Patient */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 font-bold text-xs ${
                        isToday
                          ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 mb-0.5" />
                      <span>{apt.time}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900 dark:text-white">
                          {apt.patientName}
                        </span>
                        {isToday && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                            BUGUN
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {apt.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                          {apt.doctorName}
                        </span>
                      </div>

                      {apt.notes && (
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                          {apt.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Badges & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      {/* Type Badge */}
                      <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {apt.type}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
                          apt.status === 'confirmed'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            : apt.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : apt.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {apt.status === 'confirmed'
                          ? t('statusConfirmed')
                          : apt.status === 'completed'
                          ? t('statusDone')
                          : apt.status === 'pending'
                          ? t('statusPending')
                          : t('statusCancelled')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {apt.status !== 'completed' && (
                        <button
                          onClick={() => updateAppointment(apt.id, { status: 'completed' })}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800"
                          title={t('markCompleted')}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {apt.status !== 'cancelled' && (
                        <button
                          onClick={() => cancelAppointment(apt.id)}
                          className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800"
                          title={t('cancelAppointment')}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(apt)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800"
                        title="Tahrirlash"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAppointment(apt.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Appointment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingApt ? 'Qabulni tahrirlash' : t('addAppointment')}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('patient')} *
                </label>
                <select
                  value={patientId}
                  onChange={e => handlePatientSelect(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('doctor')}
                </label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sana *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('time')} *
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('appointmentType')}
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                  >
                    <option value="consultation">{t('typeConsultation')}</option>
                    <option value="followup">{t('typeFollowup')}</option>
                    <option value="urgent">{t('typeUrgent')}</option>
                    <option value="routine">{t('typeRoutine')}</option>
                    <option value="procedure">{t('typeProcedure')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Holat
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                  >
                    <option value="confirmed">{t('statusConfirmed')}</option>
                    <option value="pending">{t('statusPending')}</option>
                    <option value="completed">{t('statusDone')}</option>
                    <option value="cancelled">{t('statusCancelled')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Izoh / Qabul maqsadi
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Masalan: Qon bosimi dinamikasini baholash"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
