import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Patient } from '../types';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  X,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';

export const PatientsPage: React.FC = () => {
  const {
    t,
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    viewPatientProfile,
    language,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterAllergiesOnly, setFilterAllergiesOnly] = useState(false);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('1990-01-01');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [allergies, setAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [notes, setNotes] = useState('');
  const [bloodType, setBloodType] = useState('A(II) Rh+');
  const [emergencyContact, setEmergencyContact] = useState('');

  const openAddModal = () => {
    setEditingPatient(null);
    setFullName('');
    setDob('1990-01-01');
    setGender('male');
    setPhone('+998 90 ');
    setEmail('');
    setAllergies('');
    setCurrentMedications('');
    setMedicalHistory('');
    setNotes('');
    setBloodType('A(II) Rh+');
    setEmergencyContact('');
    setModalOpen(true);
  };

  const openEditModal = (p: Patient) => {
    setEditingPatient(p);
    setFullName(p.fullName);
    setDob(p.dob);
    setGender(p.gender);
    setPhone(p.phone);
    setEmail(p.email);
    setAllergies(p.allergies);
    setCurrentMedications(p.currentMedications);
    setMedicalHistory(p.medicalHistory);
    setNotes(p.notes);
    setBloodType(p.bloodType || 'A(II) Rh+');
    setEmergencyContact(p.emergencyContact || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    if (editingPatient) {
      updatePatient(editingPatient.id, {
        fullName,
        dob,
        gender,
        phone,
        email,
        allergies: allergies || (language === 'uz' ? 'Allergiya aniqlanmagan' : 'No known allergies'),
        currentMedications,
        medicalHistory,
        notes,
        bloodType,
        emergencyContact,
      });
    } else {
      addPatient({
        fullName,
        dob,
        gender,
        phone,
        email,
        allergies: allergies || (language === 'uz' ? 'Allergiya aniqlanmagan' : 'No known allergies'),
        currentMedications,
        medicalHistory,
        notes,
        bloodType,
        emergencyContact,
      });
    }
    setModalOpen(false);
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.medicalHistory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = filterGender === 'all' || p.gender === filterGender;

    const matchesAllergy =
      !filterAllergiesOnly ||
      (p.allergies &&
        !p.allergies.toLowerCase().includes('yo\'q') &&
        !p.allergies.toLowerCase().includes('nkda') &&
        !p.allergies.toLowerCase().includes('aniqlanmagan') &&
        !p.allergies.toLowerCase().includes('нет'));

    return matchesSearch && matchesGender && matchesAllergy;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>{t('patientsManagement')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bemorlar profili, klinik tarixi, allergiya va doimiy preparatlar nazorati
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-sky-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewPatient')}</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('searchPatients')}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Gender Filter Buttons */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setFilterGender('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterGender === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t('filterAll')}
            </button>
            <button
              onClick={() => setFilterGender('male')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterGender === 'male'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t('filterMale')}
            </button>
            <button
              onClick={() => setFilterGender('female')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterGender === 'female'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t('filterFemale')}
            </button>
          </div>

          {/* Allergy filter toggle */}
          <button
            onClick={() => setFilterAllergiesOnly(!filterAllergiesOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              filterAllergiesOnly
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-700 dark:text-rose-300'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>{t('filterAllergies')}</span>
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                <th className="py-3.5 px-4">{t('fullName')}</th>
                <th className="py-3.5 px-4">{t('dob')}</th>
                <th className="py-3.5 px-4">{t('phone')}</th>
                <th className="py-3.5 px-4">{t('allergies')}</th>
                <th className="py-3.5 px-4">{t('currentMeds')}</th>
                <th className="py-3.5 px-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Bemorlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredPatients.map(p => {
                  const hasAllergy =
                    p.allergies &&
                    !p.allergies.toLowerCase().includes('yo\'q') &&
                    !p.allergies.toLowerCase().includes('nkda') &&
                    !p.allergies.toLowerCase().includes('aniqlanmagan');

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {p.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <button
                              onClick={() => viewPatientProfile(p.id)}
                              className="font-bold text-slate-900 dark:text-white hover:text-sky-600 transition-colors text-left"
                            >
                              {p.fullName}
                            </button>
                            <span className="block text-[11px] text-slate-400">
                              {p.gender === 'male' ? t('filterMale') : t('filterFemale')} • {p.bloodType || 'A(II)'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {p.dob}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {p.phone}
                      </td>

                      <td className="py-3.5 px-4">
                        {hasAllergy ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                            <AlertCircle className="w-3 h-3 text-rose-500" />
                            {p.allergies}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">
                            {t('noAllergiesKnown')}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {p.currentMedications || t('noMedications')}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => viewPatientProfile(p.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
                            title={t('viewProfile')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors"
                            title={t('editPatient')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                            title={t('deletePatient')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Patient Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingPatient ? t('editPatient') : t('addNewPatient')}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Bemorning to'liq ismi"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('dob')} *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('gender')}
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 outline-none"
                  >
                    <option value="male">{t('filterMale')}</option>
                    <option value="female">{t('filterFemale')}</option>
                    <option value="other">Boshqa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('bloodGroup')}
                  </label>
                  <input
                    type="text"
                    value={bloodType}
                    onChange={e => setBloodType(e.target.value)}
                    placeholder="A(II) Rh+, O(I), etc."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('phone')}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+998 90 123-45-67"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('allergies')} (Dori, oziq-ovqat yoki moddalar)
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  placeholder="Masalan: Penitsillin, Aspirin (yo'q bo'lsa bo'sh qoldiring)"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('currentMeds')}
                </label>
                <input
                  type="text"
                  value={currentMedications}
                  onChange={e => setCurrentMedications(e.target.value)}
                  placeholder="Masalan: Lisinopril 10mg, Metformin 500mg"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('medicalHistory')}
                </label>
                <textarea
                  rows={2}
                  value={medicalHistory}
                  onChange={e => setMedicalHistory(e.target.value)}
                  placeholder="Surunkali kasalliklar, o'tkazilgan operatsiyalar..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('notes')}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Shifokorning maxsus ko'rsatmalari..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 outline-none resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('confirmDeletePatientTitle')}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('confirmDeletePatientDesc')}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  deletePatient(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
