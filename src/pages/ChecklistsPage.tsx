import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Checklist } from '../types';
import {
  ClipboardCheck,
  Plus,
  RotateCcw,
  CheckCircle2,
  Trash2,
  X,
  Sparkles,
  AlertCircle,
  Check,
  ListPlus,
  Stethoscope,
  Scissors,
  Activity,
  FileCheck,
} from 'lucide-react';

export const ChecklistsPage: React.FC = () => {
  const {
    t,
    checklists,
    toggleChecklistTask,
    addChecklistTask,
    deleteChecklistTask,
    resetChecklist,
    createChecklist,
    deleteChecklist,
    showToast,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Checklist['category']>('custom');
  const [newDescription, setNewDescription] = useState('');
  const [newTaskInput, setNewTaskInput] = useState('');
  const [initialTaskInputs, setInitialTaskInputs] = useState<string[]>(['', '', '']);

  // Inline task add input per checklist
  const [inlineTaskInputs, setInlineTaskInputs] = useState<Record<string, string>>({});

  const handleInlineTaskChange = (chkId: string, val: string) => {
    setInlineTaskInputs(prev => ({ ...prev, [chkId]: val }));
  };

  const handleInlineTaskAdd = (chkId: string) => {
    const val = inlineTaskInputs[chkId];
    if (val && val.trim()) {
      addChecklistTask(chkId, val.trim());
      setInlineTaskInputs(prev => ({ ...prev, [chkId]: '' }));
    }
  };

  const handleCreateChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createChecklist(newTitle, newCategory, newDescription, initialTaskInputs);
    setCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setInitialTaskInputs(['', '', '']);
  };

  const filteredChecklists = checklists.filter(c =>
    activeCategory === 'all' || c.category === activeCategory
  );

  const getCategoryIcon = (cat: Checklist['category']) => {
    switch (cat) {
      case 'consultation':
        return <Stethoscope className="w-4 h-4 text-sky-600" />;
      case 'pre-op':
        return <Scissors className="w-4 h-4 text-amber-600" />;
      case 'post-op':
        return <Activity className="w-4 h-4 text-emerald-600" />;
      case 'documentation':
        return <FileCheck className="w-4 h-4 text-indigo-600" />;
      default:
        return <ClipboardCheck className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <ClipboardCheck className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>{t('checklistsTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('checklistsSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-sky-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('createNewChecklist')}</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'Barchasi' },
          { id: 'consultation', label: 'Konsultatsiya' },
          { id: 'pre-op', label: 'Operatsiya Oldi (Pre-Op)' },
          { id: 'post-op', label: 'Muolajadan Keyin (Post-Op)' },
          { id: 'documentation', label: 'Hujjatlashtirish' },
          { id: 'custom', label: 'Shaxsiy' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Checklists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChecklists.map(checklist => {
          const completedCount = checklist.tasks.filter(t => t.completed).length;
          const totalCount = checklist.tasks.length;
          const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          const isAllDone = totalCount > 0 && completedCount === totalCount;

          return (
            <div
              key={checklist.id}
              className={`rounded-3xl border transition-all p-6 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between ${
                isAllDone
                  ? 'border-emerald-300 dark:border-emerald-800/80 shadow-emerald-500/5'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {getCategoryIcon(checklist.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                        {checklist.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {checklist.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => resetChecklist(checklist.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
                      title={t('resetChecklist')}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    {checklist.category === 'custom' && (
                      <button
                        onClick={() => deleteChecklist(checklist.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                        title={t('deleteChecklist')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-500 dark:text-slate-400">
                      {t('tasksProgress')}: {completedCount} / {totalCount}
                    </span>
                    <span
                      className={`font-bold ${
                        isAllDone
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-sky-600 dark:text-sky-400'
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isAllDone
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-sky-500 to-teal-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Tasks List */}
                <div className="mt-5 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {checklist.tasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm ${
                        task.completed
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 text-slate-500 dark:text-slate-400'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <button
                        onClick={() => toggleChecklistTask(checklist.id, task.id)}
                        className="flex items-center gap-3 text-left flex-1"
                      >
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span
                          className={`leading-relaxed ${
                            task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'font-medium'
                          }`}
                        >
                          {task.text}
                        </span>
                      </button>

                      <button
                        onClick={() => deleteChecklistTask(checklist.id, task.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                        title="Delete task"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Task Input */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={inlineTaskInputs[checklist.id] || ''}
                  onChange={e => handleInlineTaskChange(checklist.id, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleInlineTaskAdd(checklist.id);
                  }}
                  placeholder={t('addTaskPlaceholder')}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-sky-500"
                />
                <button
                  onClick={() => handleInlineTaskAdd(checklist.id)}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Qo'shish</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Checklist Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('createNewChecklist')}
                </h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateChecklist} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cheklist nomi *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Masalan: Teri biopsiyasi oldi cheklisti"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategoriya
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                >
                  <option value="consultation">Konsultatsiya</option>
                  <option value="pre-op">Operatsiya oldi (Pre-Op)</option>
                  <option value="post-op">Muolajadan keyin (Post-Op)</option>
                  <option value="documentation">Hujjatlashtirish</option>
                  <option value="custom">Shaxsiy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tavsif
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Protsedura maqsadi va qoidalari..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dastlabki vazifalar (bandlar)
                </label>
                <div className="space-y-2">
                  {initialTaskInputs.map((val, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={val}
                      onChange={e => {
                        const updated = [...initialTaskInputs];
                        updated[idx] = e.target.value;
                        setInitialTaskInputs(updated);
                      }}
                      placeholder={`Vazifa #${idx + 1}...`}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setInitialTaskInputs([...initialTaskInputs, ''])}
                    className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline"
                  >
                    + Yana band qo'shish
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
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
